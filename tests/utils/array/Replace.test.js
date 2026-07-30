var Replace = require('../../../src/utils/array/Replace');

describe('Phaser.Utils.Array.Replace', function ()
{
    it('should replace the old element with the new element', function ()
    {
        var arr = [1, 2, 3, 4];
        var result = Replace(arr, 2, 99);

        expect(result).toBe(true);
        expect(arr).toEqual([1, 99, 3, 4]);
    });

    it('should return true on successful replacement', function ()
    {
        var arr = ['a', 'b', 'c'];

        expect(Replace(arr, 'b', 'z')).toBe(true);
    });

    it('should return false when oldChild is not in the array', function ()
    {
        var arr = [1, 2, 3];

        expect(Replace(arr, 99, 100)).toBe(false);
    });

    it('should not modify the array when oldChild is not found', function ()
    {
        var arr = [1, 2, 3];
        Replace(arr, 99, 100);

        expect(arr).toEqual([1, 2, 3]);
    });

    it('should return false when newChild is already in the array', function ()
    {
        var arr = [1, 2, 3];

        expect(Replace(arr, 1, 2)).toBe(false);
    });

    it('should not modify the array when newChild already exists', function ()
    {
        var arr = [1, 2, 3];
        Replace(arr, 1, 2);

        expect(arr).toEqual([1, 2, 3]);
    });

    it('should replace the first element', function ()
    {
        var arr = [1, 2, 3];
        Replace(arr, 1, 99);

        expect(arr[0]).toBe(99);
    });

    it('should replace the last element', function ()
    {
        var arr = [1, 2, 3];
        Replace(arr, 3, 99);

        expect(arr[2]).toBe(99);
    });

    it('should work with object references', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2];

        var result = Replace(arr, obj1, obj3);

        expect(result).toBe(true);
        expect(arr[0]).toBe(obj3);
        expect(arr[1]).toBe(obj2);
    });

    it('should return false when oldChild and newChild are the same element', function ()
    {
        var arr = [1, 2, 3];

        expect(Replace(arr, 1, 1)).toBe(false);
    });

    it('should work with an array of strings', function ()
    {
        var arr = ['apple', 'banana', 'cherry'];
        Replace(arr, 'banana', 'mango');

        expect(arr).toEqual(['apple', 'mango', 'cherry']);
    });

    it('should replace only one occurrence when element appears once', function ()
    {
        var arr = [1, 2, 3, 2];
        Replace(arr, 2, 99);

        expect(arr[1]).toBe(99);
        expect(arr[3]).toBe(2);
    });
});
