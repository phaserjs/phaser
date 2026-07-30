var InOut = require('../../../../src/math/easing/quintic/InOut');

describe('Phaser.Math.Easing.Quintic.InOut', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(InOut(0)).toBe(0);
    });

    it('should return 1 when given 1', function ()
    {
        expect(InOut(1)).toBe(1);
    });

    it('should return 0.5 at the midpoint', function ()
    {
        expect(InOut(0.5)).toBe(0.5);
    });

    it('should return a value less than 0.5 for inputs below 0.5', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for inputs above 0.5', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
    });

    it('should be symmetric around the midpoint', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75), 10);
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9), 10);
        expect(InOut(0.4)).toBeCloseTo(1 - InOut(0.6), 10);
    });

    it('should ease in slowly at the start', function ()
    {
        var v1 = InOut(0.1);
        var v2 = InOut(0.2);
        var diff1 = v2 - v1;
        var v3 = InOut(0.4);
        var v4 = InOut(0.5);
        var diff2 = v4 - v3;

        expect(diff1).toBeLessThan(diff2);
    });

    it('should ease out slowly at the end', function ()
    {
        var v1 = InOut(0.5);
        var v2 = InOut(0.6);
        var diff1 = v2 - v1;
        var v3 = InOut(0.8);
        var v4 = InOut(0.9);
        var diff2 = v4 - v3;

        expect(diff1).toBeGreaterThan(diff2);
    });

    it('should return values in the range [0, 1] for inputs in [0, 1]', function ()
    {
        var steps = 20;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = InOut(v);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should produce a monotonically increasing output for increasing input', function ()
    {
        var steps = 20;
        var prev = InOut(0);

        for (var i = 1; i <= steps; i++)
        {
            var v = i / steps;
            var result = InOut(v);

            expect(result).toBeGreaterThanOrEqual(prev);
            prev = result;
        }
    });

    it('should compute correct value at v = 0.25 using the in branch', function ()
    {
        // v *= 2 => 0.5, which is < 1
        // result = 0.5 * 0.5^5 = 0.5 * 0.03125 = 0.015625
        expect(InOut(0.25)).toBeCloseTo(0.015625, 10);
    });

    it('should compute correct value at v = 0.75 using the out branch', function ()
    {
        // v *= 2 => 1.5, >= 1
        // v -= 2 => -0.5
        // result = 0.5 * ((-0.5)^5 + 2) = 0.5 * (-0.03125 + 2) = 0.5 * 1.96875 = 0.984375
        expect(InOut(0.75)).toBeCloseTo(0.984375, 10);
    });

    it('should handle very small positive values near 0', function ()
    {
        var result = InOut(0.001);

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(0.001);
    });

    it('should handle values very close to 1', function ()
    {
        var result = InOut(0.999);

        expect(result).toBeLessThanOrEqual(1);
        expect(result).toBeGreaterThan(0.999);
    });
});
