/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../../BlendModes');
var CenterOn = require('../../../geom/rectangle/CenterOn');
var Class = require('../../../utils/Class');
var ColorMatrixFS = require('../shaders/ColorMatrix-frag.js');
var GetFastValue = require('../../../utils/object/GetFastValue');
var MultiPipeline = require('./MultiPipeline');
var PostFXFS = require('../shaders/PostFX-frag.js');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var RenderTarget = require('../RenderTarget');
var SingleQuadFS = require('../shaders/Single-frag.js');
var SingleQuadVS = require('../shaders/Single-vert.js');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * The Pre FX Pipeline is a special kind of pipeline designed specifically for applying
 * special effects to Game Objects before they are rendered. Where-as the Post FX Pipeline applies an effect _after_ the
 * object has been rendered, the Pre FX Pipeline allows you to control the rendering of
 * the object itself - passing it off to its own texture, where multi-buffer compositing
 * can take place.
 *
 * You can only use the PreFX Pipeline on the following types of Game Objects, or those
 * that extend from them:
 *
 * Sprite
 * Image
 * Text
 * TileSprite
 * RenderTexture
 * Video
 *
 * @class PreFXPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var PreFXPipeline = new Class({

    Extends: MultiPipeline,

    initialize:

    function PreFXPipeline (config)
    {
        var fragShader = GetFastValue(config, 'fragShader', PostFXFS);
        var vertShader = GetFastValue(config, 'vertShader', SingleQuadVS);
        var drawShader = GetFastValue(config, 'drawShader', PostFXFS);

        var defaultShaders = [
            {
                name: 'DrawSprite',
                fragShader: SingleQuadFS,
                vertShader: SingleQuadVS
            },
            {
                name: 'CopySprite',
                fragShader: fragShader,
                vertShader: vertShader
            },
            {
                name: 'DrawGame',
                fragShader: drawShader,
                vertShader: SingleQuadVS
            },
            {
                name: 'ColorMatrix',
                fragShader: ColorMatrixFS
            }
        ];

        var configShaders = GetFastValue(config, 'shaders', []);

        config.shaders = defaultShaders.concat(configShaders);

        if (!config.vertShader)
        {
            config.vertShader = vertShader;
        }

        config.batchSize = 1;

        MultiPipeline.call(this, config);

        this.isPreFX = true;

        this.customMainSampler = null;

        /**
         * A reference to the Draw Sprite Shader belonging to this Pipeline.
         *
         * This shader is used when the sprite is drawn to this fbo (or to the game if drawToFrame is false)
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#drawSpriteShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.60.0
         */
        this.drawSpriteShader;

        /**
         * A reference to the Copy Shader belonging to this Pipeline.
         *
         * This shader is used when you call the `copySprite` method.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#copyShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.60.0
         */
        this.copyShader;

        /**
         * A reference to the Game Draw Shader belonging to this Pipeline.
         *
         * This shader draws the fbo to the game.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#gameShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.60.0
         */
        this.gameShader;

        /**
         * A reference to the Color Matrix Shader belonging to this Pipeline.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#colorMatrixShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @since 3.60.0
         */
        this.colorMatrixShader;

        /**
         * Raw byte buffer of vertices used specifically during the copySprite method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#quadVertexData
         * @type {ArrayBuffer}
         * @readonly
         * @since 3.60.0
         */
        this.quadVertexData;

        /**
         * The WebGLBuffer that holds the quadVertexData.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#quadVertexBuffer
         * @type {WebGLBuffer}
         * @readonly
         * @since 3.60.0
         */
        this.quadVertexBuffer;

        /**
         * Float32 view of the quad array buffer.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#quadVertexViewF32
         * @type {Float32Array}
         * @since 3.60.0
         */
        this.quadVertexViewF32;

        /**
         * A temporary Rectangle object re-used internally during sprite drawing.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#spriteBounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.60.0
         */
        this.spriteBounds = new Rectangle();

        /**
         * A temporary Rectangle object re-used internally during sprite drawing.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#targetBounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.60.0
         */
        this.targetBounds = new Rectangle();

        /**
         * The full-screen Render Target that the sprite is first drawn to.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#fsTarget
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.fsTarget;

        /**
         * The most recent Game Object drawn.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#tempSprite
         * @type {Phaser.GameObjects.Sprite}
         * @private
         * @since 3.60.0
         */
        this.tempSprite;

        if (this.renderer.isBooted)
        {
            this.manager = this.renderer.pipelines;

            this.boot();
        }
    },

    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        var shaders = this.shaders;
        var renderer = this.renderer;

        this.drawSpriteShader = shaders[0];
        this.copyShader = shaders[1];
        this.gameShader = shaders[2];
        this.colorMatrixShader = shaders[3];

        //  Our full-screen target (exclusive to this pipeline)
        this.fsTarget = new RenderTarget(renderer, renderer.width, renderer.height, 1, 0, true, true);

        //  Copy by reference the RTs in the PipelineManager, plus add our fsTarget
        this.renderTargets = this.manager.renderTargets.concat(this.fsTarget);

        // 6 verts * 28 bytes
        var data = new ArrayBuffer(168);

        this.quadVertexData = data;

        this.quadVertexViewF32 = new Float32Array(data);

        this.quadVertexBuffer = renderer.createVertexBuffer(data, this.gl.STATIC_DRAW);

        this.onResize(renderer.width, renderer.height);

        //  So calls to set uniforms in onPreRender target the right shader:
        this.currentShader = this.copyShader;
    },

    /**
     * Handles the resizing of the quad vertex data.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#onResize
     * @since 3.60.0
     *
     * @param {number} width - The new width of the quad.
     * @param {number} height - The new height of the quad.
     */
    onResize: function (width, height)
    {
        var vertexViewF32 = this.quadVertexViewF32;

        //  vertexBuffer indexes:

        //  Each vert: [ x, y, u, v, unit, mode, tint ]

        //  0 - 6     - vert 1 - x0/y0
        //  7 - 13    - vert 2 - x1/y1
        //  14 - 20   - vert 3 - x2/y2
        //  21 - 27   - vert 4 - x0/y0
        //  28 - 34   - vert 5 - x2/y2
        //  35 - 41   - vert 6 - x3/y3

        //  Verts
        vertexViewF32[1] = height; // y0
        vertexViewF32[22] = height; // y0
        vertexViewF32[14] = width; // x2
        vertexViewF32[28] = width; // x2
        vertexViewF32[35] = width; // x3
        vertexViewF32[36] = height; // y3
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
     * Where x0 / y0 = 0, x1 / y1 = 1, x2 / y2 = 2 and x3 / y3 = 3
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#batchQuad
     * @since 3.60.0
     *
     * @param {(Phaser.GameObjects.GameObject|null)} gameObject - The Game Object, if any, drawing this quad.
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
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (gameObject, x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture)
    {
        var bx = Math.min(x0, x1, x2, x3);
        var by = Math.min(y0, y1, y2, y3);
        var br = Math.max(x0, x1, x2, x3);
        var bb = Math.max(y0, y1, y2, y3);
        var bw = br - bx;
        var bh = bb - by;

        var bounds = this.spriteBounds.setTo(bx, by, bw, bh);

        var padding = (gameObject) ? gameObject.preFX.padding : 0;
        var width = bw + (padding * 2);
        var height = bh + (padding * 2);
        var maxDimension = Math.abs(Math.max(width, height));

        var target = this.manager.getRenderTarget(maxDimension);

        var targetBounds = this.targetBounds.setTo(0, 0, target.width, target.height);

        //  targetBounds is the same size as the fbo and centered on the spriteBounds
        //  so we can use it when we re-render this back to the game
        CenterOn(targetBounds, bounds.centerX, bounds.centerY);

        this.tempSprite = gameObject;

        //  Now draw the quad
        var gl = this.gl;
        var renderer = this.renderer;

        renderer.clearStencilMask();

        this.setShader(this.drawSpriteShader);

        this.set1i('uMainSampler', 0);

        this.flipProjectionMatrix(true);

        if (gameObject)
        {
            this.onDrawSprite(gameObject, target);

            gameObject.preFX.onFX(this);
        }

        var fsTarget = this.fsTarget;

        this.flush();

        gl.viewport(0, 0, renderer.width, renderer.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fsTarget.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fsTarget.texture, 0);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.setTexture2D(texture);

        this.batchVert(x0, y0, u0, v0, 0, tintEffect, tintTL);
        this.batchVert(x1, y1, u0, v1, 0, tintEffect, tintBL);
        this.batchVert(x2, y2, u1, v1, 0, tintEffect, tintBR);

        this.batchVert(x0, y0, u0, v0, 0, tintEffect, tintTL);
        this.batchVert(x2, y2, u1, v1, 0, tintEffect, tintBR);
        this.batchVert(x3, y3, u1, v0, 0, tintEffect, tintTR);

        this.flush();

        this.flipProjectionMatrix(false);

        //  Now we've got the sprite drawn to our screen-sized fbo, copy the rect we need to our target

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, target.texture);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, targetBounds.x, targetBounds.y, targetBounds.width, targetBounds.height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);

        //  We've drawn the sprite to the target (using our pipeline shader)
        //  we can pass it to the pipeline in case they want to do further
        //  manipulations with it, post-fx style, then we need to draw the
        //  results back to the game in the correct position

        this.onBatch(gameObject);

        //  Set this here, so we can immediately call the set uniform functions and it'll work on the correct shader
        this.currentShader = this.copyShader;

        this.onDraw(target, this.manager.getSwapRenderTarget(), this.manager.getAltSwapRenderTarget());

        return true;
    },

    /**
     * This callback is invoked when a sprite is drawn by this pipeline.
     *
     * It will fire after the shader has been set, but before the sprite has been drawn,
     * so use it to set any additional uniforms you may need.
     *
     * Note: Manipulating the Sprite during this callback will _not_ change how it is drawn to the Render Target.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#onDrawSprite
     * @since 3.60.0
     *
     * @param {Phaser.GameObjects.Sprite} gameObject - The Sprite being drawn.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The Render Target the Sprite will be drawn to.
     */
    onDrawSprite: function ()
    {
    },

    /**
     * This callback is invoked when you call the `copySprite` method.
     *
     * It will fire after the shader has been set, but before the source target has been copied,
     * so use it to set any additional uniforms you may need.
     *
     * Note: Manipulating the Sprite during this callback will _not_ change the Render Targets.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#onCopySprite
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target being copied from.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target that will be copied to.
     * @param {Phaser.GameObjects.Sprite} gameObject - The Sprite being copied.
     */
    onCopySprite: function ()
    {
    },

    /**
     * Copy the `source` Render Target to the `target` Render Target.
     *
     * No target resizing takes place. If the `source` Render Target is larger than the `target`,
     * then only a portion the same size as the `target` dimensions is copied across.
     *
     * Calling this method will invoke the `onCopySprite` handler and will also call
     * the `onFXCopy` callback on the Sprite. Both of these happen prior to the copy, allowing you
     * to use them to set shader uniforms and other values.
     *
     * You can optionally pass in a ColorMatrix. If so, it will use the ColorMatrix shader
     * during the copy, allowing you to manipulate the colors to a fine degree.
     * See the `ColorMatrix` class for more details.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#copySprite
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target being copied from.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target that will be copied to.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {boolean} [eraseMode=false] - Erase source from target using ERASE Blend Mode?
     * @param {Phaser.Display.ColorMatrix} [colorMatrix] - Optional ColorMatrix to use when copying the Sprite.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [shader] - The shader to use to copy the target. Defaults to the `copyShader`.
     */
    copySprite: function (source, target, clear, clearAlpha, eraseMode, colorMatrix, shader)
    {
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }
        if (eraseMode === undefined) { eraseMode = false; }
        if (shader === undefined) { shader = this.copyShader; }

        var gl = this.gl;
        var sprite = this.tempSprite;

        if (colorMatrix)
        {
            shader = this.colorMatrixShader;
        }

        this.currentShader = shader;

        var wasBound = this.setVertexBuffer(this.quadVertexBuffer);

        shader.bind(wasBound, false);

        this.set1i('uMainSampler', 0);

        sprite.preFX.onFXCopy(this);

        this.onCopySprite(source, target, sprite);

        if (colorMatrix)
        {
            this.set1fv('uColorMatrix', colorMatrix.getData());
            this.set1f('uAlpha', colorMatrix.alpha);
        }

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

            this.resetUVs();
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);

        if (clear)
        {
            gl.clearColor(0, 0, 0, Number(!clearAlpha));

            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        if (eraseMode)
        {
            var blendMode = this.renderer.currentBlendMode;

            this.renderer.setBlendMode(BlendModes.ERASE);
        }

        gl.bufferData(gl.ARRAY_BUFFER, this.quadVertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (eraseMode)
        {
            this.renderer.setBlendMode(blendMode);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },

    /**
     * Draws the `source` Render Target to the `target` Render Target.
     *
     * This is done using whatever the currently bound shader is. This method does
     * not set a shader. All it does is bind the source texture, set the viewport and UVs
     * then bind the target framebuffer, clears it and draws the source to it.
     *
     * At the end a null framebuffer is bound. No other clearing-up takes place, so
     * use this method carefully.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#copy
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target.
     */
    copy: function (source, target)
    {
        var gl = this.gl;

        this.set1i('uMainSampler', 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        //  source and target must always be the same size
        gl.viewport(0, 0, source.width, source.height);

        this.setUVs(0, 0, 0, 1, 1, 1, 1, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bufferData(gl.ARRAY_BUFFER, this.quadVertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using a linear blend effect, which is controlled by the `strength` parameter.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#blendFrames
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#blendFramesAdditive
     * @since 3.60.0
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
     * This method will copy the given Render Target to the game canvas using the `copyShader`.
     *
     * This applies the results of the copy shader during the draw.
     *
     * If you wish to copy the target without any effects see the `copyToGame` method instead.
     *
     * This method should be the final thing called in your pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#drawToGame
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw to the game.
     */
    drawToGame: function (source)
    {
        this.currentShader = null;

        this.setShader(this.copyShader);

        this.bindAndDraw(source);
    },

    /**
     * This method will copy the given Render Target to the game canvas using the `gameShader`.
     *
     * Unless you've changed it, the `gameShader` copies the target without modifying it, just
     * ensuring it is placed in the correct location on the canvas.
     *
     * If you wish to draw the target with and apply the fragment shader at the same time,
     * see the `drawToGame` method instead.
     *
     * This method should be the final thing called in your pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#copyToGame
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to copy to the game.
     */
    copyToGame: function (source)
    {
        this.currentShader = null;

        this.setShader(this.gameShader);

        this.bindAndDraw(source);
    },

    /**
     * This method is called by `drawToGame` and `copyToGame`. It takes the source Render Target
     * and copies it back to the game canvas, or the next frame buffer in the stack, and should
     * be considered the very last thing this pipeline does.
     *
     * You don't normally need to call this method, or override it, however it is left public
     * should you wish to do so.
     *
     * Note that it does _not_ set a shader. You should do this yourself if invoking this.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#bindAndDraw
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw to the game.
     */
    bindAndDraw: function (source)
    {
        var gl = this.gl;
        var renderer = this.renderer;

        this.set1i('uMainSampler', 0);

        if (this.customMainSampler)
        {
            this.setTexture2D(this.customMainSampler);
        }
        else
        {
            this.setTexture2D(source.texture);
        }

        var matrix = this._tempMatrix1.loadIdentity();

        var x = this.targetBounds.x;
        var y = this.targetBounds.y;

        var xw = x + source.width;
        var yh = y + source.height;

        var x0 = matrix.getX(x, y);
        var x1 = matrix.getX(x, yh);
        var x2 = matrix.getX(xw, yh);
        var x3 = matrix.getX(xw, y);

        //  Regular verts
        var y0 = matrix.getY(x, y);
        var y1 = matrix.getY(x, yh);
        var y2 = matrix.getY(xw, yh);
        var y3 = matrix.getY(xw, y);

        //  Flip verts:
        // var y0 = matrix.getY(x, yh);
        // var y1 = matrix.getY(x, y);
        // var y2 = matrix.getY(xw, y);
        // var y3 = matrix.getY(xw, yh);

        var white = 0xffffff;

        this.batchVert(x0, y0, 0, 0, 0, 0, white);
        this.batchVert(x1, y1, 0, 1, 0, 0, white);
        this.batchVert(x2, y2, 1, 1, 0, 0, white);
        this.batchVert(x0, y0, 0, 0, 0, 0, white);
        this.batchVert(x2, y2, 1, 1, 0, 0, white);
        this.batchVert(x3, y3, 1, 0, 0, 0, white);

        renderer.restoreFramebuffer(false, true);

        if (!renderer.currentFramebuffer)
        {
            gl.viewport(0, 0, renderer.width, renderer.height);
        }

        renderer.restoreStencilMask();

        this.flush();

        //  Clear the source framebuffer out, ready for the next pass
        // gl.clearColor(0, 0, 0, 0);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, source.framebuffer);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //  No hanging references
        this.tempSprite = null;
    },

    /**
     * This method is called every time the `batchSprite` method is called and is passed a
     * reference to the current render target.
     *
     * If you override this method, then it should make sure it calls either the
     * `drawToGame` or `copyToGame` methods as the final thing it does. However, you can do as
     * much additional processing as you like prior to this.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#onDraw
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The Render Target to draw to the game.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [swapTarget] - The Swap Render Target, useful for double-buffer effects.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [altSwapTarget] - The Swap Render Target, useful for double-buffer effects.
     */
    onDraw: function (target)
    {
        this.drawToGame(target);
    },

    /**
     * Set the UV values for the 6 vertices that make up the quad used by the copy shader.
     *
     * Be sure to call `resetUVs` once you have finished manipulating the UV coordinates.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#setUVs
     * @since 3.60.0
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
        var vertexViewF32 = this.quadVertexViewF32;

        vertexViewF32[2] = uA;
        vertexViewF32[3] = vA;

        vertexViewF32[9] = uB;
        vertexViewF32[10] = vB;

        vertexViewF32[16] = uC;
        vertexViewF32[17] = vC;

        vertexViewF32[23] = uA;
        vertexViewF32[24] = vA;

        vertexViewF32[30] = uC;
        vertexViewF32[31] = vC;

        vertexViewF32[37] = uD;
        vertexViewF32[38] = vD;
    },

    /**
     * Sets the vertex UV coordinates of the quad used by the copy shaders
     * so that they correctly adjust the texture coordinates for a blit frame effect.
     *
     * Be sure to call `resetUVs` once you have finished manipulating the UV coordinates.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#setTargetUVs
     * @since 3.60.0
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
     * Resets the quad vertice UV values to their default settings.
     *
     * The quad is used by the copy shader in this pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#resetUVs
     * @since 3.60.0
     */
    resetUVs: function ()
    {
        this.setUVs(0, 0, 0, 1, 1, 1, 1, 0);
    },

    /**
     * Destroys all shader instances, removes all object references and nulls all external references.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.PreFXPipeline#destroy
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#DESTROY
     * @since 3.60.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        this.gl.deleteBuffer(this.quadVertexBuffer);

        this.drawSpriteShader = null;
        this.copyShader = null;
        this.gameShader = null;
        this.colorMatrixShader = null;

        this.quadVertexData = null;
        this.quadVertexBuffer = null;
        this.quadVertexViewF32 = null;

        this.fsTarget = null;
        this.tempSprite = null;

        MultiPipeline.prototype.destroy.call(this);

        return this;
    }

});

module.exports = PreFXPipeline;
