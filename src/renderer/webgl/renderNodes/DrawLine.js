/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a line segment.
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
         * The render node that handles the rendering of triangles.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#batchHandler
         * @type {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat}
         * @since 3.90.0
         */
        this.batchHandler = this.manager.getNode('BatchHandlerTriFlat');

        /**
         * The top and bottom vertices of the start of the first line in a loop.
         *
         * These values have been pre-transformed to save on redundant calculations.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#start
         * @type {number[]}
         * @since 3.90.0
         */
        this.start = [ 0, 0, 0, 0 ];

        /**
         * The top and bottom vertices of the end of the last line in a loop.
         *
         * These values have been pre-transformed to save on redundant calculations.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#previous
         * @type {number[]}
         * @since 3.90.0
         */
        this.previous = [ 0, 0, 0, 0 ];
    },

    /**
     * Constant that defines the first line in a loop.
     * If the line is not open, this is cached,
     * and will join to the last line in the loop.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#FIRST
     * @type {number}
     * @const
     * @since 3.90.0
     * @default 1
     * @readonly
     */
    FIRST: 1,

    /**
     * Constant that defines the last line in a loop.
     * This joins to the previous line in the loop.
     * If the line is not open, this also joins to the first line in the loop.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#LAST
     * @type {number}
     * @const
     * @since 3.90.0
     * @default 2
     * @readonly
     */
    LAST: 2,

    /**
     * Constant that defines a single line with no joins.
     *
     * @name Phaser.Renderer.WebGL.RenderNodes.DrawLine#SINGLE
     * @type {number}
     * @const
     * @since 3.90.0
     * @default 3
     * @readonly
     */
    SINGLE: 3,

    /**
     * Render a line segment as a quad.
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
     * @param {number} lineWidth - The width of the line.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     * @param {this.FIRST|this.LAST|this.SINGLE} [connection] - The connection type. If omitted, the line start joins to the previous line.
     */
    run: function (drawingContext, currentMatrix, ax, ay, bx, by, aLineWidth, bLineWidth, lineWidth, tintTL, tintTR, tintBL, tintBR, connection)
    {
        this.onRunBegin(drawingContext);

        var dx = bx - ax;
        var dy = by - ay;

        var len = Math.sqrt(dx * dx + dy * dy);

        if (len === 0)
        {
            // Because we cannot (and should not) divide by zero!
            return;
        }

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

        var brX, brY, blX, blY, trX, trY, tlX, tlY;

        if (currentMatrix)
        {
            // Bottom right
            brX = currentMatrix.getX(lx0, ly0);
            brY = currentMatrix.getY(lx0, ly0);

            // Bottom left
            blX = currentMatrix.getX(lx1, ly1);
            blY = currentMatrix.getY(lx1, ly1);

            // Top right
            trX = currentMatrix.getX(lx2, ly2);
            trY = currentMatrix.getY(lx2, ly2);

            // Top left
            tlX = currentMatrix.getX(lx3, ly3);
            tlY = currentMatrix.getY(lx3, ly3);
        }
        else
        {
            brX = lx0;
            brY = ly0;
            blX = lx1;
            blY = ly1;
            trX = lx2;
            trY = ly2;
            tlX = lx3;
            tlY = ly3;
        }

        // Draw the line
        this.batchHandler.batch(
            drawingContext,
            tlX, tlY,
            blX, blY,
            brX, brY,
            tintTL, tintBL, tintBR
        );
        this.batchHandler.batch(
            drawingContext,
            brX, brY,
            trX, trY,
            tlX, tlY,
            tintBR, tintTR, tintTL
        );

        if (connection !== this.SINGLE)
        {
            var start = this.start;
            var previous = this.previous;

            if (connection === this.FIRST)
            {
                start[0] = tlX;
                start[1] = tlY;
                start[2] = blX;
                start[3] = blY;
            }
            else if (lineWidth > 2)
            {
                // No point doing a linejoin if the line isn't thick enough

                // Connect to previous line
                this.batchHandler.batch(
                    drawingContext,
                    tlX, tlY,
                    blX, blY,
                    previous[2], previous[3],
                    tintTL, tintBL, tintBR
                );
                this.batchHandler.batch(
                    drawingContext,
                    previous[2], previous[3],
                    previous[0], previous[1],
                    tlX, tlY,
                    tintBR, tintTR, tintTL
                );
    
                if (connection === this.LAST)
                {
                    // Connect to first line
                    this.batchHandler.batch(
                        drawingContext,
                        brX, brY,
                        trX, trY,
                        start[0], start[1],
                        tintTL, tintBL, tintBR
                    );
                    this.batchHandler.batch(
                        drawingContext,
                        start[0], start[1],
                        start[2], start[3],
                        brX, brY,
                        tintBR, tintTR, tintTL
                    );
                }
            }

            if (connection !== this.LAST)
            {
                previous[0] = trX;
                previous[1] = trY;
                previous[2] = brX;
                previous[3] = brY;
            }
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = DrawLine;
