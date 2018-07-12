/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ModelViewProjection = require('./components/ModelViewProjection');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var ShaderSourceFS = require('../shaders/TextureTint-frag.js');
var ShaderSourceVS = require('../shaders/TextureTint-vert.js');
var Utils = require('../Utils');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * TextureTintPipeline implements the rendering infrastructure
 * for displaying textured objects
 * The config properties are:
 * - game: Current game instance.
 * - renderer: Current WebGL renderer.
 * - topology: This indicates how the primitives are rendered. The default value is GL_TRIANGLES.
 *              Here is the full list of rendering primitives (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * - vertShader: Source for vertex shader as a string.
 * - fragShader: Source for fragment shader as a string.
 * - vertexCapacity: The amount of vertices that shall be allocated
 * - vertexSize: The size of a single vertex in bytes.
 *
 * @class TextureTintPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 */
var TextureTintPipeline = new Class({

    Extends: WebGLPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function TextureTintPipeline (config)
    {
        var rendererConfig = config.renderer.config;

        //  Vertex Size = attribute size added together (2 + 2 + 1 + 4)

        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: GetFastValue(config, 'topology', config.renderer.gl.TRIANGLES),
            vertShader: GetFastValue(config, 'vertShader', ShaderSourceVS),
            fragShader: GetFastValue(config, 'fragShader', ShaderSourceFS),
            vertexCapacity: GetFastValue(config, 'vertexCapacity', 6 * rendererConfig.batchSize),
            vertexSize: GetFastValue(config, 'vertexSize', Float32Array.BYTES_PER_ELEMENT * 5 + Uint8Array.BYTES_PER_ELEMENT * 4),
            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: 0
                },
                {
                    name: 'inTexCoord',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
                },
                {
                    name: 'inTintEffect',
                    size: 1,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 4
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: config.renderer.gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 5
                }
            ]
        });

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * Uint32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32 = new Uint32Array(this.vertexData);

        /**
         * Size of the batch.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#maxQuads
         * @type {integer}
         * @since 3.0.0
         */
        this.maxQuads = rendererConfig.batchSize;

        /**
         * Collection of batch information
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batches
         * @type {array}
         * @since 3.1.0
         */
        this.batches = [];

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempMatrix4 = new TransformMatrix();

        this.mvpInit();
    },

    /**
     * Assigns a texture to the current batch. If a texture is already set it creates
     * a new batch object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#setTexture2D
     * @since 3.1.0
     *
     * @param {WebGLTexture} texture - WebGLTexture that will be assigned to the current batch.
     * @param {integer} textureUnit - Texture unit to which the texture needs to be bound.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This pipeline instance.
     */
    setTexture2D: function (texture, unit)
    {
        if (!texture)
        {
            return this;
        }

        var batches = this.batches;

        if (batches.length === 0)
        {
            this.pushBatch();
        }

        var batch = batches[batches.length - 1];

        if (unit > 0)
        {
            if (batch.textures[unit - 1] &&
                batch.textures[unit - 1] !== texture)
            {
                this.pushBatch();
            }

            batches[batches.length - 1].textures[unit - 1] = texture;
        }
        else
        {
            if (batch.texture !== null &&
                batch.texture !== texture)
            {
                this.pushBatch();
            }

            batches[batches.length - 1].texture = texture;
        }

        return this;
    },

    /**
     * Creates a new batch object and pushes it to a batch array.
     * The batch object contains information relevant to the current 
     * vertex batch like the offset in the vertex buffer, vertex count and 
     * the textures used by that batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#pushBatch
     * @since 3.1.0
     */
    pushBatch: function ()
    {
        var batch = {
            first: this.vertexCount,
            texture: null,
            textures: []
        };

        this.batches.push(batch);
    },

    /**
     * Binds, uploads resources and processes all batches generating draw calls.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#flush
     * @since 3.1.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This pipeline instance.
     */
    flush: function ()
    {
        if (this.flushLocked)
        {
            return this;
        }

        this.flushLocked = true;

        var gl = this.gl;
        var renderer = this.renderer;
        var vertexCount = this.vertexCount;
        var topology = this.topology;
        var vertexSize = this.vertexSize;
        var batches = this.batches;
        var batchCount = batches.length;
        var batchVertexCount = 0;
        var batch = null;
        var batchNext;
        var textureIndex;
        var nTexture;

        if (batchCount === 0 || vertexCount === 0)
        {
            this.flushLocked = false;
            return this;
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));

        for (var index = 0; index < batches.length - 1; ++index)
        {
            batch = batches[index];
            batchNext = batches[index + 1];

            if (batch.textures.length > 0)
            {
                for (textureIndex = 0; textureIndex < batch.textures.length; ++textureIndex)
                {
                    nTexture = batch.textures[textureIndex];

                    if (nTexture)
                    {
                        renderer.setTexture2D(nTexture, 1 + textureIndex);
                    }
                }

                gl.activeTexture(gl.TEXTURE0);
            }

            batchVertexCount = batchNext.first - batch.first;

            if (batch.texture === null || batchVertexCount <= 0) { continue; }

            renderer.setTexture2D(batch.texture, 0);
            gl.drawArrays(topology, batch.first, batchVertexCount);
        }

        // Left over data
        batch = batches[batches.length - 1];

        if (batch.textures.length > 0)
        {
            for (textureIndex = 0; textureIndex < batch.textures.length; ++textureIndex)
            {
                nTexture = batch.textures[textureIndex];

                if (nTexture)
                {
                    renderer.setTexture2D(nTexture, 1 + textureIndex);
                }
            }

            gl.activeTexture(gl.TEXTURE0);
        }

        batchVertexCount = vertexCount - batch.first;

        if (batch.texture && batchVertexCount > 0)
        {
            renderer.setTexture2D(batch.texture, 0);
            gl.drawArrays(topology, batch.first, batchVertexCount);
        }

        this.vertexCount = 0;
        batches.length = 0;
        this.pushBatch();
        this.flushLocked = false;

        return this;
    },

    /**
     * Called every time the pipeline needs to be used.
     * It binds all necessary resources.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This pipeline instance.
     */
    onBind: function ()
    {
        WebGLPipeline.prototype.onBind.call(this);

        this.mvpUpdate();

        if (this.batches.length === 0)
        {
            this.pushBatch();
        }

        return this;
    },

    /**
     * Resizes this pipeline and updates the projection.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - The new width.
     * @param {number} height - The new height.
     * @param {number} resolution - The resolution.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This pipeline instance.
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);

        this.projOrtho(0, this.width, this.height, 0, -1000.0, 1000.0);

        return this;
    },

    /**
     * Takes a Sprite Game Object, or any object that extends it, and adds it to the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {(Phaser.GameObjects.Image|Phaser.GameObjects.Sprite)} sprite - The texture based Game Object to add to the batch.
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use for the rendering transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - The transform matrix of the parent container, if set.
     */
    batchSprite: function (sprite, camera, parentTransformMatrix)
    {
        this.renderer.setPipeline(this);

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
        var frameWidth = frame.width;
        var frameHeight = frame.height;

        var x = -sprite.displayOriginX + frameX;
        var y = -sprite.displayOriginY + frameY;

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

            x = -sprite.displayOriginX + frameX;
            y = -sprite.displayOriginY + frameY;
        }

        if (sprite.flipX)
        {
            x += frameWidth;
            frameWidth *= -1;
        }

        if (sprite.flipY)
        {
            y += frameHeight;
            frameHeight *= -1;
        }

        var xw = x + frameWidth;
        var yh = y + frameHeight;

        spriteMatrix.applyITRS(sprite.x, sprite.y, sprite.rotation, sprite.scaleX, sprite.scaleY);

        camMatrix.copyFrom(camera.matrix);

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * sprite.scrollFactorX, -camera.scrollY * sprite.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = sprite.x;
            spriteMatrix.f = sprite.y;

            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * sprite.scrollFactorX;
            spriteMatrix.f -= camera.scrollY * sprite.scrollFactorY;
    
            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }

        var tx0 = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty0 = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        var tx1 = x * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty1 = x * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx2 = xw * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty2 = xw * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx3 = xw * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty3 = xw * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        var tintTL = Utils.getTintAppendFloatAlpha(sprite._tintTL, camera.alpha * sprite._alphaTL);
        var tintTR = Utils.getTintAppendFloatAlpha(sprite._tintTR, camera.alpha * sprite._alphaTR);
        var tintBL = Utils.getTintAppendFloatAlpha(sprite._tintBL, camera.alpha * sprite._alphaBL);
        var tintBR = Utils.getTintAppendFloatAlpha(sprite._tintBR, camera.alpha * sprite._alphaBR);

        if (camera.roundPixels)
        {
            tx0 |= 0;
            ty0 |= 0;

            tx1 |= 0;
            ty1 |= 0;

            tx2 |= 0;
            ty2 |= 0;

            tx3 |= 0;
            ty3 |= 0;
        }

        this.setTexture2D(texture, 0);

        var tintEffect = (sprite._isTinted && sprite.tintFill);

        this.batchVertices(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
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
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchVertices
     * @since 3.11.0
     *
     * @param {number} tx0 - The top-left x position.
     * @param {number} ty0 - The top-left y position.
     * @param {number} tx1 - The bottom-left x position.
     * @param {number} ty1 - The bottom-left y position.
     * @param {number} tx2 - The bottom-right x position.
     * @param {number} ty2 - The bottom-right y position.
     * @param {number} tx3 - The top-right x position.
     * @param {number} ty3 - The top-right y position.
     * @param {number} u0 - UV u0 value.
     * @param {number} v0 - UV v0 value.
     * @param {number} u1 - UV u1 value.
     * @param {number} v1 - UV v1 value.
     * @param {number} tintTL - The top-left tint color value.
     * @param {number} tintTR - The top-right tint color value.
     * @param {number} tintBL - The bottom-left tint color value.
     * @param {number} tintBR - The bottom-right tint color value.
     * @param {(number|boolean)} tintEffect - The tint effect for the shader to use.
     * 
     * @return {boolean} `true` if this method caused the batch to flush, otherwise `false`.
     */
    batchVertices: function (tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect)
    {
        var hasFlushed = false;

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();

            hasFlushed = true;
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;
            
        vertexViewF32[++vertexOffset] = tx0;
        vertexViewF32[++vertexOffset] = ty0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = tx1;
        vertexViewF32[++vertexOffset] = ty1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBL;

        vertexViewF32[++vertexOffset] = tx2;
        vertexViewF32[++vertexOffset] = ty2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = tx0;
        vertexViewF32[++vertexOffset] = ty0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTL;

        vertexViewF32[++vertexOffset] = tx2;
        vertexViewF32[++vertexOffset] = ty2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintBR;

        vertexViewF32[++vertexOffset] = tx3;
        vertexViewF32[++vertexOffset] = ty3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tintTR;

        this.vertexCount += 6;

        if (this.vertexCapacity - this.vertexCount < 6)
        {
            //  No more room at the inn
            this.flush();

            hasFlushed = true;
        }

        return hasFlushed;
    },

    /**
     * Generic function for batching a textured quad
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchTexture
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - Source GameObject
     * @param {WebGLTexture} texture - Raw WebGLTexture associated with the quad
     * @param {integer} textureWidth - Real texture width
     * @param {integer} textureHeight - Real texture height
     * @param {number} srcX - X coordinate of the quad
     * @param {number} srcY - Y coordinate of the quad
     * @param {number} srcWidth - Width of the quad
     * @param {number} srcHeight - Height of the quad
     * @param {number} scaleX - X component of scale
     * @param {number} scaleY - Y component of scale
     * @param {number} rotation - Rotation of the quad
     * @param {boolean} flipX - Indicates if the quad is horizontally flipped
     * @param {boolean} flipY - Indicates if the quad is vertically flipped
     * @param {number} scrollFactorX - By which factor is the quad affected by the camera horizontal scroll
     * @param {number} scrollFactorY - By which factor is the quad effected by the camera vertical scroll
     * @param {number} displayOriginX - Horizontal origin in pixels
     * @param {number} displayOriginY - Vertical origin in pixels
     * @param {number} frameX - X coordinate of the texture frame
     * @param {number} frameY - Y coordinate of the texture frame
     * @param {number} frameWidth - Width of the texture frame
     * @param {number} frameHeight - Height of the texture frame
     * @param {integer} tintTL - Tint for top left
     * @param {integer} tintTR - Tint for top right
     * @param {integer} tintBL - Tint for bottom left
     * @param {integer} tintBR - Tint for bottom right
     * @param {number} tintEffect - The tint effect (0 for additive, 1 for replacement)
     * @param {number} uOffset - Horizontal offset on texture coordinate
     * @param {number} vOffset - Vertical offset on texture coordinate
     * @param {Phaser.Cameras.Scene2D.Camera} camera - Current used camera
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - Parent container
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
        parentTransformMatrix)
    {
        this.renderer.setPipeline(this, gameObject);

        var camMatrix = this._tempMatrix1;
        var spriteMatrix = this._tempMatrix2;
        var calcMatrix = this._tempMatrix3;

        var width = srcWidth;
        var height = srcHeight;

        var x = -displayOriginX;
        var y = -displayOriginY;

        //  Invert the flipY if this is a RenderTexture
        flipY = flipY ^ (texture.isRenderTexture ? 1 : 0);

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
            x |= 0;
            y |= 0;
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

            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }
        else
        {
            spriteMatrix.e -= camera.scrollX * scrollFactorX;
            spriteMatrix.f -= camera.scrollY * scrollFactorY;
    
            //  Multiply by the Sprite matrix, store result in calcMatrix
            camMatrix.multiply(spriteMatrix, calcMatrix);
        }

        var tx0 = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty0 = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        var tx1 = x * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty1 = x * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx2 = xw * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty2 = xw * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx3 = xw * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty3 = xw * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        if (camera.roundPixels)
        {
            tx0 |= 0;
            ty0 |= 0;

            tx1 |= 0;
            ty1 |= 0;

            tx2 |= 0;
            ty2 |= 0;

            tx3 |= 0;
            ty3 |= 0;
        }

        var u0 = (frameX / textureWidth) + uOffset;
        var v0 = (frameY / textureHeight) + vOffset;
        var u1 = (frameX + frameWidth) / textureWidth + uOffset;
        var v1 = (frameY + frameHeight) / textureHeight + vOffset;

        this.setTexture2D(texture, 0);

        this.batchVertices(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, u0, v0, u1, v1, tintTL, tintTR, tintBL, tintBR, tintEffect);
    },

    /**
     * Immediately draws a Texture Frame with no batching.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#drawTexture
     * @since 3.11.0
     *
     * @param {WebGLTexture} texture - The WebGL Texture to be rendered.
     * @param {number} x - The horizontal position to render the texture at.
     * @param {number} y - The vertical position to render the texture at.
     * @param {number} tint - The tint color.
     * @param {number} alpha - The alpha value.
     * @param {array} transformMatrix - An array of matrix values.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentTransformMatrix] - A parent Transform Matrix.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This Pipeline.
     */
    drawTextureFrame: function (
        frame,
        x, y,
        tint, alpha,
        transformMatrix,
        parentTransformMatrix
    )
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var spriteMatrix = this._tempMatrix1.copyFromArray(transformMatrix);
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

        var tx0 = x * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty0 = x * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        var tx1 = x * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty1 = x * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx2 = xw * calcMatrix.a + yh * calcMatrix.c + calcMatrix.e;
        var ty2 = xw * calcMatrix.b + yh * calcMatrix.d + calcMatrix.f;

        var tx3 = xw * calcMatrix.a + y * calcMatrix.c + calcMatrix.e;
        var ty3 = xw * calcMatrix.b + y * calcMatrix.d + calcMatrix.f;

        if (this.renderer.config.roundPixels)
        {
            tx0 |= 0;
            ty0 |= 0;

            tx1 |= 0;
            ty1 |= 0;

            tx2 |= 0;
            ty2 |= 0;

            tx3 |= 0;
            ty3 |= 0;
        }

        this.setTexture2D(frame.glTexture, 0);

        tint = Utils.getTintAppendFloatAlpha(tint, alpha);

        if (!this.batchVertices(tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3, frame.u0, frame.v0, frame.u1, frame.v1, tint, tint, tint, tint, 0))
        {
            this.flush();
        }

    }

});

module.exports = TextureTintPipeline;
