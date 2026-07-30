var SetScrollFactorX = require('../../src/actions/SetScrollFactorX');

describe('Phaser.Actions.SetScrollFactorX', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scrollFactorX: 0 },
            { scrollFactorX: 0 },
            { scrollFactorX: 0 },
            { scrollFactorX: 0 },
            { scrollFactorX: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetScrollFactorX(items, 1);

        expect(result).toBe(items);
    });

    it('should set scrollFactorX on all items to the given value', function ()
    {
        SetScrollFactorX(items, 2);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorX).toBe(2);
        }
    });

    it('should set scrollFactorX to zero', function ()
    {
        items[0].scrollFactorX = 5;
        items[1].scrollFactorX = 3;

        SetScrollFactorX(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorX).toBe(0);
        }
    });

    it('should set scrollFactorX to a negative value', function ()
    {
        SetScrollFactorX(items, -1);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorX).toBe(-1);
        }
    });

    it('should set scrollFactorX to a floating point value', function ()
    {
        SetScrollFactorX(items, 0.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].scrollFactorX).toBeCloseTo(0.5);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetScrollFactorX(items, 1, 2);

        expect(items[0].scrollFactorX).toBe(1);
        expect(items[1].scrollFactorX).toBe(3);
        expect(items[2].scrollFactorX).toBe(5);
        expect(items[3].scrollFactorX).toBe(7);
        expect(items[4].scrollFactorX).toBe(9);
    });

    it('should apply a negative step incrementally across items', function ()
    {
        SetScrollFactorX(items, 10, -2);

        expect(items[0].scrollFactorX).toBe(10);
        expect(items[1].scrollFactorX).toBe(8);
        expect(items[2].scrollFactorX).toBe(6);
        expect(items[3].scrollFactorX).toBe(4);
        expect(items[4].scrollFactorX).toBe(2);
    });

    it('should apply a fractional step incrementally', function ()
    {
        SetScrollFactorX(items, 0, 0.5);

        expect(items[0].scrollFactorX).toBeCloseTo(0);
        expect(items[1].scrollFactorX).toBeCloseTo(0.5);
        expect(items[2].scrollFactorX).toBeCloseTo(1.0);
        expect(items[3].scrollFactorX).toBeCloseTo(1.5);
        expect(items[4].scrollFactorX).toBeCloseTo(2.0);
    });

    it('should start from the given index offset', function ()
    {
        SetScrollFactorX(items, 5, 0, 2);

        expect(items[0].scrollFactorX).toBe(0);
        expect(items[1].scrollFactorX).toBe(0);
        expect(items[2].scrollFactorX).toBe(5);
        expect(items[3].scrollFactorX).toBe(5);
        expect(items[4].scrollFactorX).toBe(5);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetScrollFactorX(items, 1, 1, 4, -1);

        expect(items[4].scrollFactorX).toBe(1);
        expect(items[3].scrollFactorX).toBe(2);
        expect(items[2].scrollFactorX).toBe(3);
        expect(items[1].scrollFactorX).toBe(4);
        expect(items[0].scrollFactorX).toBe(5);
    });

    it('should handle an empty array without error', function ()
    {
        var result = SetScrollFactorX([], 1);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scrollFactorX: 0 }];

        SetScrollFactorX(single, 7);

        expect(single[0].scrollFactorX).toBe(7);
    });

    it('should not modify items before the index offset', function ()
    {
        items[0].scrollFactorX = 99;
        items[1].scrollFactorX = 99;

        SetScrollFactorX(items, 1, 0, 2);

        expect(items[0].scrollFactorX).toBe(99);
        expect(items[1].scrollFactorX).toBe(99);
    });
});
