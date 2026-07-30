var PropertyValueInc = require('../../src/actions/PropertyValueInc');

describe('Phaser.Actions.PropertyValueInc', function ()
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
        var result = PropertyValueInc(items, 'x', 10);
        expect(result).toBe(items);
    });

    it('should add value to each item property', function ()
    {
        PropertyValueInc(items, 'x', 5);
        expect(items[0].x).toBe(5);
        expect(items[1].x).toBe(5);
        expect(items[2].x).toBe(5);
        expect(items[3].x).toBe(5);
        expect(items[4].x).toBe(5);
    });

    it('should add value incrementally with step', function ()
    {
        PropertyValueInc(items, 'x', 10, 2);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(12);
        expect(items[2].x).toBe(14);
        expect(items[3].x).toBe(16);
        expect(items[4].x).toBe(18);
    });

    it('should respect the index offset', function ()
    {
        PropertyValueInc(items, 'x', 5, 0, 2);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(5);
        expect(items[3].x).toBe(5);
        expect(items[4].x).toBe(5);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        PropertyValueInc(items, 'x', 10, 0, 4, -1);
        expect(items[4].x).toBe(10);
        expect(items[3].x).toBe(10);
        expect(items[2].x).toBe(10);
        expect(items[1].x).toBe(10);
        expect(items[0].x).toBe(10);
    });

    it('should apply step incrementally when iterating in reverse', function ()
    {
        PropertyValueInc(items, 'x', 10, 2, 4, -1);
        expect(items[4].x).toBe(10);
        expect(items[3].x).toBe(12);
        expect(items[2].x).toBe(14);
        expect(items[1].x).toBe(16);
        expect(items[0].x).toBe(18);
    });

    it('should work with negative value', function ()
    {
        items = [{ x: 100 }, { x: 100 }, { x: 100 }];
        PropertyValueInc(items, 'x', -10);
        expect(items[0].x).toBe(90);
        expect(items[1].x).toBe(90);
        expect(items[2].x).toBe(90);
    });

    it('should work with negative step', function ()
    {
        PropertyValueInc(items, 'x', 10, -2);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(8);
        expect(items[2].x).toBe(6);
        expect(items[3].x).toBe(4);
        expect(items[4].x).toBe(2);
    });

    it('should work with floating point values', function ()
    {
        PropertyValueInc(items, 'x', 1.5, 0.5);
        expect(items[0].x).toBeCloseTo(1.5);
        expect(items[1].x).toBeCloseTo(2.0);
        expect(items[2].x).toBeCloseTo(2.5);
        expect(items[3].x).toBeCloseTo(3.0);
        expect(items[4].x).toBeCloseTo(3.5);
    });

    it('should work with zero value', function ()
    {
        items = [{ x: 42 }, { x: 42 }];
        PropertyValueInc(items, 'x', 0);
        expect(items[0].x).toBe(42);
        expect(items[1].x).toBe(42);
    });

    it('should work with zero step', function ()
    {
        PropertyValueInc(items, 'x', 7, 0);
        expect(items[0].x).toBe(7);
        expect(items[1].x).toBe(7);
        expect(items[2].x).toBe(7);
    });

    it('should work with any string key', function ()
    {
        var objs = [{ alpha: 0.5 }, { alpha: 0.5 }, { alpha: 0.5 }];
        PropertyValueInc(objs, 'alpha', 0.1);
        expect(objs[0].alpha).toBeCloseTo(0.6);
        expect(objs[1].alpha).toBeCloseTo(0.6);
        expect(objs[2].alpha).toBeCloseTo(0.6);
    });

    it('should return an empty array unchanged', function ()
    {
        var result = PropertyValueInc([], 'x', 10);
        expect(result).toEqual([]);
    });

    it('should work with a single item array', function ()
    {
        PropertyValueInc([items[0]], 'x', 99);
        expect(items[0].x).toBe(99);
    });

    it('should default step to 0 when not provided', function ()
    {
        PropertyValueInc(items, 'x', 3);
        items.forEach(function (item)
        {
            expect(item.x).toBe(3);
        });
    });

    it('should default index to 0 when not provided', function ()
    {
        PropertyValueInc(items, 'x', 1, 0);
        expect(items[0].x).toBe(1);
    });

    it('should default direction to 1 when not provided', function ()
    {
        PropertyValueInc(items, 'x', 5, 1);
        expect(items[0].x).toBe(5);
        expect(items[1].x).toBe(6);
        expect(items[2].x).toBe(7);
    });

    it('should not affect items before the index offset', function ()
    {
        items = [{ x: 10 }, { x: 20 }, { x: 30 }, { x: 40 }];
        PropertyValueInc(items, 'x', 5, 0, 2);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(20);
        expect(items[2].x).toBe(35);
        expect(items[3].x).toBe(45);
    });

    it('should reset t counter per call', function ()
    {
        PropertyValueInc(items, 'x', 0, 1);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(1);
        expect(items[2].x).toBe(2);
        expect(items[3].x).toBe(3);
        expect(items[4].x).toBe(4);

        PropertyValueInc(items, 'x', 0, 1);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(2);
        expect(items[2].x).toBe(4);
        expect(items[3].x).toBe(6);
        expect(items[4].x).toBe(8);
    });
});
