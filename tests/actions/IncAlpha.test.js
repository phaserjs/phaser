var IncAlpha = require('../../src/actions/IncAlpha');

describe('Phaser.Actions.IncAlpha', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { alpha: 1 },
            { alpha: 0.5 },
            { alpha: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = IncAlpha(items, 0.1);

        expect(result).toBe(items);
    });

    it('should add the value to each item alpha property', function ()
    {
        IncAlpha(items, 0.1);

        expect(items[0].alpha).toBeCloseTo(1.1);
        expect(items[1].alpha).toBeCloseTo(0.6);
        expect(items[2].alpha).toBeCloseTo(0.1);
    });

    it('should subtract from alpha when value is negative', function ()
    {
        IncAlpha(items, -0.2);

        expect(items[0].alpha).toBeCloseTo(0.8);
        expect(items[1].alpha).toBeCloseTo(0.3);
        expect(items[2].alpha).toBeCloseTo(-0.2);
    });

    it('should add zero and leave alpha unchanged when value is 0', function ()
    {
        IncAlpha(items, 0);

        expect(items[0].alpha).toBeCloseTo(1);
        expect(items[1].alpha).toBeCloseTo(0.5);
        expect(items[2].alpha).toBeCloseTo(0);
    });

    it('should apply step incrementally multiplied by iteration counter', function ()
    {
        IncAlpha(items, 0.1, 0.1);

        // i=0: alpha += 0.1 + (0 * 0.1) = 0.1  => 1.1
        // i=1: alpha += 0.1 + (1 * 0.1) = 0.2  => 0.7
        // i=2: alpha += 0.1 + (2 * 0.1) = 0.3  => 0.3
        expect(items[0].alpha).toBeCloseTo(1.1);
        expect(items[1].alpha).toBeCloseTo(0.7);
        expect(items[2].alpha).toBeCloseTo(0.3);
    });

    it('should default step to 0 when not provided', function ()
    {
        IncAlpha(items, 0.5);

        expect(items[0].alpha).toBeCloseTo(1.5);
        expect(items[1].alpha).toBeCloseTo(1.0);
        expect(items[2].alpha).toBeCloseTo(0.5);
    });

    it('should start from the given index when index is provided', function ()
    {
        IncAlpha(items, 0.1, 0, 1);

        expect(items[0].alpha).toBeCloseTo(1);
        expect(items[1].alpha).toBeCloseTo(0.6);
        expect(items[2].alpha).toBeCloseTo(0.1);
    });

    it('should iterate end to start when direction is -1', function ()
    {
        var reversedItems = [
            { alpha: 0.2 },
            { alpha: 0.4 },
            { alpha: 0.6 }
        ];

        IncAlpha(reversedItems, 0.1, 0, 2, -1);

        // i=2: alpha += 0.1 + (0 * 0) = 0.1 => 0.7
        // i=1: alpha += 0.1 + (1 * 0) = 0.1 => 0.5
        // i=0: alpha += 0.1 + (2 * 0) = 0.1 => 0.3
        expect(reversedItems[2].alpha).toBeCloseTo(0.7);
        expect(reversedItems[1].alpha).toBeCloseTo(0.5);
        expect(reversedItems[0].alpha).toBeCloseTo(0.3);
    });

    it('should apply step correctly when iterating in reverse', function ()
    {
        var reversedItems = [
            { alpha: 0.2 },
            { alpha: 0.4 },
            { alpha: 0.6 }
        ];

        IncAlpha(reversedItems, 0.1, 0.1, 2, -1);

        // i=2: alpha += 0.1 + (0 * 0.1) = 0.1 => 0.7
        // i=1: alpha += 0.1 + (1 * 0.1) = 0.2 => 0.6
        // i=0: alpha += 0.1 + (2 * 0.1) = 0.3 => 0.5
        expect(reversedItems[2].alpha).toBeCloseTo(0.7);
        expect(reversedItems[1].alpha).toBeCloseTo(0.6);
        expect(reversedItems[0].alpha).toBeCloseTo(0.5);
    });

    it('should handle an empty array without error', function ()
    {
        var result = IncAlpha([], 0.5);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ alpha: 0.5 }];

        IncAlpha(single, 0.3);

        expect(single[0].alpha).toBeCloseTo(0.8);
    });

    it('should handle large values that exceed 1', function ()
    {
        IncAlpha(items, 2);

        expect(items[0].alpha).toBeCloseTo(3);
        expect(items[1].alpha).toBeCloseTo(2.5);
        expect(items[2].alpha).toBeCloseTo(2);
    });

    it('should handle floating point step values', function ()
    {
        var twoItems = [{ alpha: 0 }, { alpha: 0 }];

        IncAlpha(twoItems, 0.1, 0.05);

        // i=0: alpha += 0.1 + (0 * 0.05) = 0.1
        // i=1: alpha += 0.1 + (1 * 0.05) = 0.15
        expect(twoItems[0].alpha).toBeCloseTo(0.1);
        expect(twoItems[1].alpha).toBeCloseTo(0.15);
    });
});
