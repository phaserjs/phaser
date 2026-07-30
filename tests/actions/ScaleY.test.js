var ScaleY = require('../../src/actions/ScaleY');

describe('Phaser.Actions.ScaleY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleY: 1 },
            { scaleY: 1 },
            { scaleY: 1 },
            { scaleY: 1 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = ScaleY(items, 1);

        expect(result).toBe(items);
    });

    it('should add value to each item scaleY property', function ()
    {
        ScaleY(items, 2);

        expect(items[0].scaleY).toBe(3);
        expect(items[1].scaleY).toBe(3);
        expect(items[2].scaleY).toBe(3);
        expect(items[3].scaleY).toBe(3);
    });

    it('should add a negative value to each item scaleY property', function ()
    {
        ScaleY(items, -0.5);

        expect(items[0].scaleY).toBeCloseTo(0.5);
        expect(items[1].scaleY).toBeCloseTo(0.5);
        expect(items[2].scaleY).toBeCloseTo(0.5);
        expect(items[3].scaleY).toBeCloseTo(0.5);
    });

    it('should add zero value leaving scaleY unchanged', function ()
    {
        ScaleY(items, 0);

        expect(items[0].scaleY).toBe(1);
        expect(items[1].scaleY).toBe(1);
        expect(items[2].scaleY).toBe(1);
        expect(items[3].scaleY).toBe(1);
    });

    it('should apply step incrementally across items', function ()
    {
        ScaleY(items, 1, 0.5);

        // t=0: 1 + (1 + 0*0.5) = 2
        // t=1: 1 + (1 + 1*0.5) = 2.5
        // t=2: 1 + (1 + 2*0.5) = 3
        // t=3: 1 + (1 + 3*0.5) = 3.5
        expect(items[0].scaleY).toBeCloseTo(2);
        expect(items[1].scaleY).toBeCloseTo(2.5);
        expect(items[2].scaleY).toBeCloseTo(3);
        expect(items[3].scaleY).toBeCloseTo(3.5);
    });

    it('should apply a negative step incrementally across items', function ()
    {
        ScaleY(items, 2, -0.25);

        // t=0: 1 + (2 + 0*-0.25) = 3
        // t=1: 1 + (2 + 1*-0.25) = 2.75
        // t=2: 1 + (2 + 2*-0.25) = 2.5
        // t=3: 1 + (2 + 3*-0.25) = 2.25
        expect(items[0].scaleY).toBeCloseTo(3);
        expect(items[1].scaleY).toBeCloseTo(2.75);
        expect(items[2].scaleY).toBeCloseTo(2.5);
        expect(items[3].scaleY).toBeCloseTo(2.25);
    });

    it('should start from index offset when index is provided', function ()
    {
        ScaleY(items, 5, 0, 2);

        expect(items[0].scaleY).toBe(1);
        expect(items[1].scaleY).toBe(1);
        expect(items[2].scaleY).toBe(6);
        expect(items[3].scaleY).toBe(6);
    });

    it('should iterate from end to start when direction is -1', function ()
    {
        // direction=-1 iterates from index down to 0
        // Starting at index=3 (last item), going backwards
        ScaleY(items, 1, 0, 3, -1);

        // t=0: items[3] += 1 + 0 = 2
        // t=1: items[2] += 1 + 0 = 2
        // t=2: items[1] += 1 + 0 = 2
        // t=3: items[0] += 1 + 0 = 2
        expect(items[0].scaleY).toBe(2);
        expect(items[1].scaleY).toBe(2);
        expect(items[2].scaleY).toBe(2);
        expect(items[3].scaleY).toBe(2);
    });

    it('should apply step in reverse direction correctly', function ()
    {
        ScaleY(items, 1, 1, 3, -1);

        // t=0: items[3] += 1 + 0*1 = 2
        // t=1: items[2] += 1 + 1*1 = 3
        // t=2: items[1] += 1 + 2*1 = 4
        // t=3: items[0] += 1 + 3*1 = 5
        expect(items[3].scaleY).toBe(2);
        expect(items[2].scaleY).toBe(3);
        expect(items[1].scaleY).toBe(4);
        expect(items[0].scaleY).toBe(5);
    });

    it('should handle an empty array without error', function ()
    {
        var result = ScaleY([], 5);

        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scaleY: 2 }];

        ScaleY(single, 3);

        expect(single[0].scaleY).toBe(5);
    });

    it('should handle floating point values correctly', function ()
    {
        var floatItems = [
            { scaleY: 0.1 },
            { scaleY: 0.2 },
            { scaleY: 0.3 }
        ];

        ScaleY(floatItems, 0.1);

        expect(floatItems[0].scaleY).toBeCloseTo(0.2);
        expect(floatItems[1].scaleY).toBeCloseTo(0.3);
        expect(floatItems[2].scaleY).toBeCloseTo(0.4);
    });

    it('should handle items with scaleY of zero', function ()
    {
        var zeroItems = [
            { scaleY: 0 },
            { scaleY: 0 }
        ];

        ScaleY(zeroItems, 2);

        expect(zeroItems[0].scaleY).toBe(2);
        expect(zeroItems[1].scaleY).toBe(2);
    });

    it('should handle items with negative scaleY values', function ()
    {
        var negItems = [
            { scaleY: -1 },
            { scaleY: -2 }
        ];

        ScaleY(negItems, 1);

        expect(negItems[0].scaleY).toBe(0);
        expect(negItems[1].scaleY).toBe(-1);
    });

    it('should not modify items before the index offset', function ()
    {
        ScaleY(items, 10, 0, 3);

        expect(items[0].scaleY).toBe(1);
        expect(items[1].scaleY).toBe(1);
        expect(items[2].scaleY).toBe(1);
        expect(items[3].scaleY).toBe(11);
    });
});
