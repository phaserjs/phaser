var Class = require('../../../utils/Class');
var WebGLPipeline = require('../WebGLPipeline');
var Utils = require('../Utils');
var Earcut = require('../../../geom/polygon/Earcut');
var ShaderSource = require('../shaders/FlatTintShader');

var FlatTintPipeline = new Class({

    Extends: WebGLPipeline,

    initialize:

    function FlatTintPipeline(game, gl, renderer)
    {
        WebGLPipeline.call(this, {
            name: 'FlatTintPipeline',
            game: game,
            gl: gl,
            renderer: renderer,
            topology: gl.TRIANGLES,
            vertShader: ShaderSource.vert,
            fragShader: ShaderSource.frag,
            vertexCapacity: 12000,

            vertexSize: 
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
                    name: 'inTint',
                    size: 4,
                    type: gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
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
        this.tempTriangle = [
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
            {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0}
        ];
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

    batchFillRect: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, x, y, width, height, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        if (this.vertexCount + 6 > this.vertexCapacity)
        {
            this.flush();
        }

        var vertexBufferF32 = this.vertexViewF32;
        var vertexBufferU32 = this.vertexViewU32;
        var vertexOffset = this.vertexCount * this.vertexComponentCount;
        var xw = x + width;
        var yh = y + height;
        var a0 = currentMatrix.matrix[0];
        var b0 = currentMatrix.matrix[1];
        var c0 = currentMatrix.matrix[2];
        var d0 = currentMatrix.matrix[3];
        var e0 = currentMatrix.matrix[4];
        var f0 = currentMatrix.matrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
        var tx0 = x * a + y * c + e;
        var ty0 = x * b + y * d + f;
        var tx1 = x * a + yh * c + e;
        var ty1 = x * b + yh * d + f;
        var tx2 = xw * a + yh * c + e;
        var ty2 = xw * b + yh * d + f;
        var tx3 = xw * a + y * c + e;
        var ty3 = xw * b + y * d + f;
        var tint = Utils.getTintAppendFloatAlpha(fillColor, fillAlpha);

        vertexBufferF32[vertexOffset + 0] = tx0;
        vertexBufferF32[vertexOffset + 1] = ty0;
        vertexBufferU32[vertexOffset + 2] = tint;
        vertexBufferF32[vertexOffset + 3] = tx1;
        vertexBufferF32[vertexOffset + 4] = ty1;
        vertexBufferU32[vertexOffset + 5] = tint;
        vertexBufferF32[vertexOffset + 6] = tx2;
        vertexBufferF32[vertexOffset + 7] = ty2;
        vertexBufferU32[vertexOffset + 8] = tint;
        vertexBufferF32[vertexOffset + 9] = tx0;
        vertexBufferF32[vertexOffset + 10] = ty0;
        vertexBufferU32[vertexOffset + 11] = tint;
        vertexBufferF32[vertexOffset + 12] = tx2;
        vertexBufferF32[vertexOffset + 13] = ty2;
        vertexBufferU32[vertexOffset + 14] = tint;
        vertexBufferF32[vertexOffset + 15] = tx3;
        vertexBufferF32[vertexOffset + 16] = ty3;
        vertexBufferU32[vertexOffset + 17] = tint;

        this.vertexCount += 6;
    },

    batchFillTriangle: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, x0, y0, x1, y1, x2, y2, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {
        if (this.vertexCount + 3 > this.vertexCapacity)
        {
            this.flush();
        }

        var vertexBufferF32 = this.vertexViewF32;
        var vertexBufferU32 = this.vertexViewU32;
        var vertexOffset = this.vertexCount * this.vertexComponentCount;
        var a0 = currentMatrix.matrix[0];
        var b0 = currentMatrix.matrix[1];
        var c0 = currentMatrix.matrix[2];
        var d0 = currentMatrix.matrix[3];
        var e0 = currentMatrix.matrix[4];
        var f0 = currentMatrix.matrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
        var tx0 = x0 * a + y0 * c + e;
        var ty0 = x0 * b + y0 * d + f;
        var tx1 = x1 * a + y1 * c + e;
        var ty1 = x1 * b + y1 * d + f;
        var tx2 = x2 * a + y2 * c + e;
        var ty2 = x2 * b + y2 * d + f;
        var tint = Utils.getTintAppendFloatAlpha(fillColor, fillAlpha);

        vertexBufferF32[vertexOffset + 0] = tx0;
        vertexBufferF32[vertexOffset + 1] = ty0;
        vertexBufferU32[vertexOffset + 2] = tint;
        vertexBufferF32[vertexOffset + 3] = tx1;
        vertexBufferF32[vertexOffset + 4] = ty1;
        vertexBufferU32[vertexOffset + 5] = tint;
        vertexBufferF32[vertexOffset + 6] = tx2;
        vertexBufferF32[vertexOffset + 7] = ty2;
        vertexBufferU32[vertexOffset + 8] = tint;

        this.vertexCount += 3;
    },

    batchStrokeTriangle: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, x0, y0, x1, y1, x2, y2, lineWidth, lineColor, lineAlpha, a, b, c, d, e, f, currentMatrix)
    {
        var tempTriangle = this.tempTriangle;

        tempTriangle[0].x = x0;
        tempTriangle[0].y = y0;
        tempTriangle[0].width = lineWidth;
        tempTriangle[0].rgb = lineColor;
        tempTriangle[0].alpha = lineAlpha;
        tempTriangle[1].x = x1;
        tempTriangle[1].y = y1;
        tempTriangle[1].width = lineWidth;
        tempTriangle[1].rgb = lineColor;
        tempTriangle[1].alpha = lineAlpha;
        tempTriangle[2].x = x2;
        tempTriangle[2].y = y2;
        tempTriangle[2].width = lineWidth;
        tempTriangle[2].rgb = lineColor;
        tempTriangle[2].alpha = lineAlpha;
        tempTriangle[3].x = x0;
        tempTriangle[3].y = y0;
        tempTriangle[3].width = lineWidth;
        tempTriangle[3].rgb = lineColor;
        tempTriangle[3].alpha = lineAlpha;

        this.addStrokePath(
            srcX, srcY, srcScaleX, srcScaleY, srcRotation,
            tempTriangle, lineWidth, lineColor, lineAlpha,
            a, b, c, d, e, f,
            false,
            currentMatrix
        );
    },

    batchFillPath: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, path, fillColor, fillAlpha, a1, b1, c1, d1, e1, f1, currentMatrix)
    {

    },

    batchStrokePath: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, path, lineWidth, lineColor, lineAlpha, a, b, c, d, e, f, isLastPath, currentMatrix)
    {

    },

    batchLine: function (srcX, srcY, srcScaleX, srcScaleY, srcRotation, ax, ay, bx, by, aLineWidth, bLineWidth, aLineColor, bLineColor, lineAlpha, a1, b1, c1, d1, e1, f1, currentMatrix) 
    {

    }

});

module.exports = FlatTintPipeline;
