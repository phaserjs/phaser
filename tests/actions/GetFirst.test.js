var GetFirst = require('../../src/actions/GetFirst');

describe('Phaser.Actions.GetFirst', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleX: 1, alpha: 1, visible: true },
            { scaleX: 0.5, alpha: 1, visible: true },
            { scaleX: 0.5, alpha: 0.5, visible: false },
            { scaleX: 1, alpha: 0, visible: false }
        ];
    });

    it('should return the first item matching a single property', function ()
    {
        var result = GetFirst(items, { scaleX: 0.5 });

        expect(result).toBe(items[1]);
    });

    it('should return the first item matching multiple properties', function ()
    {
        var result = GetFirst(items, { scaleX: 0.5, alpha: 1 });

        expect(result).toBe(items[1]);
    });

    it('should return the first item matching all specified properties', function ()
    {
        var result = GetFirst(items, { scaleX: 0.5, alpha: 0.5, visible: false });

        expect(result).toBe(items[2]);
    });

    it('should return null when no item matches', function ()
    {
        var result = GetFirst(items, { scaleX: 99 });

        expect(result).toBeNull();
    });

    it('should return null when only some properties match', function ()
    {
        var result = GetFirst(items, { scaleX: 0.5, alpha: 0, visible: true });

        expect(result).toBeNull();
    });

    it('should default index to 0 when not provided', function ()
    {
        var result = GetFirst(items, { scaleX: 1 });

        expect(result).toBe(items[0]);
    });

    it('should start searching from the given index', function ()
    {
        var result = GetFirst(items, { scaleX: 1 }, 1);

        expect(result).toBe(items[3]);
    });

    it('should return null when index is beyond the array length', function ()
    {
        var result = GetFirst(items, { scaleX: 1 }, 10);

        expect(result).toBeNull();
    });

    it('should return null when searching an empty array', function ()
    {
        var result = GetFirst([], { scaleX: 1 });

        expect(result).toBeNull();
    });

    it('should match the first item when compare object is empty', function ()
    {
        var result = GetFirst(items, {});

        expect(result).toBe(items[0]);
    });

    it('should return item at index when compare is empty and index is set', function ()
    {
        var result = GetFirst(items, {}, 2);

        expect(result).toBe(items[2]);
    });

    it('should use strict equality for comparison', function ()
    {
        var list = [
            { value: '1' },
            { value: 1 }
        ];

        var result = GetFirst(list, { value: 1 });

        expect(result).toBe(list[1]);
    });

    it('should match falsy boolean values correctly', function ()
    {
        var result = GetFirst(items, { visible: false });

        expect(result).toBe(items[2]);
    });

    it('should match zero numeric values correctly', function ()
    {
        var result = GetFirst(items, { alpha: 0 });

        expect(result).toBe(items[3]);
    });

    it('should not return items before the given index', function ()
    {
        var result = GetFirst(items, { scaleX: 1, alpha: 1, visible: true }, 1);

        expect(result).toBeNull();
    });

    it('should return the first match and not continue searching', function ()
    {
        var result = GetFirst(items, { alpha: 1 });

        expect(result).toBe(items[0]);
    });
});
