var Add = require('../../../src/utils/array/Add');

describe('Phaser.Utils.Array.Add', function ()
{
    var array;

    beforeEach(function ()
    {
        array = [1, 2, 3];
    });

    // Single item - basic cases

    it('should add a single item to the array', function ()
    {
        var result = Add(array, 4);
        expect(array).toContain(4);
        expect(result).toBe(4);
    });

    it('should return null when adding a duplicate single item', function ()
    {
        var result = Add(array, 1);
        expect(result).toBeNull();
        expect(array.length).toBe(3);
    });

    it('should add a single item to an empty array', function ()
    {
        var result = Add([], 'hello');
        expect(result).toBe('hello');
    });

    it('should add an object as a single item', function ()
    {
        var obj = { id: 1 };
        var result = Add(array, obj);
        expect(result).toBe(obj);
        expect(array).toContain(obj);
    });

    it('should not add the same object reference twice', function ()
    {
        var obj = { id: 1 };
        Add(array, obj);
        var result = Add(array, obj);
        expect(result).toBeNull();
    });

    // Array of items - basic cases

    it('should add an array of unique items', function ()
    {
        var result = Add(array, [4, 5, 6]);
        expect(result).toEqual([4, 5, 6]);
        expect(array.length).toBe(6);
    });

    it('should return null when all items in the array already exist', function ()
    {
        var result = Add(array, [1, 2, 3]);
        expect(result).toBeNull();
        expect(array.length).toBe(3);
    });

    it('should filter out duplicate items from the input array', function ()
    {
        var result = Add(array, [1, 4, 2, 5]);
        expect(result).toContain(4);
        expect(result).toContain(5);
        expect(result).not.toContain(1);
        expect(result).not.toContain(2);
    });

    it('should add an array to an empty array', function ()
    {
        var result = Add([], [1, 2, 3]);
        expect(result).toEqual([1, 2, 3]);
    });

    it('should return null when adding an empty array', function ()
    {
        var result = Add(array, []);
        expect(result).toBeNull();
        expect(array.length).toBe(3);
    });

    // Limit - single item

    it('should return null when the array is already at or above the limit', function ()
    {
        var result = Add(array, 4, 3);
        expect(result).toBeNull();
        expect(array.length).toBe(3);
    });

    it('should add a single item when under the limit', function ()
    {
        var result = Add(array, 4, 5);
        expect(result).toBe(4);
        expect(array.length).toBe(4);
    });

    it('should not add a single item when array length equals limit', function ()
    {
        var result = Add(array, 4, 3);
        expect(result).toBeNull();
    });

    // Limit - array of items

    it('should truncate the added items array to fit within the limit', function ()
    {
        var result = Add(array, [4, 5, 6, 7], 5);
        expect(result.length).toBe(2);
        expect(array.length).toBe(5);
    });

    it('should return null when array is full and trying to add an array', function ()
    {
        var result = Add(array, [4, 5], 3);
        expect(result).toBeNull();
        expect(array.length).toBe(3);
    });

    it('should add all items when they fit exactly within the limit', function ()
    {
        var result = Add(array, [4, 5], 5);
        expect(result).toEqual([4, 5]);
        expect(array.length).toBe(5);
    });

    it('should ignore limit when limit is 0 or not provided', function ()
    {
        var result = Add(array, [4, 5, 6], 0);
        expect(array.length).toBe(6);
        expect(result).toEqual([4, 5, 6]);
    });

    // Callback - single item

    it('should invoke the callback when a single item is added', function ()
    {
        var called = [];
        Add(array, 4, 0, function (item) { called.push(item); });
        expect(called).toEqual([4]);
    });

    it('should not invoke the callback when a single duplicate item is rejected', function ()
    {
        var called = [];
        Add(array, 1, 0, function (item) { called.push(item); });
        expect(called.length).toBe(0);
    });

    // Callback - array of items

    it('should invoke the callback for each item added from an array', function ()
    {
        var called = [];
        Add(array, [4, 5, 6], 0, function (item) { called.push(item); });
        expect(called).toEqual([4, 5, 6]);
    });

    it('should only invoke the callback for items that were actually added', function ()
    {
        var called = [];
        Add(array, [1, 4, 2, 5], 0, function (item) { called.push(item); });
        expect(called).toContain(4);
        expect(called).toContain(5);
        expect(called).not.toContain(1);
        expect(called).not.toContain(2);
    });

    it('should not invoke the callback when no items are added', function ()
    {
        var called = [];
        Add(array, [1, 2, 3], 0, function (item) { called.push(item); });
        expect(called.length).toBe(0);
    });

    // Callback context

    it('should invoke the callback with the provided context', function ()
    {
        var ctx = { name: 'test' };
        var capturedContext;
        Add(array, 4, 0, function () { capturedContext = this; }, ctx);
        expect(capturedContext).toBe(ctx);
    });

    it('should default to using the array as the callback context', function ()
    {
        var capturedContext;
        Add(array, 4, 0, function () { capturedContext = this; });
        expect(capturedContext).toBe(array);
    });

    // Return value integrity

    it('should return the item itself (not a copy) for single item adds', function ()
    {
        var obj = { id: 99 };
        var result = Add(array, obj);
        expect(result).toBe(obj);
    });

    it('should mutate the input item array by removing duplicates', function ()
    {
        var items = [1, 4, 2, 5];
        Add(array, items);
        expect(items).not.toContain(1);
        expect(items).not.toContain(2);
        expect(items).toContain(4);
        expect(items).toContain(5);
    });

    it('should mutate the input item array when truncated by limit', function ()
    {
        var items = [4, 5, 6, 7];
        Add(array, items, 5);
        expect(items.length).toBe(2);
    });

    // Edge cases

    it('should handle adding a string item', function ()
    {
        var result = Add(array, 'hello');
        expect(result).toBe('hello');
        expect(array).toContain('hello');
    });

    it('should handle adding null as an item', function ()
    {
        var result = Add(array, null);
        expect(result).toBeNull();
    });

    it('should handle a large number of items', function ()
    {
        var items = [];
        for (var i = 100; i < 200; i++)
        {
            items.push(i);
        }
        var result = Add(array, items);
        expect(array.length).toBe(103);
        expect(result.length).toBe(100);
    });
});
