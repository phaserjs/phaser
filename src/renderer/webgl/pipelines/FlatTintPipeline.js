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
var Point = function (x, y, width, rgb, alpha)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.rgb = rgb;
    this.alpha = alpha;
};

//  TODO: Remove the use of this
var Path = function (x, y, width, rgb, alpha)
{
    this.points = [];
    this.pointsLength = 1;
    this.points[0] = new Point(x, y, width, rgb, alpha);
};

// var currentMatrix = new Float32Array([ 1, 0, 0, 1, 0, 0 ]);
// var matrixStack = new Float32Array(6 * 1000);
// var matrixStackLength = 0;

var matrixStack = [];
var pathArray = [];

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
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0}
        ];

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

        renderer.setTexture2D(renderer.blankTexture, 0);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
        gl.drawArrays(topology, 0, vertexCount);

        this.vertexCount = 0;
        this.flushLocked = false;

        return this;
    },

    batchVertex: function (x, y, tint)
    {
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0.5;
        vertexViewU32[++vertexOffset] = tint;

        this.vertexCount++;
    },

    batchTri: function (x1, y1, x2, y2, x3, y3, tint)
    {
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0.5;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0.5;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0.5;
        vertexViewU32[++vertexOffset] = tint;

        this.vertexCount += 3;
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
     * @param {integer} fillColor - RGB color packed as a uint
     * @param {number} fillAlpha - Alpha represented as float
     * @param {number} a1 - Matrix stack top a component
     * @param {number} b1 - Matrix stack top b component
     * @param {number} c1 - Matrix stack top c component
     * @param {number} d1 - Matrix stack top d component
     * @param {number} e1 - Matrix stack top e component
     * @param {number} f1 - Matrix stack top f component
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchFillRect: function (x, y, width, height, fillColor, fillAlpha, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);
        
        var xw = x + width;
        var yh = y + height;

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        // var tx0 = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        // var ty0 = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        // var tx1 = x * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        // var ty1 = x * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        // var tx2 = xw * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        // var ty2 = xw * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        // var tx3 = xw * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        // var ty3 = xw * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        // var a0 = currentMatrix[0];
        // var b0 = currentMatrix[1];
        // var c0 = currentMatrix[2];
        // var d0 = currentMatrix[3];
        // var e0 = currentMatrix[4];
        // var f0 = currentMatrix[5];
        // var a = a1 * a0 + b1 * c0;
        // var b = a1 * b0 + b1 * d0;
        // var c = c1 * a0 + d1 * c0;
        // var d = c1 * b0 + d1 * d0;
        // var e = e1 * a0 + f1 * c0 + e0;
        // var f = e1 * b0 + f1 * d0 + f0;
        // var tx0 = x * a + y * c + e;
        // var ty0 = x * b + y * d + f;
        // var tx1 = x * a + yh * c + e;
        // var ty1 = x * b + yh * d + f;
        // var tx2 = xw * a + yh * c + e;
        // var ty2 = xw * b + yh * d + f;
        // var tx3 = xw * a + y * c + e;
        // var ty3 = xw * b + y * d + f;

        var tint = Utils.getTintAppendFloatAlphaAndSwap(fillColor, fillAlpha);

        this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, tint);
        this.batchTri(tx0, ty0, tx2, ty2, tx3, ty3, tint);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchFillTriangle
     * @since 3.0.0
     *
     * @param {number} srcX - Graphics horizontal component for translation
     * @param {number} srcY - Graphics vertical component for translation
     * @param {number} srcScaleX - Graphics horizontal component for scale
     * @param {number} srcScaleY - Graphics vertical component for scale
     * @param {number} srcRotation - Graphics rotation
     * @param {number} x0 - Point 0 x coordinate
     * @param {number} y0 - Point 0 y coordinate
     * @param {number} x1 - Point 1 x coordinate
     * @param {number} y1 - Point 1 y coordinate
     * @param {number} x2 - Point 2 x coordinate
     * @param {number} y2 - Point 2 y coordinate
     * @param {integer} fillColor - RGB color packed as a uint
     * @param {number} fillAlpha - Alpha represented as float
     * @param {number} a1 - Matrix stack top a component
     * @param {number} b1 - Matrix stack top b component
     * @param {number} c1 - Matrix stack top c component
     * @param {number} d1 - Matrix stack top d component
     * @param {number} e1 - Matrix stack top e component
     * @param {number} f1 - Matrix stack top f component
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchFillTriangle: function (x0, y0, x1, y1, x2, y2, fillColor, fillAlpha, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 3 > this.vertexCapacity)
        {
            this.flush();
        }

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);
        
        var tx0 = calcMatrix.getX(x0, y0);
        var ty0 = calcMatrix.getY(x0, y0);

        var tx1 = calcMatrix.getX(x1, y1);
        var ty1 = calcMatrix.getY(x1, y1);

        var tx2 = calcMatrix.getX(x2, y2);
        var ty2 = calcMatrix.getY(x2, y2);

        // var tx0 = x0 * calcMatrix.a + y0 * calcMatrix.c + calcMatrix.e;
        // var ty0 = x0 * calcMatrix.b + y0 * calcMatrix.d + calcMatrix.f;

        // var tx1 = x1 * calcMatrix.a + y1 * calcMatrix.c + calcMatrix.e;
        // var ty1 = x1 * calcMatrix.b + y1 * calcMatrix.d + calcMatrix.f;

        // var tx2 = x2 * calcMatrix.a + y2 * calcMatrix.c + calcMatrix.e;
        // var ty2 = x2 * calcMatrix.b + y2 * calcMatrix.d + calcMatrix.f;

        // var a0 = currentMatrix[0];
        // var b0 = currentMatrix[1];
        // var c0 = currentMatrix[2];
        // var d0 = currentMatrix[3];
        // var e0 = currentMatrix[4];
        // var f0 = currentMatrix[5];
        // var a = a1 * a0 + b1 * c0;
        // var b = a1 * b0 + b1 * d0;
        // var c = c1 * a0 + d1 * c0;
        // var d = c1 * b0 + d1 * d0;
        // var e = e1 * a0 + f1 * c0 + e0;
        // var f = e1 * b0 + f1 * d0 + f0;
        // var tx0 = x0 * a + y0 * c + e;
        // var ty0 = x0 * b + y0 * d + f;
        // var tx1 = x1 * a + y1 * c + e;
        // var ty1 = x1 * b + y1 * d + f;
        // var tx2 = x2 * a + y2 * c + e;
        // var ty2 = x2 * b + y2 * d + f;

        var tint = Utils.getTintAppendFloatAlphaAndSwap(fillColor, fillAlpha);

        this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, tint);
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchStrokeTriangle
     * @since 3.0.0
     *
     * @param {number} srcX - Graphics horizontal component for translation
     * @param {number} srcY - Graphics vertical component for translation
     * @param {number} srcScaleX - Graphics horizontal component for scale
     * @param {number} srcScaleY - Graphics vertical component for scale
     * @param {number} srcRotation - Graphics rotation
     * @param {number} x0 - [description]
     * @param {number} y0 - [description]
     * @param {number} x1 - [description]
     * @param {number} y1 - [description]
     * @param {number} x2 - [description]
     * @param {number} y2 - [description]
     * @param {number} lineWidth - Size of the line as a float value
     * @param {integer} lineColor - RGB color packed as a uint
     * @param {number} lineAlpha - Alpha represented as float
     * @param {number} a - Matrix stack top a component
     * @param {number} b - Matrix stack top b component
     * @param {number} c - Matrix stack top c component
     * @param {number} d - Matrix stack top d component
     * @param {number} e - Matrix stack top e component
     * @param {number} f - Matrix stack top f component
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchStrokeTriangle: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, x0, y0, x1, y1, x2, y2, lineWidth, lineColor, lineAlpha, a, b, c, d, e, f, currentMatrix)
    {
        var tempTriangle = this.tempTriangle;

        tempTriangle[0].x = x0;
        tempTriangle[0].y = y0;
        tempTriangle[0].width = lineWidth;
        tempTriangle[0].rgb = lineColor;
        tempTriangle[0].alpha = lineAlpha;
        tempTriangle[1].x = x1;
        tempTriangle[1].y = y1;
        tempTriangle[1].width = lineWidth;
        tempTriangle[1].rgb = lineColor;
        tempTriangle[1].alpha = lineAlpha;
        tempTriangle[2].x = x2;
        tempTriangle[2].y = y2;
        tempTriangle[2].width = lineWidth;
        tempTriangle[2].rgb = lineColor;
        tempTriangle[2].alpha = lineAlpha;
        tempTriangle[3].x = x0;
        tempTriangle[3].y = y0;
        tempTriangle[3].width = lineWidth;
        tempTriangle[3].rgb = lineColor;
        tempTriangle[3].alpha = lineAlpha;

        this.batchStrokePath(
            srcX, srcY, srcScaleX, srcScaleY, srcRotation,
            tempTriangle, lineWidth, lineColor, lineAlpha,
            a, b, c, d, e, f,
            false,
            currentMatrix
        );
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchFillPath
     * @since 3.0.0
     *
     * @param {number} srcX - Graphics horizontal component for translation
     * @param {number} srcY - Graphics vertical component for translation
     * @param {number} srcScaleX - Graphics horizontal component for scale
     * @param {number} srcScaleY - Graphics vertical component for scale
     * @param {number} srcRotation - Graphics rotation
     * @param {number} path - Collection of points that represent the path
     * @param {integer} fillColor - RGB color packed as a uint
     * @param {number} fillAlpha - Alpha represented as float
     * @param {number} a1 - Matrix stack top a component
     * @param {number} b1 - Matrix stack top b component
     * @param {number} c1 - Matrix stack top c component
     * @param {number} d1 - Matrix stack top d component
     * @param {number} e1 - Matrix stack top e component
     * @param {number} f1 - Matrix stack top f component
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchFillPath: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, path, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        this.renderer.setPipeline(this);

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;
        var v0, v1, v2;
        var x0, y0, x1, y1, x2, y2;
        var tx0, ty0, tx1, ty1, tx2, ty2;
        var a0 = currentMatrix[0];
        var b0 = currentMatrix[1];
        var c0 = currentMatrix[2];
        var d0 = currentMatrix[3];
        var e0 = currentMatrix[4];
        var f0 = currentMatrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
        var tint = Utils.getTintAppendFloatAlphaAndSwap(fillColor, fillAlpha);

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }

        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        for (var index = 0; index < length; index += 3)
        {
            v0 = polygonIndexArray[index + 0] * 2;
            v1 = polygonIndexArray[index + 1] * 2;
            v2 = polygonIndexArray[index + 2] * 2;

            if (this.vertexCount + 3 > this.vertexCapacity)
            {
                this.flush();
            }

            x0 = polygonCache[v0 + 0];
            y0 = polygonCache[v0 + 1];
            x1 = polygonCache[v1 + 0];
            y1 = polygonCache[v1 + 1];
            x2 = polygonCache[v2 + 0];
            y2 = polygonCache[v2 + 1];

            tx0 = x0 * a + y0 * c + e;
            ty0 = x0 * b + y0 * d + f;
            tx1 = x1 * a + y1 * c + e;
            ty1 = x1 * b + y1 * d + f;
            tx2 = x2 * a + y2 * c + e;
            ty2 = x2 * b + y2 * d + f;

            this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, tint);
        }

        polygonCache.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchStrokePath
     * @since 3.0.0
     *
     * @param {number} srcX - Graphics horizontal component for translation
     * @param {number} srcY - Graphics vertical component for translation
     * @param {number} srcScaleX - Graphics horizontal component for scale
     * @param {number} srcScaleY - Graphics vertical component for scale
     * @param {number} srcRotation - Graphics rotation
     * @param {array} path - [description]
     * @param {number} lineWidth - [description]
     * @param {integer} lineColor - RGB color packed as a uint
     * @param {number} lineAlpha - Alpha represented as float
     * @param {number} a - Matrix stack top a component
     * @param {number} b - Matrix stack top b component
     * @param {number} c - Matrix stack top c component
     * @param {number} d - Matrix stack top d component
     * @param {number} e - Matrix stack top e component
     * @param {number} f - Matrix stack top f component
     * @param {boolean} isLastPath - Indicates if the path should be closed
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchStrokePath: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, path, lineWidth, lineColor, lineAlpha, a, b, c, d, e, f, isLastPath, currentMatrix)
    {
        this.renderer.setPipeline(this);

        var point0, point1;
        var pathLength = path.length;
        var polylines = this.polygonCache;
        var last, curr;
        var line;
        var getTint = Utils.getTintAppendFloatAlphaAndSwap;

        for (var pathIndex = 0; pathIndex + 1 < pathLength; pathIndex += 1)
        {
            point0 = path[pathIndex];
            point1 = path[pathIndex + 1];

            line = this.batchLine(
                srcX, srcY, srcScaleX, srcScaleY, srcRotation,
                point0.x, point0.y,
                point1.x, point1.y,
                point0.width / 2, point1.width / 2,
                point0.rgb, point1.rgb, lineAlpha,
                a, b, c, d, e, f,
                currentMatrix
            );

            polylines.push(line);
        }

        /* Render joints */
        for (var index = 1, polylinesLength = polylines.length; index < polylinesLength; ++index)
        {
            if (this.vertexCount + 6 > this.vertexCapacity)
            {
                this.flush();
            }

            last = polylines[index - 1] || polylines[polylinesLength - 1];
            curr = polylines[index];

            var tx0 = last[3 * 2 + 0];
            var ty0 = last[3 * 2 + 1];
            var tint0 = getTint(last[3 * 2 + 2], lineAlpha);

            var tx1 = last[3 * 0 + 0];
            var ty1 = last[3 * 0 + 1];
            var tint1 = getTint(last[3 * 0 + 2], lineAlpha);

            var tx2 = curr[3 * 3 + 0];
            var ty2 = curr[3 * 3 + 1];
            var tint2 = getTint(curr[3 * 3 + 2], lineAlpha);

            // var tx3 = last[3 * 0 + 0]; //tx1
            // var ty3 = last[3 * 0 + 1]; //ty1
            // var tint3 = getTint(last[3 * 0 + 2], lineAlpha); //tint1

            // var tx4 = last[3 * 2 + 0]; //tx0
            // var ty4 = last[3 * 2 + 1]; //ty0
            // var tint4 = getTint(last[3 * 2 + 2], lineAlpha); //tint0

            var tx5 = curr[3 * 1 + 0];
            var ty5 = curr[3 * 1 + 1];
            var tint5 = getTint(curr[3 * 1 + 2], lineAlpha);

            this.batchVertex(tx0, ty0, tint0);
            this.batchVertex(tx1, ty1, tint1);
            this.batchVertex(tx2, ty2, tint2);
            this.batchVertex(tx1, ty1, tint1);
            this.batchVertex(tx0, ty0, tint0);
            this.batchVertex(tx5, ty5, tint5);
        }

        polylines.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchLine
     * @since 3.0.0
     *
     * @param {number} srcX - Graphics horizontal component for translation
     * @param {number} srcY - Graphics vertical component for translation
     * @param {number} srcScaleX - Graphics horizontal component for scale
     * @param {number} srcScaleY - Graphics vertical component for scale
     * @param {number} srcRotation - Graphics rotation
     * @param {number} ax - X coordinate to the start of the line
     * @param {number} ay - Y coordinate to the start of the line
     * @param {number} bx - X coordinate to the end of the line
     * @param {number} by - Y coordinate to the end of the line
     * @param {number} aLineWidth - Width of the start of the line
     * @param {number} bLineWidth - Width of the end of the line
     * @param {integer} aLineColor - RGB color packed as a uint
     * @param {integer} bLineColor - RGB color packed as a uint
     * @param {number} lineAlpha - Alpha represented as float
     * @param {number} a1 - Matrix stack top a component
     * @param {number} b1 - Matrix stack top b component
     * @param {number} c1 - Matrix stack top c component
     * @param {number} d1 - Matrix stack top d component
     * @param {number} e1 - Matrix stack top e component
     * @param {number} f1 - Matrix stack top f component
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchLine: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, ax, ay, bx, by, aLineWidth, bLineWidth, aLineColor, bLineColor, lineAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }
        
        var a0 = currentMatrix[0];
        var b0 = currentMatrix[1];
        var c0 = currentMatrix[2];
        var d0 = currentMatrix[3];
        var e0 = currentMatrix[4];
        var f0 = currentMatrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
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
        var x0 = lx0 * a + ly0 * c + e;
        var y0 = lx0 * b + ly0 * d + f;
        var x1 = lx1 * a + ly1 * c + e;
        var y1 = lx1 * b + ly1 * d + f;
        var x2 = lx2 * a + ly2 * c + e;
        var y2 = lx2 * b + ly2 * d + f;
        var x3 = lx3 * a + ly3 * c + e;
        var y3 = lx3 * b + ly3 * d + f;
        var getTint = Utils.getTintAppendFloatAlphaAndSwap;
        var aTint = getTint(aLineColor, lineAlpha);
        var bTint = getTint(bLineColor, lineAlpha);

        this.batchVertex(x0, y0, bTint);
        this.batchVertex(x1, y1, aTint);
        this.batchVertex(x2, y2, bTint);
        this.batchVertex(x1, y1, aTint);
        this.batchVertex(x3, y3, aTint);
        this.batchVertex(x2, y2, bTint);

        return [
            x0, y0, bLineColor,
            x1, y1, aLineColor,
            x2, y2, bLineColor,
            x3, y3, aLineColor
        ];
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FlatTintPipeline#batchGraphics
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     */
    batchGraphics: function (graphics, camera, parentTransformMatrix)
    {
        var camMatrix = this._tempMatrix1;
        var graphicsMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;
        var currentMatrix = this._tempMatrix4;

        // var parentMatrix = null;

        // if (parentTransformMatrix)
        // {
        //     parentMatrix = parentTransformMatrix.matrix;
        // }
        
        this.renderer.setPipeline(this);

        currentMatrix.loadIdentity();

        graphicsMatrix.applyITRS(graphics.x, graphics.y, graphics.rotation, graphics.scaleX, graphics.scaleY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * graphics.scrollFactorX, -camera.scrollY * graphics.scrollFactorY);

            //  Undo the camera scroll
            graphicsMatrix.e = graphics.x;
            graphicsMatrix.f = graphics.y;

            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(graphicsMatrix);
        }
        else
        {
            graphicsMatrix.e -= camera.scrollX * graphics.scrollFactorX;
            graphicsMatrix.f -= camera.scrollY * graphics.scrollFactorY;
    
            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(graphicsMatrix);
        }

        // var cameraScrollX = camera.scrollX * graphics.scrollFactorX;
        // var cameraScrollY = camera.scrollY * graphics.scrollFactorY;
        // var srcX = graphics.x;
        // var srcY = graphics.y;
        // var srcScaleX = graphics.scaleX;
        // var srcScaleY = graphics.scaleY;
        // var srcRotation = graphics.rotation;
        var commands = graphics.commandBuffer;
        var alpha = camera.alpha * graphics.alpha;
        var lineAlpha = 1.0;
        var fillAlpha = 1.0;
        var lineColor = 0;
        var fillColor = 0;
        var lineWidth = 1.0;
        // var cameraMatrix = camera.matrix.matrix;
        var lastPath = null;
        var iteration = 0;
        var iterStep = 0.01;
        var tx = 0;
        var ty = 0;
        var ta = 0;
        var x = 0;
        var y = 0;
        var radius = 0;
        var startAngle = 0;
        var endAngle = 0;
        var path = null;
        // var sin = Math.sin;
        // var cos = Math.cos;
        // var sr = sin(srcRotation);
        // var cr = cos(srcRotation);
        // var sra = cr * srcScaleX;
        // var srb = sr * srcScaleX;
        // var src = -sr * srcScaleY;
        // var srd = cr * srcScaleY;
        // var sre = srcX;
        // var srf = srcY;
        // var cma = cameraMatrix[0];
        // var cmb = cameraMatrix[1];
        // var cmc = cameraMatrix[2];
        // var cmd = cameraMatrix[3];
        // var cme = cameraMatrix[4];
        // var cmf = cameraMatrix[5];
        // var mva, mvb, mvc, mvd, mve, mvf;

        // if (parentMatrix)
        // {
        //     var pma = parentMatrix[0];
        //     var pmb = parentMatrix[1];
        //     var pmc = parentMatrix[2];
        //     var pmd = parentMatrix[3];
        //     var pme = parentMatrix[4];
        //     var pmf = parentMatrix[5];
        //     var cse = -cameraScrollX;
        //     var csf = -cameraScrollY;
        //     var pse = cse * cma + csf * cmc + cme;
        //     var psf = cse * cmb + csf * cmd + cmf;
        //     var pca = pma * cma + pmb * cmc;
        //     var pcb = pma * cmb + pmb * cmd;
        //     var pcc = pmc * cma + pmd * cmc;
        //     var pcd = pmc * cmb + pmd * cmd;
        //     var pce = pme * cma + pmf * cmc + pse;
        //     var pcf = pme * cmb + pmf * cmd + psf;

        //     mva = sra * pca + srb * pcc;
        //     mvb = sra * pcb + srb * pcd;
        //     mvc = src * pca + srd * pcc;
        //     mvd = src * pcb + srd * pcd;
        //     mve = sre * pca + srf * pcc + pce;
        //     mvf = sre * pcb + srf * pcd + pcf;
        // }
        // else
        // {
        //     sre -= cameraScrollX;
        //     srf -= cameraScrollY;

        //     mva = sra * cma + srb * cmc;
        //     mvb = sra * cmb + srb * cmd;
        //     mvc = src * cma + srd * cmc;
        //     mvd = src * cmb + srd * cmd;
        //     mve = sre * cma + srf * cmc + cme;
        //     mvf = sre * cmb + srf * cmd + cmf;
        // }

        var pathArrayIndex;
        var pathArrayLength;
        var cmd;

        pathArray.length = 0;

        for (var cmdIndex = 0, cmdLength = commands.length; cmdIndex < cmdLength; ++cmdIndex)
        {
            cmd = commands[cmdIndex];

            switch (cmd)
            {
                case Commands.LINE_STYLE:
                    lineWidth = commands[++cmdIndex];
                    lineColor = commands[++cmdIndex];
                    lineAlpha = commands[++cmdIndex];
                    break;

                case Commands.FILL_STYLE:
                    fillColor = commands[++cmdIndex];
                    fillAlpha = commands[++cmdIndex];
                    break;

                case Commands.FILL_RECT:
                    this.batchFillRect(
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        fillColor,
                        fillAlpha * alpha,
                        currentMatrix,
                        camMatrix
                    );
                    break;

                case Commands.FILL_TRIANGLE:
                    this.batchFillTriangle(
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        commands[++cmdIndex],
                        fillColor,
                        fillAlpha * alpha,
                        currentMatrix,
                        camMatrix
                    );
                    break;

                case Commands.SAVE:

                    matrixStack.push(currentMatrix.copyToArray());
                    break;

                case Commands.RESTORE:

                    currentMatrix.copyFromArray(matrixStack.pop());
                    break;

            }

            /**
            switch (cmd)
            {
                case Commands.ARC:
                    iteration = 0;
                    x = commands[cmdIndex + 1];
                    y = commands[cmdIndex + 2];
                    radius = commands[cmdIndex + 3];
                    startAngle = commands[cmdIndex + 4];
                    endAngle = commands[cmdIndex + 5];

                    if (lastPath === null)
                    {
                        lastPath = new Path(x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius, lineWidth, lineColor, lineAlpha * alpha);
                        pathArray.push(lastPath);
                        iteration += iterStep;
                    }

                    while (iteration < 1)
                    {
                        ta = endAngle * iteration + startAngle;
                        tx = x + Math.cos(ta) * radius;
                        ty = y + Math.sin(ta) * radius;

                        lastPath.points.push(new Point(tx, ty, lineWidth, lineColor, lineAlpha * alpha));

                        iteration += iterStep;
                    }

                    ta = endAngle + startAngle;
                    tx = x + Math.cos(ta) * radius;
                    ty = y + Math.sin(ta) * radius;

                    lastPath.points.push(new Point(tx, ty, lineWidth, lineColor, lineAlpha * alpha));

                    cmdIndex += 6;
                    break;

                case Commands.LINE_STYLE:
                    lineWidth = commands[cmdIndex + 1];
                    lineColor = commands[cmdIndex + 2];
                    lineAlpha = commands[cmdIndex + 3];
                    cmdIndex += 3;
                    break;

                case Commands.FILL_STYLE:
                    fillColor = commands[cmdIndex + 1];
                    fillAlpha = commands[cmdIndex + 2];
                    cmdIndex += 2;
                    break;

                case Commands.BEGIN_PATH:
                    pathArray.length = 0;
                    lastPath = null;
                    break;

                case Commands.CLOSE_PATH:
                    if (lastPath && lastPath.points.length)
                    {
                        lastPath.points.push(lastPath.points[0]);
                    }
                    break;

                case Commands.FILL_PATH:
                    for (pathArrayIndex = 0, pathArrayLength = pathArray.length;
                        pathArrayIndex < pathArrayLength;
                        ++pathArrayIndex)
                    {
                        this.batchFillPath(

                            srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                            pathArray[pathArrayIndex].points,
                            fillColor,
                            fillAlpha * alpha,

                            mva, mvb, mvc, mvd, mve, mvf,
                            currentMatrix
                        );
                    }
                    break;

                case Commands.STROKE_PATH:
                    for (pathArrayIndex = 0, pathArrayLength = pathArray.length;
                        pathArrayIndex < pathArrayLength;
                        ++pathArrayIndex)
                    {
                        path = pathArray[pathArrayIndex];
                        this.batchStrokePath(

                            srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                            path.points,
                            lineWidth,
                            lineColor,
                            lineAlpha * alpha,

                            mva, mvb, mvc, mvd, mve, mvf,
                            path === this._lastPath,
                            currentMatrix
                        );
                    }
                    break;
                    
                case Commands.FILL_RECT:
                    this.batchFillRect(

                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        fillColor,
                        fillAlpha * alpha,

                        mva, mvb, mvc, mvd, mve, mvf,
                        currentMatrix
                    );
                 
                    cmdIndex += 4;
                    break;

                case Commands.FILL_TRIANGLE:
                    this.batchFillTriangle(

                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        commands[cmdIndex + 5],
                        commands[cmdIndex + 6],
                        fillColor,
                        fillAlpha * alpha,

                        mva, mvb, mvc, mvd, mve, mvf,
                        currentMatrix
                    );
                    
                    cmdIndex += 6;
                    break;

                case Commands.STROKE_TRIANGLE:
                    this.batchStrokeTriangle(

                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        commands[cmdIndex + 5],
                        commands[cmdIndex + 6],
                        lineWidth,
                        lineColor,
                        lineAlpha * alpha,

                        mva, mvb, mvc, mvd, mve, mvf,
                        currentMatrix
                    );
                    
                    cmdIndex += 6;
                    break;

                case Commands.LINE_TO:
                    if (lastPath !== null)
                    {
                        lastPath.points.push(new Point(commands[cmdIndex + 1], commands[cmdIndex + 2], lineWidth, lineColor, lineAlpha * alpha));
                    }
                    else
                    {
                        lastPath = new Path(commands[cmdIndex + 1], commands[cmdIndex + 2], lineWidth, lineColor, lineAlpha * alpha);
                        pathArray.push(lastPath);
                    }
                    cmdIndex += 2;
                    break;

                case Commands.MOVE_TO:
                    lastPath = new Path(commands[cmdIndex + 1], commands[cmdIndex + 2], lineWidth, lineColor, lineAlpha * alpha);
                    pathArray.push(lastPath);
                    cmdIndex += 2;
                    break;

                case Commands.LINE_FX_TO:
                    if (lastPath !== null)
                    {
                        lastPath.points.push(new Point(
                            commands[cmdIndex + 1],
                            commands[cmdIndex + 2],
                            commands[cmdIndex + 3],
                            commands[cmdIndex + 4],
                            commands[cmdIndex + 5] * alpha
                        ));
                    }
                    else
                    {
                        lastPath = new Path(
                            commands[cmdIndex + 1],
                            commands[cmdIndex + 2],
                            commands[cmdIndex + 3],
                            commands[cmdIndex + 4],
                            commands[cmdIndex + 5] * alpha
                        );
                        pathArray.push(lastPath);
                    }
                    cmdIndex += 5;
                    break;

                case Commands.MOVE_FX_TO:
                    lastPath = new Path(
                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        commands[cmdIndex + 5] * alpha
                    );
                    pathArray.push(lastPath);
                    cmdIndex += 5;
                    break;

                case Commands.SAVE:
                    matrixStack[matrixStackLength + 0] = currentMatrix[0];
                    matrixStack[matrixStackLength + 1] = currentMatrix[1];
                    matrixStack[matrixStackLength + 2] = currentMatrix[2];
                    matrixStack[matrixStackLength + 3] = currentMatrix[3];
                    matrixStack[matrixStackLength + 4] = currentMatrix[4];
                    matrixStack[matrixStackLength + 5] = currentMatrix[5];
                    matrixStackLength += 6;
                    break;

                case Commands.RESTORE:
                    matrixStackLength -= 6;
                    currentMatrix[0] = matrixStack[matrixStackLength + 0];
                    currentMatrix[1] = matrixStack[matrixStackLength + 1];
                    currentMatrix[2] = matrixStack[matrixStackLength + 2];
                    currentMatrix[3] = matrixStack[matrixStackLength + 3];
                    currentMatrix[4] = matrixStack[matrixStackLength + 4];
                    currentMatrix[5] = matrixStack[matrixStackLength + 5];
                    break;

                case Commands.TRANSLATE:
                    x = commands[cmdIndex + 1];
                    y = commands[cmdIndex + 2];
                    currentMatrix[4] = currentMatrix[0] * x + currentMatrix[2] * y + currentMatrix[4];
                    currentMatrix[5] = currentMatrix[1] * x + currentMatrix[3] * y + currentMatrix[5];
                    cmdIndex += 2;
                    break;

                case Commands.SCALE:
                    x = commands[cmdIndex + 1];
                    y = commands[cmdIndex + 2];
                    currentMatrix[0] *= x;
                    currentMatrix[1] *= x;
                    currentMatrix[2] *= y;
                    currentMatrix[3] *= y;
                    cmdIndex += 2;
                    break;

                case Commands.ROTATE:
                    y = commands[cmdIndex + 1];
                    x = Math.sin(y);
                    y = Math.cos(y);
                    sra = currentMatrix[0];
                    srb = currentMatrix[1];
                    src = currentMatrix[2];
                    srd = currentMatrix[3];
                    currentMatrix[0] = y * sra + x * src;
                    currentMatrix[1] = y * srb + x * srd;
                    currentMatrix[2] = -x * sra + y * src;
                    currentMatrix[3] = -x * srb + y * srd;
                    cmdIndex += 1;
                    break;

                default:
                    // eslint-disable-next-line no-console
                    console.error('Phaser: Invalid Graphics Command ID ' + cmd);
                    break;
            }
            */
        }
    }

});

module.exports = FlatTintPipeline;
