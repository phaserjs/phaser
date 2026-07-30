var InOut = require('../../../../src/math/easing/circular/InOut');

describe('Phaser.Math.Easing.Circular.InOut', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(InOut(0)).toBeCloseTo(0);
    });

    it('should return 1 when given 1', function ()
    {
        expect(InOut(1)).toBeCloseTo(1);
    });

    it('should return 0.5 when given 0.5', function ()
    {
        expect(InOut(0.5)).toBeCloseTo(0.5);
    });

    it('should return a value less than 0.5 for inputs in the first half', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for inputs in the second half', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
    });

    it('should be symmetrical around the midpoint', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75));
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9));
        expect(InOut(0.4)).toBeCloseTo(1 - InOut(0.6));
    });

    it('should produce values in the range [0, 1] for inputs in [0, 1]', function ()
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

    it('should be monotonically increasing across [0, 1]', function ()
    {
        var steps = 100;
        var prev = InOut(0);
        for (var i = 1; i <= steps; i++)
        {
            var v = i / steps;
            var current = InOut(v);
            expect(current).toBeGreaterThanOrEqual(prev);
            prev = current;
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

    it('should return correct value for v = 0.25', function ()
    {
        var v = 0.25;
        var scaled = v * 2;
        var expected = -0.5 * (Math.sqrt(1 - scaled * scaled) - 1);
        expect(InOut(v)).toBeCloseTo(expected);
    });

    it('should return correct value for v = 0.75', function ()
    {
        var v = 0.75;
        var scaled = v * 2 - 2;
        var expected = 0.5 * (Math.sqrt(1 - scaled * scaled) + 1);
        expect(InOut(v)).toBeCloseTo(expected);
    });

    it('should handle very small positive values near zero', function ()
    {
        var result = InOut(0.001);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(0.01);
    });

    it('should handle values very close to 1', function ()
    {
        var result = InOut(0.999);
        expect(result).toBeGreaterThan(0.99);
        expect(result).toBeLessThanOrEqual(1);
    });
});
