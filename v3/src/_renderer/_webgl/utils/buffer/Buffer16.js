var Buffer16 = function (byteSize)
{
    this.wordLength = 0;
    this.wordCapacity = byteSize / 2;
    this.buffer = new ArrayBuffer(byteSize);
    this.intView = new Int16Array(this.buffer);
    this.uintView = new Uint16Array(this.buffer);
};

Buffer16.prototype.clear = function ()
{
    this.wordLength = 0;
};

Buffer16.prototype.getByteLength = function ()
{
    return this.wordLength * 2;
};

Buffer16.prototype.getByteCapacity = function () 
{
    return this.buffer.byteLength;
};

Buffer16.prototype.allocate = function (wordSize)
{
    var currentLength = this.wordLength;
    this.wordLength += wordSize;
    return currentLength;
};

Buffer16.prototype.getUsedBufferAsShort = function ()
{
    return this.intView.subarray(0, this.wordLength);
};

Buffer16.prototype.getUsedBufferAsWord = function ()
{
    return this.uintView.subarray(0, this.wordLength);
};

module.exports = Buffer16;
