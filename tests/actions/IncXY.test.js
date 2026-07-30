var IncXY = require('../../src/actions/IncXY');

describe('Phaser.Actions.IncXY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { x: 0, y: 0 },
            { x: 10, y: 20 },
            { x: -5, y: -10 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = IncXY(items, 5, 5);
        expect(result).toBe(items);
    });

    it('should increment x and y of all items by the given values', function ()
    {
        IncXY(items, 3, 7);
        expect(items[0].x).toBe(3);
        expect(items[0].y).toBe(7);
        expect(items[1].x).toBe(13);
        expect(items[1].y).toBe(27);
        expect(items[2].x).toBe(-2);
        expect(items[2].y).toBe(-3);
    });

    it('should use x value for y when y is undefined', function ()
    {
        IncXY(items, 5);
        expect(items[0].x).toBe(5);
        expect(items[0].y).toBe(5);
        expect(items[1].x).toBe(15);
        expect(items[1].y).toBe(25);
    });

    it('should use x value for y when y is null', function ()
    {
        IncXY(items, 4, null);
        expect(items[0].x).toBe(4);
        expect(items[0].y).toBe(4);
        expect(items[1].x).toBe(14);
        expect(items[1].y).toBe(24);
    });

    it('should apply stepX incrementally to x', function ()
    {
        IncXY(items, 10, 0, 5, 0);
        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(25);
        expect(items[2].x).toBe(15);
    });

    it('should apply stepY incrementally to y', function ()
    {
        IncXY(items, 0, 10, 0, 5);
        expect(items[0].y).toBe(10);
        expect(items[1].y).toBe(35);
        expect(items[2].y).toBe(10);
    });

    it('should apply both stepX and stepY incrementally', function ()
    {
        IncXY(items, 1, 2, 3, 4);
        expect(items[0].x).toBe(1);
        expect(items[0].y).toBe(2);
        expect(items[1].x).toBe(14);
        expect(items[1].y).toBe(26);
        expect(items[2].x).toBe(2);
        expect(items[2].y).toBe(0);
    });

    it('should work with an index offset', function ()
    {
        IncXY(items, 5, 5, 0, 0, 1);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(15);
        expect(items[1].y).toBe(25);
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(-5);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        IncXY(items, 10, 10, 5, 5, 2, -1);
        expect(items[2].x).toBe(5);
        expect(items[2].y).toBe(0);
        expect(items[1].x).toBe(25);
        expect(items[1].y).toBe(35);
        expect(items[0].x).toBe(20);
        expect(items[0].y).toBe(20);
    });

    it('should work with negative increment values', function ()
    {
        IncXY(items, -3, -7);
        expect(items[0].x).toBe(-3);
        expect(items[0].y).toBe(-7);
        expect(items[1].x).toBe(7);
        expect(items[1].y).toBe(13);
    });

    it('should work with floating point values', function ()
    {
        IncXY(items, 1.5, 2.5);
        expect(items[0].x).toBeCloseTo(1.5);
        expect(items[0].y).toBeCloseTo(2.5);
        expect(items[1].x).toBeCloseTo(11.5);
        expect(items[1].y).toBeCloseTo(22.5);
    });

    it('should work with zero increment values', function ()
    {
        IncXY(items, 0, 0);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(10);
        expect(items[1].y).toBe(20);
    });

    it('should return an empty array when given an empty array', function ()
    {
        var result = IncXY([], 5, 5);
        expect(result).toEqual([]);
    });

    it('should work with a single item array', function ()
    {
        var single = [{ x: 3, y: 7 }];
        IncXY(single, 2, 4);
        expect(single[0].x).toBe(5);
        expect(single[0].y).toBe(11);
    });
});
