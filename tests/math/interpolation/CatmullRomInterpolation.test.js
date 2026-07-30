var CatmullRomInterpolation = require('../../../src/math/interpolation/CatmullRomInterpolation');

describe('Phaser.Math.Interpolation.CatmullRom', function ()
{
    it('should return the first value when k is 0', function ()
    {
        var v = [0, 1, 2, 3];
        expect(CatmullRomInterpolation(v, 0)).toBeCloseTo(0, 5);
    });

    it('should return the last value when k is 1', function ()
    {
        var v = [0, 1, 2, 3];
        expect(CatmullRomInterpolation(v, 1)).toBeCloseTo(3, 5);
    });

    it('should return a midpoint value when k is 0.5', function ()
    {
        var v = [0, 1, 2, 3];
        var result = CatmullRomInterpolation(v, 0.5);
        expect(result).toBeCloseTo(1.5, 5);
    });

    it('should interpolate smoothly through all control points', function ()
    {
        var v = [0, 10, 20, 30];
        var prev = CatmullRomInterpolation(v, 0);
        for (var i = 1; i <= 10; i++)
        {
            var curr = CatmullRomInterpolation(v, i / 10);
            expect(curr).toBeGreaterThan(prev - 0.001);
            prev = curr;
        }
    });

    it('should handle a two-element open array', function ()
    {
        var v = [0, 10];
        var result = CatmullRomInterpolation(v, 0.5);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should handle identical values in the array', function ()
    {
        var v = [5, 5, 5, 5];
        expect(CatmullRomInterpolation(v, 0)).toBeCloseTo(5, 5);
        expect(CatmullRomInterpolation(v, 0.5)).toBeCloseTo(5, 5);
        expect(CatmullRomInterpolation(v, 1)).toBeCloseTo(5, 5);
    });

    it('should treat the curve as closed when first and last values are equal', function ()
    {
        var v = [0, 5, 10, 0];
        var atStart = CatmullRomInterpolation(v, 0);
        var atEnd = CatmullRomInterpolation(v, 1);
        expect(atStart).toBeCloseTo(atEnd, 5);
    });

    it('should wrap seamlessly on a closed curve with k slightly above 1', function ()
    {
        var v = [0, 5, 10, 0];
        var result = CatmullRomInterpolation(v, 1.1);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should wrap seamlessly on a closed curve with k slightly below 0', function ()
    {
        var v = [0, 5, 10, 0];
        var result = CatmullRomInterpolation(v, -0.1);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should extrapolate below start for open curve when k is negative', function ()
    {
        var v = [0, 10, 20, 30];
        var result = CatmullRomInterpolation(v, -0.1);
        expect(result).toBeLessThan(0);
    });

    it('should extrapolate beyond end for open curve when k is greater than 1', function ()
    {
        var v = [0, 10, 20, 30];
        var result = CatmullRomInterpolation(v, 1.1);
        expect(result).toBeGreaterThan(30);
    });

    it('should return a number for all k values in range on a large array', function ()
    {
        var v = [0, 2, 8, 3, 7, 5, 1, 9, 4, 6];
        for (var i = 0; i <= 10; i++)
        {
            var result = CatmullRomInterpolation(v, i / 10);
            expect(typeof result).toBe('number');
            expect(isNaN(result)).toBe(false);
        }
    });

    it('should pass through each control point at the correct k value for a uniform open curve', function ()
    {
        var v = [0, 10, 20, 30];
        var m = v.length - 1;
        for (var i = 0; i <= m; i++)
        {
            var k = i / m;
            var result = CatmullRomInterpolation(v, k);
            expect(result).toBeCloseTo(v[i], 4);
        }
    });

    it('should handle negative control point values', function ()
    {
        var v = [-30, -20, -10, 0];
        expect(CatmullRomInterpolation(v, 0)).toBeCloseTo(-30, 5);
        expect(CatmullRomInterpolation(v, 1)).toBeCloseTo(0, 5);
        var mid = CatmullRomInterpolation(v, 0.5);
        expect(mid).toBeLessThan(0);
        expect(mid).toBeGreaterThan(-30);
    });

    it('should handle floating point control point values', function ()
    {
        var v = [0.1, 0.4, 0.7, 1.0];
        var result = CatmullRomInterpolation(v, 0.5);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should handle a single-segment array (two points)', function ()
    {
        var v = [0, 100];
        expect(CatmullRomInterpolation(v, 0)).toBeCloseTo(0, 5);
        expect(CatmullRomInterpolation(v, 1)).toBeCloseTo(100, 5);
    });
});
