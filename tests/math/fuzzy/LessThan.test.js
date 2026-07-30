var LessThan = require('../../../src/math/fuzzy/LessThan');

describe('Phaser.Math.Fuzzy.LessThan', function ()
{
    it('should return true when a is clearly less than b', function ()
    {
        expect(LessThan(1, 5)).toBe(true);
    });

    it('should return false when a is clearly greater than b', function ()
    {
        expect(LessThan(5, 1)).toBe(false);
    });

    it('should return true when a equals b due to fuzzy tolerance', function ()
    {
        expect(LessThan(1, 1)).toBe(true);
    });

    it('should return true when a is slightly less than b within default epsilon', function ()
    {
        expect(LessThan(0.9999, 1)).toBe(true);
    });

    it('should return true when a is slightly greater than b but within default epsilon', function ()
    {
        expect(LessThan(1.00005, 1)).toBe(true);
    });

    it('should return false when a exceeds b plus default epsilon', function ()
    {
        expect(LessThan(1.0002, 1)).toBe(false);
    });

    it('should use default epsilon of 0.0001 when not provided', function ()
    {
        expect(LessThan(1.00009, 1)).toBe(true);
        expect(LessThan(1.00011, 1)).toBe(false);
    });

    it('should respect a custom epsilon value', function ()
    {
        expect(LessThan(1.05, 1, 0.1)).toBe(true);
        expect(LessThan(1.15, 1, 0.1)).toBe(false);
    });

    it('should return true when a equals b exactly with custom epsilon', function ()
    {
        expect(LessThan(5, 5, 0.5)).toBe(true);
    });

    it('should work with negative numbers', function ()
    {
        expect(LessThan(-5, -1)).toBe(true);
        expect(LessThan(-1, -5)).toBe(false);
    });

    it('should work with negative numbers near the boundary', function ()
    {
        expect(LessThan(-1.00005, -1)).toBe(true);
        expect(LessThan(-0.9998, -1)).toBe(false);
    });

    it('should work with zero values', function ()
    {
        expect(LessThan(0, 0)).toBe(true);
        expect(LessThan(0, 1)).toBe(true);
        expect(LessThan(1, 0)).toBe(false);
    });

    it('should work with large numbers', function ()
    {
        expect(LessThan(1000, 2000)).toBe(true);
        expect(LessThan(2000, 1000)).toBe(false);
    });

    it('should work with floating point values', function ()
    {
        expect(LessThan(0.1, 0.2)).toBe(true);
        expect(LessThan(0.2, 0.1)).toBe(false);
    });

    it('should return false when a is exactly at b plus epsilon boundary', function ()
    {
        expect(LessThan(1.0001, 1, 0.0001)).toBe(false);
    });

    it('should return false when a is just beyond b plus epsilon', function ()
    {
        expect(LessThan(1.00011, 1, 0.0001)).toBe(false);
    });

    it('should work with epsilon of zero', function ()
    {
        expect(LessThan(0.5, 1, 0)).toBe(true);
        expect(LessThan(1, 1, 0)).toBe(false);
        expect(LessThan(1.5, 1, 0)).toBe(false);
    });
});
