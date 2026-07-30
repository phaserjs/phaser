var RemoveAt = require('../../../src/utils/array/RemoveAt');

describe('Phaser.Utils.Array.RemoveAt', function ()
{
    it('should remove and return the item at the given index', function ()
    {
        var arr = [ 'a', 'b', 'c', 'd' ];
        var result = RemoveAt(arr, 1);
        expect(result).toBe('b');
        expect(arr).toEqual([ 'a', 'c', 'd' ]);
    });

    it('should remove and return the item at index 0', function ()
    {
        var arr = [ 'x', 'y', 'z' ];
        var result = RemoveAt(arr, 0);
        expect(result).toBe('x');
        expect(arr).toEqual([ 'y', 'z' ]);
    });

    it('should remove and return the last item in the array', function ()
    {
        var arr = [ 1, 2, 3 ];
        var result = RemoveAt(arr, 2);
        expect(result).toBe(3);
        expect(arr).toEqual([ 1, 2 ]);
    });

    it('should modify the array in-place', function ()
    {
        var arr = [ 10, 20, 30, 40 ];
        RemoveAt(arr, 2);
        expect(arr.length).toBe(3);
        expect(arr[2]).toBe(40);
    });

    it('should invoke the callback with the removed item', function ()
    {
        var arr = [ 'a', 'b', 'c' ];
        var callbackItem = null;
        RemoveAt(arr, 1, function (item)
        {
            callbackItem = item;
        });
        expect(callbackItem).toBe('b');
    });

    it('should invoke the callback with the provided context', function ()
    {
        var arr = [ 1, 2, 3 ];
        var ctx = { value: 0 };
        RemoveAt(arr, 0, function (item)
        {
            this.value = item;
        }, ctx);
        expect(ctx.value).toBe(1);
    });

    it('should use the array as default context when no context is provided', function ()
    {
        var arr = [ 'a', 'b', 'c' ];
        var capturedContext = null;
        RemoveAt(arr, 0, function ()
        {
            capturedContext = this;
        });
        expect(capturedContext).toBe(arr);
    });

    it('should not invoke the callback when none is provided', function ()
    {
        var arr = [ 1, 2, 3 ];
        expect(function ()
        {
            RemoveAt(arr, 1);
        }).not.toThrow();
        expect(arr).toEqual([ 1, 3 ]);
    });

    it('should throw when index is negative', function ()
    {
        var arr = [ 1, 2, 3 ];
        expect(function ()
        {
            RemoveAt(arr, -1);
        }).toThrow('Index out of bounds');
    });

    it('should throw when index equals array length', function ()
    {
        var arr = [ 1, 2, 3 ];
        expect(function ()
        {
            RemoveAt(arr, 3);
        }).toThrow('Index out of bounds');
    });

    it('should throw when index exceeds array length', function ()
    {
        var arr = [ 1, 2, 3 ];
        expect(function ()
        {
            RemoveAt(arr, 10);
        }).toThrow('Index out of bounds');
    });

    it('should work with an array of a single element', function ()
    {
        var arr = [ 42 ];
        var result = RemoveAt(arr, 0);
        expect(result).toBe(42);
        expect(arr.length).toBe(0);
    });

    it('should work with object elements', function ()
    {
        var obj = { id: 1 };
        var arr = [ { id: 0 }, obj, { id: 2 } ];
        var result = RemoveAt(arr, 1);
        expect(result).toBe(obj);
        expect(arr.length).toBe(2);
    });

    it('should handle removal from a two-element array at index 0', function ()
    {
        var arr = [ 'first', 'second' ];
        var result = RemoveAt(arr, 0);
        expect(result).toBe('first');
        expect(arr).toEqual([ 'second' ]);
    });

    it('should handle removal from a two-element array at index 1', function ()
    {
        var arr = [ 'first', 'second' ];
        var result = RemoveAt(arr, 1);
        expect(result).toBe('second');
        expect(arr).toEqual([ 'first' ]);
    });
});
