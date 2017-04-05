var DataBuffer32 = function (byteSize)
{
    this.dwordLength = 0;
    this.dwordCapacity = byteSize / 4;
    this.buffer = new ArrayBuffer(byteSize);
    this.floatView = new Float32Array(this.buffer);
    this.intView = new Int32Array(this.buffer);
    this.uintView = new Uint32Array(this.buffer);
};

DataBuffer32.prototype.clear = function ()
{
    this.dwordLength = 0;
};

DataBuffer32.prototype.getByteLength = function ()
{
    return this.dwordLength * 4;
};

DataBuffer32.prototype.getByteCapacity = function () 
{
    return this.buffer.byteLength;
};

DataBuffer32.prototype.allocate = function (dwordSize)
{
    var currentLength = this.dwordLength;
    this.dwordLength += dwordSize;
    return currentLength;
};

DataBuffer32.prototype.getUsedBufferAsFloat = function ()
{
    return this.floatView.subarray(0, this.dwordLength);
};

DataBuffer32.prototype.getUsedBufferAsInt = function ()
{
    return this.intView.subarray(0, this.dwordLength);
};

DataBuffer32.prototype.getUsedBufferAsUint = function ()
{
    return this.uintView.subarray(0, this.dwordLength);
};

module.exports = DataBuffer32;
