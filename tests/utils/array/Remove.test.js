var Remove = require('../../../src/utils/array/Remove');

describe('Phaser.Utils.Array.Remove', function ()
{
    it('should remove a single item from an array', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = Remove(arr, 3);

        expect(result).toBe(3);
        expect(arr).toEqual([1, 2, 4, 5]);
    });

    it('should return null when the single item is not in the array', function ()
    {
        var arr = [1, 2, 3];
        var result = Remove(arr, 99);

        expect(result).toBeNull();
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should remove an item from the beginning of the array', function ()
    {
        var arr = [1, 2, 3];
        var result = Remove(arr, 1);

        expect(result).toBe(1);
        expect(arr).toEqual([2, 3]);
    });

    it('should remove an item from the end of the array', function ()
    {
        var arr = [1, 2, 3];
        var result = Remove(arr, 3);

        expect(result).toBe(3);
        expect(arr).toEqual([1, 2]);
    });

    it('should only remove the first occurrence of a duplicate item', function ()
    {
        var arr = [1, 2, 3, 2, 4];
        var result = Remove(arr, 2);

        expect(result).toBe(2);
        expect(arr).toEqual([1, 3, 2, 4]);
    });

    it('should invoke callback when single item is removed', function ()
    {
        var arr = [1, 2, 3];
        var called = [];
        var cb = function (item) { called.push(item); };

        Remove(arr, 2, cb);

        expect(called).toEqual([2]);
    });

    it('should not invoke callback when single item is not found', function ()
    {
        var arr = [1, 2, 3];
        var called = [];
        var cb = function (item) { called.push(item); };

        Remove(arr, 99, cb);

        expect(called).toEqual([]);
    });

    it('should invoke callback with correct context', function ()
    {
        var arr = [1, 2, 3];
        var ctx = { value: 0 };
        var cb = function (item) { this.value += item; };

        Remove(arr, 2, cb, ctx);

        expect(ctx.value).toBe(2);
    });

    it('should default context to array when not provided', function ()
    {
        var arr = [1, 2, 3];
        var receivedContext;
        var cb = function () { receivedContext = this; };

        Remove(arr, 2, cb);

        expect(receivedContext).toBe(arr);
    });

    it('should remove an array of items', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = Remove(arr, [2, 4]);

        expect(arr).toEqual([1, 3, 5]);
        expect(result).toContain(2);
        expect(result).toContain(4);
        expect(result.length).toBe(2);
    });

    it('should return an empty array when none of the items are found', function ()
    {
        var arr = [1, 2, 3];
        var result = Remove(arr, [7, 8, 9]);

        expect(result).toEqual([]);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should return only successfully removed items when some are missing', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = Remove(arr, [2, 99, 4]);

        expect(result).toContain(2);
        expect(result).toContain(4);
        expect(result).not.toContain(99);
        expect(result.length).toBe(2);
        expect(arr).toEqual([1, 3, 5]);
    });

    it('should invoke callback for each removed item in the array case', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var called = [];
        var cb = function (item) { called.push(item); };

        Remove(arr, [2, 4], cb);

        expect(called).toContain(2);
        expect(called).toContain(4);
        expect(called.length).toBe(2);
    });

    it('should not invoke callback for items not found in the array case', function ()
    {
        var arr = [1, 2, 3];
        var called = [];
        var cb = function (item) { called.push(item); };

        Remove(arr, [2, 99], cb);

        expect(called).toEqual([2]);
    });

    it('should invoke callback with correct context for array items', function ()
    {
        var arr = [1, 2, 3, 4];
        var ctx = { sum: 0 };
        var cb = function (item) { this.sum += item; };

        Remove(arr, [2, 4], cb, ctx);

        expect(ctx.sum).toBe(6);
    });

    it('should handle removing all items from an array', function ()
    {
        var arr = [1, 2, 3];
        var result = Remove(arr, [1, 2, 3]);

        expect(arr).toEqual([]);
        expect(result.length).toBe(3);
    });

    it('should handle an empty source array with a single item', function ()
    {
        var arr = [];
        var result = Remove(arr, 1);

        expect(result).toBeNull();
        expect(arr).toEqual([]);
    });

    it('should handle an empty source array with an array of items', function ()
    {
        var arr = [];
        var result = Remove(arr, [1, 2, 3]);

        expect(result).toEqual([]);
        expect(arr).toEqual([]);
    });

    it('should handle removing an empty array of items', function ()
    {
        var arr = [1, 2, 3];
        var result = Remove(arr, []);

        expect(result).toEqual([]);
        expect(arr).toEqual([1, 2, 3]);
    });

    it('should work with object references', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];

        var result = Remove(arr, obj2);

        expect(result).toBe(obj2);
        expect(arr).toEqual([obj1, obj3]);
    });

    it('should work with object references in array removal', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];

        var result = Remove(arr, [obj1, obj3]);

        expect(result).toContain(obj1);
        expect(result).toContain(obj3);
        expect(arr).toEqual([obj2]);
    });

    it('should work with string values', function ()
    {
        var arr = ['a', 'b', 'c', 'd'];
        var result = Remove(arr, 'b');

        expect(result).toBe('b');
        expect(arr).toEqual(['a', 'c', 'd']);
    });

    it('should modify the array in-place', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var ref = arr;

        Remove(arr, 3);

        expect(arr).toBe(ref);
        expect(arr.length).toBe(4);
    });

    it('should work without a callback argument', function ()
    {
        var arr = [1, 2, 3];

        expect(function () { Remove(arr, 2); }).not.toThrow();
        expect(arr).toEqual([1, 3]);
    });
});
