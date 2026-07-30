/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which computes the geometry of a line segment and expands it
 * into a quad suitable for WebGL rendering.
 *
 * A line segment has two endpoints (`a` and `b`) and can have a different
 * width at each end, allowing tapered lines. This node calculates the four
 * corner vertices of the quad that represents the line, by offsetting
 * perpendicular to the line direction by the respective half-widths at each
 * end. The resulting vertices are optionally transformed by a matrix and
 * appended to a flat vertex list.
 *
 * This node is used internally by the WebGL renderer when drawing stroked
 * paths, such as those produced by Graphics Game Objects.
 *
 * @class DrawLine
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var DrawLine = new Class({
    Extends: RenderNode,

    initialize: function DrawLine (manager)
    {
        RenderNode.call(this, 'DrawLine', manager);
    },

    /**
     * Computes the four vertices of the quad that represents a line segment
     * and appends them to the provided `vertices` list. The line can vary in
     * width between its start point (`a`) and end point (`b`), producing a
     * tapered shape. Eight values are appended (four x/y pairs) in the order
     * TL, BL, BR, TR, relative to the line's direction.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.DrawLine#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {?Phaser.GameObjects.Components.TransformMatrix} currentMatrix - A transform matrix to apply to the vertices. If not defined, the vertices are not transformed.
     * @param {number} ax - The x coordinate of the start of the line.
     * @param {number} ay - The y coordinate of the start of the line.
     * @param {number} bx - The x coordinate of the end of the line.
     * @param {number} by - The y coordinate of the end of the line.
     * @param {number} aLineWidth - The width of the line at the start.
     * @param {number} bLineWidth - The width of the line at the end.
     * @param {number[]} vertices - The list to which the vertices are assigned.
     */
    run: function (drawingContext, currentMatrix, ax, ay, bx, by, aLineWidth, bLineWidth, vertices)
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

        var offset = vertices.length;

        if (currentMatrix)
        {
            vertices[offset + 0] = currentMatrix.getX(lx3, ly3);
            vertices[offset + 1] = currentMatrix.getY(lx3, ly3);
            vertices[offset + 2] = currentMatrix.getX(lx1, ly1);
            vertices[offset + 3] = currentMatrix.getY(lx1, ly1);
            vertices[offset + 4] = currentMatrix.getX(lx0, ly0);
            vertices[offset + 5] = currentMatrix.getY(lx0, ly0);
            vertices[offset + 6] = currentMatrix.getX(lx2, ly2);
            vertices[offset + 7] = currentMatrix.getY(lx2, ly2);
        }
        else
        {
            vertices[offset + 0] = lx3;
            vertices[offset + 1] = ly3;
            vertices[offset + 2] = lx1;
            vertices[offset + 3] = ly1;
            vertices[offset + 4] = lx0;
            vertices[offset + 5] = ly0;
            vertices[offset + 6] = lx2;
            vertices[offset + 7] = ly2;
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = DrawLine;
