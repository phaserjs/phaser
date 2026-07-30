var QuickSelect = require('../../../src/utils/array/QuickSelect');

describe('Phaser.Utils.Array.QuickSelect', function ()
{
    it('should place the k-th smallest element at index k', function ()
    {
        var arr = [3, 1, 4, 1, 5, 9, 2, 6];
        QuickSelect(arr, 3);
        var sorted = [3, 1, 4, 1, 5, 9, 2, 6].slice().sort(function (a, b) { return a - b; });
        expect(arr[3]).toBe(sorted[3]);
    });

    it('should work with k = 0 (minimum element)', function ()
    {
        var arr = [5, 3, 8, 1, 9, 2];
        QuickSelect(arr, 0);
        expect(arr[0]).toBe(1);
    });

    it('should work with k at the last index (maximum element)', function ()
    {
        var arr = [5, 3, 8, 1, 9, 2];
        var last = arr.length - 1;
        QuickSelect(arr, last);
        expect(arr[last]).toBe(9);
    });

    it('should work with a single-element array', function ()
    {
        var arr = [42];
        QuickSelect(arr, 0);
        expect(arr[0]).toBe(42);
    });

    it('should work with a two-element array', function ()
    {
        var arr = [7, 2];
        QuickSelect(arr, 0);
        expect(arr[0]).toBe(2);

        var arr2 = [7, 2];
        QuickSelect(arr2, 1);
        expect(arr2[1]).toBe(7);
    });

    it('should work with duplicate values', function ()
    {
        var arr = [3, 3, 3, 3, 3];
        QuickSelect(arr, 2);
        expect(arr[2]).toBe(3);
    });

    it('should work with an already sorted array', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        QuickSelect(arr, 2);
        expect(arr[2]).toBe(3);
    });

    it('should work with a reverse sorted array', function ()
    {
        var arr = [5, 4, 3, 2, 1];
        QuickSelect(arr, 2);
        expect(arr[2]).toBe(3);
    });

    it('should ensure all elements left of k are less than or equal to arr[k]', function ()
    {
        var arr = [5, 3, 8, 1, 9, 2, 7, 4, 6];
        var k = 4;
        QuickSelect(arr, k);
        var pivot = arr[k];
        for (var i = 0; i < k; i++)
        {
            expect(arr[i]).toBeLessThanOrEqual(pivot);
        }
    });

    it('should ensure all elements right of k are greater than or equal to arr[k]', function ()
    {
        var arr = [5, 3, 8, 1, 9, 2, 7, 4, 6];
        var k = 4;
        QuickSelect(arr, k);
        var pivot = arr[k];
        for (var i = k + 1; i < arr.length; i++)
        {
            expect(arr[i]).toBeGreaterThanOrEqual(pivot);
        }
    });

    it('should accept explicit left and right bounds', function ()
    {
        var arr = [9, 5, 3, 8, 1, 2, 7];
        QuickSelect(arr, 3, 1, 5);
        var sub = arr.slice(1, 6);
        var sorted = sub.slice().sort(function (a, b) { return a - b; });
        expect(arr[3]).toBe(sorted[3 - 1]);
    });

    it('should accept a custom compare function', function ()
    {
        var arr = [3, 1, 4, 1, 5, 9, 2, 6];
        var descending = function (a, b) { return b - a; };
        QuickSelect(arr, 0, 0, arr.length - 1, descending);
        expect(arr[0]).toBe(9);
    });

    it('should accept a custom compare function for descending order at last index', function ()
    {
        var arr = [3, 1, 4, 1, 5, 9, 2, 6];
        var descending = function (a, b) { return b - a; };
        QuickSelect(arr, arr.length - 1, 0, arr.length - 1, descending);
        expect(arr[arr.length - 1]).toBe(1);
    });

    it('should modify the array in-place', function ()
    {
        var arr = [5, 3, 8, 1, 9, 2];
        var ref = arr;
        QuickSelect(arr, 2);
        expect(arr).toBe(ref);
    });

    it('should preserve all original elements after selection', function ()
    {
        var original = [5, 3, 8, 1, 9, 2, 7, 4, 6];
        var arr = original.slice();
        QuickSelect(arr, 4);
        var sortedOriginal = original.slice().sort(function (a, b) { return a - b; });
        var sortedResult = arr.slice().sort(function (a, b) { return a - b; });
        expect(sortedResult).toEqual(sortedOriginal);
    });

    it('should handle negative numbers', function ()
    {
        var arr = [-3, -1, -4, -1, -5, -9, -2, -6];
        QuickSelect(arr, 0);
        expect(arr[0]).toBe(-9);
    });

    it('should handle mixed positive and negative numbers', function ()
    {
        var arr = [-3, 5, -1, 4, 0, 2, -2];
        QuickSelect(arr, 3);
        var sorted = arr.slice().sort(function (a, b) { return a - b; });
        QuickSelect(arr, 3);
        expect(arr[3]).toBe(sorted[3]);
    });

    it('should handle floating point numbers', function ()
    {
        var arr = [1.5, 0.5, 2.5, 3.5, 0.1];
        QuickSelect(arr, 2);
        expect(arr[2]).toBeCloseTo(1.5);
    });

    it('should work with a large array (> 600 elements)', function ()
    {
        var arr = [];
        for (var i = 800; i >= 1; i--)
        {
            arr.push(i);
        }
        var k = 399;
        QuickSelect(arr, k);
        expect(arr[k]).toBe(400);
    });

    it('should ensure partition invariant holds for large arrays', function ()
    {
        var arr = [];
        for (var i = 1000; i >= 1; i--)
        {
            arr.push(i);
        }
        var k = 499;
        QuickSelect(arr, k);
        var pivot = arr[k];
        for (var i = 0; i < k; i++)
        {
            expect(arr[i]).toBeLessThanOrEqual(pivot);
        }
        for (var i = k + 1; i < arr.length; i++)
        {
            expect(arr[i]).toBeGreaterThanOrEqual(pivot);
        }
    });
});
