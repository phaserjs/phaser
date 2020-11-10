/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/PostFX-frag.js');
var ShaderSourceVS = require('../shaders/PostFX-vert.js');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * TODO
 *
 * The fragment shader it uses can be found in `shaders/src/PostFX.frag`.
 * The vertex shader it uses can be found in `shaders/src/PostFX.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uMainSampler` (sampler2D)
 *
 * @class PostFXPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var PostFXPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function PostFXPipeline (config)
    {
        config.fragShader = GetFastValue(config, 'fragShader', ShaderSourceFS);
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS);
        config.batchSize = GetFastValue(config, 'batchSize', 1);
        config.uniforms = GetFastValue(config, 'uniforms', [
            'uProjectionMatrix',
            'uMainSampler'
        ]);
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
            }
        ]);

        WebGLPipeline.call(this, config);
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        this.set1i('uMainSampler', 1);
    },

    batchVert: function (x, y, u, v, unit)
    {
        var vertexViewF32 = this.vertexViewF32;

        var vertexOffset = (this.vertexCount * this.currentShader.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = u;
        vertexViewF32[++vertexOffset] = v;
        vertexViewF32[++vertexOffset] = unit;

        this.vertexCount++;
    }

});

module.exports = PostFXPipeline;
