var CreateBuffer = function (gl, bufferType, usage, bufferData, bufferSize)
{
    var buffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer);
    if (bufferData && ArrayBuffer.isView(bufferData))
    {
        gl.bufferData(bufferType, bufferData, usage);
    }
    else
    {
        gl.bufferData(bufferType, bufferSize, usage);
    }
    return buffer;
};

module.exports = CreateBuffer;
