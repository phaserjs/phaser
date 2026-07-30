var SetAlpha = require('../../src/actions/SetAlpha');

describe('Phaser.Actions.SetAlpha', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { alpha: 1 },
            { alpha: 1 },
            { alpha: 1 },
            { alpha: 1 },
            { alpha: 1 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetAlpha(items, 0.5);

        expect(result).toBe(items);
    });

    it('should set alpha on all items to the given value', function ()
    {
        SetAlpha(items, 0.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].alpha).toBe(0.5);
        }
    });

    it('should set alpha to 0 (fully transparent)', function ()
    {
        SetAlpha(items, 0);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].alpha).toBe(0);
        }
    });

    it('should set alpha to 1 (fully opaque)', function ()
    {
        SetAlpha(items, 1);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].alpha).toBe(1);
        }
    });

    it('should apply step incrementally across items', function ()
    {
        SetAlpha(items, 0, 0.25);

        expect(items[0].alpha).toBeCloseTo(0);
        expect(items[1].alpha).toBeCloseTo(0.25);
        expect(items[2].alpha).toBeCloseTo(0.5);
        expect(items[3].alpha).toBeCloseTo(0.75);
        expect(items[4].alpha).toBeCloseTo(1);
    });

    it('should default step to 0 when not provided', function ()
    {
        SetAlpha(items, 0.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].alpha).toBe(0.5);
        }
    });

    it('should start from the given index', function ()
    {
        SetAlpha(items, 0.5, 0, 2);

        expect(items[0].alpha).toBe(1);
        expect(items[1].alpha).toBe(1);
        expect(items[2].alpha).toBe(0.5);
        expect(items[3].alpha).toBe(0.5);
        expect(items[4].alpha).toBe(0.5);
    });

    it('should apply step correctly when starting from a non-zero index', function ()
    {
        SetAlpha(items, 0, 0.1, 2);

        expect(items[0].alpha).toBe(1);
        expect(items[1].alpha).toBe(1);
        expect(items[2].alpha).toBeCloseTo(0);
        expect(items[3].alpha).toBeCloseTo(0.1);
        expect(items[4].alpha).toBeCloseTo(0.2);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetAlpha(items, 0.8, 0, 4, -1);

        expect(items[4].alpha).toBe(0.8);
        expect(items[3].alpha).toBe(0.8);
        expect(items[2].alpha).toBe(0.8);
        expect(items[1].alpha).toBe(0.8);
        expect(items[0].alpha).toBe(0.8);
    });

    it('should apply step in reverse direction', function ()
    {
        SetAlpha(items, 1, -0.25, 4, -1);

        expect(items[4].alpha).toBeCloseTo(1);
        expect(items[3].alpha).toBeCloseTo(0.75);
        expect(items[2].alpha).toBeCloseTo(0.5);
        expect(items[1].alpha).toBeCloseTo(0.25);
        expect(items[0].alpha).toBeCloseTo(0);
    });

    it('should handle an empty array', function ()
    {
        var result = SetAlpha([], 0.5);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ alpha: 0 }];

        SetAlpha(single, 0.7);

        expect(single[0].alpha).toBe(0.7);
    });

    it('should handle negative step values', function ()
    {
        SetAlpha(items, 1, -0.2);

        expect(items[0].alpha).toBeCloseTo(1);
        expect(items[1].alpha).toBeCloseTo(0.8);
        expect(items[2].alpha).toBeCloseTo(0.6);
        expect(items[3].alpha).toBeCloseTo(0.4);
        expect(items[4].alpha).toBeCloseTo(0.2);
    });

    it('should handle floating point alpha values', function ()
    {
        SetAlpha(items, 0.123);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].alpha).toBeCloseTo(0.123);
        }
    });

    it('should not modify items before the start index', function ()
    {
        var original = [0.1, 0.2, 0.3, 0.4, 0.5];

        for (var i = 0; i < items.length; i++)
        {
            items[i].alpha = original[i];
        }

        SetAlpha(items, 0.9, 0, 3);

        expect(items[0].alpha).toBe(0.1);
        expect(items[1].alpha).toBe(0.2);
        expect(items[2].alpha).toBe(0.3);
        expect(items[3].alpha).toBe(0.9);
        expect(items[4].alpha).toBe(0.9);
    });
});
