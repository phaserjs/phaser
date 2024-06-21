/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a filled triangle.
 * This is useful for arbitrary geometry.
 * This does not use textures, and is intended to form part of a larger batch.
 *
 * @class FillTri
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FillTri = new Class({
    Extends: RenderNode,

    initialize: function FillTri (manager)
    {
        RenderNode.call(this, 'FillTri', manager);

        /**
         * The BatchHandlerQuad that handles the rendering of quads.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillTri#batchHandler
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat}
         * @since 3.90.0
         */
        this.batchHandler = this.manager.getNode('BatchHandlerTriFlat');
    },

    /**
     * Render the triangle.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillTri#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [currentMatrix] - A transform matrix to apply to the vertices. If not defined, the vertices are not transformed.
     */
    run: function (drawingContext, currentMatrix, xA, yA, xB, yB, xC, yC, tintA, tintB, tintC)
    {
        this.onRunBegin(drawingContext);

        var txA, tyA, txB, tyB, txC, tyC;

        if (currentMatrix)
        {
            txA = currentMatrix.getX(xA, yA);
            tyA = currentMatrix.getY(xA, yA);
            txB = currentMatrix.getX(xB, yB);
            tyB = currentMatrix.getY(xB, yB);
            txC = currentMatrix.getX(xC, yC);
            tyC = currentMatrix.getY(xC, yC);
        }
        else
        {
            txA = xA;
            tyA = yA;
            txB = xB;
            tyB = yB;
            txC = xC;
            tyC = yC;
        }

        this.batchHandler.batch(
            drawingContext,

            txA, tyA,
            txB, tyB,
            txC, tyC,

            tintA, tintB, tintC
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillTri;
