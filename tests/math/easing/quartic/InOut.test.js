var InOut = require('../../../../src/math/easing/quartic/InOut');

describe('Phaser.Math.Easing.Quartic.InOut', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(InOut(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(InOut(1)).toBe(1);
    });

    it('should return 0.5 when v is 0.5', function ()
    {
        expect(InOut(0.5)).toBe(0.5);
    });

    it('should return a value less than 0.5 for v in the first half (0 < v < 0.5)', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
        expect(InOut(0.1)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for v in the second half (0.5 < v < 1)', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
        expect(InOut(0.9)).toBeGreaterThan(0.5);
    });

    it('should produce symmetric output around the midpoint', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75), 10);
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9), 10);
        expect(InOut(0.4)).toBeCloseTo(1 - InOut(0.6), 10);
    });

    it('should use the ease-in quartic formula for the first half', function ()
    {
        // v=0.25: v*=2 => 0.5, result = 0.5 * 0.5^4 = 0.5 * 0.0625 = 0.03125
        expect(InOut(0.25)).toBeCloseTo(0.03125, 10);
    });

    it('should use the ease-out quartic formula for the second half', function ()
    {
        // v=0.75: v*=2 => 1.5, v-=2 => -0.5, result = -0.5 * ((-0.5)^4 - 2) = -0.5 * (0.0625 - 2) = -0.5 * -1.9375 = 0.96875
        expect(InOut(0.75)).toBeCloseTo(0.96875, 10);
    });

    it('should produce output in the range [0, 1] for input in [0, 1]', function ()
    {
        var steps = 100;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = InOut(v);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should be monotonically increasing from 0 to 1', function ()
    {
        var steps = 100;
        var prev = InOut(0);

        for (var i = 1; i <= steps; i++)
        {
            var v = i / steps;
            var result = InOut(v);

            expect(result).toBeGreaterThanOrEqual(prev);
            prev = result;
        }
    });

    it('should accelerate slowly at the start', function ()
    {
        var near0 = InOut(0.1);

        expect(near0).toBeLessThan(0.1);
    });

    it('should decelerate slowly near the end', function ()
    {
        var near1 = InOut(0.9);

        expect(near1).toBeGreaterThan(0.9);
    });

    it('should handle very small positive values', function ()
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
