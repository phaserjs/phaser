/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/BitmapMask-frag.js');
var ShaderSourceVS = require('../shaders/BitmapMask-vert.js');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Bitmap Mask Pipeline handles all of the bitmap mask rendering in WebGL for applying
 * alpha masks to Game Objects. It works by sampling two texture on the fragment shader and
 * using the fragments alpha to clip the region.
 *
 * The fragment shader it uses can be found in `shaders/src/BitmapMask.frag`.
 * The vertex shader it uses can be found in `shaders/src/BitmapMask.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uResolution` (vec2)
 * `uMainSampler` (sampler2D)
 * `uMaskSampler` (sampler2D)
 * `uInvertMaskAlpha` (bool)
 *
 * @class BitmapMaskPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var BitmapMaskPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function BitmapMaskPipeline (config)
    {
        config.fragShader = GetFastValue(config, 'fragShader', ShaderSourceFS),
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS),
        config.batchSize = GetFastValue(config, 'batchSize', 1),
        config.vertices = GetFastValue(config, 'vertices', [ -1, 1, -1, -7, 7, 1 ]),
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2,
                type: WEBGL_CONST.FLOAT
            }
        ]);

        WebGLPipeline.call(this, config);
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        this.set1i('uMainSampler', 0);
        this.set1i('uMaskSampler', 1);
    },

    resize: function (width, height)
    {
        WebGLPipeline.prototype.resize.call(this, width, height);

        this.set2f('uResolution', width, height);
    },

    /**
     * Binds necessary resources and renders the mask to a separated framebuffer.
     * The framebuffer for the masked object is also bound for further use.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#beginMask
     * @since 3.0.0
     *
     * @param {Phaser.Display.Masks.BitmapMask} mask - The BitmapMask instance that called beginMask.
     * @param {Phaser.GameObjects.GameObject} maskedObject - GameObject masked by the mask GameObject.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera rendering the current mask.
     */
    beginMask: function (mask, maskedObject, camera)
    {
        this.renderer.beginBitmapMask(mask, camera);
    },

    /**
     * The masked game objects framebuffer is unbound and its texture
     * is bound together with the mask texture and the mask shader and
     * a draw call with a single quad is processed. Here is where the
     * masking effect is applied.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline#endMask
     * @since 3.0.0
     *
     * @param {Phaser.Display.Masks.BitmapMask} mask - The BitmapMask instance that called endMask.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to render to.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [renderTarget] - Optional WebGL RenderTarget.
     */
    endMask: function (mask, camera, renderTarget)
    {
        var gl = this.gl;
        var renderer = this.renderer;

        //  The renderable Game Object that is being used for the bitmap mask
        var bitmapMask = mask.bitmapMask;

        if (bitmapMask && gl)
        {
            renderer.drawBitmapMask(bitmapMask, camera, this);

            if (renderTarget)
            {
                this.set2f('uResolution', renderTarget.width, renderTarget.height);
            }

            this.set1i('uInvertMaskAlpha', mask.invertAlpha);

            //  Finally, draw a triangle filling the whole screen
            gl.drawArrays(this.topology, 0, 3);

            if (renderTarget)
            {
                this.set2f('uResolution', this.width, this.height);
            }

            //  Clear gl.TEXTURE1
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }

});

module.exports = BitmapMaskPipeline;
