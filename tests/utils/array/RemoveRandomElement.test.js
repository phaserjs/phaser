var RemoveRandomElement = require('../../../src/utils/array/RemoveRandomElement');

describe('Phaser.Utils.Array.RemoveRandomElement', function ()
{
    it('should remove and return an element from the array', function ()
    {
        var array = [1, 2, 3, 4, 5];
        var result = RemoveRandomElement(array);

        expect(result).not.toBeNull();
        expect(array.length).toBe(4);
        expect([1, 2, 3, 4, 5]).toContain(result);
    });

    it('should remove the element from the array so it no longer contains it', function ()
    {
        var array = ['a', 'b', 'c'];
        var result = RemoveRandomElement(array);

        expect(array).not.toContain(result);
    });

    it('should work with a single-element array', function ()
    {
        var array = [42];
        var result = RemoveRandomElement(array);

        expect(result).toBe(42);
        expect(array.length).toBe(0);
    });

    it('should return undefined when array is empty', function ()
    {
        var array = [];
        var result = RemoveRandomElement(array);

        expect(result).toBeUndefined();
    });

    it('should respect the start parameter', function ()
    {
        var array = ['a', 'b', 'c', 'd', 'e'];
        var result = RemoveRandomElement(array, 3, 2);

        expect(['d', 'e']).toContain(result);
        expect(array.length).toBe(4);
    });

    it('should respect the length parameter to restrict selection range', function ()
    {
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var array = [10, 20, 30, 40, 50];
            var result = RemoveRandomElement(array, 0, 2);

            expect([10, 20]).toContain(result);
        }
    });

    it('should only select from within the start and length range across many iterations', function ()
    {
        var iterations = 200;

        for (var i = 0; i < iterations; i++)
        {
            var array = ['x', 'y', 'z', 'w'];
            var result = RemoveRandomElement(array, 1, 2);

            expect(['y', 'z']).toContain(result);
        }
    });

    it('should default start to 0 when not provided', function ()
    {
        var array = [1, 2, 3];
        var result = RemoveRandomElement(array);

        expect([1, 2, 3]).toContain(result);
        expect(array.length).toBe(2);
    });

    it('should default length to array.length when not provided', function ()
    {
        var seen = {};
        var iterations = 500;

        for (var i = 0; i < iterations; i++)
        {
            var array = ['a', 'b', 'c'];
            var result = RemoveRandomElement(array);
            seen[result] = true;
        }

        expect(seen['a']).toBe(true);
        expect(seen['b']).toBe(true);
        expect(seen['c']).toBe(true);
    });

    it('should work with object elements', function ()
    {
        var obj1 = { id: 1 };
        var obj2 = { id: 2 };
        var obj3 = { id: 3 };
        var array = [obj1, obj2, obj3];
        var result = RemoveRandomElement(array);

        expect([obj1, obj2, obj3]).toContain(result);
        expect(array.length).toBe(2);
        expect(array).not.toContain(result);
    });

    it('should return undefined when start is beyond array bounds', function ()
    {
        var array = [1, 2, 3];
        var result = RemoveRandomElement(array, 5, 1);

        expect(result).toBeUndefined();
    });

    it('should eventually select every element across many iterations', function ()
    {
        var seen = {};
        var iterations = 500;

        for (var i = 0; i < iterations; i++)
        {
            var array = [1, 2, 3, 4, 5];
            var result = RemoveRandomElement(array);
            seen[result] = true;
        }

        expect(seen[1]).toBe(true);
        expect(seen[2]).toBe(true);
        expect(seen[3]).toBe(true);
        expect(seen[4]).toBe(true);
        expect(seen[5]).toBe(true);
    });

    it('should not modify other elements in the array', function ()
    {
        var array = [10, 20, 30, 40, 50];
        var original = array.slice();
        var result = RemoveRandomElement(array);
        var idx = original.indexOf(result);

        original.splice(idx, 1);

        expect(array).toEqual(original);
    });
});
