var SortByDigits = require('../../../src/utils/array/SortByDigits');

describe('Phaser.Utils.Array.SortByDigits', function ()
{
    it('should return the same array reference', function ()
    {
        var arr = ['3a', '1b', '2c'];
        var result = SortByDigits(arr);
        expect(result).toBe(arr);
    });

    it('should sort strings by their numeric digits ascending', function ()
    {
        var arr = ['item3', 'item1', 'item2'];
        SortByDigits(arr);
        expect(arr[0]).toBe('item1');
        expect(arr[1]).toBe('item2');
        expect(arr[2]).toBe('item3');
    });

    it('should sort strings with leading non-digit characters', function ()
    {
        var arr = ['abc30', 'abc10', 'abc20'];
        SortByDigits(arr);
        expect(arr[0]).toBe('abc10');
        expect(arr[1]).toBe('abc20');
        expect(arr[2]).toBe('abc30');
    });

    it('should sort strings with mixed non-digit characters', function ()
    {
        var arr = ['a3b', 'a1b', 'a2b'];
        SortByDigits(arr);
        expect(arr[0]).toBe('a1b');
        expect(arr[1]).toBe('a2b');
        expect(arr[2]).toBe('a3b');
    });

    it('should handle already sorted arrays', function ()
    {
        var arr = ['a1', 'a2', 'a3'];
        SortByDigits(arr);
        expect(arr[0]).toBe('a1');
        expect(arr[1]).toBe('a2');
        expect(arr[2]).toBe('a3');
    });

    it('should handle reverse sorted arrays', function ()
    {
        var arr = ['z9', 'z5', 'z1'];
        SortByDigits(arr);
        expect(arr[0]).toBe('z1');
        expect(arr[1]).toBe('z5');
        expect(arr[2]).toBe('z9');
    });

    it('should handle an array with a single element', function ()
    {
        var arr = ['item42'];
        SortByDigits(arr);
        expect(arr[0]).toBe('item42');
    });

    it('should handle an empty array', function ()
    {
        var arr = [];
        SortByDigits(arr);
        expect(arr.length).toBe(0);
    });

    it('should handle strings with multi-digit numbers', function ()
    {
        var arr = ['item100', 'item20', 'item3'];
        SortByDigits(arr);
        expect(arr[0]).toBe('item3');
        expect(arr[1]).toBe('item20');
        expect(arr[2]).toBe('item100');
    });

    it('should concatenate all digits when multiple digit groups exist', function ()
    {
        var arr = ['a1b2', 'a2b1'];
        SortByDigits(arr);
        expect(arr[0]).toBe('a1b2');
        expect(arr[1]).toBe('a2b1');
    });

    it('should handle strings with only digits', function ()
    {
        var arr = ['300', '10', '25'];
        SortByDigits(arr);
        expect(arr[0]).toBe('10');
        expect(arr[1]).toBe('25');
        expect(arr[2]).toBe('300');
    });

    it('should treat strings with no digits as NaN and sort them to the front', function ()
    {
        var arr = ['abc', 'item1', 'item2'];
        SortByDigits(arr);
        expect(arr[arr.length - 1]).toBe('item2');
    });

    it('should sort a large unsorted array correctly', function ()
    {
        var arr = ['frame9', 'frame3', 'frame7', 'frame1', 'frame5', 'frame2', 'frame8', 'frame4', 'frame6', 'frame0'];
        SortByDigits(arr);
        expect(arr[0]).toBe('frame0');
        expect(arr[1]).toBe('frame1');
        expect(arr[2]).toBe('frame2');
        expect(arr[3]).toBe('frame3');
        expect(arr[4]).toBe('frame4');
        expect(arr[5]).toBe('frame5');
        expect(arr[6]).toBe('frame6');
        expect(arr[7]).toBe('frame7');
        expect(arr[8]).toBe('frame8');
        expect(arr[9]).toBe('frame9');
    });
});
