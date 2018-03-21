var GL = require('../GL');

var UpdateBufferResourceCommand = function ()
{
    this.buffer = null;
    this.bufferData = null;
    this.bufferDataOffset = 0;
};

UpdateBufferResourceCommand.prototype.constructor = UpdateBufferResourceCommand;

UpdateBufferResourceCommand.prototype = {

    setBuffer: function (buffer)
    {
        this.buffer = buffer;
    
        return this;
    },

    setBufferData: function (bufferData, offset)
    {
        this.bufferData = bufferData;
        this.bufferDataOffset = offset;

        return this;
    },

    dispatch: function (backend)
    {
        var gl = backend;
        var buffer = this.buffer;
        var bufferTarget = buffer.bufferTarget;

        gl.bindBuffer(bufferTarget, buffer.bufferObject);
        gl.bufferSubData(bufferTarget, this.bufferDataOffset, this.bufferData);
    }
};

module.exports = UpdateBufferResourceCommand;
