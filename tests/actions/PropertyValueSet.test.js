var PropertyValueSet = require('../../src/actions/PropertyValueSet');

describe('Phaser.Actions.PropertyValueSet', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { x: 0 },
            { x: 0 },
            { x: 0 },
            { x: 0 },
            { x: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = PropertyValueSet(items, 'x', 10);
        expect(result).toBe(items);
    });

    it('should set all items to the given value with no step', function ()
    {
        PropertyValueSet(items, 'x', 42);
        expect(items[0].x).toBe(42);
        expect(items[1].x).toBe(42);
        expect(items[2].x).toBe(42);
        expect(items[3].x).toBe(42);
        expect(items[4].x).toBe(42);
    });

    it('should apply step incrementally to each item', function ()
    {
        PropertyValueSet(items, 'x', 10, 5);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(15);
        expect(items[2].x).toBe(20);
        expect(items[3].x).toBe(25);
        expect(items[4].x).toBe(30);
    });

    it('should default step to 0 when not provided', function ()
    {
        PropertyValueSet(items, 'x', 7);
        items.forEach(function (item)
        {
            expect(item.x).toBe(7);
        });
    });

    it('should start from index when provided', function ()
    {
        PropertyValueSet(items, 'x', 100, 0, 2);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(100);
        expect(items[3].x).toBe(100);
        expect(items[4].x).toBe(100);
    });

    it('should apply step correctly when starting from a non-zero index', function ()
    {
        PropertyValueSet(items, 'x', 10, 5, 2);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(10);
        expect(items[3].x).toBe(15);
        expect(items[4].x).toBe(20);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        PropertyValueSet(items, 'x', 10, 0, 4, -1);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(10);
        expect(items[2].x).toBe(10);
        expect(items[3].x).toBe(10);
        expect(items[4].x).toBe(10);
    });

    it('should apply step in reverse direction correctly', function ()
    {
        PropertyValueSet(items, 'x', 10, 5, 4, -1);
        expect(items[4].x).toBe(10);
        expect(items[3].x).toBe(15);
        expect(items[2].x).toBe(20);
        expect(items[1].x).toBe(25);
        expect(items[0].x).toBe(30);
    });

    it('should work with a string property key', function ()
    {
        var objs = [{ alpha: 1 }, { alpha: 1 }, { alpha: 1 }];
        PropertyValueSet(objs, 'alpha', 0.5);
        expect(objs[0].alpha).toBe(0.5);
        expect(objs[1].alpha).toBe(0.5);
        expect(objs[2].alpha).toBe(0.5);
    });

    it('should work with zero value', function ()
    {
        items.forEach(function (item) { item.x = 99; });
        PropertyValueSet(items, 'x', 0);
        items.forEach(function (item)
        {
            expect(item.x).toBe(0);
        });
    });

    it('should work with negative value', function ()
    {
        PropertyValueSet(items, 'x', -50);
        items.forEach(function (item)
        {
            expect(item.x).toBe(-50);
        });
    });

    it('should work with negative step', function ()
    {
        PropertyValueSet(items, 'x', 100, -10);
        expect(items[0].x).toBe(100);
        expect(items[1].x).toBe(90);
        expect(items[2].x).toBe(80);
        expect(items[3].x).toBe(70);
        expect(items[4].x).toBe(60);
    });

    it('should work with floating point values', function ()
    {
        PropertyValueSet(items, 'x', 1.5, 0.5);
        expect(items[0].x).toBeCloseTo(1.5);
        expect(items[1].x).toBeCloseTo(2.0);
        expect(items[2].x).toBeCloseTo(2.5);
        expect(items[3].x).toBeCloseTo(3.0);
        expect(items[4].x).toBeCloseTo(3.5);
    });

    it('should handle an empty array', function ()
    {
        var result = PropertyValueSet([], 'x', 10);
        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ x: 0 }];
        PropertyValueSet(single, 'x', 99);
        expect(single[0].x).toBe(99);
    });

    it('should only process the single item when index equals last index in reverse', function ()
    {
        PropertyValueSet(items, 'x', 7, 0, 0, -1);
        expect(items[0].x).toBe(7);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(0);
        expect(items[3].x).toBe(0);
        expect(items[4].x).toBe(0);
    });

    it('should not mutate items outside the index range in forward direction', function ()
    {
        PropertyValueSet(items, 'x', 55, 0, 3);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(0);
        expect(items[3].x).toBe(55);
        expect(items[4].x).toBe(55);
    });
});
