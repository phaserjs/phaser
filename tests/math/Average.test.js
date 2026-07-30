var Average = require('../../src/math/Average');

describe('Phaser.Math.Average', function ()
{
    it('should return the average of a set of positive integers', function ()
    {
        expect(Average([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should return the value itself when given a single element', function ()
    {
        expect(Average([7])).toBe(7);
    });

    it('should return zero when given a single zero', function ()
    {
        expect(Average([0])).toBe(0);
    });

    it('should return zero when all values are zero', function ()
    {
        expect(Average([0, 0, 0])).toBe(0);
    });

    it('should handle negative values', function ()
    {
        expect(Average([-1, -2, -3])).toBe(-2);
    });

    it('should handle a mix of positive and negative values', function ()
    {
        expect(Average([-5, 5])).toBe(0);
    });

    it('should handle floating point values', function ()
    {
        expect(Average([1.5, 2.5, 3.0])).toBeCloseTo(2.333, 3);
    });

    it('should handle two values', function ()
    {
        expect(Average([10, 20])).toBe(15);
    });

    it('should handle large numbers', function ()
    {
        expect(Average([1000000, 2000000, 3000000])).toBe(2000000);
    });

    it('should coerce numeric strings to numbers', function ()
    {
        expect(Average(['2', '4', '6'])).toBe(4);
    });

    it('should return NaN for an empty array', function ()
    {
        expect(Average([])).toBeNaN();
    });

    it('should return the correct average for identical values', function ()
    {
        expect(Average([5, 5, 5, 5])).toBe(5);
    });

    it('should handle decimal results correctly', function ()
    {
        expect(Average([1, 2])).toBeCloseTo(1.5);
    });
});
