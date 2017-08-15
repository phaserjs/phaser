var Class = require('../../../utils/Class');
var CurrentIndexBuffer = null;
var IndexBuffer = new Class({

    initialize:

    function IndexBuffer (gl, bufferObject)
    {
        this.gl = gl;
        this.bufferTarget = gl.ELEMENT_ARRAY_BUFFER;
        this.bufferObject = bufferObject;
    },

    bind: function ()
    {
        var gl = this.gl;
        if (CurrentIndexBuffer !== this)
        {
            CurrentIndexBuffer = this;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
        }

        return this;
    },

    updateResource: function (bufferData, offset)
    {
        var gl = this.gl;

        if (CurrentIndexBuffer !== this)
        {
            CurrentIndexBuffer = this;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
        }
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, bufferData);

        return this;
    }

});

IndexBuffer.SetDirty = function ()
{
    CurrentIndexBuffer = null;
};

module.exports = IndexBuffer;
