var RotateRight = require('../../../src/utils/array/RotateRight');

describe('Phaser.Utils.Array.RotateRight', function ()
{
    it('should move the last element to the front', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateRight(arr);
        expect(arr[0]).toBe(5);
        expect(arr[1]).toBe(1);
        expect(arr[2]).toBe(2);
        expect(arr[3]).toBe(3);
        expect(arr[4]).toBe(4);
    });

    it('should return the shifted element', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = RotateRight(arr);
        expect(result).toBe(5);
    });

    it('should default total to 1 when not provided', function ()
    {
        var arr = ['a', 'b', 'c'];
        RotateRight(arr);
        expect(arr).toEqual(['c', 'a', 'b']);
    });

    it('should rotate multiple times when total is specified', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateRight(arr, 3);
        expect(arr).toEqual([3, 4, 5, 1, 2]);
    });

    it('should return the last shifted element when total is greater than 1', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = RotateRight(arr, 3);
        expect(result).toBe(3);
    });

    it('should not modify the array when total is 0', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = RotateRight(arr, 0);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
        expect(result).toBeNull();
    });

    it('should work with a single element array', function ()
    {
        var arr = [42];
        var result = RotateRight(arr);
        expect(arr).toEqual([42]);
        expect(result).toBe(42);
    });

    it('should work with a two element array', function ()
    {
        var arr = [1, 2];
        var result = RotateRight(arr);
        expect(arr).toEqual([2, 1]);
        expect(result).toBe(2);
    });

    it('should preserve array length after rotation', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateRight(arr, 3);
        expect(arr.length).toBe(5);
    });

    it('should work with string elements', function ()
    {
        var arr = ['a', 'b', 'c', 'd'];
        RotateRight(arr);
        expect(arr).toEqual(['d', 'a', 'b', 'c']);
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];
        var result = RotateRight(arr);
        expect(arr[0]).toBe(obj3);
        expect(arr[1]).toBe(obj1);
        expect(arr[2]).toBe(obj2);
        expect(result).toBe(obj3);
    });

    it('should handle total equal to array length resulting in same order', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateRight(arr, 5);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it('should modify the array in place', function ()
    {
        var arr = [1, 2, 3];
        var ref = arr;
        RotateRight(arr);
        expect(arr).toBe(ref);
    });
});
