var NumberArray = require('../../../src/utils/array/NumberArray');

describe('Phaser.Utils.Array.NumberArray', function ()
{
    it('should return an ascending range of integers', function ()
    {
        expect(NumberArray(0, 9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should return an ascending range starting from a non-zero value', function ()
    {
        expect(NumberArray(2, 4)).toEqual([2, 3, 4]);
    });

    it('should return a descending range when end is less than start', function ()
    {
        expect(NumberArray(8, 2)).toEqual([8, 7, 6, 5, 4, 3, 2]);
    });

    it('should return a single-element array when start equals end', function ()
    {
        expect(NumberArray(5, 5)).toEqual([5]);
    });

    it('should return negative number ranges', function ()
    {
        expect(NumberArray(-3, 0)).toEqual([-3, -2, -1, 0]);
    });

    it('should return a descending range of negative numbers', function ()
    {
        expect(NumberArray(0, -3)).toEqual([0, -1, -2, -3]);
    });

    it('should prefix each number with the given string', function ()
    {
        expect(NumberArray(1, 4, 'Level ')).toEqual(['Level 1', 'Level 2', 'Level 3', 'Level 4']);
    });

    it('should suffix each number with the given string', function ()
    {
        expect(NumberArray(1, 3, '', '.png')).toEqual(['1.png', '2.png', '3.png']);
    });

    it('should apply both prefix and suffix to each number', function ()
    {
        expect(NumberArray(5, 7, 'HD-', '.png')).toEqual(['HD-5.png', 'HD-6.png', 'HD-7.png']);
    });

    it('should return strings when only a suffix is provided', function ()
    {
        expect(NumberArray(1, 3, undefined, 'px')).toEqual(['1px', '2px', '3px']);
    });

    it('should return strings when only a prefix is provided', function ()
    {
        expect(NumberArray(1, 3, 'item_')).toEqual(['item_1', 'item_2', 'item_3']);
    });

    it('should apply prefix and suffix to descending ranges', function ()
    {
        expect(NumberArray(3, 1, 'Level ')).toEqual(['Level 3', 'Level 2', 'Level 1']);
    });

    it('should return an empty array when start and end are equal and result is a single element', function ()
    {
        var result = NumberArray(0, 0);
        expect(result).toEqual([0]);
        expect(result.length).toBe(1);
    });

    it('should return numbers not strings when no prefix or suffix is provided', function ()
    {
        var result = NumberArray(1, 3);
        expect(typeof result[0]).toBe('number');
        expect(typeof result[1]).toBe('number');
        expect(typeof result[2]).toBe('number');
    });

    it('should return strings when a prefix is provided', function ()
    {
        var result = NumberArray(1, 3, 'x');
        expect(typeof result[0]).toBe('string');
    });

    it('should return strings when a suffix is provided', function ()
    {
        var result = NumberArray(1, 3, undefined, 'y');
        expect(typeof result[0]).toBe('string');
    });

    it('should handle zero as start and end', function ()
    {
        expect(NumberArray(0, 0)).toEqual([0]);
    });

    it('should handle large ranges', function ()
    {
        var result = NumberArray(1, 100);
        expect(result.length).toBe(100);
        expect(result[0]).toBe(1);
        expect(result[99]).toBe(100);
    });

    it('should handle negative start and positive end', function ()
    {
        expect(NumberArray(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    });

    it('should use empty string for prefix when only suffix is given', function ()
    {
        var result = NumberArray(1, 2, undefined, '!');
        expect(result[0]).toBe('1!');
        expect(result[1]).toBe('2!');
    });
});
