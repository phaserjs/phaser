/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Utils = require('../Utils.js');
var RenderNode = require('./RenderNode');

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

    run: function (drawingContext, gameObject, camera, parentMatrix)
    {
        var frame = gameObject.frame;

        var uvSource = gameObject.isCropped ? gameObject._crop : frame;
        var u0 = uvSource.u0;
        var v0 = uvSource.v0;
        var u1 = uvSource.u1;
        var v1 = uvSource.v1;

        var tintTL = Utils.getTintAppendFloatAlpha(gameObject.tintTopLeft, camera.alpha * gameObject._alphaTL);
        var tintTR = Utils.getTintAppendFloatAlpha(gameObject.tintTopRight, camera.alpha * gameObject._alphaTR);
        var tintBL = Utils.getTintAppendFloatAlpha(gameObject.tintBottomLeft, camera.alpha * gameObject._alphaBL);
        var tintBR = Utils.getTintAppendFloatAlpha(gameObject.tintBottomRight, camera.alpha * gameObject._alphaBR);

        // Render with matrix

        var matrix = this.manager.nodes.GetQuadTransform.run(gameObject, camera, parentMatrix);

        this.manager.nodes.BatchTexturedTintedRawQuads.batch(
            drawingContext,
            camera,
            frame,
            gameObject.tintFill,
            matrix.matrix,

            // Texture coordinates in X, Y, Width, Height:
            u0, v0, u1 - u0, v1 - v0,

            // Tint colors in TRIANGLE_STRIP order:
            tintTL, tintTR, tintBL, tintBR
        );

        // // Render with separate matrices.

        // var matrices = this.manager.nodes.GetSBRQuadMatrices.run(gameObject, camera, parentMatrix);

        // this.manager.nodes.BatchTexturedTintedRawQuads.batch(
        //     drawingContext,
        //     camera,
        //     frame,
        //     gameObject.tintFill,
        //     matrices.objectMatrix,
        //     matrices.worldMatrix,
        //     matrices.camMatrix,

        //     // Texture coordinates in X, Y, Width, Height:
        //     u0, v0, u1 - u0, v1 - v0,

        //     // Tint colors in TRIANGLE_STRIP order:
        //     tintTL, tintTR, tintBL, tintBR
        // );

        return;
    }
});

module.exports = ImageQuadrangulateBatch;
