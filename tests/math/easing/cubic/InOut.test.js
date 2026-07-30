var InOut = require('../../../../src/math/easing/cubic/InOut');

describe('Phaser.Math.Easing.Cubic.InOut', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(InOut(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(InOut(1)).toBe(1);
    });

    it('should return 0.5 at the midpoint', function ()
    {
        expect(InOut(0.5)).toBe(0.5);
    });

    it('should return a value less than 0.5 for v below 0.5', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for v above 0.5', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
    });

    it('should return correct value for v = 0.25 (first half cubic)', function ()
    {
        // v*=2 => 0.5 < 1: 0.5 * 0.5^3 = 0.5 * 0.125 = 0.0625
        expect(InOut(0.25)).toBeCloseTo(0.0625, 10);
    });

    it('should return correct value for v = 0.75 (second half cubic)', function ()
    {
        // v*=2 => 1.5; 0.5 * ((1.5-2)^3 + 2) = 0.5 * (-0.125 + 2) = 0.9375
        expect(InOut(0.75)).toBeCloseTo(0.9375, 10);
    });

    it('should be symmetric around the midpoint', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75), 10);
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9), 10);
        expect(InOut(0.3)).toBeCloseTo(1 - InOut(0.7), 10);
    });

    it('should produce a monotonically increasing output across the range', function ()
    {
        var prev = InOut(0);

        for (var i = 1; i <= 100; i++)
        {
            var current = InOut(i / 100);

            expect(current).toBeGreaterThanOrEqual(prev);
            prev = current;
        }
    });

    it('should always return values in the range [0, 1] for inputs in [0, 1]', function ()
    {
        for (var i = 0; i <= 100; i++)
        {
            var result = InOut(i / 100);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should ease in slowly at the start', function ()
    {
        // Cubic ease means very slow start — small v yields very small output
        expect(InOut(0.1)).toBeCloseTo(0.004, 3);
    });

    it('should ease out slowly at the end', function ()
    {
        // Symmetric to start — near v=1 should be close to 1 but not yet there
        expect(InOut(0.9)).toBeCloseTo(0.996, 3);
    });

    it('should move briskly through the middle', function ()
    {
        // The slope (rate of change) should be greatest near 0.5
        var delta_mid = InOut(0.55) - InOut(0.45);
        var delta_start = InOut(0.1) - InOut(0.0);
        var delta_end = InOut(1.0) - InOut(0.9);

        expect(delta_mid).toBeGreaterThan(delta_start);
        expect(delta_mid).toBeGreaterThan(delta_end);
    });

    it('should handle very small positive values', function ()
    {
        var result = InOut(0.001);

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeCloseTo(0, 5);
    });

    it('should handle values very close to 1', function ()
    {
        var result = InOut(0.999);

        expect(result).toBeLessThanOrEqual(1);
        expect(result).toBeCloseTo(1, 5);
    });
});
