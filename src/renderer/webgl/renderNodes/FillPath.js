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
        
        /**
         * The RenderNode used to render polygons.
         * By default, we use `FillTri`.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillPath#polygonNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.FillTri}
         * @since 3.90.0
         */
        this.polygonNode = this.manager.getNode('FillTri');

        /**
         * Used internally for triangulating a polygon.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.FillPath#polygonCache
         * @type {number[]}
         * @since 3.90.0
         */
        this.polygonCache = [];
    },

    /**
     * Render the path using Earcut.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.FillPath#run
     * @since 3.90.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The context currently in use.
     * @param {{ x: number, y: number, width: number }[]} path - The points that define the line segments.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform matrix.
     * @param {number} tintTL - The top-left tint color.
     * @param {number} tintTR - The top-right tint color.
     * @param {number} tintBL - The bottom-left tint color.
     */
    run: function (drawingContext, path, currentMatrix, tintTL, tintTR, tintBL)
    {
        this.onRunBegin(drawingContext);

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;

        for (var pathIndex = 0; pathIndex < length; pathIndex++)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }

        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        for (var index = 0; index < length; index += 3)
        {
            var p0 = polygonIndexArray[index + 0] * 2;
            var p1 = polygonIndexArray[index + 1] * 2;
            var p2 = polygonIndexArray[index + 2] * 2;

            var x0 = polygonCache[p0 + 0];
            var y0 = polygonCache[p0 + 1];
            var x1 = polygonCache[p1 + 0];
            var y1 = polygonCache[p1 + 1];
            var x2 = polygonCache[p2 + 0];
            var y2 = polygonCache[p2 + 1];

            this.polygonNode.run(
                drawingContext,
                currentMatrix,
                x0, y0,
                x1, y1,
                x2, y2,
                tintTL, tintTR, tintBL
            );
        }

        polygonCache.length = 0;

        this.onRunEnd(drawingContext);
    }
});

module.exports = FillPath;
