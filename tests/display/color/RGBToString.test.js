var RGBToString = require('../../../src/display/color/RGBToString');

describe('Phaser.Display.Color.RGBToString', function ()
{
    it('should return a hex string with # prefix by default', function ()
    {
        var result = RGBToString(255, 0, 0);
        expect(result).toBe('#ff0000');
    });

    it('should return black with all zero components', function ()
    {
        expect(RGBToString(0, 0, 0)).toBe('#000000');
    });

    it('should return white with all max components', function ()
    {
        expect(RGBToString(255, 255, 255)).toBe('#ffffff');
    });

    it('should correctly encode green', function ()
    {
        expect(RGBToString(0, 255, 0)).toBe('#00ff00');
    });

    it('should correctly encode blue', function ()
    {
        expect(RGBToString(0, 0, 255)).toBe('#0000ff');
    });

    it('should correctly encode an arbitrary color', function ()
    {
        expect(RGBToString(18, 52, 86)).toBe('#123456');
    });

    it('should ignore the alpha value when using # prefix', function ()
    {
        expect(RGBToString(255, 0, 0, 128, '#')).toBe('#ff0000');
        expect(RGBToString(255, 0, 0, 0, '#')).toBe('#ff0000');
    });

    it('should use # prefix when explicitly passed', function ()
    {
        expect(RGBToString(171, 205, 239, 255, '#')).toBe('#abcdef');
    });

    it('should return an 0x prefixed ARGB string when prefix is 0x', function ()
    {
        var result = RGBToString(255, 0, 0, 255, '0x');
        expect(result).toBe('0xffff0000');
    });

    it('should include alpha as the most significant byte with 0x prefix', function ()
    {
        expect(RGBToString(0, 0, 0, 0, '0x')).toBe('0x00000000');
        expect(RGBToString(255, 255, 255, 255, '0x')).toBe('0xffffffff');
    });

    it('should correctly encode partial alpha with 0x prefix', function ()
    {
        expect(RGBToString(18, 52, 86, 120, '0x')).toBe('0x78123456');
    });

    it('should default alpha to 255 when not provided', function ()
    {
        var result = RGBToString(0, 0, 0, undefined, '0x');
        expect(result).toBe('0xff000000');
    });

    it('should pad single-digit hex components with a leading zero', function ()
    {
        expect(RGBToString(1, 2, 3)).toBe('#010203');
        expect(RGBToString(1, 2, 3, 4, '0x')).toBe('0x04010203');
    });

    it('should return a string of length 7 with # prefix', function ()
    {
        var result = RGBToString(100, 150, 200);
        expect(result.length).toBe(7);
        expect(result[0]).toBe('#');
    });

    it('should return a string of length 10 with 0x prefix', function ()
    {
        var result = RGBToString(100, 150, 200, 255, '0x');
        expect(result.length).toBe(10);
        expect(result.slice(0, 2)).toBe('0x');
    });
});
