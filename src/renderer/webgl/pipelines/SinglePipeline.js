/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ModelViewProjection = require('./components/ModelViewProjection');
var MultiPipeline = require('./MultiPipeline');
var ShaderSourceFS = require('../shaders/Single-frag.js');
var ShaderSourceVS = require('../shaders/Single-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 *
 * The Single Pipeline is a special version of the Multi Pipeline that only ever
 * uses one single texture, bound to texture unit zero. Although not as efficient as the
 * Multi Pipeline, it provides an easier way to create custom pipelines that only require
 * a single bound texture.
 *
 * Prior to Phaser v3.50 this pipeline didn't exist, but could be compared to the old `TextureTintPipeline`.
 *
 * The fragment shader it uses can be found in `shaders/src/Single.frag`.
 * The vertex shader it uses can be found in `shaders/src/Single.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 * `inTintEffect` (float, offset 16)
 * `inTint` (vec4, offset 20, normalized)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uViewMatrix` (mat4)
 * `uModelMatrix` (mat4)
 * `uMainSampler` (sampler2D)
 *
 * @class SinglePipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var SinglePipeline = new Class({

    Extends: MultiPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function SinglePipeline (config)
    {
        var gl = config.game.renderer.gl;

        config.fragShader = GetFastValue(config, 'fragShader', ShaderSourceFS),
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS),
        config.vertexSize = GetFastValue(config, 'vertexSize', 24),
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2,
                type: gl.FLOAT,
                normalized: false,
                offset: 0,
                enabled: false,
                location: -1
            },
            {
                name: 'inTexCoord',
                size: 2,
                type: gl.FLOAT,
                normalized: false,
                offset: 8,
                enabled: false,
                location: -1
            },
            {
                name: 'inTintEffect',
                size: 1,
                type: gl.FLOAT,
                normalized: false,
                offset: 16,
                enabled: false,
                location: -1
            },
            {
                name: 'inTint',
                size: 4,
                type: gl.UNSIGNED_BYTE,
                normalized: true,
                offset: 20,
                enabled: false,
                location: -1
            }
        ]);

        MultiPipeline.call(this, config);

        this.forceZero = true;
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
     * @method Phaser.Renderer.WebGL.Pipelines.SinglePipeline#batchQuad
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
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {number} tintBR - The bottom-right tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch if a flush occurs.
     * @param {integer} [unit=0] - This parameter isn't used by this pipeline, but is retained for TTP support.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(6))
        {
            this.flush();

            hasFlushed = true;

            unit = this.setTexture2D(texture);
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
     * @method Phaser.Renderer.WebGL.Pipelines.SinglePipeline#batchTri
     * @since 3.50.0
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
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch if a flush occurs.
     * @param {integer} [unit=0] - This parameter isn't used by this pipeline, but is retained for TTP support.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchTri: function (x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(3))
        {
            this.flush();

            hasFlushed = true;

            unit = this.setTexture2D(texture);
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        this.vertexCount += 3;

        return hasFlushed;
    },

    /**
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.SinglePipeline#bind
     * @since 3.50.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (reset)
    {
        if (reset === undefined) { reset = false; }

        WebGLPipeline.prototype.bind.call(this, reset);

        return this;
    }

});

module.exports = SinglePipeline;
