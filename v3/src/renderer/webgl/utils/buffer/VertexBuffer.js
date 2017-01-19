var VertexBuffer = function (byteSize)
{
    this.dwordLength = 0;
    this.dwordCapacity = byteSize / 4;
    this.buffer = new ArrayBuffer(byteSize);
    this.floatView = new Float32Array(this.buffer);
    this.intView = new Int32Array(this.buffer);
    this.uintView = new Uint32Array(this.buffer);
};

VertexBuffer.prototype.clear = function ()
{
    this.dwordLength = 0;
};

VertexBuffer.prototype.getByteLength = function ()
{
    return this.dwordLength * 4;
};

VertexBuffer.prototype.getByteCapacity = function () 
{
    return this.buffer.byteLength;
};

VertexBuffer.prototype.allocate = function (dwordSize)
{
    var currentLength = this.dwordLength;
    this.dwordLength += dwordSize;
    return currentLength;
};

VertexBuffer.prototype.getUsedBufferAsFloat = function ()
{
    return this.floatView.subarray(0, this.dwordLength);
};

VertexBuffer.prototype.getUsedBufferAsInt = function ()
{
    return this.intView.subarray(0, this.dwordLength);
};

VertexBuffer.prototype.getUsedBufferAsUint = function ()
{
    return this.uintView.subarray(0, this.dwordLength);
};

module.exports = VertexBuffer;
