var GetFirst = require('../../../src/utils/array/GetFirst');

describe('Phaser.Utils.Array.GetFirst', function ()
{
    var arr;

    beforeEach(function ()
    {
        arr = [
            { id: 0, visible: true, active: false },
            { id: 1, visible: true, active: true },
            { id: 2, visible: false, active: true },
            { id: 3, visible: false, active: false },
            { id: 4, visible: true, active: true }
        ];
    });

    it('should return the first element when no property or value is specified', function ()
    {
        expect(GetFirst(arr)).toBe(arr[0]);
    });

    it('should return the first element matching the given property and value', function ()
    {
        expect(GetFirst(arr, 'visible', true)).toBe(arr[0]);
    });

    it('should return the first element where visible is false', function ()
    {
        expect(GetFirst(arr, 'visible', false)).toBe(arr[2]);
    });

    it('should return the first element where active is true', function ()
    {
        expect(GetFirst(arr, 'active', true)).toBe(arr[1]);
    });

    it('should return null when no element matches the property and value', function ()
    {
        expect(GetFirst(arr, 'id', 99)).toBeNull();
    });

    it('should return the first element that has the property when only property is given', function ()
    {
        expect(GetFirst(arr, 'visible')).toBe(arr[0]);
    });

    it('should return null when property does not exist on any element', function ()
    {
        expect(GetFirst(arr, 'nonExistent')).toBeNull();
    });

    it('should return the first element that has the property when some elements lack it', function ()
    {
        var mixed = [
            { id: 0 },
            { id: 1 },
            { id: 2, special: true },
            { id: 3, special: false }
        ];

        expect(GetFirst(mixed, 'special')).toBe(mixed[2]);
    });

    it('should respect startIndex and search from that index', function ()
    {
        expect(GetFirst(arr, 'visible', true, 2)).toBe(arr[4]);
    });

    it('should respect endIndex and not search beyond it', function ()
    {
        expect(GetFirst(arr, 'visible', false, 0, 2)).toBeNull();
    });

    it('should return element within a valid startIndex and endIndex range', function ()
    {
        expect(GetFirst(arr, 'id', 3, 2, 5)).toBe(arr[3]);
    });

    it('should return null when startIndex equals endIndex', function ()
    {
        expect(GetFirst(arr, 'id', 0, 2, 2)).toBeNull();
    });

    it('should return null when range is out of bounds', function ()
    {
        expect(GetFirst(arr, 'id', 0, 10, 20)).toBeNull();
    });

    it('should return null for an empty array', function ()
    {
        expect(GetFirst([], 'visible', true)).toBeNull();
    });

    it('should return null when no property is given and array is empty', function ()
    {
        expect(GetFirst([])).toBeNull();
    });

    it('should use default startIndex of 0 when not provided', function ()
    {
        expect(GetFirst(arr, 'id', 0)).toBe(arr[0]);
    });

    it('should use default endIndex of array.length when not provided', function ()
    {
        expect(GetFirst(arr, 'id', 4)).toBe(arr[4]);
    });

    it('should match strictly using === comparison', function ()
    {
        var mixed = [
            { val: 1 },
            { val: '1' },
            { val: true }
        ];

        expect(GetFirst(mixed, 'val', 1)).toBe(mixed[0]);
        expect(GetFirst(mixed, 'val', '1')).toBe(mixed[1]);
        expect(GetFirst(mixed, 'val', true)).toBe(mixed[2]);
    });

    it('should return null when startIndex is 0 and endIndex is 0', function ()
    {
        expect(GetFirst(arr, 'id', 0, 0, 0)).toBeNull();
    });

    it('should handle a single-element array', function ()
    {
        var single = [{ id: 42, visible: true }];

        expect(GetFirst(single, 'visible', true)).toBe(single[0]);
        expect(GetFirst(single, 'visible', false)).toBeNull();
    });

    it('should return the element at startIndex when no property filter is applied', function ()
    {
        expect(GetFirst(arr, undefined, undefined, 3)).toBe(arr[3]);
    });
});
