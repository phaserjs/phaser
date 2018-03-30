/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var ModelViewProjection = require('./components/ModelViewProjection');
var ShaderSourceFS = require('../shaders/TextureTint.frag');
var ShaderSourceVS = require('../shaders/TextureTint.vert');
var Utils = require('../Utils');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * [description]
 *
 * @class TextureTintPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL
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
        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: (config.topology ? config.topology : config.renderer.gl.TRIANGLES),
            vertShader: (config.vertShader ? config.vertShader : ShaderSourceVS),
            fragShader: (config.fragShader ? config.fragShader : ShaderSourceFS),
            vertexCapacity: (config.vertexCapacity ? config.vertexCapacity : 6 * 2000),

            vertexSize: (config.vertexSize ? config.vertexSize :
                Float32Array.BYTES_PER_ELEMENT * 2 +
                Float32Array.BYTES_PER_ELEMENT * 2 +
                Uint8Array.BYTES_PER_ELEMENT * 4),

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
                    name: 'inTint',
                    size: 4,
                    type: config.renderer.gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 4
                }
            ]
        });

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.TextureTintPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.0.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.TextureTintPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.0.0
         */
        this.vertexViewU32 = new Uint32Array(this.vertexData);

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.TextureTintPipeline#maxQuads
         * @type {integer}
         * @default 2000
         * @since 3.0.0
         */
        this.maxQuads = 2000;

        /**
         * [description]
         *
         * @name Phaser.Renderer.WebGL.TextureTintPipeline#batches
         * @type {array}
         * @since 3.1.0
         */
        this.batches = [];

        this.mvpInit();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#setTexture2D
     * @since 3.1.0
     *
     * @param {WebGLTexture} texture - [description]
     * @param {integer} textureUnit - [description]
     *
     * @return {Phaser.Renderer.WebGL.TextureTintPipeline} [description]
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#pushBatch
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#flush
     * @since 3.1.0
     *
     * @return {Phaser.Renderer.WebGL.TextureTintPipeline} This Pipeline.
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#onBind
     * @since 3.0.0
     *
     * @return {Phaser.Renderer.WebGL.TextureTintPipeline} [description]
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
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#resize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} resolution - [description]
     *
     * @return {Phaser.Renderer.WebGL.TextureTintPipeline} [description]
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);
        this.projOrtho(0, this.width, this.height, 0, -1000.0, 1000.0);
        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#drawStaticTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.StaticTilemapLayer} tilemap - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    drawStaticTilemapLayer: function (tilemap)
    {
        if (tilemap.vertexCount > 0)
        {
            var pipelineVertexBuffer = this.vertexBuffer;
            var gl = this.gl;
            var renderer = this.renderer;
            var frame = tilemap.tileset.image.get();

            if (renderer.currentPipeline &&
                renderer.currentPipeline.vertexCount > 0)
            {
                renderer.flush();
            }

            this.vertexBuffer = tilemap.vertexBuffer;
            renderer.setPipeline(this);
            renderer.setTexture2D(frame.source.glTexture, 0);
            gl.drawArrays(this.topology, 0, tilemap.vertexCount);
            this.vertexBuffer = pipelineVertexBuffer;
        }

        this.viewIdentity();
        this.modelIdentity();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#drawEmitterManager
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} emitterManager - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    drawEmitterManager: function (emitterManager, camera)
    {
        this.renderer.setPipeline(this);

        var roundPixels = this.renderer.config.roundPixels;
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
                    var srb = -sr * particle.scaleX;
                    var src = sr * particle.scaleY;
                    var srd = cr * particle.scaleY;
                    var sre = particle.x - scrollX * particle.scrollFactorX;
                    var srf = particle.y - scrollY * particle.scrollFactorY;
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
                    var vertexOffset = this.vertexCount * vertexComponentCount;

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

                    vertexViewF32[vertexOffset + 0] = tx0;
                    vertexViewF32[vertexOffset + 1] = ty0;
                    vertexViewF32[vertexOffset + 2] = uvs.x0;
                    vertexViewF32[vertexOffset + 3] = uvs.y0;
                    vertexViewU32[vertexOffset + 4] = color;
                    vertexViewF32[vertexOffset + 5] = tx1;
                    vertexViewF32[vertexOffset + 6] = ty1;
                    vertexViewF32[vertexOffset + 7] = uvs.x1;
                    vertexViewF32[vertexOffset + 8] = uvs.y1;
                    vertexViewU32[vertexOffset + 9] = color;
                    vertexViewF32[vertexOffset + 10] = tx2;
                    vertexViewF32[vertexOffset + 11] = ty2;
                    vertexViewF32[vertexOffset + 12] = uvs.x2;
                    vertexViewF32[vertexOffset + 13] = uvs.y2;
                    vertexViewU32[vertexOffset + 14] = color;
                    vertexViewF32[vertexOffset + 15] = tx0;
                    vertexViewF32[vertexOffset + 16] = ty0;
                    vertexViewF32[vertexOffset + 17] = uvs.x0;
                    vertexViewF32[vertexOffset + 18] = uvs.y0;
                    vertexViewU32[vertexOffset + 19] = color;
                    vertexViewF32[vertexOffset + 20] = tx2;
                    vertexViewF32[vertexOffset + 21] = ty2;
                    vertexViewF32[vertexOffset + 22] = uvs.x2;
                    vertexViewF32[vertexOffset + 23] = uvs.y2;
                    vertexViewU32[vertexOffset + 24] = color;
                    vertexViewF32[vertexOffset + 25] = tx3;
                    vertexViewF32[vertexOffset + 26] = ty3;
                    vertexViewF32[vertexOffset + 27] = uvs.x3;
                    vertexViewF32[vertexOffset + 28] = uvs.y3;
                    vertexViewU32[vertexOffset + 29] = color;

                    this.vertexCount += 6;
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
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#drawBlitter
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Blitter} blitter - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    drawBlitter: function (blitter, camera)
    {
        this.renderer.setPipeline(this);

        var roundPixels = this.renderer.config.roundPixels;
        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var list = blitter.getRenderList();
        var length = list.length;
        var cameraMatrix = camera.matrix.matrix;
        var a = cameraMatrix[0];
        var b = cameraMatrix[1];
        var c = cameraMatrix[2];
        var d = cameraMatrix[3];
        var e = cameraMatrix[4];
        var f = cameraMatrix[5];
        var cameraScrollX = camera.scrollX * blitter.scrollFactorX;
        var cameraScrollY = camera.scrollY * blitter.scrollFactorY;
        var batchCount = Math.ceil(length / this.maxQuads);
        var batchOffset = 0;
        var blitterX = blitter.x - cameraScrollX;
        var blitterY = blitter.y - cameraScrollY;

        for (var batchIndex = 0; batchIndex < batchCount; ++batchIndex)
        {
            var batchSize = Math.min(length, this.maxQuads);

            for (var index = 0; index < batchSize; ++index)
            {
                var bob = list[batchOffset + index];
                var frame = bob.frame;
                var alpha = bob.alpha;
                var tint = getTint(0xffffff, alpha);
                var uvs = frame.uvs;
                var flipX = bob.flipX;
                var flipY = bob.flipY;
                var width = frame.width * (flipX ? -1.0 : 1.0);
                var height = frame.height * (flipY ? -1.0 : 1.0);
                var x = blitterX + bob.x + frame.x + (frame.width * ((flipX) ? 1.0 : 0.0));
                var y = blitterY + bob.y + frame.y + (frame.height * ((flipY) ? 1.0 : 0.0));
                var xw = x + width;
                var yh = y + height;
                var tx0 = x * a + y * c + e;
                var ty0 = x * b + y * d + f;
                var tx1 = xw * a + yh * c + e;
                var ty1 = xw * b + yh * d + f;
            
                // Bind Texture if texture wasn't bound.
                // This needs to be here because of multiple
                // texture atlas.
                this.setTexture2D(frame.texture.source[frame.sourceIndex].glTexture, 0);

                var vertexOffset = this.vertexCount * this.vertexComponentCount;

                if (roundPixels)
                {
                    tx0 |= 0;
                    ty0 |= 0;
                    tx1 |= 0;
                    ty1 |= 0;
                }
            
                vertexViewF32[vertexOffset + 0] = tx0;
                vertexViewF32[vertexOffset + 1] = ty0;
                vertexViewF32[vertexOffset + 2] = uvs.x0;
                vertexViewF32[vertexOffset + 3] = uvs.y0;
                vertexViewU32[vertexOffset + 4] = tint;
                vertexViewF32[vertexOffset + 5] = tx0;
                vertexViewF32[vertexOffset + 6] = ty1;
                vertexViewF32[vertexOffset + 7] = uvs.x1;
                vertexViewF32[vertexOffset + 8] = uvs.y1;
                vertexViewU32[vertexOffset + 9] = tint;
                vertexViewF32[vertexOffset + 10] = tx1;
                vertexViewF32[vertexOffset + 11] = ty1;
                vertexViewF32[vertexOffset + 12] = uvs.x2;
                vertexViewF32[vertexOffset + 13] = uvs.y2;
                vertexViewU32[vertexOffset + 14] = tint;
                vertexViewF32[vertexOffset + 15] = tx0;
                vertexViewF32[vertexOffset + 16] = ty0;
                vertexViewF32[vertexOffset + 17] = uvs.x0;
                vertexViewF32[vertexOffset + 18] = uvs.y0;
                vertexViewU32[vertexOffset + 19] = tint;
                vertexViewF32[vertexOffset + 20] = tx1;
                vertexViewF32[vertexOffset + 21] = ty1;
                vertexViewF32[vertexOffset + 22] = uvs.x2;
                vertexViewF32[vertexOffset + 23] = uvs.y2;
                vertexViewU32[vertexOffset + 24] = tint;
                vertexViewF32[vertexOffset + 25] = tx1;
                vertexViewF32[vertexOffset + 26] = ty0;
                vertexViewF32[vertexOffset + 27] = uvs.x3;
                vertexViewF32[vertexOffset + 28] = uvs.y3;
                vertexViewU32[vertexOffset + 29] = tint;

                this.vertexCount += 6;

                if (this.vertexCount >= this.vertexCapacity)
                {
                    this.flush();
                }
            }

            batchOffset += batchSize;
            length -= batchSize;

            if (this.vertexCount >= this.vertexCapacity)
            {
                this.flush();
            }
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Sprite} sprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchSprite: function (sprite, camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = this.renderer.config.roundPixels;
        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var cameraMatrix = camera.matrix.matrix;
        var frame = sprite.frame;
        var texture = frame.texture.source[frame.sourceIndex].glTexture;
        var forceFlipY = (texture.isRenderTexture ? true : false);
        var flipX = sprite.flipX;
        var flipY = sprite.flipY ^ forceFlipY;
        var uvs = frame.uvs;
        var width = frame.width * (flipX ? -1.0 : 1.0);
        var height = frame.height * (flipY ? -1.0 : 1.0);
        var x = -sprite.displayOriginX + frame.x + ((frame.width) * (flipX ? 1.0 : 0.0));
        var y = -sprite.displayOriginY + frame.y + ((frame.height) * (flipY ? 1.0 : 0.0));
        var xw = (roundPixels ? (x|0) : x) + width;
        var yh = (roundPixels ? (y|0) : y) + height;
        var translateX = sprite.x - camera.scrollX * sprite.scrollFactorX;
        var translateY = sprite.y - camera.scrollY * sprite.scrollFactorY;
        var scaleX = sprite.scaleX;
        var scaleY = sprite.scaleY;
        var rotation = -sprite.rotation;
        var alphaTL = sprite._alphaTL;
        var alphaTR = sprite._alphaTR;
        var alphaBL = sprite._alphaBL;
        var alphaBR = sprite._alphaBR;
        var tintTL = sprite._tintTL;
        var tintTR = sprite._tintTR;
        var tintBL = sprite._tintBL;
        var tintBR = sprite._tintBR;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = -sr * scaleX;
        var src = sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
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
        var vTintTL = getTint(tintTL, alphaTL);
        var vTintTR = getTint(tintTR, alphaTR);
        var vTintBL = getTint(tintBL, alphaBL);
        var vTintBR = getTint(tintBR, alphaBR);
        var vertexOffset = 0;

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

        this.setTexture2D(texture, 0);

        vertexOffset = this.vertexCount * this.vertexComponentCount;

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewF32[vertexOffset + 2] = uvs.x0;
        vertexViewF32[vertexOffset + 3] = uvs.y0;
        vertexViewU32[vertexOffset + 4] = vTintTL;
        vertexViewF32[vertexOffset + 5] = tx1;
        vertexViewF32[vertexOffset + 6] = ty1;
        vertexViewF32[vertexOffset + 7] = uvs.x1;
        vertexViewF32[vertexOffset + 8] = uvs.y1;
        vertexViewU32[vertexOffset + 9] = vTintBL;
        vertexViewF32[vertexOffset + 10] = tx2;
        vertexViewF32[vertexOffset + 11] = ty2;
        vertexViewF32[vertexOffset + 12] = uvs.x2;
        vertexViewF32[vertexOffset + 13] = uvs.y2;
        vertexViewU32[vertexOffset + 14] = vTintBR;
        vertexViewF32[vertexOffset + 15] = tx0;
        vertexViewF32[vertexOffset + 16] = ty0;
        vertexViewF32[vertexOffset + 17] = uvs.x0;
        vertexViewF32[vertexOffset + 18] = uvs.y0;
        vertexViewU32[vertexOffset + 19] = vTintTL;
        vertexViewF32[vertexOffset + 20] = tx2;
        vertexViewF32[vertexOffset + 21] = ty2;
        vertexViewF32[vertexOffset + 22] = uvs.x2;
        vertexViewF32[vertexOffset + 23] = uvs.y2;
        vertexViewU32[vertexOffset + 24] = vTintBR;
        vertexViewF32[vertexOffset + 25] = tx3;
        vertexViewF32[vertexOffset + 26] = ty3;
        vertexViewF32[vertexOffset + 27] = uvs.x3;
        vertexViewF32[vertexOffset + 28] = uvs.y3;
        vertexViewU32[vertexOffset + 29] = vTintTR;

        this.vertexCount += 6;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchMesh
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Mesh} mesh - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchMesh: function (mesh, camera)
    {
        var vertices = mesh.vertices;
        var length = vertices.length;
        var vertexCount = (length / 2)|0;

        this.renderer.setPipeline(this);

        if (this.vertexCount + vertexCount > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = this.renderer.config.roundPixels;
        var getTint = Utils.getTintAppendFloatAlpha;
        var uvs = mesh.uv;
        var colors = mesh.colors;
        var alphas = mesh.alphas;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var cameraMatrix = camera.matrix.matrix;
        var frame = mesh.frame;
        var texture = mesh.texture.source[frame.sourceIndex].glTexture;
        var translateX = mesh.x - camera.scrollX * mesh.scrollFactorX;
        var translateY = mesh.y - camera.scrollY * mesh.scrollFactorY;
        var scaleX = mesh.scaleX;
        var scaleY = mesh.scaleY;
        var rotation = -mesh.rotation;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = -sr * scaleX;
        var src = sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var mva = sra * cma + srb * cmc;
        var mvb = sra * cmb + srb * cmd;
        var mvc = src * cma + srd * cmc;
        var mvd = src * cmb + srd * cmd;
        var mve = sre * cma + srf * cmc + cme;
        var mvf = sre * cmb + srf * cmd + cmf;
        var vertexOffset = 0;

        this.setTexture2D(texture, 0);

        vertexOffset = this.vertexCount * this.vertexComponentCount;

        for (var index = 0, index0 = 0; index < length; index += 2)
        {
            var x = vertices[index + 0];
            var y = vertices[index + 1];
            var tx = x * mva + y * mvc + mve;
            var ty = x * mvb + y * mvd + mvf;

            if (roundPixels)
            {
                tx |= 0;
                ty |= 0;
            }

            vertexViewF32[vertexOffset + 0] = tx;
            vertexViewF32[vertexOffset + 1] = ty;
            vertexViewF32[vertexOffset + 2] = uvs[index + 0];
            vertexViewF32[vertexOffset + 3] = uvs[index + 1];
            vertexViewU32[vertexOffset + 4] = getTint(colors[index0], alphas[index0]);

            vertexOffset += 5;
            index0 += 1;
        }

        this.vertexCount += vertexCount;
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.BitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchBitmapText: function (bitmapText, camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = this.renderer.config.roundPixels;
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
        var alpha = bitmapText.alpha;
        var vTintTL = getTint(bitmapText._tintTL, alpha);
        var vTintTR = getTint(bitmapText._tintTR, alpha);
        var vTintBL = getTint(bitmapText._tintBL, alpha);
        var vTintBR = getTint(bitmapText._tintBR, alpha);
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
        var translateX = (srcX - cameraScrollX) + frame.x;
        var translateY = (srcY - cameraScrollY) + frame.y;
        var rotation = -bitmapText.rotation;
        var scaleX = bitmapText.scaleX;
        var scaleY = bitmapText.scaleY;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = -sr * scaleX;
        var src = sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var mva = sra * cma + srb * cmc;
        var mvb = sra * cmb + srb * cmd;
        var mvc = src * cma + srd * cmc;
        var mvd = src * cmb + srd * cmd;
        var mve = sre * cma + srf * cmc + cme;
        var mvf = sre * cmb + srf * cmd + cmf;
        var vertexOffset = 0;

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

            xAdvance += glyph.xAdvance;
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
            
            vertexOffset = this.vertexCount * this.vertexComponentCount;

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

            vertexViewF32[vertexOffset + 0] = tx0;
            vertexViewF32[vertexOffset + 1] = ty0;
            vertexViewF32[vertexOffset + 2] = umin;
            vertexViewF32[vertexOffset + 3] = vmin;
            vertexViewU32[vertexOffset + 4] = vTintTL;
            vertexViewF32[vertexOffset + 5] = tx1;
            vertexViewF32[vertexOffset + 6] = ty1;
            vertexViewF32[vertexOffset + 7] = umin;
            vertexViewF32[vertexOffset + 8] = vmax;
            vertexViewU32[vertexOffset + 9] = vTintBL;
            vertexViewF32[vertexOffset + 10] = tx2;
            vertexViewF32[vertexOffset + 11] = ty2;
            vertexViewF32[vertexOffset + 12] = umax;
            vertexViewF32[vertexOffset + 13] = vmax;
            vertexViewU32[vertexOffset + 14] = vTintBR;
            vertexViewF32[vertexOffset + 15] = tx0;
            vertexViewF32[vertexOffset + 16] = ty0;
            vertexViewF32[vertexOffset + 17] = umin;
            vertexViewF32[vertexOffset + 18] = vmin;
            vertexViewU32[vertexOffset + 19] = vTintTL;
            vertexViewF32[vertexOffset + 20] = tx2;
            vertexViewF32[vertexOffset + 21] = ty2;
            vertexViewF32[vertexOffset + 22] = umax;
            vertexViewF32[vertexOffset + 23] = vmax;
            vertexViewU32[vertexOffset + 24] = vTintBR;
            vertexViewF32[vertexOffset + 25] = tx3;
            vertexViewF32[vertexOffset + 26] = ty3;
            vertexViewF32[vertexOffset + 27] = umax;
            vertexViewF32[vertexOffset + 28] = vmin;
            vertexViewU32[vertexOffset + 29] = vTintTR;
        
            this.vertexCount += 6;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchDynamicBitmapText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.DynamicBitmapText} bitmapText - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchDynamicBitmapText: function (bitmapText, camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var roundPixels = this.renderer.config.roundPixels;
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
        var alpha = bitmapText.alpha;
        var vTintTL = getTint(bitmapText._tintTL, alpha);
        var vTintTR = getTint(bitmapText._tintTR, alpha);
        var vTintBL = getTint(bitmapText._tintBL, alpha);
        var vTintBR = getTint(bitmapText._tintBR, alpha);
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
        var rotation = -bitmapText.rotation;
        var scaleX = bitmapText.scaleX;
        var scaleY = bitmapText.scaleY;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = -sr * scaleX;
        var src = sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
        var mva = sra * cma + srb * cmc;
        var mvb = sra * cmb + srb * cmd;
        var mvc = src * cma + srd * cmc;
        var mvd = src * cmb + srd * cmd;
        var mve = sre * cma + srf * cmc + cme;
        var mvf = sre * cmb + srf * cmd + cmf;
        var crop = (bitmapText.cropWidth > 0 || bitmapText.cropHeight > 0);
        var uta, utb, utc, utd, ute, utf;
        var vertexOffset = 0;

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

            xAdvance += glyph.xAdvance;
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
            x -= cameraScrollX;
            y -= cameraScrollY;

            sr = Math.sin(-rotation);
            cr = Math.cos(-rotation);
            uta = cr * scale;
            utb = -sr * scale;
            utc = sr * scale;
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
            
            vertexOffset = this.vertexCount * this.vertexComponentCount;

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

            vertexViewF32[vertexOffset + 0] = tx0;
            vertexViewF32[vertexOffset + 1] = ty0;
            vertexViewF32[vertexOffset + 2] = umin;
            vertexViewF32[vertexOffset + 3] = vmin;
            vertexViewU32[vertexOffset + 4] = vTintTL;
            vertexViewF32[vertexOffset + 5] = tx1;
            vertexViewF32[vertexOffset + 6] = ty1;
            vertexViewF32[vertexOffset + 7] = umin;
            vertexViewF32[vertexOffset + 8] = vmax;
            vertexViewU32[vertexOffset + 9] = vTintBL;
            vertexViewF32[vertexOffset + 10] = tx2;
            vertexViewF32[vertexOffset + 11] = ty2;
            vertexViewF32[vertexOffset + 12] = umax;
            vertexViewF32[vertexOffset + 13] = vmax;
            vertexViewU32[vertexOffset + 14] = vTintBR;
            vertexViewF32[vertexOffset + 15] = tx0;
            vertexViewF32[vertexOffset + 16] = ty0;
            vertexViewF32[vertexOffset + 17] = umin;
            vertexViewF32[vertexOffset + 18] = vmin;
            vertexViewU32[vertexOffset + 19] = vTintTL;
            vertexViewF32[vertexOffset + 20] = tx2;
            vertexViewF32[vertexOffset + 21] = ty2;
            vertexViewF32[vertexOffset + 22] = umax;
            vertexViewF32[vertexOffset + 23] = vmax;
            vertexViewU32[vertexOffset + 24] = vTintBR;
            vertexViewF32[vertexOffset + 25] = tx3;
            vertexViewF32[vertexOffset + 26] = ty3;
            vertexViewF32[vertexOffset + 27] = umax;
            vertexViewF32[vertexOffset + 28] = vmin;
            vertexViewU32[vertexOffset + 29] = vTintTR;
        
            this.vertexCount += 6;
        }

        if (crop)
        {
            renderer.popScissor();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchText
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Text} text - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchText: function (text, camera)
    {
        var getTint = Utils.getTintAppendFloatAlpha;

        this.batchTexture(
            text,
            text.canvasTexture,
            text.canvasTexture.width, text.canvasTexture.height,
            text.x, text.y,
            text.canvasTexture.width, text.canvasTexture.height,
            text.scaleX, text.scaleY,
            text.rotation,
            text.flipX, text.flipY,
            text.scrollFactorX, text.scrollFactorY,
            text.displayOriginX, text.displayOriginY,
            0, 0, text.canvasTexture.width, text.canvasTexture.height,
            getTint(text._tintTL, text._alphaTL),
            getTint(text._tintTR, text._alphaTR),
            getTint(text._tintBL, text._alphaBL),
            getTint(text._tintBR, text._alphaBR),
            0, 0,
            camera
        );
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchDynamicTilemapLayer
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.DynamicTilemapLayer} tilemapLayer - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchDynamicTilemapLayer: function (tilemapLayer, camera)
    {
        var renderTiles = tilemapLayer.culledTiles;
        var length = renderTiles.length;
        var texture = tilemapLayer.tileset.image.get().source.glTexture;
        var tileset = tilemapLayer.tileset;
        var scrollFactorX = tilemapLayer.scrollFactorX;
        var scrollFactorY = tilemapLayer.scrollFactorY;
        var alpha = tilemapLayer.alpha;
        var x = tilemapLayer.x;
        var y = tilemapLayer.y;
        var sx = tilemapLayer.scaleX;
        var sy = tilemapLayer.scaleY;
        var getTint = Utils.getTintAppendFloatAlpha;

        for (var index = 0; index < length; ++index)
        {
            var tile = renderTiles[index];

            var tileTexCoords = tileset.getTileTextureCoordinates(tile.index);
            if (tileTexCoords === null) { continue; }

            var frameWidth = tile.width;
            var frameHeight = tile.height;
            var frameX = tileTexCoords.x;
            var frameY = tileTexCoords.y;
            var tint = getTint(tile.tint, alpha * tile.alpha);

            this.batchTexture(
                tilemapLayer,
                texture,
                texture.width, texture.height,
                (tile.width / 2) + x + tile.pixelX * sx, (tile.height / 2) + y + tile.pixelY * sy,
                tile.width * sx, tile.height * sy,
                1, 1,
                tile.rotation,
                tile.flipX, tile.flipY,
                scrollFactorX, scrollFactorY,
                (tile.width / 2), (tile.height / 2),
                frameX, frameY, frameWidth, frameHeight,
                tint, tint, tint, tint,
                0, 0,
                camera
            );
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchTileSprite
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.TileSprite} tileSprite - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchTileSprite: function (tileSprite, camera)
    {
        var getTint = Utils.getTintAppendFloatAlpha;

        this.batchTexture(
            tileSprite,
            tileSprite.tileTexture,
            tileSprite.frame.width, tileSprite.frame.height,
            tileSprite.x, tileSprite.y,
            tileSprite.width, tileSprite.height,
            tileSprite.scaleX, tileSprite.scaleY,
            tileSprite.rotation,
            tileSprite.flipX, tileSprite.flipY,
            tileSprite.scrollFactorX, tileSprite.scrollFactorY,
            tileSprite.originX * tileSprite.width, tileSprite.originY * tileSprite.height,
            0, 0, tileSprite.width, tileSprite.height,
            getTint(tileSprite._tintTL, tileSprite._alphaTL),
            getTint(tileSprite._tintTR, tileSprite._alphaTR),
            getTint(tileSprite._tintBL, tileSprite._alphaBL),
            getTint(tileSprite._tintBR, tileSprite._alphaBR),
            tileSprite.tilePositionX / tileSprite.frame.width,
            tileSprite.tilePositionY / tileSprite.frame.height,
            camera
        );
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchTexture
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     * @param {WebGLTexture} texture - [description]
     * @param {integer} textureWidth - [description]
     * @param {integer} textureHeight - [description]
     * @param {float} srcX - [description]
     * @param {float} srcY - [description]
     * @param {float} srcWidth - [description]
     * @param {float} srcHeight - [description]
     * @param {float} scaleX - [description]
     * @param {float} scaleY - [description]
     * @param {float} rotation - [description]
     * @param {boolean} flipX - [description]
     * @param {boolean} flipY - [description]
     * @param {float} scrollFactorX - [description]
     * @param {float} scrollFactorY - [description]
     * @param {float} displayOriginX - [description]
     * @param {float} displayOriginY - [description]
     * @param {float} frameX - [description]
     * @param {float} frameY - [description]
     * @param {float} frameWidth - [description]
     * @param {float} frameHeight - [description]
     * @param {integer} tintTL - [description]
     * @param {integer} tintTR - [description]
     * @param {integer} tintBL - [description]
     * @param {integer} tintBR - [description]
     * @param {float} uOffset - [description]
     * @param {float} vOffset - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
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
        tintTL, tintTR, tintBL, tintBR,
        uOffset, vOffset,
        camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        flipY = flipY ^ (texture.isRenderTexture ? 1 : 0);
        rotation = -rotation;

        var roundPixels = this.renderer.config.roundPixels;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var cameraMatrix = camera.matrix.matrix;
        var width = srcWidth * (flipX ? -1.0 : 1.0);
        var height = srcHeight * (flipY ? -1.0 : 1.0);
        var x = -displayOriginX + ((srcWidth) * (flipX ? 1.0 : 0.0));
        var y = -displayOriginY + ((srcHeight) * (flipY ? 1.0 : 0.0));
        var xw = x + width;
        var yh = y + height;
        var translateX = srcX - camera.scrollX * scrollFactorX;
        var translateY = srcY - camera.scrollY * scrollFactorY;
        var sr = Math.sin(rotation);
        var cr = Math.cos(rotation);
        var sra = cr * scaleX;
        var srb = -sr * scaleX;
        var src = sr * scaleY;
        var srd = cr * scaleY;
        var sre = translateX;
        var srf = translateY;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];
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
        var vertexOffset = 0;
        var u0 = (frameX / textureWidth) + uOffset;
        var v0 = (frameY / textureHeight) + vOffset;
        var u1 = (frameX + frameWidth) / textureWidth + uOffset;
        var v1 = (frameY + frameHeight) / textureHeight + vOffset;
        
        this.setTexture2D(texture, 0);

        vertexOffset = this.vertexCount * this.vertexComponentCount;

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

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewF32[vertexOffset + 2] = u0;
        vertexViewF32[vertexOffset + 3] = v0;
        vertexViewU32[vertexOffset + 4] = tintTL;
        vertexViewF32[vertexOffset + 5] = tx1;
        vertexViewF32[vertexOffset + 6] = ty1;
        vertexViewF32[vertexOffset + 7] = u0;
        vertexViewF32[vertexOffset + 8] = v1;
        vertexViewU32[vertexOffset + 9] = tintTR;
        vertexViewF32[vertexOffset + 10] = tx2;
        vertexViewF32[vertexOffset + 11] = ty2;
        vertexViewF32[vertexOffset + 12] = u1;
        vertexViewF32[vertexOffset + 13] = v1;
        vertexViewU32[vertexOffset + 14] = tintBL;
        vertexViewF32[vertexOffset + 15] = tx0;
        vertexViewF32[vertexOffset + 16] = ty0;
        vertexViewF32[vertexOffset + 17] = u0;
        vertexViewF32[vertexOffset + 18] = v0;
        vertexViewU32[vertexOffset + 19] = tintTL;
        vertexViewF32[vertexOffset + 20] = tx2;
        vertexViewF32[vertexOffset + 21] = ty2;
        vertexViewF32[vertexOffset + 22] = u1;
        vertexViewF32[vertexOffset + 23] = v1;
        vertexViewU32[vertexOffset + 24] = tintBL;
        vertexViewF32[vertexOffset + 25] = tx3;
        vertexViewF32[vertexOffset + 26] = ty3;
        vertexViewF32[vertexOffset + 27] = u1;
        vertexViewF32[vertexOffset + 28] = v0;
        vertexViewU32[vertexOffset + 29] = tintBR;

        this.vertexCount += 6;
    },

    /**
     * Immediately draws a texture with no batching.
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#drawTexture
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
     *
     * @return {Phaser.Renderer.WebGL.TextureTintPipeline} This Pipeline.
     */
    drawTexture: function (
        texture,
        srcX, srcY,
        tint, alpha,
        frameX, frameY, frameWidth, frameHeight,
        transformMatrix
    )
    {
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
        var tx0 = x * mva + y * mvc + mve;
        var ty0 = x * mvb + y * mvd + mvf;
        var tx1 = x * mva + yh * mvc + mve;
        var ty1 = x * mvb + yh * mvd + mvf;
        var tx2 = xw * mva + yh * mvc + mve;
        var ty2 = xw * mvb + yh * mvd + mvf;
        var tx3 = xw * mva + y * mvc + mve;
        var ty3 = xw * mvb + y * mvd + mvf;
        var vertexOffset = 0;
        var textureWidth = texture.width;
        var textureHeight = texture.height;
        var u0 = (frameX / textureWidth);
        var v0 = (frameY / textureHeight);
        var u1 = (frameX + frameWidth) / textureWidth;
        var v1 = (frameY + frameHeight) / textureHeight;
        tint = Utils.getTintAppendFloatAlpha(tint, alpha);
        
        this.setTexture2D(texture, 0);

        vertexOffset = this.vertexCount * this.vertexComponentCount;

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

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewF32[vertexOffset + 2] = u0;
        vertexViewF32[vertexOffset + 3] = v0;
        vertexViewU32[vertexOffset + 4] = tint;
        vertexViewF32[vertexOffset + 5] = tx1;
        vertexViewF32[vertexOffset + 6] = ty1;
        vertexViewF32[vertexOffset + 7] = u0;
        vertexViewF32[vertexOffset + 8] = v1;
        vertexViewU32[vertexOffset + 9] = tint;
        vertexViewF32[vertexOffset + 10] = tx2;
        vertexViewF32[vertexOffset + 11] = ty2;
        vertexViewF32[vertexOffset + 12] = u1;
        vertexViewF32[vertexOffset + 13] = v1;
        vertexViewU32[vertexOffset + 14] = tint;
        vertexViewF32[vertexOffset + 15] = tx0;
        vertexViewF32[vertexOffset + 16] = ty0;
        vertexViewF32[vertexOffset + 17] = u0;
        vertexViewF32[vertexOffset + 18] = v0;
        vertexViewU32[vertexOffset + 19] = tint;
        vertexViewF32[vertexOffset + 20] = tx2;
        vertexViewF32[vertexOffset + 21] = ty2;
        vertexViewF32[vertexOffset + 22] = u1;
        vertexViewF32[vertexOffset + 23] = v1;
        vertexViewU32[vertexOffset + 24] = tint;
        vertexViewF32[vertexOffset + 25] = tx3;
        vertexViewF32[vertexOffset + 26] = ty3;
        vertexViewF32[vertexOffset + 27] = u1;
        vertexViewF32[vertexOffset + 28] = v0;
        vertexViewU32[vertexOffset + 29] = tint;

        this.vertexCount += 6;

        // Force an immediate draw
        this.flush();
    },

    /**
     * [description]
     *
     * @method Phaser.Renderer.WebGL.TextureTintPipeline#batchGraphics
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
     */
    batchGraphics: function ()
    {
        // Stub
    }

});

module.exports = TextureTintPipeline;
