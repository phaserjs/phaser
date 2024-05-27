/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var RenderNode = require('./RenderNode');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * A RenderNode which computes a StandardBatchRenderQuad (SBR-Quad) from an
 * Image-like GameObject.
 *
 * This node computes the vertices and texture properties of a single quad.
 * The quad is then batched with other quads to be rendered together at some
 * later point in the render sequence.
 * This is useful for rendering many similar objects at once.
 *
 * This RenderNode is configurable. Most of the time, this involves setting
 * the `config.batchHandler` property to a custom batch handler configuration.
 * The batch handler contains the vertex buffer layout and shaders used to
 * render the batched items.
 *
 * The default batch handler is `QuadBatchHandler`. It is set up to handle
 * Standard Batch Render Quads (SBR-Quads) as the parameters of its `batch`
 * method. These define a quad with a texture reference, texture
 * coordinates as a box, vertex coordinates for each corner,
 * tint colors for each corner, and a tint fill value. SBR-Quads are
 * the default, efficient way to render images and sprites.
 *
 * If you want to render something that doesn't fit the SBR-Quad format,
 * you will need to customize more than just the batch handler.
 * Configure a new `run` method to invoke your custom batch handler
 * with the correct parameters.
 *
 * @class GameObjectBatcher
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.RenderNodes.GameObjectBatcherConfig} [config] - The configuration object for this RenderNode.
 */
var GameObjectBatcher = new Class({
    Extends: RenderNode,

    initialize: function GameObjectBatcher (manager, renderer, config)
    {
        if (config === undefined) { config = {}; }

        var name = config.name || 'GameObjectBatcher';

        RenderNode.call(this, name, manager, renderer);

        var batchHandler = 'QuadBatchHandler';
        if (config.batchHandler)
        {
            var batchHandlerIsConfig = typeof config.batchHandler === 'object';
            batchHandler = batchHandlerIsConfig ? config.batchHandler.name : config.batchHandler;
            if (batchHandlerIsConfig && !manager.hasNode(batchHandler))
            {
                manager.addNodeConstructor(batchHandler, config.batchHandler);
            }
        }

        /**
         * The batch handler used to render the quads.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.GameObjectBatcher#batchHandler
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandler}
         * @since 3.90.0
         */
        this.batchHandler = manager.getNode(batchHandler);

        /**
         * The matrix used internally to compute camera transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_camMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._camMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.Single#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.90.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();
    },

    /**
     * Render the GameObject.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.GameObjectBatcher#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Image} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     */
    run: function (drawingContext, gameObject, parentMatrix)
    {
        var frame = gameObject.frame;
        var frameX = frame.x;
        var frameY = frame.y;
        var frameWidth = frame.cutWidth;
        var frameHeight = frame.cutHeight;
        var customPivot = frame.customPivot;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        // Get UVs.
        var uvSource = frame;
        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;
            uvSource = crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }

            // Modify the frame dimensions based on the crop.
            frameWidth = crop.width;
            frameHeight = crop.height;

            frameX = crop.x;
            frameY = crop.y;
        }
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;
        var cameraAlpha = drawingContext.camera.alpha;

        // Get tints.
        var tintTL = getTint(gameObject.tintTopLeft, cameraAlpha * gameObject._alphaTL);
        var tintTR = getTint(gameObject.tintTopRight, cameraAlpha * gameObject._alphaTR);
        var tintBL = getTint(gameObject.tintBottomLeft, cameraAlpha * gameObject._alphaBL);
        var tintBR = getTint(gameObject.tintBottomRight, cameraAlpha * gameObject._alphaBR);

        // Get the transformed quad.
        var x = -displayOriginX + frameX;
        var y = -displayOriginY + frameY;

        var flipX = 1;
        var flipY = 1;

        if (gameObject.flipX)
        {
            if (!customPivot)
            {
                x += (-frame.realWidth + (displayOriginX * 2));
            }

            flipX = -1;
        }

        if (gameObject.flipY)
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        var gx = gameObject.x;
        var gy = gameObject.y;

        var camera = drawingContext.camera;
        var calcMatrix = this._calcMatrix;
        var camMatrix = this._camMatrix;
        var spriteMatrix = this._spriteMatrix;

        spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        if (parentMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.copyFrom(camera.matrix);
            camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = gx;
            spriteMatrix.f = gy;
        }
        else
        {
            // camMatrix will not be mutated after this point, so we just take a reference.
            camMatrix = camera.matrix;
            spriteMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * gameObject.scrollFactorY;
        }

        // Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        var quad = calcMatrix.setQuad(x, y, x + frameWidth, y + frameHeight);

        this.batchHandler.batch(
            drawingContext,

            // Use `frame.source.glTexture` instead of `frame.glTexture`
            // to avoid unnecessary getter function calls.
            frame.source.glTexture,

            // Transformed quad in TRIANGLE_STRIP order:
            quad[0], quad[1],
            quad[2], quad[3],
            quad[6], quad[7],
            quad[4], quad[5],
            
            // Texture coordinates in X, Y, Width, Height:
            u0, v0, u1 - u0, v1 - v0,

            gameObject.tintFill,

            // Tint colors in TRIANGLE_STRIP order:
            tintTL, tintTR, tintBL, tintBR
        );

        return;
    }
});

module.exports = GameObjectBatcher;
