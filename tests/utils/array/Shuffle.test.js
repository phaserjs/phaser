var Shuffle = require('../../../src/utils/array/Shuffle');

describe('Phaser.Utils.Array.Shuffle', function ()
{
    it('should return the same array reference', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        var result = Shuffle(arr);

        expect(result).toBe(arr);
    });

    it('should return an array with the same length', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        Shuffle(arr);

        expect(arr.length).toBe(5);
    });

    it('should contain all original elements after shuffling', function ()
    {
        var arr = [1, 2, 3, 4, 5];
        Shuffle(arr);

        expect(arr).toContain(1);
        expect(arr).toContain(2);
        expect(arr).toContain(3);
        expect(arr).toContain(4);
        expect(arr).toContain(5);
    });

    it('should modify the array in place', function ()
    {
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var original = arr.slice();
        var shuffled = false;

        // Run multiple times to ensure we detect a shuffle
        for (var attempt = 0; attempt < 10; attempt++)
        {
            Shuffle(arr);
            var different = false;

            for (var i = 0; i < arr.length; i++)
            {
                if (arr[i] !== original[i])
                {
                    different = true;
                    break;
                }
            }

            if (different)
            {
                shuffled = true;
                break;
            }
        }

        expect(shuffled).toBe(true);
    });

    it('should handle an empty array', function ()
    {
        var arr = [];
        var result = Shuffle(arr);

        expect(result).toBe(arr);
        expect(result.length).toBe(0);
    });

    it('should handle a single element array', function ()
    {
        var arr = [42];
        var result = Shuffle(arr);

        expect(result).toBe(arr);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(42);
    });

    it('should handle a two element array', function ()
    {
        var arr = [1, 2];
        var result = Shuffle(arr);

        expect(result.length).toBe(2);
        expect(result).toContain(1);
        expect(result).toContain(2);
    });

    it('should work with string elements', function ()
    {
        var arr = ['a', 'b', 'c', 'd', 'e'];
        Shuffle(arr);

        expect(arr.length).toBe(5);
        expect(arr).toContain('a');
        expect(arr).toContain('b');
        expect(arr).toContain('c');
        expect(arr).toContain('d');
        expect(arr).toContain('e');
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var arr = [obj1, obj2, obj3];

        Shuffle(arr);

        expect(arr.length).toBe(3);
        expect(arr).toContain(obj1);
        expect(arr).toContain(obj2);
        expect(arr).toContain(obj3);
    });

    it('should not produce elements outside the original set over many iterations', function ()
    {
        var original = [10, 20, 30, 40, 50];

        for (var i = 0; i < 100; i++)
        {
            var arr = original.slice();
            Shuffle(arr);

            for (var j = 0; j < arr.length; j++)
            {
                expect(original).toContain(arr[j]);
            }
        }
    });

    it('should produce different orderings over many iterations', function ()
    {
        var original = [1, 2, 3, 4, 5];
        var seen = {};
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var arr = original.slice();
            Shuffle(arr);
            var key = arr.join(',');
            seen[key] = true;
        }

        // With 5 elements there are 120 permutations; after 200 runs we expect at least several distinct orderings
        expect(Object.keys(seen).length).toBeGreaterThan(1);
    });

    it('should handle arrays with duplicate values', function ()
    {
        var arr = [1, 1, 2, 2, 3];
        Shuffle(arr);

        expect(arr.length).toBe(5);

        var ones = arr.filter(function (v) { return v === 1; }).length;
        var twos = arr.filter(function (v) { return v === 2; }).length;
        var threes = arr.filter(function (v) { return v === 3; }).length;

        expect(ones).toBe(2);
        expect(twos).toBe(2);
        expect(threes).toBe(1);
    });
});
