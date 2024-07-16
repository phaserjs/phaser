/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ShaderSourceFS = require('../shaders/Multi-frag');
var ShaderSourceVS = require('../shaders/Multi-vert');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Utils = require('../Utils');
var WEBGL_CONST = require('../const');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
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
 * `uResolution` (vec2)
 * `uMainSampler` (sampler2D, or sampler2D array)
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
 * The following fragment shader shows how to use the two variables:
 *
 * ```glsl
 * #define SHADER_NAME PHASER_MULTI_FS
 *
 * #ifdef GL_FRAGMENT_PRECISION_HIGH
 * precision highp float;
 * #else
 * precision mediump float;
 * #endif
 *
 * uniform sampler2D uMainSampler[%count%];
 *
 * varying vec2 outTexCoord;
 * varying float outTexId;
 * varying float outTintEffect;
 * varying vec4 outTint;
 *
 * void main ()
 * {
 *     vec4 texture;
 *
 *     %forloop%
 *
 *     vec4 texel = vec4(outTint.bgr * outTint.a, outTint.a);
 *
 *     //  Multiply texture tint
 *     vec4 color = texture * texel;
 *
 *     if (outTintEffect == 1.0)
 *     {
 *         //  Solid color + texture alpha
 *         color.rgb = mix(texture.rgb, outTint.bgr * outTint.a, texture.a);
 *     }
 *     else if (outTintEffect == 2.0)
 *     {
 *         //  Solid color, no texture
 *         color = texel;
 *     }
 *
 *     gl_FragColor = color;
 * }
 * ```
 *
 * If you wish to create a pipeline that works from a single texture, or that doesn't have
 * internal texture iteration, please see the `SinglePipeline` instead. If you wish to create
 * a special effect, especially one that can impact the pixels around a texture (i.e. such as
 * a glitch effect) then you should use the PreFX and PostFX Pipelines for this task.
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
        config.resizeUniform = 'uResolution';

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

        /**
         * A temporary Transform Matrix, re-used internally during batching by the
         * Shape Game Objects.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.55.0
         */
        this.calcMatrix = new TransformMatrix();

        /**
         * Used internally to draw stroked triangles.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#tempTriangle
         * @type {array}
         * @private
         * @since 3.55.0
         */
        this.tempTriangle = [
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 }
        ];

        /**
         * Cached stroke tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#strokeTint
         * @type {object}
         * @private
         * @since 3.55.0
         */
        this.strokeTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Cached fill tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#fillTint
         * @type {object}
         * @private
         * @since 3.55.0
         */
        this.fillTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Internal texture frame reference.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#currentFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 3.55.0
         */
        this.currentFrame = { u0: 0, v0: 0, u1: 1, v1: 1 };

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#firstQuad
         * @type {number[]}
         * @private
         * @since 3.55.0
         */
        this.firstQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#prevQuad
         * @type {number[]}
         * @private
         * @since 3.55.0
         */
        this.prevQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Used internally for triangulating a polygon.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#polygonCache
         * @type {array}
         * @private
         * @since 3.55.0
         */
        this.polygonCache = [];
    },

    /**
     * Called every time the pipeline is bound by the renderer.
     * Sets the shader program, vertex buffer and other resources.
     * Should only be called when changing pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#boot
     * @since 3.50.0
     */
    boot: function ()
    {
        WebGLPipeline.prototype.boot.call(this);

        var renderer = this.renderer;

        this.set1iv('uMainSampler', renderer.textureIndexes);
        this.set2f('uResolution', renderer.width, renderer.height);
    },

    /**
     * Takes a Sprite Game Object, or any object that extends it, and adds it to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchSprite
     * @since 3.0.0
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

        if (gameObject.flipY)
        {
            if (!customPivot)
            {
                y += (-frame.realHeight + (displayOriginY * 2));
            }

            flipY = -1;
        }

        var gx = gameObject.x;
        var gy = gameObject.y;

        if (camera.roundPixels)
        {
            gx = Math.floor(gx);
            gy = Math.floor(gy);
        }

        spriteMatrix.applyITRS(gx, gy, gameObject.rotation, gameObject.scaleX * flipX, gameObject.scaleY * flipY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * gameObject.scrollFactorX, -camera.scrollY * gameObject.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = gx;
            spriteMatrix.f = gy;
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * gameObject.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * gameObject.scrollFactorY;
        }

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(spriteMatrix, calcMatrix);

        var quad = calcMatrix.setQuad(x, y, x + frameWidth, y + frameHeight, camera.roundPixels);

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

        var unit = this.setGameObject(gameObject, frame);

        this.manager.preBatch(gameObject);

        this.batchQuad(gameObject, quad[0], quad[1], quad[2], quad[3], quad[4], quad[5], quad[6], quad[7], u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, gameObject.tintFill, texture, unit);

        this.manager.postBatch(gameObject);
    },

    /**
     * Generic function for batching a textured quad using argument values instead of a Game Object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchTexture
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Source GameObject.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} texture - Texture associated with the quad.
     * @param {number} textureWidth - Real texture width.
     * @param {number} textureHeight - Real texture height.
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
     * @param {number} tintTL - Tint for top left.
     * @param {number} tintTR - Tint for top right.
     * @param {number} tintBL - Tint for bottom left.
     * @param {number} tintBR - Tint for bottom right.
     * @param {number} tintEffect - The tint effect.
     * @param {number} uOffset - Horizontal offset on texture coordinate.
     * @param {number} vOffset - Vertical offset on texture coordinate.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current used camera.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - Parent container.
     * @param {boolean} [skipFlip=false] - Skip the renderTexture check.
     * @param {number} [textureUnit] - The texture unit to set (defaults to currently bound if undefined or null)
     * @param {boolean} [skipPrePost=false] - Skip the pre and post manager calls?
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
        textureUnit,
        skipPrePost)
    {
        if (skipPrePost === undefined) { skipPrePost = false; }

        this.manager.set(this, gameObject);

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

            var cropWidth = crop.width;
            var cropHeight = crop.height;

            width = cropWidth;
            height = cropHeight;

            srcWidth = cropWidth;
            srcHeight = cropHeight;

            frameX = crop.x;
            frameY = crop.y;

            var ox = frameX;
            var oy = frameY;

            if (flipX)
            {
                ox = (frameWidth - crop.x - cropWidth);
            }

            if (flipY)
            {
                oy = (frameHeight - crop.y - cropHeight);
            }

            u0 = (ox / textureWidth) + uOffset;
            v0 = (oy / textureHeight) + vOffset;
            u1 = (ox + cropWidth) / textureWidth + uOffset;
            v1 = (oy + cropHeight) / textureHeight + vOffset;

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

        if (camera.roundPixels)
        {
            srcX = Math.floor(srcX);
            srcY = Math.floor(srcY);
        }
        
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

        var quad = calcMatrix.setQuad(x, y, x + width, y + height, camera.roundPixels);

        if (textureUnit === undefined || textureUnit === null)
        {
            textureUnit = this.setTexture2D(texture);
        }

        if (gameObject && !skipPrePost)
        {
            this.manager.preBatch(gameObject);
        }

        this.batchQuad(gameObject, quad[0], quad[1], quad[2], quad[3], quad[4], quad[5], quad[6], quad[7], u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, textureUnit);

        if (gameObject && !skipPrePost)
        {
            this.manager.postBatch(gameObject);
        }
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
        this.manager.set(this);

        var spriteMatrix = this._tempMatrix1.copyFrom(transformMatrix);
        var calcMatrix = this._tempMatrix2;

        if (parentTransformMatrix)
        {
            spriteMatrix.multiply(parentTransformMatrix, calcMatrix);
        }
        else
        {
            calcMatrix = spriteMatrix;
        }

        var quad = calcMatrix.setQuad(x, y, x + frame.width, y + frame.height);

        var unit = this.setTexture2D(frame.source.glTexture);

        tint = Utils.getTintAppendFloatAlpha(tint, alpha);

        this.batchQuad(null, quad[0], quad[1], quad[2], quad[3], quad[4], quad[5], quad[6], quad[7], frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, 0, frame.glTexture, unit);
    },

    /**
     * Pushes a filled rectangle into the vertex batch.
     *
     * Rectangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchFillRect
     * @since 3.55.0
     *
     * @param {number} x - Horizontal top left coordinate of the rectangle.
     * @param {number} y - Vertical top left coordinate of the rectangle.
     * @param {number} width - Width of the rectangle.
     * @param {number} height - Height of the rectangle.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillRect: function (x, y, width, height, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var quad = calcMatrix.setQuad(x, y, x + width, y + height);

        var tint = this.fillTint;

        this.batchQuad(null, quad[0], quad[1], quad[2], quad[3], quad[4], quad[5], quad[6], quad[7], 0, 0, 1, 1, tint.TL, tint.TR, tint.BL, tint.BR, 2);
    },

    /**
     * Pushes a filled triangle into the vertex batch.
     *
     * Triangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchFillTriangle
     * @since 3.55.0
     *
     * @param {number} x0 - Point 0 x coordinate.
     * @param {number} y0 - Point 0 y coordinate.
     * @param {number} x1 - Point 1 x coordinate.
     * @param {number} y1 - Point 1 y coordinate.
     * @param {number} x2 - Point 2 x coordinate.
     * @param {number} y2 - Point 2 y coordinate.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillTriangle: function (x0, y0, x1, y1, x2, y2, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var tx0 = calcMatrix.getX(x0, y0);
        var ty0 = calcMatrix.getY(x0, y0);

        var tx1 = calcMatrix.getX(x1, y1);
        var ty1 = calcMatrix.getY(x1, y1);

        var tx2 = calcMatrix.getX(x2, y2);
        var ty2 = calcMatrix.getY(x2, y2);

        var tint = this.fillTint;

        this.batchTri(null, tx0, ty0, tx1, ty1, tx2, ty2, 0, 0, 1, 1, tint.TL, tint.TR, tint.BL, 2);
    },

    /**
     * Pushes a stroked triangle into the vertex batch.
     *
     * Triangle factors in the given transform matrices before adding to the batch.
     *
     * The triangle is created from 3 lines and drawn using the `batchStrokePath` method.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchStrokeTriangle
     * @since 3.55.0
     *
     * @param {number} x0 - Point 0 x coordinate.
     * @param {number} y0 - Point 0 y coordinate.
     * @param {number} x1 - Point 1 x coordinate.
     * @param {number} y1 - Point 1 y coordinate.
     * @param {number} x2 - Point 2 x coordinate.
     * @param {number} y2 - Point 2 y coordinate.
     * @param {number} lineWidth - The width of the line in pixels.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchStrokeTriangle: function (x0, y0, x1, y1, x2, y2, lineWidth, currentMatrix, parentMatrix)
    {
        var tempTriangle = this.tempTriangle;

        tempTriangle[0].x = x0;
        tempTriangle[0].y = y0;
        tempTriangle[0].width = lineWidth;

        tempTriangle[1].x = x1;
        tempTriangle[1].y = y1;
        tempTriangle[1].width = lineWidth;

        tempTriangle[2].x = x2;
        tempTriangle[2].y = y2;
        tempTriangle[2].width = lineWidth;

        tempTriangle[3].x = x0;
        tempTriangle[3].y = y0;
        tempTriangle[3].width = lineWidth;

        this.batchStrokePath(tempTriangle, lineWidth, false, currentMatrix, parentMatrix);
    },

    /**
     * Adds the given path to the vertex batch for rendering.
     *
     * It works by taking the array of path data and then passing it through Earcut, which
     * creates a list of polygons. Each polygon is then added to the batch.
     *
     * The path is always automatically closed because it's filled.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchFillPath
     * @since 3.55.0
     *
     * @param {Phaser.Types.Math.Vector2Like[]} path - Collection of points that represent the path.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillPath: function (path, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;

        var tintTL = this.fillTint.TL;
        var tintTR = this.fillTint.TR;
        var tintBL = this.fillTint.BL;

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }

        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        for (var index = 0; index < length; index += 3)
        {
            var p0 = polygonIndexArray[index + 0] * 2;
            var p1 = polygonIndexArray[index + 1] * 2;
            var p2 = polygonIndexArray[index + 2] * 2;

            var x0 = polygonCache[p0 + 0];
            var y0 = polygonCache[p0 + 1];
            var x1 = polygonCache[p1 + 0];
            var y1 = polygonCache[p1 + 1];
            var x2 = polygonCache[p2 + 0];
            var y2 = polygonCache[p2 + 1];

            var tx0 = calcMatrix.getX(x0, y0);
            var ty0 = calcMatrix.getY(x0, y0);

            var tx1 = calcMatrix.getX(x1, y1);
            var ty1 = calcMatrix.getY(x1, y1);

            var tx2 = calcMatrix.getX(x2, y2);
            var ty2 = calcMatrix.getY(x2, y2);

            this.batchTri(null, tx0, ty0, tx1, ty1, tx2, ty2, 0, 0, 1, 1, tintTL, tintTR, tintBL, 2);
        }

        polygonCache.length = 0;
    },

    /**
     * Adds the given path to the vertex batch for rendering.
     *
     * It works by taking the array of path data and calling `batchLine` for each section
     * of the path.
     *
     * The path is optionally closed at the end.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchStrokePath
     * @since 3.55.0
     *
     * @param {Phaser.Types.Math.Vector2Like[]} path - Collection of points that represent the path.
     * @param {number} lineWidth - The width of the line segments in pixels.
     * @param {boolean} pathOpen - Indicates if the path should be closed or left open.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchStrokePath: function (path, lineWidth, pathOpen, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        //  Reset the closePath booleans
        this.prevQuad[4] = 0;
        this.firstQuad[4] = 0;

        var pathLength = path.length - 1;

        for (var pathIndex = 0; pathIndex < pathLength; pathIndex++)
        {
            var point0 = path[pathIndex];
            var point1 = path[pathIndex + 1];

            this.batchLine(
                point0.x,
                point0.y,
                point1.x,
                point1.y,
                point0.width / 2,
                point1.width / 2,
                lineWidth,
                pathIndex,
                !pathOpen && (pathIndex === pathLength - 1),
                currentMatrix,
                parentMatrix
            );
        }
    },

    /**
     * Creates a line out of 4 quads and adds it to the vertex batch based on the given line values.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchLine
     * @since 3.55.0
     *
     * @param {number} ax - x coordinate of the start of the line.
     * @param {number} ay - y coordinate of the start of the line.
     * @param {number} bx - x coordinate of the end of the line.
     * @param {number} by - y coordinate of the end of the line.
     * @param {number} aLineWidth - Width of the start of the line.
     * @param {number} bLineWidth - Width of the end of the line.
     * @param {number} index - If this line is part of a multi-line draw, the index of the line in the draw.
     * @param {boolean} closePath - Does this line close a multi-line path?
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchLine: function (ax, ay, bx, by, aLineWidth, bLineWidth, lineWidth, index, closePath, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this.calcMatrix;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var dx = bx - ax;
        var dy = by - ay;

        var len = Math.sqrt(dx * dx + dy * dy);

        if (len === 0)
        {
            //  Because we cannot (and should not) divide by zero!
            return;
        }

        var al0 = aLineWidth * (by - ay) / len;
        var al1 = aLineWidth * (ax - bx) / len;
        var bl0 = bLineWidth * (by - ay) / len;
        var bl1 = bLineWidth * (ax - bx) / len;

        var lx0 = bx - bl0;
        var ly0 = by - bl1;
        var lx1 = ax - al0;
        var ly1 = ay - al1;
        var lx2 = bx + bl0;
        var ly2 = by + bl1;
        var lx3 = ax + al0;
        var ly3 = ay + al1;

        //  tx0 = bottom right
        var brX = calcMatrix.getX(lx0, ly0);
        var brY = calcMatrix.getY(lx0, ly0);

        //  tx1 = bottom left
        var blX = calcMatrix.getX(lx1, ly1);
        var blY = calcMatrix.getY(lx1, ly1);

        //  tx2 = top right
        var trX = calcMatrix.getX(lx2, ly2);
        var trY = calcMatrix.getY(lx2, ly2);

        //  tx3 = top left
        var tlX = calcMatrix.getX(lx3, ly3);
        var tlY = calcMatrix.getY(lx3, ly3);

        var tint = this.strokeTint;

        var tintTL = tint.TL;
        var tintTR = tint.TR;
        var tintBL = tint.BL;
        var tintBR = tint.BR;

        //  TL, BL, BR, TR
        this.batchQuad(null, tlX, tlY, blX, blY, brX, brY, trX, trY, 0, 0, 1, 1, tintTL, tintTR, tintBL, tintBR, 2);

        if (lineWidth <= 2)
        {
            //  No point doing a linejoin if the line isn't thick enough
            return;
        }

        var prev = this.prevQuad;
        var first = this.firstQuad;

        if (index > 0 && prev[4])
        {
            this.batchQuad(null, tlX, tlY, blX, blY, prev[0], prev[1], prev[2], prev[3], 0, 0, 1, 1, tintTL, tintTR, tintBL, tintBR, 2);
        }
        else
        {
            first[0] = tlX;
            first[1] = tlY;
            first[2] = blX;
            first[3] = blY;
            first[4] = 1;
        }

        if (closePath && first[4])
        {
            //  Add a join for the final path segment
            this.batchQuad(null, brX, brY, trX, trY, first[0], first[1], first[2], first[3], 0, 0, 1, 1, tintTL, tintTR, tintBL, tintBR, 2);
        }
        else
        {
            //  Store it

            prev[0] = brX;
            prev[1] = brY;
            prev[2] = trX;
            prev[3] = trY;
            prev[4] = 1;
        }
    },

    /**
     * Destroys all shader instances, removes all object references and nulls all external references.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#destroy
     * @fires Phaser.Renderer.WebGL.Pipelines.Events#DESTROY
     * @since 3.60.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    destroy: function ()
    {
        this._tempMatrix1.destroy();
        this._tempMatrix2.destroy();
        this._tempMatrix3.destroy();

        this._tempMatrix1 = null;
        this._tempMatrix1 = null;
        this._tempMatrix1 = null;

        WebGLPipeline.prototype.destroy.call(this);

        return this;
    }

});

module.exports = MultiPipeline;
