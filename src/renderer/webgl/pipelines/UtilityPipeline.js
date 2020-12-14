/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AddBlendFS = require('../shaders/AddBlend-frag.js');
var BlendModes = require('../../BlendModes');
var Class = require('../../../utils/Class');
var ColorMatrix = require('../../../display/ColorMatrix');
var ColorMatrixFS = require('../shaders/ColorMatrix-frag.js');
var CopyFS = require('../shaders/Copy-frag.js');
var GetFastValue = require('../../../utils/object/GetFastValue');
var LinearBlendFS = require('../shaders/LinearBlend-frag.js');
var QuadVS = require('../shaders/Quad-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Utility Pipeline is a special-use pipeline that belongs to the Pipeline Manager.
 *
 * It provides 4 shaders and handy associated methods:
 *
 * 1) Copy Shader. A fast texture to texture copy shader with optional brightness setting.
 * 2) Additive Blend Mode Shader. Blends two textures using an additive blend mode.
 * 3) Linear Blend Mode Shader. Blends two textures using a linear blend mode.
 * 4) Color Matrix Copy Shader. Draws a texture to a target using a Color Matrix.
 *
 * You do not extend this pipeline, but instead get a reference to it from the Pipeline
 * Manager via the `setUtility` method. You can also access methods such as `copyFrame`
 * directly from the Pipeline Manager.
 *
 * This pipeline provides methods for manipulating framebuffer backed textures, such as
 * copying or blending one texture to another, copying a portion of a texture, additively
 * blending two textures, flipping textures and more.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 *
 * This pipeline has a hard-coded batch size of 1 and a hard coded set of vertices.
 *
 * @class UtilityPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var UtilityPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function UtilityPipeline (config)
    {
        config.renderTarget = GetFastValue(config, 'renderTarget', [
            {
                scale: 1
            },
            {
                scale: 1
            },
            {
                scale: 0.5
            },
            {
                scale: 0.5
            }
        ]);

        config.vertShader = GetFastValue(config, 'vertShader', QuadVS);

        config.shaders = GetFastValue(config, 'shaders', [
            {
                name: 'Copy',
                fragShader: CopyFS
            },
            {
                name: 'AddBlend',
                fragShader: AddBlendFS
            },
            {
                name: 'LinearBlend',
                fragShader: LinearBlendFS
            },
            {
                name: 'ColorMatrix',
                fragShader: ColorMatrixFS
            }
        ]);

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

        config.vertices = [
            -1, -1, 0, 0,
            -1, 1, 0, 1,
            1, 1, 1, 1,
            -1, -1, 0, 0,
            1, 1, 1, 1,
            1, -1, 1, 0
        ];

        config.batchSize = 1;

        WebGLPipeline.call(this, config);

        /**
         * A default Color Matrix, used by the Color Matrix Shader when one
         * isn't provided.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#colorMatrix
         * @type {Phaser.Display.ColorMatrix}
         * @since 3.50.0
         */
        this.colorMatrix = new ColorMatrix();

        /**
         * A reference to the Copy Shader belonging to this Utility Pipeline.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#copyShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.50.0
         */
        this.copyShader;

        /**
         * A reference to the Additive Blend Shader belonging to this Utility Pipeline.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#addShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @since 3.50.0
         */
        this.addShader;

        /**
         * A reference to the Linear Blend Shader belonging to this Utility Pipeline.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#linearShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @since 3.50.0
         */
        this.linearShader;

        /**
         * A reference to the Color Matrix Shader belonging to this Utility Pipeline.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#colorMatrixShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @since 3.50.0
         */
        this.colorMatrixShader;

        /**
         * A reference to the Full Frame 1 Render Target.
         *
         * This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#fullFrame1
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.fullFrame1;

        /**
         * A reference to the Full Frame 2 Render Target.
         *
         * This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#fullFrame2
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.fullFrame2;

        /**
         * A reference to the Half Frame 1 Render Target.
         *
         * This property is set during the `boot` method.
         *
         * This Render Target is half the size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#halfFrame1
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.halfFrame1;

        /**
         * A reference to the Half Frame 2 Render Target.
         *
         * This property is set during the `boot` method.
         *
         * This Render Target is half the size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#halfFrame2
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.50.0
         */
        this.halfFrame2;
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        var shaders = this.shaders;
        var targets = this.renderTargets;

        this.copyShader = shaders[0];
        this.addShader = shaders[1];
        this.linearShader = shaders[2];
        this.colorMatrixShader = shaders[3];

        this.fullFrame1 = targets[0];
        this.fullFrame2 = targets[1];
        this.halfFrame1 = targets[2];
        this.halfFrame2 = targets[3];
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
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#copyFrame
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
        if (brightness === undefined) { brightness = 1; }
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }

        var gl = this.gl;

        this.setShader(this.copyShader);

        this.set1i('uMainSampler', 0);
        this.set1f('uBrightness', brightness);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        if (target)
        {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
        }
        else
        {
            gl.viewport(0, 0, source.width, source.height);
        }

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

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
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
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#blitFrame
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
        if (brightness === undefined) { brightness = 1; }
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }
        if (eraseMode === undefined) { eraseMode = false; }

        var gl = this.gl;

        this.setShader(this.copyShader);

        this.set1i('uMainSampler', 0);
        this.set1f('uBrightness', brightness);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        if (source.height > target.height)
        {
            gl.viewport(0, 0, source.width, source.height);

            this.setTargetUVs(source, target);
        }
        else
        {
            var diff = target.height - source.height;

            gl.viewport(0, diff, source.width, source.height);
        }

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

        if (eraseMode)
        {
            var blendMode = this.renderer.currentBlendMode;

            this.renderer.setBlendMode(BlendModes.ERASE);
        }

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (eraseMode)
        {
            this.renderer.setBlendMode(blendMode);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.resetUVs();
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
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#copyFrameRect
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
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }

        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, source.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, source.texture, 0);

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

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, target.texture);

        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, x, y, width, height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
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
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#copyToGame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw from.
     */
    copyToGame: function (source)
    {
        var gl = this.gl;

        this.setShader(this.copyShader);

        this.set1i('uMainSampler', 0);
        this.set1f('uBrightness', 1);

        this.renderer.popFramebuffer();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        this.renderer.resetTextures();
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
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#drawFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {Phaser.Display.ColorMatrix} [colorMatrix] - The Color Matrix to use when performing the draw.
     */
    drawFrame: function (source, target, clearAlpha, colorMatrix)
    {
        if (clearAlpha === undefined) { clearAlpha = true; }
        if (colorMatrix === undefined) { colorMatrix = this.colorMatrix; }

        var gl = this.gl;

        this.setShader(this.colorMatrixShader);

        this.set1i('uMainSampler', 0);
        this.set1fv('uColorMatrix', colorMatrix.getData());
        this.set1f('uAlpha', colorMatrix.alpha);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        if (target)
        {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
        }
        else
        {
            gl.viewport(0, 0, source.width, source.height);
        }

        if (clearAlpha)
        {
            gl.clearColor(0, 0, 0, 0);
        }
        else
        {
            gl.clearColor(0, 0, 0, 1);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using a linear blend effect, which is controlled by the `strength` parameter.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#blendFrames
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source1 - The first source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} source2 - The second source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [strength=1] - The strength of the blend.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {Phaser.Renderer.WebGL.WebGLShader} [blendShader] - The shader to use during the blend copy.
     */
    blendFrames: function (source1, source2, target, strength, clearAlpha, blendShader)
    {
        if (strength === undefined) { strength = 1; }
        if (clearAlpha === undefined) { clearAlpha = true; }
        if (blendShader === undefined) { blendShader = this.linearShader; }

        var gl = this.gl;

        this.setShader(blendShader);

        this.set1i('uMainSampler1', 0);
        this.set1i('uMainSampler2', 1);
        this.set1f('uStrength', strength);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source1.texture);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, source2.texture);

        if (target)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
            gl.viewport(0, 0, target.width, target.height);
        }
        else
        {
            gl.viewport(0, 0, source1.width, source1.height);
        }

        if (clearAlpha)
        {
            gl.clearColor(0, 0, 0, 0);
        }
        else
        {
            gl.clearColor(0, 0, 0, 1);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using an additive blend effect, which is controlled by the `strength` parameter.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#blendFramesAdditive
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
        this.blendFrames(source1, source2, target, strength, clearAlpha, this.addShader);
    },

    /**
     * Clears the given Render Target.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#clearFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The Render Target to clear.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    clearFrame: function (target, clearAlpha)
    {
        if (clearAlpha === undefined) { clearAlpha = true; }

        var gl = this.gl;

        gl.viewport(0, 0, target.width, target.height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);

        if (clearAlpha)
        {
            gl.clearColor(0, 0, 0, 0);
        }
        else
        {
            gl.clearColor(0, 0, 0, 1);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);

        var fbo = this.renderer.currentFramebuffer;

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    },

    /**
     * Set the UV values for the 6 vertices that make up the quad used by the shaders
     * in the Utility Pipeline.
     *
     * Be sure to call `resetUVs` once you have finished manipulating the UV coordinates.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#setUVs
     * @since 3.50.0
     *
     * @param {number} uA - The u value of vertex A.
     * @param {number} vA - The v value of vertex A.
     * @param {number} uB - The u value of vertex B.
     * @param {number} vB - The v value of vertex B.
     * @param {number} uC - The u value of vertex C.
     * @param {number} vC - The v value of vertex C.
     * @param {number} uD - The u value of vertex D.
     * @param {number} vD - The v value of vertex D.
     */
    setUVs: function (uA, vA, uB, vB, uC, vC, uD, vD)
    {
        var vertexViewF32 = this.vertexViewF32;

        vertexViewF32[2] = uA;
        vertexViewF32[3] = vA;
        vertexViewF32[6] = uB;
        vertexViewF32[7] = vB;
        vertexViewF32[10] = uC;
        vertexViewF32[11] = vC;
        vertexViewF32[14] = uA;
        vertexViewF32[15] = vA;
        vertexViewF32[18] = uC;
        vertexViewF32[19] = vC;
        vertexViewF32[22] = uD;
        vertexViewF32[23] = vD;
    },

    /**
     * Sets the vertex UV coordinates of the quad used by the shaders in the Utility Pipeline
     * so that they correctly adjust the texture coordinates for a blit frame effect.
     *
     * Be sure to call `resetUVs` once you have finished manipulating the UV coordinates.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#setTargetUVs
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target.
     */
    setTargetUVs: function (source, target)
    {
        var diff = (target.height / source.height);

        if (diff > 0.5)
        {
            diff = 0.5 - (diff - 0.5);
        }
        else
        {
            diff = 0.5 + (0.5 - diff);
        }

        this.setUVs(0, diff, 0, 1 + diff, 1, 1 + diff, 1, diff);
    },

    /**
     * Horizontally flips the UV coordinates of the quad used by the shaders in this
     * Utility Pipeline.
     *
     * Be sure to call `resetUVs` once you have finished manipulating the UV coordinates.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#flipX
     * @since 3.50.0
     */
    flipX: function ()
    {
        this.setUVs(1, 0, 1, 1, 0, 1, 0, 0);
    },

    /**
     * Vertically flips the UV coordinates of the quad used by the shaders in this
     * Utility Pipeline.
     *
     * Be sure to call `resetUVs` once you have finished manipulating the UV coordinates.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#flipY
     * @since 3.50.0
     */
    flipY: function ()
    {
        this.setUVs(0, 1, 0, 0, 1, 0, 1, 1);
    },

    /**
     * Resets the quad vertice UV values to their default settings.
     *
     * The quad is used by all shaders of the Utility Pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#resetUVs
     * @since 3.50.0
     */
    resetUVs: function ()
    {
        this.setUVs(0, 0, 0, 1, 1, 1, 1, 0);
    }

});

module.exports = UtilityPipeline;
