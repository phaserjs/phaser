var SendToBack = require('../../../src/utils/array/SendToBack');

describe('Phaser.Utils.Array.SendToBack', function ()
{
    it('should move an element from the end to index 0', function ()
    {
        var arr = [1, 2, 3, 4];
        SendToBack(arr, 4);
        expect(arr[0]).toBe(4);
        expect(arr).toEqual([4, 1, 2, 3]);
    });

    it('should move an element from the middle to index 0', function ()
    {
        var arr = [1, 2, 3, 4];
        SendToBack(arr, 2);
        expect(arr[0]).toBe(2);
        expect(arr).toEqual([2, 1, 3, 4]);
    });

    it('should return the moved item', function ()
    {
        var arr = [1, 2, 3];
        var result = SendToBack(arr, 3);
        expect(result).toBe(3);
    });

    it('should leave array unchanged if item is already at index 0', function ()
    {
        var arr = [1, 2, 3, 4];
        SendToBack(arr, 1);
        expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('should return the item even if already at index 0', function ()
    {
        var arr = [1, 2, 3];
        var result = SendToBack(arr, 1);
        expect(result).toBe(1);
    });

    it('should leave array unchanged if item is not found', function ()
    {
        var arr = [1, 2, 3, 4];
        SendToBack(arr, 99);
        expect(arr).toEqual([1, 2, 3, 4]);
    });

    it('should return the item even if not found in array', function ()
    {
        var arr = [1, 2, 3];
        var result = SendToBack(arr, 99);
        expect(result).toBe(99);
    });

    it('should not change the length of the array', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        SendToBack(arr, 5);
        expect(arr.length).toBe(5);
    });

    it('should work with object references', function ()
    {
        var a = { id: 'a' };
        var b = { id: 'b' };
        var c = { id: 'c' };
        var arr = [a, b, c];
        SendToBack(arr, c);
        expect(arr[0]).toBe(c);
        expect(arr).toEqual([c, a, b]);
    });

    it('should work with a two-element array', function ()
    {
        var arr = [1, 2];
        SendToBack(arr, 2);
        expect(arr).toEqual([2, 1]);
    });

    it('should work with a single-element array', function ()
    {
        var arr = [1];
        SendToBack(arr, 1);
        expect(arr).toEqual([1]);
    });

    it('should modify the array in-place', function ()
    {
        var arr = [1, 2, 3];
        var original = arr;
        SendToBack(arr, 3);
        expect(arr).toBe(original);
    });

    it('should work with string elements', function ()
    {
        var arr = ['a', 'b', 'c'];
        SendToBack(arr, 'c');
        expect(arr).toEqual(['c', 'a', 'b']);
    });
});
