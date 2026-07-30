var Base64ToArrayBuffer = require('../../../src/utils/base64/Base64ToArrayBuffer');

describe('Phaser.Utils.Base64.Base64ToArrayBuffer', function ()
{
    it('should return an ArrayBuffer', function ()
    {
        var result = Base64ToArrayBuffer('AA==');
        expect(result).toBeInstanceOf(ArrayBuffer);
    });

    it('should decode a simple base64 string to correct bytes', function ()
    {
        // "Man" encodes to "TWFu" in base64
        var result = Base64ToArrayBuffer('TWFu');
        var bytes = new Uint8Array(result);
        expect(bytes[0]).toBe(77);  // 'M'
        expect(bytes[1]).toBe(97);  // 'a'
        expect(bytes[2]).toBe(110); // 'n'
    });

    it('should decode base64 with single padding character', function ()
    {
        // "Ma" encodes to "TWE=" in base64
        var result = Base64ToArrayBuffer('TWE=');
        var bytes = new Uint8Array(result);
        expect(result.byteLength).toBe(2);
        expect(bytes[0]).toBe(77); // 'M'
        expect(bytes[1]).toBe(97); // 'a'
    });

    it('should decode base64 with double padding characters', function ()
    {
        // "M" encodes to "TQ==" in base64
        var result = Base64ToArrayBuffer('TQ==');
        var bytes = new Uint8Array(result);
        expect(result.byteLength).toBe(1);
        expect(bytes[0]).toBe(77); // 'M'
    });

    it('should strip a data URI header before decoding', function ()
    {
        // Same as "Man" -> "TWFu" but with a data URI prefix
        var result = Base64ToArrayBuffer('data:image/png;base64,TWFu');
        var bytes = new Uint8Array(result);
        expect(bytes[0]).toBe(77);  // 'M'
        expect(bytes[1]).toBe(97);  // 'a'
        expect(bytes[2]).toBe(110); // 'n'
    });

    it('should produce correct buffer length for input without padding', function ()
    {
        // 4 base64 chars = 3 bytes
        var result = Base64ToArrayBuffer('TWFu');
        expect(result.byteLength).toBe(3);
    });

    it('should produce correct buffer length for input with one padding char', function ()
    {
        // 4 base64 chars with one '=' = 2 bytes
        var result = Base64ToArrayBuffer('TWE=');
        expect(result.byteLength).toBe(2);
    });

    it('should produce correct buffer length for input with two padding chars', function ()
    {
        // 4 base64 chars with two '==' = 1 byte
        var result = Base64ToArrayBuffer('TQ==');
        expect(result.byteLength).toBe(1);
    });

    it('should decode a longer base64 string correctly', function ()
    {
        // "Hello" encodes to "SGVsbG8=" in base64
        var result = Base64ToArrayBuffer('SGVsbG8=');
        var bytes = new Uint8Array(result);
        expect(result.byteLength).toBe(5);
        expect(bytes[0]).toBe(72); // 'H'
        expect(bytes[1]).toBe(101); // 'e'
        expect(bytes[2]).toBe(108); // 'l'
        expect(bytes[3]).toBe(108); // 'l'
        expect(bytes[4]).toBe(111); // 'o'
    });

    it('should decode all-zero bytes', function ()
    {
        // Three zero bytes encode to "AAAA"
        var result = Base64ToArrayBuffer('AAAA');
        var bytes = new Uint8Array(result);
        expect(result.byteLength).toBe(3);
        expect(bytes[0]).toBe(0);
        expect(bytes[1]).toBe(0);
        expect(bytes[2]).toBe(0);
    });

    it('should decode all-255 bytes', function ()
    {
        // Three 0xFF bytes encode to "////"
        var result = Base64ToArrayBuffer('////');
        var bytes = new Uint8Array(result);
        expect(result.byteLength).toBe(3);
        expect(bytes[0]).toBe(255);
        expect(bytes[1]).toBe(255);
        expect(bytes[2]).toBe(255);
    });

    it('should handle a data URI with various mime types', function ()
    {
        var result = Base64ToArrayBuffer('data:application/octet-stream;base64,TWFu');
        var bytes = new Uint8Array(result);
        expect(bytes[0]).toBe(77);
        expect(bytes[1]).toBe(97);
        expect(bytes[2]).toBe(110);
    });

    it('should decode a multi-block base64 string', function ()
    {
        // "Hello World" encodes to "SGVsbG8gV29ybGQ=" in base64
        var result = Base64ToArrayBuffer('SGVsbG8gV29ybGQ=');
        var bytes = new Uint8Array(result);
        expect(result.byteLength).toBe(11);
        expect(bytes[0]).toBe(72);  // 'H'
        expect(bytes[6]).toBe(87);  // 'W'
        expect(bytes[10]).toBe(100); // 'd'
    });

    it('should round-trip correctly using btoa', function ()
    {
        var original = 'Phaser';
        var encoded = btoa(original);
        var result = Base64ToArrayBuffer(encoded);
        var bytes = new Uint8Array(result);
        var decoded = '';
        for (var i = 0; i < bytes.length; i++)
        {
            decoded += String.fromCharCode(bytes[i]);
        }
        expect(decoded).toBe(original);
    });
});
