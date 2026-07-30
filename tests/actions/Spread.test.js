var Spread = require('../../src/actions/Spread');

describe('Phaser.Actions.Spread', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { alpha: 0 },
            { alpha: 0 },
            { alpha: 0 },
            { alpha: 0 },
            { alpha: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = Spread(items, 'alpha', 0, 1);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var empty = [];
        var result = Spread(empty, 'alpha', 0, 1);

        expect(result).toBe(empty);
        expect(result.length).toBe(0);
    });

    it('should set the first item to the center value when only one item exists', function ()
    {
        var single = [ { alpha: 0 } ];
        Spread(single, 'alpha', 0, 1);

        expect(single[0].alpha).toBeCloseTo(0.5);
    });

    it('should set the first item to center of negative and positive range with one item', function ()
    {
        var single = [ { x: 0 } ];
        Spread(single, 'x', -100, 100);

        expect(single[0].x).toBe(0);
    });

    it('should increment the single item by the center value when inc is true', function ()
    {
        var single = [ { alpha: 0.2 } ];
        Spread(single, 'alpha', 0, 1, true);

        expect(single[0].alpha).toBeCloseTo(0.7);
    });

    it('should set the first item to min and last item to max when inc is false', function ()
    {
        Spread(items, 'alpha', 0, 1);

        expect(items[0].alpha).toBeCloseTo(0);
        expect(items[items.length - 1].alpha).toBeCloseTo(1);
    });

    it('should spread values evenly across all items', function ()
    {
        Spread(items, 'alpha', 0, 1);

        expect(items[0].alpha).toBeCloseTo(0);
        expect(items[1].alpha).toBeCloseTo(0.25);
        expect(items[2].alpha).toBeCloseTo(0.5);
        expect(items[3].alpha).toBeCloseTo(0.75);
        expect(items[4].alpha).toBeCloseTo(1);
    });

    it('should default inc to false when not provided', function ()
    {
        items[0].alpha = 99;
        Spread(items, 'alpha', 0, 1);

        expect(items[0].alpha).toBeCloseTo(0);
    });

    it('should increment existing property values when inc is true', function ()
    {
        items[0].alpha = 0.1;
        items[1].alpha = 0.1;
        items[2].alpha = 0.1;
        items[3].alpha = 0.1;
        items[4].alpha = 0.1;

        Spread(items, 'alpha', 0, 1, true);

        expect(items[0].alpha).toBeCloseTo(0.1);
        expect(items[1].alpha).toBeCloseTo(0.35);
        expect(items[2].alpha).toBeCloseTo(0.6);
        expect(items[3].alpha).toBeCloseTo(0.85);
        expect(items[4].alpha).toBeCloseTo(1.1);
    });

    it('should work with negative min values', function ()
    {
        Spread(items, 'alpha', -1, 1);

        expect(items[0].alpha).toBeCloseTo(-1);
        expect(items[2].alpha).toBeCloseTo(0);
        expect(items[4].alpha).toBeCloseTo(1);
    });

    it('should work when min and max are both negative', function ()
    {
        Spread(items, 'alpha', -2, -1);

        expect(items[0].alpha).toBeCloseTo(-2);
        expect(items[4].alpha).toBeCloseTo(-1);
    });

    it('should work when min is greater than max', function ()
    {
        Spread(items, 'alpha', 1, 0);

        // step = Math.abs(0 - 1) / 4 = 0.25, values go up from min (1)
        expect(items[0].alpha).toBeCloseTo(1);
        expect(items[1].alpha).toBeCloseTo(1.25);
        expect(items[4].alpha).toBeCloseTo(2);
    });

    it('should work with two items', function ()
    {
        var two = [ { x: 0 }, { x: 0 } ];
        Spread(two, 'x', 0, 100);

        expect(two[0].x).toBeCloseTo(0);
        expect(two[1].x).toBeCloseTo(100);
    });

    it('should work with a different property name', function ()
    {
        var objs = [
            { x: 0 },
            { x: 0 },
            { x: 0 }
        ];

        Spread(objs, 'x', 10, 20);

        expect(objs[0].x).toBeCloseTo(10);
        expect(objs[1].x).toBeCloseTo(15);
        expect(objs[2].x).toBeCloseTo(20);
    });

    it('should work with large ranges', function ()
    {
        var objs = [ { x: 0 }, { x: 0 } ];
        Spread(objs, 'x', 0, 1000);

        expect(objs[0].x).toBeCloseTo(0);
        expect(objs[1].x).toBeCloseTo(1000);
    });

    it('should work with floating point min and max', function ()
    {
        var three = [ { v: 0 }, { v: 0 }, { v: 0 } ];
        Spread(three, 'v', 0.1, 0.9);

        expect(three[0].v).toBeCloseTo(0.1);
        expect(three[1].v).toBeCloseTo(0.5);
        expect(three[2].v).toBeCloseTo(0.9);
    });

    it('should not mutate items when min equals max', function ()
    {
        Spread(items, 'alpha', 0.5, 0.5);

        for (var i = 0; i < items.length; i++)
        {
            expect(items[i].alpha).toBeCloseTo(0.5);
        }
    });

    it('should increment correctly when inc is true with zero starting values', function ()
    {
        var three = [ { x: 0 }, { x: 0 }, { x: 0 } ];
        Spread(three, 'x', 0, 10, true);

        expect(three[0].x).toBeCloseTo(0);
        expect(three[1].x).toBeCloseTo(5);
        expect(three[2].x).toBeCloseTo(10);
    });
});
