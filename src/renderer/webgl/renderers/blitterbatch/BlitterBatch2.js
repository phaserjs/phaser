var Class = require('../../../../utils/Class');
var ShaderSource = require('../../shaders/TextureTintShader');
var Pipeline = require('../../Pipeline');
var Utils = require('../../Utils');

var BlitterBatch = new Class({

    Extends: Pipeline,

    initialize:

    function BlitterBatch(game, gl, manager)
    {
        Pipeline.call(this, game, {
            name: 'BlitterBatch',
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
                }
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

    drawBlitter: function (blitter, camera)
    {
        this.beginDraw(blitter.shader, blitter.renderTarget);
        
        var vertexViewF32 = this.vertexViewF32;
        var vertexViewU32 = this.vertexViewU32;
        var manager = this.manager;
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
                var x = bob.x + frame.x - cameraScrollX + (width * (flipX ? 1.0 : 0.0));
                var y = bob.y + frame.y - cameraScrollY + (height * (flipY ? 1.0 : 0.0));
                var width = frame.width * (flipX ? -1.0 : 1.0); 
                var height = frame.height * (flipY ? -1.0 : 1.0);
                var xw = x + width;                
                var yh = y + height;
                var tx = x * a + y * c + e;
                var ty = x * b + y * d + f;
                var txw = xw * a + yh * c + e;
                var tyh = xw * b + yh * d + f;

                // Bind Texture if texture wasn't bound.
                // This needs to be here because of multiple
                // texture atlas.

                // manager.setTexture(frame.texture.source[frame.sourceIndex].glTexture, 0);
            
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
            this.draw();
        }

        this.endDraw();
    }

});

module.exports = BlitterBatch;
