
var IndexBuffer = function (gl, bufferObject) 
{
    this.gl = gl;
    this.bufferTarget = gl.ELEMENT_ARRAY_BUFFER;
    this.bufferObject = bufferObject;
};

IndexBuffer.prototype.constructor = IndexBuffer;

IndexBuffer.prototype = {

    bind: function ()
    {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
        return this;
    },

    updateResource: function (bufferData, offset)
    {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, bufferData);
        return this;
    }

};

module.exports = IndexBuffer;
