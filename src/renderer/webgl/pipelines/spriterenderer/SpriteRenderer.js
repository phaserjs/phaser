var Class = require('../../../../utils/Class');
var ShaderSource = require('../../shaders/TextureTintShader');
var Pipeline = require('../../Pipeline');
var Utils = require('../../Utils');

var SpriteRenderer = new Class({

    Extends: Pipeline,

    initialize:

    function SpriteRenderer(game, gl, manager)
    {
        Pipeline.call(this, {
            name: 'SpriteRenderer',
            game: game,
            gl: gl,
            manager: manager,
            topology: gl.TRIANGLES,
            shader: ShaderSource,
            vertexCapacity: 12000,

            vertexSize: 
                Float32Array.BYTES_PER_ELEMENT * 2 + 
                Float32Array.BYTES_PER_ELEMENT * 2 + 
                Uint8Array.BYTES_PER_ELEMENT * 4,

            vertexLayout: {
                'inPosition': {
                    size: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    offset: 0
                },
                'inTexCoord': {
                    size: 2,
                    type: gl.FLOAT,
                    normalize: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
                },
                'inTint': {
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalize: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 4
                }
            }
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

    drawRawSprite: function (
        shader,
        renderTarget,
        frameTexture,
        textureSourceIndex,
        flipX,
        flipY,
        frameX,
        frameY,
        frameWidth,
        frameHeight,
        displayOriginX,
        displayOriginY,
        scrollFactorX,
        scrollFactorY,
        translateX,
        translateY,
        scaleX,
        scaleY,
        rotation,
        tint,
        alpha,
        camera
    )
    {
        this.manager.setPipeline(this);
        this.beginPass(shader, renderTarget);

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var orthoViewMatrix = this.orthoViewMatrix;
        var manager = this.manager;
        var gl = this.gl;
        var shader = this.currentProgram;
        var cameraMatrix = camera.matrix.matrix;
        var a = cameraMatrix[0];
        var b = cameraMatrix[1];
        var c = cameraMatrix[2];
        var d = cameraMatrix[3];
        var e = cameraMatrix[4];
        var f = cameraMatrix[5];
        var textureSource = frameTexture.source[textureSourceIndex];
        var textureWidth = textureSource.width;
        var textureHeight = textureSource.height;
        var texture = textureSource.glTexture;
        var forceFlipY = (texture.isRenderTexture ? true : false);
        var flipX = flipX;
        var flipY = flipY ^ forceFlipY;
        var width = frameWidth * (flipX ? -1.0 : 1.0);
        var height = frameHeight * (flipY ? -1.0 : 1.0);
        var x = -displayOriginX + ((frameWidth) * (flipX ? 1.0 : 0.0));
        var y = -displayOriginY + ((frameHeight) * (flipY ? 1.0 : 0.0));
        var xw = x + width;
        var yh = y + height;
        var translateX = translateX - camera.scrollX * scrollFactorX;
        var translateY = translateY - camera.scrollY * scrollFactorY;
        var scaleX = scaleX;
        var scaleY = scaleY;
        var rotation = -rotation;
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
        var spriteTint = Utils.getTintAppendFloatAlpha(tint, alpha);
        var u0 = (frameX + 0.5) / textureWidth;
        var v0 = (frameY + 0.5) / textureHeight;
        var u1 = (frameX - 0.5 + frameWidth) / textureWidth;
        var v1 = (frameY - 0.5 + frameHeight) / textureHeight;

        orthoViewMatrix[0] = +2.0 / this.width;
        orthoViewMatrix[5] = -2.0 / this.height;

        shader.setConstantMatrix4x4(shader.getUniformLocation('uOrthoMatrix'), orthoViewMatrix);
        manager.setTexture(texture, 0);

        vertexViewF32[0] = tx0;
        vertexViewF32[1] = ty0;
        vertexViewF32[2] = u0;
        vertexViewF32[3] = v0;
        vertexViewU32[4] = spriteTint;

        vertexViewF32[5] = tx1;
        vertexViewF32[6] = ty1;
        vertexViewF32[7] = u0;
        vertexViewF32[8] = v1;
        vertexViewU32[9] = spriteTint;

        vertexViewF32[10] = tx2;
        vertexViewF32[11] = ty2;
        vertexViewF32[12] = u1;
        vertexViewF32[13] = v1;
        vertexViewU32[14] = spriteTint;

        vertexViewF32[15] = tx0;
        vertexViewF32[16] = ty0;
        vertexViewF32[17] = u0;
        vertexViewF32[18] = v0;
        vertexViewU32[19] = spriteTint;

        vertexViewF32[20] = tx2;
        vertexViewF32[21] = ty2;
        vertexViewF32[22] = u1;
        vertexViewF32[23] = v1;
        vertexViewU32[24] = spriteTint;

        vertexViewF32[25] = tx3;
        vertexViewF32[26] = ty3;
        vertexViewF32[27] = u1;
        vertexViewF32[28] = v0;
        vertexViewU32[29] = spriteTint;

        this.vertexCount = 6;

        this.flush();
        this.endPass();
    },

    drawSprite: function (sprite, camera)
    {
        this.manager.setPipeline(this);
        this.beginPass(sprite.shader, sprite.renderTarget);

        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var orthoViewMatrix = this.orthoViewMatrix;
        var manager = this.manager;
        var gl = this.gl;
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

        orthoViewMatrix[0] = +2.0 / this.width;
        orthoViewMatrix[5] = -2.0 / this.height;

        shader.setConstantMatrix4x4(shader.getUniformLocation('uOrthoMatrix'), orthoViewMatrix);
        manager.setTexture(texture, 0);

        vertexViewF32[0] = tx0;
        vertexViewF32[1] = ty0;
        vertexViewF32[2] = uvs.x0;
        vertexViewF32[3] = uvs.y0;
        vertexViewU32[4] = getTint(tintTL, alphaTL);

        vertexViewF32[5] = tx1;
        vertexViewF32[6] = ty1;
        vertexViewF32[7] = uvs.x1;
        vertexViewF32[8] = uvs.y1;
        vertexViewU32[9] = getTint(tintBL, alphaBL);

        vertexViewF32[10] = tx2;
        vertexViewF32[11] = ty2;
        vertexViewF32[12] = uvs.x2;
        vertexViewF32[13] = uvs.y2;
        vertexViewU32[14] = getTint(tintBR, alphaBR);

        vertexViewF32[15] = tx0;
        vertexViewF32[16] = ty0;
        vertexViewF32[17] = uvs.x0;
        vertexViewF32[18] = uvs.y0;
        vertexViewU32[19] = getTint(tintTL, alphaTL);

        vertexViewF32[20] = tx2;
        vertexViewF32[21] = ty2;
        vertexViewF32[22] = uvs.x2;
        vertexViewF32[23] = uvs.y2;
        vertexViewU32[24] = getTint(tintBR, alphaBR);

        vertexViewF32[25] = tx3;
        vertexViewF32[26] = ty3;
        vertexViewF32[27] = uvs.x3;
        vertexViewF32[28] = uvs.y3;
        vertexViewU32[29] = getTint(tintTR, alphaTR);

        this.vertexCount = 6;

        this.flush();
        this.endPass();
    }

});

module.exports = SpriteRenderer;
