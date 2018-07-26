/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Commands = require('../../../gameobjects/graphics/Commands');
var Earcut = require('../../../geom/polygon/Earcut');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ModelViewProjection = require('./components/ModelViewProjection');
var ShaderSourceFS = require('../shaders/TextureTint-frag.js');
var ShaderSourceVS = require('../shaders/TextureTint-vert.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Utils = require('../Utils');
var WebGLPipeline = require('../WebGLPipeline');

//  TODO: Remove the use of this
var Point = function (x, y, width)
{
    this.x = x;
    this.y = y;
    this.width = width;
};

//  TODO: Remove the use of this
var Path = function (x, y, width)
{
    this.points = [];
    this.pointsLength = 1;
    this.points[0] = new Point(x, y, width);
};

var matrixStack = [];

/**
 * @classdesc
 * The FlatTintPipeline is used for rendering flat colored shapes. 
 * Mostly used by the Graphics game object.
 * The config properties are:
 * - game: Current game instance.
 * - renderer: Current WebGL renderer.
 * - topology: This indicates how the primitives are rendered. The default value is GL_TRIANGLES.
 *              Here is the full list of rendering primitives (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * - vertShader: Source for vertex shader as a string.
 * - fragShader: Source for fragment shader as a string.
 * - vertexCapacity: The amount of vertices that shall be allocated
 * - vertexSize: The size of a single vertex in bytes.
 *
 * @class FlatTintPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - Used for overriding shader an pipeline properties if extending this pipeline.
 */
var FlatTintPipeline = new Class({

    Extends: WebGLPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function FlatTintPipeline (config)
    {
        var rendererConfig = config.renderer.config;

        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: GetFastValue(config, 'topology', config.renderer.gl.TRIANGLES),
            vertShader: GetFastValue(config, 'vertShader', ShaderSourceVS),
            fragShader: GetFastValue(config, 'fragShader', ShaderSourceFS),
            vertexCapacity: GetFastValue(config, 'vertexCapacity', 6 * rendererConfig.batchSize),
            vertexSize: GetFastValue(config, 'vertexSize', Float32Array.BYTES_PER_ELEMENT * 5 + Uint8Array.BYTES_PER_ELEMENT * 4),
            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: 0
                },
                {
                    name: 'inTexCoord',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
                },
                {
                    name: 'inTintEffect',
                    size: 1,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 4
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: config.renderer.gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 5
                }
            ]
        });

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * Uint32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32 = new Uint32Array(this.vertexData);

        /**
         * Used internally to draw triangles
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#tempTriangle
         * @type {array}
         * @since 3.0.0
         */
        this.tempTriangle = [
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 }
        ];

        //  0 = texture multiplied by color
        //  1 = solid color + texture alpha
        //  2 = solid color, no texture
        //  3 = solid texture, no color
        this.tintEffect = 2;

        this.strokeTint;
        this.fillTint;

        //  Set during Renderer boot
        this.currentFrame = null;

        // this.tintTL = 0;
        // this.tintTR = 0;
        // this.tintBL = 0;
        // this.tintBR = 0;

        this.firstQuad = [ 0, 0, 0, 0 ];

        this.prevQuad = [ 0, 0, 0, 0 ];

        /**
         * Used internally for triangulating a polygon
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#polygonCache
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.polygonCache = [];

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.12.0
         */
        this._tempMatrix4 = new TransformMatrix();

        this.mvpInit();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline} [description]
     */
    onBind: function ()
    {
        WebGLPipeline.prototype.onBind.call(this);
        this.mvpUpdate();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);
        this.projOrtho(0, this.width, this.height, 0, -1000.0, 1000.0);
        
        return this;
    },

    /**
     * Uploads the vertex data and emits a draw call
     * for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.WebGLPipeline#flush
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} [description]
     */
    flush: function ()
    {
        if (this.flushLocked) { return this; }

        this.flushLocked = true;

        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var topology = this.topology;
        var vertexSize = this.vertexSize;
        var renderer = this.renderer;

        if (vertexCount === 0)
        {
            this.flushLocked = false;
            return;
        }

        renderer.setBlankTexture();

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
        gl.drawArrays(topology, 0, vertexCount);

        this.vertexCount = 0;
        this.flushLocked = false;

        return this;
    },

    /**
     * Adds the vertices data into the batch and flushes if full.
     * 
     * Assumes 3 vertices in the following arrangement:
     * 
     * ```
     * ```
     * 
     * 
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchTri
     * @since 3.12.0
     *
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     * @param {number} tint1 - The top-left tint color value.
     * @param {number} tint2 - The top-right tint color value.
     * @param {number} tint3 - The bottom-left tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * 
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchTri: function (x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tint1, tint2, tint3, tintEffect)
    {
        var hasFlushed = false;

        if (this.vertexCount + 3 > this.vertexCapacity)
        {
            this.flush();

            hasFlushed = true;
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint1;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint2;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint3;

        this.vertexCount += 3;

        return hasFlushed;
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
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchVertices
     * @since 3.11.0
     *
     * @param {number} x0 - The top-left x position.
     * @param {number} y0 - The top-left y position.
     * @param {number} x1 - The bottom-left x position.
     * @param {number} y1 - The bottom-left y position.
     * @param {number} x2 - The bottom-right x position.
     * @param {number} y2 - The bottom-right y position.
     * @param {number} x3 - The top-right x position.
     * @param {number} y3 - The top-right y position.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {number} tintBR - The bottom-right tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * 
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect)
    {
        var hasFlushed = false;

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();

            hasFlushed = true;
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;
            
        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        this.vertexCount += 6;

        return hasFlushed;
    },

    /**
     * Pushes a rectangle into the vertex batch
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchFillRect
     * @since 3.0.0
     *
     * @param {number} x - Horizontal top left coordinate of the rectangle
     * @param {number} y - Vertical top left coordinate of the rectangle
     * @param {number} width - Width of the rectangle
     * @param {number} height - Height of the rectangle
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchFillRect: function (x, y, width, height, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);
        
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

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        var tint = this.fillTint;

        this.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tint, tint, tint, tint, this.tintEffect);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchFillTriangle
     * @since 3.0.0
     *
     * @param {number} x0 - Point 0 x coordinate
     * @param {number} y0 - Point 0 y coordinate
     * @param {number} x1 - Point 1 x coordinate
     * @param {number} y1 - Point 1 y coordinate
     * @param {number} x2 - Point 2 x coordinate
     * @param {number} y2 - Point 2 y coordinate
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchFillTriangle: function (x0, y0, x1, y1, x2, y2, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);
        
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

        this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, u0, v0, u1, v1, tint, tint, tint, this.tintEffect);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchStrokeTriangle
     * @since 3.0.0
     *
     * @param {number} x0 - [description]
     * @param {number} y0 - [description]
     * @param {number} x1 - [description]
     * @param {number} y1 - [description]
     * @param {number} x2 - [description]
     * @param {number} y2 - [description]
     * @param {number} lineWidth - Size of the line as a float value
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchFillPath
     * @since 3.0.0
     *
     * @param {number} path - Collection of points that represent the path
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchFillPath: function (path, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;

        var tint = this.fillTint;
        var tintEffect = this.tintEffect;

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }

        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        var frame = this.currentFrame;

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

            var u0 = frame.u0;
            var v0 = frame.v0;
            var u1 = frame.u1;
            var v1 = frame.v1;
        
            this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, u0, v0, u1, v1, tint, tint, tint, tintEffect);
        }

        polygonCache.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchStrokePath
     * @since 3.0.0
     *
     * @param {array} path - [description]
     * @param {number} lineWidth - [description]
     * @param {boolean} pathOpen - Indicates if the path should be closed
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchStrokePath: function (path, lineWidth, pathOpen, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchLine
     * @since 3.0.0
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
        this.renderer.setPipeline(this);

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
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

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        //  TL, BL, BR, TR
        this.batchQuad(tlX, tlY, blX, blY, brX, brY, trX, trY, u0, v0, u1, v1, tint, tint, tint, tint, tintEffect);

        if (lineWidth <= 1)
        {
            //  No point doing a linejoin if the line isn't thick enough
            return;
        }

        var prev = this.prevQuad;
        var first = this.firstQuad;

        if (index > 0)
        {
            this.batchQuad(tlX, tlY, blX, blY, prev[0], prev[1], prev[2], prev[3], u0, v0, u1, v1, tint, tint, tint, tint, tintEffect);
        }
        else
        {
            first[0] = blX;
            first[1] = blY;
            first[2] = tlX;
            first[3] = tlY;
        }

        if (closePath)
        {
            //  Add a join for the final path segment
            this.batchQuad(first[0], first[1], first[2], first[3], brX, brY, trX, trY, u0, v0, u1, v1, tint, tint, tint, tint, tintEffect);
        }
        else
        {
            //  Store it

            prev[0] = brX;
            prev[1] = brY;
            prev[2] = trX;
            prev[3] = trY;
        }
    }

});

module.exports = FlatTintPipeline;
