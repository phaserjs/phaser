var Swap = require('../../../src/utils/array/Swap');

describe('Phaser.Utils.Array.Swap', function ()
{
    it('should swap two elements in the array', function ()
    {
        var arr = [1, 2, 3, 4];
        Swap(arr, 1, 3);
        expect(arr[0]).toBe(3);
        expect(arr[2]).toBe(1);
    });

    it('should return the original array', function ()
    {
        var arr = [1, 2, 3];
        var result = Swap(arr, 1, 2);
        expect(result).toBe(arr);
    });

    it('should swap first and last elements', function ()
    {
        var arr = ['a', 'b', 'c', 'd'];
        Swap(arr, 'a', 'd');
        expect(arr[0]).toBe('d');
        expect(arr[3]).toBe('a');
    });

    it('should swap adjacent elements', function ()
    {
        var arr = [10, 20, 30];
        Swap(arr, 10, 20);
        expect(arr[0]).toBe(20);
        expect(arr[1]).toBe(10);
        expect(arr[2]).toBe(30);
    });

    it('should return the array unchanged when both items are the same', function ()
    {
        var arr = [1, 2, 3];
        var result = Swap(arr, 2, 2);
        expect(result).toBe(arr);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
        expect(arr[2]).toBe(3);
    });

    it('should throw when item1 is not in the array', function ()
    {
        var arr = [1, 2, 3];
        expect(function () { Swap(arr, 99, 2); }).toThrow('Supplied items must be elements of the same array');
    });

    it('should throw when item2 is not in the array', function ()
    {
        var arr = [1, 2, 3];
        expect(function () { Swap(arr, 1, 99); }).toThrow('Supplied items must be elements of the same array');
    });

    it('should throw when neither item is in the array', function ()
    {
        var arr = [1, 2, 3];
        expect(function () { Swap(arr, 10, 20); }).toThrow('Supplied items must be elements of the same array');
    });

    it('should work with object references', function ()
    {
        var a = { id: 'a' };
        var b = { id: 'b' };
        var c = { id: 'c' };
        var arr = [a, b, c];
        Swap(arr, a, c);
        expect(arr[0]).toBe(c);
        expect(arr[2]).toBe(a);
        expect(arr[1]).toBe(b);
    });

    it('should modify the array in-place', function ()
    {
        var arr = ['x', 'y', 'z'];
        var original = arr;
        Swap(arr, 'x', 'z');
        expect(arr).toBe(original);
        expect(arr.length).toBe(3);
    });

    it('should work with a two-element array', function ()
    {
        var arr = [42, 99];
        Swap(arr, 42, 99);
        expect(arr[0]).toBe(99);
        expect(arr[1]).toBe(42);
    });
});
