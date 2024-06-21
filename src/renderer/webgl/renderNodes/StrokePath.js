/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a stroke path consisting of several line segments,
 * potentially closed at the end.
 *
 * @class StrokePath
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var StrokePath = new Class({
    Extends: RenderNode,

    initialize: function StrokePath (manager)
    {
        RenderNode.call(this, 'StrokePath', manager);

        /**
         * The RenderNode that draws a line segment.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.StrokePath#drawLineNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.DrawLine}
         * @since 3.90.0
         */
        this.drawLineNode = this.manager.getNode('DrawLine');
    },

    /**
     * Render a stroke path consisting of several line segments.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.StrokePath#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {{ x: number, y: number, width: number }[]} path - The points that define the line segments.
     * @param {number} lineWidth - The width of the stroke.
     * @param {boolean} open - Whether the stroke is open or closed.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform matrix.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    run: function (drawingContext, path, lineWidth, open, currentMatrix, tintTL, tintTR, tintBL, tintBR)
    {
        this.onRunBegin(drawingContext);

        var drawLineNode = this.drawLineNode;

        var pathLength = path.length - 1;

        var pathIndex, point, nextPoint;

        if (pathLength === 1)
        {
            // Only one point, draw a single line
            point = path[0];
            nextPoint = path[1];

            drawLineNode.run(
                drawingContext,
                currentMatrix,
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
                point.width / 2,
                nextPoint.width / 2,
                lineWidth,
                tintTL,
                tintTR,
                tintBL,
                tintBR,
                drawLineNode.SINGLE
            );
        }
        else if (pathLength > 1)
        {
            point = path[0];
            nextPoint = path[1];

            drawLineNode.run(
                drawingContext,
                currentMatrix,
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
                point.width / 2,
                nextPoint.width / 2,
                lineWidth,
                tintTL,
                tintTR,
                tintBL,
                tintBR,
                drawLineNode.FIRST
            );

            for (pathIndex = 1; pathIndex < pathLength - 1; pathIndex++)
            {
                point = path[pathIndex];
                nextPoint = path[pathIndex + 1];

                drawLineNode.run(
                    drawingContext,
                    currentMatrix,
                    point.x,
                    point.y,
                    nextPoint.x,
                    nextPoint.y,
                    point.width / 2,
                    nextPoint.width / 2,
                    lineWidth,
                    tintTL,
                    tintTR,
                    tintBL,
                    tintBR
                );
            }

            point = path[pathLength - 1];
            nextPoint = path[pathLength];

            drawLineNode.run(
                drawingContext,
                currentMatrix,
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
                point.width / 2,
                nextPoint.width / 2,
                lineWidth,
                tintTL,
                tintTR,
                tintBL,
                tintBR,
                open ? undefined : drawLineNode.LAST
            );
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = StrokePath;
