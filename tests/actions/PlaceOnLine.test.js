var PlaceOnLine = require('../../src/actions/PlaceOnLine');

describe('Phaser.Actions.PlaceOnLine', function ()
{
    function makeItems(count)
    {
        var items = [];
        for (var i = 0; i < count; i++)
        {
            items.push({ x: 0, y: 0 });
        }
        return items;
    }

    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    it('should return the items array', function ()
    {
        var items = makeItems(3);
        var line = makeLine(0, 0, 100, 0);
        var result = PlaceOnLine(items, line);
        expect(result).toBe(items);
    });

    it('should return an empty array when passed an empty items array', function ()
    {
        var items = [];
        var line = makeLine(0, 0, 100, 0);
        var result = PlaceOnLine(items, line);
        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should place a single item at the start of the line', function ()
    {
        var items = makeItems(1);
        var line = makeLine(10, 20, 100, 200);
        PlaceOnLine(items, line);
        expect(items[0].x).toBe(10);
        expect(items[0].y).toBe(20);
    });

    it('should place items evenly along a horizontal line', function ()
    {
        var items = makeItems(4);
        var line = makeLine(0, 0, 100, 0);
        PlaceOnLine(items, line);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBeCloseTo(25, 5);
        expect(items[1].y).toBe(0);
        expect(items[2].x).toBeCloseTo(50, 5);
        expect(items[2].y).toBe(0);
        expect(items[3].x).toBeCloseTo(75, 5);
        expect(items[3].y).toBe(0);
    });

    it('should place items evenly along a vertical line', function ()
    {
        var items = makeItems(4);
        var line = makeLine(0, 0, 0, 100);
        PlaceOnLine(items, line);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBe(0);
        expect(items[1].y).toBeCloseTo(25, 5);
        expect(items[2].x).toBe(0);
        expect(items[2].y).toBeCloseTo(50, 5);
        expect(items[3].x).toBe(0);
        expect(items[3].y).toBeCloseTo(75, 5);
    });

    it('should place items along a diagonal line', function ()
    {
        var items = makeItems(3);
        var line = makeLine(0, 0, 90, 90);
        PlaceOnLine(items, line);
        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[0].y).toBeCloseTo(0, 5);
        expect(items[1].x).toBeCloseTo(30, 5);
        expect(items[1].y).toBeCloseTo(30, 5);
        expect(items[2].x).toBeCloseTo(60, 5);
        expect(items[2].y).toBeCloseTo(60, 5);
    });

    it('should place items along a line with negative coordinates', function ()
    {
        var items = makeItems(3);
        var line = makeLine(-100, -100, -10, -10);
        PlaceOnLine(items, line);
        expect(items[0].x).toBeCloseTo(-100, 5);
        expect(items[0].y).toBeCloseTo(-100, 5);
        expect(items[1].x).toBeCloseTo(-70, 5);
        expect(items[1].y).toBeCloseTo(-70, 5);
        expect(items[2].x).toBeCloseTo(-40, 5);
        expect(items[2].y).toBeCloseTo(-40, 5);
    });

    it('should place items along a line using a linear ease function', function ()
    {
        var items = makeItems(3);
        var line = makeLine(0, 0, 100, 0);
        var linearEase = function (t) { return t; };
        PlaceOnLine(items, line, linearEase);
        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[1].x).toBeCloseTo(50, 5);
        expect(items[2].x).toBeCloseTo(100, 5);
    });

    it('should use eased distribution when ease is provided as a function', function ()
    {
        var items = makeItems(3);
        var line = makeLine(0, 0, 100, 0);
        var quadraticEase = function (t) { return t * t; };
        PlaceOnLine(items, line, quadraticEase);
        // t=0 => 0, t=0.5 => 0.25 => x=25, t=1 => 1 => x=100
        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[1].x).toBeCloseTo(25, 5);
        expect(items[2].x).toBeCloseTo(100, 5);
    });

    it('should use eased distribution when ease is a valid string key', function ()
    {
        var items = makeItems(3);
        var line = makeLine(0, 0, 100, 0);
        PlaceOnLine(items, line, 'Linear');
        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[1].x).toBeCloseTo(50, 5);
        expect(items[2].x).toBeCloseTo(100, 5);
    });

    it('should overwrite existing x and y values on items', function ()
    {
        var items = [{ x: 999, y: 999 }, { x: 888, y: 888 }];
        var line = makeLine(0, 0, 100, 0);
        PlaceOnLine(items, line);
        expect(items[0].x).toBe(0);
        expect(items[0].y).toBe(0);
        expect(items[1].x).toBeCloseTo(50, 5);
        expect(items[1].y).toBe(0);
    });

    it('should handle a zero-length line (both endpoints the same)', function ()
    {
        var items = makeItems(3);
        var line = makeLine(50, 50, 50, 50);
        PlaceOnLine(items, line);
        expect(items[0].x).toBe(50);
        expect(items[0].y).toBe(50);
        expect(items[1].x).toBe(50);
        expect(items[1].y).toBe(50);
        expect(items[2].x).toBe(50);
        expect(items[2].y).toBe(50);
    });

    it('should handle floating point line coordinates', function ()
    {
        var items = makeItems(2);
        var line = makeLine(0.5, 0.5, 1.5, 1.5);
        PlaceOnLine(items, line);
        expect(items[0].x).toBeCloseTo(0.5, 5);
        expect(items[0].y).toBeCloseTo(0.5, 5);
        expect(items[1].x).toBeCloseTo(1, 5);
        expect(items[1].y).toBeCloseTo(1, 5);
    });

    it('should not apply ease when ease parameter is undefined', function ()
    {
        var items = makeItems(4);
        var line = makeLine(0, 0, 300, 0);
        PlaceOnLine(items, line, undefined);
        // evenly spaced: 0, 75, 150, 225
        expect(items[0].x).toBeCloseTo(0, 5);
        expect(items[1].x).toBeCloseTo(75, 5);
        expect(items[2].x).toBeCloseTo(150, 5);
        expect(items[3].x).toBeCloseTo(225, 5);
    });

    it('should not apply ease when ease parameter is null', function ()
    {
        var items = makeItems(2);
        var line = makeLine(0, 0, 100, 0);
        PlaceOnLine(items, line, null);
        expect(items[0].x).toBe(0);
        expect(items[1].x).toBeCloseTo(50, 5);
    });
});
