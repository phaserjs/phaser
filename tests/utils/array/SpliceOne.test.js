var SpliceOne = require('../../../src/utils/array/SpliceOne');

describe('Phaser.Utils.Array.SpliceOne', function ()
{
    it('should remove and return the item at the given index', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = SpliceOne(arr, 2);

        expect(result).toBe(3);
        expect(arr.length).toBe(4);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
        expect(arr[2]).toBe(4);
        expect(arr[3]).toBe(5);
    });

    it('should remove and return the first item', function ()
    {
        var arr = [10, 20, 30];
        var result = SpliceOne(arr, 0);

        expect(result).toBe(10);
        expect(arr.length).toBe(2);
        expect(arr[0]).toBe(20);
        expect(arr[1]).toBe(30);
    });

    it('should remove and return the last item', function ()
    {
        var arr = [10, 20, 30];
        var result = SpliceOne(arr, 2);

        expect(result).toBe(30);
        expect(arr.length).toBe(2);
        expect(arr[0]).toBe(10);
        expect(arr[1]).toBe(20);
    });

    it('should return undefined when index equals array length', function ()
    {
        var arr = [1, 2, 3];
        var result = SpliceOne(arr, 3);

        expect(result).toBeUndefined();
        expect(arr.length).toBe(3);
    });

    it('should return undefined when index exceeds array length', function ()
    {
        var arr = [1, 2, 3];
        var result = SpliceOne(arr, 10);

        expect(result).toBeUndefined();
        expect(arr.length).toBe(3);
    });

    it('should not mutate the array when index is out of bounds', function ()
    {
        var arr = [1, 2, 3];
        SpliceOne(arr, 5);

        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(2);
        expect(arr[2]).toBe(3);
    });

    it('should handle a single-element array', function ()
    {
        var arr = [42];
        var result = SpliceOne(arr, 0);

        expect(result).toBe(42);
        expect(arr.length).toBe(0);
    });

    it('should handle an array of two elements removing the first', function ()
    {
        var arr = ['a', 'b'];
        var result = SpliceOne(arr, 0);

        expect(result).toBe('a');
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe('b');
    });

    it('should handle an array of two elements removing the second', function ()
    {
        var arr = ['a', 'b'];
        var result = SpliceOne(arr, 1);

        expect(result).toBe('b');
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe('a');
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];
        var result = SpliceOne(arr, 1);

        expect(result).toBe(obj2);
        expect(arr.length).toBe(2);
        expect(arr[0]).toBe(obj1);
        expect(arr[1]).toBe(obj3);
    });

    it('should preserve element order after removal', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        SpliceOne(arr, 1);

        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(3);
        expect(arr[2]).toBe(4);
        expect(arr[3]).toBe(5);
    });

    it('should mutate the original array in place', function ()
    {
        var arr = [1, 2, 3];
        var ref = arr;
        SpliceOne(arr, 0);

        expect(arr).toBe(ref);
        expect(arr.length).toBe(2);
    });
});
