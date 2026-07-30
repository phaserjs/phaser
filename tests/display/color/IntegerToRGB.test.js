var IntegerToRGB = require('../../../src/display/color/IntegerToRGB');

describe('Phaser.Display.Color.IntegerToRGB', function ()
{
    it('should return an object with a, r, g, b properties', function ()
    {
        var result = IntegerToRGB(0x000000);
        expect(result).toHaveProperty('a');
        expect(result).toHaveProperty('r');
        expect(result).toHaveProperty('g');
        expect(result).toHaveProperty('b');
    });

    it('should default alpha to 255 for values without an alpha component', function ()
    {
        var result = IntegerToRGB(0xFF0000);
        expect(result.a).toBe(255);
    });

    it('should extract red, green, blue from a 24-bit color', function ()
    {
        var result = IntegerToRGB(0xFF0000);
        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should extract green channel correctly', function ()
    {
        var result = IntegerToRGB(0x00FF00);
        expect(result.r).toBe(0);
        expect(result.g).toBe(255);
        expect(result.b).toBe(0);
    });

    it('should extract blue channel correctly', function ()
    {
        var result = IntegerToRGB(0x0000FF);
        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(255);
    });

    it('should extract all channels from a mixed 24-bit color', function ()
    {
        var result = IntegerToRGB(0x112233);
        expect(result.a).toBe(255);
        expect(result.r).toBe(0x11);
        expect(result.g).toBe(0x22);
        expect(result.b).toBe(0x33);
    });

    it('should return all zeros for black (0x000000)', function ()
    {
        var result = IntegerToRGB(0x000000);
        expect(result.a).toBe(255);
        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should return 255 for all channels for white (0xFFFFFF)', function ()
    {
        var result = IntegerToRGB(0xFFFFFF);
        expect(result.a).toBe(255);
        expect(result.r).toBe(255);
        expect(result.g).toBe(255);
        expect(result.b).toBe(255);
    });

    it('should extract alpha when color value exceeds 0xFFFFFF', function ()
    {
        var result = IntegerToRGB(0xAAFF0000);
        expect(result.a).toBe(0xAA);
        expect(result.r).toBe(0xFF);
        expect(result.g).toBe(0x00);
        expect(result.b).toBe(0x00);
    });

    it('should extract all four channels from a 32-bit ARGB color', function ()
    {
        var result = IntegerToRGB(0xFF112233);
        expect(result.a).toBe(0xFF);
        expect(result.r).toBe(0x11);
        expect(result.g).toBe(0x22);
        expect(result.b).toBe(0x33);
    });

    it('should extract zero alpha from a 32-bit color with alpha 0', function ()
    {
        var result = IntegerToRGB(0x00FF8040);
        // 0x00FF8040 = 16744512 which is <= 16777215, so no alpha component
        expect(result.a).toBe(255);
        expect(result.r).toBe(0xFF);
        expect(result.g).toBe(0x80);
        expect(result.b).toBe(0x40);
    });

    it('should handle the boundary value 16777215 (0xFFFFFF) as a 24-bit color', function ()
    {
        var result = IntegerToRGB(16777215);
        expect(result.a).toBe(255);
        expect(result.r).toBe(255);
        expect(result.g).toBe(255);
        expect(result.b).toBe(255);
    });

    it('should handle the boundary value 16777216 (0x1000000) as a 32-bit color', function ()
    {
        var result = IntegerToRGB(16777216);
        expect(result.a).toBe(1);
        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should handle a mid-alpha 32-bit color', function ()
    {
        var result = IntegerToRGB(0x80AABBCC);
        expect(result.a).toBe(0x80);
        expect(result.r).toBe(0xAA);
        expect(result.g).toBe(0xBB);
        expect(result.b).toBe(0xCC);
    });
});
