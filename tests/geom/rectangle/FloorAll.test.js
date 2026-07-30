var FloorAll = require('../../../src/geom/rectangle/FloorAll');

describe('Phaser.Geom.Rectangle.FloorAll', function ()
{
    it('should return the same rectangle object', function ()
    {
        var rect = { x: 1, y: 1, width: 1, height: 1 };
        var result = FloorAll(rect);
        expect(result).toBe(rect);
    });

    it('should floor positive floating point values', function ()
    {
        var rect = { x: 1.7, y: 2.9, width: 3.1, height: 4.5 };
        FloorAll(rect);
        expect(rect.x).toBe(1);
        expect(rect.y).toBe(2);
        expect(rect.width).toBe(3);
        expect(rect.height).toBe(4);
    });

    it('should leave integer values unchanged', function ()
    {
        var rect = { x: 10, y: 20, width: 30, height: 40 };
        FloorAll(rect);
        expect(rect.x).toBe(10);
        expect(rect.y).toBe(20);
        expect(rect.width).toBe(30);
        expect(rect.height).toBe(40);
    });

    it('should floor negative floating point values', function ()
    {
        var rect = { x: -1.2, y: -2.8, width: -3.1, height: -4.9 };
        FloorAll(rect);
        expect(rect.x).toBe(-2);
        expect(rect.y).toBe(-3);
        expect(rect.width).toBe(-4);
        expect(rect.height).toBe(-5);
    });

    it('should handle zero values', function ()
    {
        var rect = { x: 0, y: 0, width: 0, height: 0 };
        FloorAll(rect);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(0);
        expect(rect.height).toBe(0);
    });

    it('should handle values that are already at floor', function ()
    {
        var rect = { x: 5.0, y: 10.0, width: 15.0, height: 20.0 };
        FloorAll(rect);
        expect(rect.x).toBe(5);
        expect(rect.y).toBe(10);
        expect(rect.width).toBe(15);
        expect(rect.height).toBe(20);
    });

    it('should handle very small fractional values just above an integer', function ()
    {
        var rect = { x: 3.0001, y: 7.0001, width: 11.0001, height: 99.0001 };
        FloorAll(rect);
        expect(rect.x).toBe(3);
        expect(rect.y).toBe(7);
        expect(rect.width).toBe(11);
        expect(rect.height).toBe(99);
    });

    it('should handle very small fractional values just below an integer', function ()
    {
        var rect = { x: 2.9999, y: 6.9999, width: 10.9999, height: 98.9999 };
        FloorAll(rect);
        expect(rect.x).toBe(2);
        expect(rect.y).toBe(6);
        expect(rect.width).toBe(10);
        expect(rect.height).toBe(98);
    });

    it('should handle large values', function ()
    {
        var rect = { x: 10000.7, y: 20000.3, width: 30000.9, height: 40000.1 };
        FloorAll(rect);
        expect(rect.x).toBe(10000);
        expect(rect.y).toBe(20000);
        expect(rect.width).toBe(30000);
        expect(rect.height).toBe(40000);
    });

    it('should mutate the rectangle in place', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 3.5, height: 4.5 };
        FloorAll(rect);
        expect(rect.x).toBe(1);
        expect(rect.y).toBe(2);
        expect(rect.width).toBe(3);
        expect(rect.height).toBe(4);
    });
});
