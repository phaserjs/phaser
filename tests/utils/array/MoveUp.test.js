var MoveUp = require('../../../src/utils/array/MoveUp');

describe('Phaser.Utils.Array.MoveUp', function ()
{
    it('should return the array', function ()
    {
        var arr = [1, 2, 3];
        var result = MoveUp(arr, 1);
        expect(result).toBe(arr);
    });

    it('should move an element up one place', function ()
    {
        var arr = [1, 2, 3];
        MoveUp(arr, 1);
        expect(arr).toEqual([2, 1, 3]);
    });

    it('should move a middle element up one place', function ()
    {
        var arr = [1, 2, 3];
        MoveUp(arr, 2);
        expect(arr).toEqual([1, 3, 2]);
    });

    it('should not move the last element', function ()
    {
        var arr = [1, 2, 3];
        MoveUp(arr, 3);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should return the array unchanged when item is not found', function ()
    {
        var arr = [1, 2, 3];
        MoveUp(arr, 99);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should work with a single-element array', function ()
    {
        var arr = [1];
        MoveUp(arr, 1);
        expect(arr).toEqual([1]);
    });

    it('should work with string elements', function ()
    {
        var arr = ['a', 'b', 'c'];
        MoveUp(arr, 'a');
        expect(arr).toEqual(['b', 'a', 'c']);
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];
        MoveUp(arr, obj1);
        expect(arr[0]).toBe(obj2);
        expect(arr[1]).toBe(obj1);
        expect(arr[2]).toBe(obj3);
    });

    it('should move the first element to index 1', function ()
    {
        var arr = ['a', 'b', 'c', 'd'];
        MoveUp(arr, 'a');
        expect(arr[0]).toBe('b');
        expect(arr[1]).toBe('a');
        expect(arr[2]).toBe('c');
        expect(arr[3]).toBe('d');
    });

    it('should not affect elements other than the swapped pair', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveUp(arr, 2);
        expect(arr).toEqual([1, 3, 2, 4, 5]);
    });

    it('should return the array unchanged when item is the last element', function ()
    {
        var arr = [1, 2, 3];
        var result = MoveUp(arr, 3);
        expect(result).toEqual([1, 2, 3]);
    });
});
