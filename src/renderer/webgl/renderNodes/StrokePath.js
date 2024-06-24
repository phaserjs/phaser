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
         * The RenderNode that generates a line segment.
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
     * @param {Phaser.Renderer.WebGL.RenderNodes.SubmitterGraphics} submitterNode - The Submitter node to use.
     * @param {{ x: number, y: number, width: number }[]} path - The points that define the line segments.
     * @param {number} lineWidth - The width of the stroke.
     * @param {boolean} open - Whether the stroke is open or closed.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform matrix.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} tintBR - The bottom-right tint color.
     */
    run: function (drawingContext, submitterNode, path, lineWidth, open, currentMatrix, tintTL, tintTR, tintBL, tintBR)
    {
        this.onRunBegin(drawingContext);

        var drawLineNode = this.drawLineNode;

        var pathLength = path.length - 1;

        var point, nextPoint;

        // Determine size of index array.
        var indexCount = pathLength * 6;
        var connect = false;
        var connectLoop = false;

        if (lineWidth > 2 && pathLength > 1)
        {
            connect = true;

            // Lines will be connected by a secondary quad.
            indexCount *= 2;
            if (open)
            {
                // The last line will not be connected to the first line.
                indexCount -= 6;
            }
            else
            {
                connectLoop = true;
            }
        }
        var indices = Array(indexCount);
        var indexOffset = 0;

        var vertices = Array(pathLength * 4 * 5);
        var vertexOffset = 0;

        for (var i = 0; i < pathLength; i++)
        {
            point = path[i];
            nextPoint = path[i + 1];

            drawLineNode.run(
                drawingContext,
                currentMatrix,
                point.x,
                point.y,
                nextPoint.x,
                nextPoint.y,
                point.width / 2,
                nextPoint.width / 2
            );

            var quad = drawLineNode.quad;

            vertices[vertexOffset++] = quad.xTL;
            vertices[vertexOffset++] = quad.yTL;
            vertices[vertexOffset++] = tintTL;
            vertices[vertexOffset++] = -1;
            vertices[vertexOffset++] = -1;

            vertices[vertexOffset++] = quad.xBL;
            vertices[vertexOffset++] = quad.yBL;
            vertices[vertexOffset++] = tintBL;
            vertices[vertexOffset++] = -1;
            vertices[vertexOffset++] = -1;

            vertices[vertexOffset++] = quad.xBR;
            vertices[vertexOffset++] = quad.yBR;
            vertices[vertexOffset++] = tintBR;
            vertices[vertexOffset++] = -1;
            vertices[vertexOffset++] = -1;

            vertices[vertexOffset++] = quad.xTR;
            vertices[vertexOffset++] = quad.yTR;
            vertices[vertexOffset++] = tintTR;
            vertices[vertexOffset++] = -1;
            vertices[vertexOffset++] = -1;

            // Draw two triangles.
            // The vertices are in the order: TL, BL, BR, TR
            indices[indexOffset++] = i * 4;
            indices[indexOffset++] = i * 4 + 1;
            indices[indexOffset++] = i * 4 + 2;
            indices[indexOffset++] = i * 4 + 2;
            indices[indexOffset++] = i * 4 + 3;
            indices[indexOffset++] = i * 4;

            if (connect && i !== 0)
            {
                // Draw a quad connecting to the previous line segment.
                // The vertices are in the order:
                // - TL
                // - BL
                // - Previous BR
                // - Previous TR
                indices[indexOffset++] = i * 4;
                indices[indexOffset++] = i * 4 + 1;
                indices[indexOffset++] = i * 4 - 2;
                indices[indexOffset++] = i * 4 - 2;
                indices[indexOffset++] = i * 4 - 1;
                indices[indexOffset++] = i * 4;

                if (connectLoop && i === pathLength - 1)
                {
                    // Connect the last line segment to the first.
                    // The vertices are in the order:
                    // - BR
                    // - TR
                    // - First TL
                    // - First BL
                    indices[indexOffset++] = i * 4 + 2;
                    indices[indexOffset++] = i * 4 + 3;
                    indices[indexOffset++] = 0;
                    indices[indexOffset++] = 0;
                    indices[indexOffset++] = 1;
                    indices[indexOffset++] = i * 4 + 2;
                }
            }
        }

        submitterNode.batch(drawingContext, indices, vertices);

        this.onRunEnd(drawingContext);
    }
});

module.exports = StrokePath;
