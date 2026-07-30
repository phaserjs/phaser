var Median = require('../../src/math/Median');

describe('Phaser.Math.Median', function ()
{
    it('should return zero for an empty array', function ()
    {
        expect(Median([])).toBe(0);
    });

    it('should return the single value for a one-element array', function ()
    {
        expect(Median([7])).toBe(7);
    });

    it('should return the middle value for an odd-length array', function ()
    {
        expect(Median([1, 2, 3])).toBe(2);
    });

    it('should return the average of the two middle values for an even-length array', function ()
    {
        expect(Median([1, 2, 3, 4])).toBe(2.5);
    });

    it('should sort unsorted values before finding the median', function ()
    {
        expect(Median([5, 1, 3])).toBe(3);
    });

    it('should handle unsorted even-length arrays', function ()
    {
        expect(Median([4, 1, 3, 2])).toBe(2.5);
    });

    it('should work with negative values', function ()
    {
        expect(Median([-3, -1, -2])).toBe(-2);
    });

    it('should work with mixed positive and negative values', function ()
    {
        expect(Median([-2, 0, 2])).toBe(0);
    });

    it('should work with floating point values', function ()
    {
        expect(Median([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
    });

    it('should return the average of two middle floats for even-length array', function ()
    {
        expect(Median([1.0, 2.0, 3.0, 4.0])).toBeCloseTo(2.5);
    });

    it('should handle duplicate values', function ()
    {
        expect(Median([3, 3, 3])).toBe(3);
    });

    it('should handle two equal values', function ()
    {
        expect(Median([5, 5])).toBe(5);
    });

    it('should handle two different values by averaging them', function ()
    {
        expect(Median([1, 3])).toBe(2);
    });

    it('should handle large arrays with an odd number of elements', function ()
    {
        expect(Median([10, 20, 30, 40, 50])).toBe(30);
    });

    it('should handle large arrays with an even number of elements', function ()
    {
        expect(Median([10, 20, 30, 40, 50, 60])).toBe(35);
    });

    it('should handle zero values in the array', function ()
    {
        expect(Median([0, 0, 0])).toBe(0);
    });

    it('should handle a two-element array', function ()
    {
        expect(Median([4, 8])).toBe(6);
    });

    it('should sort the input array as a side effect', function ()
    {
        var values = [3, 1, 2];
        Median(values);
        expect(values[0]).toBe(1);
        expect(values[1]).toBe(2);
        expect(values[2]).toBe(3);
    });
});
