var EachInRange = require('../../../src/utils/array/EachInRange');

describe('Phaser.Utils.Array.EachInRange', function ()
{
    var arr;
    var results;
    var context;

    beforeEach(function ()
    {
        arr = [ 'a', 'b', 'c', 'd', 'e' ];
        results = [];
        context = { id: 'ctx' };
    });

    it('should return the input array', function ()
    {
        var returned = EachInRange(arr, function () {}, context, 0, arr.length);

        expect(returned).toBe(arr);
    });

    it('should call the callback for each element in range', function ()
    {
        EachInRange(arr, function (item)
        {
            results.push(item);
        }, context, 0, arr.length);

        expect(results).toEqual([ 'a', 'b', 'c', 'd', 'e' ]);
    });

    it('should call the callback only for elements between startIndex and endIndex', function ()
    {
        EachInRange(arr, function (item)
        {
            results.push(item);
        }, context, 1, 4);

        expect(results).toEqual([ 'b', 'c', 'd' ]);
    });

    it('should invoke the callback with the correct context', function ()
    {
        var capturedContext;

        EachInRange(arr, function ()
        {
            capturedContext = this;
        }, context, 0, 1);

        expect(capturedContext).toBe(context);
    });

    it('should pass additional arguments to the callback after the element', function ()
    {
        var callArgs = [];

        EachInRange(arr, function ()
        {
            callArgs.push(Array.prototype.slice.call(arguments));
        }, context, 0, 2, 'extra1', 'extra2');

        expect(callArgs[0]).toEqual([ 'a', 'extra1', 'extra2' ]);
        expect(callArgs[1]).toEqual([ 'b', 'extra1', 'extra2' ]);
    });

    it('should default startIndex to 0 when not provided', function ()
    {
        EachInRange(arr, function (item)
        {
            results.push(item);
        }, context);

        expect(results[0]).toBe('a');
    });

    it('should default endIndex to array.length when not provided', function ()
    {
        EachInRange(arr, function (item)
        {
            results.push(item);
        }, context);

        expect(results.length).toBe(5);
        expect(results[4]).toBe('e');
    });

    it('should not call the callback when startIndex equals endIndex', function ()
    {
        var count = 0;

        EachInRange(arr, function ()
        {
            count++;
        }, context, 2, 2);

        expect(count).toBe(0);
    });

    it('should not call the callback for an empty array', function ()
    {
        var count = 0;

        EachInRange([], function ()
        {
            count++;
        }, context, 0, 0);

        expect(count).toBe(0);
    });

    it('should return the array even when SafeRange fails', function ()
    {
        var returned = EachInRange(arr, function () {}, context, -1, arr.length);

        expect(returned).toBe(arr);
    });

    it('should not call callback when startIndex is out of bounds', function ()
    {
        var count = 0;

        EachInRange(arr, function ()
        {
            count++;
        }, context, -1, arr.length);

        expect(count).toBe(0);
    });

    it('should not call callback when endIndex exceeds array length', function ()
    {
        var count = 0;

        EachInRange(arr, function ()
        {
            count++;
        }, context, 0, arr.length + 1);

        expect(count).toBe(0);
    });

    it('should handle a single-element range', function ()
    {
        EachInRange(arr, function (item)
        {
            results.push(item);
        }, context, 2, 3);

        expect(results).toEqual([ 'c' ]);
    });

    it('should call callback the correct number of times', function ()
    {
        var count = 0;

        EachInRange(arr, function ()
        {
            count++;
        }, context, 1, 4);

        expect(count).toBe(3);
    });

    it('should work with objects in the array', function ()
    {
        var objArr = [ { v: 1 }, { v: 2 }, { v: 3 } ];

        EachInRange(objArr, function (item)
        {
            results.push(item.v);
        }, context, 0, objArr.length);

        expect(results).toEqual([ 1, 2, 3 ]);
    });

    it('should pass a single extra argument correctly', function ()
    {
        var callArgs = [];

        EachInRange(arr, function ()
        {
            callArgs.push(Array.prototype.slice.call(arguments));
        }, context, 0, 1, 42);

        expect(callArgs[0]).toEqual([ 'a', 42 ]);
    });

    it('should not mutate the array', function ()
    {
        var original = arr.slice();

        EachInRange(arr, function () {}, context, 0, arr.length);

        expect(arr).toEqual(original);
    });
});
