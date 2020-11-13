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
        config.renderTarget = GetFastValue(config, 'renderTarget', 1);
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

        /**
         * A Color Matrix instance belonging to this pipeline.
         *
         * Used during calls to the `drawFrame` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#colorMatrix
         * @type {Phaser.Display.ColorMatrix}
         * @since 3.50.0
         */
        this.colorMatrix = new ColorMatrix();

        /**
         * A reference to the Full Frame 1 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#fullFrame1
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.fullFrame1;

        /**
         * A reference to the Full Frame 2 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#fullFrame2
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.fullFrame2;

        /**
         * A reference to the Half Frame 1 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is half the size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#halfFrame1
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.halfFrame1;

        /**
         * A reference to the Half Frame 2 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is half the size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#halfFrame2
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.halfFrame2;
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        var utility = this.manager.UTILITY_PIPELINE;

        this.fullFrame1 = utility.fullFrame1;
        this.fullFrame2 = utility.fullFrame2;
        this.halfFrame1 = utility.halfFrame1;
        this.halfFrame2 = utility.halfFrame2;

        this.set1i('uMainSampler', 0);
    },

    onDraw: function (renderTarget)
    {
        this.bindAndDraw(renderTarget);
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

    bindAndDraw: function (source, currentShader)
    {
        this.bind(currentShader);

        //  Pop out this pipelines renderTarget
        this.renderer.popFramebuffer();

        var gl = this.gl;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindTexture(gl.TEXTURE_2D, null);

        // this.renderer.resetTextures();
    }

});

module.exports = PostFXPipeline;
