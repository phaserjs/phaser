/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var MultiPipeline = require('./MultiPipeline');
var ShaderSourceFS = require('../shaders/Single-frag.js');
var ShaderSourceVS = require('../shaders/Single-vert.js');
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
        config.forceZero = true;

        MultiPipeline.call(this, config);
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
    }

});

module.exports = MobilePipeline;
