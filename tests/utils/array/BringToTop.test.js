var BringToTop = require('../../../src/utils/array/BringToTop');

describe('Phaser.Utils.Array.BringToTop', function ()
{
    it('should move an item from the beginning to the top of the array', function ()
    {
        var array = [1, 2, 3, 4];
        BringToTop(array, 1);
        expect(array).toEqual([2, 3, 4, 1]);
    });

    it('should move an item from the middle to the top of the array', function ()
    {
        var array = [1, 2, 3, 4];
        BringToTop(array, 2);
        expect(array).toEqual([1, 3, 4, 2]);
    });

    it('should leave an item already at the top in place', function ()
    {
        var array = [1, 2, 3, 4];
        BringToTop(array, 4);
        expect(array).toEqual([1, 2, 3, 4]);
    });

    it('should return the moved item', function ()
    {
        var array = [1, 2, 3];
        var result = BringToTop(array, 1);
        expect(result).toBe(1);
    });

    it('should return the item even if it is not found in the array', function ()
    {
        var array = [1, 2, 3];
        var result = BringToTop(array, 99);
        expect(result).toBe(99);
    });

    it('should not modify the array if the item is not found', function ()
    {
        var array = [1, 2, 3];
        BringToTop(array, 99);
        expect(array).toEqual([1, 2, 3]);
    });

    it('should work with object references', function ()
    {
        var a = { id: 1 };
        var b = { id: 2 };
        var c = { id: 3 };
        var array = [a, b, c];
        BringToTop(array, a);
        expect(array[2]).toBe(a);
        expect(array[0]).toBe(b);
        expect(array[1]).toBe(c);
    });

    it('should work with a single-element array', function ()
    {
        var array = [42];
        BringToTop(array, 42);
        expect(array).toEqual([42]);
    });

    it('should work with string elements', function ()
    {
        var array = ['a', 'b', 'c'];
        BringToTop(array, 'a');
        expect(array).toEqual(['b', 'c', 'a']);
    });

    it('should not duplicate the item in the array', function ()
    {
        var array = [1, 2, 3];
        BringToTop(array, 1);
        expect(array.length).toBe(3);
        expect(array.filter(function (x) { return x === 1; }).length).toBe(1);
    });

    it('should move only the first occurrence when duplicates exist', function ()
    {
        var array = [1, 2, 1, 3];
        BringToTop(array, 1);
        expect(array[array.length - 1]).toBe(1);
        expect(array.length).toBe(4);
    });
});
