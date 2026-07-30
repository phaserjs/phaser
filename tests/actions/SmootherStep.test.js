var SmootherStep = require('../../src/actions/SmootherStep');
var MathSmootherStep = require('../../src/math/SmootherStep');

describe('Phaser.Actions.SmootherStep', function ()
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
        var result = SmootherStep(items, 'x', 0, 100);

        expect(result).toBe(items);
    });

    it('should set the property on each item using smootherstep interpolation', function ()
    {
        SmootherStep(items, 'x', 0, 100);

        var step = Math.abs(100 - 0) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmootherStep(i * step, 0, 100));
        }
    });

    it('should set the first item to 0 when min is 0', function ()
    {
        SmootherStep(items, 'x', 0, 100);

        expect(items[0].x).toBeCloseTo(0);
    });

    it('should produce values between 0 and 1 when min is 0 and max is 1', function ()
    {
        SmootherStep(items, 'x', 0, 1);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeGreaterThanOrEqual(0);
            expect(items[i].x).toBeLessThanOrEqual(1);
        }
    });

    it('should increment the property when inc is true', function ()
    {
        items[0].x = 10;
        items[1].x = 20;
        items[2].x = 30;
        items[3].x = 40;
        items[4].x = 50;

        var step = Math.abs(100 - 0) / items.length;
        var expected = [
            10 + MathSmootherStep(0 * step, 0, 100),
            20 + MathSmootherStep(1 * step, 0, 100),
            30 + MathSmootherStep(2 * step, 0, 100),
            40 + MathSmootherStep(3 * step, 0, 100),
            50 + MathSmootherStep(4 * step, 0, 100)
        ];

        SmootherStep(items, 'x', 0, 100, true);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(expected[i]);
        }
    });

    it('should set the property (not increment) when inc is false', function ()
    {
        items[0].x = 999;
        items[1].x = 999;

        SmootherStep(items, 'x', 0, 100, false);

        var step = Math.abs(100 - 0) / items.length;

        expect(items[0].x).toBeCloseTo(MathSmootherStep(0, 0, 100));
        expect(items[1].x).toBeCloseTo(MathSmootherStep(step, 0, 100));
    });

    it('should default inc to false when not provided', function ()
    {
        items[0].x = 999;

        SmootherStep(items, 'x', 0, 100);

        expect(items[0].x).toBeCloseTo(MathSmootherStep(0, 0, 100));
    });

    it('should work with a single item', function ()
    {
        var single = [{ x: 0 }];

        SmootherStep(single, 'x', 0, 100);

        expect(single[0].x).toBeCloseTo(MathSmootherStep(0, 0, 100));
    });

    it('should work with negative min and max values', function ()
    {
        SmootherStep(items, 'x', -100, -10);

        var step = Math.abs(-10 - (-100)) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmootherStep(i * step, -100, -10));
        }
    });

    it('should work with floating point min and max values', function ()
    {
        SmootherStep(items, 'x', 0.5, 1.5);

        var step = Math.abs(1.5 - 0.5) / items.length;

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].x).toBeCloseTo(MathSmootherStep(i * step, 0.5, 1.5));
        }
    });

    it('should work with any string property name', function ()
    {
        var objs = [
            { alpha: 0 },
            { alpha: 0 },
            { alpha: 0 }
        ];

        SmootherStep(objs, 'alpha', 0, 1);

        var step = Math.abs(1 - 0) / objs.length;

        for (var i = 0; i < objs.length; i++)
        {
            expect(objs[i].alpha).toBeCloseTo(MathSmootherStep(i * step, 0, 1));
        }
    });

    it('should return an empty array when given an empty array', function ()
    {
        var result = SmootherStep([], 'x', 0, 100);

        expect(result).toEqual([]);
    });

    it('should produce a monotonically non-decreasing sequence for increasing min/max', function ()
    {
        SmootherStep(items, 'x', 0, 100);

        for (var i = 1; i < items.length; i++)
        {
            expect(items[i].x).toBeGreaterThanOrEqual(items[i - 1].x);
        }
    });
});
