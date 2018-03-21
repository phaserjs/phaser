var GL = require('../GL');

var IndexBuffer = function (bufferObject) 
{
    this.bufferTarget = GL.ELEMENT_ARRAY_BUFFER;
    this.bufferObject = bufferObject;
};

module.exports = IndexBuffer;
