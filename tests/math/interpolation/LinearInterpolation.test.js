var LinearInterpolation = require('../../../src/math/interpolation/LinearInterpolation');

describe('Phaser.Math.Interpolation.Linear', function ()
{
    it('should return the first value when k is 0', function ()
    {
        expect(LinearInterpolation([0, 50, 100], 0)).toBe(0);
    });

    it('should return the last value when k is 1', function ()
    {
        expect(LinearInterpolation([0, 50, 100], 1)).toBe(100);
    });

    it('should return the midpoint value when k is 0.5 with two elements', function ()
    {
        expect(LinearInterpolation([0, 100], 0.5)).toBeCloseTo(50);
    });

    it('should return the midpoint of an odd-length array when k is 0.5', function ()
    {
        expect(LinearInterpolation([0, 50, 100], 0.5)).toBeCloseTo(50);
    });

    it('should interpolate correctly at k=0.25 with two elements', function ()
    {
        expect(LinearInterpolation([0, 100], 0.25)).toBeCloseTo(25);
    });

    it('should interpolate correctly at k=0.75 with two elements', function ()
    {
        expect(LinearInterpolation([0, 100], 0.75)).toBeCloseTo(75);
    });

    it('should interpolate between the correct segment for arrays with more than two elements', function ()
    {
        // Array [0, 10, 20], m=2, k=0.25 => f=0.5, i=0 => Linear(0, 10, 0.5) = 5
        expect(LinearInterpolation([0, 10, 20], 0.25)).toBeCloseTo(5);
    });

    it('should interpolate in the second segment for arrays with more than two elements', function ()
    {
        // Array [0, 10, 20], m=2, k=0.75 => f=1.5, i=1 => Linear(10, 20, 0.5) = 15
        expect(LinearInterpolation([0, 10, 20], 0.75)).toBeCloseTo(15);
    });

    it('should extrapolate below the array when k is negative', function ()
    {
        // k < 0 uses Linear(v[0], v[1], f) where f = m * k
        // Array [10, 20], m=1, k=-0.5, f=-0.5 => Linear(10, 20, -0.5) = 10 + (-0.5)*(20-10) = 5
        expect(LinearInterpolation([10, 20], -0.5)).toBeCloseTo(5);
    });

    it('should extrapolate above the array when k is greater than 1', function ()
    {
        // k > 1 uses Linear(v[m], v[m-1], m - f)
        // Array [10, 20], m=1, k=1.5, f=1.5 => Linear(20, 10, 1-1.5) = Linear(20, 10, -0.5) = 20 + (-0.5)*(10-20) = 25
        expect(LinearInterpolation([10, 20], 1.5)).toBeCloseTo(25);
    });

    it('should handle a single-element array at k=0', function ()
    {
        // m=0, f=0, i=0, k=0 => Linear(v[0], v[0], 0) = v[0]
        expect(LinearInterpolation([42], 0)).toBeCloseTo(42);
    });

    it('should handle a single-element array at k=1', function ()
    {
        // m=0, f=0, i=0, k=1 => k > 1 is false, k < 0 is false
        // Linear(v[0], v[0 > 0 ? 0 : 1], 0) but i+1 > m so Linear(v[0], v[0], 0)
        expect(LinearInterpolation([42], 1)).toBeCloseTo(42);
    });

    it('should handle negative values in the array', function ()
    {
        expect(LinearInterpolation([-100, 100], 0.5)).toBeCloseTo(0);
    });

    it('should handle floating point values in the array', function ()
    {
        expect(LinearInterpolation([0.1, 0.9], 0.5)).toBeCloseTo(0.5);
    });

    it('should return the first element value when k is exactly 0 with multiple elements', function ()
    {
        expect(LinearInterpolation([5, 10, 15, 20], 0)).toBe(5);
    });

    it('should return the last element value when k is exactly 1 with multiple elements', function ()
    {
        expect(LinearInterpolation([5, 10, 15, 20], 1)).toBe(20);
    });

    it('should interpolate across four elements at k=1/3', function ()
    {
        // Array [0, 10, 20, 30], m=3, k=1/3, f=1, i=1 => Linear(10, 20, 0) = 10
        expect(LinearInterpolation([0, 10, 20, 30], 1 / 3)).toBeCloseTo(10);
    });

    it('should interpolate across four elements at k=2/3', function ()
    {
        // Array [0, 10, 20, 30], m=3, k=2/3, f=2, i=2 => Linear(20, 30, 0) = 20
        expect(LinearInterpolation([0, 10, 20, 30], 2 / 3)).toBeCloseTo(20);
    });

    it('should handle all-zero arrays', function ()
    {
        expect(LinearInterpolation([0, 0, 0], 0.5)).toBeCloseTo(0);
    });

    it('should handle arrays with identical values', function ()
    {
        expect(LinearInterpolation([7, 7, 7], 0.3)).toBeCloseTo(7);
        expect(LinearInterpolation([7, 7, 7], 0.7)).toBeCloseTo(7);
    });
});
