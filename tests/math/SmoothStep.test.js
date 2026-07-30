var SmoothStep = require('../../src/math/SmoothStep');

describe('Phaser.Math.SmoothStep', function ()
{
    it('should return 0 when x is less than min', function ()
    {
        expect(SmoothStep(-1, 0, 1)).toBe(0);
    });

    it('should return 0 when x equals min', function ()
    {
        expect(SmoothStep(0, 0, 1)).toBe(0);
    });

    it('should return 1 when x is greater than max', function ()
    {
        expect(SmoothStep(2, 0, 1)).toBe(1);
    });

    it('should return 1 when x equals max', function ()
    {
        expect(SmoothStep(1, 0, 1)).toBe(1);
    });

    it('should return 0.5 at the midpoint between min and max', function ()
    {
        expect(SmoothStep(0.5, 0, 1)).toBe(0.5);
    });

    it('should return a value between 0 and 1 for x between min and max', function ()
    {
        var result = SmoothStep(0.25, 0, 1);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(1);
    });

    it('should return the correct Hermite interpolation value at 0.25', function ()
    {
        // x=0.25 normalized => t=0.25, result = 0.25*0.25*(3 - 2*0.25) = 0.0625 * 2.5 = 0.15625
        expect(SmoothStep(0.25, 0, 1)).toBeCloseTo(0.15625, 5);
    });

    it('should return the correct Hermite interpolation value at 0.75', function ()
    {
        // x=0.75 normalized => t=0.75, result = 0.75*0.75*(3 - 2*0.75) = 0.5625 * 1.5 = 0.84375
        expect(SmoothStep(0.75, 0, 1)).toBeCloseTo(0.84375, 5);
    });

    it('should work with a non-zero min value', function ()
    {
        // midpoint of 5..15 is 10, should return 0.5
        expect(SmoothStep(10, 5, 15)).toBe(0.5);
    });

    it('should return 0 when x is below a non-zero min', function ()
    {
        expect(SmoothStep(3, 5, 15)).toBe(0);
    });

    it('should return 1 when x exceeds a non-zero max', function ()
    {
        expect(SmoothStep(20, 5, 15)).toBe(1);
    });

    it('should work with negative min and max values', function ()
    {
        // midpoint of -10..-2 is -6, should return 0.5
        expect(SmoothStep(-6, -10, -2)).toBe(0.5);
    });

    it('should return 0 for x at or below negative min', function ()
    {
        expect(SmoothStep(-10, -10, -2)).toBe(0);
        expect(SmoothStep(-15, -10, -2)).toBe(0);
    });

    it('should return 1 for x at or above negative max', function ()
    {
        expect(SmoothStep(-2, -10, -2)).toBe(1);
        expect(SmoothStep(0, -10, -2)).toBe(1);
    });

    it('should produce a smooth S-curve (output increases monotonically)', function ()
    {
        var prev = 0;
        for (var i = 1; i <= 9; i++)
        {
            var result = SmoothStep(i / 10, 0, 1);
            expect(result).toBeGreaterThan(prev);
            prev = result;
        }
    });

    it('should have zero slope at both edges (flat start and end)', function ()
    {
        var epsilon = 0.0001;
        var nearStart = SmoothStep(epsilon, 0, 1);
        var nearEnd = SmoothStep(1 - epsilon, 0, 1);
        // Near min the result should be very close to 0
        expect(nearStart).toBeCloseTo(0, 3);
        // Near max the result should be very close to 1
        expect(nearEnd).toBeCloseTo(1, 3);
    });

    it('should be symmetric around the midpoint', function ()
    {
        expect(SmoothStep(0.25, 0, 1)).toBeCloseTo(1 - SmoothStep(0.75, 0, 1), 10);
        expect(SmoothStep(0.1, 0, 1)).toBeCloseTo(1 - SmoothStep(0.9, 0, 1), 10);
    });
});
