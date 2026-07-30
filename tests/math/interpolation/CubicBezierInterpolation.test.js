var CubicBezierInterpolation = require('../../../src/math/interpolation/CubicBezierInterpolation');

describe('Phaser.Math.Interpolation.CubicBezier', function ()
{
    it('should return p0 when t is 0', function ()
    {
        expect(CubicBezierInterpolation(0, 10, 20, 30, 40)).toBe(10);
    });

    it('should return p3 when t is 1', function ()
    {
        expect(CubicBezierInterpolation(1, 10, 20, 30, 40)).toBe(40);
    });

    it('should return 0 when all control points are 0', function ()
    {
        expect(CubicBezierInterpolation(0.5, 0, 0, 0, 0)).toBe(0);
    });

    it('should return the same value as a linear interpolation when all points are collinear', function ()
    {
        // When p0=0 and p3=1 and p1=1/3 and p2=2/3, this is the cubic bezier for a straight line
        var result = CubicBezierInterpolation(0.5, 0, 1/3, 2/3, 1);
        expect(result).toBeCloseTo(0.5, 5);
    });

    it('should interpolate at t=0.5 with symmetric control points', function ()
    {
        // p0=0, p1=0, p2=1, p3=1 at t=0.5 should give 0.5
        var result = CubicBezierInterpolation(0.5, 0, 0, 1, 1);
        expect(result).toBeCloseTo(0.5, 5);
    });

    it('should return a value between p0 and p3 for t in (0, 1) with standard control points', function ()
    {
        var p0 = 0, p1 = 1, p2 = 2, p3 = 3;
        var result = CubicBezierInterpolation(0.5, p0, p1, p2, p3);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(3);
    });

    it('should calculate the correct value at t=0.25', function ()
    {
        // P0(0.25, 0) + P1(0.25, 1) + P2(0.25, 1) + P3(0.25, 0)
        // = 0 + 3*(0.75)^2*0.25*1 + 3*0.75*(0.25)^2*1 + 0
        // = 3*0.5625*0.25 + 3*0.75*0.0625
        // = 0.421875 + 0.140625 = 0.5625... wait let me recalculate
        // p0=0, p1=1, p2=1, p3=0
        // P0(0.25,0)=0, P1(0.25,1)=3*(0.75)^2*0.25=3*0.5625*0.25=0.421875
        // P2(0.25,1)=3*0.75*(0.25)^2=3*0.75*0.0625=0.140625, P3(0.25,0)=0
        // total = 0.5625
        var result = CubicBezierInterpolation(0.25, 0, 1, 1, 0);
        expect(result).toBeCloseTo(0.5625, 5);
    });

    it('should calculate the correct value at t=0.75', function ()
    {
        // p0=0, p1=1, p2=1, p3=0 - symmetric to t=0.25 case
        var result = CubicBezierInterpolation(0.75, 0, 1, 1, 0);
        expect(result).toBeCloseTo(0.5625, 5);
    });

    it('should work with negative control points', function ()
    {
        var result0 = CubicBezierInterpolation(0, -10, -5, 5, 10);
        var result1 = CubicBezierInterpolation(1, -10, -5, 5, 10);
        expect(result0).toBe(-10);
        expect(result1).toBe(10);
    });

    it('should work with floating point control points', function ()
    {
        var result = CubicBezierInterpolation(0, 0.1, 0.2, 0.3, 0.4);
        expect(result).toBeCloseTo(0.1, 5);
        result = CubicBezierInterpolation(1, 0.1, 0.2, 0.3, 0.4);
        expect(result).toBeCloseTo(0.4, 5);
    });

    it('should produce smooth output that varies continuously with t', function ()
    {
        var prev = CubicBezierInterpolation(0, 0, 1, 2, 3);
        for (var i = 1; i <= 10; i++)
        {
            var t = i / 10;
            var current = CubicBezierInterpolation(t, 0, 1, 2, 3);
            expect(current).toBeGreaterThanOrEqual(prev - 0.0001);
            prev = current;
        }
    });

    it('should return p0 value at t=0 regardless of control points', function ()
    {
        expect(CubicBezierInterpolation(0, 100, 999, -999, 50)).toBe(100);
    });

    it('should return p3 value at t=1 regardless of control points', function ()
    {
        expect(CubicBezierInterpolation(1, 100, 999, -999, 50)).toBe(50);
    });

    it('should compute the correct midpoint for a basic ease-in-out curve', function ()
    {
        // p0=0, p1=0, p2=100, p3=100 is a classic ease-in-out bezier
        // at t=0.5: P0=0, P1=0, P2=3*0.5*0.25*100=37.5, P3=0.125*100=12.5 => 50
        var result = CubicBezierInterpolation(0.5, 0, 0, 100, 100);
        expect(result).toBeCloseTo(50, 5);
    });

    it('should handle large values', function ()
    {
        var result0 = CubicBezierInterpolation(0, 1000000, 2000000, 3000000, 4000000);
        var result1 = CubicBezierInterpolation(1, 1000000, 2000000, 3000000, 4000000);
        expect(result0).toBeCloseTo(1000000, 0);
        expect(result1).toBeCloseTo(4000000, 0);
    });
});
