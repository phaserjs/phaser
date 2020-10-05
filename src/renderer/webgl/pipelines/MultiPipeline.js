/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ModelViewProjection = require('./components/ModelViewProjection');
var ProjectOrtho = require('../mvp/ProjectOrtho');
var ShaderSourceFS = require('../shaders/Multi-frag.js');
var ShaderSourceVS = require('../shaders/Multi-vert.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var Utils = require('../Utils');
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

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function MultiPipeline (config)
    {
        var renderer = config.game.renderer;
        var gl = renderer.gl;

        var fragmentShaderSource = GetFastValue(config, 'fragShader', ShaderSourceFS);

        //  Vertex Size = attribute size added together (2 + 2 + 1 + 1 + 4) inc maxTextures

        config.fragShader = Utils.parseFragmentShaderMaxTextures(fragmentShaderSource, renderer.maxTextures);
        config.vertShader = GetFastValue(config, 'vertShader', ShaderSourceVS);
        config.attributes = GetFastValue(config, 'attributes', [
            {
                name: 'inPosition',
                size: 2,
                type: gl.FLOAT,
                normalized: false,
                offset: 0,
                enabled: false,
                location: -1
            },
            {
                name: 'inTexCoord',
                size: 2,
                type: gl.FLOAT,
                normalized: false,
                offset: 8,
                enabled: false,
                location: -1
            },
            {
                name: 'inTexId',
                size: 1,
                type: gl.FLOAT,
                normalized: false,
                offset: 16,
                enabled: false,
                location: -1
            },
            {
                name: 'inTintEffect',
                size: 1,
                type: gl.FLOAT,
                normalized: false,
                offset: 20,
                enabled: false,
                location: -1
            },
            {
                name: 'inTint',
                size: 4,
                type: gl.UNSIGNED_BYTE,
                normalized: true,
                offset: 24,
                enabled: false,
                location: -1
            }
        ]);

        WebGLPipeline.call(this, config);

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * Uint32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32 = new Uint32Array(this.vertexData);

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
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix4 = new TransformMatrix();

        /**
         * Used internally to draw stroked triangles.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#tempTriangle
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.tempTriangle = [
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 },
            { x: 0, y: 0, width: 0 }
        ];

        /**
         * The tint effect to be applied by the shader in the next geometry draw:
         *
         * 0 = texture multiplied by color
         * 1 = solid color + texture alpha
         * 2 = solid color, no texture
         * 3 = solid texture, no color
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#tintEffect
         * @type {number}
         * @private
         * @since 3.12.0
         */
        this.tintEffect = 2;

        /**
         * Cached stroke tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#strokeTint
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this.strokeTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Cached fill tint.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#fillTint
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this.fillTint = { TL: 0, TR: 0, BL: 0, BR: 0 };

        /**
         * Internal texture frame reference.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#currentFrame
         * @type {Phaser.Textures.Frame}
         * @private
         * @since 3.12.0
         */
        this.currentFrame = { u0: 0, v0: 0, u1: 1, v1: 1 };

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#firstQuad
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.firstQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Internal path quad cache.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#prevQuad
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.prevQuad = [ 0, 0, 0, 0, 0 ];

        /**
         * Used internally for triangulating a polygon.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.MultiPipeline#polygonCache
         * @type {array}
         * @private
         * @since 3.12.0
         */
        this.polygonCache = [];

        this.mvpInit();
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

        this.renderer.setInt1iv(this.program, 'uMainSampler', this.renderer.textureIndexes);

        return this;
    },

    /**
     * Called every time a Game Object needs to use this pipeline.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#onBind
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     *
     * @return {this} This WebGLPipeline instance.
     */
    onBind: function ()
    {
        this.mvpUpdate();

        return this;
    },

    /**
     * Resizes this pipeline and updates the projection.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - The new width.
     * @param {number} height - The new height.
     *
     * @return {this} This WebGLPipeline instance.
     */
    resize: function (width, height)
    {
        WebGLPipeline.prototype.resize.call(this, width, height);

        ProjectOrtho(this, 0, this.width, this.height, 0, -1000, 1000);

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
     * Uploads the vertex data and emits a draw call for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#flush
     * @since 3.0.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function ()
    {
        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var vertexSize = this.vertexSize;

        if (vertexCount > 0)
        {
            if (vertexCount === this.vertexCapacity)
            {
                gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.DYNAMIC_DRAW);
            }
            else
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));
            }

            gl.drawArrays(this.topology, 0, vertexCount);

            this.vertexCount = 0;
        }

        return this;
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
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchQuad
     * @since 3.12.0
     *
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
     * @param {integer} [unit=0] - Texture unit to which the texture needs to be bound.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchQuad: function (x0, y0, x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(6))
        {
            this.flush();

            hasFlushed = true;

            unit = this.setTexture2D(texture);
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = x0;
        vertexViewF32[++vertexOffset] = y0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        this.vertexCount += 6;

        return hasFlushed;
    },

    /**
     * Adds the vertices data into the batch and flushes if full.
     *
     * Assumes 3 vertices in the following arrangement:
     *
     * ```
     * 0
     * |\
     * | \
     * |  \
     * |   \
     * |    \
     * 1-----2
     * ```
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchTri
     * @since 3.12.0
     *
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
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch if a flush occurs.
     * @param {integer} [unit=0] - Texture unit to which the texture needs to be bound.
     *
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchTri: function (x1, y1, x2, y2, x3, y3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintEffect, texture, unit)
    {
        if (unit === undefined) { unit = this.currentUnit; }

        var hasFlushed = false;

        if (this.shouldFlush(3))
        {
            this.flush();

            hasFlushed = true;

            unit = this.setTexture2D(texture);
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        tintEffect = 1;

        vertexViewF32[++vertexOffset] = x1;
        vertexViewF32[++vertexOffset] = y1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = x2;
        vertexViewF32[++vertexOffset] = y2;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        vertexViewF32[++vertexOffset] = x3;
        vertexViewF32[++vertexOffset] = y3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = unit;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        this.vertexCount += 3;

        return hasFlushed;
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
    },

    /**
     * Pushes a filled rectangle into the vertex batch.
     * Rectangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchFillRect
     * @since 3.12.0
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

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var xw = x + width;
        var yh = y + height;

        var x0 = calcMatrix.getX(x, y);
        var y0 = calcMatrix.getY(x, y);

        var x1 = calcMatrix.getX(x, yh);
        var y1 = calcMatrix.getY(x, yh);

        var x2 = calcMatrix.getX(xw, yh);
        var y2 = calcMatrix.getY(xw, yh);

        var x3 = calcMatrix.getX(xw, y);
        var y3 = calcMatrix.getY(xw, y);

        var frame = this.currentFrame;

        var tint = this.fillTint;

        this.batchQuad(x0, y0, x1, y1, x2, y2, x3, y3, frame.u0, frame.v0, frame.u1, frame.v1, tint.TL, tint.TR, tint.BL, tint.BR, this.tintEffect);
    },

    /**
     * Pushes a filled triangle into the vertex batch.
     * Triangle factors in the given transform matrices before adding to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchFillTriangle
     * @since 3.12.0
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

        var calcMatrix = this._tempMatrix3;

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

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        var tint = this.fillTint;

        this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, u0, v0, u1, v1, tint.TL, tint.TR, tint.BL, this.tintEffect);
    },

    /**
     * Pushes a stroked triangle into the vertex batch.
     * Triangle factors in the given transform matrices before adding to the batch.
     * The triangle is created from 3 lines and drawn using the `batchStrokePath` method.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchStrokeTriangle
     * @since 3.12.0
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
     * @since 3.12.0
     *
     * @param {array} path - Collection of points that represent the path.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    batchFillPath: function (path, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this._tempMatrix3;

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
        var tintEffect = this.tintEffect;

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }

        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

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

            this.batchTri(tx0, ty0, tx1, ty1, tx2, ty2, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintEffect);
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
     * @since 3.12.0
     *
     * @param {array} path - Collection of points that represent the path.
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
     * Assumes a texture has already been set, prior to calling this function.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.MultiPipeline#batchLine
     * @since 3.12.0
     *
     * @param {number} ax - X coordinate to the start of the line
     * @param {number} ay - Y coordinate to the start of the line
     * @param {number} bx - X coordinate to the end of the line
     * @param {number} by - Y coordinate to the end of the line
     * @param {number} aLineWidth - Width of the start of the line
     * @param {number} bLineWidth - Width of the end of the line
     * @param {Float32Array} currentMatrix - Parent matrix, generally used by containers
     */
    batchLine: function (ax, ay, bx, by, aLineWidth, bLineWidth, lineWidth, index, closePath, currentMatrix, parentMatrix)
    {
        this.renderer.pipelines.set(this);

        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }

        var dx = bx - ax;
        var dy = by - ay;

        var len = Math.sqrt(dx * dx + dy * dy);
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
        var tintEffect = this.tintEffect;

        var tintTL = tint.TL;
        var tintTR = tint.TR;
        var tintBL = tint.BL;
        var tintBR = tint.BR;

        var frame = this.currentFrame;

        var u0 = frame.u0;
        var v0 = frame.v0;
        var u1 = frame.u1;
        var v1 = frame.v1;

        //  TL, BL, BR, TR
        this.batchQuad(tlX, tlY, blX, blY, brX, brY, trX, trY, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);

        if (lineWidth <= 2)
        {
            //  No point doing a linejoin if the line isn't thick enough
            return;
        }

        var prev = this.prevQuad;
        var first = this.firstQuad;

        if (index > 0 && prev[4])
        {
            this.batchQuad(tlX, tlY, blX, blY, prev[0], prev[1], prev[2], prev[3], u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
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
            this.batchQuad(brX, brY, trX, trY, first[0], first[1], first[2], first[3], u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
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
    }

});

module.exports = MultiPipeline;
