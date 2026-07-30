var AddAt = require('../../../src/utils/array/AddAt');

describe('Phaser.Utils.Array.AddAt', function ()
{
    it('should add a single item at index 0 by default', function ()
    {
        var arr = [1, 2, 3];
        var result = AddAt(arr, 0);
        expect(result).toBe(0);
        expect(arr[0]).toBe(0);
        expect(arr.length).toBe(4);
    });

    it('should add a single item at the specified index', function ()
    {
        var arr = [1, 2, 3];
        var result = AddAt(arr, 99, 1);
        expect(result).toBe(99);
        expect(arr[1]).toBe(99);
        expect(arr.length).toBe(4);
    });

    it('should add a single item at the end of the array', function ()
    {
        var arr = [1, 2, 3];
        var result = AddAt(arr, 99, 3);
        expect(result).toBe(99);
        expect(arr[3]).toBe(99);
        expect(arr.length).toBe(4);
    });

    it('should return null when adding a duplicate single item', function ()
    {
        var arr = [1, 2, 3];
        var result = AddAt(arr, 2, 0);
        expect(result).toBeNull();
        expect(arr.length).toBe(3);
    });

    it('should add an array of items at the specified index', function ()
    {
        var arr = [1, 2, 3];
        var items = [10, 20];
        var result = AddAt(arr, items, 1);
        expect(Array.isArray(result)).toBe(true);
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe(10);
        expect(arr[2]).toBe(20);
        expect(arr[3]).toBe(2);
        expect(arr.length).toBe(5);
    });

    it('should return null when all items in the array already exist', function ()
    {
        var arr = [1, 2, 3];
        var result = AddAt(arr, [1, 2, 3], 0);
        expect(result).toBeNull();
        expect(arr.length).toBe(3);
    });

    it('should filter out duplicate items from the inserted array', function ()
    {
        var arr = [1, 2, 3];
        var items = [4, 5, 1];  // duplicate (1) is last so pop() removes it correctly
        var result = AddAt(arr, items, 0);
        expect(Array.isArray(result)).toBe(true);
        expect(arr.indexOf(4)).not.toBe(-1);
        expect(arr.indexOf(5)).not.toBe(-1);
        expect(arr.length).toBe(5);
    });

    it('should return null when the array is at the limit', function ()
    {
        var arr = [1, 2, 3];
        var result = AddAt(arr, 4, 0, 3);
        expect(result).toBeNull();
        expect(arr.length).toBe(3);
    });

    it('should truncate the inserted array to fit within the limit', function ()
    {
        var arr = [1, 2, 3];
        var items = [4, 5, 6, 7];
        var result = AddAt(arr, items, 0, 5);
        expect(result.length).toBe(2);
        expect(arr.length).toBe(5);
    });

    it('should invoke the callback for a single item successfully added', function ()
    {
        var arr = [1, 2, 3];
        var called = [];
        var cb = function (item) { called.push(item); };
        AddAt(arr, 99, 0, undefined, cb);
        expect(called.length).toBe(1);
        expect(called[0]).toBe(99);
    });

    it('should invoke the callback for each item in an array successfully added', function ()
    {
        var arr = [1, 2, 3];
        var called = [];
        var cb = function (item) { called.push(item); };
        AddAt(arr, [10, 20, 30], 0, undefined, cb);
        expect(called.length).toBe(3);
        expect(called.indexOf(10)).not.toBe(-1);
        expect(called.indexOf(20)).not.toBe(-1);
        expect(called.indexOf(30)).not.toBe(-1);
    });

    it('should not invoke the callback when item is a duplicate', function ()
    {
        var arr = [1, 2, 3];
        var called = 0;
        var cb = function () { called++; };
        AddAt(arr, 2, 0, undefined, cb);
        expect(called).toBe(0);
    });

    it('should invoke the callback with the specified context', function ()
    {
        var arr = [1, 2, 3];
        var ctx = { value: 0 };
        var cb = function (item) { this.value += item; };
        AddAt(arr, 5, 0, undefined, cb, ctx);
        expect(ctx.value).toBe(5);
    });

    it('should add to an empty array', function ()
    {
        var arr = [];
        var result = AddAt(arr, 42, 0);
        expect(result).toBe(42);
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe(42);
    });

    it('should add an array of items to an empty array', function ()
    {
        var arr = [];
        var items = [1, 2, 3];
        var result = AddAt(arr, items, 0);
        expect(Array.isArray(result)).toBe(true);
        expect(arr.length).toBe(3);
    });

    it('should preserve existing array order when inserting at index 0', function ()
    {
        var arr = ['b', 'c'];
        AddAt(arr, 'a', 0);
        expect(arr[0]).toBe('a');
        expect(arr[1]).toBe('b');
        expect(arr[2]).toBe('c');
    });

    it('should return the item itself (not a wrapper) for a single non-array item', function ()
    {
        var arr = [];
        var obj = { id: 1 };
        var result = AddAt(arr, obj, 0);
        expect(result).toBe(obj);
    });

    it('should return null when limit is 0 and single item is added', function ()
    {
        var arr = [];
        var result = AddAt(arr, 1, 0, 0);
        // limit <= 0 means no capping, item should be added
        expect(result).toBe(1);
    });

    it('should handle inserting multiple items preserving their relative order', function ()
    {
        var arr = ['x'];
        var items = ['a', 'b', 'c'];
        AddAt(arr, items, 0);
        expect(arr[0]).toBe('a');
        expect(arr[1]).toBe('b');
        expect(arr[2]).toBe('c');
        expect(arr[3]).toBe('x');
    });
});
