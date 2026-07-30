var ScaleXY = require('../../src/actions/ScaleXY');

describe('Phaser.Actions.ScaleXY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { scaleX: 1, scaleY: 1 },
            { scaleX: 1, scaleY: 1 },
            { scaleX: 1, scaleY: 1 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = ScaleXY(items, 1);
        expect(result).toBe(items);
    });

    it('should add scaleX to each item scaleX property', function ()
    {
        ScaleXY(items, 2, 0);
        expect(items[0].scaleX).toBe(3);
        expect(items[1].scaleX).toBe(3);
        expect(items[2].scaleX).toBe(3);
    });

    it('should add scaleY to each item scaleY property', function ()
    {
        ScaleXY(items, 0, 3);
        expect(items[0].scaleY).toBe(4);
        expect(items[1].scaleY).toBe(4);
        expect(items[2].scaleY).toBe(4);
    });

    it('should use scaleX value for scaleY when scaleY is undefined', function ()
    {
        ScaleXY(items, 2);
        expect(items[0].scaleX).toBe(3);
        expect(items[0].scaleY).toBe(3);
        expect(items[1].scaleX).toBe(3);
        expect(items[1].scaleY).toBe(3);
    });

    it('should use scaleX value for scaleY when scaleY is null', function ()
    {
        ScaleXY(items, 2, null);
        expect(items[0].scaleX).toBe(3);
        expect(items[0].scaleY).toBe(3);
        expect(items[1].scaleX).toBe(3);
        expect(items[1].scaleY).toBe(3);
    });

    it('should apply stepX incrementally to scaleX', function ()
    {
        ScaleXY(items, 1, 0, 2, 0);
        expect(items[0].scaleX).toBe(2);
        expect(items[1].scaleX).toBe(4);
        expect(items[2].scaleX).toBe(6);
    });

    it('should apply stepY incrementally to scaleY', function ()
    {
        ScaleXY(items, 0, 1, 0, 2);
        expect(items[0].scaleY).toBe(2);
        expect(items[1].scaleY).toBe(4);
        expect(items[2].scaleY).toBe(6);
    });

    it('should apply both stepX and stepY incrementally', function ()
    {
        ScaleXY(items, 1, 1, 1, 2);
        expect(items[0].scaleX).toBe(2);
        expect(items[1].scaleX).toBe(3);
        expect(items[2].scaleX).toBe(4);
        expect(items[0].scaleY).toBe(2);
        expect(items[1].scaleY).toBe(4);
        expect(items[2].scaleY).toBe(6);
    });

    it('should work with negative scaleX values', function ()
    {
        ScaleXY(items, -0.5, 0);
        expect(items[0].scaleX).toBeCloseTo(0.5);
        expect(items[1].scaleX).toBeCloseTo(0.5);
        expect(items[2].scaleX).toBeCloseTo(0.5);
    });

    it('should work with negative scaleY values', function ()
    {
        ScaleXY(items, 0, -0.5);
        expect(items[0].scaleY).toBeCloseTo(0.5);
        expect(items[1].scaleY).toBeCloseTo(0.5);
        expect(items[2].scaleY).toBeCloseTo(0.5);
    });

    it('should work with floating point scale values', function ()
    {
        ScaleXY(items, 0.25, 0.5);
        expect(items[0].scaleX).toBeCloseTo(1.25);
        expect(items[0].scaleY).toBeCloseTo(1.5);
    });

    it('should respect the index offset parameter', function ()
    {
        ScaleXY(items, 1, 1, 0, 0, 1);
        expect(items[0].scaleX).toBe(1);
        expect(items[0].scaleY).toBe(1);
        expect(items[1].scaleX).toBe(2);
        expect(items[1].scaleY).toBe(2);
        expect(items[2].scaleX).toBe(2);
        expect(items[2].scaleY).toBe(2);
    });

    it('should respect the direction parameter to iterate in reverse', function ()
    {
        ScaleXY(items, 1, 1, 1, 1, 2, -1);
        expect(items[2].scaleX).toBe(2);
        expect(items[2].scaleY).toBe(2);
        expect(items[1].scaleX).toBe(3);
        expect(items[1].scaleY).toBe(3);
        expect(items[0].scaleX).toBe(4);
        expect(items[0].scaleY).toBe(4);
    });

    it('should handle an empty array without error', function ()
    {
        var result = ScaleXY([], 1, 1);
        expect(result).toEqual([]);
    });

    it('should handle a single item array', function ()
    {
        var single = [{ scaleX: 2, scaleY: 3 }];
        ScaleXY(single, 1, 2);
        expect(single[0].scaleX).toBe(3);
        expect(single[0].scaleY).toBe(5);
    });

    it('should work with zero scale values leaving items unchanged', function ()
    {
        ScaleXY(items, 0, 0);
        expect(items[0].scaleX).toBe(1);
        expect(items[0].scaleY).toBe(1);
        expect(items[1].scaleX).toBe(1);
        expect(items[1].scaleY).toBe(1);
    });

    it('should work with items starting at zero scale', function ()
    {
        var zeroed = [
            { scaleX: 0, scaleY: 0 },
            { scaleX: 0, scaleY: 0 }
        ];
        ScaleXY(zeroed, 1, 2);
        expect(zeroed[0].scaleX).toBe(1);
        expect(zeroed[0].scaleY).toBe(2);
        expect(zeroed[1].scaleX).toBe(1);
        expect(zeroed[1].scaleY).toBe(2);
    });
});
