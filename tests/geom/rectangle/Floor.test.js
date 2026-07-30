var Floor = require('../../../src/geom/rectangle/Floor');

describe('Phaser.Geom.Rectangle.Floor', function ()
{
    it('should floor positive floating point x and y coordinates', function ()
    {
        var rect = { x: 1.7, y: 2.9, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(1);
        expect(rect.y).toBe(2);
    });

    it('should floor negative floating point x and y coordinates', function ()
    {
        var rect = { x: -1.2, y: -3.8, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(-2);
        expect(rect.y).toBe(-4);
    });

    it('should not change integer x and y coordinates', function ()
    {
        var rect = { x: 5, y: 10, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(5);
        expect(rect.y).toBe(10);
    });

    it('should not modify width or height', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 50.9, height: 75.3 };
        Floor(rect);
        expect(rect.width).toBe(50.9);
        expect(rect.height).toBe(75.3);
    });

    it('should return the same rectangle object', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 100, height: 100 };
        var result = Floor(rect);
        expect(result).toBe(rect);
    });

    it('should handle zero coordinates', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
    });

    it('should handle x and y values that are exactly 0.5', function ()
    {
        var rect = { x: 0.5, y: 0.5, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
    });

    it('should handle large floating point values', function ()
    {
        var rect = { x: 9999.99, y: 12345.67, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(9999);
        expect(rect.y).toBe(12345);
    });

    it('should handle negative zero', function ()
    {
        var rect = { x: -0.0, y: -0.0, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x === 0).toBe(true);
        expect(rect.y === 0).toBe(true);
    });

    it('should floor x and y independently', function ()
    {
        var rect = { x: 3.0, y: 7.9, width: 100, height: 100 };
        Floor(rect);
        expect(rect.x).toBe(3);
        expect(rect.y).toBe(7);
    });
});
