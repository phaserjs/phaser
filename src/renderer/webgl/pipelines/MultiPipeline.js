/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/Multi-frag.js');
var ShaderSourceVS = require('../shaders/Multi-vert.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Utils = require('../Utils');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 *
 * The Multi Pipeline is the core 2D texture rendering pipeline used by Phaser in WebGL.
 * Virtually all Game Objects use this pipeline by default, including Sprites, Graphics
 * and Tilemaps. It handles the batching of quads and tris, as well as methods for
 * drawing and batching geometry data.
 *
 * Prior to Phaser v3.50 this pipeline was called the `TextureTintPipeline`.
 *
 * In previous versions of Phaser only one single texture unit was supported at any one time.
 * The Multi Pipeline is an evolution of the old Texture Tint Pipeline, updated to support
 * multi-textures for increased performance.
 *
 * The fragment shader it uses can be found in `shaders/src/Multi.frag`.
 * The vertex shader it uses can be found in `shaders/src/Multi.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 * `inTexId` (float, offset 16)
 * `inTintEffect` (float, offset 20)
 * `inTint` (vec4, offset 24, normalized)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uViewMatrix` (mat4)
 * `uModelMatrix` (mat4)
 * `uMainSampler` (sampler2D array)
 *
 * If you wish to create a custom pipeline extending from this one, you can use two string
 * declarations in your fragment shader source: `%count%` and `%forloop%`, where `count` is
 * used to set the number of `sampler2Ds` available, and `forloop` is a block of GLSL code
 * that will get the currently bound texture unit.
 *
 * This pipeline will automatically inject that code for you, should those values exist
 * in your shader source. If you wish to handle this yourself, you can also use the
 * function `Utils.parseFragmentShaderMaxTextures`.
 *
 * If you wish to create a pipeline that works from a single texture, or that doesn't have
 * internal texture iteration, please see the `SinglePipeline` instead.
 *
 * @class MultiPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var MultiPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function MultiPipeline (config)
    {
        var renderer = config.game.renderer;

        var fragmentShaderSource = GetFastValue(config, 'fragShader', ShaderSourceFS);

        config.fragShader = Utils.parseFragmentShaderMaxTextures(fragmentShaderSource, renderer.maxTextures);
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS);
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
            },
            {
                name: 'inTexId',
                size: 1,
                type: WEBGL_CONST.FLOAT
            },
            {
                name: 'inTintEffect',
                size: 1,
                type: WEBGL_CONST.FLOAT
            },
            {
                name: 'inTint',
                size: 4,
                type: WEBGL_CONST.UNSIGNED_BYTE,
                normalized: true
            }
        ]);
        config.uniforms = GetFastValue(config, 'uniforms', [
            'uProjectionMatrix',
            'uViewMatrix',
            'uModelMatrix',
            'uMainSampler'
        ]);

        WebGLPipeline.call(this, config);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix3 = new TransformMatrix();
    },

    /**
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#bind
     * @since 3.50.0
     *
     * @param {boolean} [reset=false] - Should the pipeline be fully re-bound after a renderer pipeline clear?
     *
     * @return {this} This WebGLPipeline instance.
     */
    bind: function (reset)
    {
        if (reset === undefined) { reset = false; }

        WebGLPipeline.prototype.bind.call(this, reset);

        this.currentShader.set1iv('uMainSampler', this.renderer.textureIndexes);

        return this;
    },

    /**
     * Assigns a texture to the current batch. If a different texture is already set it creates a new batch object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#setTexture2D
     * @since 3.1.0
     *
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch. If not given uses blankTexture.
     *
     * @return {number} The assigned texture unit.
     */
    setTexture2D: function (texture)
    {
        if (texture === undefined) { texture = this.renderer.whiteTexture.glTexture; }

        this.currentUnit = this.renderer.setTexture2D(texture);

        return this.currentUnit;
    },

    /**
     * Takes a Sprite Game Object, or any object that extends it, and adds it to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.Image|Phaser.GameObjects.Sprite)} sprite - The texture based Game Object to add to the batch.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the rendering transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The transform matrix of the parent container, if set.
     */
    batchSprite: function (sprite, camera, parentTransformMatrix)
    {
        //  Will cause a flush if this isn't the current pipeline, vertexbuffer or program
        this.renderer.pipelines.set(this);

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var frame = sprite.frame;
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

        var displayOriginX = sprite.displayOriginX;
        var displayOriginY = sprite.displayOriginY;

        var x = -displayOriginX + frameX;
        var y = -displayOriginY + frameY;

        if (sprite.isCropped)
        {
            var crop = sprite._crop;

            if (crop.flipX !== sprite.flipX || crop.flipY !== sprite.flipY)
            {
                frame.updateCropUVs(crop, sprite.flipX, sprite.flipY);
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

        if (sprite.flipX)
        {
            if (!customPivot)
            {
                x += (-frame.realWidth + (displayOriginX * 2));
            }

            flipX = -1;
        }

        //  Auto-invert the flipY if this is coming from a GLTexture
        if (sprite.flipY || (frame.source.isGLTexture && !texture.flipY))
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        spriteMatrix.applyITRS(sprite.x, sprite.y, sprite.rotation, sprite.scaleX * flipX, sprite.scaleY * flipY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * sprite.scrollFactorX, -camera.scrollY * sprite.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = sprite.x;
            spriteMatrix.f = sprite.y;
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * sprite.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * sprite.scrollFactorY;
        }

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        var xw = x + frameWidth;
        var yh = y + frameHeight;

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        var tintTL = Utils.getTintAppendFloatAlpha(sprite.tintTopLeft, camera.alpha * sprite._alphaTL);
        var tintTR = Utils.getTintAppendFloatAlpha(sprite.tintTopRight, camera.alpha * sprite._alphaTR);
        var tintBL = Utils.getTintAppendFloatAlpha(sprite.tintBottomLeft, camera.alpha * sprite._alphaBL);
        var tintBR = Utils.getTintAppendFloatAlpha(sprite.tintBottomRight, camera.alpha * sprite._alphaBR);

        if (camera.roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);

            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);

            tx2 = Math.round(tx2);
            ty2 = Math.round(ty2);

            tx3 = Math.round(tx3);
            ty3 = Math.round(ty3);
        }

        //  So batchQuad never assigns a unit to the glTexture, but to the textureSource instead
        if (this.shouldFlush(6))
        {
            this.flush();
        }

        var unit = this.setGameObject(sprite);

        var tintEffect = sprite.tintFill;

        this.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, unit);
    },

    /**
     * Generic function for batching a textured quad using argument values instead of a Game Object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchTexture
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Source GameObject.
     * @param {WebGLTexture} texture - Raw WebGLTexture associated with the quad.
     * @param {integer} textureWidth - Real texture width.
     * @param {integer} textureHeight - Real texture height.
     * @param {number} srcX - X coordinate of the quad.
     * @param {number} srcY - Y coordinate of the quad.
     * @param {number} srcWidth - Width of the quad.
     * @param {number} srcHeight - Height of the quad.
     * @param {number} scaleX - X component of scale.
     * @param {number} scaleY - Y component of scale.
     * @param {number} rotation - Rotation of the quad.
     * @param {boolean} flipX - Indicates if the quad is horizontally flipped.
     * @param {boolean} flipY - Indicates if the quad is vertically flipped.
     * @param {number} scrollFactorX - By which factor is the quad affected by the camera horizontal scroll.
     * @param {number} scrollFactorY - By which factor is the quad effected by the camera vertical scroll.
     * @param {number} displayOriginX - Horizontal origin in pixels.
     * @param {number} displayOriginY - Vertical origin in pixels.
     * @param {number} frameX - X coordinate of the texture frame.
     * @param {number} frameY - Y coordinate of the texture frame.
     * @param {number} frameWidth - Width of the texture frame.
     * @param {number} frameHeight - Height of the texture frame.
     * @param {integer} tintTL - Tint for top left.
     * @param {integer} tintTR - Tint for top right.
     * @param {integer} tintBL - Tint for bottom left.
     * @param {integer} tintBR - Tint for bottom right.
     * @param {number} tintEffect - The tint effect.
     * @param {number} uOffset - Horizontal offset on texture coordinate.
     * @param {number} vOffset - Vertical offset on texture coordinate.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current used camera.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - Parent container.
     * @param {boolean} [skipFlip=false] - Skip the renderTexture check.
     * @param {number} [textureUnit] - Use the currently bound texture unit?
     */
    batchTexture: function (
        gameObject,
        texture,
        textureWidth, textureHeight,
        srcX, srcY,
        srcWidth, srcHeight,
        scaleX, scaleY,
        rotation,
        flipX, flipY,
        scrollFactorX, scrollFactorY,
        displayOriginX, displayOriginY,
        frameX, frameY, frameWidth, frameHeight,
        tintTL, tintTR, tintBL, tintBR, tintEffect,
        uOffset, vOffset,
        camera,
        parentTransformMatrix,
        skipFlip,
        textureUnit)
    {
        var renderer = this.renderer;

        renderer.pipelines.set(this, gameObject);

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var u0 = (frameX / textureWidth) + uOffset;
        var v0 = (frameY / textureHeight) + vOffset;
        var u1 = (frameX + frameWidth) / textureWidth + uOffset;
        var v1 = (frameY + frameHeight) / textureHeight + vOffset;

        var width = srcWidth;
        var height = srcHeight;

        var x = -displayOriginX;
        var y = -displayOriginY;

        if (gameObject.isCropped)
        {
            var crop = gameObject._crop;

            width = crop.width;
            height = crop.height;

            srcWidth = crop.width;
            srcHeight = crop.height;

            frameX = crop.x;
            frameY = crop.y;

            var ox = frameX;
            var oy = frameY;

            if (flipX)
            {
                ox = (frameWidth - crop.x - crop.width);
            }

            if (flipY && !texture.isRenderTexture)
            {
                oy = (frameHeight - crop.y - crop.height);
            }

            u0 = (ox / textureWidth) + uOffset;
            v0 = (oy / textureHeight) + vOffset;
            u1 = (ox + crop.width) / textureWidth + uOffset;
            v1 = (oy + crop.height) / textureHeight + vOffset;

            x = -displayOriginX + frameX;
            y = -displayOriginY + frameY;
        }

        //  Invert the flipY if this is a RenderTexture
        flipY = flipY ^ (!skipFlip && texture.isRenderTexture ? 1 : 0);

        if (flipX)
        {
            width *= -1;
            x += srcWidth;
        }

        if (flipY)
        {
            height *= -1;
            y += srcHeight;
        }

        var xw = x + width;
        var yh = y + height;

        spriteMatrix.applyITRS(srcX, srcY, rotation, scaleX, scaleY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * scrollFactorX, -camera.scrollY * scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = srcX;
            spriteMatrix.f = srcY;
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * scrollFactorX;
            spriteMatrix.f -= camera.scrollY * scrollFactorY;
        }

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        if (camera.roundPixels)
        {
            tx0 = Math.round(tx0);
            ty0 = Math.round(ty0);

            tx1 = Math.round(tx1);
            ty1 = Math.round(ty1);

            tx2 = Math.round(tx2);
            ty2 = Math.round(ty2);

            tx3 = Math.round(tx3);
            ty3 = Math.round(ty3);
        }

        if (textureUnit === undefined)
        {
            textureUnit = this.renderer.setTexture2D(texture);
        }

        this.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);
    },

    /**
     * Adds a Texture Frame into the batch for rendering.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchTextureFrame
     * @since 3.12.0
     *
     * @param {Phaser.Textures.Frame} frame - The Texture Frame to be rendered.
     * @param {number} x - The horizontal position to render the texture at.
     * @param {number} y - The vertical position to render the texture at.
     * @param {number} tint - The tint color.
     * @param {number} alpha - The alpha value.
     * @param {Phaser.GameObjects.Components.TransformMatrix} transformMatrix - The Transform Matrix to use for the texture.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - A parent Transform Matrix.
     */
    batchTextureFrame: function (
        frame,
        x, y,
        tint, alpha,
        transformMatrix,
        parentTransformMatrix
    )
    {
        this.renderer.pipelines.set(this);

        var spriteMatrix = this._tempMatrix1.copyFrom(transformMatrix);
        var calcMatrix = this._tempMatrix2;

        var xw = x + frame.width;
        var yh = y + frame.height;

        if (parentTransformMatrix)
        {
            spriteMatrix.multiply(parentTransformMatrix, calcMatrix);
        }
        else
        {
            calcMatrix = spriteMatrix;
        }

        var tx0 = calcMatrix.getX(x, y);
        var ty0 = calcMatrix.getY(x, y);

        var tx1 = calcMatrix.getX(x, yh);
        var ty1 = calcMatrix.getY(x, yh);

        var tx2 = calcMatrix.getX(xw, yh);
        var ty2 = calcMatrix.getY(xw, yh);

        var tx3 = calcMatrix.getX(xw, y);
        var ty3 = calcMatrix.getY(xw, y);

        var unit = this.renderer.setTextureSource(frame.source);

        tint = Utils.getTintAppendFloatAlpha(tint, alpha);

        this.batchQuad(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, 0, frame.glTexture, unit);
    },

    /**
     * Pushes a filled rectangle into the vertex batch.
     *
     * The dimensions are run through `Math.floor` before the quad is generated.
     *
     * Rectangle has no transform values and isn't transformed into the local space.
     *
     * Used for directly batching untransformed rectangles, such as Camera background colors.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#drawFillRect
     * @since 3.12.0
     *
     * @param {number} x - Horizontal top left coordinate of the rectangle.
     * @param {number} y - Vertical top left coordinate of the rectangle.
     * @param {number} width - Width of the rectangle.
     * @param {number} height - Height of the rectangle.
     * @param {number} color - Color of the rectangle to draw.
     * @param {number} alpha - Alpha value of the rectangle to draw.
     */
    drawFillRect: function (x, y, width, height, color, alpha)
    {
        x = Math.floor(x);
        y = Math.floor(y);

        var xw = Math.floor(x + width);
        var yh = Math.floor(y + height);

        var white = this.renderer.whiteTexture.glTexture;

        var unit = this.renderer.setTexture2D(white);

        var tint = Utils.getTintAppendFloatAlphaAndSwap(color, alpha);

        this.batchQuad(x, y, x, yh, xw, yh, xw, y, 0, 0, 1, 1, tint, tint, tint, tint, 2, white, unit);
    }

});

module.exports = MultiPipeline;
