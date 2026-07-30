var SetScaleY = require('../../src/actions/SetScaleY');

describe('Phaser.Actions.SetScaleY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleY: 0 },
            { scaleY: 0 },
            { scaleY: 0 },
            { scaleY: 0 },
            { scaleY: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetScaleY(items, 1);

        expect(result).toBe(items);
    });

    it('should set scaleY on all items to the given value', function ()
    {
        SetScaleY(items, 2);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleY).toBe(2);
        }
    });

    it('should set scaleY to zero', function ()
    {
        items[0].scaleY = 5;
        items[1].scaleY = 3;

        SetScaleY(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleY).toBe(0);
        }
    });

    it('should set scaleY to a negative value', function ()
    {
        SetScaleY(items, -1.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleY).toBeCloseTo(-1.5);
        }
    });

    it('should set scaleY to a floating point value', function ()
    {
        SetScaleY(items, 0.75);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scaleY).toBeCloseTo(0.75);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetScaleY(items, 1, 0.5);

        expect(items[0].scaleY).toBeCloseTo(1.0);
        expect(items[1].scaleY).toBeCloseTo(1.5);
        expect(items[2].scaleY).toBeCloseTo(2.0);
        expect(items[3].scaleY).toBeCloseTo(2.5);
        expect(items[4].scaleY).toBeCloseTo(3.0);
    });

    it('should apply a negative step', function ()
    {
        SetScaleY(items, 2, -0.25);

        expect(items[0].scaleY).toBeCloseTo(2.0);
        expect(items[1].scaleY).toBeCloseTo(1.75);
        expect(items[2].scaleY).toBeCloseTo(1.5);
        expect(items[3].scaleY).toBeCloseTo(1.25);
        expect(items[4].scaleY).toBeCloseTo(1.0);
    });

    it('should respect the index offset', function ()
    {
        SetScaleY(items, 9, 0, 2);

        expect(items[0].scaleY).toBe(0);
        expect(items[1].scaleY).toBe(0);
        expect(items[2].scaleY).toBe(9);
        expect(items[3].scaleY).toBe(9);
        expect(items[4].scaleY).toBe(9);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetScaleY(items, 1, 1, 4, -1);

        expect(items[4].scaleY).toBeCloseTo(1);
        expect(items[3].scaleY).toBeCloseTo(2);
        expect(items[2].scaleY).toBeCloseTo(3);
        expect(items[1].scaleY).toBeCloseTo(4);
        expect(items[0].scaleY).toBeCloseTo(5);
    });

    it('should work with a single item array', function ()
    {
        var single = [{ scaleY: 0 }];

        SetScaleY(single, 3.5);

        expect(single[0].scaleY).toBeCloseTo(3.5);
    });

    it('should return an empty array unchanged', function ()
    {
        var result = SetScaleY([], 5);

        expect(result).toEqual([]);
    });

    it('should not affect other properties on the objects', function ()
    {
        var obj = { scaleY: 0, scaleX: 1, x: 100, y: 200 };

        SetScaleY([obj], 4);

        expect(obj.scaleY).toBe(4);
        expect(obj.scaleX).toBe(1);
        expect(obj.x).toBe(100);
        expect(obj.y).toBe(200);
    });
});
