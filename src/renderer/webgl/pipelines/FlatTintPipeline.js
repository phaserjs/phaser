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

        this.prevQuad = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

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
        vertexViewF32[++vertexOffset] = 2;
        vertexViewU32[++vertexOffset] = tint;

        this.vertexCount++;
    },

    // batchTri: function (x1, y1, x2, y2, x3, y3, tint)
    batchTri: function (x1, y1, x2, y2, x3, y3, tint1, tint2, tint3)
    {
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        //  0 = texture multiplied by color
        //  1 = solid color + texture alpha
        //  2 = solid color, no texture
        //  3 = solid texture, no color

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 2;
        vertexViewU32[++vertexOffset] = tint1;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 1;
        vertexViewF32[++vertexOffset] = 2;
        vertexViewU32[++vertexOffset] = tint2;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = 1;
        vertexViewF32[++vertexOffset] = 1;
        vertexViewF32[++vertexOffset] = 2;
        vertexViewU32[++vertexOffset] = tint3;

        this.vertexCount += 3;
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
     * @param {number} tx0 - The top-left x position.
     * @param {number} ty0 - The top-left y position.
     * @param {number} tx1 - The bottom-left x position.
     * @param {number} ty1 - The bottom-left y position.
     * @param {number} tx2 - The bottom-right x position.
     * @param {number} ty2 - The bottom-right y position.
     * @param {number} tx3 - The top-right x position.
     * @param {number} ty3 - The top-right y position.
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
    batchQuad: function (tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect)
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
            
        vertexViewF32[++vertexOffset] = tx0;
        vertexViewF32[++vertexOffset] = ty0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = tx1;
        vertexViewF32[++vertexOffset] = ty1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        vertexViewF32[++vertexOffset] = tx2;
        vertexViewF32[++vertexOffset] = ty2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = tx0;
        vertexViewF32[++vertexOffset] = ty0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = tx2;
        vertexViewF32[++vertexOffset] = ty2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = tx3;
        vertexViewF32[++vertexOffset] = ty3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        this.vertexCount += 6;

        if (this.vertexCapacity - this.vertexCount < 6)
        {
            //  No more room at the inn
            this.flush();

            hasFlushed = true;
        }

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
    batchFillPath: function (path, fillColor, fillAlpha, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix
        parentMatrix.multiply(currentMatrix, calcMatrix);

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;

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
            var v0 = polygonIndexArray[index + 0] * 2;
            var v1 = polygonIndexArray[index + 1] * 2;
            var v2 = polygonIndexArray[index + 2] * 2;

            var x0 = polygonCache[v0 + 0];
            var y0 = polygonCache[v0 + 1];
            var x1 = polygonCache[v1 + 0];
            var y1 = polygonCache[v1 + 1];
            var x2 = polygonCache[v2 + 0];
            var y2 = polygonCache[v2 + 1];

            var tx0 = calcMatrix.getX(x0, y0);
            var ty0 = calcMatrix.getY(x0, y0);
    
            var tx1 = calcMatrix.getX(x1, y1);
            var ty1 = calcMatrix.getY(x1, y1);
    
            var tx2 = calcMatrix.getX(x2, y2);
            var ty2 = calcMatrix.getY(x2, y2);

            if (this.vertexCount + 3 > this.vertexCapacity)
            {
                this.flush();
            }

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
    batchStrokePath: function (path, lineWidth, lineColor, lineAlpha, isLastPath, currentMatrix, parentMatrix)
    {
        this.renderer.setPipeline(this);

        var pathLength = path.length;

        for (var pathIndex = 0; pathIndex + 1 < pathLength; pathIndex++)
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
                point0.rgb,
                point1.rgb,
                lineAlpha,
                currentMatrix,
                parentMatrix,
                true
            );

            //  Render joint
            if (pathIndex > 0)
            {
                // var prev = this.prevQuad;
            }
        }

        /* Render joints */
        /*
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
        */
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
    batchLine: function (ax, ay, bx, by, aLineWidth, bLineWidth, aLineColor, bLineColor, lineAlpha, currentMatrix, parentMatrix, save)
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
        var tx0 = calcMatrix.getX(lx0, ly0);
        var ty0 = calcMatrix.getY(lx0, ly0);

        //  tx1 = bottom left
        var tx1 = calcMatrix.getX(lx1, ly1);
        var ty1 = calcMatrix.getY(lx1, ly1);

        //  tx2 = top right
        var tx2 = calcMatrix.getX(lx2, ly2);
        var ty2 = calcMatrix.getY(lx2, ly2);

        //  tx3 = top left
        var tx3 = calcMatrix.getX(lx3, ly3);
        var ty3 = calcMatrix.getY(lx3, ly3);

        var aTint = Utils.getTintAppendFloatAlphaAndSwap(aLineColor, lineAlpha);
        var bTint = Utils.getTintAppendFloatAlphaAndSwap(bLineColor, lineAlpha);

        this.batchQuad(tx3, ty3, tx1, ty1, tx0, ty0, tx2, ty2, 0, 0, 1, 1, aTint, bTint, aTint, bTint, 2);

        //  Store it
        if (save)
        {
            var prev = this.prevQuad;

            prev[0] = tx0;
            prev[1] = ty0;
            prev[2] = bLineColor;
            prev[3] = tx1;
            prev[4] = ty1;
            prev[5] = aLineColor;
            prev[6] = tx2;
            prev[7] = ty2;
            prev[8] = bLineColor;
            prev[9] = tx3;
            prev[10] = ty3;
            prev[11] = aLineColor;
        }
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

        var commands = graphics.commandBuffer;
        var alpha = camera.alpha * graphics.alpha;
        var lineAlpha = 1.0;
        var fillAlpha = 1.0;
        var lineColor = 0;
        var fillColor = 0;
        var lineWidth = 1.0;
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

        var cmd;
        var path = [];
        var pathIndex = 0;

        for (var cmdIndex = 0, cmdLength = commands.length; cmdIndex < cmdLength; ++cmdIndex)
        {
            cmd = commands[cmdIndex];

            switch (cmd)
            {
                case Commands.BEGIN_PATH:
                    path.length = 0;
                    lastPath = null;
                    break;

                case Commands.CLOSE_PATH:
                    if (lastPath && lastPath.points.length)
                    {
                        lastPath.points.push(lastPath.points[0]);
                    }
                    break;

                case Commands.FILL_PATH:
                    for (pathIndex = 0; pathIndex < path.length; pathIndex++)
                    {
                        this.batchFillPath(
                            path[pathIndex].points,
                            fillColor,
                            fillAlpha * alpha,
                            currentMatrix,
                            camMatrix
                        );
                    }
                    break;

                case Commands.STROKE_PATH:
                    for (pathIndex = 0; pathIndex < path.length; pathIndex++)
                    {
                        this.batchStrokePath(
                            path[pathIndex].points,
                            lineWidth,
                            lineColor,
                            lineAlpha * alpha,
                            true,
                            currentMatrix,
                            camMatrix
                        );
                    }
                    break;

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

                case Commands.LINE_TO:
                    if (lastPath !== null)
                    {
                        lastPath.points.push(new Point(commands[cmdIndex + 1], commands[cmdIndex + 2], lineWidth, lineColor, lineAlpha * alpha));
                    }
                    else
                    {
                        lastPath = new Path(commands[cmdIndex + 1], commands[cmdIndex + 2], lineWidth, lineColor, lineAlpha * alpha);
                        path.push(lastPath);
                    }
                    cmdIndex += 2;
                    break;

                case Commands.MOVE_TO:
                    lastPath = new Path(commands[cmdIndex + 1], commands[cmdIndex + 2], lineWidth, lineColor, lineAlpha * alpha);
                    path.push(lastPath);
                    cmdIndex += 2;
                    break;

                case Commands.SAVE:
                    matrixStack.push(currentMatrix.copyToArray());
                    break;

                case Commands.RESTORE:
                    currentMatrix.copyFromArray(matrixStack.pop());
                    break;

                case Commands.TRANSLATE:
                    x = commands[++cmdIndex];
                    y = commands[++cmdIndex];
                    currentMatrix.translate(x, y);
                    break;

                case Commands.SCALE:
                    x = commands[++cmdIndex];
                    y = commands[++cmdIndex];
                    currentMatrix.scale(x, y);
                    break;

                case Commands.ROTATE:
                    var r = commands[++cmdIndex];
                    currentMatrix.rotate(r);
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
            }
            */
        }
    }

});

module.exports = FlatTintPipeline;
