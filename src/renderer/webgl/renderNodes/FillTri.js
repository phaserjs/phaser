/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a filled triangle.
 *
 * @class FillTri
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FillTri = new Class({
    Extends: RenderNode,

    initialize: function FillTri (manager)
    {
        RenderNode.call(this, 'FillTri', manager);

        /**
         * Vertex indices for the triangle.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillTri#_indexedTriangles
         * @type {number[]}
         * @private
         * @since 4.0.0
         * @default [0, 1, 2]
         * @readonly
         */
        this._indexedTriangles = [
            0, 1, 2
        ];
    },

    /**
     * Render the triangle.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillTri#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {?Phaser.GameObjects.Components.TransformMatrix} currentMatrix - A transform matrix to apply to the vertices. If not defined, the vertices are not transformed.
     * @param {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat} submitterNode - The Submitter node to use.
     * @param {number} xA - The x-coordinate of the first vertex.
     * @param {number} yA - The y-coordinate of the first vertex.
     * @param {number} xB - The x-coordinate of the second vertex.
     * @param {number} yB - The y-coordinate of the second vertex.
     * @param {number} xC - The x-coordinate of the third vertex.
     * @param {number} yC - The y-coordinate of the third vertex.
     * @param {number} tintA - The tint color of the first vertex.
     * @param {number} tintB - The tint color of the second vertex.
     * @param {number} tintC - The tint color of the third vertex.
     * @param {boolean} lighting - Whether to apply lighting effects to the triangle.
     */
    run: function (drawingContext, currentMatrix, submitterNode, xA, yA, xB, yB, xC, yC, tintA, tintB, tintC, lighting)
    {
        this.onRunBegin(drawingContext);

        if (currentMatrix)
        {
            submitterNode.batch(
                drawingContext,
                this._indexedTriangles,
                [
                    currentMatrix.getX(xA, yA),
                    currentMatrix.getY(xA, yA),
                    currentMatrix.getX(xB, yB),
                    currentMatrix.getY(xB, yB),
                    currentMatrix.getX(xC, yC),
                    currentMatrix.getY(xC, yC)
                ],
                [
                    tintA,
                    tintB,
                    tintC
                ],
                lighting
            );
        }
        else
        {
            submitterNode.batch(
                drawingContext,
                this._indexedTriangles,
                [
                    xA,
                    yA,
                    xB,
                    yB,
                    xC,
                    yC
                ],
                [
                    tintA,
                    tintB,
                    tintC
                ],
                lighting
            );
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillTri;
