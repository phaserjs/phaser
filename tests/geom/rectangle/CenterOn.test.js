var CenterOn = require('../../../src/geom/rectangle/CenterOn');

describe('Phaser.Geom.Rectangle.CenterOn', function ()
{
    it('should center a rectangle at the given coordinates', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };

        CenterOn(rect, 50, 50);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
    });

    it('should return the rectangle', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };

        var result = CenterOn(rect, 50, 50);

        expect(result).toBe(rect);
    });

    it('should set x to x minus half the width', function ()
    {
        var rect = { x: 0, y: 0, width: 200, height: 100 };

        CenterOn(rect, 300, 200);

        expect(rect.x).toBe(200);
    });

    it('should set y to y minus half the height', function ()
    {
        var rect = { x: 0, y: 0, width: 200, height: 100 };

        CenterOn(rect, 300, 200);

        expect(rect.y).toBe(150);
    });

    it('should center at the origin (0, 0)', function ()
    {
        var rect = { x: 10, y: 10, width: 100, height: 80 };

        CenterOn(rect, 0, 0);

        expect(rect.x).toBe(-50);
        expect(rect.y).toBe(-40);
    });

    it('should work with negative center coordinates', function ()
    {
        var rect = { x: 0, y: 0, width: 60, height: 40 };

        CenterOn(rect, -30, -20);

        expect(rect.x).toBe(-60);
        expect(rect.y).toBe(-40);
    });

    it('should work with a zero-size rectangle', function ()
    {
        var rect = { x: 5, y: 5, width: 0, height: 0 };

        CenterOn(rect, 10, 20);

        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
    });

    it('should work with floating point center coordinates', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };

        CenterOn(rect, 10.5, 20.5);

        expect(rect.x).toBeCloseTo(-39.5);
        expect(rect.y).toBeCloseTo(-29.5);
    });

    it('should work with odd-sized dimensions producing fractional positions', function ()
    {
        var rect = { x: 0, y: 0, width: 101, height: 99 };

        CenterOn(rect, 100, 100);

        expect(rect.x).toBeCloseTo(49.5);
        expect(rect.y).toBeCloseTo(50.5);
    });

    it('should update x and y regardless of existing position', function ()
    {
        var rect = { x: 999, y: -999, width: 50, height: 50 };

        CenterOn(rect, 0, 0);

        expect(rect.x).toBe(-25);
        expect(rect.y).toBe(-25);
    });

    it('should not modify the width or height of the rectangle', function ()
    {
        var rect = { x: 0, y: 0, width: 120, height: 80 };

        CenterOn(rect, 100, 100);

        expect(rect.width).toBe(120);
        expect(rect.height).toBe(80);
    });
});
