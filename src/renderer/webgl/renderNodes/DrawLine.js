/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which computes the geometry of a line segment.
 *
 * @class DrawLine
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var DrawLine = new Class({
    Extends: RenderNode,

    initialize: function DrawLine (manager)
    {
        RenderNode.call(this, 'DrawLine', manager);

        /**
         * The vertices of the line segment as a quad.
         * These values have been transformed.
         * They should be used before the next call to `run`,
         * whereupon they will be overridden.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#quad
         * @type {{ xTL: number, yTL: number, xTR: number, yTR: number, xBL: number, yBL: number, xBR: number, yBR: number }}
         * @since 3.90.0
         */
        this.quad = {
            xTL: 0,
            yTL: 0,
            xTR: 0,
            yTR: 0,
            xBL: 0,
            yBL: 0,
            xBR: 0,
            yBR: 0
        };
    },

    /**
     * Get the transformed vertices of a line segment as a quad.
     * The values are stored in the `quad` property.
     * Access the values directly or copy them to another object,
     * before the next call to `run`, whereupon they will be overridden.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.DrawLine#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [currentMatrix] - A transform matrix to apply to the vertices. If not defined, the vertices are not transformed.
     * @param {number} ax - The x coordinate of the start of the line.
     * @param {number} ay - The y coordinate of the start of the line.
     * @param {number} bx - The x coordinate of the end of the line.
     * @param {number} by - The y coordinate of the end of the line.
     * @param {number} aLineWidth - The width of the line at the start.
     * @param {number} bLineWidth - The width of the line at the end.
     */
    run: function (drawingContext, currentMatrix, ax, ay, bx, by, aLineWidth, bLineWidth)
    {
        this.onRunBegin(drawingContext);

        var dx = bx - ax;
        var dy = by - ay;

        var len = Math.sqrt(dx * dx + dy * dy);

        // A well-formed path has no zero length segments, so we don't check.

        var al0 = aLineWidth * (by - ay) / len;
        var al1 = aLineWidth * (ax - bx) / len;
        var bl0 = bLineWidth * (by - ay) / len;
        var bl1 = bLineWidth * (ax - bx) / len;

        var lx0 = bx - bl0;
        var ly0 = by - bl1;
        var lx1 = ax - al0;
        var ly1 = ay - al1;
        var lx2 = bx + bl0;
        var ly2 = by + bl1;
        var lx3 = ax + al0;
        var ly3 = ay + al1;

        var quad = this.quad;

        if (currentMatrix)
        {
            quad.xTL = currentMatrix.getX(lx3, ly3);
            quad.yTL = currentMatrix.getY(lx3, ly3);
            quad.xBL = currentMatrix.getX(lx1, ly1);
            quad.yBL = currentMatrix.getY(lx1, ly1);
            quad.xTR = currentMatrix.getX(lx2, ly2);
            quad.yTR = currentMatrix.getY(lx2, ly2);
            quad.xBR = currentMatrix.getX(lx0, ly0);
            quad.yBR = currentMatrix.getY(lx0, ly0);
        }
        else
        {
            quad.xTL = lx3;
            quad.yTL = ly3;
            quad.xBL = lx1;
            quad.yBL = ly1;
            quad.xTR = lx2;
            quad.yTR = ly2;
            quad.xBR = lx0;
            quad.yBR = ly0;
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = DrawLine;
