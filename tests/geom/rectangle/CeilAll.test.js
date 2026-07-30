var CeilAll = require('../../../src/geom/rectangle/CeilAll');

describe('Phaser.Geom.Rectangle.CeilAll', function ()
{
    it('should return the same rectangle object', function ()
    {
        var rect = { x: 1, y: 1, width: 1, height: 1 };
        var result = CeilAll(rect);

        expect(result).toBe(rect);
    });

    it('should not modify integer values', function ()
    {
        var rect = { x: 1, y: 2, width: 3, height: 4 };
        CeilAll(rect);

        expect(rect.x).toBe(1);
        expect(rect.y).toBe(2);
        expect(rect.width).toBe(3);
        expect(rect.height).toBe(4);
    });

    it('should ceil positive floating point values', function ()
    {
        var rect = { x: 1.1, y: 2.2, width: 3.3, height: 4.4 };
        CeilAll(rect);

        expect(rect.x).toBe(2);
        expect(rect.y).toBe(3);
        expect(rect.width).toBe(4);
        expect(rect.height).toBe(5);
    });

    it('should ceil negative floating point values toward zero', function ()
    {
        var rect = { x: -1.1, y: -2.2, width: -3.3, height: -4.4 };
        CeilAll(rect);

        expect(rect.x).toBe(-1);
        expect(rect.y).toBe(-2);
        expect(rect.width).toBe(-3);
        expect(rect.height).toBe(-4);
    });

    it('should handle zero values', function ()
    {
        var rect = { x: 0, y: 0, width: 0, height: 0 };
        CeilAll(rect);

        expect(rect.x).toBe(0);
        expect(rect.y).toBe(0);
        expect(rect.width).toBe(0);
        expect(rect.height).toBe(0);
    });

    it('should handle values that are already exact integers as floats', function ()
    {
        var rect = { x: 1.0, y: 2.0, width: 3.0, height: 4.0 };
        CeilAll(rect);

        expect(rect.x).toBe(1);
        expect(rect.y).toBe(2);
        expect(rect.width).toBe(3);
        expect(rect.height).toBe(4);
    });

    it('should handle very small fractional values', function ()
    {
        var rect = { x: 0.0001, y: 0.0001, width: 0.0001, height: 0.0001 };
        CeilAll(rect);

        expect(rect.x).toBe(1);
        expect(rect.y).toBe(1);
        expect(rect.width).toBe(1);
        expect(rect.height).toBe(1);
    });

    it('should handle large values', function ()
    {
        var rect = { x: 1000.5, y: 2000.7, width: 3000.1, height: 4000.9 };
        CeilAll(rect);

        expect(rect.x).toBe(1001);
        expect(rect.y).toBe(2001);
        expect(rect.width).toBe(3001);
        expect(rect.height).toBe(4001);
    });

    it('should handle mixed positive and negative values', function ()
    {
        var rect = { x: -1.5, y: 2.5, width: -3.5, height: 4.5 };
        CeilAll(rect);

        expect(rect.x).toBe(-1);
        expect(rect.y).toBe(3);
        expect(rect.width).toBe(-3);
        expect(rect.height).toBe(5);
    });
});
