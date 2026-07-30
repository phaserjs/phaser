var InOut = require('../../../../src/math/easing/quadratic/InOut');

describe('Phaser.Math.Easing.Quadratic.InOut', function ()
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

    it('should return a value less than 0.5 for v less than 0.5 (ease-in phase)', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for v greater than 0.5 (ease-out phase)', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
    });

    it('should be symmetric around 0.5', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75), 10);
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9), 10);
    });

    it('should calculate correctly in the ease-in phase (v < 0.5)', function ()
    {
        // v=0.25: v*=2 -> 0.5; 0.5 * 0.5 * 0.5 = 0.125
        expect(InOut(0.25)).toBeCloseTo(0.125, 10);
    });

    it('should calculate correctly in the ease-out phase (v > 0.5)', function ()
    {
        // v=0.75: v*=2 -> 1.5; --v -> 0.5; -0.5 * (0.5 * (0.5 - 2) - 1) = -0.5 * (-0.75 - 1) = -0.5 * -1.75 = 0.875
        expect(InOut(0.75)).toBeCloseTo(0.875, 10);
    });

    it('should produce values in the range [0, 1] for inputs in [0, 1]', function ()
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

    it('should be monotonically increasing across [0, 1]', function ()
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

    it('should ease in slowly near 0', function ()
    {
        // The rate of change near 0 should be smaller than near 0.5
        var delta1 = InOut(0.1) - InOut(0);
        var delta2 = InOut(0.5) - InOut(0.4);
        expect(delta1).toBeLessThan(delta2);
    });

    it('should ease out slowly near 1', function ()
    {
        // The rate of change near 1 should be smaller than near 0.5
        var delta1 = InOut(1) - InOut(0.9);
        var delta2 = InOut(0.6) - InOut(0.5);
        expect(delta1).toBeLessThan(delta2);
    });
});
