var In = require('../../../../src/math/easing/cubic/In');

describe('Phaser.Math.Easing.Cubic.In', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when given 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return the cube of the input value', function ()
    {
        expect(In(0.5)).toBeCloseTo(0.125);
        expect(In(0.25)).toBeCloseTo(0.015625);
        expect(In(0.75)).toBeCloseTo(0.421875);
    });

    it('should return values less than the input for values between 0 and 1', function ()
    {
        expect(In(0.3)).toBeLessThan(0.3);
        expect(In(0.7)).toBeLessThan(0.7);
        expect(In(0.99)).toBeLessThan(0.99);
    });

    it('should return values in the range [0, 1] for inputs in the range [0, 1]', function ()
    {
        var steps = 100;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = In(v);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should be monotonically increasing for inputs in [0, 1]', function ()
    {
        var prev = In(0);

        for (var i = 1; i <= 100; i++)
        {
            var current = In(i / 100);

            expect(current).toBeGreaterThanOrEqual(prev);
            prev = current;
        }
    });

    it('should handle negative values', function ()
    {
        expect(In(-1)).toBeCloseTo(-1);
        expect(In(-0.5)).toBeCloseTo(-0.125);
        expect(In(-2)).toBeCloseTo(-8);
    });

    it('should handle values greater than 1', function ()
    {
        expect(In(2)).toBeCloseTo(8);
        expect(In(1.5)).toBeCloseTo(3.375);
    });

    it('should produce a slow start by having low output near 0', function ()
    {
        expect(In(0.1)).toBeCloseTo(0.001);
        expect(In(0.2)).toBeCloseTo(0.008);
    });

    it('should produce a fast finish by having high output near 1', function ()
    {
        expect(In(0.9)).toBeCloseTo(0.729);
        expect(In(0.8)).toBeCloseTo(0.512);
    });
});
