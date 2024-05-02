/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var RenderNode = require('./RenderNode');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * A RenderNode which computes a StandardBatchRenderQuad (SBR-Quad) from an
 * Image-like GameObject.
 *
 * @class ImageQuadrangulateBatch
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this RenderNode.
 */
var ImageQuadrangulateBatch = new Class({
    Extends: RenderNode,

    initialize: function ImageQuadrangulateBatch (manager, renderer)
    {
        RenderNode.call(this, 'ImageQuadrangulateBatch', manager, renderer);
    },

    /**
     * Render the GameObject.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.ImageQuadrangulateBatch#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Image} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     */
    run: function (drawingContext, gameObject, parentMatrix)
    {
        var frame = gameObject.frame;

        var uvSource = frame;
        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;
            uvSource = crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                gameObject.frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }
        }
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;
        var cameraAlpha = drawingContext.camera.alpha;

        var tintTL = getTint(gameObject.tintTopLeft, cameraAlpha * gameObject._alphaTL);
        var tintTR = getTint(gameObject.tintTopRight, cameraAlpha * gameObject._alphaTR);
        var tintBL = getTint(gameObject.tintBottomLeft, cameraAlpha * gameObject._alphaBL);
        var tintBR = getTint(gameObject.tintBottomRight, cameraAlpha * gameObject._alphaBR);

        // Render with separate matrices.

        var matrices = this.manager.nodes.GetSBRQuadMatrices.run(gameObject, drawingContext.camera, parentMatrix);

        // Use `frame.source.glTexture` instead of `frame.glTexture` to avoid
        // unnecessary getter function calls.

        this.manager.nodes.BatchTexturedTintedRawQuads.batch(
            drawingContext,
            frame.source.glTexture,
            gameObject.tintFill,
            matrices.objectMatrix,
            matrices.worldMatrix,
            matrices.camMatrix,

            // Texture coordinates in X, Y, Width, Height:
            u0, v0, u1 - u0, v1 - v0,

            // Tint colors in TRIANGLE_STRIP order:
            tintTL, tintTR, tintBL, tintBR
        );

        return;
    }
});

module.exports = ImageQuadrangulateBatch;
