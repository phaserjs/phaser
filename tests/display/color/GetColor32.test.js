var GetColor32 = require('../../../src/display/color/GetColor32');

describe('Phaser.Display.Color.GetColor32', function ()
{
    it('should return zero when all components are zero', function ()
    {
        expect(GetColor32(0, 0, 0, 0)).toBe(0);
    });

    it('should pack all components into a single 32-bit integer', function ()
    {
        expect(GetColor32(255, 255, 255, 255)).toBe(0xFFFFFFFF);
    });

    it('should correctly position the alpha component in bits 24-31', function ()
    {
        expect(GetColor32(0, 0, 0, 255)).toBe((255 << 24) >>> 0);
    });

    it('should correctly position the red component in bits 16-23', function ()
    {
        expect(GetColor32(255, 0, 0, 0)).toBe(255 << 16);
    });

    it('should correctly position the green component in bits 8-15', function ()
    {
        expect(GetColor32(0, 255, 0, 0)).toBe(255 << 8);
    });

    it('should correctly position the blue component in bits 0-7', function ()
    {
        expect(GetColor32(0, 0, 255, 0)).toBe(255);
    });

    it('should pack a typical RGBA color correctly', function ()
    {
        // red=255, green=128, blue=64, alpha=200
        var expected = ((200 << 24) | (255 << 16) | (128 << 8) | 64) >>> 0;
        expect(GetColor32(255, 128, 64, 200)).toBe(expected);
    });

    it('should handle alpha=255 (fully opaque)', function ()
    {
        var expected = ((255 << 24) | (100 << 16) | (150 << 8) | 200) >>> 0;
        expect(GetColor32(100, 150, 200, 255)).toBe(expected);
    });

    it('should handle alpha=0 (fully transparent)', function ()
    {
        var expected = (0 << 24) | (100 << 16) | (150 << 8) | 200;
        expect(GetColor32(100, 150, 200, 0)).toBe(expected);
    });

    it('should handle mid-range values for all components', function ()
    {
        var expected = ((128 << 24) | (128 << 16) | (128 << 8) | 128) >>> 0;
        expect(GetColor32(128, 128, 128, 128)).toBe(expected);
    });

    it('should handle value of 1 for each component independently', function ()
    {
        expect(GetColor32(1, 0, 0, 0)).toBe(1 << 16);
        expect(GetColor32(0, 1, 0, 0)).toBe(1 << 8);
        expect(GetColor32(0, 0, 1, 0)).toBe(1);
        expect(GetColor32(0, 0, 0, 1)).toBe(1 << 24);
    });

    it('should return a number type', function ()
    {
        expect(typeof GetColor32(255, 128, 64, 200)).toBe('number');
    });

    it('should handle pure red with full alpha', function ()
    {
        var expected = ((255 << 24) | (255 << 16) | (0 << 8) | 0) >>> 0;
        expect(GetColor32(255, 0, 0, 255)).toBe(expected);
    });

    it('should handle pure green with full alpha', function ()
    {
        var expected = ((255 << 24) | (0 << 16) | (255 << 8) | 0) >>> 0;
        expect(GetColor32(0, 255, 0, 255)).toBe(expected);
    });

    it('should handle pure blue with full alpha', function ()
    {
        var expected = ((255 << 24) | (0 << 16) | (0 << 8) | 255) >>> 0;
        expect(GetColor32(0, 0, 255, 255)).toBe(expected);
    });

    it('should never return a negative value for any alpha (issue #7305)', function ()
    {
        for (var alpha = 0; alpha <= 255; alpha++)
        {
            expect(GetColor32(255, 255, 255, alpha)).toBeGreaterThanOrEqual(0);
        }
    });

    it('should round-trip through IntegerToRGB when alpha is 128 or above (issue #7305)', function ()
    {
        var IntegerToRGB = require('../../../src/display/color/IntegerToRGB');

        [ 128, 200, 255 ].forEach(function (alpha)
        {
            var color32 = GetColor32(10, 20, 30, alpha);
            var rgb = IntegerToRGB(color32);

            expect(rgb.r).toBe(10);
            expect(rgb.g).toBe(20);
            expect(rgb.b).toBe(30);
            expect(rgb.a).toBe(alpha);
        });
    });

    it('should round-trip through ColorToRGBA when alpha is 128 or above (issue #7305)', function ()
    {
        var ColorToRGBA = require('../../../src/display/color/ColorToRGBA');

        [ 128, 200, 255 ].forEach(function (alpha)
        {
            var color32 = GetColor32(10, 20, 30, alpha);
            var rgba = ColorToRGBA(color32);

            expect(rgba.r).toBe(10);
            expect(rgba.g).toBe(20);
            expect(rgba.b).toBe(30);
            expect(rgba.a).toBe(alpha);
        });
    });
});
