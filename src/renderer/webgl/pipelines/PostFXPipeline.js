/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ColorMatrix = require('../../../display/ColorMatrix');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/PostFX-frag.js');
var ShaderSourceVS = require('../shaders/Quad-vert.js');
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
        config.uniforms = GetFastValue(config, 'uniforms', [
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
        config.batchSize = 1;
        config.vertices = new Float32Array([
            -1, -1, 0, 0,
            -1, 1, 0, 1,
            1, 1, 1, 1,
            -1, -1, 0, 0,
            1, 1, 1, 1,
            1, -1, 1, 0
        ]);

        WebGLPipeline.call(this, config);

        this.colorMatrix = new ColorMatrix();
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        this.set1i('uMainSampler', 0);
    },

    onDraw: function (renderTarget)
    {
        //  Draws from the RenderTarget (which usually belongs to this pipeline) to the target (usually the game canvas)
        this.draw(renderTarget);
    },

    copyFrame: function (source, target, brightness, clearAlpha)
    {
        this.manager.copyFrame(source, target, brightness, clearAlpha);
    },

    drawFrame: function (source, target, clearAlpha)
    {
        this.manager.drawFrame(source, target, clearAlpha, this.colorMatrix);
    },

    blendFrames: function (source1, source2, target, strength, clearAlpha)
    {
        this.manager.blendFrames(source1, source2, target, strength, clearAlpha);
    },

    blendFramesAdditive: function (source1, source2, target, strength, clearAlpha)
    {
        this.manager.blendFramesAdditive(source1, source2, target, strength, clearAlpha);
    },

    bindAndDraw: function (renderTarget, currentShader)
    {
        this.bind(currentShader);

        renderTarget.unbind();

        var gl = this.gl;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, renderTarget.texture);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

});

module.exports = PostFXPipeline;
