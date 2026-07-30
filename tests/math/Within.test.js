var Within = require('../../src/math/Within');

describe('Phaser.Math.Within', function ()
{
    it('should return true when values are equal', function ()
    {
        expect(Within(5, 5, 0)).toBe(true);
    });

    it('should return true when difference equals tolerance', function ()
    {
        expect(Within(10, 5, 5)).toBe(true);
    });

    it('should return true when difference is less than tolerance', function ()
    {
        expect(Within(6, 5, 2)).toBe(true);
    });

    it('should return false when difference exceeds tolerance', function ()
    {
        expect(Within(10, 5, 4)).toBe(false);
    });

    it('should return true when a is less than b and within tolerance', function ()
    {
        expect(Within(3, 5, 2)).toBe(true);
    });

    it('should return false when a is less than b and outside tolerance', function ()
    {
        expect(Within(2, 5, 2)).toBe(false);
    });

    it('should work with negative values', function ()
    {
        expect(Within(-5, -3, 2)).toBe(true);
        expect(Within(-5, -3, 1)).toBe(false);
    });

    it('should work with zero tolerance', function ()
    {
        expect(Within(5, 5, 0)).toBe(true);
        expect(Within(5, 6, 0)).toBe(false);
    });

    it('should work with floating point values', function ()
    {
        expect(Within(1.5, 1.0, 0.5)).toBe(true);
        expect(Within(1.5, 1.0, 0.4)).toBe(false);
    });

    it('should handle large numbers', function ()
    {
        expect(Within(1000000, 999999, 1)).toBe(true);
        expect(Within(1000000, 999998, 1)).toBe(false);
    });

    it('should handle mixed positive and negative values', function ()
    {
        expect(Within(-5, 5, 10)).toBe(true);
        expect(Within(-5, 5, 9)).toBe(false);
    });

    it('should return true with a large tolerance', function ()
    {
        expect(Within(0, 100, 100)).toBe(true);
        expect(Within(0, 101, 100)).toBe(false);
    });
});
