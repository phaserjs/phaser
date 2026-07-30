var In = require('../../../../src/math/easing/circular/In');

describe('Phaser.Math.Easing.Circular.In', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when given 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return a value between 0 and 1 for inputs in the range (0, 1)', function ()
    {
        var result = In(0.5);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(1);
    });

    it('should return the correct value at v = 0.5', function ()
    {
        expect(In(0.5)).toBeCloseTo(1 - Math.sqrt(1 - 0.25), 10);
    });

    it('should return the correct value at v = 0.25', function ()
    {
        expect(In(0.25)).toBeCloseTo(1 - Math.sqrt(1 - 0.0625), 10);
    });

    it('should return the correct value at v = 0.75', function ()
    {
        expect(In(0.75)).toBeCloseTo(1 - Math.sqrt(1 - 0.5625), 10);
    });

    it('should produce an ease-in curve (output less than input for midrange values)', function ()
    {
        expect(In(0.5)).toBeLessThan(0.5);
    });

    it('should be monotonically increasing across the range [0, 1]', function ()
    {
        var prev = In(0);
        for (var i = 1; i <= 10; i++)
        {
            var v = i / 10;
            var curr = In(v);
            expect(curr).toBeGreaterThanOrEqual(prev);
            prev = curr;
        }
    });

    it('should accelerate toward the end (larger increments near v = 1)', function ()
    {
        var deltaLow = In(0.2) - In(0.1);
        var deltaHigh = In(0.9) - In(0.8);
        expect(deltaHigh).toBeGreaterThan(deltaLow);
    });

    it('should handle v = -1 without throwing', function ()
    {
        expect(function () { In(-1); }).not.toThrow();
    });

    it('should return 1 for v = -1 (same as v = 1 due to squaring)', function ()
    {
        expect(In(-1)).toBeCloseTo(1, 10);
    });

    it('should return a number for any numeric input', function ()
    {
        expect(typeof In(0.3)).toBe('number');
        expect(typeof In(0)).toBe('number');
        expect(typeof In(1)).toBe('number');
    });
});
