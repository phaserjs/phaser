/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Earcut = require('../../../geom/polygon/Earcut');
var Class = require('../../../utils/Class');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * A RenderNode which fills a path.
 *
 * It works by taking the array of path data and then passing it through
 * Earcut, which creates a list of polygons.
 * Each polygon is then added to the batch.
 * The polygons are triangles, but they're rendered as quads
 * to be compatible with other batched quads.
 *
 * @class FillPath
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 3.90.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var FillPath = new Class({
    Extends: RenderNode,

    initialize: function FillPath (manager)
    {
        RenderNode.call(this, 'FillPath', manager);
    },

    /**
     * Render the path using Earcut.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillPath#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform matrix.
     * @param {Phaser.Renderer.WebGL.RenderNodes.SubmitterGraphics} submitterNode - The Submitter node to use.
     * @param {{ x: number, y: number, width: number }[]} path - The points that define the line segments.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     * @param {number} detail - The level of detail to use when filling the path. Points which are only this far apart in screen space are combined. It is ignored if the entire path is equal to or shorter than this distance.
     */
    run: function (drawingContext, currentMatrix, submitterNode, path, tintTL, tintTR, tintBL, detail)
    {
        this.onRunBegin(drawingContext);

        if (detail === undefined) { detail = 0; }

        var length = path.length;
        var index, pathIndex, point, polygonIndexArray, x, y;

        var polygonCacheIndex = 0;
        var verticesIndex = 0;
        var indexedTrianglesIndex = 0;

        var polygonCache = [];
        var vertices = [];

        for (pathIndex = 0; pathIndex < length; pathIndex++)
        {
            point = path[pathIndex];

            // Transform the point.
            x = currentMatrix.getX(point.x, point.y);
            y = currentMatrix.getY(point.x, point.y);

            if (
                pathIndex > 0 &&
                pathIndex < length - 1 &&
                Math.abs(x - polygonCache[polygonCacheIndex - 2]) <= detail &&
                Math.abs(y - polygonCache[polygonCacheIndex - 1]) <= detail
            )
            {
                // Skip this point if it's too close to the previous point
                // and is not the first or last point in the path.
                continue;
            }

            polygonCache[polygonCacheIndex++] = x;
            polygonCache[polygonCacheIndex++] = y;
        }

        polygonIndexArray = Earcut(polygonCache);

        if (tintTL === tintTR && tintTL === tintBL)
        {
            // If the tint colors are all the same,
            // then we can share vertices between the triangles.

            var polygonCacheLength = polygonCache.length;

            for (index = 0; index < polygonCacheLength; index += 2)
            {
                vertices[verticesIndex++] = polygonCache[index];
                vertices[verticesIndex++] = polygonCache[index + 1];
                vertices[verticesIndex++] = tintTL;
                vertices[verticesIndex++] = -1;
                vertices[verticesIndex++] = -1;
            }

            // for (pathIndex = 0; pathIndex < length; pathIndex++)
            // {
            //     point = path[pathIndex];

            //     // Transform the point.
            //     x = currentMatrix.getX(point.x, point.y);
            //     y = currentMatrix.getY(point.x, point.y);

            //     if (
            //         pathIndex > 0 &&
            //         pathIndex < length - 1 &&
            //         Math.abs(x - polygonCache[polygonCacheIndex - 2]) <= detail &&
            //         Math.abs(y - polygonCache[polygonCacheIndex - 1]) <= detail
            //     )
            //     {
            //         // Skip this point if it's too close to the previous point
            //         // and is not the first or last point in the path.
            //         continue;
            //     }

            //     polygonCache[polygonCacheIndex++] = x;
            //     polygonCache[polygonCacheIndex++] = y;
            //     vertices[verticesIndex++] = x;
            //     vertices[verticesIndex++] = y;
            //     vertices[verticesIndex++] = tintTL;
            //     vertices[verticesIndex++] = -1;
            //     vertices[verticesIndex++] = -1;
            // }

            // polygonIndexArray = Earcut(polygonCache);

            submitterNode.batch(drawingContext, polygonIndexArray, vertices);
        }
        else
        {
            // If the tint colors are different,
            // then we need to create a new vertex for each triangle.


            // for (pathIndex = 0; pathIndex < length; pathIndex++)
            // {
            //     point = path[pathIndex];

            //     // Transform the point.
            //     x = currentMatrix.getX(point.x, point.y);
            //     y = currentMatrix.getY(point.x, point.y);

            //     if (
            //         pathIndex > 0 &&
            //         pathIndex < length - 1 &&
            //         Math.abs(x - polygonCache[polygonCacheIndex - 2]) <= detail &&
            //         Math.abs(y - polygonCache[polygonCacheIndex - 1]) <= detail
            //     )
            //     {
            //         // Skip this point if it's too close to the previous point
            //         // and is not the first or last point in the path.
            //         continue;
            //     }

            //     polygonCache[polygonCacheIndex++] = x;
            //     polygonCache[polygonCacheIndex++] = y;
            // }

            // polygonIndexArray = Earcut(polygonCache);
            var indexLength = polygonIndexArray.length;

            var indexedTriangles = Array(indexLength);

            for (index = 0; index < indexLength; index += 3)
            {
                // Vertex A
                var p = polygonIndexArray[index] * 2;
                x = polygonCache[p + 0];
                y = polygonCache[p + 1];

                vertices[verticesIndex++] = x;
                vertices[verticesIndex++] = y;
                vertices[verticesIndex++] = tintTL;
                vertices[verticesIndex++] = -1;
                vertices[verticesIndex++] = -1;

                // Vertex B
                p = polygonIndexArray[index + 1] * 2;
                x = polygonCache[p + 0];
                y = polygonCache[p + 1];

                vertices[verticesIndex++] = x;
                vertices[verticesIndex++] = y;
                vertices[verticesIndex++] = tintTR;
                vertices[verticesIndex++] = -1;
                vertices[verticesIndex++] = -1;

                // Vertex C
                p = polygonIndexArray[index + 2] * 2;
                x = polygonCache[p + 0];
                y = polygonCache[p + 1];

                vertices[verticesIndex++] = x;
                vertices[verticesIndex++] = y;
                vertices[verticesIndex++] = tintBL;
                vertices[verticesIndex++] = -1;
                vertices[verticesIndex++] = -1;

                // Add new indices for the triangle.
                indexedTriangles[indexedTrianglesIndex++] = index + 0;
                indexedTriangles[indexedTrianglesIndex++] = index + 1;
                indexedTriangles[indexedTrianglesIndex++] = index + 2;
            }

            submitterNode.batch(drawingContext, indexedTriangles, vertices);
        }

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillPath;
