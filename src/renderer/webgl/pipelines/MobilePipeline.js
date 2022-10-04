/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Events = require('./events');
var GetFastValue = require('../../../utils/object/GetFastValue');
var MultiPipeline = require('./MultiPipeline');
var ShaderSourceFS = require('../shaders/Mobile-frag.js');
var ShaderSourceVS = require('../shaders/Mobile-vert.js');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Mobile Pipeline is the core 2D texture rendering pipeline used by Phaser in WebGL
 * when the device running the game is detected to be a mobile.
 *
 * You can control the use of this pipeline by setting the Game Configuration
 * property `autoMobilePipeline`. If set to `false` then all devices will use
 * the Multi Tint Pipeline. You can also call the `PipelineManager.setDefaultPipeline`
 * method at run-time, rather than boot-time, to modify the default Game Object
 * pipeline.
 *
 * Virtually all Game Objects use this pipeline by default, including Sprites, Graphics
 * and Tilemaps. It handles the batching of quads and tris, as well as methods for
 * drawing and batching geometry data.
 *
 * The fragment shader it uses can be found in `shaders/src/Mobile.frag`.
 * The vertex shader it uses can be found in `shaders/src/Mobile.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 * `inTexId` (float, offset 16)
 * `inTintEffect` (float, offset 20)
 * `inTint` (vec4, offset 24, normalized)
 *
 * Note that `inTexId` isn't used in the shader, it's just kept to allow us
 * to piggy-back on the Multi Tint Pipeline functions.
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uMainSampler` (sampler2D)
 *
 * @class MobilePipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var MobilePipeline = new Class({

    Extends: MultiPipeline,

    initialize:

    function MobilePipeline (config)
    {
        config.fragShader = GetFastValue(config, 'fragShader', ShaderSourceFS);
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS);
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2
            },
            {
                name: 'inTexCoord',
                size: 2
            },
            {
                name: 'inTexId'
            },
            {
                name: 'inTintEffect'
            },
            {
                name: 'inTint',
                size: 4,
                type: WEBGL_CONST.UNSIGNED_BYTE,
                normalized: true
            }
        ]);

        MultiPipeline.call(this, config);

        //  vertexCapacity / 6 = batchSize

        this.batch = [];

        this.currentTexture = null;
    },

    /**
     * Called when the Game has fully booted and the Renderer has finished setting up.
     *
     * By this stage all Game level systems are now in place and you can perform any final
     * tasks that the pipeline may need that relied on game systems such as the Texture Manager.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MobilePipeline#boot
     * @since 3.60.0
     */
    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        this.set1i('uMainSampler', 0);
    },

    setGameObject: function (gameObject, frame)
    {
        if (frame === undefined) { frame = gameObject.frame; }

        this.pushBatch(frame.source.glTexture);

        return 0;
    },

    setTexture2D: function (texture)
    {
        if (texture === undefined) { texture = this.renderer.whiteTexture.glTexture; }

        this.pushBatch(texture);

        return 0;
    },

    pushBatch: function (texture)
    {
        if (texture !== this.currentTexture)
        {
            this.currentTexture = texture;

            this.currentBatch = {
                start: this.vertexCount,
                count: 0,
                texture: texture
            };

            this.batch.push(this.currentBatch);
        }
    },

    onPreRender: function ()
    {
        this.batch.length = 0;
        this.currentTexture = null;
        this.currentBatch = null;
    },

    onBatch: function ()
    {
        this.currentBatch.count = (this.vertexCount - this.currentBatch.start);
    },

    flush: function (isPostFlush)
    {
        if (isPostFlush === undefined) { isPostFlush = false; }

        if (this.vertexCount > 0)
        {
            this.emit(Events.BEFORE_FLUSH, this, isPostFlush);

            this.onBeforeFlush(isPostFlush);

            var gl = this.gl;
            var vertexCount = this.vertexCount;
            var vertexSize = this.currentShader.vertexSize;
            var topology = this.topology;

            if (this.active)
            {
                this.setVertexBuffer();

                if (vertexCount === this.vertexCapacity)
                {
                    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.DYNAMIC_DRAW);
                }
                else
                {
                    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
                }

                gl.activeTexture(gl.TEXTURE0);

                var batch = this.batch;

                for (var i = 0; i < batch.length; i++)
                {
                    var texture = batch[i].texture;
                    var start = batch[i].start;
                    var count = batch[i].count;

                    gl.bindTexture(gl.TEXTURE_2D, texture);

                    gl.drawArrays(topology, start, count);
                }
            }

            this.vertexCount = 0;

            this.batch.length = 0;
            this.currentBatch = null;
            this.currentTexture = null;

            this.emit(Events.AFTER_FLUSH, this, isPostFlush);

            this.onAfterFlush(isPostFlush);
        }

        return this;
    }

});

module.exports = MobilePipeline;
