/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ColorMatrix = require('../../../display/ColorMatrix');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/PostFX-frag.js');
var ShaderSourceVS = require('../shaders/Quad-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Post FX Pipeline is a special kind of pipeline specifically for handling post
 * processing effects. Where-as a standard Pipeline allows you to control the process
 * of rendering Game Objects by configuring the shaders and attributes used to draw them,
 * a Post FX Pipeline is designed to allow you to apply processing _after_ the Game Object/s
 * have been rendered. Typical examples of post processing effects are bloom filters,
 * blurs, light effects and color manipulation.
 *
 * The pipeline works by creating a tiny vertex buffer with just one single hard-coded quad
 * in it. Game Objects can have a Post Pipeline set on them. Those objects are then rendered
 * using their standard pipeline, but are redirected to the Render Targets owned by the
 * post pipeline, which can then apply their own shaders and effects, before passing them
 * back to the main renderer.
 *
 * Please see the Phaser 3 examples for further details on this extensive subject.
 *
 * The default fragment shader it uses can be found in `shaders/src/PostFX.frag`.
 * The default vertex shader it uses can be found in `shaders/src/Quad.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 *
 * The vertices array layout is:
 *
 * -1,  1   B----C   1,  1
 *  0,  1   |   /|   1,  1
 *          |  / |
 *          | /  |
 *          |/   |
 * -1, -1   A----D   1, -1
 *  0,  0            1,  0
 *
 * A = -1, -1 (pos) and 0, 0 (uv)
 * B = -1,  1 (pos) and 0, 1 (uv)
 * C =  1,  1 (pos) and 1, 1 (uv)
 * D =  1, -1 (pos) and 1, 0 (uv)
 *
 * First tri: A, B, C
 * Second tri: A, C, D
 *
 * Array index:
 *
 * 0  = Tri 1 - Vert A - x pos
 * 1  = Tri 1 - Vert A - y pos
 * 2  = Tri 1 - Vert A - uv u
 * 3  = Tri 1 - Vert A - uv v
 *
 * 4  = Tri 1 - Vert B - x pos
 * 5  = Tri 1 - Vert B - y pos
 * 6  = Tri 1 - Vert B - uv u
 * 7  = Tri 1 - Vert B - uv v
 *
 * 8  = Tri 1 - Vert C - x pos
 * 9  = Tri 1 - Vert C - y pos
 * 10 = Tri 1 - Vert C - uv u
 * 11 = Tri 1 - Vert C - uv v
 *
 * 12 = Tri 2 - Vert A - x pos
 * 13 = Tri 2 - Vert A - y pos
 * 14 = Tri 2 - Vert A - uv u
 * 15 = Tri 2 - Vert A - uv v
 *
 * 16 = Tri 2 - Vert C - x pos
 * 17 = Tri 2 - Vert C - y pos
 * 18 = Tri 2 - Vert C - uv u
 * 19 = Tri 2 - Vert C - uv v
 *
 * 20 = Tri 2 - Vert D - x pos
 * 21 = Tri 2 - Vert D - y pos
 * 22 = Tri 2 - Vert D - uv u
 * 23 = Tri 2 - Vert D - uv v
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
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2
            },
            {
                name: 'inTexCoord',
                size: 2
            }
        ]);
        config.batchSize = 1;
        config.vertices = [
            -1, -1, 0, 0,
            -1, 1, 0, 1,
            1, 1, 1, 1,
            -1, -1, 0, 0,
            1, 1, 1, 1,
            1, -1, 1, 0
        ];

        WebGLPipeline.call(this, config);

        this.isPostFX = true;

        /**
         * If this post-pipeline belongs to a Game Object or Camera, this contains a reference to it.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.50.0
         */
        this.gameObject;

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

        if (this.renderer.isBooted)
        {
            this.manager = this.renderer.pipelines;

            this.boot();
        }
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

    /**
     * Copy the `source` Render Target to the `target` Render Target.
     *
     * You can optionally set the brightness factor of the copy.
     *
     * The difference between this method and `drawFrame` is that this method
     * uses a faster copy shader, where only the brightness can be modified.
     * If you need color level manipulation, see `drawFrame` instead.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#copyFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [brightness=1] - The brightness value applied to the frame copy.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    copyFrame: function (source, target, brightness, clear, clearAlpha)
    {
        this.manager.copyFrame(source, target, brightness, clear, clearAlpha);
    },

    /**
     * Pops the framebuffer from the renderers FBO stack and sets that as the active target,
     * then draws the `source` Render Target to it. It then resets the renderer textures.
     *
     * This should be done when you need to draw the _final_ results of a pipeline to the game
     * canvas, or the next framebuffer in line on the FBO stack. You should only call this once
     * in the `onDraw` handler and it should be the final thing called. Be careful not to call
     * this if you need to actually use the pipeline shader, instead of the copy shader. In
     * those cases, use the `bindAndDraw` method.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#copyToGame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw from.
     */
    copyToGame: function (source)
    {
        this.manager.copyToGame(source);
    },

    /**
     * Copy the `source` Render Target to the `target` Render Target, using the
     * given Color Matrix.
     *
     * The difference between this method and `copyFrame` is that this method
     * uses a color matrix shader, where you have full control over the luminance
     * values used during the copy. If you don't need this, you can use the faster
     * `copyFrame` method instead.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#drawFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    drawFrame: function (source, target, clearAlpha)
    {
        this.manager.drawFrame(source, target, clearAlpha, this.colorMatrix);
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using a linear blend effect, which is controlled by the `strength` parameter.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#blendFrames
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source1 - The first source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} source2 - The second source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [strength=1] - The strength of the blend.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    blendFrames: function (source1, source2, target, strength, clearAlpha)
    {
        this.manager.blendFrames(source1, source2, target, strength, clearAlpha);
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using an additive blend effect, which is controlled by the `strength` parameter.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#blendFramesAdditive
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source1 - The first source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} source2 - The second source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [strength=1] - The strength of the blend.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    blendFramesAdditive: function (source1, source2, target, strength, clearAlpha)
    {
        this.manager.blendFramesAdditive(source1, source2, target, strength, clearAlpha);
    },

    /**
     * Clears the given Render Target.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#clearFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The Render Target to clear.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    clearFrame: function (target, clearAlpha)
    {
        this.manager.clearFrame(target, clearAlpha);
    },

    /**
     * Copy the `source` Render Target to the `target` Render Target.
     *
     * The difference with this copy is that no resizing takes place. If the `source`
     * Render Target is larger than the `target` then only a portion the same size as
     * the `target` dimensions is copied across.
     *
     * You can optionally set the brightness factor of the copy.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#blitFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target.
     * @param {number} [brightness=1] - The brightness value applied to the frame copy.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {boolean} [eraseMode=false] - Erase source from target using ERASE Blend Mode?
     */
    blitFrame: function (source, target, brightness, clear, clearAlpha, eraseMode)
    {
        this.manager.blitFrame(source, target, brightness, clear, clearAlpha, eraseMode);
    },

    /**
     * Binds the `source` Render Target and then copies a section of it to the `target` Render Target.
     *
     * This method is extremely fast because it uses `gl.copyTexSubImage2D` and doesn't
     * require the use of any shaders. Remember the coordinates are given in standard WebGL format,
     * where x and y specify the lower-left corner of the section, not the top-left. Also, the
     * copy entirely replaces the contents of the target texture, no 'merging' or 'blending' takes
     * place.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#copyFrameRect
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target.
     * @param {number} x - The x coordinate of the lower left corner where to start copying.
     * @param {number} y - The y coordinate of the lower left corner where to start copying.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    copyFrameRect: function (source, target, x, y, width, height, clear, clearAlpha)
    {
        this.manager.copyFrameRect(source, target, x, y, width, height, clear, clearAlpha);
    },

    /**
     * Binds this pipeline and draws the `source` Render Target to the `target` Render Target.
     *
     * If no `target` is specified, it will pop the framebuffer from the Renderers FBO stack
     * and use that instead, which should be done when you need to draw the final results of
     * this pipeline to the game canvas.
     *
     * You can optionally set the shader to be used for the draw here, if this is a multi-shader
     * pipeline. By default `currentShader` will be used. If you need to set a shader but not
     * a target, just pass `null` as the `target` parameter.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PostFXPipeline#bindAndDraw
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw from.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The Render Target to draw to. If not set, it will pop the fbo from the stack.
     * @param {boolean} [clear=true] - Clear the target before copying? Only used if `target` parameter is set.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to use during the draw.
     */
    bindAndDraw: function (source, target, clear, clearAlpha, currentShader)
    {
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }

        var gl = this.gl;
        var renderer = this.renderer;

        this.bind(currentShader);

        this.set1i('uMainSampler', 0);

        if (target)
        {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);

            if (clear)
            {
                if (clearAlpha)
                {
                    gl.clearColor(0, 0, 0, 0);
                }
                else
                {
                    gl.clearColor(0, 0, 0, 1);
                }

                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        }
        else
        {
            renderer.popFramebuffer(false, false, false);

            if (!renderer.currentFramebuffer)
            {
                gl.viewport(0, 0, renderer.width, renderer.height);
            }
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (target)
        {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

});

module.exports = PostFXPipeline;
