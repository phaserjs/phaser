var InOut = require('../../../../src/math/easing/sine/InOut');

describe('Phaser.Math.Easing.Sine.InOut', function ()
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
        expect(InOut(0.5)).toBeCloseTo(0.5, 10);
    });

    it('should return a value less than 0.5 for v below 0.5', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for v above 0.5', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
    });

    it('should produce symmetric output around the midpoint', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75), 10);
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9), 10);
        expect(InOut(0.3)).toBeCloseTo(1 - InOut(0.7), 10);
    });

    it('should return values in the range [0, 1] for inputs in [0, 1]', function ()
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

    it('should produce a monotonically increasing output', function ()
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

    it('should ease in slowly at the start', function ()
    {
        var earlyGain = InOut(0.1) - InOut(0);
        var midGain = InOut(0.5) - InOut(0.4);

        expect(earlyGain).toBeLessThan(midGain);
    });

    it('should ease out slowly at the end', function ()
    {
        var lateGain = InOut(1) - InOut(0.9);
        var midGain = InOut(0.6) - InOut(0.5);

        expect(lateGain).toBeLessThan(midGain);
    });

    it('should use the cosine formula for values between 0 and 1', function ()
    {
        var v = 0.3;
        var expected = 0.5 * (1 - Math.cos(Math.PI * v));

        expect(InOut(v)).toBeCloseTo(expected, 10);
    });

    it('should return a number type for all valid inputs', function ()
    {
        expect(typeof InOut(0)).toBe('number');
        expect(typeof InOut(0.5)).toBe('number');
        expect(typeof InOut(1)).toBe('number');
    });

    it('should handle values very close to 0', function ()
    {
        var result = InOut(0.001);

        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(0.01);
    });

    it('should handle values very close to 1', function ()
    {
        var result = InOut(0.999);

        expect(result).toBeGreaterThan(0.99);
        expect(result).toBeLessThan(1);
    });
});
