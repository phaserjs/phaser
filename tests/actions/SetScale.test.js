var SetScale = require('../../src/actions/SetScale');

describe('Phaser.Actions.SetScale', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleX: 0, scaleY: 0 },
            { scaleX: 0, scaleY: 0 },
            { scaleX: 0, scaleY: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetScale(items, 1);
        expect(result).toBe(items);
    });

    it('should set scaleX on all items', function ()
    {
        SetScale(items, 2);
        expect(items[0].scaleX).toBe(2);
        expect(items[1].scaleX).toBe(2);
        expect(items[2].scaleX).toBe(2);
    });

    it('should set scaleY to scaleX when scaleY is undefined', function ()
    {
        SetScale(items, 3);
        expect(items[0].scaleY).toBe(3);
        expect(items[1].scaleY).toBe(3);
        expect(items[2].scaleY).toBe(3);
    });

    it('should set scaleY to scaleX when scaleY is null', function ()
    {
        SetScale(items, 4, null);
        expect(items[0].scaleY).toBe(4);
        expect(items[1].scaleY).toBe(4);
        expect(items[2].scaleY).toBe(4);
    });

    it('should set scaleX and scaleY independently when both are provided', function ()
    {
        SetScale(items, 2, 5);
        expect(items[0].scaleX).toBe(2);
        expect(items[0].scaleY).toBe(5);
        expect(items[1].scaleX).toBe(2);
        expect(items[1].scaleY).toBe(5);
        expect(items[2].scaleX).toBe(2);
        expect(items[2].scaleY).toBe(5);
    });

    it('should apply stepX incrementally to scaleX', function ()
    {
        SetScale(items, 1, 1, 2, 0);
        expect(items[0].scaleX).toBe(1);
        expect(items[1].scaleX).toBe(3);
        expect(items[2].scaleX).toBe(5);
    });

    it('should apply stepY incrementally to scaleY', function ()
    {
        SetScale(items, 1, 1, 0, 3);
        expect(items[0].scaleY).toBe(1);
        expect(items[1].scaleY).toBe(4);
        expect(items[2].scaleY).toBe(7);
    });

    it('should apply stepX and stepY independently', function ()
    {
        SetScale(items, 0, 0, 1, 2);
        expect(items[0].scaleX).toBe(0);
        expect(items[0].scaleY).toBe(0);
        expect(items[1].scaleX).toBe(1);
        expect(items[1].scaleY).toBe(2);
        expect(items[2].scaleX).toBe(2);
        expect(items[2].scaleY).toBe(4);
    });

    it('should work with zero scale values', function ()
    {
        items.forEach(function (item) { item.scaleX = 5; item.scaleY = 5; });
        SetScale(items, 0, 0);
        expect(items[0].scaleX).toBe(0);
        expect(items[0].scaleY).toBe(0);
    });

    it('should work with negative scale values', function ()
    {
        SetScale(items, -1, -2);
        expect(items[0].scaleX).toBe(-1);
        expect(items[0].scaleY).toBe(-2);
    });

    it('should work with floating point scale values', function ()
    {
        SetScale(items, 0.5, 1.5);
        expect(items[0].scaleX).toBeCloseTo(0.5);
        expect(items[0].scaleY).toBeCloseTo(1.5);
    });

    it('should respect the index offset parameter', function ()
    {
        SetScale(items, 9, 9, 0, 0, 1);
        expect(items[0].scaleX).toBe(0);
        expect(items[0].scaleY).toBe(0);
        expect(items[1].scaleX).toBe(9);
        expect(items[1].scaleY).toBe(9);
        expect(items[2].scaleX).toBe(9);
        expect(items[2].scaleY).toBe(9);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetScale(items, 0, 0, 1, 1, 2, -1);
        expect(items[2].scaleX).toBe(0);
        expect(items[1].scaleX).toBe(1);
        expect(items[0].scaleX).toBe(2);
        expect(items[2].scaleY).toBe(0);
        expect(items[1].scaleY).toBe(1);
        expect(items[0].scaleY).toBe(2);
    });

    it('should handle an empty array without error', function ()
    {
        var result = SetScale([], 1, 1);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scaleX: 0, scaleY: 0 }];
        SetScale(single, 7, 3);
        expect(single[0].scaleX).toBe(7);
        expect(single[0].scaleY).toBe(3);
    });
});
