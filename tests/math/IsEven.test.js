var IsEven = require('../../src/math/IsEven');

describe('Phaser.Math.IsEven', function ()
{
    it('should return true for positive even integers', function ()
    {
        expect(IsEven(2)).toBe(true);
        expect(IsEven(4)).toBe(true);
        expect(IsEven(100)).toBe(true);
    });

    it('should return false for positive odd integers', function ()
    {
        expect(IsEven(1)).toBe(false);
        expect(IsEven(3)).toBe(false);
        expect(IsEven(99)).toBe(false);
    });

    it('should return true for zero', function ()
    {
        expect(IsEven(0)).toBe(true);
    });

    it('should return true for negative even integers', function ()
    {
        expect(IsEven(-2)).toBe(true);
        expect(IsEven(-4)).toBe(true);
        expect(IsEven(-100)).toBe(true);
    });

    it('should return false for negative odd integers', function ()
    {
        expect(IsEven(-1)).toBe(false);
        expect(IsEven(-3)).toBe(false);
        expect(IsEven(-99)).toBe(false);
    });

    it('should return true for even floating point values', function ()
    {
        expect(IsEven(2.0)).toBe(true);
        expect(IsEven(4.0)).toBe(true);
    });

    it('should return false for non-integer floating point values', function ()
    {
        expect(IsEven(2.5)).toBe(false);
        expect(IsEven(1.5)).toBe(false);
    });

    it('should return undefined for non-numeric strings', function ()
    {
        expect(IsEven('hello')).toBeUndefined();
        expect(IsEven('abc')).toBeUndefined();
    });

    it('should return a result for numeric strings', function ()
    {
        expect(IsEven('2')).toBe(true);
        expect(IsEven('3')).toBe(false);
    });

    it('should return undefined for null', function ()
    {
        expect(IsEven(null)).toBeUndefined();
    });

    it('should return undefined for undefined', function ()
    {
        expect(IsEven(undefined)).toBeUndefined();
    });

    it('should return undefined for objects', function ()
    {
        expect(IsEven({})).toBeUndefined();
        expect(IsEven([])).toBeUndefined();
    });

    it('should return a boolean for valid numeric input', function ()
    {
        expect(typeof IsEven(2)).toBe('boolean');
        expect(typeof IsEven(3)).toBe('boolean');
    });

    it('should handle large even numbers', function ()
    {
        expect(IsEven(1000000)).toBe(true);
        expect(IsEven(999999)).toBe(false);
    });
});
