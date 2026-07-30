var Range = require('../../../src/utils/array/Range');

describe('Phaser.Utils.Array.Range', function ()
{
    describe('basic cartesian product', function ()
    {
        it('should return an empty array when both inputs are empty', function ()
        {
            var result = Range([], []);
            expect(result).toEqual([]);
        });

        it('should return an empty array when a is empty', function ()
        {
            var result = Range([], [1, 2, 3]);
            expect(result).toEqual([]);
        });

        it('should return an empty array when b is empty', function ()
        {
            var result = Range(['a', 'b'], []);
            expect(result).toEqual([]);
        });

        it('should build the cartesian product of two single-element arrays', function ()
        {
            var result = Range(['a'], [1]);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ a: 'a', b: 1 });
        });

        it('should build the cartesian product of a and b in the correct order', function ()
        {
            var result = Range(['a', 'b', 'c'], [1, 2, 3]);
            expect(result).toHaveLength(9);
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[1]).toEqual({ a: 'a', b: 2 });
            expect(result[2]).toEqual({ a: 'a', b: 3 });
            expect(result[3]).toEqual({ a: 'b', b: 1 });
            expect(result[4]).toEqual({ a: 'b', b: 2 });
            expect(result[5]).toEqual({ a: 'b', b: 3 });
            expect(result[6]).toEqual({ a: 'c', b: 1 });
            expect(result[7]).toEqual({ a: 'c', b: 2 });
            expect(result[8]).toEqual({ a: 'c', b: 3 });
        });

        it('should return pair objects with a and b properties', function ()
        {
            var result = Range(['x'], [42]);
            expect(result[0]).toHaveProperty('a', 'x');
            expect(result[0]).toHaveProperty('b', 42);
        });

        it('should work with no options argument', function ()
        {
            var result = Range(['a'], [1, 2]);
            expect(result).toHaveLength(2);
        });
    });

    describe('qty option', function ()
    {
        it('should duplicate each pair by qty', function ()
        {
            var result = Range(['a'], [1, 2], { qty: 3 });
            expect(result).toHaveLength(6);
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[1]).toEqual({ a: 'a', b: 1 });
            expect(result[2]).toEqual({ a: 'a', b: 1 });
            expect(result[3]).toEqual({ a: 'a', b: 2 });
            expect(result[4]).toEqual({ a: 'a', b: 2 });
            expect(result[5]).toEqual({ a: 'a', b: 2 });
        });

        it('should default qty to 1 when not specified', function ()
        {
            var result = Range(['a', 'b'], [1, 2]);
            expect(result).toHaveLength(4);
        });

        it('should produce qty=2 with two a values and two b values', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { qty: 2 });
            expect(result).toHaveLength(8);
            // a1, a1, a2, a2, b1, b1, b2, b2
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[1]).toEqual({ a: 'a', b: 1 });
            expect(result[2]).toEqual({ a: 'a', b: 2 });
            expect(result[3]).toEqual({ a: 'a', b: 2 });
        });
    });

    describe('repeat option', function ()
    {
        it('should not repeat when repeat is 0 (default)', function ()
        {
            var result = Range(['a', 'b'], [1, 2]);
            expect(result).toHaveLength(4);
        });

        it('should repeat the entire range once when repeat is 1', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { repeat: 1 });
            expect(result).toHaveLength(8);
            // a1, a2, b1, b2, a1, a2, b1, b2
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[4]).toEqual({ a: 'a', b: 1 });
        });

        it('should repeat the range N+1 times total for repeat=N', function ()
        {
            var result = Range(['a'], [1], { repeat: 3 });
            expect(result).toHaveLength(4);
        });

        it('should repeat the correct pairs in order', function ()
        {
            var result = Range(['a', 'b', 'c'], [1, 2, 3], { repeat: 1 });
            expect(result).toHaveLength(18);
            // second repeat starts at index 9
            expect(result[9]).toEqual({ a: 'a', b: 1 });
            expect(result[17]).toEqual({ a: 'c', b: 3 });
        });
    });

    describe('repeat=-1 (endless) with max', function ()
    {
        it('should fall back to a single pass when repeat=-1 and max=0', function ()
        {
            // max=0 means no limit; repeat=-1 with no max resets repeat to 0 (one pass)
            var result = Range(['a', 'b'], [1, 2], { repeat: -1, max: 0 });
            expect(result).toHaveLength(4);
        });

        it('should cap output at max elements when repeat=-1', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { repeat: -1, max: 14 });
            expect(result).toHaveLength(14);
        });

        it('should produce repeating pairs capped at max', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { repeat: -1, max: 6 });
            expect(result).toHaveLength(6);
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[1]).toEqual({ a: 'a', b: 2 });
            expect(result[2]).toEqual({ a: 'b', b: 1 });
            expect(result[3]).toEqual({ a: 'b', b: 2 });
            expect(result[4]).toEqual({ a: 'a', b: 1 });
            expect(result[5]).toEqual({ a: 'a', b: 2 });
        });

        it('should work with max exactly equal to one full cycle', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { repeat: -1, max: 4 });
            expect(result).toHaveLength(4);
        });
    });

    describe('max option', function ()
    {
        it('should cap the output array at max elements', function ()
        {
            var result = Range(['a', 'b', 'c'], [1, 2, 3], { max: 5 });
            expect(result).toHaveLength(5);
        });

        it('should not truncate when max is 0 (no limit)', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { max: 0 });
            expect(result).toHaveLength(4);
        });

        it('should return all elements when max exceeds total length', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { max: 100 });
            expect(result).toHaveLength(4);
        });

        it('should return exactly one element when max is 1', function ()
        {
            var result = Range(['a', 'b', 'c'], [1, 2, 3], { max: 1 });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ a: 'a', b: 1 });
        });
    });

    describe('yoyo option', function ()
    {
        it('should append the chunk in reverse after the forward pass', function ()
        {
            var result = Range(['a'], [1, 2, 3, 4, 5], { yoyo: true });
            expect(result).toHaveLength(10);
            // forward: a1,a2,a3,a4,a5
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[4]).toEqual({ a: 'a', b: 5 });
            // reverse: a5,a4,a3,a2,a1
            expect(result[5]).toEqual({ a: 'a', b: 5 });
            expect(result[9]).toEqual({ a: 'a', b: 1 });
        });

        it('should double the output length with yoyo', function ()
        {
            var result = Range(['a', 'b'], [1, 2, 3], { yoyo: true });
            expect(result).toHaveLength(12);
        });

        it('should produce forward then reversed sequence', function ()
        {
            var result = Range(['a', 'b'], [1, 2, 3], { yoyo: true });
            // forward: a1,a2,a3,b1,b2,b3
            expect(result[0]).toEqual({ a: 'a', b: 1 });
            expect(result[5]).toEqual({ a: 'b', b: 3 });
            // reversed: b3,b2,b1,a3,a2,a1
            expect(result[6]).toEqual({ a: 'b', b: 3 });
            expect(result[11]).toEqual({ a: 'a', b: 1 });
        });

        it('should work with yoyo and repeat together', function ()
        {
            var result = Range(['a'], [1, 2], { yoyo: true, repeat: 1 });
            // each pass: a1,a2,a2,a1 (4 elements), repeated once = 8 total
            expect(result).toHaveLength(8);
        });
    });

    describe('random option', function ()
    {
        it('should return the same number of elements when random is true', function ()
        {
            var result = Range(['a', 'b', 'c'], [1, 2, 3], { random: true });
            expect(result).toHaveLength(9);
        });

        it('should contain all expected pairs when random is true', function ()
        {
            var result = Range(['a', 'b'], [1, 2], { random: true });
            expect(result).toHaveLength(4);

            var found = { a1: false, a2: false, b1: false, b2: false };
            result.forEach(function (item)
            {
                var key = item.a + item.b;
                found[key] = true;
            });
            expect(found.a1).toBe(true);
            expect(found.a2).toBe(true);
            expect(found.b1).toBe(true);
            expect(found.b2).toBe(true);
        });

        it('should produce a shuffled result at least sometimes across many runs', function ()
        {
            var orderedResult = Range(['a', 'b', 'c'], [1, 2, 3]);
            var orderedStr = JSON.stringify(orderedResult);
            var diffFound = false;

            for (var i = 0; i < 20; i++)
            {
                var shuffled = Range(['a', 'b', 'c'], [1, 2, 3], { random: true });
                if (JSON.stringify(shuffled) !== orderedStr)
                {
                    diffFound = true;
                    break;
                }
            }

            // With 9 elements, the probability of always getting the same order is negligible
            expect(diffFound).toBe(true);
        });
    });

    describe('randomB option', function ()
    {
        it('should return the same number of elements when randomB is true', function ()
        {
            var result = Range(['a', 'b', 'c'], [1, 2, 3], { randomB: true });
            expect(result).toHaveLength(9);
        });

        it('should contain all expected pairs when randomB is true', function ()
        {
            var result = Range(['a', 'b'], [1, 2, 3], { randomB: true });
            expect(result).toHaveLength(6);

            var aVals = result.map(function (item) { return item.a; });
            var bVals = result.map(function (item) { return item.b; });

            expect(aVals.filter(function (v) { return v === 'a'; })).toHaveLength(3);
            expect(aVals.filter(function (v) { return v === 'b'; })).toHaveLength(3);
            expect(bVals.filter(function (v) { return v === 1; })).toHaveLength(2);
            expect(bVals.filter(function (v) { return v === 2; })).toHaveLength(2);
            expect(bVals.filter(function (v) { return v === 3; })).toHaveLength(2);
        });

        it('should shuffle b before pairing, producing different b ordering at least sometimes', function ()
        {
            var orderedResult = Range(['a'], [1, 2, 3, 4, 5]);
            var orderedStr = JSON.stringify(orderedResult);
            var diffFound = false;

            for (var i = 0; i < 20; i++)
            {
                var shuffled = Range(['a'], [1, 2, 3, 4, 5], { randomB: true });
                if (JSON.stringify(shuffled) !== orderedStr)
                {
                    diffFound = true;
                    break;
                }
            }

            expect(diffFound).toBe(true);
        });
    });

    describe('combined options', function ()
    {
        it('should apply qty and repeat together', function ()
        {
            // qty=2: each pair duplicated; repeat=1: entire thing repeated once
            // 2 a-values * 2 b-values * qty=2 = 8 per pass, repeat=1 means 2 passes = 16
            var result = Range(['a', 'b'], [1, 2], { qty: 2, repeat: 1 });
            expect(result).toHaveLength(16);
        });

        it('should apply yoyo and max together', function ()
        {
            var result = Range(['a', 'b'], [1, 2, 3], { yoyo: true, max: 8 });
            expect(result).toHaveLength(8);
        });

        it('should apply repeat=-1, yoyo, and max together', function ()
        {
            // Each pass: 4 elements forward + 4 reversed = 8 per repeat
            var result = Range(['a', 'b'], [1, 2], { repeat: -1, yoyo: true, max: 10 });
            expect(result).toHaveLength(10);
        });

        it('should apply qty, yoyo, and max together', function ()
        {
            var result = Range(['a'], [1, 2, 3], { qty: 2, yoyo: true, max: 7 });
            // forward: 6, reversed: 6, total: 12 — capped at 7
            expect(result).toHaveLength(7);
        });
    });

    describe('output structure', function ()
    {
        it('should return an array', function ()
        {
            var result = Range(['a'], [1]);
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return objects with only a and b properties', function ()
        {
            var result = Range(['hello'], ['world']);
            expect(Object.keys(result[0]).sort()).toEqual(['a', 'b']);
        });

        it('should preserve the original values from the input arrays', function ()
        {
            var objA = { id: 1 };
            var objB = { id: 2 };
            var result = Range([objA], [objB]);
            expect(result[0].a).toBe(objA);
            expect(result[0].b).toBe(objB);
        });

        it('should work with numeric arrays', function ()
        {
            var result = Range([10, 20], [1, 2]);
            expect(result[0]).toEqual({ a: 10, b: 1 });
            expect(result[3]).toEqual({ a: 20, b: 2 });
        });
    });
});
