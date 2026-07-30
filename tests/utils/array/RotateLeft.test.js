var RotateLeft = require('../../../src/utils/array/RotateLeft');

describe('Phaser.Utils.Array.RotateLeft', function ()
{
    it('should move the first element to the end', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateLeft(arr);
        expect(arr).toEqual([2, 3, 4, 5, 1]);
    });

    it('should return the shifted element', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = RotateLeft(arr);
        expect(result).toBe(1);
    });

    it('should default total to 1 when not provided', function ()
    {
        var arr = ['a', 'b', 'c'];
        RotateLeft(arr);
        expect(arr).toEqual(['b', 'c', 'a']);
    });

    it('should rotate multiple times when total is specified', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateLeft(arr, 3);
        expect(arr).toEqual([4, 5, 1, 2, 3]);
    });

    it('should return the last shifted element when total > 1', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = RotateLeft(arr, 3);
        expect(result).toBe(3);
    });

    it('should not modify the array when total is 0', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = RotateLeft(arr, 0);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
        expect(result).toBeNull();
    });

    it('should handle a single-element array', function ()
    {
        var arr = [42];
        var result = RotateLeft(arr);
        expect(arr).toEqual([42]);
        expect(result).toBe(42);
    });

    it('should handle a two-element array', function ()
    {
        var arr = [1, 2];
        RotateLeft(arr);
        expect(arr).toEqual([2, 1]);
    });

    it('should handle rotating by the full length, restoring original order', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        RotateLeft(arr, 5);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with string elements', function ()
    {
        var arr = ['a', 'b', 'c', 'd'];
        RotateLeft(arr, 2);
        expect(arr).toEqual(['c', 'd', 'a', 'b']);
    });

    it('should work with mixed type elements', function ()
    {
        var arr = [1, 'two', true, null];
        RotateLeft(arr);
        expect(arr).toEqual(['two', true, null, 1]);
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];
        var result = RotateLeft(arr);
        expect(arr[0]).toBe(obj2);
        expect(arr[1]).toBe(obj3);
        expect(arr[2]).toBe(obj1);
        expect(result).toBe(obj1);
    });

    it('should modify the array in place', function ()
    {
        var arr = [1, 2, 3];
        var ref = arr;
        RotateLeft(arr);
        expect(arr).toBe(ref);
    });
});
