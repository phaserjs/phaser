/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../../BlendModes');
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
                name: 'CopyFrame',
                fragShader: fragShader,
                vertShader: vertShader
            },
            {
                name: 'DrawGame',
                fragShader: PostFXFS,
                vertShader: SingleQuadVS
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

        this.gameShader;

        /**
         * Raw byte buffer of vertices.
         *
         * Either set via the config object `vertices` property, or generates a new Array Buffer of
         * size `vertexCapacity * vertexSize`.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexData
         * @type {ArrayBuffer}
         * @readonly
         * @since 3.0.0
         */
        this.quadVertexData;

        /**
          * The WebGLBuffer that holds the vertex data.
          *
          * Created from the `vertexData` ArrayBuffer. If `vertices` are set in the config, a `STATIC_DRAW` buffer
          * is created. If not, a `DYNAMIC_DRAW` buffer is created.
          *
          * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexBuffer
          * @type {WebGLBuffer}
          * @readonly
          * @since 3.0.0
          */
        this.quadVertexBuffer;

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.WebGLPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.quadVertexViewF32;

        this.drawToFrame = false;

        this.maxDimension = 0;
        this.swapTargetIndex = 0;

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
        this.gameShader = shaders[2];

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
        this.swapTargetIndex = (qty - 1);

        var data = new ArrayBuffer(6 * 28);

        this.quadVertexData = data;

        this.quadVertexViewF32 = new Float32Array(data);

        this.onResize(renderer.width, renderer.height);

        this.quadVertexBuffer = renderer.createVertexBuffer(data, this.gl.STATIC_DRAW);
    },

    onResize: function (width, height)
    {
        var vertexViewF32 = this.quadVertexViewF32;

        vertexViewF32[8] = height;
        vertexViewF32[14] = width;
        vertexViewF32[15] = height;
        vertexViewF32[28] = width;
        vertexViewF32[29] = height;
        vertexViewF32[35] = width;

        vertexViewF32[10] = 1;
        vertexViewF32[16] = 1;
        vertexViewF32[17] = 1;
        vertexViewF32[30] = 1;
        vertexViewF32[31] = 1;
        vertexViewF32[37] = 1;
    },

    /*
    var x0 = 0;
    var y0 = 0;
    var x1 = 0;
    var y1 = height;
    var x2 = width;
    var y2 = height;
    var x3 = width;
    var y3 = 0;
    var u0 = 0;
    var v0 = 0;
    var u1 = 1;
    var v1 = 1;

    this.batchQuadVert(0, x0, y0, u0, v0); // 0 - 6
    this.batchQuadVert(1, x1, y1, u0, v1); // 7 - 13
    this.batchQuadVert(2, x2, y2, u1, v1); // 14 - 20
    this.batchQuadVert(3, x0, y0, u0, v0); // 21 - 27
    this.batchQuadVert(4, x2, y2, u1, v1); // 28 - 34
    this.batchQuadVert(5, x3, y3, u1, v0); // 35 - 41

    batchQuadVert: function (i, x, y, u, v)
    {
        var vertexViewF32 = this.quadVertexViewF32;
        var vertexViewU32 = this.quadVertexViewU32;

        var vertexOffset = (i * 7) - 1;

        vertexViewF32[++vertexOffset] = x;
        vertexViewF32[++vertexOffset] = y;
        vertexViewF32[++vertexOffset] = u;
        vertexViewF32[++vertexOffset] = v;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewF32[++vertexOffset] = 0;
        vertexViewU32[++vertexOffset] = 0xffffff;
    },
    */

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
        this.setShader(this.drawSpriteShader);

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

        this.drawSprite(target, true);

        //  Now we've drawn the sprite to the target (using our pipeline shader)
        //  we can pass it to the pipeline in case they want to do further
        //  manipulations with it, post-fx style, then we need to draw the
        //  results back to the game in the correct position

        this.onBatch(gameObject);

        //  Set this here, so we can immediately call the set uniform functions and it'll work on the correct shader
        this.setShader(this.copyShader, true, this.quadVertexBuffer);

        this.onDraw(target, this.getSwapFrame());

        return true;
    },

    drawSprite: function (target, clear)
    {
        if (clear === undefined) { clear = false; }

        var gl = this.gl;
        var data = this.spriteData;

        this.setShader(this.drawSpriteShader);

        this.set1i('uMainSampler', 0);

        this.renderer.setTextureZero(data.texture);

        gl.viewport(0, 0, this.renderer.width, this.renderer.height);
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
            return targets[index + this.swapTargetIndex];
        }
    },

    onDraw: function (target)
    {
        this.drawToGame(target);
    },

    //  Draws source to target using the copyShader (which you override in your pipeline)
    copyFrame: function (source, target, clear, clearAlpha, eraseMode)
    {
        if (clear === undefined) { clear = true; }
        if (clearAlpha === undefined) { clearAlpha = true; }
        if (eraseMode === undefined) { eraseMode = false; }

        var gl = this.gl;

        this.setShader(this.copyShader, true, this.quadVertexBuffer);

        this.set1i('uMainSampler', 0);

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

        gl.bufferData(gl.ARRAY_BUFFER, this.quadVertexData, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (eraseMode)
        {
            this.renderer.setBlendMode(blendMode);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
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
     * @method Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline#drawToGame
     * @since 3.60.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw from.
     */
    drawToGame: function (source, useCopyShader)
    {
        if (useCopyShader === undefined) { useCopyShader = true; }

        var gl = this.gl;
        var renderer = this.renderer;

        this.currentShader = null;

        if (useCopyShader)
        {
            this.setShader(this.copyShader);
        }
        else
        {
            this.setShader(this.gameShader);
        }

        this.set1i('uMainSampler', 0);

        renderer.popFramebuffer(false, false, false);

        if (!renderer.currentFramebuffer)
        {
            gl.viewport(0, 0, renderer.width, renderer.height);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);

        var matrix = this._tempMatrix1.loadIdentity();

        var x = this.targetBounds.x;
        var y = this.targetBounds.y;

        var xw = x + source.width;
        var yh = y + source.height;

        var x0 = matrix.getX(x, y);
        var x1 = matrix.getX(x, yh);
        var x2 = matrix.getX(xw, yh);
        var x3 = matrix.getX(xw, y);

        var y0 = matrix.getY(x, y);
        var y1 = matrix.getY(x, yh);
        var y2 = matrix.getY(xw, yh);
        var y3 = matrix.getY(xw, y);

        this.batchVert(x0, y0, 0, 0, 0, 0, 0xffffff);
        this.batchVert(x1, y1, 0, 1, 0, 0, 0xffffff);
        this.batchVert(x2, y2, 1, 1, 0, 0, 0xffffff);
        this.batchVert(x0, y0, 0, 0, 0, 0, 0xffffff);
        this.batchVert(x2, y2, 1, 1, 0, 0, 0xffffff);
        this.batchVert(x3, y3, 1, 0, 0, 0, 0xffffff);

        this.flush();

        renderer.resetTextures();
    }

});

module.exports = SpriteFXPipeline;
