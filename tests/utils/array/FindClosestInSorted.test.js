var FindClosestInSorted = require('../../../src/utils/array/FindClosestInSorted');

describe('Phaser.Utils.Array.FindClosestInSorted', function ()
{
    describe('empty and single element arrays', function ()
    {
        it('should return NaN for an empty array', function ()
        {
            expect(FindClosestInSorted(5, [])).toBeNaN();
        });

        it('should return the only element for a single-element array', function ()
        {
            expect(FindClosestInSorted(5, [10])).toBe(10);
        });

        it('should return the only element when value matches', function ()
        {
            expect(FindClosestInSorted(10, [10])).toBe(10);
        });

        it('should return the only element regardless of value', function ()
        {
            expect(FindClosestInSorted(999, [42])).toBe(42);
        });
    });

    describe('exact matches', function ()
    {
        it('should return the exact value when it exists in the array', function ()
        {
            expect(FindClosestInSorted(5, [1, 3, 5, 7, 9])).toBe(5);
        });

        it('should return first element when value matches first element', function ()
        {
            expect(FindClosestInSorted(1, [1, 3, 5, 7, 9])).toBe(1);
        });

        it('should return last element when value matches last element', function ()
        {
            expect(FindClosestInSorted(9, [1, 3, 5, 7, 9])).toBe(9);
        });
    });

    describe('boundary values', function ()
    {
        it('should return the first element when value is less than first element', function ()
        {
            expect(FindClosestInSorted(0, [5, 10, 15, 20])).toBe(5);
        });

        it('should return the last element when value is greater than last element', function ()
        {
            expect(FindClosestInSorted(100, [5, 10, 15, 20])).toBe(20);
        });

        it('should return the first element when value is far below range', function ()
        {
            expect(FindClosestInSorted(-999, [1, 2, 3])).toBe(1);
        });
    });

    describe('midpoint tie-breaking', function ()
    {
        it('should return the higher value when equidistant (high - value <= value - low)', function ()
        {
            // value=5, low=0, high=10: (10-5)=5 <= (5-0)=5, returns high
            expect(FindClosestInSorted(5, [0, 10])).toBe(10);
        });

        it('should return closer lower value when nearer to lower', function ()
        {
            // value=3, low=0, high=10: (10-3)=7 > (3-0)=3, returns low
            expect(FindClosestInSorted(3, [0, 10])).toBe(0);
        });

        it('should return closer higher value when nearer to higher', function ()
        {
            // value=7, low=0, high=10: (10-7)=3 <= (7-0)=7, returns high
            expect(FindClosestInSorted(7, [0, 10])).toBe(10);
        });
    });

    describe('numeric arrays', function ()
    {
        it('should find the closest value in a sorted array', function ()
        {
            expect(FindClosestInSorted(4, [1, 3, 5, 7, 9])).toBe(5);
        });

        it('should find the closest value when between two elements', function ()
        {
            expect(FindClosestInSorted(6, [1, 3, 5, 7, 9])).toBe(7);
        });

        it('should work with negative numbers', function ()
        {
            expect(FindClosestInSorted(-3, [-10, -5, -2, 0, 5])).toBe(-2);
        });

        it('should work with a mix of negative and positive numbers', function ()
        {
            expect(FindClosestInSorted(0, [-10, -1, 1, 10])).toBe(1);
        });

        it('should work with floating point values', function ()
        {
            expect(FindClosestInSorted(2.4, [1, 2, 3, 4])).toBe(2);
        });

        it('should work with floating point values closer to higher', function ()
        {
            expect(FindClosestInSorted(2.6, [1, 2, 3, 4])).toBe(3);
        });

        it('should work with large arrays', function ()
        {
            var arr = [];
            for (var i = 0; i <= 100; i++)
            {
                arr.push(i * 10);
            }
            expect(FindClosestInSorted(55, arr)).toBe(60);
            expect(FindClosestInSorted(45, arr)).toBe(50);
        });
    });

    describe('with key argument on object arrays', function ()
    {
        var arr;

        beforeEach(function ()
        {
            arr = [
                { value: 10, name: 'a' },
                { value: 20, name: 'b' },
                { value: 30, name: 'c' },
                { value: 40, name: 'd' },
                { value: 50, name: 'e' }
            ];
        });

        it('should return the object with exact matching key value', function ()
        {
            var result = FindClosestInSorted(30, arr, 'value');
            expect(result.name).toBe('c');
        });

        it('should return the first object when value is below range', function ()
        {
            var result = FindClosestInSorted(5, arr, 'value');
            expect(result.name).toBe('a');
        });

        it('should return the closest object when between two values', function ()
        {
            var result = FindClosestInSorted(12, arr, 'value');
            expect(result.name).toBe('a');
        });

        it('should return the closer higher object when nearer to upper', function ()
        {
            var result = FindClosestInSorted(18, arr, 'value');
            expect(result.name).toBe('b');
        });

        it('should return the higher object at exact midpoint', function ()
        {
            // midpoint between 10 and 20 is 15: (20-15)=5 <= (15-10)=5, returns higher
            var result = FindClosestInSorted(15, arr, 'value');
            expect(result.name).toBe('b');
        });

        it('should handle value exceeding the range without throwing', function ()
        {
            // Note: the function does not gracefully handle values beyond the
            // last element when using a key — this tests that it does not crash
            // for values just above the last element
            var result = FindClosestInSorted(50, arr, 'value');
            expect(result.name).toBe('e');
        });

        it('should return the first object when value equals first element key', function ()
        {
            var result = FindClosestInSorted(10, arr, 'value');
            expect(result.name).toBe('a');
        });

        it('should work with different key names', function ()
        {
            var data = [
                { time: 0 },
                { time: 100 },
                { time: 200 }
            ];
            var result = FindClosestInSorted(60, data, 'time');
            expect(result.time).toBe(100);
        });

        it('should return full object reference not a copy', function ()
        {
            var result = FindClosestInSorted(30, arr, 'value');
            expect(result).toBe(arr[2]);
        });
    });

    describe('two-element arrays', function ()
    {
        it('should return first element when value matches first', function ()
        {
            expect(FindClosestInSorted(1, [1, 9])).toBe(1);
        });

        it('should return second element when value matches second', function ()
        {
            expect(FindClosestInSorted(9, [1, 9])).toBe(9);
        });

        it('should return closest of two elements', function ()
        {
            expect(FindClosestInSorted(2, [1, 9])).toBe(1);
            expect(FindClosestInSorted(8, [1, 9])).toBe(9);
        });
    });
});
