var SmootherStepInterpolation = require('../../../src/math/interpolation/SmootherStepInterpolation');

describe('Phaser.Math.Interpolation.SmootherStep', function ()
{
    it('should return min when t is 0', function ()
    {
        expect(SmootherStepInterpolation(0, 0, 100)).toBe(0);
        expect(SmootherStepInterpolation(0, 50, 200)).toBe(50);
        expect(SmootherStepInterpolation(0, -100, 100)).toBe(-100);
    });

    it('should return max when t is 1', function ()
    {
        expect(SmootherStepInterpolation(1, 0, 100)).toBe(100);
        expect(SmootherStepInterpolation(1, 50, 200)).toBe(200);
        expect(SmootherStepInterpolation(1, -100, 100)).toBe(100);
    });

    it('should return the midpoint value when t is 0.5', function ()
    {
        expect(SmootherStepInterpolation(0.5, 0, 100)).toBeCloseTo(50, 5);
        expect(SmootherStepInterpolation(0.5, 0, 200)).toBeCloseTo(100, 5);
    });

    it('should return a value between min and max for t in (0, 1)', function ()
    {
        var result = SmootherStepInterpolation(0.25, 0, 100);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(100);

        result = SmootherStepInterpolation(0.75, 0, 100);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(100);
    });

    it('should produce an S-curve with lower slope near endpoints', function ()
    {
        var step = 0.01;
        var deltaStart = SmootherStepInterpolation(step, 0, 1) - SmootherStepInterpolation(0, 0, 1);
        var deltaMid = SmootherStepInterpolation(0.5 + step, 0, 1) - SmootherStepInterpolation(0.5, 0, 1);
        var deltaEnd = SmootherStepInterpolation(1, 0, 1) - SmootherStepInterpolation(1 - step, 0, 1);

        expect(deltaStart).toBeLessThan(deltaMid);
        expect(deltaEnd).toBeLessThan(deltaMid);
    });

    it('should be symmetric around the midpoint', function ()
    {
        expect(SmootherStepInterpolation(0.25, 0, 1)).toBeCloseTo(1 - SmootherStepInterpolation(0.75, 0, 1), 10);
        expect(SmootherStepInterpolation(0.1, 0, 1)).toBeCloseTo(1 - SmootherStepInterpolation(0.9, 0, 1), 10);
    });

    it('should clamp t below 0 to return min', function ()
    {
        expect(SmootherStepInterpolation(-1, 0, 100)).toBe(0);
        expect(SmootherStepInterpolation(-0.5, 10, 50)).toBe(10);
    });

    it('should clamp t above 1 to return max', function ()
    {
        expect(SmootherStepInterpolation(2, 0, 100)).toBe(100);
        expect(SmootherStepInterpolation(1.5, 10, 50)).toBe(50);
    });

    it('should work when min equals max', function ()
    {
        expect(SmootherStepInterpolation(0, 42, 42)).toBe(42);
        expect(SmootherStepInterpolation(0.5, 42, 42)).toBe(42);
        expect(SmootherStepInterpolation(1, 42, 42)).toBe(42);
    });

    it('should work with negative min and max values', function ()
    {
        expect(SmootherStepInterpolation(0, -200, -100)).toBe(-200);
        expect(SmootherStepInterpolation(1, -200, -100)).toBe(-100);

        var result = SmootherStepInterpolation(0.5, -200, -100);
        expect(result).toBeCloseTo(-150, 5);
    });

    it('should work with floating point min and max values', function ()
    {
        expect(SmootherStepInterpolation(0, 0.25, 0.75)).toBeCloseTo(0.25, 10);
        expect(SmootherStepInterpolation(1, 0.25, 0.75)).toBeCloseTo(0.75, 10);
        expect(SmootherStepInterpolation(0.5, 0.25, 0.75)).toBeCloseTo(0.5, 5);
    });

    it('should produce monotonically increasing output for increasing t', function ()
    {
        var prev = SmootherStepInterpolation(0, 0, 100);
        for (var i = 1; i <= 10; i++)
        {
            var curr = SmootherStepInterpolation(i / 10, 0, 100);
            expect(curr).toBeGreaterThanOrEqual(prev);
            prev = curr;
        }
    });

    it('should return a number', function ()
    {
        expect(typeof SmootherStepInterpolation(0.5, 0, 100)).toBe('number');
    });
});
