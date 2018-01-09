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
    },

    drawBlitter: function (blitter, camera)
    {
        this.beginDraw(blitter.shader, blitter.renderTarget);
        
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
                var tint =  Utils.getTintFromFloats(1, 1, 1, bob.alpha);
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
