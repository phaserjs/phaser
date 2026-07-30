var Ceil = require('../../../src/math/fuzzy/Ceil');

describe('Phaser.Math.Fuzzy.Ceil', function ()
{
    it('should return the ceiling of a plain integer', function ()
    {
        expect(Ceil(3)).toBe(3);
    });

    it('should return the ceiling of a positive float', function ()
    {
        expect(Ceil(3.5)).toBe(4);
    });

    it('should return the ceiling of a negative float', function ()
    {
        expect(Ceil(-3.5)).toBe(-3);
    });

    it('should use default epsilon of 0.0001', function ()
    {
        // 3.0001 - 0.0001 = 3.0000, ceil = 3
        expect(Ceil(3.0001)).toBe(3);
    });

    it('should treat values just above an integer boundary as that integer', function ()
    {
        // 3.00005 - 0.0001 = 2.99995, ceil = 3
        expect(Ceil(3.00005)).toBe(3);
    });

    it('should round up values clearly above the epsilon boundary', function ()
    {
        // 3.001 - 0.0001 = 3.0009, ceil = 4
        expect(Ceil(3.001)).toBe(4);
    });

    it('should accept a custom epsilon value', function ()
    {
        // 3.5 - 0.6 = 2.9, ceil = 3
        expect(Ceil(3.5, 0.6)).toBe(3);
    });

    it('should work with epsilon of zero', function ()
    {
        expect(Ceil(3.0, 0)).toBe(3);
        expect(Ceil(3.5, 0)).toBe(4);
    });

    it('should return zero for input of zero', function ()
    {
        expect(Ceil(0) === 0).toBe(true);
    });

    it('should work with negative integers', function ()
    {
        expect(Ceil(-3)).toBe(-3);
    });

    it('should work with large positive values', function ()
    {
        expect(Ceil(1000.5)).toBe(1001);
    });

    it('should work with large negative values', function ()
    {
        expect(Ceil(-1000.5)).toBe(-1000);
    });

    it('should handle floating point imprecision near integer boundaries', function ()
    {
        // 2.9999 - 0.0001 = 2.9998, ceil = 3
        expect(Ceil(2.9999)).toBe(3);
    });

    it('should handle a value exactly equal to epsilon above an integer', function ()
    {
        // value = 4 + 0.0001, value - 0.0001 = 4.0, ceil = 4
        expect(Ceil(4.0001)).toBe(4);
    });

    it('should handle very small positive values', function ()
    {
        // 0.5 - 0.0001 = 0.4999, ceil = 1
        expect(Ceil(0.5)).toBe(1);
    });

    it('should handle very small negative values', function ()
    {
        // -0.5 - 0.0001 = -0.5001, ceil = 0 (may be -0)
        expect(Ceil(-0.5) === 0).toBe(true);
    });
});
