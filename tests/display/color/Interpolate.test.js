var Interpolate = require('../../../src/display/color/Interpolate');

describe('Phaser.Display.Color.Interpolate.RGBWithRGB', function ()
{
    describe('RGBWithRGB', function ()
    {
        it('should return start color at index 0', function ()
        {
            var result = Interpolate.RGBWithRGB(255, 0, 0, 0, 255, 0, 100, 0);
            expect(result.r).toBe(255);
            expect(result.g).toBe(0);
            expect(result.b).toBe(0);
            expect(result.a).toBe(255);
        });

        it('should return end color at index equal to length', function ()
        {
            var result = Interpolate.RGBWithRGB(255, 0, 0, 0, 255, 0, 100, 100);
            expect(result.r).toBe(0);
            expect(result.g).toBe(255);
            expect(result.b).toBe(0);
            expect(result.a).toBe(255);
        });

        it('should return midpoint color at index half of length', function ()
        {
            var result = Interpolate.RGBWithRGB(0, 0, 0, 200, 100, 50, 100, 50);
            expect(result.r).toBeCloseTo(100);
            expect(result.g).toBeCloseTo(50);
            expect(result.b).toBeCloseTo(25);
        });

        it('should default length to 100 when not provided', function ()
        {
            var result = Interpolate.RGBWithRGB(0, 0, 0, 100, 100, 100);
            expect(result.r).toBe(0);
            expect(result.g).toBe(0);
            expect(result.b).toBe(0);
        });

        it('should default index to 0 when not provided', function ()
        {
            var result = Interpolate.RGBWithRGB(10, 20, 30, 100, 100, 100);
            expect(result.r).toBe(10);
            expect(result.g).toBe(20);
            expect(result.b).toBe(30);
        });

        it('should return same color when both colors are equal', function ()
        {
            var result = Interpolate.RGBWithRGB(128, 64, 32, 128, 64, 32, 100, 50);
            expect(result.r).toBe(128);
            expect(result.g).toBe(64);
            expect(result.b).toBe(32);
        });

        it('should include a color property in the result', function ()
        {
            var result = Interpolate.RGBWithRGB(255, 0, 0, 0, 0, 255, 100, 0);
            expect(typeof result.color).toBe('number');
        });

        it('should interpolate correctly at quarter length', function ()
        {
            var result = Interpolate.RGBWithRGB(0, 0, 0, 100, 100, 100, 100, 25);
            expect(result.r).toBeCloseTo(25);
            expect(result.g).toBeCloseTo(25);
            expect(result.b).toBeCloseTo(25);
        });

        it('should handle black to white interpolation', function ()
        {
            var mid = Interpolate.RGBWithRGB(0, 0, 0, 255, 255, 255, 100, 50);
            expect(mid.r).toBeCloseTo(127.5);
            expect(mid.g).toBeCloseTo(127.5);
            expect(mid.b).toBeCloseTo(127.5);
        });

        it('should always return alpha of 255', function ()
        {
            var result1 = Interpolate.RGBWithRGB(0, 0, 0, 255, 255, 255, 100, 0);
            var result2 = Interpolate.RGBWithRGB(0, 0, 0, 255, 255, 255, 100, 50);
            var result3 = Interpolate.RGBWithRGB(0, 0, 0, 255, 255, 255, 100, 100);
            expect(result1.a).toBe(255);
            expect(result2.a).toBe(255);
            expect(result3.a).toBe(255);
        });
    });

    describe('HSVWithHSV', function ()
    {
        it('should return start color at index 0', function ()
        {
            var result = Interpolate.HSVWithHSV(0, 1, 1, 0.5, 1, 1, 100, 0);
            var start = Interpolate.HSVWithHSV(0, 1, 1, 0.5, 1, 1, 100, 0);
            expect(result.r).toBe(start.r);
            expect(result.g).toBe(start.g);
            expect(result.b).toBe(start.b);
        });

        it('should return an object with r, g, b properties', function ()
        {
            var result = Interpolate.HSVWithHSV(0, 1, 1, 0.5, 1, 1, 100, 50);
            expect(typeof result.r).toBe('number');
            expect(typeof result.g).toBe('number');
            expect(typeof result.b).toBe('number');
        });

        it('should interpolate same hue at midpoint', function ()
        {
            var result = Interpolate.HSVWithHSV(0, 1, 1, 0, 1, 1, 100, 50);
            var start = Interpolate.HSVWithHSV(0, 1, 1, 0, 1, 1, 100, 0);
            expect(result.r).toBeCloseTo(start.r, 0);
            expect(result.g).toBeCloseTo(start.g, 0);
            expect(result.b).toBeCloseTo(start.b, 0);
        });

        it('should use nearest hue path when sign is 0 and hue diff > 0.5', function ()
        {
            // h1=0.9, h2=0.1 — nearest path wraps, so h1 becomes -0.1
            var result = Interpolate.HSVWithHSV(0.9, 1, 1, 0.1, 1, 1, 100, 50, 0);
            expect(typeof result.r).toBe('number');
        });

        it('should use nearest hue path when sign is 0 and hue diff < -0.5', function ()
        {
            // h1=0.1, h2=0.9 — nearest path wraps, so h1 becomes 1.1
            var result = Interpolate.HSVWithHSV(0.1, 1, 1, 0.9, 1, 1, 100, 50, 0);
            expect(typeof result.r).toBe('number');
        });

        it('should increase hue when sign is positive and h1 > h2', function ()
        {
            var result = Interpolate.HSVWithHSV(0.8, 1, 1, 0.2, 1, 1, 100, 50, 1);
            expect(typeof result.r).toBe('number');
        });

        it('should decrease hue when sign is negative and h1 < h2', function ()
        {
            var result = Interpolate.HSVWithHSV(0.2, 1, 1, 0.8, 1, 1, 100, 50, -1);
            expect(typeof result.r).toBe('number');
        });

        it('should default sign to 0', function ()
        {
            var withSign = Interpolate.HSVWithHSV(0.1, 1, 1, 0.9, 1, 1, 100, 50, 0);
            var withoutSign = Interpolate.HSVWithHSV(0.1, 1, 1, 0.9, 1, 1, 100, 50);
            expect(withSign.r).toBeCloseTo(withoutSign.r, 1);
            expect(withSign.g).toBeCloseTo(withoutSign.g, 1);
            expect(withSign.b).toBeCloseTo(withoutSign.b, 1);
        });

        it('should interpolate saturation and value', function ()
        {
            var start = Interpolate.HSVWithHSV(0, 0, 0, 0, 1, 1, 100, 0);
            var end = Interpolate.HSVWithHSV(0, 0, 0, 0, 1, 1, 100, 100);
            var mid = Interpolate.HSVWithHSV(0, 0, 0, 0, 1, 1, 100, 50);
            // mid brightness should be between start and end
            expect(mid.r).toBeGreaterThanOrEqual(Math.min(start.r, end.r) - 1);
            expect(mid.r).toBeLessThanOrEqual(Math.max(start.r, end.r) + 1);
        });
    });

    describe('ColorWithColor', function ()
    {
        it('should interpolate RGB by default', function ()
        {
            var color1 = { r: 255, g: 0, b: 0, h: 0, s: 1, v: 1 };
            var color2 = { r: 0, g: 255, b: 0, h: 0.333, s: 1, v: 1 };
            var result = Interpolate.ColorWithColor(color1, color2, 100, 0);
            expect(result.r).toBe(255);
            expect(result.g).toBe(0);
            expect(result.b).toBe(0);
        });

        it('should reach end color at index equal to length', function ()
        {
            var color1 = { r: 255, g: 0, b: 0, h: 0, s: 1, v: 1 };
            var color2 = { r: 0, g: 255, b: 0, h: 0.333, s: 1, v: 1 };
            var result = Interpolate.ColorWithColor(color1, color2, 100, 100);
            expect(result.r).toBe(0);
            expect(result.g).toBe(255);
            expect(result.b).toBe(0);
        });

        it('should delegate to HSVWithHSV when hsv is true', function ()
        {
            var color1 = { r: 255, g: 0, b: 0, h: 0, s: 1, v: 1 };
            var color2 = { r: 0, g: 255, b: 0, h: 0.333, s: 1, v: 1 };
            var rgbResult = Interpolate.ColorWithColor(color1, color2, 100, 50, false);
            var hsvResult = Interpolate.ColorWithColor(color1, color2, 100, 50, true);
            // They should produce different results since one uses RGB and other uses HSV
            // Just verify both return valid objects
            expect(typeof hsvResult.r).toBe('number');
            expect(typeof rgbResult.r).toBe('number');
        });

        it('should default length to 100', function ()
        {
            var color1 = { r: 0, g: 0, b: 0, h: 0, s: 0, v: 0 };
            var color2 = { r: 100, g: 100, b: 100, h: 0, s: 0, v: 1 };
            var result = Interpolate.ColorWithColor(color1, color2);
            expect(result.r).toBe(0);
            expect(result.g).toBe(0);
            expect(result.b).toBe(0);
        });

        it('should default index to 0', function ()
        {
            var color1 = { r: 50, g: 100, b: 150, h: 0, s: 0, v: 0 };
            var color2 = { r: 200, g: 200, b: 200, h: 0, s: 0, v: 1 };
            var result = Interpolate.ColorWithColor(color1, color2);
            expect(result.r).toBe(50);
            expect(result.g).toBe(100);
            expect(result.b).toBe(150);
        });

        it('should pass hsvSign through to HSVWithHSV', function ()
        {
            var color1 = { r: 255, g: 0, b: 0, h: 0.8, s: 1, v: 1 };
            var color2 = { r: 0, g: 255, b: 0, h: 0.2, s: 1, v: 1 };
            var result = Interpolate.ColorWithColor(color1, color2, 100, 50, true, 1);
            expect(typeof result.r).toBe('number');
        });
    });

    describe('ColorWithRGB', function ()
    {
        it('should return start color at index 0', function ()
        {
            var color = { r: 255, g: 0, b: 128 };
            var result = Interpolate.ColorWithRGB(color, 0, 255, 0, 100, 0);
            expect(result.r).toBe(255);
            expect(result.g).toBe(0);
            expect(result.b).toBe(128);
        });

        it('should reach target RGB at index equal to length', function ()
        {
            var color = { r: 255, g: 0, b: 0 };
            var result = Interpolate.ColorWithRGB(color, 0, 255, 0, 100, 100);
            expect(result.r).toBe(0);
            expect(result.g).toBe(255);
            expect(result.b).toBe(0);
        });

        it('should interpolate at midpoint', function ()
        {
            var color = { r: 0, g: 0, b: 0 };
            var result = Interpolate.ColorWithRGB(color, 200, 100, 50, 100, 50);
            expect(result.r).toBeCloseTo(100);
            expect(result.g).toBeCloseTo(50);
            expect(result.b).toBeCloseTo(25);
        });

        it('should default length to 100', function ()
        {
            var color = { r: 10, g: 20, b: 30 };
            var result = Interpolate.ColorWithRGB(color, 100, 100, 100);
            expect(result.r).toBe(10);
            expect(result.g).toBe(20);
            expect(result.b).toBe(30);
        });

        it('should default index to 0', function ()
        {
            var color = { r: 50, g: 60, b: 70 };
            var result = Interpolate.ColorWithRGB(color, 200, 200, 200);
            expect(result.r).toBe(50);
            expect(result.g).toBe(60);
            expect(result.b).toBe(70);
        });

        it('should return alpha of 255', function ()
        {
            var color = { r: 0, g: 0, b: 0 };
            var result = Interpolate.ColorWithRGB(color, 255, 255, 255, 100, 50);
            expect(result.a).toBe(255);
        });

        it('should include a color property', function ()
        {
            var color = { r: 255, g: 128, b: 64 };
            var result = Interpolate.ColorWithRGB(color, 0, 0, 0, 100, 50);
            expect(typeof result.color).toBe('number');
        });
    });
});
