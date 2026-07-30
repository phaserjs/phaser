var HexStringToColor = require('../../../src/display/color/HexStringToColor');

describe('Phaser.Display.Color.HexStringToColor', function ()
{
    it('should return a Color object', function ()
    {
        var result = HexStringToColor('#0033ff');
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
    });

    it('should parse a full hex string with hash prefix', function ()
    {
        var result = HexStringToColor('#0033ff');
        expect(result.red).toBe(0);
        expect(result.green).toBe(51);
        expect(result.blue).toBe(255);
    });

    it('should parse a full hex string with 0x prefix', function ()
    {
        var result = HexStringToColor('0x0033ff');
        expect(result.red).toBe(0);
        expect(result.green).toBe(51);
        expect(result.blue).toBe(255);
    });

    it('should parse a full hex string with no prefix', function ()
    {
        var result = HexStringToColor('0033ff');
        expect(result.red).toBe(0);
        expect(result.green).toBe(51);
        expect(result.blue).toBe(255);
    });

    it('should expand shorthand hex with hash prefix', function ()
    {
        var result = HexStringToColor('#03f');
        expect(result.red).toBe(0);
        expect(result.green).toBe(51);
        expect(result.blue).toBe(255);
    });

    it('should expand shorthand hex with 0x prefix', function ()
    {
        var result = HexStringToColor('0x03f');
        expect(result.red).toBe(0);
        expect(result.green).toBe(51);
        expect(result.blue).toBe(255);
    });

    it('should expand shorthand hex with no prefix', function ()
    {
        var result = HexStringToColor('03f');
        expect(result.red).toBe(0);
        expect(result.green).toBe(51);
        expect(result.blue).toBe(255);
    });

    it('should parse uppercase hex strings', function ()
    {
        var result = HexStringToColor('#FF8800');
        expect(result.red).toBe(255);
        expect(result.green).toBe(136);
        expect(result.blue).toBe(0);
    });

    it('should parse mixed case hex strings', function ()
    {
        var result = HexStringToColor('#fF8800');
        expect(result.red).toBe(255);
        expect(result.green).toBe(136);
        expect(result.blue).toBe(0);
    });

    it('should parse black (#000000)', function ()
    {
        var result = HexStringToColor('#000000');
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });

    it('should parse white (#ffffff)', function ()
    {
        var result = HexStringToColor('#ffffff');
        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
    });

    it('should parse shorthand black (#000)', function ()
    {
        var result = HexStringToColor('#000');
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });

    it('should parse shorthand white (#fff)', function ()
    {
        var result = HexStringToColor('#fff');
        expect(result.red).toBe(255);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(255);
    });

    it('should parse red (#ff0000)', function ()
    {
        var result = HexStringToColor('#ff0000');
        expect(result.red).toBe(255);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(0);
    });

    it('should parse green (#00ff00)', function ()
    {
        var result = HexStringToColor('#00ff00');
        expect(result.red).toBe(0);
        expect(result.green).toBe(255);
        expect(result.blue).toBe(0);
    });

    it('should parse blue (#0000ff)', function ()
    {
        var result = HexStringToColor('#0000ff');
        expect(result.red).toBe(0);
        expect(result.green).toBe(0);
        expect(result.blue).toBe(255);
    });

    it('should populate the provided color object', function ()
    {
        var Color = require('../../../src/display/color/Color');
        var color = new Color();
        var result = HexStringToColor('#ff8800', color);
        expect(result).toBe(color);
        expect(color.red).toBe(255);
        expect(color.green).toBe(136);
        expect(color.blue).toBe(0);
    });

    it('should return a new color object when none is provided', function ()
    {
        var result1 = HexStringToColor('#ff0000');
        var result2 = HexStringToColor('#ff0000');
        expect(result1).not.toBe(result2);
    });

    it('should set alpha to 255 on the returned color', function ()
    {
        var result = HexStringToColor('#0033ff');
        expect(result.alpha).toBe(255);
    });

    it('should return the color object even for an invalid hex string', function ()
    {
        var result = HexStringToColor('invalid');
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
    });
});
