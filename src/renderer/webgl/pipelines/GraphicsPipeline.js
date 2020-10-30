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
 *
 * The Graphics Pipeline is the rendering pipeline used by Phaser in WebGL when drawing
 * geometry data, such as the Graphics and Shape Game Objects, like Arc, Line, Rectangle,
 * etc. It handles the preperation and batching of related tris.
 *
 * Prior to Phaser v3.50 this pipeline was called the `TextureTintPipeline`.
 *
 * In previous versions of Phaser only one single texture unit was supported at any one time.
 * The Multi Pipeline is an evolution of the old Texture Tint Pipeline, updated to support
 * multi-textures for increased performance.
 *
 * The fragment shader it uses can be found in `shaders/src/Graphics.frag`.
 * The vertex shader it uses can be found in `shaders/src/Graphics.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 * `inTexId` (float, offset 16) - this value is always zero in the Graphics Pipeline
 * `inTintEffect` (float, offset 20)
 * `inTint` (vec4, offset 24, normalized)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uViewMatrix` (mat4)
 * `uModelMatrix` (mat4)
 * `uMainSampler` (sampler2D array)
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
                size: 2,
                type: WEBGL_CONST.FLOAT
            },
            {
                name: 'inTexCoord',
                size: 2,
                type: WEBGL_CONST.FLOAT
            },
            {
                name: 'inTexId',
                size: 1,
                type: WEBGL_CONST.FLOAT
            },
            {
                name: 'inTintEffect',
                size: 1,
                type: WEBGL_CONST.FLOAT
            },
            {
                name: 'inTint',
                size: 4,
                type: WEBGL_CONST.UNSIGNED_BYTE,
                normalized: true
            }
        ]);
        config.uniforms = GetFastValue(config, 'uniforms', [
            'uProjectionMatrix',
            'uMainSampler'
        ]);
        config.forceZero = true;

        WebGLPipeline.call(this, config);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix4 = new TransformMatrix();

        /**
         * Used internally to draw stroked triangles.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#tempTriangle
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.tempTriangle = [
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 }
        ];

        /**
         * The tint effect to be applied by the shader in the next geometry draw:
         *
         * 0 = texture multiplied by color
         * 1 = solid color + texture alpha
         * 2 = solid color, no texture
         * 3 = solid texture, no color
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#tintEffect
         * @type {number}
         * @private
         * @since 3.12.0
         */
        this.tintEffect = 2;

        /**
         * Cached stroke tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#strokeTint
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this.strokeTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Cached fill tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#fillTint
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this.fillTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Internal texture frame reference.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#currentFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 3.12.0
         */
        this.currentFrame = { u0: 0, v0: 0, u1: 1, v1: 1 };

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#firstQuad
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.firstQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#prevQuad
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.prevQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Used internally for triangulating a polygon.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#polygonCache
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.polygonCache = [];
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        this.set1i('uMainSampler', 0);
    },

    /**
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#bind
     * @since 3.50.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     *
     * @return {this} This WebGLPipeline instance.
    bind: function (reset)
    {
        if (reset === undefined) { reset = false; }

        WebGLPipeline.prototype.bind.call(this, reset);

        this.currentShader.set1iv('uMainSampler', this.renderer.textureIndexes);

        return this;
    },
     */

    /**
     * Assigns a texture to the current batch. If a different texture is already set it creates a new batch object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#setTexture2D
     * @since 3.1.0
     *
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch. If not given uses blankTexture.
     *
     * @return {number} The assigned texture unit.
     */
    setTexture2D: function (texture)
    {
        if (texture === undefined) { texture = this.renderer.whiteTexture.glTexture; }

        this.currentUnit = this.renderer.setTexture2D(texture);

        return this.currentUnit;
    },

    /**
     * Pushes a filled rectangle into the vertex batch.
     * Rectangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchFillRect
     * @since 3.12.0
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

        var calcMatrix = this._tempMatrix3;

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

        var frame = this.currentFrame;

        var tint = this.fillTint;

        this.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, frame.u0, frame.v0, frame.u1, frame.v1, tint.TL, tint.TR, tint.BL, tint.BR, this.tintEffect);
    },

    /**
     * Pushes a filled triangle into the vertex batch.
     * Triangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchFillTriangle
     * @since 3.12.0
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

        var calcMatrix = this._tempMatrix3;

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

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        var tint = this.fillTint;

        this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, u0, v0, u1, v1, tint.TL, tint.TR, tint.BL, this.tintEffect);
    },

    /**
     * Pushes a stroked triangle into the vertex batch.
     * Triangle factors in the given transform matrices before adding to the batch.
     * The triangle is created from 3 lines and drawn using the `batchStrokePath` method.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchStrokeTriangle
     * @since 3.12.0
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
     * @since 3.12.0
     *
     * @param {array} path - Collection of points that represent the path.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillPath: function (path, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this._tempMatrix3;

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
        var tintEffect = this.tintEffect;

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }

        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

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

            this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintEffect);
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
     * @since 3.12.0
     *
     * @param {array} path - Collection of points that represent the path.
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
     * Assumes a texture has already been set, prior to calling this function.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.GraphicsPipeline#batchLine
     * @since 3.12.0
     *
     * @param {number} ax - X coordinate to the start of the line
     * @param {number} ay - Y coordinate to the start of the line
     * @param {number} bx - X coordinate to the end of the line
     * @param {number} by - Y coordinate to the end of the line
     * @param {number} aLineWidth - Width of the start of the line
     * @param {number} bLineWidth - Width of the end of the line
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchLine: function (ax, ay, bx, by, aLineWidth, bLineWidth, lineWidth, index, closePath, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this._tempMatrix3;

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
        var tintEffect = this.tintEffect;

        var tintTL = tint.TL;
        var tintTR = tint.TR;
        var tintBL = tint.BL;
        var tintBR = tint.BR;

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        //  TL, BL, BR, TR
        this.batchQuad(tlX, tlY, blX, blY, brX, brY, trX, trY, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);

        if (lineWidth <= 2)
        {
            //  No point doing a linejoin if the line isn't thick enough
            return;
        }

        var prev = this.prevQuad;
        var first = this.firstQuad;

        if (index > 0 && prev[4])
        {
            this.batchQuad(tlX, tlY, blX, blY, prev[0], prev[1], prev[2], prev[3], u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
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
            this.batchQuad(brX, brY, trX, trY, first[0], first[1], first[2], first[3], u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
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
    }

});

module.exports = GraphicsPipeline;
