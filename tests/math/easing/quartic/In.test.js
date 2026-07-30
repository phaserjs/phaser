var In = require('../../../../src/math/easing/quartic/In');

describe('Phaser.Math.Easing.Quartic.In', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return v^4 for a mid-range value', function ()
    {
        expect(In(0.5)).toBeCloseTo(0.0625, 10);
    });

    it('should return v^4 for 0.25', function ()
    {
        expect(In(0.25)).toBeCloseTo(0.00390625, 10);
    });

    it('should return v^4 for 0.75', function ()
    {
        expect(In(0.75)).toBeCloseTo(0.31640625, 10);
    });

    it('should return positive value for negative input', function ()
    {
        expect(In(-0.5)).toBeCloseTo(0.0625, 10);
    });

    it('should return 1 for v of -1', function ()
    {
        expect(In(-1)).toBe(1);
    });

    it('should return a value greater than v for v in (0, 1)', function ()
    {
        var v = 0.3;
        expect(In(v)).toBeLessThan(v);
    });

    it('should return values in range [0, 1] for inputs in [0, 1]', function ()
    {
        var steps = 20;
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
        var steps = 20;
        for (var i = 1; i <= steps; i++)
        {
            var v = i / steps;
            var result = In(v);
            expect(result).toBeGreaterThanOrEqual(prev);
            prev = result;
        }
    });

    it('should handle large values', function ()
    {
        expect(In(2)).toBeCloseTo(16, 10);
        expect(In(3)).toBeCloseTo(81, 10);
    });

    it('should handle very small values', function ()
    {
        expect(In(0.1)).toBeCloseTo(0.0001, 10);
    });
});
