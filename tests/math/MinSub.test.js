var MinSub = require('../../src/math/MinSub');

describe('Phaser.Math.MinSub', function ()
{
    it('should subtract amount from value', function ()
    {
        expect(MinSub(10, 3, 0)).toBe(7);
    });

    it('should return min when result would be below min', function ()
    {
        expect(MinSub(5, 10, 0)).toBe(0);
    });

    it('should return min when result equals min exactly', function ()
    {
        expect(MinSub(10, 5, 5)).toBe(5);
    });

    it('should return value minus amount when result is above min', function ()
    {
        expect(MinSub(100, 1, 0)).toBe(99);
    });

    it('should work with negative min values', function ()
    {
        expect(MinSub(0, 5, -10)).toBe(-5);
    });

    it('should return min when result would be below negative min', function ()
    {
        expect(MinSub(0, 20, -10)).toBe(-10);
    });

    it('should work with negative value', function ()
    {
        expect(MinSub(-5, 3, -20)).toBe(-8);
    });

    it('should work with zero amount', function ()
    {
        expect(MinSub(10, 0, 0)).toBe(10);
    });

    it('should work with zero value', function ()
    {
        expect(MinSub(0, 0, 0)).toBe(0);
    });

    it('should work with floating point values', function ()
    {
        expect(MinSub(1.5, 0.5, 0)).toBeCloseTo(1.0);
    });

    it('should clamp to min with floating point values', function ()
    {
        expect(MinSub(0.5, 1.0, 0.0)).toBeCloseTo(0.0);
    });

    it('should work when value equals min', function ()
    {
        expect(MinSub(5, 3, 5)).toBe(5);
    });

    it('should work with large numbers', function ()
    {
        expect(MinSub(1000000, 1, 0)).toBe(999999);
    });

    it('should clamp large subtraction to min', function ()
    {
        expect(MinSub(10, 1000000, 0)).toBe(0);
    });
});
