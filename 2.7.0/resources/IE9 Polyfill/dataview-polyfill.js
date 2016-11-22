/*
* By Benvie https://gist.github.com/Benvie/5020656
*/

void function(global){
  if ('DataView' in global && 'ArrayBuffer' in global) {
    return;
  }
 
  var hide = (function(){
    // check if we're in ES5
    if (typeof Object.getOwnPropertyNames === 'function' && !('prototype' in Object.getOwnPropertyNames)) {
      var hidden = { enumerable: false };
 
      return function(object, key){
        Object.defineProperty(object, key, hidden);
      };
    }
 
    // noop for ES3
    return function(){};
  })();
 
  function define(object, props){
    for (var key in props) {
      object[key] = props[key];
    }
  }
 
 
  var ArrayBuffer = global.ArrayBuffer = (function(){
    var min  = Math.min,
        max  = Math.max,
        char = String.fromCharCode;
 
    var chars   = {},
        indices = [];
 
    // create cached mapping of characters to char codes and back
    void function(){
      for (var i = 0; i < 0x100; ++i) {
        chars[indices[i] = char(i)] = i;
        if (i >= 0x80) {
          chars[char(0xf700 + i)] = i;
        }
      }
    }();
 
    // read a string into an array of bytes
    function readString(string){
      var array  = [],
          cycles = string.length % 8,
          index  = 0;
 
      while (cycles--) {
        array[index] = chars[string[index++]];
      }
 
      cycles = string.length >> 3;
 
      while (cycles--) {
        array.push(
          chars[string[index]],
          chars[string[index+1]],
          chars[string[index+2]],
          chars[string[index+3]],
          chars[string[index+4]],
          chars[string[index+5]],
          chars[string[index+6]],
          chars[string[index+7]]
        );
        index += 8;
      }
 
      return array;
    }
 
    // write an array of bytes to a string
    function writeString(array){
      try { return char.apply(null, array) } catch (e) {}
 
      var string = '',
          cycles = array.length % 8,
          index  = 0;
 
      while (cycles--) {
        string += indices[array[index++]];
      }
 
      cycles = array.length >> 3;
 
      while (cycles--) {
        string +=
          indices[array[index]] +
          indices[array[index+1]] +
          indices[array[index+2]] +
          indices[array[index+3]] +
          indices[array[index+4]] +
          indices[array[index+5]] +
          indices[array[index+6]] +
          indices[array[index+7]];
        index += 8;
      }
 
      return string;
    }
 
    // create a new array of given size where each element is 0
    function zerodArray(size){
      var data = new Array(size);
 
      for (var i=0; i < size; i++) {
        data[i] = 0;
      }
 
      return data;
    }
 
 
    // ###################
    // ### ArrayBuffer ###
    // ###################
 
    function ArrayBuffer(length){
      if (length instanceof ArrayBuffer) {
        this._data = length._data.slice();
      } else if (typeof length === 'string') {
        this._data = readString(length);
      } else {
        if ((length >>= 0) < 0) {
          throw new RangeError('ArrayBuffer length must be non-negative');
        }
        this._data = zerodArray(length);
      }
 
      this.byteLength = this._data.length;
      hide(this, '_data');
    }
 
    define(ArrayBuffer, {
      toByteString: function toByteString(arraybuffer){
        if (!(arraybuffer instanceof ArrayBuffer)) {
          throw new TypeError('ArrayBuffer.toByteString requires an ArrayBuffer');
        }
 
        return writeString(arraybuffer._data);
      }
    });
 
    define(ArrayBuffer.prototype, {
      slice: function slice(begin, end){
        var arraybuffer = new ArrayBuffer(0);
 
        arraybuffer._data = this._data.slice(begin, end);
        arraybuffer.byteLength = arraybuffer._data.length;
 
        return arraybuffer;
      }
    });
 
    return ArrayBuffer;
  })();
 
 
 
  global.DataView = (function(){
    var log = Math.log,
        pow = Math.pow,
        LN2 = Math.LN2;
 
 
    // Joyent copyright applies to readFloat and writeFloat
 
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
 
    function readFloat(dataview, offset, littleEndian, mLen, bytes){
      var buffer = dataview.buffer._data,
          offset = dataview.byteOffset + offset,
          e, m,
          eLen = bytes * 8 - mLen - 1,
          eMax = (1 << eLen) - 1,
          eBias = eMax >> 1,
          nBits = -7,
          i = littleEndian ? bytes - 1 : 0 ,
          d = littleEndian ? -1 : 1,
          s = buffer[offset + i];
 
      i += d;
 
      e = s & ((1 << (-nBits)) - 1);
      s >>= (-nBits);
      nBits += eLen;
      for (; nBits > 0; e = e * 0x100 + buffer[offset + i], i += d, nBits -= 8);
 
      m = e & ((1 << (-nBits)) - 1);
      e >>= (-nBits);
      nBits += mLen;
      for (; nBits > 0; m = m * 0x100 + buffer[offset + i], i += d, nBits -= 8);
 
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : s ? -Infinity : Infinity;
      } else {
        m = m + pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * pow(2, e - mLen);
    }
 
    function writeFloat(dataview, offset, value, littleEndian, mLen, bytes){
      var buffer = dataview.buffer._data,
          offset = dataview.byteOffset + offset,
          e, m, c,
          eLen = bytes * 8 - mLen - 1,
          eMax = (1 << eLen) - 1,
          eBias = eMax >> 1,
          rt = (mLen === 23 ? pow(2, -24) - pow(2, -77) : 0),
          i = littleEndian ? 0 : bytes - 1,
          d = littleEndian ? 1 : -1,
          s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
 
      value < 0 && (value = -value);
 
      if (value !== value || value === Infinity) {
        m = value !== value ? 1 : 0;
        e = eMax;
      } else {
        e = (log(value) / LN2) | 0;
        if (value * (c = pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
 
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * pow(2, eBias - 1) * pow(2, mLen);
          e = 0;
        }
      }
 
      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 0x100, mLen -= 8);
 
      e = (e << mLen) | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 0x100, eLen -= 8);
 
      buffer[offset + i - d] |= s * 0x80;
    }
 
 
    var le2 = [1, 0],
        le4 = [3, 2, 1, 0],
        be2 = [0, 1],
        be4 = [0, 1, 2, 3];
 
    function readUint8(dataview, byteOffset){
      var buffer = dataview.buffer._data,
          offset = byteOffset + dataview.byteOffset;
 
      return buffer[offset];
    }
 
    function readUint16(dataview, byteOffset, littleEndian){
      var buffer = dataview.buffer._data,
          offset = byteOffset + dataview.byteOffset,
          order  = littleEndian ? le2 : be2;
 
      var b0 = buffer[offset + order[0]],
          b1 = buffer[offset + order[1]] << 8;
 
      return b0 | b1;
    }
 
    function readUint32(dataview, byteOffset, littleEndian){
      var buffer = dataview.buffer._data,
          offset = byteOffset + dataview.byteOffset,
          order  = littleEndian ? le4 : be4;
 
      var b0 = buffer[offset + order[0]],
          b1 = buffer[offset + order[1]] << 8,
          b2 = buffer[offset + order[2]] << 16,
          b3 = buffer[offset + order[3]] << 24;
 
      return b0 | b1 | b2 | b3;
    }
 
 
    function boundsCheck(offset, size, max){
      if (offset < 0) {
        throw new RangeError('Tried to write to a negative index');
      } else if (offset + size > max) {
        throw new RangeError('Tried to write '+size+' bytes past the end of a buffer at index '+offset+' of '+max);
      }
    }
 
 
    function writeUint8(dataview, byteOffset, value){
      var buffer = dataview.buffer._data,
          offset = byteOffset + dataview.byteOffset;
 
      boundsCheck(offset, 1, buffer.length);
 
      buffer[offset] = value & 0xff;
    }
 
    function writeUint16(dataview, byteOffset, value, littleEndian){
      var buffer = dataview.buffer._data,
          order  = littleEndian ? le2 : be2,
          offset = byteOffset + dataview.byteOffset;
 
      boundsCheck(offset, 2, buffer.length);
 
      buffer[offset + order[0]] = value & 0xff;
      buffer[offset + order[1]] = value >>> 8 & 0xff;
    }
 
    function writeUint32(dataview, byteOffset, value, littleEndian){
      var buffer = dataview.buffer._data,
          order  = littleEndian ? le4 : be4,
          offset = byteOffset + dataview.byteOffset;
 
      boundsCheck(offset, 4, buffer.length);
 
      buffer[offset + order[0]] = value & 0xff;
      buffer[offset + order[1]] = value >>> 8 & 0xff;
      buffer[offset + order[2]] = value >>> 16 & 0xff;
      buffer[offset + order[3]] = value >>> 24 & 0xff;
    }
 
 
 
    // ################
    // ### DataView ###
    // ################
 
    function DataView(buffer, byteOffset, byteLength){
      if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError('DataView must be initialized with an ArrayBuffer');
      }
 
      if (byteOffset === undefined) {
        this.byteOffset = buffer.byteOffset >> 0;
      } else {
        this.byteOffset = byteOffset >> 0;
      }
 
      if (this.byteOffset < 0) {
        throw new RangeError('DataView byteOffset must be non-negative');
      }
 
 
      if (byteLength === undefined) {
        this.byteLength = (buffer.byteLength - this.byteOffset) >> 0;
      } else {
        this.byteLength = byteLength >> 0;
      }
 
      if (this.byteLength < 0) {
        throw new RangeError('DataView byteLength must be non-negative');
      }
 
 
      if (this.byteOffset + this.byteLength > buffer.byteLength) {
        throw new RangeError('DataView byteOffset and byteLength greater than ArrayBuffer byteLength');
      }
 
      this.buffer = buffer;
    }
 
    define(DataView.prototype, {
      getFloat32: function getFloat32(byteOffset, littleEndian){
        return readFloat(this, byteOffset, littleEndian, 23, 4);
      },
      getFloat64: function getFloat64(byteOffset, littleEndian){
        return readFloat(this, byteOffset, littleEndian, 52, 8);
      },
      getInt8: function getInt8(byteOffset){
        var n = readUint8(this, byteOffset);
        return n & 0x80 ? n ^ -0x100 : n;
      },
      getInt16: function getInt16(byteOffset, littleEndian){
        var n = readUint16(this, byteOffset, littleEndian);
        return n & 0x8000 ? n ^ -0x10000 : n;
      },
      getInt32: function getInt32(byteOffset, littleEndian){
        var n = readUint32(this, byteOffset, littleEndian);
        return n & 0x80000000 ? n ^ -0x100000000 : n;
      },
      getUint8: function getUint8(byteOffset){
        return readUint8(this, byteOffset);
      },
      getUint16: function getUint16(byteOffset, littleEndian){
        return readUint16(this, byteOffset, littleEndian);
      },
      getUint32: function getUint32(byteOffset, littleEndian){
        return readUint32(this, byteOffset, littleEndian);
      },
      setFloat32: function setFloat32(byteOffset, value, littleEndian){
        writeFloat(this, byteOffset, value, littleEndian, 23, 4);
      },
      setFloat64: function setFloat64(byteOffset, value, littleEndian){
        writeFloat(this, byteOffset, value, littleEndian, 52, 8);
      },
      setInt8: function setInt8(byteOffset, value){
        writeUint8(this, byteOffset, value < 0 ? value | 0x100 : value);
      },
      setInt16: function setInt16(byteOffset, value, littleEndian){
        writeUint16(this, byteOffset, value < 0 ? value | 0x10000 : value, littleEndian);
      },
      setInt32: function setInt32(byteOffset, value, littleEndian){
        writeUint32(this, byteOffset, value < 0 ? value | 0x100000000 : value, littleEndian);
      },
      setUint8: function setUint8(byteOffset, value){
        writeUint8(this, byteOffset, value);
      },
      setUint16: function setUint16(byteOffset, value, littleEndian){
        writeUint16(this, byteOffset, value, littleEndian);
      },
      setUint32: function setUint32(byteOffset, value, littleEndian){
        writeUint32(this, byteOffset, value, littleEndian);
      }
    });
 
    return DataView;
  })();
}((0,eval)('this'));