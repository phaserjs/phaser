var SafeRange = require('../../../src/utils/array/SafeRange');

describe('Phaser.Utils.Array.SafeRange', function ()
{
    var arr;

    beforeEach(function ()
    {
        arr = [1, 2, 3, 4, 5];
    });

    it('should return true for a valid range', function ()
    {
        expect(SafeRange(arr, 0, 5)).toBe(true);
    });

    it('should return true for a partial range', function ()
    {
        expect(SafeRange(arr, 1, 3)).toBe(true);
    });

    it('should return true for a single-element range', function ()
    {
        expect(SafeRange(arr, 0, 1)).toBe(true);
        expect(SafeRange(arr, 4, 5)).toBe(true);
    });

    it('should return false when startIndex is negative', function ()
    {
        expect(SafeRange(arr, -1, 3)).toBe(false);
    });

    it('should return false when startIndex equals array length', function ()
    {
        expect(SafeRange(arr, 5, 6)).toBe(false);
    });

    it('should return false when startIndex exceeds array length', function ()
    {
        expect(SafeRange(arr, 10, 15)).toBe(false);
    });

    it('should return false when startIndex equals endIndex', function ()
    {
        expect(SafeRange(arr, 2, 2)).toBe(false);
    });

    it('should return false when startIndex is greater than endIndex', function ()
    {
        expect(SafeRange(arr, 3, 1)).toBe(false);
    });

    it('should return false when endIndex exceeds array length', function ()
    {
        expect(SafeRange(arr, 0, 6)).toBe(false);
    });

    it('should return false when endIndex is well beyond array length', function ()
    {
        expect(SafeRange(arr, 0, 100)).toBe(false);
    });

    it('should throw a RangeError when throwError is true and range is invalid', function ()
    {
        expect(function ()
        {
            SafeRange(arr, -1, 3, true);
        }).toThrow('Range Error: Values outside acceptable range');
    });

    it('should throw when startIndex equals endIndex and throwError is true', function ()
    {
        expect(function ()
        {
            SafeRange(arr, 2, 2, true);
        }).toThrow();
    });

    it('should throw when endIndex exceeds array length and throwError is true', function ()
    {
        expect(function ()
        {
            SafeRange(arr, 0, 10, true);
        }).toThrow();
    });

    it('should not throw when range is valid and throwError is true', function ()
    {
        expect(function ()
        {
            SafeRange(arr, 0, 5, true);
        }).not.toThrow();
    });

    it('should return false for an empty array', function ()
    {
        expect(SafeRange([], 0, 1)).toBe(false);
    });

    it('should return true for a one-element array with range 0 to 1', function ()
    {
        expect(SafeRange([42], 0, 1)).toBe(true);
    });

    it('should return false when throwError is false and range is invalid', function ()
    {
        expect(SafeRange(arr, -1, 3, false)).toBe(false);
    });
});
