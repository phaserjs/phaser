var InOut = require('../../../../src/math/easing/bounce/InOut');

describe('Phaser.Math.Easing.Bounce.InOut', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(InOut(0)).toBeCloseTo(0, 10);
    });

    it('should return 1 when given 1', function ()
    {
        expect(InOut(1)).toBeCloseTo(1, 10);
    });

    it('should return 0.5 when given 0.5', function ()
    {
        expect(InOut(0.5)).toBeCloseTo(0.5, 10);
    });

    it('should return a value less than 0.5 for inputs less than 0.5', function ()
    {
        expect(InOut(0.1)).toBeLessThan(0.5);
        expect(InOut(0.25)).toBeLessThan(0.5);
        expect(InOut(0.49)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for inputs greater than 0.5', function ()
    {
        expect(InOut(0.51)).toBeGreaterThan(0.5);
        expect(InOut(0.75)).toBeGreaterThan(0.5);
        expect(InOut(0.9)).toBeGreaterThan(0.5);
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

    it('should be symmetric around 0.5', function ()
    {
        var testValues = [0.1, 0.2, 0.3, 0.4];
        for (var i = 0; i < testValues.length; i++)
        {
            var v = testValues[i];
            var low = InOut(v);
            var high = InOut(1 - v);
            expect(low + high).toBeCloseTo(1, 10);
        }
    });

    it('should produce bounce effect at the start (first bounce threshold)', function ()
    {
        // In the ease-in half (v < 0.5), we expect small non-monotonic values near start
        var near_start = InOut(0.05);
        expect(near_start).toBeGreaterThanOrEqual(0);
        expect(near_start).toBeLessThan(0.5);
    });

    it('should produce bounce effect at the end (last bounce threshold)', function ()
    {
        // In the ease-out half (v > 0.5), we expect large values near end
        var near_end = InOut(0.95);
        expect(near_end).toBeGreaterThan(0.5);
        expect(near_end).toBeLessThanOrEqual(1);
    });

    it('should hit the first bounce segment for values near 0.25', function ()
    {
        // v=0.25 maps to v_internal=0.5, which falls in the first bounce segment
        var result = InOut(0.25);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(0.5);
    });

    it('should hit the second bounce segment for values mapping to v_internal near 0.6', function ()
    {
        // v=0.2 maps to v_internal=0.6, which is > 1/2.75 (~0.3636) and < 2/2.75 (~0.7273)
        var result = InOut(0.2);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(0.5);
    });

    it('should hit the third bounce segment for values mapping to v_internal near 0.85', function ()
    {
        // v=0.075 maps to v_internal=0.85, which is > 2/2.75 (~0.7273) and < 2.5/2.75 (~0.9091)
        var result = InOut(0.075);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(0.5);
    });

    it('should hit the fourth bounce segment for values mapping to v_internal near 0.95', function ()
    {
        // v=0.025 maps to v_internal=0.95, which is > 2.5/2.75 (~0.9091)
        var result = InOut(0.025);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(0.5);
    });

    it('should be monotonically increasing overall from 0 to 1', function ()
    {
        // Averaged over coarse steps the general trend should be increasing
        expect(InOut(0)).toBeLessThan(InOut(0.25));
        expect(InOut(0.25)).toBeLessThan(InOut(0.5));
        expect(InOut(0.5)).toBeLessThan(InOut(0.75));
        expect(InOut(0.75)).toBeLessThan(InOut(1));
    });

    it('should return a number', function ()
    {
        expect(typeof InOut(0.5)).toBe('number');
        expect(typeof InOut(0)).toBe('number');
        expect(typeof InOut(1)).toBe('number');
    });

    it('should return exact 0.5 at midpoint v=0.5', function ()
    {
        expect(InOut(0.5)).toBe(0.5);
    });

    it('should produce mirrored output for symmetric inputs around 0.5', function ()
    {
        expect(InOut(0.3) + InOut(0.7)).toBeCloseTo(1, 10);
        expect(InOut(0.1) + InOut(0.9)).toBeCloseTo(1, 10);
        expect(InOut(0.05) + InOut(0.95)).toBeCloseTo(1, 10);
    });
});
