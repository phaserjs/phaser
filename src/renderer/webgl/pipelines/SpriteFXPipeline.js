/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CenterOn = require('../../../geom/rectangle/CenterOn');
var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var SingleQuadFS = require('../shaders/Single-frag.js');
var SingleQuadVS = require('../shaders/Single-vert.js');
var PostFXFS = require('../shaders/PostFX-frag.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Utils = require('../Utils');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');
var SnapFloor = require('../../../math/snap/SnapFloor');

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
        var sizes = [ { scale: 1 } ];

        for (var i = 1; i <= 16; i++)
        {
            sizes.push({ width: i * 64 });
        }

        config.renderTarget = GetFastValue(config, 'renderTarget', sizes);

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

        // config.vertices = [
        //     -1, -1, 0, 0,
        //     -1, 1, 0, 1,
        //     1, 1, 1, 1,
        //     -1, -1, 0, 0,
        //     1, 1, 1, 1,
        //     1, -1, 1, 0
        // ];

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
         * A reference to the Full Frame 1 Render Target.
         *
         * This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.UtilityPipeline#fullFrame
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @since 3.60.0
         */
        this.fullFrame;

        /**
         * A reference to the Draw Sprite Shader belonging to this Pipeline.
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
         * This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#copyShader
         * @type {Phaser.Renderer.WebGL.WebGLShader}
         * @default null
         * @since 3.60.0
         */
        this.copyShader;

        this.drawToFrame = false;

        this.bounds = new Rectangle();

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
        var targets = this.renderTargets;

        this.drawSpriteShader = shaders[0];
        this.copyShader = shaders[1];

        this.fullFrame1 = targets[0];

        console.log(this.vertexData);
        console.log(this.renderTargets);
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
        this.manager.set(this, gameObject);

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var frame = gameObject.frame;
        var texture = frame.glTexture;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;
        var frameX = frame.x;
        var frameY = frame.y;
        var frameWidth = frame.cutWidth;
        var frameHeight = frame.cutHeight;
        var customPivot = frame.customPivot;

        var displayOriginX = gameObject.displayOriginX;
        var displayOriginY = gameObject.displayOriginY;

        var x = -displayOriginX + frameX;
        var y = -displayOriginY + frameY;

        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;

            if (crop.flipX !== gameObject.flipX || crop.flipY !== gameObject.flipY)
            {
                frame.updateCropUVs(crop, gameObject.flipX, gameObject.flipY);
            }

            u0 = crop.u0;
            v0 = crop.v0;
            u1 = crop.u1;
            v1 = crop.v1;

            frameWidth = crop.width;
            frameHeight = crop.height;

            frameX = crop.x;
            frameY = crop.y;

            x = -displayOriginX + frameX;
            y = -displayOriginY + frameY;
        }

        var flipX = 1;
        var flipY = 1;

        if (gameObject.flipX)
        {
            if (!customPivot)
            {
                x += (-frame.realWidth + (displayOriginX * 2));
            }

            flipX = -1;
        }

        //  Auto-invert the flipY if this is coming from a GLTexture

        if (gameObject.flipY || (frame.source.isGLTexture && !texture.flipY))
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        spriteMatrix.applyITRS(gameObject.x, gameObject.y, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = gameObject.x;
            spriteMatrix.f = gameObject.y;
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * gameObject.scrollFactorY;
        }

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        var xw = x + frameWidth;
        var yh = y + frameHeight;

        var roundPixels = camera.roundPixels;

        var tx0 = calcMatrix.getXRound(x, y, roundPixels);
        var ty0 = calcMatrix.getYRound(x, y, roundPixels);

        var tx1 = calcMatrix.getXRound(x, yh, roundPixels);
        var ty1 = calcMatrix.getYRound(x, yh, roundPixels);

        var tx2 = calcMatrix.getXRound(xw, yh, roundPixels);
        var ty2 = calcMatrix.getYRound(xw, yh, roundPixels);

        var tx3 = calcMatrix.getXRound(xw, y, roundPixels);
        var ty3 = calcMatrix.getYRound(xw, y, roundPixels);

        var getTint = Utils.getTintAppendFloatAlpha;
        var cameraAlpha = camera.alpha;

        var tintTL = getTint(gameObject.tintTopLeft, cameraAlpha * gameObject._alphaTL);
        var tintTR = getTint(gameObject.tintTopRight, cameraAlpha * gameObject._alphaTR);
        var tintBL = getTint(gameObject.tintBottomLeft, cameraAlpha * gameObject._alphaBL);
        var tintBR = getTint(gameObject.tintBottomRight, cameraAlpha * gameObject._alphaBR);

        if (this.shouldFlush(6))
        {
            this.flush();
        }

        this.manager.preBatch(gameObject);

        if (this.drawToFrame)
        {
            this.drawSpriteToFBO(gameObject, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, gameObject.tintFill, texture);
        }
        else
        {
            this.renderer.setTextureZero(texture);

            WebGLPipeline.prototype.batchQuad.call(this, gameObject, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, gameObject.tintFill, texture, 0);

            this.flush();

            this.renderer.clearTextureZero();
        }

        this.manager.postBatch(gameObject);
    },

    drawSpriteToFBO: function (gameObject, x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture)
    {
        // console.log('drawSpriteToFBO');

        var padding = gameObject.fxPadding;

        //  quad bounds
        var bounds = this.bounds;

        var bx = Math.min(x0, x1, x2, x3);
        var by = Math.min(y0, y1, y2, y3);
        var br = Math.max(x0, x1, x2, x3);
        var bb = Math.max(y0, y1, y2, y3);
        var bw = br - bx;
        var bh = bb - by;

        var width = bw + (padding * 2);
        var height = bh + (padding * 2);

        var size = Math.max(width, height);

        bounds.setTo(bx, by, bw, bh);

        var target = this.getFrameFromSize(size);

        CenterOn(bounds, target.width / 2, target.height / 2);

        //  set the target fbo
        var gl = this.gl;

        this.setShader(this.drawSpriteShader);

        this.set1i('uMainSampler', 0);

        this.renderer.setTextureZero(texture);

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //  we can now get the bounds offset and apply to the verts
        var ox = bx - bounds.x;
        var oy = bounds.y - by;

        this.batchVert(x0 - ox, y0 - oy, u0, v0, 0, tintEffect, tintTL);
        this.batchVert(x1 - ox, y1 - oy, u0, v1, 0, tintEffect, tintBL);
        this.batchVert(x2 - ox, y2 - oy, u1, v1, 0, tintEffect, tintBR);
        this.batchVert(x0 - ox, y0 - oy, u0, v0, 0, tintEffect, tintTL);
        this.batchVert(x2 - ox, y2 - oy, u1, v1, 0, tintEffect, tintBR);
        this.batchVert(x3 - ox, y3 - oy, u1, v0, 0, tintEffect, tintTR);

        this.flush();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.renderer.clearTextureZero();

        //  Now we've drawn the sprite to the target (using our pipeline shader)
        //  we can pass it to the pipeline in case they want to do further
        //  manipulations with it, post-fx style, then we need to draw the
        //  results back to the game in the correct position

        this.onBatch(gameObject);

        this.onDraw(target);

        return true;
    },

    getFrameFromSize: function (size)
    {
        if (size > 1024)
        {
            return this.fullFrame;
        }
        else
        {
            var target = SnapFloor(size, 64, 0, true);

            return this.renderTargets[target];
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
