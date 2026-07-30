var Each = require('../../../src/utils/array/Each');

describe('Phaser.Utils.Array.Each', function ()
{
    it('should return the input array', function ()
    {
        var arr = [1, 2, 3];
        var result = Each(arr, function () {}, {});

        expect(result).toBe(arr);
    });

    it('should call the callback once for each element', function ()
    {
        var arr = [1, 2, 3];
        var count = 0;

        Each(arr, function () { count++; }, {});

        expect(count).toBe(3);
    });

    it('should pass each array element as the first argument to the callback', function ()
    {
        var arr = ['a', 'b', 'c'];
        var received = [];

        Each(arr, function (item) { received.push(item); }, {});

        expect(received).toEqual(['a', 'b', 'c']);
    });

    it('should invoke the callback with the provided context', function ()
    {
        var arr = [1];
        var ctx = { name: 'test' };
        var capturedContext = null;

        Each(arr, function () { capturedContext = this; }, ctx);

        expect(capturedContext).toBe(ctx);
    });

    it('should pass additional arguments to the callback after the array item', function ()
    {
        var arr = [10, 20, 30];
        var results = [];

        Each(arr, function (item, extra1, extra2)
        {
            results.push([item, extra1, extra2]);
        }, {}, 'foo', 42);

        expect(results[0]).toEqual([10, 'foo', 42]);
        expect(results[1]).toEqual([20, 'foo', 42]);
        expect(results[2]).toEqual([30, 'foo', 42]);
    });

    it('should work with a single additional argument', function ()
    {
        var arr = [1, 2];
        var results = [];

        Each(arr, function (item, extra)
        {
            results.push([item, extra]);
        }, {}, 'extra');

        expect(results[0]).toEqual([1, 'extra']);
        expect(results[1]).toEqual([2, 'extra']);
    });

    it('should work with an empty array', function ()
    {
        var arr = [];
        var count = 0;

        var result = Each(arr, function () { count++; }, {});

        expect(count).toBe(0);
        expect(result).toBe(arr);
    });

    it('should work with a single element array', function ()
    {
        var arr = [42];
        var received = [];

        Each(arr, function (item) { received.push(item); }, {});

        expect(received).toEqual([42]);
    });

    it('should work with no additional arguments', function ()
    {
        var arr = [1, 2, 3];
        var received = [];

        Each(arr, function (item) { received.push(item); }, {});

        expect(received).toEqual([1, 2, 3]);
    });

    it('should pass the same additional argument values on each iteration', function ()
    {
        var arr = [1, 2, 3];
        var extraValues = [];

        Each(arr, function (item, a, b)
        {
            extraValues.push(a);
            extraValues.push(b);
        }, {}, 99, 'hello');

        expect(extraValues).toEqual([99, 'hello', 99, 'hello', 99, 'hello']);
    });

    it('should work with null context', function ()
    {
        var arr = [1];
        var called = false;

        Each(arr, function () { called = true; }, null);

        expect(called).toBe(true);
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var arr = [obj1, obj2];
        var received = [];

        Each(arr, function (item) { received.push(item); }, {});

        expect(received[0]).toBe(obj1);
        expect(received[1]).toBe(obj2);
    });
});
