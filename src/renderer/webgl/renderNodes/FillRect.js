/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
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
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FillRect = new Class({
    Extends: RenderNode,

    initialize: function FillRect (manager)
    {
        RenderNode.call(this, 'FillRect', manager);

        /**
         * The RenderNode that handles the rendering of quads.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#batchHandler
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat}
         * @since 3.90.0
         */
        this.batchHandler = this.manager.getNode('BatchHandlerTriFlat');

        /**
         * An unchanging identity matrix.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillRect#_identityMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         */
        this._identityMatrix = new TransformMatrix();
    },

    /**
     * Render the rectangle.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillRect#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [currentMatrix] - A transform matrix to apply to the vertices. If not defined, the identity matrix is used.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    run: function (drawingContext, currentMatrix, x, y, width, height, tintTL, tintTR, tintBL, tintBR)
    {
        this.onRunBegin(drawingContext);

        if (!currentMatrix)
        {
            currentMatrix = this._identityMatrix;
        }

        var quad = currentMatrix.setQuad(x, y, x + width, y + height);

        this.batchHandler.batch(
            drawingContext,
            quad[0], quad[1],
            quad[2], quad[3],
            quad[4], quad[5],
            tintTL, tintBL, tintBR
        );

        this.batchHandler.batch(
            drawingContext,
            quad[4], quad[5],
            quad[6], quad[7],
            quad[0], quad[1],
            tintBR, tintTR, tintTL
        );

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillRect;
