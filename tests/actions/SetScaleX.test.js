var SetScaleX = require('../../src/actions/SetScaleX');

describe('Phaser.Actions.SetScaleX', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleX: 0 },
            { scaleX: 0 },
            { scaleX: 0 },
            { scaleX: 0 },
            { scaleX: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetScaleX(items, 1);

        expect(result).toBe(items);
    });

    it('should set scaleX on all items to the given value', function ()
    {
        SetScaleX(items, 2);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleX).toBe(2);
        }
    });

    it('should set scaleX to zero', function ()
    {
        items.forEach(function (item) { item.scaleX = 5; });

        SetScaleX(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleX).toBe(0);
        }
    });

    it('should set scaleX to a negative value', function ()
    {
        SetScaleX(items, -3);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleX).toBe(-3);
        }
    });

    it('should set scaleX to a floating point value', function ()
    {
        SetScaleX(items, 1.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleX).toBeCloseTo(1.5);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetScaleX(items, 1, 2);

        expect(items[0].scaleX).toBe(1);
        expect(items[1].scaleX).toBe(3);
        expect(items[2].scaleX).toBe(5);
        expect(items[3].scaleX).toBe(7);
        expect(items[4].scaleX).toBe(9);
    });

    it('should apply a fractional step', function ()
    {
        SetScaleX(items, 0, 0.5);

        expect(items[0].scaleX).toBeCloseTo(0);
        expect(items[1].scaleX).toBeCloseTo(0.5);
        expect(items[2].scaleX).toBeCloseTo(1.0);
        expect(items[3].scaleX).toBeCloseTo(1.5);
        expect(items[4].scaleX).toBeCloseTo(2.0);
    });

    it('should apply a negative step', function ()
    {
        SetScaleX(items, 10, -2);

        expect(items[0].scaleX).toBe(10);
        expect(items[1].scaleX).toBe(8);
        expect(items[2].scaleX).toBe(6);
        expect(items[3].scaleX).toBe(4);
        expect(items[4].scaleX).toBe(2);
    });

    it('should start from the given index', function ()
    {
        SetScaleX(items, 5, 0, 2);

        expect(items[0].scaleX).toBe(0);
        expect(items[1].scaleX).toBe(0);
        expect(items[2].scaleX).toBe(5);
        expect(items[3].scaleX).toBe(5);
        expect(items[4].scaleX).toBe(5);
    });

    it('should apply step starting from the given index', function ()
    {
        SetScaleX(items, 1, 1, 2);

        expect(items[0].scaleX).toBe(0);
        expect(items[1].scaleX).toBe(0);
        expect(items[2].scaleX).toBe(1);
        expect(items[3].scaleX).toBe(2);
        expect(items[4].scaleX).toBe(3);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        SetScaleX(items, 7, 0, 4, -1);

        expect(items[0].scaleX).toBe(7);
        expect(items[1].scaleX).toBe(7);
        expect(items[2].scaleX).toBe(7);
        expect(items[3].scaleX).toBe(7);
        expect(items[4].scaleX).toBe(7);
    });

    it('should apply step in reverse when direction is -1', function ()
    {
        SetScaleX(items, 10, 2, 3, -1);

        expect(items[3].scaleX).toBe(10);
        expect(items[2].scaleX).toBe(12);
        expect(items[1].scaleX).toBe(14);
        expect(items[0].scaleX).toBe(16);
        expect(items[4].scaleX).toBe(0);
    });

    it('should work with a single item array', function ()
    {
        var single = [{ scaleX: 0 }];

        SetScaleX(single, 4);

        expect(single[0].scaleX).toBe(4);
    });

    it('should return an empty array unchanged', function ()
    {
        var empty = [];
        var result = SetScaleX(empty, 5);

        expect(result).toBe(empty);
        expect(result.length).toBe(0);
    });

    it('should not affect other properties on the objects', function ()
    {
        var objs = [
            { scaleX: 0, scaleY: 2, x: 100 },
            { scaleX: 0, scaleY: 3, x: 200 }
        ];

        SetScaleX(objs, 5);

        expect(objs[0].scaleY).toBe(2);
        expect(objs[0].x).toBe(100);
        expect(objs[1].scaleY).toBe(3);
        expect(objs[1].x).toBe(200);
    });

    it('should default step to 0 when not provided', function ()
    {
        SetScaleX(items, 3);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleX).toBe(3);
        }
    });
});
