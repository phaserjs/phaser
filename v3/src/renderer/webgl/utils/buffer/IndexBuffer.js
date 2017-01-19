var IndexBuffer = function (byteSize)
{
    this.wordLength = 0;
    this.wordCapacity = byteSize / 2;
    this.buffer = new ArrayBuffer(byteSize);
    this.shortView = new Int16Array(this.buffer);
    this.wordView = new Uint16Array(this.buffer);
};

IndexBuffer.prototype.clear = function ()
{
    this.wordLength = 0;
};

IndexBuffer.prototype.getByteLength = function ()
{
    return this.wordLength * 2;
};

IndexBuffer.prototype.getByteCapacity = function () 
{
    return this.buffer.byteLength;
};

IndexBuffer.prototype.allocate = function (wordSize)
{
    var currentLength = this.wordLength;
    this.wordLength += wordSize;
    return currentLength;
};

IndexBuffer.prototype.getUsedBufferAsShort = function ()
{
    return this.shortView.subarray(0, this.dwordLength);
};

IndexBuffer.prototype.getUsedBufferAsWord = function ()
{
    return this.wordView.subarray(0, this.dwordLength);
};

module.exports = IndexBuffer;
