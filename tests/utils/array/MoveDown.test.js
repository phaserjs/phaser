var MoveDown = require('../../../src/utils/array/MoveDown');

describe('Phaser.Utils.Array.MoveDown', function ()
{
    it('should return the array', function ()
    {
        var arr = [1, 2, 3];
        var result = MoveDown(arr, 2);
        expect(result).toBe(arr);
    });

    it('should move an element down one place', function ()
    {
        var arr = [1, 2, 3];
        MoveDown(arr, 2);
        expect(arr).toEqual([2, 1, 3]);
    });

    it('should move the last element down one place', function ()
    {
        var arr = [1, 2, 3];
        MoveDown(arr, 3);
        expect(arr).toEqual([1, 3, 2]);
    });

    it('should move a middle element down one place', function ()
    {
        var arr = [1, 2, 3, 4];
        MoveDown(arr, 3);
        expect(arr).toEqual([1, 3, 2, 4]);
    });

    it('should swap the item with the element directly below it', function ()
    {
        var arr = ['a', 'b', 'c', 'd'];
        MoveDown(arr, 'c');
        expect(arr).toEqual(['a', 'c', 'b', 'd']);
    });

    it('should not move an element that is already at index 0', function ()
    {
        var arr = [1, 2, 3];
        MoveDown(arr, 1);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should handle an element at index 1 moving to index 0', function ()
    {
        var arr = [1, 2, 3];
        MoveDown(arr, 2);
        expect(arr).toEqual([2, 1, 3]);
    });

    it('should not modify the array when item is not found', function ()
    {
        var arr = [1, 2, 3];
        MoveDown(arr, 99);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should work with object references', function ()
    {
        var a = { id: 'a' };
        var b = { id: 'b' };
        var c = { id: 'c' };
        var arr = [a, b, c];
        MoveDown(arr, c);
        expect(arr[1]).toBe(c);
        expect(arr[2]).toBe(b);
    });

    it('should work with a two-element array', function ()
    {
        var arr = ['x', 'y'];
        MoveDown(arr, 'y');
        expect(arr).toEqual(['y', 'x']);
    });

    it('should not move the only element in a single-element array', function ()
    {
        var arr = [42];
        MoveDown(arr, 42);
        expect(arr).toEqual([42]);
    });

    it('should handle moving the second-to-last element down', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        MoveDown(arr, 4);
        expect(arr).toEqual([1, 2, 4, 3, 5]);
    });
});
