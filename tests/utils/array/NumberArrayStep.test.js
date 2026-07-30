var NumberArrayStep = require('../../../src/utils/array/NumberArrayStep');

describe('Phaser.Utils.Array.NumberArrayStep', function ()
{
    it('should return [0, 1, 2, 3] when called with a single argument of 4', function ()
    {
        expect(NumberArrayStep(4)).toEqual([0, 1, 2, 3]);
    });

    it('should return an empty array when called with 0', function ()
    {
        expect(NumberArrayStep(0)).toEqual([]);
    });

    it('should return an empty array when called with no arguments', function ()
    {
        expect(NumberArrayStep()).toEqual([]);
    });

    it('should return a range from start to end when two arguments are given', function ()
    {
        expect(NumberArrayStep(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('should return an empty array when start equals end', function ()
    {
        expect(NumberArrayStep(3, 3)).toEqual([]);
    });

    it('should return an empty array when start is greater than end with default step', function ()
    {
        expect(NumberArrayStep(5, 1)).toEqual([]);
    });

    it('should step by the given step value', function ()
    {
        expect(NumberArrayStep(0, 20, 5)).toEqual([0, 5, 10, 15]);
    });

    it('should produce a negative range with a negative step', function ()
    {
        expect(NumberArrayStep(0, -4, -1)).toEqual([0, -1, -2, -3]);
    });

    it('should return an empty array when start is greater than end with positive step', function ()
    {
        expect(NumberArrayStep(5, 1, 1)).toEqual([]);
    });

    it('should step correctly from a negative start to a positive end', function ()
    {
        expect(NumberArrayStep(-2, 3, 1)).toEqual([-2, -1, 0, 1, 2]);
    });

    it('should handle a step of 2', function ()
    {
        expect(NumberArrayStep(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });

    it('should handle a step of 3', function ()
    {
        expect(NumberArrayStep(0, 9, 3)).toEqual([0, 3, 6]);
    });

    it('should handle negative start with negative step', function ()
    {
        expect(NumberArrayStep(-1, -5, -1)).toEqual([-1, -2, -3, -4]);
    });

    it('should treat a step of 0 as a step of 1', function ()
    {
        expect(NumberArrayStep(1, 4, 0)).toEqual([1, 1, 1]);
    });

    it('should handle floating point step values', function ()
    {
        var result = NumberArrayStep(0, 1, 0.25);
        expect(result.length).toBe(4);
        expect(result[0]).toBeCloseTo(0);
        expect(result[1]).toBeCloseTo(0.25);
        expect(result[2]).toBeCloseTo(0.5);
        expect(result[3]).toBeCloseTo(0.75);
    });

    it('should handle floating point start and end values', function ()
    {
        var result = NumberArrayStep(0.5, 2.5, 0.5);
        expect(result.length).toBe(4);
        expect(result[0]).toBeCloseTo(0.5);
        expect(result[1]).toBeCloseTo(1.0);
        expect(result[2]).toBeCloseTo(1.5);
        expect(result[3]).toBeCloseTo(2.0);
    });

    it('should return an array of length 1 when start and end differ by exactly one step', function ()
    {
        expect(NumberArrayStep(3, 4, 1)).toEqual([3]);
    });

    it('should coerce NaN start and end to 0 and return empty array', function ()
    {
        expect(NumberArrayStep(NaN, NaN)).toEqual([]);
    });

    it('should return the correct length array', function ()
    {
        var result = NumberArrayStep(0, 100, 1);
        expect(result.length).toBe(100);
    });

    it('should not include the end value in the result', function ()
    {
        var result = NumberArrayStep(1, 5);
        expect(result.indexOf(5)).toBe(-1);
    });

    it('should include the start value in the result', function ()
    {
        var result = NumberArrayStep(1, 5);
        expect(result[0]).toBe(1);
    });
});
