var CatmullRom = require('../../src/math/CatmullRom');

describe('Phaser.Math.CatmullRom', function ()
{
    it('should return p1 when t is 0', function ()
    {
        expect(CatmullRom(0, 0, 5, 10, 15)).toBe(5);
        expect(CatmullRom(0, -5, 3, 8, 20)).toBe(3);
        expect(CatmullRom(0, 0, 0, 1, 2)).toBe(0);
    });

    it('should return p2 when t is 1', function ()
    {
        expect(CatmullRom(1, 0, 5, 10, 15)).toBe(10);
        expect(CatmullRom(1, -5, 3, 8, 20)).toBe(8);
        expect(CatmullRom(1, 0, 0, 1, 2)).toBe(1);
    });

    it('should return midpoint for symmetric uniform control points at t=0.5', function ()
    {
        // p0=0, p1=0, p2=1, p3=1 — symmetric, should give 0.5 at t=0.5
        expect(CatmullRom(0.5, 0, 0, 1, 1)).toBeCloseTo(0.5, 5);
    });

    it('should interpolate smoothly between p1 and p2 for evenly spaced points', function ()
    {
        // Evenly spaced: 0, 1, 2, 3 — should behave linearly
        expect(CatmullRom(0.25, 0, 1, 2, 3)).toBeCloseTo(1.25, 5);
        expect(CatmullRom(0.5, 0, 1, 2, 3)).toBeCloseTo(1.5, 5);
        expect(CatmullRom(0.75, 0, 1, 2, 3)).toBeCloseTo(1.75, 5);
    });

    it('should handle all control points equal to zero', function ()
    {
        expect(CatmullRom(0, 0, 0, 0, 0)).toBe(0);
        expect(CatmullRom(0.5, 0, 0, 0, 0)).toBe(0);
        expect(CatmullRom(1, 0, 0, 0, 0)).toBe(0);
    });

    it('should handle all control points equal to the same non-zero value', function ()
    {
        expect(CatmullRom(0, 5, 5, 5, 5)).toBe(5);
        expect(CatmullRom(0.5, 5, 5, 5, 5)).toBe(5);
        expect(CatmullRom(1, 5, 5, 5, 5)).toBe(5);
    });

    it('should handle negative control points', function ()
    {
        expect(CatmullRom(0, -10, -5, -1, 0)).toBeCloseTo(-5, 5);
        expect(CatmullRom(1, -10, -5, -1, 0)).toBeCloseTo(-1, 5);
    });

    it('should handle mixed positive and negative control points', function ()
    {
        expect(CatmullRom(0, -5, -2, 3, 6)).toBeCloseTo(-2, 5);
        expect(CatmullRom(1, -5, -2, 3, 6)).toBeCloseTo(3, 5);
    });

    it('should handle floating point control points', function ()
    {
        expect(CatmullRom(0, 0.1, 0.2, 0.3, 0.4)).toBeCloseTo(0.2, 5);
        expect(CatmullRom(1, 0.1, 0.2, 0.3, 0.4)).toBeCloseTo(0.3, 5);
    });

    it('should return a number for any t in range 0 to 1', function ()
    {
        var t;
        var result;

        for (var i = 0; i <= 10; i++)
        {
            t = i / 10;
            result = CatmullRom(t, 0, 1, 4, 9);
            expect(typeof result).toBe('number');
            expect(isNaN(result)).toBe(false);
        }
    });

    it('should allow t values outside 0..1 (extrapolation)', function ()
    {
        // The function does not clamp t, so extrapolation is valid
        var result = CatmullRom(2, 0, 0, 1, 1);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should compute correct intermediate value at t=0.5 with asymmetric points', function ()
    {
        // Manual calculation: p0=0, p1=1, p2=3, p3=4
        // v0 = (3-0)*0.5 = 1.5, v1 = (4-1)*0.5 = 1.5
        // t=0.5: t2=0.25, t3=0.125
        // (2*1 - 2*3 + 1.5 + 1.5)*0.125 + (-3*1 + 3*3 - 2*1.5 - 1.5)*0.25 + 1.5*0.5 + 1
        // = (2 - 6 + 3)*0.125 + (-3 + 9 - 3 - 1.5)*0.25 + 0.75 + 1
        // = (-1)*0.125 + (1.5)*0.25 + 0.75 + 1
        // = -0.125 + 0.375 + 0.75 + 1 = 2
        expect(CatmullRom(0.5, 0, 1, 3, 4)).toBeCloseTo(2, 5);
    });

    it('should produce continuous output — small changes in t produce small changes in output', function ()
    {
        var prev = CatmullRom(0, 0, 0, 10, 10);
        var curr;
        var delta;

        for (var i = 1; i <= 100; i++)
        {
            curr = CatmullRom(i / 100, 0, 0, 10, 10);
            delta = Math.abs(curr - prev);
            expect(delta).toBeLessThan(1);
            prev = curr;
        }
    });

    it('should be monotonically increasing for evenly spaced ascending control points', function ()
    {
        var prev = CatmullRom(0, 0, 1, 2, 3);
        var curr;

        for (var i = 1; i <= 20; i++)
        {
            curr = CatmullRom(i / 20, 0, 1, 2, 3);
            expect(curr).toBeGreaterThanOrEqual(prev - 1e-10);
            prev = curr;
        }
    });
});
