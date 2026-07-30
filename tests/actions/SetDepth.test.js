var SetDepth = require('../../src/actions/SetDepth');

describe('Phaser.Actions.SetDepth', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { depth: 0 },
            { depth: 0 },
            { depth: 0 },
            { depth: 0 },
            { depth: 0 }
        ];
    });

    it('should set depth on all items to the given value', function ()
    {
        SetDepth(items, 10);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].depth).toBe(10);
        }
    });

    it('should set depth to zero', function ()
    {
        items.forEach(function (item) { item.depth = 5; });

        SetDepth(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].depth).toBe(0);
        }
    });

    it('should set depth to a negative value', function ()
    {
        SetDepth(items, -5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].depth).toBe(-5);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetDepth(items, 0, 2);

        expect(items[0].depth).toBe(0);
        expect(items[1].depth).toBe(2);
        expect(items[2].depth).toBe(4);
        expect(items[3].depth).toBe(6);
        expect(items[4].depth).toBe(8);
    });

    it('should apply step starting from a base value', function ()
    {
        SetDepth(items, 10, 5);

        expect(items[0].depth).toBe(10);
        expect(items[1].depth).toBe(15);
        expect(items[2].depth).toBe(20);
        expect(items[3].depth).toBe(25);
        expect(items[4].depth).toBe(30);
    });

    it('should apply a negative step', function ()
    {
        SetDepth(items, 20, -3);

        expect(items[0].depth).toBe(20);
        expect(items[1].depth).toBe(17);
        expect(items[2].depth).toBe(14);
        expect(items[3].depth).toBe(11);
        expect(items[4].depth).toBe(8);
    });

    it('should return the original items array', function ()
    {
        var result = SetDepth(items, 5);

        expect(result).toBe(items);
    });

    it('should handle an empty array', function ()
    {
        var result = SetDepth([], 10);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ depth: 0 }];

        SetDepth(single, 42);

        expect(single[0].depth).toBe(42);
    });

    it('should respect the index offset parameter', function ()
    {
        SetDepth(items, 99, 0, 2);

        expect(items[0].depth).toBe(0);
        expect(items[1].depth).toBe(0);
        expect(items[2].depth).toBe(99);
        expect(items[3].depth).toBe(99);
        expect(items[4].depth).toBe(99);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetDepth(items, 0, 1, 4, -1);

        expect(items[4].depth).toBe(0);
        expect(items[3].depth).toBe(1);
        expect(items[2].depth).toBe(2);
        expect(items[1].depth).toBe(3);
        expect(items[0].depth).toBe(4);
    });

    it('should work with floating point values', function ()
    {
        SetDepth(items, 1.5, 0.5);

        expect(items[0].depth).toBeCloseTo(1.5);
        expect(items[1].depth).toBeCloseTo(2.0);
        expect(items[2].depth).toBeCloseTo(2.5);
        expect(items[3].depth).toBeCloseTo(3.0);
        expect(items[4].depth).toBeCloseTo(3.5);
    });
});
