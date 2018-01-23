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

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var renderer = this.renderer;
        var gl = this.gl;
        var shader = this.currentProgram;
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
        var batchCount = Math.ceil(length / 2000);
        var batchOffset = 0;
        var blitterX = blitter.x;
        var blitterY = blitter.y;

        for (var batchIndex = 0; batchIndex < batchCount; ++batchIndex)
        {
            var batchSize = Math.min(length, 2000);
            var vertexOffset = 0;

            for (var index = 0; index < batchSize; ++index)
            {
                var bob = list[batchOffset + index];
                var frame = bob.frame;
                var alpha = bob.alpha;
                var tint =  Utils.getTintAppendFloatAlpha(0xffffff, bob.alpha);
                var uvs = frame.uvs;
                var flipX = bob.flipX;
                var flipY = bob.flipY;
                var width = frame.width * (flipX ? -1.0 : 1.0); 
                var height = frame.height * (flipY ? -1.0 : 1.0);
                var x = blitterX + bob.x + frame.x - cameraScrollX + (width * ((flipX) ? 1.0 : 0.0));
                var y = blitterY + bob.y + frame.y - cameraScrollY + (height * ((flipY) ? 1.0 : 0.0));
                var xw = x + width;                
                var yh = y + height;
                var tx = x * a + y * c + e;
                var ty = x * b + y * d + f;
                var txw = xw * a + yh * c + e;
                var tyh = xw * b + yh * d + f;

                // Bind Texture if texture wasn't bound.
                // This needs to be here because of multiple
                // texture atlas.
                renderer.setTexture2D(frame.texture.source[frame.sourceIndex].glTexture, 0);
            
                vertexViewF32[vertexOffset + 0] = tx;
                vertexViewF32[vertexOffset + 1] = ty;
                vertexViewF32[vertexOffset + 2] = uvs.x0;
                vertexViewF32[vertexOffset + 3] = uvs.y0;
                vertexViewU32[vertexOffset + 4] = tint;

                vertexViewF32[vertexOffset + 5] = tx;
                vertexViewF32[vertexOffset + 6] = tyh;
                vertexViewF32[vertexOffset + 7] = uvs.x1;
                vertexViewF32[vertexOffset + 8] = uvs.y1;
                vertexViewU32[vertexOffset + 9] = tint;

                vertexViewF32[vertexOffset + 10] = txw;
                vertexViewF32[vertexOffset + 11] = tyh;
                vertexViewF32[vertexOffset + 12] = uvs.x2;
                vertexViewF32[vertexOffset + 13] = uvs.y2;
                vertexViewU32[vertexOffset + 14] = tint;

                vertexViewF32[vertexOffset + 15] = tx;
                vertexViewF32[vertexOffset + 16] = ty;
                vertexViewF32[vertexOffset + 17] = uvs.x0;
                vertexViewF32[vertexOffset + 18] = uvs.y0;
                vertexViewU32[vertexOffset + 19] = tint;

                vertexViewF32[vertexOffset + 20] = txw;
                vertexViewF32[vertexOffset + 21] = tyh;
                vertexViewF32[vertexOffset + 22] = uvs.x2;
                vertexViewF32[vertexOffset + 23] = uvs.y2;
                vertexViewU32[vertexOffset + 24] = tint;

                vertexViewF32[vertexOffset + 25] = txw;
                vertexViewF32[vertexOffset + 26] = ty;
                vertexViewF32[vertexOffset + 27] = uvs.x3;
                vertexViewF32[vertexOffset + 28] = uvs.y3;
                vertexViewU32[vertexOffset + 29] = tint;

                vertexOffset += 30;
            }

            batchOffset += batchSize;
            length -= batchSize;

            this.vertexCount = (batchSize * 6);
            this.flush();
        }
    },

    batchSprite: function (sprite, camera)
    {
        this.renderer.setPipeline(this);

        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var shader = this.currentProgram;
        var cameraMatrix = camera.matrix.matrix;
        var a = cameraMatrix[0];
        var b = cameraMatrix[1];
        var c = cameraMatrix[2];
        var d = cameraMatrix[3];
        var e = cameraMatrix[4];
        var f = cameraMatrix[5];
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
        var getTint = Utils.getTintAppendFloatAlpha;
        var tint0 = getTint(tintTL, alphaTL);
        var tint1 = getTint(tintTR, alphaTR);
        var tint2 = getTint(tintBL, alphaBL);
        var tint3 = getTint(tintBR, alphaBR);
    
        renderer.setTexture2D(frame.texture.source[frame.sourceIndex].glTexture, 0);

        vertexViewF32[0] = tx0;
        vertexViewF32[1] = ty0;
        vertexViewF32[2] = uvs.x0;
        vertexViewF32[3] = uvs.y0;
        vertexViewU32[4] = tint0;
        vertexViewF32[5] = tx1;
        vertexViewF32[6] = ty1;
        vertexViewF32[7] = uvs.x1;
        vertexViewF32[8] = uvs.y1;
        vertexViewU32[9] = tint1;
        vertexViewF32[10] = tx2;
        vertexViewF32[11] = ty2;
        vertexViewF32[12] = uvs.x2;
        vertexViewF32[13] = uvs.y2;
        vertexViewU32[14] = tint2;
        vertexViewF32[15] = tx0;
        vertexViewF32[16] = ty0;
        vertexViewF32[17] = uvs.x0;
        vertexViewF32[18] = uvs.y0;
        vertexViewU32[19] = tint0;
        vertexViewF32[20] = tx2;
        vertexViewF32[21] = ty2;
        vertexViewF32[22] = uvs.x2;
        vertexViewF32[23] = uvs.y2;
        vertexViewU32[24] = tint2;
        vertexViewF32[25] = tx3;
        vertexViewF32[26] = ty3;
        vertexViewF32[27] = uvs.x3;
        vertexViewF32[28] = uvs.y3;
        vertexViewU32[29] = tint3;

        this.vertexCount += 6;

    }
});

module.exports = TextureTintPipeline;
