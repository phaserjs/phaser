var IsEvenStrict = require('../../src/math/IsEvenStrict');

describe('Phaser.Math.IsEvenStrict', function ()
{
    it('should return true for zero', function ()
    {
        expect(IsEvenStrict(0)).toBe(true);
    });

    it('should return true for positive even integers', function ()
    {
        expect(IsEvenStrict(2)).toBe(true);
        expect(IsEvenStrict(4)).toBe(true);
        expect(IsEvenStrict(100)).toBe(true);
    });

    it('should return false for positive odd integers', function ()
    {
        expect(IsEvenStrict(1)).toBe(false);
        expect(IsEvenStrict(3)).toBe(false);
        expect(IsEvenStrict(99)).toBe(false);
    });

    it('should return true for negative even integers', function ()
    {
        expect(IsEvenStrict(-2)).toBe(true);
        expect(IsEvenStrict(-4)).toBe(true);
        expect(IsEvenStrict(-100)).toBe(true);
    });

    it('should return false for negative odd integers', function ()
    {
        expect(IsEvenStrict(-1)).toBe(false);
        expect(IsEvenStrict(-3)).toBe(false);
        expect(IsEvenStrict(-99)).toBe(false);
    });

    it('should return true for even floating point numbers', function ()
    {
        expect(IsEvenStrict(2.0)).toBe(true);
        expect(IsEvenStrict(4.0)).toBe(true);
    });

    it('should return false for odd floating point numbers', function ()
    {
        expect(IsEvenStrict(1.0)).toBe(false);
        expect(IsEvenStrict(3.0)).toBe(false);
    });

    it('should return false for non-integer floats', function ()
    {
        expect(IsEvenStrict(1.5)).toBe(false);
        expect(IsEvenStrict(2.5)).toBe(false);
        expect(IsEvenStrict(-1.5)).toBe(false);
    });

    it('should return undefined for a string', function ()
    {
        expect(IsEvenStrict('2')).toBeUndefined();
        expect(IsEvenStrict('abc')).toBeUndefined();
    });

    it('should return undefined for null', function ()
    {
        expect(IsEvenStrict(null)).toBeUndefined();
    });

    it('should return undefined for undefined', function ()
    {
        expect(IsEvenStrict(undefined)).toBeUndefined();
    });

    it('should return undefined for a boolean', function ()
    {
        expect(IsEvenStrict(true)).toBeUndefined();
        expect(IsEvenStrict(false)).toBeUndefined();
    });

    it('should return undefined for an object', function ()
    {
        expect(IsEvenStrict({})).toBeUndefined();
    });

    it('should return undefined for an array', function ()
    {
        expect(IsEvenStrict([])).toBeUndefined();
    });

    it('should handle NaN as non-numeric', function ()
    {
        expect(IsEvenStrict(NaN)).toBeUndefined();
    });

    it('should handle Infinity', function ()
    {
        expect(IsEvenStrict(Infinity)).toBe(true);
        expect(IsEvenStrict(-Infinity)).toBe(true);
    });
});
