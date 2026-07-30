var Flatten = require('../../../src/utils/array/Flatten');

describe('Phaser.Utils.Array.Flatten', function ()
{
    it('should return a flat array unchanged', function ()
    {
        expect(Flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should flatten one level of nesting', function ()
    {
        expect(Flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
    });

    it('should flatten multiple levels of nesting', function ()
    {
        expect(Flatten([1, [2, [3, [4, 5]]]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should flatten deeply nested arrays', function ()
    {
        expect(Flatten([[[[[[42]]]]]])).toEqual([42]);
    });

    it('should return an empty array when given an empty array', function ()
    {
        expect(Flatten([])).toEqual([]);
    });

    it('should handle an array of empty arrays', function ()
    {
        expect(Flatten([[], [], []])).toEqual([]);
    });

    it('should not modify the original array', function ()
    {
        var original = [1, [2, 3], [4, [5]]];
        Flatten(original);
        expect(original).toEqual([1, [2, 3], [4, [5]]]);
    });

    it('should use the provided output array', function ()
    {
        var output = [0];
        var result = Flatten([1, 2, 3], output);
        expect(result).toBe(output);
        expect(result).toEqual([0, 1, 2, 3]);
    });

    it('should append to an existing output array', function ()
    {
        var output = ['a', 'b'];
        Flatten([1, [2, 3]], output);
        expect(output).toEqual(['a', 'b', 1, 2, 3]);
    });

    it('should return a new array when no output is provided', function ()
    {
        var input = [1, 2, 3];
        var result = Flatten(input);
        expect(result).not.toBe(input);
    });

    it('should handle mixed value types', function ()
    {
        expect(Flatten([1, 'two', true, null, [3, 'four']])).toEqual([1, 'two', true, null, 3, 'four']);
    });

    it('should handle arrays with a single element', function ()
    {
        expect(Flatten([[[[1]]]])).toEqual([1]);
    });

    it('should handle an array of only nested empty arrays', function ()
    {
        expect(Flatten([[[], []], [[]]])).toEqual([]);
    });

    it('should flatten sibling nested arrays', function ()
    {
        expect(Flatten([[1, 2], [3, 4], [5, 6]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle objects inside arrays without flattening them', function ()
    {
        var obj = { x: 1 };
        var result = Flatten([obj, [obj]]);
        expect(result).toEqual([obj, obj]);
        expect(result[0]).toBe(obj);
        expect(result[1]).toBe(obj);
    });
});
