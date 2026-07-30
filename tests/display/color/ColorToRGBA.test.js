var ColorToRGBA = require('../../../src/display/color/ColorToRGBA');

describe('Phaser.Display.Color.ColorToRGBA', function ()
{
    it('should return an object with r, g, b and a properties', function ()
    {
        var result = ColorToRGBA(0x000000);

        expect(result).toHaveProperty('r');
        expect(result).toHaveProperty('g');
        expect(result).toHaveProperty('b');
        expect(result).toHaveProperty('a');
    });

    it('should return all zeros with full alpha for black (0x000000)', function ()
    {
        var result = ColorToRGBA(0x000000);

        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
        expect(result.a).toBe(255);
    });

    it('should return 255 for each channel for white (0xFFFFFF)', function ()
    {
        var result = ColorToRGBA(0xFFFFFF);

        expect(result.r).toBe(255);
        expect(result.g).toBe(255);
        expect(result.b).toBe(255);
        expect(result.a).toBe(255);
    });

    it('should correctly extract the red channel', function ()
    {
        var result = ColorToRGBA(0xFF0000);

        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
        expect(result.a).toBe(255);
    });

    it('should correctly extract the green channel', function ()
    {
        var result = ColorToRGBA(0x00FF00);

        expect(result.r).toBe(0);
        expect(result.g).toBe(255);
        expect(result.b).toBe(0);
        expect(result.a).toBe(255);
    });

    it('should correctly extract the blue channel', function ()
    {
        var result = ColorToRGBA(0x0000FF);

        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(255);
        expect(result.a).toBe(255);
    });

    it('should default alpha to 255 for 24-bit colors at the boundary (0xFFFFFF)', function ()
    {
        var result = ColorToRGBA(16777215);

        expect(result.a).toBe(255);
    });

    it('should extract alpha from 32-bit ARGB color when value exceeds 0xFFFFFF', function ()
    {
        var result = ColorToRGBA(0xFF112233);

        expect(result.a).toBe(255);
        expect(result.r).toBe(0x11);
        expect(result.g).toBe(0x22);
        expect(result.b).toBe(0x33);
    });

    it('should extract partial alpha from 32-bit ARGB color', function ()
    {
        var result = ColorToRGBA(0x80FF0000);

        expect(result.a).toBe(128);
        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should return alpha of 1 for 0x00FFFFFF + 1 (= 0x01000000)', function ()
    {
        var result = ColorToRGBA(0x00FFFFFF + 1);

        expect(result.a).toBe(1);
        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should handle a mid-range 24-bit color correctly', function ()
    {
        var result = ColorToRGBA(0x7F8090);

        expect(result.r).toBe(0x7F);
        expect(result.g).toBe(0x80);
        expect(result.b).toBe(0x90);
        expect(result.a).toBe(255);
    });

    it('should handle a fully transparent 32-bit color (0x00000001)', function ()
    {
        var result = ColorToRGBA(0x01000000);

        expect(result.a).toBe(1);
        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should handle 0xAABBCCDD correctly', function ()
    {
        var result = ColorToRGBA(0xAABBCCDD);

        expect(result.a).toBe(0xAA);
        expect(result.r).toBe(0xBB);
        expect(result.g).toBe(0xCC);
        expect(result.b).toBe(0xDD);
    });

    it('should return a plain object, not a class instance', function ()
    {
        var result = ColorToRGBA(0xFF0000);

        expect(typeof result).toBe('object');
        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });
});
