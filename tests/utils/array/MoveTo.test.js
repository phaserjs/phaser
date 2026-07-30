var MoveTo = require('../../../src/utils/array/MoveTo');

describe('Phaser.Utils.Array.MoveTo', function ()
{
    it('should return the moved element', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = MoveTo(arr, 3, 0);
        expect(result).toBe(3);
    });

    it('should move an element to the beginning of the array', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveTo(arr, 3, 0);
        expect(arr[0]).toBe(3);
        expect(arr.length).toBe(5);
    });

    it('should move an element to the end of the array', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveTo(arr, 1, 4);
        expect(arr[4]).toBe(1);
        expect(arr.length).toBe(5);
    });

    it('should move an element from the beginning to the middle', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveTo(arr, 1, 2);
        expect(arr).toEqual([2, 3, 1, 4, 5]);
    });

    it('should move an element from the end to the middle', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveTo(arr, 5, 2);
        expect(arr).toEqual([1, 2, 5, 3, 4]);
    });

    it('should not modify the array when moving an element to its current index', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveTo(arr, 3, 2);
        expect(arr).toEqual([1, 2, 3, 4, 5]);
    });

    it('should preserve all elements after a move', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveTo(arr, 2, 3);
        expect(arr.length).toBe(5);
        expect(arr.indexOf(1)).not.toBe(-1);
        expect(arr.indexOf(2)).not.toBe(-1);
        expect(arr.indexOf(3)).not.toBe(-1);
        expect(arr.indexOf(4)).not.toBe(-1);
        expect(arr.indexOf(5)).not.toBe(-1);
    });

    it('should work with object elements', function ()
    {
        var a = { id: 'a' };
        var b = { id: 'b' };
        var c = { id: 'c' };
        var arr = [a, b, c];
        var result = MoveTo(arr, b, 0);
        expect(result).toBe(b);
        expect(arr[0]).toBe(b);
        expect(arr[1]).toBe(a);
        expect(arr[2]).toBe(c);
    });

    it('should throw when the item is not in the array', function ()
    {
        var arr = [1, 2, 3];
        expect(function ()
        {
            MoveTo(arr, 99, 0);
        }).toThrow('Supplied index out of bounds');
    });

    it('should throw when the target index is negative', function ()
    {
        var arr = [1, 2, 3];
        expect(function ()
        {
            MoveTo(arr, 1, -1);
        }).toThrow('Supplied index out of bounds');
    });

    it('should throw when the target index equals the array length', function ()
    {
        var arr = [1, 2, 3];
        expect(function ()
        {
            MoveTo(arr, 1, 3);
        }).toThrow('Supplied index out of bounds');
    });

    it('should throw when the target index exceeds the array length', function ()
    {
        var arr = [1, 2, 3];
        expect(function ()
        {
            MoveTo(arr, 1, 10);
        }).toThrow('Supplied index out of bounds');
    });

    it('should work with a two-element array', function ()
    {
        var arr = [1, 2];
        MoveTo(arr, 1, 1);
        expect(arr).toEqual([2, 1]);
    });

    it('should work with a single-element array when moving to index 0', function ()
    {
        var arr = [42];
        var result = MoveTo(arr, 42, 0);
        expect(result).toBe(42);
        expect(arr).toEqual([42]);
    });

    it('should move an element forward correctly leaving other elements in order', function ()
    {
        var arr = ['a', 'b', 'c', 'd', 'e'];
        MoveTo(arr, 'b', 3);
        expect(arr).toEqual(['a', 'c', 'd', 'b', 'e']);
    });

    it('should move an element backward correctly leaving other elements in order', function ()
    {
        var arr = ['a', 'b', 'c', 'd', 'e'];
        MoveTo(arr, 'd', 1);
        expect(arr).toEqual(['a', 'd', 'b', 'c', 'e']);
    });
});
