var Class = require('../../../utils/Class');
var WebGLPipeline = require('../WebGLPipeline');
var Utils = require('../Utils');
var ShaderSourceVS = require('../shaders/TextureTint.vert'); 
var ShaderSourceFS = require('../shaders/TextureTint.frag'); 

var TextureTintPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function TextureTintPipeline(game, gl, renderer)
    {
        WebGLPipeline.call(this, {
            name: 'TextureTintPipeline',
            game: game,
            gl: gl,
            renderer: renderer,
            topology: gl.TRIANGLES,
            vertShader: ShaderSourceVS,
            fragShader: ShaderSourceFS,
            vertexCapacity: 12000,

            vertexSize: 
                Float32Array.BYTES_PER_ELEMENT * 2 + 
                Float32Array.BYTES_PER_ELEMENT * 2 + 
                Uint8Array.BYTES_PER_ELEMENT * 4,

            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false,
                    offset: 0
                },
                {
                    name: 'inTexCoord',
                    size: 2,
                    type: gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 4
                }
            ]
        });

        this.orthoViewMatrix = new Float32Array([
            +2.0 / this.width,
            +0.0,   
            +0.0,
            +0.0,
            
            +0.0,
            -2.0 / this.height,
            +0.0,
            +0.0,

            +0.0,
            +0.0,
            +1.0,
            +1.0,

            -1.0,
            +1.0,
            +0.0,
            +0.0
        ]);

        this.vertexViewF32 = new Float32Array(this.vertexData);
        this.vertexViewU32 = new Uint32Array(this.vertexData);
    },

    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);

        var orthoViewMatrix = this.orthoViewMatrix;
        orthoViewMatrix[0] = +2.0 / this.width;
        orthoViewMatrix[5] = -2.0 / this.height;

        this.renderer.setMatrix4(this.currentProgram, 'uOrthoMatrix', false, orthoViewMatrix);

        return this;
    },

    drawBlitter: function (blitter, camera)
    {
        this.renderer.setPipeline(this);

        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var list = blitter.getRenderList();
        var length = list.length;
        var cameraMatrix = camera.matrix.matrix;
        var cameraWidth = camera.width + 50;
        var cameraHeight = camera.height + 50;
        var cameraX = -50;
        var cameraY = -50;
        var a = cameraMatrix[0];
        var b = cameraMatrix[1];
        var c = cameraMatrix[2];
        var d = cameraMatrix[3];
        var e = cameraMatrix[4];
        var f = cameraMatrix[5];
        var cameraScrollX = camera.scrollX * blitter.scrollFactorX;
        var cameraScrollY = camera.scrollY * blitter.scrollFactorY;
        var batchCount = Math.ceil(length / 2000);
        var batchOffset = 0;
        var blitterX = blitter.x;
        var blitterY = blitter.y;

        for (var batchIndex = 0; batchIndex < batchCount; ++batchIndex)
        {
            var batchSize = Math.min(length, 2000);
            var vertexOffset = 0;
            var vertexCount = 0;

            for (var index = 0; index < batchSize; ++index)
            {
                var bob = list[batchOffset + index];
                var frame = bob.frame;
                var alpha = bob.alpha;
                var tint =  getTint(0xffffff, bob.alpha);
                var uvs = frame.uvs;
                var flipX = bob.flipX;
                var flipY = bob.flipY;
                var width = frame.width * (flipX ? -1.0 : 1.0); 
                var height = frame.height * (flipY ? -1.0 : 1.0);
                var x = blitterX + bob.x + frame.x - cameraScrollX + (width * ((flipX) ? 1.0 : 0.0));
                var y = blitterY + bob.y + frame.y - cameraScrollY + (height * ((flipY) ? 1.0 : 0.0));
                var xw = x + width;                
                var yh = y + height;
                var tx0 = x * a + y * c + e;
                var ty0 = x * b + y * d + f;
                var tx1 = xw * a + yh * c + e;
                var ty1 = xw * b + yh * d + f;

                if ((tx0 < cameraX || tx0 > cameraWidth || ty0 < cameraX || ty0 > cameraHeight) &&
                    (tx1 < cameraY || tx1 > cameraWidth || ty1 < cameraY || ty1 > cameraHeight))
                {
                    continue;
                }

                // Bind Texture if texture wasn't bound.
                // This needs to be here because of multiple
                // texture atlas.
                renderer.setTexture2D(frame.texture.source[frame.sourceIndex].glTexture, 0);
            
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

                vertexOffset += 30;
                vertexCount += 6;
            }

            batchOffset += batchSize;
            length -= batchSize;

            if (vertexCount <= this.vertexCapacity)
            {
                this.vertexCount = vertexCount;
                this.flush();
            }
        }
    },

    batchTexture: function (
        texture,
        dstX, dstY,
        scaleX, scaleY,
        rotation,
        flipX, flipY,
        scrollFactorX, scrollFactorY,
        displayOriginX, displayOriginY,
        frameX, frameY, frameWidth, frameHeight,
        tintTL, tintTR, tintBL, tintBR,
        camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        flipY = flipY ^ (texture.isRenderTexture ? 1 : 0);
        rotation = -rotation;

        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var cameraMatrix = camera.matrix.matrix;
        var cameraWidth = camera.width + 50;
        var cameraHeight = camera.height + 50;
        var cameraX = -50;
        var cameraY = -50;
        var width = frameWidth * (flipX ? -1.0 : 1.0);
        var height = frameHeight * (flipY ? -1.0 : 1.0);
        var x = -displayOriginX + frameX + ((frameWidth) * (flipX ? 1.0 : 0.0));
        var y = -displayOriginY + frameY + ((frameHeight) * (flipY ? 1.0 : 0.0));
        var xw = x + width;
        var yh = y + height;
        var translateX = dstX - camera.scrollX * scrollFactorX;
        var translateY = dstY - camera.scrollY * scrollFactorY;
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

        if ((tx0 < cameraX || tx0 > cameraWidth || ty0 < cameraY || ty0 > cameraHeight) &&
            (tx1 < cameraX || tx1 > cameraWidth || ty1 < cameraY || ty1 > cameraHeight) &&
            (tx2 < cameraX || tx2 > cameraWidth || ty2 < cameraY || ty2 > cameraHeight) &&
            (tx3 < cameraX || tx3 > cameraWidth || ty3 < cameraY || ty3 > cameraHeight))
        {
            return;
        }

        var u0 = frameX / texture.width;
        var v0 = frameY / texture.height;
        var u1 = frameX / texture.width;
        var v1 = (frameY + frameHeight) / texture.height;
        var u2 = (frameX + frameWidth) / texture.width;
        var v2 = (frameY + frameHeight) / texture.height;
        var u3 = (frameX + frameWidth) / texture.width;
        var v3 = frameY / texture.height;

        renderer.setTexture2D(texture, 0);

        vertexOffset = this.vertexCount * this.vertexComponentCount;

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewF32[vertexOffset + 2] = u0;
        vertexViewF32[vertexOffset + 3] = v0;
        vertexViewU32[vertexOffset + 4] = tintTL;
        vertexViewF32[vertexOffset + 5] = tx1;
        vertexViewF32[vertexOffset + 6] = ty1;
        vertexViewF32[vertexOffset + 7] = u1;
        vertexViewF32[vertexOffset + 8] = v1;
        vertexViewU32[vertexOffset + 9] = tintTR;
        vertexViewF32[vertexOffset + 10] = tx2;
        vertexViewF32[vertexOffset + 11] = ty2;
        vertexViewF32[vertexOffset + 12] = u2;
        vertexViewF32[vertexOffset + 13] = v2;
        vertexViewU32[vertexOffset + 14] = tintBL;
        vertexViewF32[vertexOffset + 15] = tx0;
        vertexViewF32[vertexOffset + 16] = ty0;
        vertexViewF32[vertexOffset + 17] = u0;
        vertexViewF32[vertexOffset + 18] = v0;
        vertexViewU32[vertexOffset + 19] = tintTL;
        vertexViewF32[vertexOffset + 20] = tx2;
        vertexViewF32[vertexOffset + 21] = ty2;
        vertexViewF32[vertexOffset + 22] = u2;
        vertexViewF32[vertexOffset + 23] = v2;
        vertexViewU32[vertexOffset + 24] = tintBL;
        vertexViewF32[vertexOffset + 25] = tx3;
        vertexViewF32[vertexOffset + 26] = ty3;
        vertexViewF32[vertexOffset + 27] = u3;
        vertexViewF32[vertexOffset + 28] = v3;
        vertexViewU32[vertexOffset + 29] = tintBR;

        this.vertexCount += 6;
    },

    batchSprite: function (sprite, camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var cameraMatrix = camera.matrix.matrix;
        var cameraWidth = camera.width + 50;
        var cameraHeight = camera.height + 50;
        var cameraX = -50;
        var cameraY = -50;
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
        var xw = x + width;
        var yh = y + height;
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
        var tint0 = getTint(tintTL, alphaTL);
        var tint1 = getTint(tintTR, alphaTR);
        var tint2 = getTint(tintBL, alphaBL);
        var tint3 = getTint(tintBR, alphaBR);
        var vertexOffset = 0;

        if ((tx0 < cameraX || tx0 > cameraWidth || ty0 < cameraY || ty0 > cameraHeight) &&
            (tx1 < cameraX || tx1 > cameraWidth || ty1 < cameraY || ty1 > cameraHeight) &&
            (tx2 < cameraX || tx2 > cameraWidth || ty2 < cameraY || ty2 > cameraHeight) &&
            (tx3 < cameraX || tx3 > cameraWidth || ty3 < cameraY || ty3 > cameraHeight))
        {
            return;
        }

        renderer.setTexture2D(texture, 0);

        vertexOffset = this.vertexCount * this.vertexComponentCount;

        vertexViewF32[vertexOffset + 0] = tx0;
        vertexViewF32[vertexOffset + 1] = ty0;
        vertexViewF32[vertexOffset + 2] = uvs.x0;
        vertexViewF32[vertexOffset + 3] = uvs.y0;
        vertexViewU32[vertexOffset + 4] = tint0;
        vertexViewF32[vertexOffset + 5] = tx1;
        vertexViewF32[vertexOffset + 6] = ty1;
        vertexViewF32[vertexOffset + 7] = uvs.x1;
        vertexViewF32[vertexOffset + 8] = uvs.y1;
        vertexViewU32[vertexOffset + 9] = tint1;
        vertexViewF32[vertexOffset + 10] = tx2;
        vertexViewF32[vertexOffset + 11] = ty2;
        vertexViewF32[vertexOffset + 12] = uvs.x2;
        vertexViewF32[vertexOffset + 13] = uvs.y2;
        vertexViewU32[vertexOffset + 14] = tint2;
        vertexViewF32[vertexOffset + 15] = tx0;
        vertexViewF32[vertexOffset + 16] = ty0;
        vertexViewF32[vertexOffset + 17] = uvs.x0;
        vertexViewF32[vertexOffset + 18] = uvs.y0;
        vertexViewU32[vertexOffset + 19] = tint0;
        vertexViewF32[vertexOffset + 20] = tx2;
        vertexViewF32[vertexOffset + 21] = ty2;
        vertexViewF32[vertexOffset + 22] = uvs.x2;
        vertexViewF32[vertexOffset + 23] = uvs.y2;
        vertexViewU32[vertexOffset + 24] = tint2;
        vertexViewF32[vertexOffset + 25] = tx3;
        vertexViewF32[vertexOffset + 26] = ty3;
        vertexViewF32[vertexOffset + 27] = uvs.x3;
        vertexViewF32[vertexOffset + 28] = uvs.y3;
        vertexViewU32[vertexOffset + 29] = tint3;

        this.vertexCount += 6;
    },

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

        var getTint = Utils.getTintAppendFloatAlpha;
        var uvs = mesh.uv;
        var colors = mesh.colors;
        var alphas = mesh.alphas;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var cameraMatrix = camera.matrix.matrix;
        var a = cameraMatrix[0];
        var b = cameraMatrix[1];
        var c = cameraMatrix[2];
        var d = cameraMatrix[3];
        var e = cameraMatrix[4];
        var f = cameraMatrix[5];
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

        renderer.setTexture2D(texture, 0);
        vertexOffset = this.vertexCount * this.vertexComponentCount;

        for (var index = 0, index0 = 0; index < length; index += 2)
        {
            var x = vertices[index + 0];
            var y = vertices[index + 1];
            var tx = x * mva + y * mvc + mve;
            var ty = x * mvb + y * mvd + mvf;

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

    batchBitmapText: function (bitmapText, camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var text = bitmapText.text;
        var textLength = text.length;
        var getTint = Utils.getTintAppendFloatAlpha;
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
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
        var tint0 = getTint(bitmapText._tintTL, alpha);
        var tint1 = getTint(bitmapText._tintTR, alpha);
        var tint2 = getTint(bitmapText._tintBL, alpha);
        var tint3 = getTint(bitmapText._tintBR, alpha);
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

        renderer.setTexture2D(texture, 0);

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

            vertexViewF32[vertexOffset + 0] = tx0;
            vertexViewF32[vertexOffset + 1] = ty0;
            vertexViewF32[vertexOffset + 2] = umin;
            vertexViewF32[vertexOffset + 3] = vmin;
            vertexViewU32[vertexOffset + 4] = tint0;
            vertexViewF32[vertexOffset + 5] = tx1;
            vertexViewF32[vertexOffset + 6] = ty1;
            vertexViewF32[vertexOffset + 7] = umin;
            vertexViewF32[vertexOffset + 8] = vmax;
            vertexViewU32[vertexOffset + 9] = tint1;
            vertexViewF32[vertexOffset + 10] = tx2;
            vertexViewF32[vertexOffset + 11] = ty2;
            vertexViewF32[vertexOffset + 12] = umax;
            vertexViewF32[vertexOffset + 13] = vmax;
            vertexViewU32[vertexOffset + 14] = tint2;
            vertexViewF32[vertexOffset + 15] = tx0;
            vertexViewF32[vertexOffset + 16] = ty0;
            vertexViewF32[vertexOffset + 17] = umin;
            vertexViewF32[vertexOffset + 18] = vmin;
            vertexViewU32[vertexOffset + 19] = tint0;
            vertexViewF32[vertexOffset + 20] = tx2;
            vertexViewF32[vertexOffset + 21] = ty2;
            vertexViewF32[vertexOffset + 22] = umax;
            vertexViewF32[vertexOffset + 23] = vmax;
            vertexViewU32[vertexOffset + 24] = tint2;
            vertexViewF32[vertexOffset + 25] = tx3;
            vertexViewF32[vertexOffset + 26] = ty3;
            vertexViewF32[vertexOffset + 27] = umax;
            vertexViewF32[vertexOffset + 28] = vmin;
            vertexViewU32[vertexOffset + 29] = tint3;
        
            this.vertexCount += 6;
        }
    }
});

module.exports = TextureTintPipeline;
