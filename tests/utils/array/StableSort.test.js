vi.mock('../../../src/device', function ()
{
    return {
        features: {
            stableSort: false
        }
    };
});

var StableSort = require('../../../src/utils/array/StableSort');

describe('Phaser.Utils.Array.StableSort', function ()
{
    // Helper: numeric comparator
    function numericCompare (a, b)
    {
        return a - b;
    }

    // Helper: compare by 'value' property
    function byValue (a, b)
    {
        return a.value - b.value;
    }

    describe('short-circuit cases', function ()
    {
        it('should return null when passed null', function ()
        {
            expect(StableSort(null)).toBeNull();
        });

        it('should return undefined when passed undefined', function ()
        {
            expect(StableSort(undefined)).toBeUndefined();
        });

        it('should return an empty array unchanged', function ()
        {
            var arr = [];
            var result = StableSort(arr);
            expect(result).toBe(arr);
            expect(result.length).toBe(0);
        });

        it('should return a single-element array unchanged', function ()
        {
            var arr = [ 42 ];
            var result = StableSort(arr);
            expect(result).toBe(arr);
            expect(result[0]).toBe(42);
        });
    });

    describe('default string comparator', function ()
    {
        it('should sort two-element string array', function ()
        {
            var arr = [ 'banana', 'apple' ];
            var result = StableSort(arr);
            expect(result[0]).toBe('apple');
            expect(result[1]).toBe('banana');
        });

        it('should sort numbers as strings by default', function ()
        {
            var arr = [ 10, 9, 2, 1 ];
            var result = StableSort(arr);
            // localeCompare of '1', '10', '2', '9'
            expect(result[0]).toBe(1);
            expect(result[1]).toBe(10);
            expect(result[2]).toBe(2);
            expect(result[3]).toBe(9);
        });

        it('should sort an already-sorted array and leave it sorted', function ()
        {
            var arr = [ 'apple', 'banana', 'cherry' ];
            var result = StableSort(arr);
            expect(result[0]).toBe('apple');
            expect(result[1]).toBe('banana');
            expect(result[2]).toBe('cherry');
        });

        it('should sort a reverse-order string array', function ()
        {
            var arr = [ 'cherry', 'banana', 'apple' ];
            var result = StableSort(arr);
            expect(result[0]).toBe('apple');
            expect(result[1]).toBe('banana');
            expect(result[2]).toBe('cherry');
        });
    });

    describe('custom numeric comparator', function ()
    {
        it('should sort two numbers in ascending order', function ()
        {
            var arr = [ 5, 3 ];
            var result = StableSort(arr, numericCompare);
            expect(result[0]).toBe(3);
            expect(result[1]).toBe(5);
        });

        it('should sort an already-sorted numeric array', function ()
        {
            var arr = [ 1, 2, 3, 4, 5 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 1, 2, 3, 4, 5 ]);
        });

        it('should sort a reverse-order numeric array', function ()
        {
            var arr = [ 5, 4, 3, 2, 1 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 1, 2, 3, 4, 5 ]);
        });

        it('should sort an array with negative numbers', function ()
        {
            var arr = [ 3, -1, 0, -5, 2 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ -5, -1, 0, 2, 3 ]);
        });

        it('should sort an array with duplicate values', function ()
        {
            var arr = [ 3, 1, 2, 1, 3 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 1, 1, 2, 3, 3 ]);
        });

        it('should sort an array of all identical values', function ()
        {
            var arr = [ 7, 7, 7, 7 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 7, 7, 7, 7 ]);
        });

        it('should handle an odd-length array', function ()
        {
            var arr = [ 5, 1, 4, 2, 3 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 1, 2, 3, 4, 5 ]);
        });

        it('should handle an even-length array', function ()
        {
            var arr = [ 8, 6, 4, 2 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 2, 4, 6, 8 ]);
        });

        it('should sort a large array correctly', function ()
        {
            var arr = [];
            for (var i = 100; i >= 1; i--)
            {
                arr.push(i);
            }
            var result = StableSort(arr, numericCompare);
            for (var j = 0; j < 100; j++)
            {
                expect(result[j]).toBe(j + 1);
            }
        });

        it('should sort an array whose length is a power of two', function ()
        {
            var arr = [ 16, 8, 4, 2, 1, 3, 7, 15 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toEqual([ 1, 2, 3, 4, 7, 8, 15, 16 ]);
        });
    });

    describe('return value', function ()
    {
        it('should return the original array reference (in-place sort)', function ()
        {
            var arr = [ 3, 1, 2 ];
            var result = StableSort(arr, numericCompare);
            expect(result).toBe(arr);
        });

        it('should mutate the original array', function ()
        {
            var arr = [ 3, 1, 2 ];
            StableSort(arr, numericCompare);
            expect(arr).toEqual([ 1, 2, 3 ]);
        });
    });

    describe('stability', function ()
    {
        it('should preserve relative order of equal elements', function ()
        {
            var arr = [
                { value: 2, order: 0 },
                { value: 1, order: 1 },
                { value: 2, order: 2 },
                { value: 1, order: 3 },
                { value: 2, order: 4 }
            ];

            var result = StableSort(arr, byValue);

            // All value=1 items first, in original relative order
            expect(result[0].value).toBe(1);
            expect(result[0].order).toBe(1);
            expect(result[1].value).toBe(1);
            expect(result[1].order).toBe(3);

            // All value=2 items next, in original relative order
            expect(result[2].value).toBe(2);
            expect(result[2].order).toBe(0);
            expect(result[3].value).toBe(2);
            expect(result[3].order).toBe(2);
            expect(result[4].value).toBe(2);
            expect(result[4].order).toBe(4);
        });

        it('should preserve relative order across a larger equal-value group', function ()
        {
            var arr = [];
            for (var i = 0; i < 10; i++)
            {
                arr.push({ value: 0, order: i });
            }

            var result = StableSort(arr, byValue);

            for (var j = 0; j < 10; j++)
            {
                expect(result[j].order).toBe(j);
            }
        });
    });

    describe('floating point values', function ()
    {
        it('should sort floating point numbers correctly', function ()
        {
            var arr = [ 3.5, 1.1, 2.9, 0.5 ];
            var result = StableSort(arr, numericCompare);
            expect(result[0]).toBeCloseTo(0.5);
            expect(result[1]).toBeCloseTo(1.1);
            expect(result[2]).toBeCloseTo(2.9);
            expect(result[3]).toBeCloseTo(3.5);
        });

        it('should handle negative floating point numbers', function ()
        {
            var arr = [ -0.5, 1.5, -1.5, 0.5 ];
            var result = StableSort(arr, numericCompare);
            expect(result[0]).toBeCloseTo(-1.5);
            expect(result[1]).toBeCloseTo(-0.5);
            expect(result[2]).toBeCloseTo(0.5);
            expect(result[3]).toBeCloseTo(1.5);
        });
    });
});
