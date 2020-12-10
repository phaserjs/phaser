/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/Graphics-frag.js');
var ShaderSourceVS = require('../shaders/Graphics-vert.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Graphics Pipeline is the rendering pipeline used by Phaser in WebGL when drawing
 * primitive geometry objects, such as the Graphics Game Object, or the Shape Game Objects
 * such as Arc, Line, Rectangle and Star. It handles the preperation and batching of related vertices.
 *
 * Prior to Phaser v3.50 the functions of this pipeline were merged with the `TextureTintPipeline`.
 *
 * The fragment shader it uses can be found in `shaders/src/Graphics.frag`.
 * The vertex shader it uses can be found in `shaders/src/Graphics.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2)
 * `inColor` (vec4, normalized)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 *
 * @class GraphicsPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var GraphicsPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function GraphicsPipeline (config)
    {
        config.fragShader = GetFastValue(config, 'fragShader', ShaderSourceFS);
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS);
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2
            },
            {
                name: 'inColor',
                size: 4,
                type: WEBGL_CONST.UNSIGNED_BYTE,
                normalized: true
            }
        ]);

        WebGLPipeline.call(this, config);

        /**
         * A temporary Transform Matrix, re-used internally during batching by the
         * Shape Game Objects.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.50.0
         */
        this.calcMatrix = new TransformMatrix();

        /**
         * Used internally to draw stroked triangles.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#tempTriangle
         * @type {array}
         * @private
         * @since 3.50.0
         */
        this.tempTriangle = [
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 }
        ];

        /**
         * Cached stroke tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#strokeTint
         * @type {object}
         * @private
         * @since 3.50.0
         */
        this.strokeTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Cached fill tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#fillTint
         * @type {object}
         * @private
         * @since 3.50.0
         */
        this.fillTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Internal texture frame reference.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#currentFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 3.50.0
         */
        this.currentFrame = { u0: 0, v0: 0, u1: 1, v1: 1 };

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#firstQuad
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.firstQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#prevQuad
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.prevQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Used internally for triangulating a polygon.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#polygonCache
         * @type {array}
         * @private
         * @since 3.50.0
         */
        this.polygonCache = [];
    },

    /**
     * Pushes a filled rectangle into the vertex batch.
     *
     * Rectangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchFillRect
     * @since 3.50.0
     *
     * @param {number} x - Horizontal top left coordinate of the rectangle.
     * @param {number} y - Vertical top left coordinate of the rectangle.
     * @param {number} width - Width of the rectangle.
     * @param {number} height - Height of the rectangle.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillRect: function (x, y, width, height, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var xw = x + width;
        var yh = y + height;

        var x0 = calcMatrix.getX(x, y);
        var y0 = calcMatrix.getY(x, y);

        var x1 = calcMatrix.getX(x, yh);
        var y1 = calcMatrix.getY(x, yh);

        var x2 = calcMatrix.getX(xw, yh);
        var y2 = calcMatrix.getY(xw, yh);

        var x3 = calcMatrix.getX(xw, y);
        var y3 = calcMatrix.getY(xw, y);

        var tint = this.fillTint;

        this.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, tint.TL, tint.TR, tint.BL, tint.BR);
    },

    /**
     * Pushes a filled triangle into the vertex batch.
     *
     * Triangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchFillTriangle
     * @since 3.50.0
     *
     * @param {number} x0 - Point 0 x coordinate.
     * @param {number} y0 - Point 0 y coordinate.
     * @param {number} x1 - Point 1 x coordinate.
     * @param {number} y1 - Point 1 y coordinate.
     * @param {number} x2 - Point 2 x coordinate.
     * @param {number} y2 - Point 2 y coordinate.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillTriangle: function (x0, y0, x1, y1, x2, y2, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var tx0 = calcMatrix.getX(x0, y0);
        var ty0 = calcMatrix.getY(x0, y0);

        var tx1 = calcMatrix.getX(x1, y1);
        var ty1 = calcMatrix.getY(x1, y1);

        var tx2 = calcMatrix.getX(x2, y2);
        var ty2 = calcMatrix.getY(x2, y2);

        var tint = this.fillTint;

        this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, tint.TL, tint.TR, tint.BL);
    },

    /**
     * Pushes a stroked triangle into the vertex batch.
     *
     * Triangle factors in the given transform matrices before adding to the batch.
     *
     * The triangle is created from 3 lines and drawn using the `batchStrokePath` method.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchStrokeTriangle
     * @since 3.50.0
     *
     * @param {number} x0 - Point 0 x coordinate.
     * @param {number} y0 - Point 0 y coordinate.
     * @param {number} x1 - Point 1 x coordinate.
     * @param {number} y1 - Point 1 y coordinate.
     * @param {number} x2 - Point 2 x coordinate.
     * @param {number} y2 - Point 2 y coordinate.
     * @param {number} lineWidth - The width of the line in pixels.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchStrokeTriangle: function (x0, y0, x1, y1, x2, y2, lineWidth, currentMatrix, parentMatrix)
    {
        var tempTriangle = this.tempTriangle;

        tempTriangle[0].x = x0;
        tempTriangle[0].y = y0;
        tempTriangle[0].width = lineWidth;

        tempTriangle[1].x = x1;
        tempTriangle[1].y = y1;
        tempTriangle[1].width = lineWidth;

        tempTriangle[2].x = x2;
        tempTriangle[2].y = y2;
        tempTriangle[2].width = lineWidth;

        tempTriangle[3].x = x0;
        tempTriangle[3].y = y0;
        tempTriangle[3].width = lineWidth;

        this.batchStrokePath(tempTriangle, lineWidth, false, currentMatrix, parentMatrix);
    },

    /**
     * Adds the given path to the vertex batch for rendering.
     *
     * It works by taking the array of path data and then passing it through Earcut, which
     * creates a list of polygons. Each polygon is then added to the batch.
     *
     * The path is always automatically closed because it's filled.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchFillPath
     * @since 3.50.0
     *
     * @param {Phaser.Types.Math.Vector2Like[]} path - Collection of points that represent the path.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillPath: function (path, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;

        var tintTL = this.fillTint.TL;
        var tintTR = this.fillTint.TR;
        var tintBL = this.fillTint.BL;

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
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

            var tx0 = calcMatrix.getX(x0, y0);
            var ty0 = calcMatrix.getY(x0, y0);

            var tx1 = calcMatrix.getX(x1, y1);
            var ty1 = calcMatrix.getY(x1, y1);

            var tx2 = calcMatrix.getX(x2, y2);
            var ty2 = calcMatrix.getY(x2, y2);

            this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, tintTL, tintTR, tintBL);
        }

        polygonCache.length = 0;
    },

    /**
     * Adds the given path to the vertex batch for rendering.
     *
     * It works by taking the array of path data and calling `batchLine` for each section
     * of the path.
     *
     * The path is optionally closed at the end.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchStrokePath
     * @since 3.50.0
     *
     * @param {Phaser.Types.Math.Vector2Like[]} path - Collection of points that represent the path.
     * @param {number} lineWidth - The width of the line segments in pixels.
     * @param {boolean} pathOpen - Indicates if the path should be closed or left open.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchStrokePath: function (path, lineWidth, pathOpen, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        //  Reset the closePath booleans
        this.prevQuad[4] = 0;
        this.firstQuad[4] = 0;

        var pathLength = path.length - 1;

        for (var pathIndex = 0; pathIndex < pathLength; pathIndex++)
        {
            var point0 = path[pathIndex];
            var point1 = path[pathIndex + 1];

            this.batchLine(
                point0.x,
                point0.y,
                point1.x,
                point1.y,
                point0.width / 2,
                point1.width / 2,
                lineWidth,
                pathIndex,
                !pathOpen && (pathIndex === pathLength - 1),
                currentMatrix,
                parentMatrix
            );
        }
    },

    /**
     * Creates a line out of 4 quads and adds it to the vertex batch based on the given line values.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchLine
     * @since 3.50.0
     *
     * @param {number} ax - x coordinate of the start of the line.
     * @param {number} ay - y coordinate of the start of the line.
     * @param {number} bx - x coordinate of the end of the line.
     * @param {number} by - y coordinate of the end of the line.
     * @param {number} aLineWidth - Width of the start of the line.
     * @param {number} bLineWidth - Width of the end of the line.
     * @param {number} index - If this line is part of a multi-line draw, the index of the line in the draw.
     * @param {boolean} closePath - Does this line close a multi-line path?
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchLine: function (ax, ay, bx, by, aLineWidth, bLineWidth, lineWidth, index, closePath, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var dx = bx - ax;
        var dy = by - ay;

        var len = Math.sqrt(dx * dx + dy * dy);
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

        //  tx0 = bottom right
        var brX = calcMatrix.getX(lx0, ly0);
        var brY = calcMatrix.getY(lx0, ly0);

        //  tx1 = bottom left
        var blX = calcMatrix.getX(lx1, ly1);
        var blY = calcMatrix.getY(lx1, ly1);

        //  tx2 = top right
        var trX = calcMatrix.getX(lx2, ly2);
        var trY = calcMatrix.getY(lx2, ly2);

        //  tx3 = top left
        var tlX = calcMatrix.getX(lx3, ly3);
        var tlY = calcMatrix.getY(lx3, ly3);

        var tint = this.strokeTint;

        var tintTL = tint.TL;
        var tintTR = tint.TR;
        var tintBL = tint.BL;
        var tintBR = tint.BR;

        //  TL, BL, BR, TR
        this.batchQuad(tlX, tlY, blX, blY, brX, brY, trX, trY, tintTL, tintTR, tintBL, tintBR);

        if (lineWidth <= 2)
        {
            //  No point doing a linejoin if the line isn't thick enough
            return;
        }

        var prev = this.prevQuad;
        var first = this.firstQuad;

        if (index > 0 && prev[4])
        {
            this.batchQuad(tlX, tlY, blX, blY, prev[0], prev[1], prev[2], prev[3], tintTL, tintTR, tintBL, tintBR);
        }
        else
        {
            first[0] = tlX;
            first[1] = tlY;
            first[2] = blX;
            first[3] = blY;
            first[4] = 1;
        }

        if (closePath && first[4])
        {
            //  Add a join for the final path segment
            this.batchQuad(brX, brY, trX, trY, first[0], first[1], first[2], first[3], tintTL, tintTR, tintBL, tintBR);
        }
        else
        {
            //  Store it

            prev[0] = brX;
            prev[1] = brY;
            prev[2] = trX;
            prev[3] = trY;
            prev[4] = 1;
        }
    },

    /**
     * Adds a single vertex to the current vertex buffer and increments the
     * `vertexCount` property by 1.
     *
     * This method is called directly by `batchTri` and `batchQuad`.
     *
     * It does not perform any batch limit checking itself, so if you need to call
     * this method directly, do so in the same way that `batchQuad` does, for example.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchVert
     * @since 3.50.0
     *
     * @param {number} x - The vertex x position.
     * @param {number} y - The vertex y position.
     * @param {number} tint - The tint color value.
     */
    batchVert: function (x, y, tint)
    {
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewU32[++vertexOffset] = tint;

        this.vertexCount++;
    },

    /**
     * Adds the vertices data into the batch and flushes if full.
     *
     * Assumes 6 vertices in the following arrangement:
     *
     * ```
     * 0----3
     * |\  B|
     * | \  |
     * |  \ |
     * | A \|
     * |    \
     * 1----2
     * ```
     *
     * Where tx0/ty0 = 0, tx1/ty1 = 1, tx2/ty2 = 2 and tx3/ty3 = 3
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchQuad
     * @override
     * @since 3.50.0
     *
     * @param {number} x0 - The top-left x position.
     * @param {number} y0 - The top-left y position.
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {number} tintBR - The bottom-right tint color value.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (x0, y0, x1, y1, x2, y2, x3, y3, tintTL, tintTR, tintBL, tintBR)
    {
        var hasFlushed = false;

        if (this.shouldFlush(6))
        {
            this.flush();

            hasFlushed = true;
        }

        this.batchVert(x0, y0, tintTL);
        this.batchVert(x1, y1, tintBL);
        this.batchVert(x2, y2, tintBR);
        this.batchVert(x0, y0, tintTL);
        this.batchVert(x2, y2, tintBR);
        this.batchVert(x3, y3, tintTR);

        return hasFlushed;
    },

    /**
     * Adds the vertices data into the batch and flushes if full.
     *
     * Assumes 3 vertices in the following arrangement:
     *
     * ```
     * 0
     * |\
     * | \
     * |  \
     * |   \
     * |    \
     * 1-----2
     * ```
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchTri
     * @override
     * @since 3.50.0
     *
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchTri: function (x0, y0, x1, y1, x2, y2, tintTL, tintTR, tintBL)
    {
        var hasFlushed = false;

        if (this.shouldFlush(3))
        {
            this.flush();

            hasFlushed = true;
        }

        this.batchVert(x0, y0, tintTL);
        this.batchVert(x1, y1, tintTR);
        this.batchVert(x2, y2, tintBL);

        return hasFlushed;
    },

    /**
     * Destroys all shader instances, removes all object references and nulls all external references.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#destroy
     * @since 3.50.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        WebGLPipeline.prototype.destroy.call(this);

        this.polygonCache = null;

        return this;
    }

});

module.exports = GraphicsPipeline;
