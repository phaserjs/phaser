var Buffer32 = function (byteSize)
{
    this.dwordLength = 0;
    this.dwordCapacity = byteSize / 4;
    this.buffer = new ArrayBuffer(byteSize);
    this.floatView = new Float32Array(this.buffer);
    this.intView = new Int32Array(this.buffer);
    this.uintView = new Uint32Array(this.buffer);
};

Buffer32.prototype.clear = function ()
{
    this.dwordLength = 0;
};

Buffer32.prototype.getByteLength = function ()
{
    return this.dwordLength * 4;
};

Buffer32.prototype.getByteCapacity = function () 
{
    return this.buffer.byteLength;
};

Buffer32.prototype.allocate = function (dwordSize)
{
    var currentLength = this.dwordLength;
    this.dwordLength += dwordSize;
    return currentLength;
};

Buffer32.prototype.getUsedBufferAsFloat = function ()
{
    return this.floatView.subarray(0, this.dwordLength);
};

Buffer32.prototype.getUsedBufferAsInt = function ()
{
    return this.intView.subarray(0, this.dwordLength);
};

Buffer32.prototype.getUsedBufferAsUint = function ()
{
    return this.uintView.subarray(0, this.dwordLength);
};

module.exports = Buffer32;
