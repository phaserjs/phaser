var IntegerToColor = require('../../../src/display/color/IntegerToColor');
var Color = require('../../../src/display/color/Color');

describe('Phaser.Display.Color.IntegerToColor', function ()
{
    it('should return a Color instance when no color object is provided', function ()
    {
        var result = IntegerToColor(0xff0000);

        expect(result).toBeInstanceOf(Color);
    });

    it('should convert red (0xff0000) correctly', function ()
    {
        var result = IntegerToColor(0xff0000);

        expect(result.red).toBe(255);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
        expect(result.alpha).toBe(255);
    });

    it('should convert green (0x00ff00) correctly', function ()
    {
        var result = IntegerToColor(0x00ff00);

        expect(result.red).toBe(0);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(0);
        expect(result.alpha).toBe(255);
    });

    it('should convert blue (0x0000ff) correctly', function ()
    {
        var result = IntegerToColor(0x0000ff);

        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(255);
        expect(result.alpha).toBe(255);
    });

    it('should convert white (0xffffff) correctly', function ()
    {
        var result = IntegerToColor(0xffffff);

        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
        expect(result.alpha).toBe(255);
    });

    it('should convert black (0x000000) correctly', function ()
    {
        var result = IntegerToColor(0x000000);

        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
        expect(result.alpha).toBe(255);
    });

    it('should extract alpha from a 32-bit color value (0xAARRGGBB)', function ()
    {
        var result = IntegerToColor(0x80ff0000);

        expect(result.red).toBe(255);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
        expect(result.alpha).toBe(128);
    });

    it('should handle fully transparent 32-bit color (alpha = 0)', function ()
    {
        //  0x00ffffff === 0xffffff (24-bit white), so IntegerToRGB treats it as 24-bit and alpha defaults to 255
        var result = IntegerToColor(0x00ffffff);

        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
        expect(result.alpha).toBe(255);
    });

    it('should handle fully opaque 32-bit color (alpha = 255)', function ()
    {
        var result = IntegerToColor(0xffffffff);

        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
        expect(result.alpha).toBe(255);
    });

    it('should populate the provided Color object instead of creating a new one', function ()
    {
        var color = new Color();
        var result = IntegerToColor(0x00ff00, color);

        expect(result).toBe(color);
        expect(result.red).toBe(0);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(0);
        expect(result.alpha).toBe(255);
    });

    it('should update an existing Color object with new values', function ()
    {
        var color = new Color(255, 0, 0, 255);

        IntegerToColor(0x0000ff, color);

        expect(color.red).toBe(0);
        expect(color.green).toBe(0);
        expect(color.blue).toBe(255);
        expect(color.alpha).toBe(255);
    });

    it('should update an existing Color object with 32-bit alpha value', function ()
    {
        var color = new Color();

        IntegerToColor(0x40102030, color);

        expect(color.red).toBe(0x10);
        expect(color.green).toBe(0x20);
        expect(color.blue).toBe(0x30);
        expect(color.alpha).toBe(0x40);
    });

    it('should handle a mid-range color correctly', function ()
    {
        var result = IntegerToColor(0x336699);

        expect(result.red).toBe(0x33);
        expect(result.green).toBe(0x66);
        expect(result.blue).toBe(0x99);
        expect(result.alpha).toBe(255);
    });

    it('should default alpha to 255 for 24-bit values', function ()
    {
        var result = IntegerToColor(0x123456);

        expect(result.alpha).toBe(255);
    });

    it('should return a Color instance when an existing Color is passed in', function ()
    {
        var color = new Color();
        var result = IntegerToColor(0xff0000, color);

        expect(result).toBeInstanceOf(Color);
    });
});
