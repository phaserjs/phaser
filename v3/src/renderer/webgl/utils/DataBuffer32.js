var Class = require('../../../utils/Class');

var DataBuffer32 = new Class({

    initialize:

    function DataBuffer32 (byteSize)
    {
        this.dwordLength = 0;
        this.dwordCapacity = byteSize / 4;
        this.buffer = new ArrayBuffer(byteSize);
        this.floatView = new Float32Array(this.buffer);
        this.intView = new Int32Array(this.buffer);
        this.uintView = new Uint32Array(this.buffer);
    },

    clear: function ()
    {
        this.dwordLength = 0;
    },

    getByteLength: function ()
    {
        return this.dwordLength * 4;
    },

    getByteCapacity: function ()
    {
        return this.buffer.byteLength;
    },

    allocate: function (dwordSize)
    {
        var currentLength = this.dwordLength;
        this.dwordLength += dwordSize;
        return currentLength;
    },

    getUsedBufferAsFloat: function ()
    {
        return this.floatView.subarray(0, this.dwordLength);
    },

    getUsedBufferAsInt: function ()
    {
        return this.intView.subarray(0, this.dwordLength);
    },

    getUsedBufferAsUint: function ()
    {
        return this.uintView.subarray(0, this.dwordLength);
    }

});

module.exports = DataBuffer32;
