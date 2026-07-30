var SetY = require('../../src/actions/SetY');

describe('Phaser.Actions.SetY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { y: 0 },
            { y: 0 },
            { y: 0 },
            { y: 0 },
            { y: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetY(items, 100);

        expect(result).toBe(items);
    });

    it('should set y on all items to the given value', function ()
    {
        SetY(items, 42);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].y).toBe(42);
        }
    });

    it('should set y to zero', function ()
    {
        items.forEach(function (item) { item.y = 99; });

        SetY(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].y).toBe(0);
        }
    });

    it('should set y to a negative value', function ()
    {
        SetY(items, -200);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].y).toBe(-200);
        }
    });

    it('should set y to a floating point value', function ()
    {
        SetY(items, 3.14);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].y).toBeCloseTo(3.14);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetY(items, 100, 10);

        expect(items[0].y).toBe(100);
        expect(items[1].y).toBe(110);
        expect(items[2].y).toBe(120);
        expect(items[3].y).toBe(130);
        expect(items[4].y).toBe(140);
    });

    it('should apply a negative step', function ()
    {
        SetY(items, 100, -10);

        expect(items[0].y).toBe(100);
        expect(items[1].y).toBe(90);
        expect(items[2].y).toBe(80);
        expect(items[3].y).toBe(70);
        expect(items[4].y).toBe(60);
    });

    it('should apply a floating point step', function ()
    {
        SetY(items, 0, 0.5);

        expect(items[0].y).toBeCloseTo(0);
        expect(items[1].y).toBeCloseTo(0.5);
        expect(items[2].y).toBeCloseTo(1.0);
        expect(items[3].y).toBeCloseTo(1.5);
        expect(items[4].y).toBeCloseTo(2.0);
    });

    it('should start from the given index', function ()
    {
        SetY(items, 99, 0, 2);

        expect(items[0].y).toBe(0);
        expect(items[1].y).toBe(0);
        expect(items[2].y).toBe(99);
        expect(items[3].y).toBe(99);
        expect(items[4].y).toBe(99);
    });

    it('should apply step correctly when starting from an offset index', function ()
    {
        SetY(items, 10, 5, 2);

        expect(items[0].y).toBe(0);
        expect(items[1].y).toBe(0);
        expect(items[2].y).toBe(10);
        expect(items[3].y).toBe(15);
        expect(items[4].y).toBe(20);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        SetY(items, 50, 0, 4, -1);

        expect(items[4].y).toBe(50);
        expect(items[3].y).toBe(50);
        expect(items[2].y).toBe(50);
        expect(items[1].y).toBe(50);
        expect(items[0].y).toBe(50);
    });

    it('should apply step from end to start when direction is -1', function ()
    {
        SetY(items, 100, 10, 4, -1);

        expect(items[4].y).toBe(100);
        expect(items[3].y).toBe(110);
        expect(items[2].y).toBe(120);
        expect(items[1].y).toBe(130);
        expect(items[0].y).toBe(140);
    });

    it('should not modify items before the index when direction is -1', function ()
    {
        SetY(items, 77, 0, 2, -1);

        expect(items[0].y).toBe(77);
        expect(items[1].y).toBe(77);
        expect(items[2].y).toBe(77);
        expect(items[3].y).toBe(0);
        expect(items[4].y).toBe(0);
    });

    it('should work with a single item array', function ()
    {
        var single = [{ y: 0 }];

        SetY(single, 55);

        expect(single[0].y).toBe(55);
    });

    it('should return an empty array unchanged', function ()
    {
        var empty = [];
        var result = SetY(empty, 100);

        expect(result).toBe(empty);
        expect(result.length).toBe(0);
    });

    it('should not modify y on objects without the property defined when assigning a value', function ()
    {
        var obj = {};

        SetY([obj], 42);

        expect(obj.y).toBe(42);
    });
});
