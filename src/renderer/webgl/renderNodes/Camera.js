/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CameraEvents = require('../../../cameras/2d/events');
var GetColor32 = require('../../../display/color/GetColor32');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix.js');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var Equal = require('../../../math/fuzzy/Equal');
var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var RenderNode = require('./RenderNode');

function getAlphaTint (alpha)
{
    return Utils.getTintAppendFloatAlpha(0xffffff, alpha);
}

/**
 * @classdesc
 * A RenderNode responsible for executing the full rendering pipeline for a
 * single Phaser Camera. It orchestrates every stage of camera output: filling
 * the background color, rendering the list of visible children via the
 * ListCompositor, applying post-render effects (flash and fade), and then
 * compositing the result into the parent drawing context.
 *
 * When the camera requires isolation — because it has a non-opaque alpha,
 * active internal or external filter chains, or `forceComposite` is set —
 * the node allocates a temporary framebuffer from the drawing context pool and
 * renders into that instead of directly into the parent context. Internal
 * filters are applied to the camera contents before compositing, while
 * external filters expand the coverage area and are applied after the camera
 * output has been placed into the scene coordinate space. The final composited
 * image is then batched back to the parent context using the
 * BatchHandlerQuadSingle node, with the camera's alpha and pixel-rounding
 * settings respected.
 *
 * @class Camera
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var Camera = new Class({
    Extends: RenderNode,

    initialize: function Camera (manager)
    {
        RenderNode.call(this, 'Camera', manager);

        /**
         * The RenderNode that handles batching quads.
         * This is used when a camera is rendering to a framebuffer,
         * and the framebuffer needs to be drawn to the parent context.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#batchHandlerQuadSingleNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerQuad}
         * @since 4.0.0
         */
        this.batchHandlerQuadSingleNode = manager.getNode('BatchHandlerQuadSingle');

        /**
         * The RenderNode that handles filling the camera with a
         * flat color. This is used to render the camera background,
         * flash effects, and fade effects.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#fillCameraNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.FillCamera}
         * @since 4.0.0
         */
        this.fillCameraNode = manager.getNode('FillCamera');

        /**
         * The RenderNode that handles rendering lists of children.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#listCompositorNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.ListCompositor}
         * @since 4.0.0
         */
        this.listCompositorNode = manager.getNode('ListCompositor');

        /**
         * A temporary TransformMatrix used for the parent context
         * within which this camera is rendered.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Camera#_parentTransformMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.0.0
         */
        this._parentTransformMatrix = new TransformMatrix();
    },

    /**
     * Executes the full rendering pipeline for the given camera. This includes
     * drawing the camera background color, rendering all child Game Objects via
     * the ListCompositor, applying any post-render flash and fade effects, and
     * then compositing the result into the parent drawing context.
     *
     * If the camera requires a framebuffer (due to active filters, a non-opaque
     * alpha, or `forceComposite` being set), a temporary context is allocated
     * from the drawing context pool. Internal filters are applied to the camera
     * contents within that framebuffer, and external filters are applied after
     * the output has been transformed into scene space. The final image is
     * batched back to the parent context, with camera alpha and pixel-rounding
     * applied as appropriate.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.Camera#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.GameObject[]} children - The list of children to render.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current Camera.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - This transform matrix is defined if the camera is focused on a filtered object.
     * @param {boolean} [forceFramebuffer=false] - Should the camera always draw to a new framebuffer? This will also be activated if the camera has filters enabled.
     * @param {number} [renderStep=0] - Which step of the rendering process is this? This is the index of the currently running function in a list of functions.
     */
    run: function (
        drawingContext,
        children,
        camera,
        parentTransformMatrix,
        forceFramebuffer,
        renderStep
    )
    {
        this.onRunBegin(drawingContext);

        var currentContext;
        var drawingContextPool = drawingContext.renderer.drawingContextPool;
        var manager = this.manager;

        var alpha = camera.alpha;

        // Check if the camera has any active filters.
        var internalFilters = camera.filters.internal.getActive();
        var externalFilters = camera.filters.external.getActive();

        var useFramebuffers = forceFramebuffer || camera.forceComposite || internalFilters.length || externalFilters.length || alpha < 1;

        if (!parentTransformMatrix)
        {
            parentTransformMatrix = this._parentTransformMatrix.copyFrom(camera.matrixExternal);
        }
        else
        {
            camera.matrixExternal.multiply(parentTransformMatrix, parentTransformMatrix);
        }

        // Check whether the parentTransformMatrix is the identity matrix.
        var decomposedParent = parentTransformMatrix.decomposeMatrix();
        var parentIsIdentity =
            Equal(decomposedParent.translateX, 0) &&
            Equal(decomposedParent.translateY, 0) &&
            Equal(decomposedParent.rotation, 0) &&
            Equal(decomposedParent.scaleX, 1) &&
            Equal(decomposedParent.scaleY, 1);

        var cx = camera.x;
        var cy = camera.y;
        var cw = camera.width;
        var ch = camera.height;

        // Generate a drawing context.
        var baseContext = drawingContext.getClone();
        baseContext.setCamera(camera);

        if (useFramebuffers)
        {
            currentContext = drawingContextPool.get(cw, ch);
            currentContext.setCamera(camera);

            // Set the scissor to the camera dimensions.
            currentContext.setScissorBox(0, 0, cw, ch);
        }
        else
        {
            currentContext = baseContext;
            currentContext.setScissorBox(cx, cy, cw, ch);
        }

        // Enter drawing context.
        currentContext.use();

        var fillCamera = this.fillCameraNode;

        // Draw camera background.
        if (camera.backgroundColor.alphaGL > 0)
        {
            var bg = camera.backgroundColor;
            var col = GetColor32(bg.red, bg.green, bg.blue, bg.alpha);
            fillCamera.run(currentContext, col, useFramebuffers);
        }

        // Draw children.
        this.listCompositorNode.run(currentContext, children, null, renderStep);

        // Draw camera post effects.

        var flashEffect = camera.flashEffect;
        if (flashEffect.postRenderWebGL())
        {
            col = GetColor32(flashEffect.red, flashEffect.green, flashEffect.blue, flashEffect.alpha * 255);
            fillCamera.run(currentContext, col, useFramebuffers);
        }

        var fadeEffect = camera.fadeEffect;
        if (fadeEffect.postRenderWebGL())
        {
            col = GetColor32(fadeEffect.red, fadeEffect.green, fadeEffect.blue, fadeEffect.alpha * 255);
            fillCamera.run(currentContext, col, useFramebuffers);
        }

        // Finish rendering children.
        manager.finishBatch();


        // Filters and framebuffers.
        if (useFramebuffers)
        {
            var index, filter, padding, renderNode, tint;

            // Set up render options.
            var renderOptions = {
                smoothPixelArt: manager.renderer.game.config.smoothPixelArt
            };

            // Draw internal filters.
            var coverageInternal = new Rectangle(0, 0, currentContext.width, currentContext.height);
            for (index = 0; index < internalFilters.length; index++)
            {
                filter = internalFilters[index];

                // Execute the filter RenderNode.
                renderNode = manager.getNode(filter.renderNode);
                currentContext = renderNode.run(filter, currentContext);

                // Record padding.
                padding = filter.getPaddingCeil();
                coverageInternal.setTo(
                    coverageInternal.x + padding.x,
                    coverageInternal.y + padding.y,
                    coverageInternal.width + padding.width,
                    coverageInternal.height + padding.height
                );
            }
            var outputContext = currentContext;

            // Begin external filters.
            var drawExternalFilters = externalFilters.length > 0;
            var copyInternal = !drawExternalFilters;
            var coverageExternal = new Rectangle(0, 0, baseContext.width, baseContext.height);
            if (drawExternalFilters)
            {
                // Calculate coverage, starting from the final filter.
                for (index = externalFilters.length - 1; index >= 0; index--)
                {
                    filter = externalFilters[index];

                    if (!filter.active) { continue; }

                    padding = filter.getPaddingCeil();

                    // Increase coverage.
                    coverageExternal.setTo(
                        coverageExternal.x + padding.x,
                        coverageExternal.y + padding.y,
                        coverageExternal.width + padding.width,
                        coverageExternal.height + padding.height
                    );
                }

                // Will the texture need to be repositioned for the external filters?
                copyInternal =
                    coverageExternal.width !== currentContext.width ||
                    coverageExternal.height !== currentContext.height ||
                    !parentIsIdentity;

                if (copyInternal)
                {
                    // Create external context.
                    currentContext = drawingContextPool.get(coverageExternal.width, coverageExternal.height);
                    currentContext.setScissorBox(0, 0, coverageExternal.width, coverageExternal.height);
                    currentContext.setCamera(baseContext.camera);
                    currentContext.use();
                }
            }
            else
            {
                currentContext = baseContext;
            }

            if (copyInternal)
            {
                // Draw the framebuffer to the external context.
                // If there are no external filters, this will be the final draw.
                var externalX = coverageExternal.x;
                var externalY = coverageExternal.y;
                var quad;

                parentTransformMatrix.setQuad(
                    coverageInternal.x,
                    coverageInternal.y,
                    coverageInternal.x + coverageInternal.width,
                    coverageInternal.y + coverageInternal.height
                );
                quad = parentTransformMatrix.quad;

                tint = drawExternalFilters ? 0xffffffff : getAlphaTint(alpha);

                if (camera.roundPixels)
                {
                    // Assume that `roundPixels` conveys the intent to round coordinates.
                    // The `Filters` game object component sets this accordingly.
                    quad[0] = Math.round(quad[0]);
                    quad[1] = Math.round(quad[1]);
                    quad[2] = Math.round(quad[2]);
                    quad[3] = Math.round(quad[3]);
                    quad[4] = Math.round(quad[4]);
                    quad[5] = Math.round(quad[5]);
                    quad[6] = Math.round(quad[6]);
                    quad[7] = Math.round(quad[7]);
                }

                this.batchHandlerQuadSingleNode.batch(
                    currentContext,

                    // Texture.
                    // While this comes from a temporary framebuffer,
                    // and this is a batch operation,
                    // so the texture might not be accessed immediately,
                    // any operation that accesses the framebuffer pool
                    // will cause the batch to flush before the texture is reassigned.
                    outputContext.texture,

                    // Transformed quad in order TL, BL, TR, BR:
                    quad[0] - externalX, quad[1] - externalY,
                    quad[2] - externalX, quad[3] - externalY,
                    quad[6] - externalX, quad[7] - externalY,
                    quad[4] - externalX, quad[5] - externalY,

                    // Texture coordinates in X, Y, Width, Height:
                    0, 1, 1, -1,

                    // Tint color:
                    false,

                    // Tint colors in order TL, BL, TR, BR:
                    tint, tint, tint, tint,

                    // Render options:
                    renderOptions
                );
            }

            if (outputContext !== currentContext)
            {
                outputContext.release();
            }


            // Draw external filters.
            if (drawExternalFilters)
            {
                var skipDrawOut = false;
                outputContext = null;
                padding = new Rectangle();

                for (index = 0; index < externalFilters.length; index++)
                {
                    filter = externalFilters[index];

                    if (
                        // The filter supports drawing to the base context.
                        filter.allowBaseDraw &&

                        // The texture is the same size as the base context.
                        currentContext.width === baseContext.width &&
                        currentContext.height === baseContext.height &&

                        // Last filter.
                        index === externalFilters.length - 1 &&

                        // Alpha is 1.
                        alpha === 1
                    )
                    {
                        // Draw the final filter straight to the base context.
                        skipDrawOut = true;
                        outputContext = baseContext;
                    }

                    // Execute the filter RenderNode.
                    renderNode = manager.getNode(filter.renderNode);
                    currentContext = renderNode.run(filter, currentContext, outputContext, padding);

                    // Get and invert the padding for the next step.
                    padding = filter.currentPadding;

                    padding.x = -padding.x;
                    padding.y = -padding.y;
                    padding.width = -padding.width;
                    padding.height = -padding.height;
                }

                if (!skipDrawOut)
                {
                    // Draw external stack to parent context.
                    tint = getAlphaTint(alpha);

                    var x1 = -padding.x;
                    var y1 = -padding.y;
                    var x2 = currentContext.width + padding.right;
                    var y2 = currentContext.height + padding.bottom;

                    this.batchHandlerQuadSingleNode.batch(
                        baseContext,

                        // Texture.
                        currentContext.texture,

                        // Transformed quad in order TL, BL, TR, BR:
                        x1, y2,
                        x1, y1,
                        x2, y2,
                        x2, y1,

                        // Texture coordinates in X, Y, Width, Height:
                        0, 0, 1, 1,

                        // Tint color:
                        false,

                        // Tint colors in order TL, BL, TR, BR:
                        tint, tint, tint, tint,

                        // Render options:
                        renderOptions
                    );

                    currentContext.release();
                }
            }

        }

        camera.dirty = false;

        camera.emit(CameraEvents.POST_RENDER, camera);

        this.onRunEnd(drawingContext);
    }
});

module.exports = Camera;
