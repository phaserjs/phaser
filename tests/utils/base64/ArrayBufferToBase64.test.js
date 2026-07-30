var ArrayBufferToBase64 = require('../../../src/utils/base64/ArrayBufferToBase64');

describe('Phaser.Utils.Base64.ArrayBufferToBase64', function ()
{
    function stringToArrayBuffer (str)
    {
        var buf = new ArrayBuffer(str.length);
        var bytes = new Uint8Array(buf);
        for (var i = 0; i < str.length; i++)
        {
            bytes[i] = str.charCodeAt(i);
        }
        return buf;
    }

    it('should return an empty string for an empty ArrayBuffer', function ()
    {
        var buf = new ArrayBuffer(0);
        expect(ArrayBufferToBase64(buf)).toBe('');
    });

    it('should encode a single byte (length % 3 === 1)', function ()
    {
        var buf = new ArrayBuffer(1);
        var bytes = new Uint8Array(buf);
        bytes[0] = 0;
        var result = ArrayBufferToBase64(buf);
        expect(result).toBe('AA==');
    });

    it('should encode two bytes (length % 3 === 2)', function ()
    {
        var buf = new ArrayBuffer(2);
        var bytes = new Uint8Array(buf);
        bytes[0] = 0;
        bytes[1] = 0;
        var result = ArrayBufferToBase64(buf);
        expect(result).toBe('AAA=');
    });

    it('should encode three bytes with no padding (length % 3 === 0)', function ()
    {
        var buf = new ArrayBuffer(3);
        var bytes = new Uint8Array(buf);
        bytes[0] = 0;
        bytes[1] = 0;
        bytes[2] = 0;
        var result = ArrayBufferToBase64(buf);
        expect(result).toBe('AAAA');
    });

    it('should correctly encode the string "Man"', function ()
    {
        var result = ArrayBufferToBase64(stringToArrayBuffer('Man'));
        expect(result).toBe('TWFu');
    });

    it('should correctly encode the string "Ma"', function ()
    {
        var result = ArrayBufferToBase64(stringToArrayBuffer('Ma'));
        expect(result).toBe('TWE=');
    });

    it('should correctly encode the string "M"', function ()
    {
        var result = ArrayBufferToBase64(stringToArrayBuffer('M'));
        expect(result).toBe('TQ==');
    });

    it('should correctly encode the string "Hello"', function ()
    {
        var result = ArrayBufferToBase64(stringToArrayBuffer('Hello'));
        expect(result).toBe('SGVsbG8=');
    });

    it('should correctly encode the string "Hello World"', function ()
    {
        var result = ArrayBufferToBase64(stringToArrayBuffer('Hello World'));
        expect(result).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should return only a plain base64 string when no mediaType is provided', function ()
    {
        var result = ArrayBufferToBase64(stringToArrayBuffer('test'));
        expect(result.startsWith('data:')).toBe(false);
    });

    it('should return a data URI when mediaType is provided', function ()
    {
        var buf = stringToArrayBuffer('test');
        var result = ArrayBufferToBase64(buf, 'image/png');
        expect(result.startsWith('data:image/png;base64,')).toBe(true);
    });

    it('should include correct base64 data after the data URI prefix', function ()
    {
        var buf = stringToArrayBuffer('Man');
        var result = ArrayBufferToBase64(buf, 'audio/ogg');
        expect(result).toBe('data:audio/ogg;base64,TWFu');
    });

    it('should handle a data URI with padding (single byte)', function ()
    {
        var buf = new ArrayBuffer(1);
        new Uint8Array(buf)[0] = 77; // 'M'
        var result = ArrayBufferToBase64(buf, 'image/jpeg');
        expect(result).toBe('data:image/jpeg;base64,TQ==');
    });

    it('should handle a data URI with single padding (two bytes)', function ()
    {
        var buf = stringToArrayBuffer('Ma');
        var result = ArrayBufferToBase64(buf, 'image/jpeg');
        expect(result).toBe('data:image/jpeg;base64,TWE=');
    });

    it('should produce a string ending with == when buffer length mod 3 is 1', function ()
    {
        var buf = new ArrayBuffer(4); // 4 % 3 === 1
        var result = ArrayBufferToBase64(buf);
        expect(result.endsWith('==')).toBe(true);
    });

    it('should produce a string ending with = when buffer length mod 3 is 2', function ()
    {
        var buf = new ArrayBuffer(5); // 5 % 3 === 2
        var result = ArrayBufferToBase64(buf);
        expect(result.endsWith('=')).toBe(true);
        expect(result.endsWith('==')).toBe(false);
    });

    it('should produce a string not ending with = when buffer length mod 3 is 0', function ()
    {
        var buf = new ArrayBuffer(6); // 6 % 3 === 0
        var result = ArrayBufferToBase64(buf);
        expect(result.endsWith('=')).toBe(false);
    });

    it('should only contain valid base64 characters (no mediaType)', function ()
    {
        var buf = stringToArrayBuffer('Phaser Game Framework');
        var result = ArrayBufferToBase64(buf);
        expect(/^[A-Za-z0-9+/]+=*$/.test(result)).toBe(true);
    });

    it('should handle all byte values 0-255', function ()
    {
        var buf = new ArrayBuffer(256);
        var bytes = new Uint8Array(buf);
        for (var i = 0; i < 256; i++)
        {
            bytes[i] = i;
        }
        var result = ArrayBufferToBase64(buf);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(/^[A-Za-z0-9+/]+=*$/.test(result)).toBe(true);
    });

    it('should produce output of correct length for given input sizes', function ()
    {
        // base64 encodes 3 bytes as 4 chars, with padding to nearest 4
        var buf3 = new ArrayBuffer(3);
        expect(ArrayBufferToBase64(buf3).length).toBe(4);

        var buf6 = new ArrayBuffer(6);
        expect(ArrayBufferToBase64(buf6).length).toBe(8);

        var buf1 = new ArrayBuffer(1);
        expect(ArrayBufferToBase64(buf1).length).toBe(4);

        var buf2 = new ArrayBuffer(2);
        expect(ArrayBufferToBase64(buf2).length).toBe(4);
    });

    it('should return a string type', function ()
    {
        var buf = stringToArrayBuffer('abc');
        expect(typeof ArrayBufferToBase64(buf)).toBe('string');
    });

    it('should treat undefined mediaType the same as no mediaType', function ()
    {
        var buf = stringToArrayBuffer('Man');
        var result = ArrayBufferToBase64(buf, undefined);
        expect(result).toBe('TWFu');
    });
});
