var SetScrollFactorY = require('../../src/actions/SetScrollFactorY');

describe('Phaser.Actions.SetScrollFactorY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scrollFactorY: 0 },
            { scrollFactorY: 0 },
            { scrollFactorY: 0 },
            { scrollFactorY: 0 },
            { scrollFactorY: 0 }
        ];
    });

    it('should set scrollFactorY on all items to the given value', function ()
    {
        SetScrollFactorY(items, 2);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorY).toBe(2);
        }
    });

    it('should return the items array', function ()
    {
        var result = SetScrollFactorY(items, 1);

        expect(result).toBe(items);
    });

    it('should set scrollFactorY to zero', function ()
    {
        items[0].scrollFactorY = 5;
        items[1].scrollFactorY = 3;

        SetScrollFactorY(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorY).toBe(0);
        }
    });

    it('should set scrollFactorY to a negative value', function ()
    {
        SetScrollFactorY(items, -1);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorY).toBe(-1);
        }
    });

    it('should set scrollFactorY to a floating point value', function ()
    {
        SetScrollFactorY(items, 0.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorY).toBeCloseTo(0.5);
        }
    });

    it('should increment scrollFactorY by step for each item', function ()
    {
        SetScrollFactorY(items, 1, 0.5);

        expect(items[0].scrollFactorY).toBeCloseTo(1.0);
        expect(items[1].scrollFactorY).toBeCloseTo(1.5);
        expect(items[2].scrollFactorY).toBeCloseTo(2.0);
        expect(items[3].scrollFactorY).toBeCloseTo(2.5);
        expect(items[4].scrollFactorY).toBeCloseTo(3.0);
    });

    it('should apply a negative step', function ()
    {
        SetScrollFactorY(items, 2, -0.25);

        expect(items[0].scrollFactorY).toBeCloseTo(2.0);
        expect(items[1].scrollFactorY).toBeCloseTo(1.75);
        expect(items[2].scrollFactorY).toBeCloseTo(1.5);
        expect(items[3].scrollFactorY).toBeCloseTo(1.25);
        expect(items[4].scrollFactorY).toBeCloseTo(1.0);
    });

    it('should respect the index offset', function ()
    {
        SetScrollFactorY(items, 3, 0, 2);

        expect(items[0].scrollFactorY).toBe(0);
        expect(items[1].scrollFactorY).toBe(0);
        expect(items[2].scrollFactorY).toBe(3);
        expect(items[3].scrollFactorY).toBe(3);
        expect(items[4].scrollFactorY).toBe(3);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetScrollFactorY(items, 1, 1, 4, -1);

        expect(items[4].scrollFactorY).toBeCloseTo(1);
        expect(items[3].scrollFactorY).toBeCloseTo(2);
        expect(items[2].scrollFactorY).toBeCloseTo(3);
        expect(items[1].scrollFactorY).toBeCloseTo(4);
        expect(items[0].scrollFactorY).toBeCloseTo(5);
    });

    it('should handle an empty array', function ()
    {
        var result = SetScrollFactorY([], 1);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scrollFactorY: 0 }];

        SetScrollFactorY(single, 7);

        expect(single[0].scrollFactorY).toBe(7);
    });

    it('should work with step zero (default)', function ()
    {
        SetScrollFactorY(items, 4, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorY).toBe(4);
        }
    });
});
