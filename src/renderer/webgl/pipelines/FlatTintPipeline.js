/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Commands = require('../../../gameobjects/graphics/Commands');
var Earcut = require('../../../geom/polygon/Earcut');
var ModelViewProjection = require('./components/ModelViewProjection');
var ShaderSourceFS = require('../shaders/FlatTint.frag');
var ShaderSourceVS = require('../shaders/FlatTint.vert');
var Utils = require('../Utils');
var WebGLPipeline = require('../WebGLPipeline');

var Point = function (x, y, width, rgb, alpha)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.rgb = rgb;
    this.alpha = alpha;
};

var Path = function (x, y, width, rgb, alpha)
{
    this.points = [];
    this.pointsLength = 1;
    this.points[0] = new Point(x, y, width, rgb, alpha);
};

var currentMatrix = new Float32Array([ 1, 0, 0, 1, 0, 0 ]);
var matrixStack = new Float32Array(6 * 1000);
var matrixStackLength = 0;
var pathArray = [];

/**
 * @classdesc
 * [description]
 *
 * @class FlatTintPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 */
var FlatTintPipeline = new Class({

    Extends: WebGLPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function FlatTintPipeline (config)
    {
        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: (config.topology ? config.topology : config.renderer.gl.TRIANGLES),
            vertShader: (config.vertShader ? config.vertShader : ShaderSourceVS),
            fragShader: (config.fragShader ? config.fragShader : ShaderSourceFS),
            vertexCapacity: (config.vertexCapcity ? config.vertexCapacity : 12000),

            vertexSize: (config.vertexSize ? config.vertexSize :
                Float32Array.BYTES_PER_ELEMENT * 2 +
                Uint8Array.BYTES_PER_ELEMENT * 4),

            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: 0
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: config.renderer.gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
                }
            ]
        });

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.FlatTintPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.FlatTintPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32 = new Uint32Array(this.vertexData);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.FlatTintPipeline#tempTriangle
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
         * [description]
         *
         * @name Phaser.Renderer.WebGL.FlatTintPipeline#polygonCache
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.polygonCache = [];

        this.mvpInit();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.FlatTintPipeline} [description]
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
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.FlatTintPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);
        this.projOrtho(0, this.width, this.height, 0, -1000.0, 1000.0);
        
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchFillRect
     * @since 3.0.0
     *
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcScaleX - [description]
     * @param {float} srcScaleY - [description]
     * @param {float} srcRotation - [description]
     * @param {float} x - [description]
     * @param {float} y - [description]
     * @param {float} width - [description]
     * @param {float} height - [description]
     * @param {integer} fillColor - [description]
     * @param {float} fillAlpha - [description]
     * @param {float} a1 - [description]
     * @param {float} b1 - [description]
     * @param {float} c1 - [description]
     * @param {float} d1 - [description]
     * @param {float} e1 - [description]
     * @param {float} f1 - [description]
     * @param {Float32Array} currentMatrix - [description]
     */
    batchFillRect: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, x, y, width, height, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }
        
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var vertexOffset = this.vertexCount * this.vertexComponentCount;
        var xw = x + width;
        var yh = y + height;
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
        var tx0 = x * a + y * c + e;
        var ty0 = x * b + y * d + f;
        var tx1 = x * a + yh * c + e;
        var ty1 = x * b + yh * d + f;
        var tx2 = xw * a + yh * c + e;
        var ty2 = xw * b + yh * d + f;
        var tx3 = xw * a + y * c + e;
        var ty3 = xw * b + y * d + f;
        var tint = Utils.getTintAppendFloatAlphaAndSwap(fillColor, fillAlpha);

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewU32[vertexOffset + 2] = tint;
        vertexViewF32[vertexOffset + 3] = tx1;
        vertexViewF32[vertexOffset + 4] = ty1;
        vertexViewU32[vertexOffset + 5] = tint;
        vertexViewF32[vertexOffset + 6] = tx2;
        vertexViewF32[vertexOffset + 7] = ty2;
        vertexViewU32[vertexOffset + 8] = tint;
        vertexViewF32[vertexOffset + 9] = tx0;
        vertexViewF32[vertexOffset + 10] = ty0;
        vertexViewU32[vertexOffset + 11] = tint;
        vertexViewF32[vertexOffset + 12] = tx2;
        vertexViewF32[vertexOffset + 13] = ty2;
        vertexViewU32[vertexOffset + 14] = tint;
        vertexViewF32[vertexOffset + 15] = tx3;
        vertexViewF32[vertexOffset + 16] = ty3;
        vertexViewU32[vertexOffset + 17] = tint;

        this.vertexCount += 6;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchFillTriangle
     * @since 3.0.0
     *
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcScaleX - [description]
     * @param {float} srcScaleY - [description]
     * @param {float} srcRotation - [description]
     * @param {float} x0 - [description]
     * @param {float} y0 - [description]
     * @param {float} x1 - [description]
     * @param {float} y1 - [description]
     * @param {float} x2 - [description]
     * @param {float} y2 - [description]
     * @param {integer} fillColor - [description]
     * @param {float} fillAlpha - [description]
     * @param {float} a1 - [description]
     * @param {float} b1 - [description]
     * @param {float} c1 - [description]
     * @param {float} d1 - [description]
     * @param {float} e1 - [description]
     * @param {float} f1 - [description]
     * @param {Float32Array} currentMatrix - [description]
     */
    batchFillTriangle: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, x0, y0, x1, y1, x2, y2, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 3 > this.vertexCapacity)
        {
            this.flush();
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var vertexOffset = this.vertexCount * this.vertexComponentCount;
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
        var tx0 = x0 * a + y0 * c + e;
        var ty0 = x0 * b + y0 * d + f;
        var tx1 = x1 * a + y1 * c + e;
        var ty1 = x1 * b + y1 * d + f;
        var tx2 = x2 * a + y2 * c + e;
        var ty2 = x2 * b + y2 * d + f;
        var tint = Utils.getTintAppendFloatAlphaAndSwap(fillColor, fillAlpha);

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewU32[vertexOffset + 2] = tint;
        vertexViewF32[vertexOffset + 3] = tx1;
        vertexViewF32[vertexOffset + 4] = ty1;
        vertexViewU32[vertexOffset + 5] = tint;
        vertexViewF32[vertexOffset + 6] = tx2;
        vertexViewF32[vertexOffset + 7] = ty2;
        vertexViewU32[vertexOffset + 8] = tint;

        this.vertexCount += 3;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchStrokeTriangle
     * @since 3.0.0
     *
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcScaleX - [description]
     * @param {float} srcScaleY - [description]
     * @param {float} srcRotation - [description]
     * @param {float} x0 - [description]
     * @param {float} y0 - [description]
     * @param {float} x1 - [description]
     * @param {float} y1 - [description]
     * @param {float} x2 - [description]
     * @param {float} y2 - [description]
     * @param {float} lineWidth - [description]
     * @param {integer} lineColor - [description]
     * @param {float} lineAlpha - [description]
     * @param {float} a - [description]
     * @param {float} b - [description]
     * @param {float} c - [description]
     * @param {float} d - [description]
     * @param {float} e - [description]
     * @param {float} f - [description]
     * @param {Float32Array} currentMatrix - [description]
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
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchFillPath
     * @since 3.0.0
     *
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcScaleX - [description]
     * @param {float} srcScaleY - [description]
     * @param {float} srcRotation - [description]
     * @param {float} path - [description]
     * @param {integer} fillColor - [description]
     * @param {float} fillAlpha - [description]
     * @param {float} a1 - [description]
     * @param {float} b1 - [description]
     * @param {float} c1 - [description]
     * @param {float} d1 - [description]
     * @param {float} e1 - [description]
     * @param {float} f1 - [description]
     * @param {Float32Array} currentMatrix - [description]
     */
    batchFillPath: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, path, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        this.renderer.setPipeline(this);

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;
        var v0, v1, v2;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var vertexOffset = 0;
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

            vertexOffset = this.vertexCount * this.vertexComponentCount;

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

            vertexViewF32[vertexOffset + 0] = tx0;
            vertexViewF32[vertexOffset + 1] = ty0;
            vertexViewU32[vertexOffset + 2] = tint;
            vertexViewF32[vertexOffset + 3] = tx1;
            vertexViewF32[vertexOffset + 4] = ty1;
            vertexViewU32[vertexOffset + 5] = tint;
            vertexViewF32[vertexOffset + 6] = tx2;
            vertexViewF32[vertexOffset + 7] = ty2;
            vertexViewU32[vertexOffset + 8] = tint;

            this.vertexCount += 3;
        }

        polygonCache.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchStrokePath
     * @since 3.0.0
     *
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcScaleX - [description]
     * @param {float} srcScaleY - [description]
     * @param {float} srcRotation - [description]
     * @param {array} path - [description]
     * @param {float} lineWidth - [description]
     * @param {integer} lineColor - [description]
     * @param {float} lineAlpha - [description]
     * @param {float} a - [description]
     * @param {float} b - [description]
     * @param {float} c - [description]
     * @param {float} d - [description]
     * @param {float} e - [description]
     * @param {float} f - [description]
     * @param {boolean} isLastPath - [description]
     * @param {Float32Array} currentMatrix - [description]
     */
    batchStrokePath: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, path, lineWidth, lineColor, lineAlpha, a, b, c, d, e, f, isLastPath, currentMatrix)
    {
        this.renderer.setPipeline(this);

        var point0, point1;
        var pathLength = path.length;
        var polylines = this.polygonCache;
        var last, curr;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var vertexOffset;
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
            vertexOffset = this.vertexCount * this.vertexComponentCount;

            vertexViewF32[vertexOffset + 0] = last[3 * 2 + 0];
            vertexViewF32[vertexOffset + 1] = last[3 * 2 + 1];
            vertexViewU32[vertexOffset + 2] = getTint(last[3 * 2 + 2], lineAlpha);
            vertexViewF32[vertexOffset + 3] = last[3 * 0 + 0];
            vertexViewF32[vertexOffset + 4] = last[3 * 0 + 1];
            vertexViewU32[vertexOffset + 5] = getTint(last[3 * 0 + 2], lineAlpha);
            vertexViewF32[vertexOffset + 6] = curr[3 * 3 + 0];
            vertexViewF32[vertexOffset + 7] = curr[3 * 3 + 1];
            vertexViewU32[vertexOffset + 8] = getTint(curr[3 * 3 + 2], lineAlpha);
            vertexViewF32[vertexOffset + 9] = last[3 * 0 + 0];
            vertexViewF32[vertexOffset + 10] = last[3 * 0 + 1];
            vertexViewU32[vertexOffset + 11] = getTint(last[3 * 0 + 2], lineAlpha);
            vertexViewF32[vertexOffset + 12] = last[3 * 2 + 0];
            vertexViewF32[vertexOffset + 13] = last[3 * 2 + 1];
            vertexViewU32[vertexOffset + 14] = getTint(last[3 * 2 + 2], lineAlpha);
            vertexViewF32[vertexOffset + 15] = curr[3 * 1 + 0];
            vertexViewF32[vertexOffset + 16] = curr[3 * 1 + 1];
            vertexViewU32[vertexOffset + 17] = getTint(curr[3 * 1 + 2], lineAlpha);

            this.vertexCount += 6;
        }

        polylines.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchLine
     * @since 3.0.0
     *
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcScaleX - [description]
     * @param {float} srcScaleY - [description]
     * @param {float} srcRotation - [description]
     * @param {float} ax - [description]
     * @param {float} ay - [description]
     * @param {float} bx - [description]
     * @param {float} by - [description]
     * @param {float} aLineWidth - [description]
     * @param {float} bLineWidth - [description]
     * @param {integer} aLineColor - [description]
     * @param {integer} bLineColor - [description]
     * @param {float} lineAlpha - [description]
     * @param {float} a1 - [description]
     * @param {float} b1 - [description]
     * @param {float} c1 - [description]
     * @param {float} d1 - [description]
     * @param {float} e1 - [description]
     * @param {float} f1 - [description]
     * @param {Float32Array} currentMatrix - [description]
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
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
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
        var vertexOffset = this.vertexCount * this.vertexComponentCount;

        vertexViewF32[vertexOffset + 0] = x0;
        vertexViewF32[vertexOffset + 1] = y0;
        vertexViewU32[vertexOffset + 2] = bTint;
        vertexViewF32[vertexOffset + 3] = x1;
        vertexViewF32[vertexOffset + 4] = y1;
        vertexViewU32[vertexOffset + 5] = aTint;
        vertexViewF32[vertexOffset + 6] = x2;
        vertexViewF32[vertexOffset + 7] = y2;
        vertexViewU32[vertexOffset + 8] = bTint;
        vertexViewF32[vertexOffset + 9] = x1;
        vertexViewF32[vertexOffset + 10] = y1;
        vertexViewU32[vertexOffset + 11] = aTint;
        vertexViewF32[vertexOffset + 12] = x3;
        vertexViewF32[vertexOffset + 13] = y3;
        vertexViewU32[vertexOffset + 14] = aTint;
        vertexViewF32[vertexOffset + 15] = x2;
        vertexViewF32[vertexOffset + 16] = y2;
        vertexViewU32[vertexOffset + 17] = bTint;

        this.vertexCount += 6;

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
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchGraphics
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchGraphics: function (graphics, camera)
    {
        if (graphics.commandBuffer.length <= 0) { return; }
        
        this.renderer.setPipeline(this);

        var cameraScrollX = camera.scrollX * graphics.scrollFactorX;
        var cameraScrollY = camera.scrollY * graphics.scrollFactorY;
        var srcX = graphics.x - cameraScrollX;
        var srcY = graphics.y - cameraScrollY;
        var srcScaleX = graphics.scaleX;
        var srcScaleY = graphics.scaleY;
        var srcRotation = -graphics.rotation;
        var commands = graphics.commandBuffer;
        var alpha = graphics.alpha;
        var lineAlpha = 1.0;
        var fillAlpha = 1.0;
        var lineColor = 0;
        var fillColor = 0;
        var lineWidth = 1.0;
        var cameraMatrix = camera.matrix.matrix;
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
        var anticlockwise = 0;
        var path = null;
        var sin = Math.sin;
        var cos = Math.cos;
        var PI2 = Math.PI * 2;
        var sr = sin(srcRotation);
        var cr = cos(srcRotation);
        var sra = cr * srcScaleX;
        var srb = -sr * srcScaleX;
        var src = sr * srcScaleY;
        var srd = cr * srcScaleY;
        var sre = srcX;
        var srf = srcY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var mva = sra * cma + srb * cmc;
        var mvb = sra * cmb + srb * cmd;
        var mvc = src * cma + srd * cmc;
        var mvd = src * cmb + srd * cmd;
        var mve = sre * cma + srf * cmc + cme;
        var mvf = sre * cmb + srf * cmd + cmf;

        var pathArrayIndex;
        var pathArrayLength;

        pathArray.length = 0;

        for (var cmdIndex = 0, cmdLength = commands.length; cmdIndex < cmdLength; ++cmdIndex)
        {
            cmd = commands[cmdIndex];

            switch (cmd)
            {
                case Commands.ARC:
                    iteration = 0;
                    x = commands[cmdIndex + 1];
                    y = commands[cmdIndex + 2];
                    radius = commands[cmdIndex + 3];
                    startAngle = commands[cmdIndex + 4];
                    endAngle = commands[cmdIndex + 5];
                    anticlockwise = commands[cmdIndex + 6];

                    if (lastPath === null)
                    {
                        lastPath = new Path(x + cos(startAngle) * radius, y + sin(startAngle) * radius, lineWidth, lineColor, lineAlpha * alpha);
                        pathArray.push(lastPath);
                        iteration += iterStep;
                    }

                    endAngle -= startAngle;

                    if (anticlockwise)
                    {
                        if (endAngle < -PI2)
                        {
                            endAngle = -PI2;
                        }
                        else if (endAngle > 0)
                        {
                            endAngle = -PI2 + endAngle % PI2;
                        }
                    }
                    else if (endAngle > PI2)
                    {
                        endAngle = PI2;
                    }
                    else if (endAngle < 0)
                    {
                        endAngle = PI2 + endAngle % PI2;
                    }

                    while (iteration < 1)
                    {
                        ta = endAngle * iteration + startAngle;
                        tx = x + cos(ta) * radius;
                        ty = y + sin(ta) * radius;

                        lastPath.points.push(new Point(tx, ty, lineWidth, lineColor, lineAlpha * alpha));

                        iteration += iterStep;
                    }

                    ta = endAngle + startAngle;
                    tx = x + cos(ta) * radius;
                    ty = y + sin(ta) * radius;

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

                            /* Graphics Game Object Properties */
                            srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                            /* Rectangle properties */ 
                            pathArray[pathArrayIndex].points,
                            fillColor,
                            fillAlpha * alpha,

                            /* Transform */
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

                            /* Graphics Game Object Properties */
                            srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                            /* Rectangle properties */ 
                            path.points,
                            lineWidth,
                            lineColor,
                            lineAlpha * alpha,

                            /* Transform */
                            mva, mvb, mvc, mvd, mve, mvf,
                            path === this._lastPath,
                            currentMatrix
                        );
                    }
                    break;
                    
                case Commands.FILL_RECT:
                    this.batchFillRect(

                        /* Graphics Game Object Properties */
                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                        /* Rectangle properties */ 
                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        fillColor,
                        fillAlpha * alpha,

                        /* Transform */
                        mva, mvb, mvc, mvd, mve, mvf,
                        currentMatrix
                    );
                 
                    cmdIndex += 4;
                    break;

                case Commands.FILL_TRIANGLE:
                    this.batchFillTriangle(

                        /* Graphics Game Object Properties */
                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                        /* Triangle properties */ 
                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        commands[cmdIndex + 5],
                        commands[cmdIndex + 6],
                        fillColor,
                        fillAlpha * alpha,

                        /* Transform */
                        mva, mvb, mvc, mvd, mve, mvf,
                        currentMatrix
                    );
                    
                    cmdIndex += 6;
                    break;

                case Commands.STROKE_TRIANGLE:
                    this.batchStrokeTriangle(

                        /* Graphics Game Object Properties */
                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,

                        /* Triangle properties */ 
                        commands[cmdIndex + 1],
                        commands[cmdIndex + 2],
                        commands[cmdIndex + 3],
                        commands[cmdIndex + 4],
                        commands[cmdIndex + 5],
                        commands[cmdIndex + 6],
                        lineWidth,
                        lineColor,
                        lineAlpha * alpha,

                        /* Transform */
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
                    x = sin(y);
                    y = cos(y);
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
        }
    },

    // Stubs

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#drawStaticTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    drawStaticTilemapLayer: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#drawEmitterManager
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmittermanager} emitterManager - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    drawEmitterManager: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#drawBlitter
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Blitter} blitter - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    drawBlitter: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchSprite: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchMesh
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Mesh} mesh - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchMesh: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.BitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchBitmapText: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchDynamicBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.DynamicBitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchDynamicBitmapText: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Text} text - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchText: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchDynamicTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.DynamicTilemapLayer} tilemapLayer - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchDynamicTilemapLayer: function ()
    {
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.FlatTintPipeline#batchTileSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.TileSprite} tileSprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchTileSprite: function ()
    {
    }

});

module.exports = FlatTintPipeline;
