/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a filled rectangle.
 * This is useful for full-screen effects and rectangle geometry.
 *
 * @class FillRect
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FillRect = new Class({
    Extends: RenderNode,

    initialize: function FillRect (manager)
    {
        RenderNode.call(this, 'FillRect', manager);

        /**
         * The fallback batch handler for this node.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#_batchHandlerDefault
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat}
         * @since 4.0.0
         * @private
         * @readonly
         */
        this._batchHandlerDefault = manager.getNode('BatchHandlerTriFlat');

        /**
         * An unchanging identity matrix.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#_identityMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.0.0
         */
        this._identityMatrix = new TransformMatrix();

        /**
         * Vertex indices for the rectangle.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#_indexedTriangles
         * @type {number[]}
         * @private
         * @since 4.0.0
         * @default [0, 1, 2, 2, 3, 0]
         * @readonly
         */
        this._indexedTriangles = [
            0, 1, 2,
            2, 3, 0
        ];
    },

    /**
     * Render the rectangle.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillRect#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {?Phaser.GameObjects.Components.TransformMatrix} currentMatrix - A transform matrix to apply to the vertices. If not defined, the identity matrix is used.
     * @param {?Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat} submitterNode - The Submitter node to use. If not defined, `BatchHandlerTriFlat` is used.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     * @param {boolean} lighting - Whether to apply lighting effects to the rectangle.
     */
    run: function (drawingContext, currentMatrix, submitterNode, x, y, width, height, tintTL, tintTR, tintBL, tintBR, lighting)
    {
        this.onRunBegin(drawingContext);

        if (!currentMatrix)
        {
            currentMatrix = this._identityMatrix;
        }

        if (!submitterNode)
        {
            submitterNode = this._batchHandlerDefault;
        }

        var quad = currentMatrix.setQuad(x, y, x + width, y + height);

        submitterNode.batch(
            drawingContext,
            this._indexedTriangles,
            quad,
            [
                tintTL, tintBL, tintBR, tintTR
            ],
            lighting
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillRect;
