var GreaterThan = require('../../../src/math/fuzzy/GreaterThan');

describe('Phaser.Math.Fuzzy.GreaterThan', function ()
{
    it('should return true when a is clearly greater than b', function ()
    {
        expect(GreaterThan(10, 5)).toBe(true);
    });

    it('should return false when a is clearly less than b', function ()
    {
        expect(GreaterThan(5, 10)).toBe(false);
    });

    it('should return true when a equals b (within default epsilon)', function ()
    {
        expect(GreaterThan(5, 5)).toBe(true);
    });

    it('should return true when a is slightly less than b but within default epsilon', function ()
    {
        expect(GreaterThan(4.99995, 5)).toBe(true);
    });

    it('should return false when a is less than b by more than default epsilon', function ()
    {
        expect(GreaterThan(4.999, 5)).toBe(false);
    });

    it('should use default epsilon of 0.0001 when not provided', function ()
    {
        expect(GreaterThan(5.0001, 5)).toBe(true);
        expect(GreaterThan(4.9998, 5)).toBe(false);
    });

    it('should respect a custom epsilon value', function ()
    {
        expect(GreaterThan(4.5, 5, 1)).toBe(true);
        expect(GreaterThan(3.9, 5, 1)).toBe(false);
    });

    it('should return true when a equals b with custom epsilon', function ()
    {
        expect(GreaterThan(5, 5, 0.5)).toBe(true);
    });

    it('should work with negative values', function ()
    {
        expect(GreaterThan(-3, -5)).toBe(true);
        expect(GreaterThan(-5, -3)).toBe(false);
    });

    it('should work when both values are negative and equal', function ()
    {
        expect(GreaterThan(-5, -5)).toBe(true);
    });

    it('should work with zero', function ()
    {
        expect(GreaterThan(0, 0)).toBe(true);
        expect(GreaterThan(1, 0)).toBe(true);
        expect(GreaterThan(-1, 0)).toBe(false);
    });

    it('should work with floating point values', function ()
    {
        expect(GreaterThan(0.2, 0.1)).toBe(true);
        expect(GreaterThan(0.1, 0.2)).toBe(false);
    });

    it('should return true when a is just above the fuzzy threshold', function ()
    {
        expect(GreaterThan(5.0002, 5, 0.0001)).toBe(true);
    });

    it('should return false when a is just below the fuzzy threshold', function ()
    {
        expect(GreaterThan(4.9998, 5, 0.0001)).toBe(false);
    });

    it('should work with a large epsilon making loose comparisons', function ()
    {
        expect(GreaterThan(0, 100, 101)).toBe(true);
        expect(GreaterThan(0, 100, 99)).toBe(false);
    });

    it('should work with very small epsilon for strict comparisons', function ()
    {
        expect(GreaterThan(5.000001, 5, 0.000001)).toBe(true);
        expect(GreaterThan(4.999999, 5, 0.000001)).toBe(false);
    });
});
