var Ceil = require('../../../src/geom/rectangle/Ceil');

describe('Phaser.Geom.Rectangle.Ceil', function ()
{
    it('should return the same rectangle object', function ()
    {
        var rect = { x: 1, y: 1, width: 100, height: 100 };

        expect(Ceil(rect)).toBe(rect);
    });

    it('should ceil positive floating point x and y values', function ()
    {
        var rect = { x: 1.2, y: 3.7, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(2);
        expect(rect.y).toBe(4);
    });

    it('should leave integer x and y values unchanged', function ()
    {
        var rect = { x: 5, y: 10, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(5);
        expect(rect.y).toBe(10);
    });

    it('should ceil negative floating point x and y values', function ()
    {
        var rect = { x: -1.7, y: -3.2, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(-1);
        expect(rect.y).toBe(-3);
    });

    it('should handle zero values', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
    });

    it('should handle values that are already exact integers', function ()
    {
        var rect = { x: -5, y: -10, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(-5);
        expect(rect.y).toBe(-10);
    });

    it('should not modify width or height', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 50.9, height: 75.1 };

        Ceil(rect);

        expect(rect.width).toBe(50.9);
        expect(rect.height).toBe(75.1);
    });

    it('should handle very small fractional values', function ()
    {
        var rect = { x: 0.0001, y: 0.0001, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(1);
        expect(rect.y).toBe(1);
    });

    it('should handle large floating point values', function ()
    {
        var rect = { x: 9999.9, y: 12345.1, width: 100, height: 100 };

        Ceil(rect);

        expect(rect.x).toBe(10000);
        expect(rect.y).toBe(12346);
    });
});
