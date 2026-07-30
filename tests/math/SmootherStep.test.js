var SmootherStep = require('../../src/math/SmootherStep');

describe('Phaser.Math.SmootherStep', function ()
{
    it('should return 0 when x is equal to min', function ()
    {
        expect(SmootherStep(0, 0, 1)).toBe(0);
    });

    it('should return 1 when x is equal to max', function ()
    {
        expect(SmootherStep(1, 0, 1)).toBe(1);
    });

    it('should return 0 when x is less than min', function ()
    {
        expect(SmootherStep(-5, 0, 1)).toBe(0);
    });

    it('should return 1 when x is greater than max', function ()
    {
        expect(SmootherStep(10, 0, 1)).toBe(1);
    });

    it('should return 0.5 when x is exactly midway between min and max', function ()
    {
        expect(SmootherStep(0.5, 0, 1)).toBe(0.5);
    });

    it('should return a value between 0 and 1 for values within range', function ()
    {
        var result = SmootherStep(0.25, 0, 1);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(0.5);
    });

    it('should return a value between 0.5 and 1 for values in upper half of range', function ()
    {
        var result = SmootherStep(0.75, 0, 1);
        expect(result).toBeGreaterThan(0.5);
        expect(result).toBeLessThan(1);
    });

    it('should work with a custom range', function ()
    {
        expect(SmootherStep(0, -100, 100)).toBe(0.5);
    });

    it('should return 0 when x equals min of a custom range', function ()
    {
        expect(SmootherStep(-100, -100, 100)).toBe(0);
    });

    it('should return 1 when x equals max of a custom range', function ()
    {
        expect(SmootherStep(100, -100, 100)).toBe(1);
    });

    it('should produce a smoother curve than smoothstep near edges', function ()
    {
        var nearMin = SmootherStep(0.1, 0, 1);
        var nearMax = SmootherStep(0.9, 0, 1);

        expect(nearMin).toBeCloseTo(0.00856, 4);
        expect(nearMax).toBeCloseTo(0.99144, 4);
    });

    it('should be symmetric around the midpoint', function ()
    {
        var low = SmootherStep(0.25, 0, 1);
        var high = SmootherStep(0.75, 0, 1);

        expect(low + high).toBeCloseTo(1, 10);
    });

    it('should produce the correct polynomial value at 0.5', function ()
    {
        var x = 0.5;
        var expected = x * x * x * (x * (x * 6 - 15) + 10);
        expect(SmootherStep(0.5, 0, 1)).toBeCloseTo(expected, 10);
    });

    it('should handle floating point min and max values', function ()
    {
        var result = SmootherStep(0.5, 0.25, 0.75);
        expect(result).toBe(0.5);
    });

    it('should return 0 when x is far below min', function ()
    {
        expect(SmootherStep(-1000, 0, 1)).toBe(0);
    });

    it('should return 1 when x is far above max', function ()
    {
        expect(SmootherStep(1000, 0, 1)).toBe(1);
    });

    it('should produce values with zero derivative at the edges', function ()
    {
        var epsilon = 0.0001;
        var atMin = SmootherStep(0, 0, 1);
        var justAboveMin = SmootherStep(epsilon, 0, 1);
        var atMax = SmootherStep(1, 0, 1);
        var justBelowMax = SmootherStep(1 - epsilon, 0, 1);

        expect(justAboveMin - atMin).toBeCloseTo(0, 4);
        expect(atMax - justBelowMax).toBeCloseTo(0, 4);
    });

    it('should be monotonically increasing across the range', function ()
    {
        var prev = SmootherStep(0, 0, 1);
        for (var i = 1; i <= 10; i++)
        {
            var curr = SmootherStep(i / 10, 0, 1);
            expect(curr).toBeGreaterThanOrEqual(prev);
            prev = curr;
        }
    });
});
