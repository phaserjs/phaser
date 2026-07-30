var In = require('../../../../src/math/easing/sine/In');

describe('Phaser.Math.Easing.Sine.In', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return a value between 0 and 1 for mid-range input', function ()
    {
        var result = In(0.5);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(1);
    });

    it('should return the correct value for v = 0.5', function ()
    {
        expect(In(0.5)).toBeCloseTo(1 - Math.cos(0.5 * Math.PI / 2), 10);
    });

    it('should return the correct value for v = 0.25', function ()
    {
        expect(In(0.25)).toBeCloseTo(1 - Math.cos(0.25 * Math.PI / 2), 10);
    });

    it('should return the correct value for v = 0.75', function ()
    {
        expect(In(0.75)).toBeCloseTo(1 - Math.cos(0.75 * Math.PI / 2), 10);
    });

    it('should produce a monotonically increasing curve across the range', function ()
    {
        var prev = In(0);
        for (var i = 1; i <= 10; i++)
        {
            var current = In(i / 10);
            expect(current).toBeGreaterThanOrEqual(prev);
            prev = current;
        }
    });

    it('should start slowly (ease-in: output near 0 should be less than linear)', function ()
    {
        var v = 0.1;
        expect(In(v)).toBeLessThan(v);
    });

    it('should end quickly (ease-in: output near 1 should be less than linear)', function ()
    {
        var v = 0.9;
        expect(In(v)).toBeLessThan(v);
    });

    it('should handle values outside the 0-1 range without clamping', function ()
    {
        expect(In(-0.5)).toBeCloseTo(1 - Math.cos(-0.5 * Math.PI / 2), 10);
        expect(In(1.5)).toBeCloseTo(1 - Math.cos(1.5 * Math.PI / 2), 10);
    });

    it('should return a number for all inputs', function ()
    {
        expect(typeof In(0)).toBe('number');
        expect(typeof In(0.5)).toBe('number');
        expect(typeof In(1)).toBe('number');
    });
});
