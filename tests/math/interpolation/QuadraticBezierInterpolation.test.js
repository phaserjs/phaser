var QuadraticBezierInterpolation = require('../../../src/math/interpolation/QuadraticBezierInterpolation');

describe('Phaser.Math.Interpolation.QuadraticBezier', function ()
{
    it('should return the start point value when t is 0', function ()
    {
        expect(QuadraticBezierInterpolation(0, 0, 0.5, 1)).toBe(0);
        expect(QuadraticBezierInterpolation(0, 10, 20, 30)).toBe(10);
        expect(QuadraticBezierInterpolation(0, -5, 0, 5)).toBe(-5);
    });

    it('should return the end point value when t is 1', function ()
    {
        expect(QuadraticBezierInterpolation(1, 0, 0.5, 1)).toBe(1);
        expect(QuadraticBezierInterpolation(1, 10, 20, 30)).toBe(30);
        expect(QuadraticBezierInterpolation(1, -5, 0, 5)).toBe(5);
    });

    it('should return the control point influence at t = 0.5', function ()
    {
        // At t=0.5: P0(0.5)*p0 + P1(0.5)*p1 + P2(0.5)*p2
        // = 0.25*p0 + 0.5*p1 + 0.25*p2
        expect(QuadraticBezierInterpolation(0.5, 0, 0, 0)).toBeCloseTo(0);
        expect(QuadraticBezierInterpolation(0.5, 0, 1, 0)).toBeCloseTo(0.5);
        expect(QuadraticBezierInterpolation(0.5, 0, 0, 1)).toBeCloseTo(0.25);
        expect(QuadraticBezierInterpolation(0.5, 1, 0, 0)).toBeCloseTo(0.25);
        expect(QuadraticBezierInterpolation(0.5, 0, 10, 0)).toBeCloseTo(5);
    });

    it('should interpolate smoothly between endpoints', function ()
    {
        var p0 = 0;
        var p1 = 0;
        var p2 = 10;

        var v0 = QuadraticBezierInterpolation(0, p0, p1, p2);
        var v025 = QuadraticBezierInterpolation(0.25, p0, p1, p2);
        var v05 = QuadraticBezierInterpolation(0.5, p0, p1, p2);
        var v075 = QuadraticBezierInterpolation(0.75, p0, p1, p2);
        var v1 = QuadraticBezierInterpolation(1, p0, p1, p2);

        expect(v0).toBe(0);
        expect(v025).toBeLessThan(v05);
        expect(v05).toBeLessThan(v075);
        expect(v075).toBeLessThan(v1);
        expect(v1).toBe(10);
    });

    it('should apply the quadratic Bezier formula correctly', function ()
    {
        // P0(t, p0) = (1-t)^2 * p0
        // P1(t, p1) = 2 * (1-t) * t * p1
        // P2(t, p2) = t^2 * p2
        var t = 0.3;
        var p0 = 1, p1 = 2, p2 = 3;
        var k = 1 - t;
        var expected = k * k * p0 + 2 * k * t * p1 + t * t * p2;

        expect(QuadraticBezierInterpolation(t, p0, p1, p2)).toBeCloseTo(expected);
    });

    it('should handle all zero control points', function ()
    {
        expect(QuadraticBezierInterpolation(0.5, 0, 0, 0)).toBe(0);
        expect(QuadraticBezierInterpolation(0, 0, 0, 0)).toBe(0);
        expect(QuadraticBezierInterpolation(1, 0, 0, 0)).toBe(0);
    });

    it('should handle equal start and end points', function ()
    {
        // With p0 == p2, the curve is symmetric around the control point
        var result = QuadraticBezierInterpolation(0.5, 5, 10, 5);
        // At t=0.5: 0.25*5 + 0.5*10 + 0.25*5 = 1.25 + 5 + 1.25 = 7.5
        expect(result).toBeCloseTo(7.5);
    });

    it('should handle negative values', function ()
    {
        expect(QuadraticBezierInterpolation(0, -10, -20, -30)).toBe(-10);
        expect(QuadraticBezierInterpolation(1, -10, -20, -30)).toBe(-30);
        expect(QuadraticBezierInterpolation(0.5, -10, -20, -10)).toBeCloseTo(-15);
    });

    it('should handle floating point inputs', function ()
    {
        var result = QuadraticBezierInterpolation(0.1, 0, 1, 2);
        var t = 0.1;
        var k = 1 - t;
        var expected = k * k * 0 + 2 * k * t * 1 + t * t * 2;
        expect(result).toBeCloseTo(expected);
    });

    it('should satisfy the partition of unity property', function ()
    {
        // (1-t)^2 + 2(1-t)t + t^2 = 1 for all t
        // So if p0 = p1 = p2 = c, result should always equal c
        var steps = [ 0, 0.1, 0.25, 0.5, 0.75, 0.9, 1 ];
        for (var i = 0; i < steps.length; i++)
        {
            expect(QuadraticBezierInterpolation(steps[i], 7, 7, 7)).toBeCloseTo(7);
        }
    });

    it('should return a number for all valid t values', function ()
    {
        for (var i = 0; i <= 10; i++)
        {
            var t = i / 10;
            var result = QuadraticBezierInterpolation(t, 0, 1, 2);
            expect(typeof result).toBe('number');
            expect(isNaN(result)).toBe(false);
        }
    });

    it('should produce values within the range spanned by the bezier for simple cases', function ()
    {
        // For p0=0, p1=0, p2=1, all values should be between 0 and 1
        for (var i = 0; i <= 10; i++)
        {
            var t = i / 10;
            var result = QuadraticBezierInterpolation(t, 0, 0, 1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should be symmetric when control point is the midpoint', function ()
    {
        // With p0=0, p1=0.5, p2=1 the curve at t and (1-t) should mirror
        var p0 = 0, p1 = 0.5, p2 = 1;
        var atT = QuadraticBezierInterpolation(0.25, p0, p1, p2);
        var atMirror = QuadraticBezierInterpolation(0.75, p0, p1, p2);
        expect(atT + atMirror).toBeCloseTo(1);
    });
});
