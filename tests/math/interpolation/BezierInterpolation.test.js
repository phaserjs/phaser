var BezierInterpolation = require('../../../src/math/interpolation/BezierInterpolation');

describe('Phaser.Math.Interpolation.Bezier', function ()
{
    it('should return the first value when k is 0', function ()
    {
        expect(BezierInterpolation([0, 0.5, 1], 0)).toBeCloseTo(0);
    });

    it('should return the last value when k is 1', function ()
    {
        expect(BezierInterpolation([0, 0.5, 1], 1)).toBeCloseTo(1);
    });

    it('should return the midpoint for a linear two-point interpolation at k=0.5', function ()
    {
        expect(BezierInterpolation([0, 1], 0.5)).toBeCloseTo(0.5);
    });

    it('should return the start value for a single-point array at k=0', function ()
    {
        expect(BezierInterpolation([42], 0)).toBeCloseTo(42);
    });

    it('should return the single value for a one-element array at k=0.5', function ()
    {
        expect(BezierInterpolation([42], 0.5)).toBeCloseTo(42);
    });

    it('should return the single value for a one-element array at k=1', function ()
    {
        expect(BezierInterpolation([42], 1)).toBeCloseTo(42);
    });

    it('should interpolate correctly for a two-point array at k=0', function ()
    {
        expect(BezierInterpolation([10, 20], 0)).toBeCloseTo(10);
    });

    it('should interpolate correctly for a two-point array at k=1', function ()
    {
        expect(BezierInterpolation([10, 20], 1)).toBeCloseTo(20);
    });

    it('should interpolate correctly for a two-point array at k=0.25', function ()
    {
        expect(BezierInterpolation([0, 100], 0.25)).toBeCloseTo(25);
    });

    it('should interpolate correctly for a three-point quadratic curve at k=0.5', function ()
    {
        // Quadratic Bezier with points [0, 1, 0]: midpoint should be 0.5
        expect(BezierInterpolation([0, 1, 0], 0.5)).toBeCloseTo(0.5);
    });

    it('should return 0 for all-zero control points', function ()
    {
        expect(BezierInterpolation([0, 0, 0, 0], 0.5)).toBeCloseTo(0);
    });

    it('should return the constant value for all-equal control points', function ()
    {
        expect(BezierInterpolation([5, 5, 5, 5], 0.5)).toBeCloseTo(5);
        expect(BezierInterpolation([5, 5, 5, 5], 0)).toBeCloseTo(5);
        expect(BezierInterpolation([5, 5, 5, 5], 1)).toBeCloseTo(5);
    });

    it('should work with negative control point values', function ()
    {
        expect(BezierInterpolation([-10, 0, 10], 0)).toBeCloseTo(-10);
        expect(BezierInterpolation([-10, 0, 10], 1)).toBeCloseTo(10);
    });

    it('should work with floating point control point values', function ()
    {
        expect(BezierInterpolation([0.1, 0.5, 0.9], 0)).toBeCloseTo(0.1);
        expect(BezierInterpolation([0.1, 0.5, 0.9], 1)).toBeCloseTo(0.9);
    });

    it('should interpolate four control points correctly at k=0', function ()
    {
        expect(BezierInterpolation([1, 2, 3, 4], 0)).toBeCloseTo(1);
    });

    it('should interpolate four control points correctly at k=1', function ()
    {
        expect(BezierInterpolation([1, 2, 3, 4], 1)).toBeCloseTo(4);
    });

    it('should produce a value within the range of the control points for k between 0 and 1', function ()
    {
        var v = [0, 5, 2, 8, 3];
        var min = Math.min.apply(null, v);
        var max = Math.max.apply(null, v);

        for (var i = 0; i <= 10; i++)
        {
            var k = i / 10;
            var result = BezierInterpolation(v, k);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
        }
    });

    it('should produce a smooth curve with many control points at k=0 and k=1', function ()
    {
        var v = [1, 3, 5, 7, 9, 11];
        expect(BezierInterpolation(v, 0)).toBeCloseTo(1);
        expect(BezierInterpolation(v, 1)).toBeCloseTo(11);
    });

    it('should return a number type', function ()
    {
        var result = BezierInterpolation([0, 1, 2], 0.5);
        expect(typeof result).toBe('number');
    });

    it('should handle k values at boundaries 0 and 1 symmetrically for symmetric control points', function ()
    {
        var v = [0, 1, 2, 1, 0];
        expect(BezierInterpolation(v, 0)).toBeCloseTo(BezierInterpolation(v, 1), 5);
    });
});
