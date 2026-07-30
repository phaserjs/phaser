var Difference = require('../../src/math/Difference');

describe('Phaser.Math.Difference', function ()
{
    it('should return the positive difference when a > b', function ()
    {
        expect(Difference(10, 3)).toBe(7);
    });

    it('should return the positive difference when a < b', function ()
    {
        expect(Difference(3, 10)).toBe(7);
    });

    it('should return 0 when both values are equal', function ()
    {
        expect(Difference(5, 5)).toBe(0);
    });

    it('should work with negative numbers', function ()
    {
        expect(Difference(-5, -10)).toBe(5);
        expect(Difference(-10, 5)).toBe(15);
    });

    it('should work with zero', function ()
    {
        expect(Difference(0, 10)).toBe(10);
        expect(Difference(10, 0)).toBe(10);
        expect(Difference(0, 0)).toBe(0);
    });

    it('should work with floating point values', function ()
    {
        expect(Difference(1.5, 0.5)).toBeCloseTo(1.0);
        expect(Difference(0.1, 0.3)).toBeCloseTo(0.2);
    });

    it('should work with large numbers', function ()
    {
        expect(Difference(1000000, 1)).toBe(999999);
    });
});
