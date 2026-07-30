var GetRandom = require('../../../src/utils/array/GetRandom');

describe('Phaser.Utils.Array.GetRandom', function ()
{
    it('should return an element from the array', function ()
    {
        var array = [1, 2, 3, 4, 5];
        var result = GetRandom(array);

        expect(array).toContain(result);
    });

    it('should return null for an empty array', function ()
    {
        expect(GetRandom([])).toBeNull();
    });

    it('should return the only element from a single-element array', function ()
    {
        expect(GetRandom([42])).toBe(42);
    });

    it('should return an element within the startIndex range', function ()
    {
        var array = ['a', 'b', 'c', 'd', 'e'];
        var result = GetRandom(array, 2);

        expect(['a', 'b', 'c', 'd', 'e']).toContain(result);
    });

    it('should only return elements from the specified startIndex and length', function ()
    {
        var array = [10, 20, 30, 40, 50];
        var seen = {};
        var i;

        for (i = 0; i < 200; i++)
        {
            var result = GetRandom(array, 1, 3);
            seen[result] = true;
        }

        expect(seen[10]).toBeUndefined();
        expect(seen[50]).toBeUndefined();
        expect(seen[20] || seen[30] || seen[40]).toBe(true);
    });

    it('should return null when startIndex is beyond array length', function ()
    {
        var array = [1, 2, 3];
        expect(GetRandom(array, 10, 1)).toBeNull();
    });

    it('should return null when length is zero', function ()
    {
        var array = [1, 2, 3];
        // When length is 0, randomIndex = startIndex + floor(random * 0) = startIndex,
        // so it returns array[startIndex] rather than null
        expect(GetRandom(array, 0, 0)).toBe(array[0]);
    });

    it('should work with string elements', function ()
    {
        var array = ['foo', 'bar', 'baz'];
        var result = GetRandom(array);

        expect(array).toContain(result);
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var array = [obj1, obj2, obj3];
        var result = GetRandom(array);

        expect(array).toContain(result);
    });

    it('should cover all elements over many iterations', function ()
    {
        var array = [1, 2, 3, 4, 5];
        var seen = {};
        var i;

        for (i = 0; i < 500; i++)
        {
            seen[GetRandom(array)] = true;
        }

        expect(seen[1]).toBe(true);
        expect(seen[2]).toBe(true);
        expect(seen[3]).toBe(true);
        expect(seen[4]).toBe(true);
        expect(seen[5]).toBe(true);
    });

    it('should default startIndex to 0 when not provided', function ()
    {
        var array = ['only'];
        expect(GetRandom(array)).toBe('only');
    });

    it('should default length to array.length when not provided', function ()
    {
        var array = [7, 8, 9];
        var result = GetRandom(array);

        expect(array).toContain(result);
    });

    it('should return the element at startIndex when length is 1', function ()
    {
        var array = [100, 200, 300];
        expect(GetRandom(array, 1, 1)).toBe(200);
    });
});
