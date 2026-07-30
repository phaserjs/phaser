var RGBStringToColor = require('../../../src/display/color/RGBStringToColor');
var Color = require('../../../src/display/color/Color');

describe('Phaser.Display.Color.RGBStringToColor', function ()
{
    it('should return a Color object', function ()
    {
        var result = RGBStringToColor('rgb(255, 0, 0)');
        expect(result).toBeInstanceOf(Color);
    });

    it('should parse a basic rgb string', function ()
    {
        var result = RGBStringToColor('rgb(255, 0, 0)');
        expect(result.red).toBe(255);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });

    it('should parse an rgb string with green channel', function ()
    {
        var result = RGBStringToColor('rgb(0, 128, 0)');
        expect(result.red).toBe(0);
        expect(result.green).toBe(128);
        expect(result.blue).toBe(0);
    });

    it('should parse an rgb string with blue channel', function ()
    {
        var result = RGBStringToColor('rgb(0, 0, 255)');
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(255);
    });

    it('should parse an rgba string with alpha of 1', function ()
    {
        var result = RGBStringToColor('rgba(100, 150, 200, 1)');
        expect(result.red).toBe(100);
        expect(result.green).toBe(150);
        expect(result.blue).toBe(200);
        expect(result.alpha).toBe(255);
    });

    it('should parse an rgba string with alpha of 0', function ()
    {
        var result = RGBStringToColor('rgba(100, 150, 200, 0)');
        expect(result.red).toBe(100);
        expect(result.green).toBe(150);
        expect(result.blue).toBe(200);
        expect(result.alpha).toBe(0);
    });

    it('should parse an rgba string with fractional alpha', function ()
    {
        var result = RGBStringToColor('rgba(100, 150, 200, 0.5)');
        expect(result.red).toBe(100);
        expect(result.green).toBe(150);
        expect(result.blue).toBe(200);
        expect(result.alpha).toBe(127);
    });

    it('should default alpha to 255 when using rgb format', function ()
    {
        var result = RGBStringToColor('rgb(10, 20, 30)');
        expect(result.alpha).toBe(255);
    });

    it('should accept an existing Color object and populate it', function ()
    {
        var color = new Color();
        var result = RGBStringToColor('rgb(10, 20, 30)', color);
        expect(result).toBe(color);
        expect(color.red).toBe(10);
        expect(color.green).toBe(20);
        expect(color.blue).toBe(30);
    });

    it('should return the passed Color object unmodified when string is invalid', function ()
    {
        var color = new Color(5, 10, 15);
        var result = RGBStringToColor('not-a-color', color);
        expect(result).toBe(color);
        expect(color.red).toBe(5);
        expect(color.green).toBe(10);
        expect(color.blue).toBe(15);
    });

    it('should return a new Color object unmodified when string is invalid and no color passed', function ()
    {
        var result = RGBStringToColor('invalid');
        expect(result).toBeInstanceOf(Color);
    });

    it('should handle rgb strings with no spaces', function ()
    {
        var result = RGBStringToColor('rgb(1,2,3)');
        expect(result.red).toBe(1);
        expect(result.green).toBe(2);
        expect(result.blue).toBe(3);
    });

    it('should handle rgb strings with extra spaces', function ()
    {
        var result = RGBStringToColor('rgb( 10 , 20 , 30 )');
        expect(result.red).toBe(10);
        expect(result.green).toBe(20);
        expect(result.blue).toBe(30);
    });

    it('should handle uppercase RGB input by lowercasing it', function ()
    {
        var result = RGBStringToColor('RGB(255, 128, 64)');
        expect(result.red).toBe(255);
        expect(result.green).toBe(128);
        expect(result.blue).toBe(64);
    });

    it('should handle uppercase RGBA input by lowercasing it', function ()
    {
        var result = RGBStringToColor('RGBA(255, 128, 64, 0.5)');
        expect(result.red).toBe(255);
        expect(result.green).toBe(128);
        expect(result.blue).toBe(64);
        expect(result.alpha).toBe(127);
    });

    it('should parse black', function ()
    {
        var result = RGBStringToColor('rgb(0, 0, 0)');
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });

    it('should parse white', function ()
    {
        var result = RGBStringToColor('rgb(255, 255, 255)');
        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
    });

    it('should parse rgba with alpha 0.75', function ()
    {
        var result = RGBStringToColor('rgba(0, 0, 0, 0.75)');
        expect(result.alpha).toBe(191);
    });

    it('should not parse a hex color string', function ()
    {
        var result = RGBStringToColor('#ff0000');
        expect(result).toBeInstanceOf(Color);
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });
});
