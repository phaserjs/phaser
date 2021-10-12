/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CenterOn = require('../../../geom/rectangle/CenterOn');
var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var MultiPipeline = require('./MultiPipeline');
var PostFXFS = require('../shaders/PostFX-frag.js');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var RenderTarget = require('../RenderTarget');
var SingleQuadFS = require('../shaders/Single-frag.js');
var SingleQuadVS = require('../shaders/Single-vert.js');
var SnapCeil = require('../../../math/snap/SnapCeil');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 *
 * @class SpriteFXPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var SpriteFXPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function SpriteFXPipeline (config)
    {
        config.renderTarget = [ { scale: 1 }, { scale: 1 } ];

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

        var fragShader = GetFastValue(config, 'fragShader', PostFXFS);
        var vertShader = GetFastValue(config, 'vertShader', SingleQuadVS);

        var defaultShaders = [
            {
                name: 'DrawSprite',
                fragShader: SingleQuadFS,
                vertShader: SingleQuadVS
            },
            {
                name: 'Copy',
                fragShader: fragShader,
                vertShader: vertShader
            }
        ];

        var configShaders = GetFastValue(config, 'shaders', []);

        config.shaders = defaultShaders.concat(configShaders);

        config.batchSize = 1;

        WebGLPipeline.call(this, config);

        this.isSpriteFX = true;

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.60.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.60.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.60.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A reference to the Draw Sprite Shader belonging to this Pipeline.
         *
         * This shader is used when the sprite is drawn to this fbo (or to the game if drawToFrame is false)
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#drawSpriteShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.60.0
         */
        this.drawSpriteShader;

        /**
         * A reference to the Copy Shader belonging to this Pipeline.
         *
         * This shader draws the fbo to the game.
         *
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#copyShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.60.0
         */
        this.copyShader;

        this.drawToFrame = false;

        this.maxDimension = 0;

        this.spriteBounds = new Rectangle();
        this.targetBounds = new Rectangle();

        this.spriteData = {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            x3: 0,
            y3: 0,
            u0: 0,
            v0: 0,
            u1: 0,
            v1: 0,
            tintTL: 0,
            tintTR: 0,
            tintBL: 0,
            tintBR: 0,
            tintEffect: 0,
            texture: null,
            textureIndex: 0
        };

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
        var targets = this.renderTargets;

        this.drawSpriteShader = shaders[0];
        this.copyShader = shaders[1];

        var minDimension = Math.min(renderer.width, renderer.height);

        var qty = Math.ceil(minDimension / 64);

        for (var i = 1; i < qty; i++)
        {
            var targetWidth = i * 64;

            targets.push(new RenderTarget(renderer, targetWidth, targetWidth, 1, 0, true));
        }

        //  Duplicate set of RTs for swap frames
        for (i = 1; i < qty; i++)
        {
            targetWidth = i * 64;

            targets.push(new RenderTarget(renderer, targetWidth, targetWidth, 1, 0, true));
        }

        this.maxDimension = (qty - 1) * 64;
    },

    /**
     * Takes a Sprite Game Object, or any object that extends it, and renders it via this pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#batchSprite
     * @since 3.60.0
     *
     * @param {(Phaser.GameObjects.Image|Phaser.GameObjects.Sprite)} gameObject - The texture based Game Object to add to the batch.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the rendering transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The transform matrix of the parent container, if set.
     */
    batchSprite: function (gameObject, camera, parentTransformMatrix)
    {
        //  Proxy this call to the MultiPipeline
        //  batchQuad will intercept the rendering
        MultiPipeline.prototype.batchSprite.call(this, gameObject, camera, parentTransformMatrix);
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
     * Where tx0/ty0 = 0, tx1/ty1 = 1, tx2/ty2 = 2 and tx3/ty3 = 3
     *
     * @method Phaser.Renderer.WebGL.SpriteFXPipeline#batchQuad
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
        if (!this.drawToFrame)
        {
            //  If we're not drawing to the fbo,
            //  we can just pass this on to the WebGLPipeline.batchQuad function
            this.renderer.setTextureZero(texture);

            WebGLPipeline.prototype.batchQuad.call(this, gameObject, x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, gameObject.tintFill, texture, 0);

            this.flush();

            this.renderer.clearTextureZero();

            return true;
        }

        var padding = gameObject.fxPadding;

        //  quad bounds
        var bounds = this.spriteBounds;

        var bx = Math.min(x0, x1, x2, x3);
        var by = Math.min(y0, y1, y2, y3);
        var br = Math.max(x0, x1, x2, x3);
        var bb = Math.max(y0, y1, y2, y3);
        var bw = br - bx;
        var bh = bb - by;

        bounds.setTo(bx, by, bw, bh);

        var width = bw + (padding * 2);
        var height = bh + (padding * 2);
        var maxDimension = Math.abs(Math.max(width, height));

        var target = this.getFrameFromSize(maxDimension);

        var targetBounds = this.targetBounds.setTo(0, 0, target.width, target.height);

        //  targetBounds is the same size as the fbo and centered on the spriteBounds
        //  so we can use it when we re-render this back to the game
        CenterOn(targetBounds, bounds.centerX, bounds.centerY);

        //  Now adjust the position of the sprite bounds to the fbo size
        CenterOn(bounds, target.width / 2, target.height / 2);

        //  we can now get the bounds offset and apply to the verts
        var ox = bounds.x - bx;
        var oy = by - bounds.y;

        var data = this.spriteData;

        data.x0 = x0 + ox;
        data.y0 = y0 + oy;
        data.x1 = x1 + ox;
        data.y1 = y1 + oy;
        data.x2 = x2 + ox;
        data.y2 = y2 + oy;
        data.x3 = x3 + ox;
        data.y3 = y3 + oy;
        data.u0 = u0;
        data.v0 = v0;
        data.u1 = u1;
        data.v1 = v1;
        data.tintEffect = tintEffect;
        data.tintTL = tintTL;
        data.tintBL = tintBL;
        data.tintBR = tintBR;
        data.tintTR = tintTR;
        data.texture = texture;
        data.target = target;

        this.drawSprite(true);

        //  Now we've drawn the sprite to the target (using our pipeline shader)
        //  we can pass it to the pipeline in case they want to do further
        //  manipulations with it, post-fx style, then we need to draw the
        //  results back to the game in the correct position

        this.onBatch(gameObject);

        this.onDraw(target);

        return true;
    },

    drawSprite: function (clear)
    {
        if (clear === undefined) { clear = false; }

        var gl = this.gl;
        var data = this.spriteData;
        var target = data.target;

        this.setShader(this.drawSpriteShader);

        this.set1i('uMainSampler', 0);

        this.renderer.setTextureZero(data.texture);

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);

        if (clear)
        {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        var tintEffect = data.tintEffect;

        this.batchVert(data.x0, data.y0, data.u0, data.v0, 0, tintEffect, data.tintTL);
        this.batchVert(data.x1, data.y1, data.u0, data.v1, 0, tintEffect, data.tintBL);
        this.batchVert(data.x2, data.y2, data.u1, data.v1, 0, tintEffect, data.tintBR);
        this.batchVert(data.x0, data.y0, data.u0, data.v0, 0, tintEffect, data.tintTL);
        this.batchVert(data.x2, data.y2, data.u1, data.v1, 0, tintEffect, data.tintBR);
        this.batchVert(data.x3, data.y3, data.u1, data.v0, 0, tintEffect, data.tintTR);

        this.flush();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.renderer.clearTextureZero();
    },

    getFrameFromSize: function (size)
    {
        var targets = this.renderTargets;

        if (size > this.maxDimension)
        {
            this.spriteData.textureIndex = 0;

            return targets[0];
        }
        else
        {
            //  +1 because we've got 2 fullFrames at the start of the targets array
            var index = SnapCeil(size, 64, 0, true) + 1;

            this.spriteData.textureIndex = index;

            return targets[index];
        }
    },

    getSwapFrame: function ()
    {
        var targets = this.renderTargets;
        var index = this.spriteData.textureIndex;

        if (index === 0)
        {
            return targets[1];
        }
        else
        {
            return targets[index + this.maxDimension];
        }
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#copyFrame
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#copyToGame
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#drawFrame
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#blendFrames
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#blendFramesAdditive
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
     * Clears the given Render Target.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#clearFrame
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#blitFrame
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#copyFrameRect
     * @since 3.60.0
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#bindAndDraw
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw from.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The Render Target to draw to. If not set, it will pop the fbo from the stack.
     * @param {boolean} [clear=true] - Clear the target before copying? Only used if `target` parameter is set.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     */
    bindAndDraw: function (source, target, clear, clearAlpha)
    {
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }

        var gl = this.gl;
        var renderer = this.renderer;

        this.bind(this.copyShader);

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

        var matrix = this._tempMatrix1.loadIdentity();

        var x = this.targetBounds.x;
        var y = this.targetBounds.y;

        var xw = x + source.width;
        var yh = y + source.height;

        var x0 = matrix.getX(x, y);
        var y0 = matrix.getY(x, y);

        var x1 = matrix.getX(x, yh);
        var y1 = matrix.getY(x, yh);

        var x2 = matrix.getX(xw, yh);
        var y2 = matrix.getY(xw, yh);

        var x3 = matrix.getX(xw, y);
        var y3 = matrix.getY(xw, y);

        // default

        // var uA = 0;
        // var vA = 0;
        // var uB = 0;
        // var vB = 1;
        // var uC = 1;
        // var vC = 1;
        // var uD = 1;
        // var vD = 0;

        //  flipped y:

        var uA = 0;
        var vA = 1;
        var uB = 0;
        var vB = 0;
        var uC = 1;
        var vC = 0;
        var uD = 1;
        var vD = 1;

        this.batchVert(x0, y0, uA, vA, 0, 0xffffff, 0);
        this.batchVert(x1, y1, uB, vB, 0, 0xffffff, 0);
        this.batchVert(x2, y2, uC, vC, 0, 0xffffff, 0);
        this.batchVert(x0, y0, uA, vA, 0, 0xffffff, 0);
        this.batchVert(x2, y2, uC, vC, 0, 0xffffff, 0);
        this.batchVert(x3, y3, uD, vD, 0, 0xffffff, 0);

        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (!target)
        {
            renderer.resetTextures();
        }
        else
        {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }

});

module.exports = SpriteFXPipeline;
