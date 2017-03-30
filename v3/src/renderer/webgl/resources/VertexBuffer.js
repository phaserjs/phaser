var GL = require('../GL');

var VertexBuffer = function (bufferObject) 
{
    this.bufferTarget = GL.ARRAY_BUFFER;
    this.bufferObject = bufferObject;
    this.inputElements = [];
};

VertexBuffer.prototype.constructor = VertexBuffer;

VertexBuffer.prototype = {

    setInputElement: function (index, size, type, normalized, stride, offset)
    {
        this.inputElements.push({
            index: index,
            size: size,
            type: type,
            normalized: normalized,
            stride: stride,
            offset: offset
        });
    }

};

module.exports = VertexBuffer;
