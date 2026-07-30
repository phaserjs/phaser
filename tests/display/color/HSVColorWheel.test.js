var HSVColorWheel = require('../../../src/display/color/HSVColorWheel');

describe('Phaser.Display.Color.HSVColorWheel', function ()
{
    it('should return an array of 360 elements', function ()
    {
        var result = HSVColorWheel();
        expect(result.length).toBe(360);
    });

    it('should return an array with default saturation and value of 1', function ()
    {
        var result = HSVColorWheel();
        expect(result.length).toBe(360);
    });

    it('should return ColorObject elements with r, g, b properties', function ()
    {
        var result = HSVColorWheel();
        var color = result[0];
        expect(color).toHaveProperty('r');
        expect(color).toHaveProperty('g');
        expect(color).toHaveProperty('b');
    });

    it('should have all r, g, b values in the range 0 to 255', function ()
    {
        var result = HSVColorWheel();
        for (var i = 0; i < result.length; i++)
        {
            var color = result[i];
            expect(color.r).toBeGreaterThanOrEqual(0);
            expect(color.r).toBeLessThanOrEqual(255);
            expect(color.g).toBeGreaterThanOrEqual(0);
            expect(color.g).toBeLessThanOrEqual(255);
            expect(color.b).toBeGreaterThanOrEqual(0);
            expect(color.b).toBeLessThanOrEqual(255);
        }
    });

    it('should use default saturation of 1 when s is undefined', function ()
    {
        var defaultResult = HSVColorWheel();
        var explicitResult = HSVColorWheel(1, 1);
        for (var i = 0; i < 360; i++)
        {
            expect(defaultResult[i].r).toBe(explicitResult[i].r);
            expect(defaultResult[i].g).toBe(explicitResult[i].g);
            expect(defaultResult[i].b).toBe(explicitResult[i].b);
        }
    });

    it('should use default value of 1 when v is undefined', function ()
    {
        var defaultResult = HSVColorWheel(0.5);
        var explicitResult = HSVColorWheel(0.5, 1);
        for (var i = 0; i < 360; i++)
        {
            expect(defaultResult[i].r).toBe(explicitResult[i].r);
            expect(defaultResult[i].g).toBe(explicitResult[i].g);
            expect(defaultResult[i].b).toBe(explicitResult[i].b);
        }
    });

    it('should produce a greyscale wheel when saturation is 0', function ()
    {
        var result = HSVColorWheel(0, 1);
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].r).toBe(result[i].g);
            expect(result[i].g).toBe(result[i].b);
        }
    });

    it('should produce all black when value is 0', function ()
    {
        var result = HSVColorWheel(1, 0);
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].r).toBe(0);
            expect(result[i].g).toBe(0);
            expect(result[i].b).toBe(0);
        }
    });

    it('should produce different colors across the wheel at full saturation and value', function ()
    {
        var result = HSVColorWheel(1, 1);
        var allSame = true;
        var first = result[0];
        for (var i = 1; i < result.length; i++)
        {
            if (result[i].r !== first.r || result[i].g !== first.g || result[i].b !== first.b)
            {
                allSame = false;
                break;
            }
        }
        expect(allSame).toBe(false);
    });

    it('should produce pure red at index 0 (hue = 0) with full saturation and value', function ()
    {
        var result = HSVColorWheel(1, 1);
        expect(result[0].r).toBe(255);
        expect(result[0].g).toBe(0);
        expect(result[0].b).toBe(0);
    });

    it('should accept custom saturation and value parameters', function ()
    {
        var result = HSVColorWheel(0.5, 0.5);
        expect(result.length).toBe(360);
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].r).toBeGreaterThanOrEqual(0);
            expect(result[i].r).toBeLessThanOrEqual(255);
        }
    });

    it('should return integer or near-integer rgb values', function ()
    {
        var result = HSVColorWheel(1, 1);
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].r % 1).toBeCloseTo(0);
            expect(result[i].g % 1).toBeCloseTo(0);
            expect(result[i].b % 1).toBeCloseTo(0);
        }
    });

    it('should produce lower brightness colors when value is reduced', function ()
    {
        var full = HSVColorWheel(1, 1);
        var half = HSVColorWheel(1, 0.5);
        var fullMax = Math.max(full[0].r, full[0].g, full[0].b);
        var halfMax = Math.max(half[0].r, half[0].g, half[0].b);
        expect(halfMax).toBeLessThan(fullMax);
    });
});
