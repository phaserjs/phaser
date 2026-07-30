var SetXY = require('../../src/actions/SetXY');

describe('Phaser.Actions.SetXY', function ()
{
    var items;

    beforeEach(function ()
    {
        items = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 }
        ];
    });

    it('should return the items array', function ()
    {
        var result = SetXY(items, 10, 20);

        expect(result).toBe(items);
    });

    it('should set x and y on all items', function ()
    {
        SetXY(items, 10, 20);

        expect(items[0].x).toBe(10);
        expect(items[0].y).toBe(20);
        expect(items[1].x).toBe(10);
        expect(items[1].y).toBe(20);
        expect(items[2].x).toBe(10);
        expect(items[2].y).toBe(20);
    });

    it('should use x for y when y is undefined', function ()
    {
        SetXY(items, 42);

        expect(items[0].x).toBe(42);
        expect(items[0].y).toBe(42);
        expect(items[1].x).toBe(42);
        expect(items[1].y).toBe(42);
    });

    it('should use x for y when y is null', function ()
    {
        SetXY(items, 99, null);

        expect(items[0].x).toBe(99);
        expect(items[0].y).toBe(99);
        expect(items[1].x).toBe(99);
        expect(items[1].y).toBe(99);
    });

    it('should apply stepX incrementally to x', function ()
    {
        SetXY(items, 10, 20, 5, 0);

        expect(items[0].x).toBe(10);
        expect(items[1].x).toBe(15);
        expect(items[2].x).toBe(20);
    });

    it('should apply stepY incrementally to y', function ()
    {
        SetXY(items, 10, 20, 0, 3);

        expect(items[0].y).toBe(20);
        expect(items[1].y).toBe(23);
        expect(items[2].y).toBe(26);
    });

    it('should apply stepX and stepY independently', function ()
    {
        SetXY(items, 0, 0, 10, 5);

        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(10);
        expect(items[1].y).toBe(5);
        expect(items[2].x).toBe(20);
        expect(items[2].y).toBe(10);
    });

    it('should respect the index offset', function ()
    {
        items[0].x = 99;
        items[0].y = 99;

        SetXY(items, 5, 5, 0, 0, 1);

        expect(items[0].x).toBe(99);
        expect(items[0].y).toBe(99);
        expect(items[1].x).toBe(5);
        expect(items[1].y).toBe(5);
        expect(items[2].x).toBe(5);
        expect(items[2].y).toBe(5);
    });

    it('should iterate in reverse when direction is -1', function ()
    {
        SetXY(items, 100, 200, 0, 0, 2, -1);

        expect(items[2].x).toBe(100);
        expect(items[2].y).toBe(200);
        expect(items[1].x).toBe(100);
        expect(items[1].y).toBe(200);
        expect(items[0].x).toBe(100);
        expect(items[0].y).toBe(200);
    });

    it('should apply step in reverse direction correctly', function ()
    {
        SetXY(items, 0, 0, 10, 5, 2, -1);

        expect(items[2].x).toBe(0);
        expect(items[2].y).toBe(0);
        expect(items[1].x).toBe(10);
        expect(items[1].y).toBe(5);
        expect(items[0].x).toBe(20);
        expect(items[0].y).toBe(10);
    });

    it('should work with negative x and y values', function ()
    {
        SetXY(items, -50, -100);

        expect(items[0].x).toBe(-50);
        expect(items[0].y).toBe(-100);
        expect(items[2].x).toBe(-50);
        expect(items[2].y).toBe(-100);
    });

    it('should work with floating point values', function ()
    {
        SetXY(items, 1.5, 2.7);

        expect(items[0].x).toBeCloseTo(1.5);
        expect(items[0].y).toBeCloseTo(2.7);
    });

    it('should work with floating point steps', function ()
    {
        SetXY(items, 0, 0, 0.5, 0.25);

        expect(items[0].x).toBeCloseTo(0);
        expect(items[0].y).toBeCloseTo(0);
        expect(items[1].x).toBeCloseTo(0.5);
        expect(items[1].y).toBeCloseTo(0.25);
        expect(items[2].x).toBeCloseTo(1.0);
        expect(items[2].y).toBeCloseTo(0.5);
    });

    it('should work with a single-item array', function ()
    {
        var single = [{ x: 0, y: 0 }];

        SetXY(single, 7, 8);

        expect(single[0].x).toBe(7);
        expect(single[0].y).toBe(8);
    });

    it('should work with an empty array', function ()
    {
        var empty = [];
        var result = SetXY(empty, 10, 20);

        expect(result).toBe(empty);
    });

    it('should set x and y to zero', function ()
    {
        items[0].x = 50;
        items[0].y = 50;

        SetXY(items, 0, 0);

        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
    });

    it('should use x for y when y is undefined and apply stepY using x as base', function ()
    {
        SetXY(items, 10, undefined, 2, 3);

        expect(items[0].x).toBe(10);
        expect(items[0].y).toBe(10);
        expect(items[1].x).toBe(12);
        expect(items[1].y).toBe(13);
        expect(items[2].x).toBe(14);
        expect(items[2].y).toBe(16);
    });
});
