/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
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
            topology: config.renderer.gl.TRIANGLES,
            vertShader: ShaderSourceVS,
            fragShader: ShaderSourceFS,
            vertexCapacity: 6 * rendererConfig.batchSize,
            vertexSize: Float32Array.BYTES_PER_ELEMENT * 5 + Uint8Array.BYTES_PER_ELEMENT * 4,

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
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#_tempCameraMatrix
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempCameraMatrix = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#_tempSpriteMatrix
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.11.0
         */
        this._tempSpriteMatrix = new TransformMatrix();

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
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} [description]
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
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This Pipeline.
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
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);

        this.projOrtho(0, this.width, this.height, 0, -1000.0, 1000.0);

        return this;
    },

    /**
     * Renders contents of a ParticleEmitterManager. It'll batch all particles if possible.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#drawEmitterManager
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} emitterManager - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     */
    drawEmitterManager: function (emitterManager, camera, parentTransformMatrix)
    {
        var parentMatrix = null;

        if (parentTransformMatrix)
        {
            parentMatrix = parentTransformMatrix.matrix;
        }

        this.renderer.setPipeline(this);

        var roundPixels = camera.roundPixels;
        var emitters = emitterManager.emitters.list;
        var emitterCount = emitters.length;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var maxQuads = this.maxQuads;
        var cameraScrollX = camera.scrollX;
        var cameraScrollY = camera.scrollY;
        var cameraMatrix = camera.matrix.matrix;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var sin = Math.sin;
        var cos = Math.cos;
        var vertexComponentCount = this.vertexComponentCount;
        var vertexCapacity = this.vertexCapacity;
        var texture = emitterManager.defaultFrame.source.glTexture;
        var pca, pcb, pcc, pcd, pce, pcf;
        var pma, pmb, pmc, pmd, pme, pmf;

        if (parentMatrix)
        {
            pma = parentMatrix[0];
            pmb = parentMatrix[1];
            pmc = parentMatrix[2];
            pmd = parentMatrix[3];
            pme = parentMatrix[4];
            pmf = parentMatrix[5];
        }

        this.setTexture2D(texture, 0);
        
        for (var emitterIndex = 0; emitterIndex < emitterCount; ++emitterIndex)
        {
            var emitter = emitters[emitterIndex];
            var particles = emitter.alive;
            var aliveLength = particles.length;
            var batchCount = Math.ceil(aliveLength / maxQuads);
            var particleOffset = 0;
            var scrollX = cameraScrollX * emitter.scrollFactorX;
            var scrollY = cameraScrollY * emitter.scrollFactorY;

            if (parentMatrix)
            {
                var cse = -scrollX;
                var csf = -scrollY;
                var pse = cse * cma + csf * cmc + cme;
                var psf = cse * cmb + csf * cmd + cmf;
                pca = pma * cma + pmb * cmc;
                pcb = pma * cmb + pmb * cmd;
                pcc = pmc * cma + pmd * cmc;
                pcd = pmc * cmb + pmd * cmd;
                pce = pme * cma + pmf * cmc + pse;
                pcf = pme * cmb + pmf * cmd + psf;

                cma = pca;
                cmb = pcb;
                cmc = pcc;
                cmd = pcd;
                cme = pce;
                cmf = pcf;

                scrollX = 0.0;
                scrollY = 0.0;
            }

            if (!emitter.visible || aliveLength === 0)
            {
                continue;
            }

            renderer.setBlendMode(emitter.blendMode);

            if (this.vertexCount >= vertexCapacity)
            {
                this.flush();
                this.setTexture2D(texture, 0);
            }

            var tintEffect = false;

            for (var batchIndex = 0; batchIndex < batchCount; ++batchIndex)
            {
                var batchSize = Math.min(aliveLength, maxQuads);

                for (var index = 0; index < batchSize; ++index)
                {
                    var particle = particles[particleOffset + index];

                    if (particle.alpha <= 0)
                    {
                        continue;
                    }

                    var frame = particle.frame;
                    var uvs = frame.uvs;
                    var x = -(frame.halfWidth);
                    var y = -(frame.halfHeight);
                    var color = particle.color;
                    var xw = x + frame.width;
                    var yh = y + frame.height;
                    var sr = sin(particle.rotation);
                    var cr = cos(particle.rotation);

                    var sra = cr * particle.scaleX;
                    var srb = sr * particle.scaleX;
                    var src = -sr * particle.scaleY;
                    var srd = cr * particle.scaleY;
                    var sre = particle.x - scrollX;
                    var srf = particle.y - scrollY;

                    var mva = sra * cma + srb * cmc;
                    var mvb = sra * cmb + srb * cmd;
                    var mvc = src * cma + srd * cmc;
                    var mvd = src * cmb + srd * cmd;
                    var mve = sre * cma + srf * cmc + cme;
                    var mvf = sre * cmb + srf * cmd + cmf;

                    var tx0 = x * mva + y * mvc + mve;
                    var ty0 = x * mvb + y * mvd + mvf;
                    var tx1 = x * mva + yh * mvc + mve;
                    var ty1 = x * mvb + yh * mvd + mvf;
                    var tx2 = xw * mva + yh * mvc + mve;
                    var ty2 = xw * mvb + yh * mvd + mvf;
                    var tx3 = xw * mva + y * mvc + mve;
                    var ty3 = xw * mvb + y * mvd + mvf;

                    if (roundPixels)
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

                    var vertexOffset = (this.vertexCount * vertexComponentCount) - 1;

                    vertexViewF32[++vertexOffset] = tx0;
                    vertexViewF32[++vertexOffset] = ty0;
                    vertexViewF32[++vertexOffset] = uvs.x0;
                    vertexViewF32[++vertexOffset] = uvs.y0;
                    vertexViewF32[++vertexOffset] = tintEffect;
                    vertexViewU32[++vertexOffset] = color;

                    vertexViewF32[++vertexOffset] = tx1;
                    vertexViewF32[++vertexOffset] = ty1;
                    vertexViewF32[++vertexOffset] = uvs.x1;
                    vertexViewF32[++vertexOffset] = uvs.y1;
                    vertexViewF32[++vertexOffset] = tintEffect;
                    vertexViewU32[++vertexOffset] = color;

                    vertexViewF32[++vertexOffset] = tx2;
                    vertexViewF32[++vertexOffset] = ty2;
                    vertexViewF32[++vertexOffset] = uvs.x2;
                    vertexViewF32[++vertexOffset] = uvs.y2;
                    vertexViewF32[++vertexOffset] = tintEffect;
                    vertexViewU32[++vertexOffset] = color;

                    vertexViewF32[++vertexOffset] = tx0;
                    vertexViewF32[++vertexOffset] = ty0;
                    vertexViewF32[++vertexOffset] = uvs.x0;
                    vertexViewF32[++vertexOffset] = uvs.y0;
                    vertexViewF32[++vertexOffset] = tintEffect;
                    vertexViewU32[++vertexOffset] = color;

                    vertexViewF32[++vertexOffset] = tx2;
                    vertexViewF32[++vertexOffset] = ty2;
                    vertexViewF32[++vertexOffset] = uvs.x2;
                    vertexViewF32[++vertexOffset] = uvs.y2;
                    vertexViewF32[++vertexOffset] = tintEffect;
                    vertexViewU32[++vertexOffset] = color;

                    vertexViewF32[++vertexOffset] = tx3;
                    vertexViewF32[++vertexOffset] = ty3;
                    vertexViewF32[++vertexOffset] = uvs.x3;
                    vertexViewF32[++vertexOffset] = uvs.y3;
                    vertexViewF32[++vertexOffset] = tintEffect;
                    vertexViewU32[++vertexOffset] = color;

                    this.vertexCount += 6;

                    if (this.vertexCount >= vertexCapacity)
                    {
                        this.flush();
                        this.setTexture2D(texture, 0);
                    }
                }

                particleOffset += batchSize;
                aliveLength -= batchSize;

                if (this.vertexCount >= vertexCapacity)
                {
                    this.flush();
                    this.setTexture2D(texture, 0);
                }
            }
        }
        
        this.setTexture2D(texture, 0);
    },

    /**
     * Batches Sprite game object
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     */
    batchSprite: function (sprite, camera, parentTransformMatrix)
    {
        this.renderer.setPipeline(this);

        var camMatrix = this._tempCameraMatrix;
        var spriteMatrix = this._tempSpriteMatrix;

        spriteMatrix.applyITRS(sprite.x - camera.scrollX * sprite.scrollFactorX, sprite.y - camera.scrollY * sprite.scrollFactorY, sprite.rotation, sprite.scaleX, sprite.scaleY);

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

        camMatrix.copyFrom(camera.matrix);

        var calcMatrix;

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * sprite.scrollFactorX, -camera.scrollY * sprite.scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = sprite.x;
            spriteMatrix.f = sprite.y;

            //  Multiply by the Sprite matrix
            calcMatrix = camMatrix.multiply(spriteMatrix);
        }
        else
        {
            calcMatrix = spriteMatrix.multiply(camMatrix);
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
        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
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

            return true;
        }
        else
        {
            return false;
        }
    },

    /**
     * Batches BitmapText game object
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.BitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     */
    batchBitmapText: function (bitmapText, camera, parentTransformMatrix)
    {
        var parentMatrix = null;

        if (parentTransformMatrix)
        {
            parentMatrix = parentTransformMatrix.matrix;
        }

        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = camera.roundPixels;
        var text = bitmapText.text;
        var textLength = text.length;
        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var cameraMatrix = camera.matrix.matrix;
        var cameraWidth = camera.width + 50;
        var cameraHeight = camera.height + 50;
        var cameraX = -50;
        var cameraY = -50;
        var frame = bitmapText.frame;
        var textureSource = bitmapText.texture.source[frame.sourceIndex];
        var cameraScrollX = camera.scrollX * bitmapText.scrollFactorX;
        var cameraScrollY = camera.scrollY * bitmapText.scrollFactorY;
        var fontData = bitmapText.fontData;
        var lineHeight = fontData.lineHeight;
        var scale = (bitmapText.fontSize / fontData.size);
        var chars = fontData.chars;
        var alpha = camera.alpha * bitmapText.alpha;
        var vTintTL = getTint(bitmapText._tintTL, alpha);
        var vTintTR = getTint(bitmapText._tintTR, alpha);
        var vTintBL = getTint(bitmapText._tintBL, alpha);
        var vTintBR = getTint(bitmapText._tintBR, alpha);
        var tintEffect = (bitmapText._isTinted && bitmapText.tintFill);
        var srcX = bitmapText.x;
        var srcY = bitmapText.y;
        var textureX = frame.cutX;
        var textureY = frame.cutY;
        var textureWidth = textureSource.width;
        var textureHeight = textureSource.height;
        var texture = textureSource.glTexture;
        var xAdvance = 0;
        var yAdvance = 0;
        var indexCount = 0;
        var charCode = 0;
        var glyph = null;
        var glyphX = 0;
        var glyphY = 0;
        var glyphW = 0;
        var glyphH = 0;
        var x = 0;
        var y = 0;
        var xw = 0;
        var yh = 0;

        var tx0;
        var ty0;
        var tx1;
        var ty1;
        var tx2;
        var ty2;
        var tx3;
        var ty3;

        var umin = 0;
        var umax = 0;
        var vmin = 0;
        var vmax = 0;
        var lastGlyph = null;
        var lastCharCode = 0;
        var translateX = srcX + frame.x;
        var translateY = srcY + frame.y;
        var rotation = bitmapText.rotation;
        var scaleX = bitmapText.scaleX;
        var scaleY = bitmapText.scaleY;
        var letterSpacing = bitmapText.letterSpacing;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = sr * scaleX;
        var src = -sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var vertexOffset = 0;
        var mva, mvb, mvc, mvd, mve, mvf;

        if (parentMatrix)
        {
            var pma = parentMatrix[0];
            var pmb = parentMatrix[1];
            var pmc = parentMatrix[2];
            var pmd = parentMatrix[3];
            var pme = parentMatrix[4];
            var pmf = parentMatrix[5];
            var cse = -cameraScrollX;
            var csf = -cameraScrollY;
            var pse = cse * cma + csf * cmc + cme;
            var psf = cse * cmb + csf * cmd + cmf;
            var pca = pma * cma + pmb * cmc;
            var pcb = pma * cmb + pmb * cmd;
            var pcc = pmc * cma + pmd * cmc;
            var pcd = pmc * cmb + pmd * cmd;
            var pce = pme * cma + pmf * cmc + pse;
            var pcf = pme * cmb + pmf * cmd + psf;

            mva = sra * pca + srb * pcc;
            mvb = sra * pcb + srb * pcd;
            mvc = src * pca + srd * pcc;
            mvd = src * pcb + srd * pcd;
            mve = sre * pca + srf * pcc + pce;
            mvf = sre * pcb + srf * pcd + pcf;
        }
        else
        {
            sre -= cameraScrollX;
            srf -= cameraScrollY;

            mva = sra * cma + srb * cmc;
            mvb = sra * cmb + srb * cmd;
            mvc = src * cma + srd * cmc;
            mvd = src * cmb + srd * cmd;
            mve = sre * cma + srf * cmc + cme;
            mvf = sre * cmb + srf * cmd + cmf;
        }

        this.setTexture2D(texture, 0);

        for (var index = 0; index < textLength; ++index)
        {
            charCode = text.charCodeAt(index);

            if (charCode === 10)
            {
                xAdvance = 0;
                indexCount = 0;
                yAdvance += lineHeight;
                lastGlyph = null;
                continue;
            }

            glyph = chars[charCode];

            if (!glyph)
            {
                continue;
            }

            glyphX = textureX + glyph.x;
            glyphY = textureY + glyph.y;

            glyphW = glyph.width;
            glyphH = glyph.height;

            x = (indexCount + glyph.xOffset + xAdvance) * scale;
            y = (glyph.yOffset + yAdvance) * scale;

            if (lastGlyph !== null)
            {
                var kerningOffset = glyph.kerning[lastCharCode];
                x += (kerningOffset !== undefined) ? kerningOffset : 0;
            }

            xAdvance += glyph.xAdvance + letterSpacing;
            indexCount += 1;
            lastGlyph = glyph;
            lastCharCode = charCode;

            //  Nothing to render or a space? Then skip to the next glyph
            if (glyphW === 0 || glyphH === 0 || charCode === 32)
            {
                continue;
            }

            x -= bitmapText.displayOriginX;
            y -= bitmapText.displayOriginY;

            xw = x + glyphW * scale;
            yh = y + glyphH * scale;
            tx0 = x * mva + y * mvc + mve;
            ty0 = x * mvb + y * mvd + mvf;
            tx1 = x * mva + yh * mvc + mve;
            ty1 = x * mvb + yh * mvd + mvf;
            tx2 = xw * mva + yh * mvc + mve;
            ty2 = xw * mvb + yh * mvd + mvf;
            tx3 = xw * mva + y * mvc + mve;
            ty3 = xw * mvb + y * mvd + mvf;

            umin = glyphX / textureWidth;
            umax = (glyphX + glyphW) / textureWidth;
            vmin = glyphY / textureHeight;
            vmax = (glyphY + glyphH) / textureHeight;

            if ((tx0 < cameraX || tx0 > cameraWidth || ty0 < cameraY || ty0 > cameraHeight) &&
                (tx1 < cameraX || tx1 > cameraWidth || ty1 < cameraY || ty1 > cameraHeight) &&
                (tx2 < cameraX || tx2 > cameraWidth || ty2 < cameraY || ty2 > cameraHeight) &&
                (tx3 < cameraX || tx3 > cameraWidth || ty3 < cameraY || ty3 > cameraHeight))
            {
                continue;
            }

            if (this.vertexCount + 6 > this.vertexCapacity)
            {
                this.flush();
            }
            
            if (roundPixels)
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

            vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

            vertexViewF32[++vertexOffset] = tx0;
            vertexViewF32[++vertexOffset] = ty0;
            vertexViewF32[++vertexOffset] = umin;
            vertexViewF32[++vertexOffset] = vmin;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintTL;
    
            vertexViewF32[++vertexOffset] = tx1;
            vertexViewF32[++vertexOffset] = ty1;
            vertexViewF32[++vertexOffset] = umin;
            vertexViewF32[++vertexOffset] = vmax;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintBL;

            vertexViewF32[++vertexOffset] = tx2;
            vertexViewF32[++vertexOffset] = ty2;
            vertexViewF32[++vertexOffset] = umax;
            vertexViewF32[++vertexOffset] = vmax;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintBR;

            vertexViewF32[++vertexOffset] = tx0;
            vertexViewF32[++vertexOffset] = ty0;
            vertexViewF32[++vertexOffset] = umin;
            vertexViewF32[++vertexOffset] = vmin;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintTL;

            vertexViewF32[++vertexOffset] = tx2;
            vertexViewF32[++vertexOffset] = ty2;
            vertexViewF32[++vertexOffset] = umax;
            vertexViewF32[++vertexOffset] = vmax;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintBR;

            vertexViewF32[++vertexOffset] = tx3;
            vertexViewF32[++vertexOffset] = ty3;
            vertexViewF32[++vertexOffset] = umax;
            vertexViewF32[++vertexOffset] = vmin;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintTR;
        
            this.vertexCount += 6;
        }
    },

    /**
     * Batches DynamicBitmapText game object
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#batchDynamicBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.DynamicBitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     */
    batchDynamicBitmapText: function (bitmapText, camera, parentTransformMatrix)
    {
        var parentMatrix = null;

        if (parentTransformMatrix)
        {
            parentMatrix = parentTransformMatrix.matrix;
        }

        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = camera.roundPixels;
        var displayCallback = bitmapText.displayCallback;
        var text = bitmapText.text;
        var textLength = text.length;
        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var cameraMatrix = camera.matrix.matrix;
        var frame = bitmapText.frame;
        var textureSource = bitmapText.texture.source[frame.sourceIndex];
        var cameraScrollX = camera.scrollX * bitmapText.scrollFactorX;
        var cameraScrollY = camera.scrollY * bitmapText.scrollFactorY;
        var scrollX = bitmapText.scrollX;
        var scrollY = bitmapText.scrollY;
        var fontData = bitmapText.fontData;
        var lineHeight = fontData.lineHeight;
        var scale = (bitmapText.fontSize / fontData.size);
        var chars = fontData.chars;
        var alpha = camera.alpha * bitmapText.alpha;
        var vTintTL = getTint(bitmapText._tintTL, alpha);
        var vTintTR = getTint(bitmapText._tintTR, alpha);
        var vTintBL = getTint(bitmapText._tintBL, alpha);
        var vTintBR = getTint(bitmapText._tintBR, alpha);
        var tintEffect = (bitmapText._isTinted && bitmapText.tintFill);
        var srcX = bitmapText.x;
        var srcY = bitmapText.y;
        var textureX = frame.cutX;
        var textureY = frame.cutY;
        var textureWidth = textureSource.width;
        var textureHeight = textureSource.height;
        var texture = textureSource.glTexture;
        var xAdvance = 0;
        var yAdvance = 0;
        var indexCount = 0;
        var charCode = 0;
        var glyph = null;
        var glyphX = 0;
        var glyphY = 0;
        var glyphW = 0;
        var glyphH = 0;
        var x = 0;
        var y = 0;
        var xw = 0;
        var tx0;
        var ty0;
        var tx1;
        var ty1;
        var tx2;
        var ty2;
        var tx3;
        var ty3;
        var yh = 0;
        var umin = 0;
        var umax = 0;
        var vmin = 0;
        var vmax = 0;
        var lastGlyph = null;
        var lastCharCode = 0;
        var translateX = srcX + frame.x;
        var translateY = srcY + frame.y;
        var rotation = bitmapText.rotation;
        var scaleX = bitmapText.scaleX;
        var scaleY = bitmapText.scaleY;
        var letterSpacing = bitmapText.letterSpacing;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = sr * scaleX;
        var src = -sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var crop = (bitmapText.cropWidth > 0 || bitmapText.cropHeight > 0);
        var uta, utb, utc, utd, ute, utf;
        var vertexOffset = 0;
        var mva, mvb, mvc, mvd, mve, mvf;

        if (parentMatrix)
        {
            var pma = parentMatrix[0];
            var pmb = parentMatrix[1];
            var pmc = parentMatrix[2];
            var pmd = parentMatrix[3];
            var pme = parentMatrix[4];
            var pmf = parentMatrix[5];
            var cse = -cameraScrollX;
            var csf = -cameraScrollY;
            var pse = cse * cma + csf * cmc + cme;
            var psf = cse * cmb + csf * cmd + cmf;
            var pca = pma * cma + pmb * cmc;
            var pcb = pma * cmb + pmb * cmd;
            var pcc = pmc * cma + pmd * cmc;
            var pcd = pmc * cmb + pmd * cmd;
            var pce = pme * cma + pmf * cmc + pse;
            var pcf = pme * cmb + pmf * cmd + psf;

            mva = sra * pca + srb * pcc;
            mvb = sra * pcb + srb * pcd;
            mvc = src * pca + srd * pcc;
            mvd = src * pcb + srd * pcd;
            mve = sre * pca + srf * pcc + pce;
            mvf = sre * pcb + srf * pcd + pcf;
        }
        else
        {
            sre -= cameraScrollX;
            srf -= cameraScrollY;

            mva = sra * cma + srb * cmc;
            mvb = sra * cmb + srb * cmd;
            mvc = src * cma + srd * cmc;
            mvd = src * cmb + srd * cmd;
            mve = sre * cma + srf * cmc + cme;
            mvf = sre * cmb + srf * cmd + cmf;
        }

        this.setTexture2D(texture, 0);

        if (crop)
        {
            renderer.pushScissor(
                bitmapText.x,
                bitmapText.y,
                bitmapText.cropWidth * bitmapText.scaleX,
                bitmapText.cropHeight * bitmapText.scaleY
            );
        }

        for (var index = 0; index < textLength; ++index)
        {
            scale = (bitmapText.fontSize / bitmapText.fontData.size);
            rotation = 0;

            charCode = text.charCodeAt(index);

            if (charCode === 10)
            {
                xAdvance = 0;
                indexCount = 0;
                yAdvance += lineHeight;
                lastGlyph = null;
                continue;
            }

            glyph = chars[charCode];

            if (!glyph)
            {
                continue;
            }

            glyphX = textureX + glyph.x;
            glyphY = textureY + glyph.y;

            glyphW = glyph.width;
            glyphH = glyph.height;
            
            x = (indexCount + glyph.xOffset + xAdvance) - scrollX;
            y = (glyph.yOffset + yAdvance) - scrollY;

            if (lastGlyph !== null)
            {
                var kerningOffset = glyph.kerning[lastCharCode];
                x += (kerningOffset !== undefined) ? kerningOffset : 0;
            }

            xAdvance += glyph.xAdvance + letterSpacing;
            indexCount += 1;
            lastGlyph = glyph;
            lastCharCode = charCode;

            //  Nothing to render or a space? Then skip to the next glyph
            if (glyphW === 0 || glyphH === 0 || charCode === 32)
            {
                continue;
            }

            if (displayCallback)
            {
                var output = displayCallback({
                    color: 0,
                    tint: {
                        topLeft: vTintTL,
                        topRight: vTintTR,
                        bottomLeft: vTintBL,
                        bottomRight: vTintBR
                    },
                    index: index,
                    charCode: charCode,
                    x: x,
                    y: y,
                    scale: scale,
                    rotation: 0,
                    data: glyph.data
                });

                x = output.x;
                y = output.y;
                scale = output.scale;
                rotation = output.rotation;

                if (output.color)
                {
                    vTintTL = output.color;
                    vTintTR = output.color;
                    vTintBL = output.color;
                    vTintBR = output.color;
                }
                else
                {
                    vTintTL = output.tint.topLeft;
                    vTintTR = output.tint.topRight;
                    vTintBL = output.tint.bottomLeft;
                    vTintBR = output.tint.bottomRight;
                }

                vTintTL = getTint(vTintTL, alpha);
                vTintTR = getTint(vTintTR, alpha);
                vTintBL = getTint(vTintBL, alpha);
                vTintBR = getTint(vTintBR, alpha);
            }

            x -= bitmapText.displayOriginX;
            y -= bitmapText.displayOriginY;
            x *= scale;
            y *= scale;

            sr = Math.sin(rotation);
            cr = Math.cos(rotation);
            uta = cr * scale;
            utb = sr * scale;
            utc = -sr * scale;
            utd = cr * scale;
            ute = x;
            utf = y;

            sra = uta * mva + utb * mvc;
            srb = uta * mvb + utb * mvd;
            src = utc * mva + utd * mvc;
            srd = utc * mvb + utd * mvd;
            sre = ute * mva + utf * mvc + mve;
            srf = ute * mvb + utf * mvd + mvf;

            xw = glyphW;
            yh = glyphH;
            tx0 = sre;
            ty0 = srf;
            tx1 = yh * src + sre;
            ty1 = yh * srd + srf;
            tx2 = xw * sra + yh * src + sre;
            ty2 = xw * srb + yh * srd + srf;
            tx3 = xw * sra + sre;
            ty3 = xw * srb + srf;

            umin = glyphX / textureWidth;
            umax = (glyphX + glyphW) / textureWidth;
            vmin = glyphY / textureHeight;
            vmax = (glyphY + glyphH) / textureHeight;

            if (this.vertexCount + 6 > this.vertexCapacity)
            {
                this.flush();
            }
            
            if (roundPixels)
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

            vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

            vertexViewF32[++vertexOffset] = tx0;
            vertexViewF32[++vertexOffset] = ty0;
            vertexViewF32[++vertexOffset] = umin;
            vertexViewF32[++vertexOffset] = vmin;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintTL;
    
            vertexViewF32[++vertexOffset] = tx1;
            vertexViewF32[++vertexOffset] = ty1;
            vertexViewF32[++vertexOffset] = umin;
            vertexViewF32[++vertexOffset] = vmax;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintBL;

            vertexViewF32[++vertexOffset] = tx2;
            vertexViewF32[++vertexOffset] = ty2;
            vertexViewF32[++vertexOffset] = umax;
            vertexViewF32[++vertexOffset] = vmax;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintBR;

            vertexViewF32[++vertexOffset] = tx0;
            vertexViewF32[++vertexOffset] = ty0;
            vertexViewF32[++vertexOffset] = umin;
            vertexViewF32[++vertexOffset] = vmin;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintTL;

            vertexViewF32[++vertexOffset] = tx2;
            vertexViewF32[++vertexOffset] = ty2;
            vertexViewF32[++vertexOffset] = umax;
            vertexViewF32[++vertexOffset] = vmax;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintBR;

            vertexViewF32[++vertexOffset] = tx3;
            vertexViewF32[++vertexOffset] = ty3;
            vertexViewF32[++vertexOffset] = umax;
            vertexViewF32[++vertexOffset] = vmin;
            vertexViewF32[++vertexOffset] = tintEffect;
            vertexViewU32[++vertexOffset] = vTintTR;
        
            this.vertexCount += 6;
        }

        if (crop)
        {
            renderer.popScissor();
        }
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
        this.renderer.setPipeline(this);

        var camMatrix = this._tempCameraMatrix;
        var spriteMatrix = this._tempSpriteMatrix;

        spriteMatrix.applyITRS(srcX - camera.scrollX * scrollFactorX, srcY - camera.scrollY * scrollFactorY, rotation, scaleX, scaleY);

        var width = srcWidth;
        var height = srcHeight;

        var x = -displayOriginX;
        var y = -displayOriginY;

        if (flipX)
        {
            width *= -1;
            x += srcWidth;
        }

        if (flipY || texture.isRenderTexture)
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

        camMatrix.copyFrom(camera.matrix);

        var calcMatrix;

        if (parentTransformMatrix)
        {
            //  Multiply the camera by the parent matrix
            camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * scrollFactorX, -camera.scrollY * scrollFactorY);

            //  Undo the camera scroll
            spriteMatrix.e = srcX;
            spriteMatrix.f = srcY;

            //  Multiply by the Sprite matrix
            calcMatrix = camMatrix.multiply(spriteMatrix);
        }
        else
        {
            calcMatrix = spriteMatrix.multiply(camMatrix);
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
     * Immediately draws a texture with no batching.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline#drawTexture
     * @since 3.2.0
     *
     * @param {WebGLTexture} texture [description]
     * @param {number} srcX - [description]
     * @param {number} srcY - [description]
     * @param {number} tint - [description]
     * @param {number} alpha - [description]
     * @param {number} frameX - [description]
     * @param {number} frameY - [description]
     * @param {number} frameWidth - [description]
     * @param {number} frameHeight - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} transformMatrix - [description]
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline} This Pipeline.
     */
    drawTexture: function (
        texture,
        srcX, srcY,
        tint, alpha,
        frameX, frameY, frameWidth, frameHeight,
        transformMatrix,
        parentTransformMatrix
    )
    {
        var parentMatrix = null;

        if (parentTransformMatrix)
        {
            parentMatrix = parentTransformMatrix.matrix;
        }

        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = this.renderer.config.roundPixels;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var width = frameWidth;
        var height = frameHeight;
        var x = srcX;
        var y = srcY;
        var xw = x + width;
        var yh = y + height;
        var mva = transformMatrix[0];
        var mvb = transformMatrix[1];
        var mvc = transformMatrix[2];
        var mvd = transformMatrix[3];
        var mve = transformMatrix[4];
        var mvf = transformMatrix[5];

        if (parentMatrix)
        {
            var pma = parentMatrix[0];
            var pmb = parentMatrix[1];
            var pmc = parentMatrix[2];
            var pmd = parentMatrix[3];
            var pme = parentMatrix[4];
            var pmf = parentMatrix[5];
            var pca = mva * pma + mvb * pmc;
            var pcb = mva * pmb + mvb * pmd;
            var pcc = mvc * pma + mvd * pmc;
            var pcd = mvc * pmb + mvd * pmd;
            var pce = mve * pma + mvf * pmc + pme;
            var pcf = mve * pmb + mvf * pmd + pmf;
            mva = pca;
            mvb = pcb;
            mvc = pcc;
            mvd = pcd;
            mve = pce;
            mvf = pcf;
        }

        var tx0 = x * mva + y * mvc + mve;
        var ty0 = x * mvb + y * mvd + mvf;
        var tx1 = x * mva + yh * mvc + mve;
        var ty1 = x * mvb + yh * mvd + mvf;
        var tx2 = xw * mva + yh * mvc + mve;
        var ty2 = xw * mvb + yh * mvd + mvf;
        var tx3 = xw * mva + y * mvc + mve;
        var ty3 = xw * mvb + y * mvd + mvf;
        var textureWidth = texture.width;
        var textureHeight = texture.height;
        var u0 = (frameX / textureWidth);
        var v0 = (frameY / textureHeight);
        var u1 = (frameX + frameWidth) / textureWidth;
        var v1 = (frameY + frameHeight) / textureHeight;
        var tintEffect = 0;
        tint = Utils.getTintAppendFloatAlpha(tint, alpha);
        
        this.setTexture2D(texture, 0);

        if (roundPixels)
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

        var vertexOffset = (this.vertexCount * this.vertexComponentCount) - 1;

        vertexViewF32[++vertexOffset] = tx0;
        vertexViewF32[++vertexOffset] = ty0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = tx1;
        vertexViewF32[++vertexOffset] = ty1;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = tx2;
        vertexViewF32[++vertexOffset] = ty2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = tx0;
        vertexViewF32[++vertexOffset] = ty0;
        vertexViewF32[++vertexOffset] = u0;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = tx2;
        vertexViewF32[++vertexOffset] = ty2;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v1;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        vertexViewF32[++vertexOffset] = tx3;
        vertexViewF32[++vertexOffset] = ty3;
        vertexViewF32[++vertexOffset] = u1;
        vertexViewF32[++vertexOffset] = v0;
        vertexViewF32[++vertexOffset] = tintEffect;
        vertexViewU32[++vertexOffset] = tint;

        this.vertexCount += 6;

        // Force an immediate draw
        this.flush();
    }

});

module.exports = TextureTintPipeline;
