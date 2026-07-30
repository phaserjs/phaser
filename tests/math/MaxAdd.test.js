var MaxAdd = require('../../src/math/MaxAdd');

describe('Phaser.Math.MaxAdd', function ()
{
    it('should return value plus amount when result is below max', function ()
    {
        expect(MaxAdd(5, 3, 20)).toBe(8);
    });

    it('should return max when value plus amount equals max', function ()
    {
        expect(MaxAdd(5, 5, 10)).toBe(10);
    });

    it('should return max when value plus amount exceeds max', function ()
    {
        expect(MaxAdd(8, 5, 10)).toBe(10);
    });

    it('should return value plus amount when amount is zero', function ()
    {
        expect(MaxAdd(5, 0, 10)).toBe(5);
    });

    it('should return max when value already equals max', function ()
    {
        expect(MaxAdd(10, 0, 10)).toBe(10);
    });

    it('should return max when value exceeds max with no amount', function ()
    {
        expect(MaxAdd(15, 0, 10)).toBe(10);
    });

    it('should work with negative values', function ()
    {
        expect(MaxAdd(-5, 3, 10)).toBe(-2);
    });

    it('should work with negative amount', function ()
    {
        expect(MaxAdd(5, -3, 10)).toBe(2);
    });

    it('should work with negative max', function ()
    {
        expect(MaxAdd(-10, 3, -5)).toBe(-7);
        expect(MaxAdd(-4, 3, -5)).toBe(-5);
    });

    it('should work with zero value', function ()
    {
        expect(MaxAdd(0, 5, 10)).toBe(5);
    });

    it('should work with zero max', function ()
    {
        expect(MaxAdd(-5, 3, 0)).toBe(-2);
        expect(MaxAdd(-1, 5, 0)).toBe(0);
    });

    it('should work with floating point values', function ()
    {
        expect(MaxAdd(1.5, 2.5, 10)).toBeCloseTo(4.0);
        expect(MaxAdd(1.5, 9.5, 10)).toBeCloseTo(10.0);
    });

    it('should return max when large amount is added', function ()
    {
        expect(MaxAdd(0, 1000, 100)).toBe(100);
    });

    it('should work when all values are equal', function ()
    {
        expect(MaxAdd(5, 0, 5)).toBe(5);
    });
});
