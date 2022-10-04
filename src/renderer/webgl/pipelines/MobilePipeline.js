/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var MultiPipeline = require('./MultiPipeline');
var ShaderSourceFS = require('../shaders/Mobile-frag.js');
var ShaderSourceVS = require('../shaders/Mobile-vert.js');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Multi Pipeline is the core 2D texture rendering pipeline used by Phaser in WebGL.
 * Virtually all Game Objects use this pipeline by default, including Sprites, Graphics
 * and Tilemaps. It handles the batching of quads and tris, as well as methods for
 * drawing and batching geometry data.
 *
 * Prior to Phaser v3.50 this pipeline was called the `TextureTintPipeline`.
 *
 * In previous versions of Phaser only one single texture unit was supported at any one time.
 * The Multi Pipeline is an evolution of the old Texture Tint Pipeline, updated to support
 * multi-textures for increased performance.
 *
 * The fragment shader it uses can be found in `shaders/src/Multi.frag`.
 * The vertex shader it uses can be found in `shaders/src/Multi.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 * `inTexId` (float, offset 16)
 * `inTintEffect` (float, offset 20)
 * `inTint` (vec4, offset 24, normalized)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uMainSampler` (sampler2D array)
 *
 * If you wish to create a custom pipeline extending from this one, you should use the string
 * declaration `%count%` in your fragment shader source, which is used to set the number of
 * `sampler2Ds` available. Also add `%getSampler%` so Phaser can inject the getSampler glsl function.
 * This function can be used to get the pixel vec4 from the texture:
 *
 * `vec4 texture = getSampler(int(outTexId), outTexCoord);`
 *
 * This pipeline will automatically inject the getSampler function for you, should the value exist
 * in your shader source. If you wish to handle this yourself, you can also use the
 * function `Utils.parseFragmentShaderMaxTextures`.
 *
 * If you wish to create a pipeline that works from a single texture, or that doesn't have
 * internal texture iteration, please see the `SinglePipeline` instead.
 *
 * @class MultiPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
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
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#bind
     * @since 3.50.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        this.set1i('uMainSampler', 0);
    }

});

module.exports = MobilePipeline;
