var Class = require('../../../utils/Class');

var DataBuffer16 = new Class({

    initialize:

    function DataBuffer16 (byteSize)
    {
        this.wordLength = 0;
        this.wordCapacity = byteSize / 2;
        this.buffer = new ArrayBuffer(byteSize);
        this.intView = new Int16Array(this.buffer);
        this.uintView = new Uint16Array(this.buffer);
    },

    clear: function ()
    {
        this.wordLength = 0;
    },

    getByteLength: function ()
    {
        return this.wordLength * 2;
    },

    getByteCapacity: function () 
    {
        return this.buffer.byteLength;
    },

    allocate: function (wordSize)
    {
        var currentLength = this.wordLength;
        this.wordLength += wordSize;
        return currentLength;
    },

    getUsedBufferAsShort: function ()
    {
        return this.intView.subarray(0, this.wordLength);
    },

    getUsedBufferAsWord: function ()
    {
        return this.uintView.subarray(0, this.wordLength);
    }

});

module.exports = DataBuffer16;
