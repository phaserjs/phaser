var GetColor = require('../../../src/display/color/GetColor');

describe('Phaser.Display.Color.GetColor', function ()
{
    it('should return 0 when all components are zero', function ()
    {
        expect(GetColor(0, 0, 0)).toBe(0x000000);
    });

    it('should return 0xFFFFFF when all components are 255', function ()
    {
        expect(GetColor(255, 255, 255)).toBe(0xFFFFFF);
    });

    it('should pack red correctly', function ()
    {
        expect(GetColor(255, 0, 0)).toBe(0xFF0000);
    });

    it('should pack green correctly', function ()
    {
        expect(GetColor(0, 255, 0)).toBe(0x00FF00);
    });

    it('should pack blue correctly', function ()
    {
        expect(GetColor(0, 0, 255)).toBe(0x0000FF);
    });

    it('should pack all three components into a single integer', function ()
    {
        expect(GetColor(0x12, 0x34, 0x56)).toBe(0x123456);
    });

    it('should return a 24-bit integer', function ()
    {
        var result = GetColor(255, 255, 255);
        expect(result).toBe(16777215);
    });

    it('should handle mid-range values correctly', function ()
    {
        expect(GetColor(128, 128, 128)).toBe(0x808080);
    });

    it('should handle mixed component values', function ()
    {
        expect(GetColor(255, 0, 128)).toBe(0xFF0080);
        expect(GetColor(0, 128, 255)).toBe(0x0080FF);
    });

    it('should return a number type', function ()
    {
        expect(typeof GetColor(100, 150, 200)).toBe('number');
    });
});
