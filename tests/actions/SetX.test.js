var SetX = require('../../src/actions/SetX');

describe('Phaser.Actions.SetX', function ()
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
        var result = SetX(items, 100);

        expect(result).toBe(items);
    });

    it('should set x on all items to the given value', function ()
    {
        SetX(items, 200);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBe(200);
        }
    });

    it('should set x to zero', function ()
    {
        items[0].x = 999;
        items[1].x = 999;

        SetX(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBe(0);
        }
    });

    it('should set x to a negative value', function ()
    {
        SetX(items, -50);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBe(-50);
        }
    });

    it('should set x to a floating point value', function ()
    {
        SetX(items, 3.14);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(3.14);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetX(items, 100, 10);

        expect(items[0].x).toBe(100);
        expect(items[1].x).toBe(110);
        expect(items[2].x).toBe(120);
        expect(items[3].x).toBe(130);
        expect(items[4].x).toBe(140);
    });

    it('should apply a negative step', function ()
    {
        SetX(items, 100, -10);

        expect(items[0].x).toBe(100);
        expect(items[1].x).toBe(90);
        expect(items[2].x).toBe(80);
        expect(items[3].x).toBe(70);
        expect(items[4].x).toBe(60);
    });

    it('should apply a floating point step', function ()
    {
        SetX(items, 0, 0.5);

        expect(items[0].x).toBeCloseTo(0);
        expect(items[1].x).toBeCloseTo(0.5);
        expect(items[2].x).toBeCloseTo(1.0);
        expect(items[3].x).toBeCloseTo(1.5);
        expect(items[4].x).toBeCloseTo(2.0);
    });

    it('should default step to 0 when not provided', function ()
    {
        SetX(items, 50);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBe(50);
        }
    });

    it('should start from index offset when provided', function ()
    {
        SetX(items, 999, 0, 2);

        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(999);
        expect(items[3].x).toBe(999);
        expect(items[4].x).toBe(999);
    });

    it('should apply step correctly when using an index offset', function ()
    {
        SetX(items, 100, 10, 2);

        expect(items[0].x).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[2].x).toBe(100);
        expect(items[3].x).toBe(110);
        expect(items[4].x).toBe(120);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        SetX(items, 100, 0, 4, -1);

        expect(items[0].x).toBe(100);
        expect(items[1].x).toBe(100);
        expect(items[2].x).toBe(100);
        expect(items[3].x).toBe(100);
        expect(items[4].x).toBe(100);
    });

    it('should apply step from end to start when direction is -1', function ()
    {
        SetX(items, 100, 10, 4, -1);

        expect(items[4].x).toBe(100);
        expect(items[3].x).toBe(110);
        expect(items[2].x).toBe(120);
        expect(items[1].x).toBe(130);
        expect(items[0].x).toBe(140);
    });

    it('should not modify items after the index when direction is -1', function ()
    {
        SetX(items, 999, 0, 2, -1);

        expect(items[0].x).toBe(999);
        expect(items[1].x).toBe(999);
        expect(items[2].x).toBe(999);
        expect(items[3].x).toBe(0);
        expect(items[4].x).toBe(0);
    });

    it('should handle an empty array', function ()
    {
        var result = SetX([], 100);

        expect(result).toEqual([]);
    });

    it('should handle a single-item array', function ()
    {
        var single = [{ x: 0 }];

        SetX(single, 42);

        expect(single[0].x).toBe(42);
    });

    it('should overwrite existing x values', function ()
    {
        items[0].x = 111;
        items[1].x = 222;
        items[2].x = 333;

        SetX(items, 50);

        expect(items[0].x).toBe(50);
        expect(items[1].x).toBe(50);
        expect(items[2].x).toBe(50);
    });
});
