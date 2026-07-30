var SmoothStep = require('../../src/actions/SmoothStep');
var MathSmoothStep = require('../../src/math/SmoothStep');

describe('Phaser.Actions.SmoothStep', function ()
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
        var result = SmoothStep(items, 'x', 0, 100);

        expect(result).toBe(items);
    });

    it('should set property values using smoothstep interpolation', function ()
    {
        SmoothStep(items, 'x', 0, 100);

        var step = Math.abs(100 - 0) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmoothStep(i * step, 0, 100));
        }
    });

    it('should assign values in range [0, 1] for all items', function ()
    {
        SmoothStep(items, 'x', 0, 100);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeGreaterThanOrEqual(0);
            expect(items[i].x).toBeLessThanOrEqual(1);
        }
    });

    it('should set the first item to 0 when step starts at left edge', function ()
    {
        SmoothStep(items, 'x', 0, 100);

        expect(items[0].x).toBe(0);
    });

    it('should increment property values when inc is true', function ()
    {
        for (var i = 0; i < items.length; i++)
        {
            items[i].x = 10;
        }

        SmoothStep(items, 'x', 0, 100, true);

        var step = Math.abs(100 - 0) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(10 + MathSmoothStep(i * step, 0, 100));
        }
    });

    it('should set property values (not increment) when inc is false', function ()
    {
        for (var i = 0; i < items.length; i++)
        {
            items[i].x = 999;
        }

        SmoothStep(items, 'x', 0, 100, false);

        var step = Math.abs(100 - 0) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmoothStep(i * step, 0, 100));
        }
    });

    it('should default inc to false when not provided', function ()
    {
        for (var i = 0; i < items.length; i++)
        {
            items[i].x = 999;
        }

        SmoothStep(items, 'x', 0, 100);

        var step = Math.abs(100 - 0) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmoothStep(i * step, 0, 100));
        }
    });

    it('should work with a single item array', function ()
    {
        var single = [ { x: 5 } ];

        SmoothStep(single, 'x', 0, 10);

        expect(single[0].x).toBe(0);
    });

    it('should work with negative min and max values', function ()
    {
        SmoothStep(items, 'x', -100, -10);

        var step = Math.abs(-10 - (-100)) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmoothStep(i * step, -100, -10));
        }
    });

    it('should work on any named property', function ()
    {
        var objects = [
            { alpha: 0 },
            { alpha: 0 },
            { alpha: 0 }
        ];

        SmoothStep(objects, 'alpha', 0, 1);

        var step = Math.abs(1 - 0) / objects.length;

        for (var i = 0; i < objects.length; i++)
        {
            expect(objects[i].alpha).toBeCloseTo(MathSmoothStep(i * step, 0, 1));
        }
    });

    it('should return an empty array unchanged when given empty items', function ()
    {
        var result = SmoothStep([], 'x', 0, 100);

        expect(result).toEqual([]);
    });

    it('should produce monotonically non-decreasing values across items', function ()
    {
        SmoothStep(items, 'x', 0, 100);

        for (var i = 1; i < items.length; i++)
        {
            expect(items[i].x).toBeGreaterThanOrEqual(items[i - 1].x);
        }
    });

    it('should use the absolute difference of min and max for step calculation', function ()
    {
        var itemsA = [ { x: 0 }, { x: 0 }, { x: 0 } ];
        var itemsB = [ { x: 0 }, { x: 0 }, { x: 0 } ];

        SmoothStep(itemsA, 'x', 0, 90);
        SmoothStep(itemsB, 'x', 0, 90);

        for (var i = 0; i < itemsA.length; i++)
        {
            expect(itemsA[i].x).toBeCloseTo(itemsB[i].x);
        }
    });

    it('should clamp output to 1 when the step value reaches or exceeds max', function ()
    {
        var twoItems = [ { x: 0 }, { x: 0 } ];

        SmoothStep(twoItems, 'x', 0, 50);

        var step = Math.abs(50 - 0) / twoItems.length;

        expect(twoItems[0].x).toBeCloseTo(MathSmoothStep(0 * step, 0, 50));
        expect(twoItems[1].x).toBeCloseTo(MathSmoothStep(1 * step, 0, 50));
    });
});
