var ScaleX = require('../../src/actions/ScaleX');

describe('Phaser.Actions.ScaleX', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleX: 1 },
            { scaleX: 2 },
            { scaleX: 3 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = ScaleX(items, 0);

        expect(result).toBe(items);
    });

    it('should add value to each scaleX property', function ()
    {
        ScaleX(items, 2);

        expect(items[0].scaleX).toBe(3);
        expect(items[1].scaleX).toBe(4);
        expect(items[2].scaleX).toBe(5);
    });

    it('should add a negative value to each scaleX property', function ()
    {
        ScaleX(items, -1);

        expect(items[0].scaleX).toBe(0);
        expect(items[1].scaleX).toBe(1);
        expect(items[2].scaleX).toBe(2);
    });

    it('should add zero value leaving scaleX unchanged', function ()
    {
        ScaleX(items, 0);

        expect(items[0].scaleX).toBe(1);
        expect(items[1].scaleX).toBe(2);
        expect(items[2].scaleX).toBe(3);
    });

    it('should apply step incrementally to each item', function ()
    {
        ScaleX(items, 1, 2);

        // item[0]: 1 + (1 + 0*2) = 2
        // item[1]: 2 + (1 + 1*2) = 5
        // item[2]: 3 + (1 + 2*2) = 8
        expect(items[0].scaleX).toBe(2);
        expect(items[1].scaleX).toBe(5);
        expect(items[2].scaleX).toBe(8);
    });

    it('should apply a negative step incrementally', function ()
    {
        ScaleX(items, 5, -1);

        // item[0]: 1 + (5 + 0*-1) = 6
        // item[1]: 2 + (5 + 1*-1) = 6
        // item[2]: 3 + (5 + 2*-1) = 6
        expect(items[0].scaleX).toBe(6);
        expect(items[1].scaleX).toBe(6);
        expect(items[2].scaleX).toBe(6);
    });

    it('should respect index offset, skipping earlier items', function ()
    {
        ScaleX(items, 10, 0, 1);

        expect(items[0].scaleX).toBe(1);
        expect(items[1].scaleX).toBe(12);
        expect(items[2].scaleX).toBe(13);
    });

    it('should iterate from end to start when direction is -1', function ()
    {
        ScaleX(items, 1, 0, 2, -1);

        // direction=-1, index=2: iterates i=2, i=1, i=0
        expect(items[0].scaleX).toBe(2);
        expect(items[1].scaleX).toBe(3);
        expect(items[2].scaleX).toBe(4);
    });

    it('should apply step in reverse direction correctly', function ()
    {
        ScaleX(items, 1, 1, 2, -1);

        // direction=-1, index=2, step=1
        // t=0: items[2] += 1 + 0*1 = 1  -> 4
        // t=1: items[1] += 1 + 1*1 = 2  -> 4
        // t=2: items[0] += 1 + 2*1 = 3  -> 4
        expect(items[0].scaleX).toBe(4);
        expect(items[1].scaleX).toBe(4);
        expect(items[2].scaleX).toBe(4);
    });

    it('should handle an empty array without errors', function ()
    {
        var result = ScaleX([], 5);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scaleX: 2 }];

        ScaleX(single, 3);

        expect(single[0].scaleX).toBe(5);
    });

    it('should handle floating point values', function ()
    {
        ScaleX(items, 0.5);

        expect(items[0].scaleX).toBeCloseTo(1.5);
        expect(items[1].scaleX).toBeCloseTo(2.5);
        expect(items[2].scaleX).toBeCloseTo(3.5);
    });

    it('should handle floating point step values', function ()
    {
        ScaleX(items, 0, 0.1);

        // item[0]: 1 + (0 + 0*0.1) = 1
        // item[1]: 2 + (0 + 1*0.1) = 2.1
        // item[2]: 3 + (0 + 2*0.1) = 3.2
        expect(items[0].scaleX).toBeCloseTo(1.0);
        expect(items[1].scaleX).toBeCloseTo(2.1);
        expect(items[2].scaleX).toBeCloseTo(3.2);
    });

    it('should default step to 0 when not provided', function ()
    {
        ScaleX(items, 5);

        expect(items[0].scaleX).toBe(6);
        expect(items[1].scaleX).toBe(7);
        expect(items[2].scaleX).toBe(8);
    });

    it('should default index to 0 when not provided', function ()
    {
        ScaleX(items, 1, 0);

        expect(items[0].scaleX).toBe(2);
        expect(items[1].scaleX).toBe(3);
        expect(items[2].scaleX).toBe(4);
    });

    it('should default direction to 1 when not provided', function ()
    {
        var forward = [{ scaleX: 1 }, { scaleX: 1 }, { scaleX: 1 }];

        ScaleX(forward, 1, 1);

        // forward direction with step=1:
        // t=0: 1 + (1 + 0) = 2
        // t=1: 1 + (1 + 1) = 3
        // t=2: 1 + (1 + 2) = 4
        expect(forward[0].scaleX).toBe(2);
        expect(forward[1].scaleX).toBe(3);
        expect(forward[2].scaleX).toBe(4);
    });
});
