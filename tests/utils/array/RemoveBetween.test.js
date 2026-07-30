var RemoveBetween = require('../../../src/utils/array/RemoveBetween');

describe('Phaser.Utils.Array.RemoveBetween', function ()
{
    it('should remove items between startIndex and endIndex (exclusive)', function ()
    {
        var arr = [ 'a', 'b', 'c', 'd', 'e' ];
        var removed = RemoveBetween(arr, 1, 3);

        expect(removed).toEqual([ 'b', 'c' ]);
        expect(arr).toEqual([ 'a', 'd', 'e' ]);
    });

    it('should return an array of removed items', function ()
    {
        var arr = [ 1, 2, 3, 4, 5 ];
        var removed = RemoveBetween(arr, 0, 2);

        expect(Array.isArray(removed)).toBe(true);
        expect(removed.length).toBe(2);
        expect(removed[0]).toBe(1);
        expect(removed[1]).toBe(2);
    });

    it('should remove from the start of the array when startIndex is 0', function ()
    {
        var arr = [ 10, 20, 30, 40 ];
        var removed = RemoveBetween(arr, 0, 2);

        expect(removed).toEqual([ 10, 20 ]);
        expect(arr).toEqual([ 30, 40 ]);
    });

    it('should remove up to the end of the array', function ()
    {
        var arr = [ 10, 20, 30, 40 ];
        var removed = RemoveBetween(arr, 2, 4);

        expect(removed).toEqual([ 30, 40 ]);
        expect(arr).toEqual([ 10, 20 ]);
    });

    it('should default startIndex to 0 when undefined', function ()
    {
        var arr = [ 1, 2, 3, 4 ];
        var removed = RemoveBetween(arr, undefined, 2);

        expect(removed).toEqual([ 1, 2 ]);
        expect(arr).toEqual([ 3, 4 ]);
    });

    it('should default endIndex to array.length when undefined', function ()
    {
        var arr = [ 1, 2, 3, 4 ];
        var removed = RemoveBetween(arr, 2);

        expect(removed).toEqual([ 3, 4 ]);
        expect(arr).toEqual([ 1, 2 ]);
    });

    it('should remove all items when both startIndex and endIndex are undefined', function ()
    {
        var arr = [ 1, 2, 3, 4 ];
        var removed = RemoveBetween(arr);

        expect(removed).toEqual([ 1, 2, 3, 4 ]);
        expect(arr).toEqual([]);
    });

    it('should invoke callback for each removed item', function ()
    {
        var arr = [ 'a', 'b', 'c', 'd' ];
        var called = [];

        RemoveBetween(arr, 1, 3, function (item)
        {
            called.push(item);
        });

        expect(called).toEqual([ 'b', 'c' ]);
    });

    it('should invoke callback with the correct context', function ()
    {
        var arr = [ 1, 2, 3 ];
        var ctx = { result: [] };

        RemoveBetween(arr, 0, 2, function (item)
        {
            this.result.push(item);
        }, ctx);

        expect(ctx.result).toEqual([ 1, 2 ]);
    });

    it('should default context to the array when context is undefined', function ()
    {
        var arr = [ 10, 20, 30 ];
        var capturedContext = null;

        RemoveBetween(arr, 0, 1, function ()
        {
            capturedContext = this;
        });

        expect(capturedContext).toBe(arr);
    });

    it('should return empty array when startIndex is out of range (negative)', function ()
    {
        var arr = [ 1, 2, 3 ];
        var removed = RemoveBetween(arr, -1, 2);

        expect(removed).toEqual([]);
        expect(arr).toEqual([ 1, 2, 3 ]);
    });

    it('should return empty array when startIndex equals endIndex', function ()
    {
        var arr = [ 1, 2, 3 ];
        var removed = RemoveBetween(arr, 1, 1);

        expect(removed).toEqual([]);
        expect(arr).toEqual([ 1, 2, 3 ]);
    });

    it('should return empty array when startIndex is greater than endIndex', function ()
    {
        var arr = [ 1, 2, 3 ];
        var removed = RemoveBetween(arr, 2, 1);

        expect(removed).toEqual([]);
        expect(arr).toEqual([ 1, 2, 3 ]);
    });

    it('should return empty array when endIndex exceeds array length', function ()
    {
        var arr = [ 1, 2, 3 ];
        var removed = RemoveBetween(arr, 0, 10);

        expect(removed).toEqual([]);
        expect(arr).toEqual([ 1, 2, 3 ]);
    });

    it('should return empty array when startIndex equals array length', function ()
    {
        var arr = [ 1, 2, 3 ];
        var removed = RemoveBetween(arr, 3, 4);

        expect(removed).toEqual([]);
        expect(arr).toEqual([ 1, 2, 3 ]);
    });

    it('should not invoke callback when range is invalid', function ()
    {
        var arr = [ 1, 2, 3 ];
        var called = false;

        RemoveBetween(arr, -1, 2, function ()
        {
            called = true;
        });

        expect(called).toBe(false);
    });

    it('should remove a single item when range is one element wide', function ()
    {
        var arr = [ 'x', 'y', 'z' ];
        var removed = RemoveBetween(arr, 1, 2);

        expect(removed).toEqual([ 'y' ]);
        expect(arr).toEqual([ 'x', 'z' ]);
    });

    it('should work with an array of objects', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [ obj1, obj2, obj3 ];

        var removed = RemoveBetween(arr, 1, 3);

        expect(removed).toEqual([ obj2, obj3 ]);
        expect(arr).toEqual([ obj1 ]);
    });

    it('should modify the original array in place', function ()
    {
        var arr = [ 1, 2, 3, 4, 5 ];
        var original = arr;

        RemoveBetween(arr, 1, 4);

        expect(arr).toBe(original);
        expect(arr.length).toBe(2);
    });
});
