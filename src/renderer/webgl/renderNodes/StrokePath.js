/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which renders a stroke path as a series of connected line
 * segments, optionally closing the path by connecting the last segment back
 * to the first. It is used by the WebGL renderer to draw stroked shapes, such
 * as those created by the Graphics Game Object. Each segment is rendered as a
 * quad (two triangles), and adjacent segments are joined with an additional
 * connecting quad when the stroke width exceeds two pixels. A level-of-detail
 * mechanism allows intermediate points that are too close together in screen
 * space to be skipped, reducing overdraw on dense paths.
 *
 * @class StrokePath
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var StrokePath = new Class({
    Extends: RenderNode,

    initialize: function StrokePath (manager)
    {
        RenderNode.call(this, 'StrokePath', manager);

        /**
         * The RenderNode that generates a line segment.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.StrokePath#drawLineNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.DrawLine}
         * @since 4.0.0
         */
        this.drawLineNode = this.manager.getNode('DrawLine');
    },

    /**
     * Render a stroke path consisting of several line segments.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.StrokePath#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.Renderer.WebGL.RenderNodes.BatchHandlerTriFlat} submitterNode - The Submitter node to use.
     * @param {Phaser.Types.GameObjects.Graphics.WidePoint[]} path - The points that define the line segments.
     * @param {number} lineWidth - The width of the stroke.
     * @param {boolean} open - If `true`, the path is open and the last segment will not be connected back to the first. If `false`, the path is closed and a connecting quad is drawn between the last and first segments.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform matrix.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     * @param {number} detail - The minimum distance, in screen-space pixels, between consecutive path points. Any intermediate point closer than this distance to the current point is skipped, reducing overdraw on dense paths. The final point of each segment is always preserved. Set to `0` to disable LOD and render every point.
     * @param {boolean} lighting - Whether to apply lighting effects to the stroke.
     */
    run: function (drawingContext, submitterNode, path, lineWidth, open, currentMatrix, tintTL, tintTR, tintBL, tintBR, detail, lighting)
    {
        this.onRunBegin(drawingContext);

        var drawLineNode = this.drawLineNode;

        var pathLength = path.length - 1;

        var point, nextPoint;

        // Determine connectivity of index array.
        var connect = false;
        var connectLoop = false;

        if (lineWidth > 2 && pathLength > 1)
        {
            // Lines will be connected by a secondary quad.
            connect = true;
            if (!open)
            {
                // The last line will be connected to the first line.
                connectLoop = true;
            }
        }

        var indices = [];
        var indexOffset = 0;

        var vertices = [];
        var vertexOffset = 0;
        var vertexCount;

        var colors = [];
        var colorOffset = 0;

        var dx, dy, tdx, tdy;
        var detailSquared = detail * detail;

        var first, last, iterate;

        for (var i = 0; i < pathLength; i += iterate)
        {
            first = i === 0;
            last = i === pathLength - 1;
            iterate = 1;

            point = path[i];
            nextPoint = path[i + iterate];

            if (detailSquared && !last)
            {
                dx = nextPoint.x - point.x;
                dy = nextPoint.y - point.y;
                tdx = currentMatrix.getX(dx, dy) - currentMatrix.tx;
                tdy = currentMatrix.getY(dx, dy) - currentMatrix.ty;
                while (
                    i + iterate < pathLength - 1 &&
                    tdx * tdx + tdy * tdy <= detailSquared
                )
                {
                    // Skip the next point if it's too close to the current point.
                    iterate++;
                    nextPoint = path[i + iterate];
                    dx = nextPoint.x - point.x;
                    dy = nextPoint.y - point.y;
                    tdx = currentMatrix.getX(dx, dy) - currentMatrix.tx;
                    tdy = currentMatrix.getY(dx, dy) - currentMatrix.ty;
                }
            }

            // Compute and add the vertices for the line segment.
            drawLineNode.run(
                drawingContext,
                currentMatrix,
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
                point.width / 2,
                nextPoint.width / 2,
                vertices
            );

            // The previous operation added 4 vertices.
            vertexOffset += 8;

            vertexCount = vertexOffset / 2;

            colors[colorOffset++] = tintTL;
            colors[colorOffset++] = tintBL;
            colors[colorOffset++] = tintBR;
            colors[colorOffset++] = tintTR;

            // Draw two triangles.
            // The vertices are in the order: TL, BL, BR, TR
            indices[indexOffset++] = vertexCount - 4;
            indices[indexOffset++] = vertexCount - 3;
            indices[indexOffset++] = vertexCount - 2;
            indices[indexOffset++] = vertexCount - 2;
            indices[indexOffset++] = vertexCount - 1;
            indices[indexOffset++] = vertexCount - 4;

            if (connect && !first)
            {
                // Draw a quad connecting to the previous line segment.
                // The vertices are in the order:
                // - TL
                // - BL
                // - Previous BR
                // - Previous TR
                indices[indexOffset++] = vertexCount - 4;
                indices[indexOffset++] = vertexCount - 3;
                indices[indexOffset++] = vertexCount - 6;
                indices[indexOffset++] = vertexCount - 6;
                indices[indexOffset++] = vertexCount - 5;
                indices[indexOffset++] = vertexCount - 4;

                if (connectLoop && last)
                {
                    // Connect the last line segment to the first.
                    // The vertices are in the order:
                    // - BR
                    // - TR
                    // - First TL
                    // - First BL
                    indices[indexOffset++] = vertexCount - 2;
                    indices[indexOffset++] = vertexCount - 1;
                    indices[indexOffset++] = 0;
                    indices[indexOffset++] = 0;
                    indices[indexOffset++] = 1;
                    indices[indexOffset++] = vertexCount - 2;
                }
            }
        }

        submitterNode.batch(drawingContext, indices, vertices, colors, lighting);

        this.onRunEnd(drawingContext);
    }
});

module.exports = StrokePath;
