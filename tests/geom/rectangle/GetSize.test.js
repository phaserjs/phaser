var GetSize = require('../../../src/geom/rectangle/GetSize');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Rectangle.GetSize', function ()
{
    it('should return a Vector2 with width as x and height as y', function ()
    {
        var rect = { width: 100, height: 200 };
        var result = GetSize(rect);

        expect(result.x).toBe(100);
        expect(result.y).toBe(200);
    });

    it('should create a new Vector2 when no out parameter is provided', function ()
    {
        var rect = { width: 50, height: 75 };
        var result = GetSize(rect);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should use the provided out object', function ()
    {
        var rect = { width: 300, height: 400 };
        var out = new Vector2();
        var result = GetSize(rect, out);

        expect(result).toBe(out);
        expect(out.x).toBe(300);
        expect(out.y).toBe(400);
    });

    it('should return the out object by reference', function ()
    {
        var rect = { width: 10, height: 20 };
        var out = new Vector2(0, 0);
        var result = GetSize(rect, out);

        expect(result === out).toBe(true);
    });

    it('should handle zero width and height', function ()
    {
        var rect = { width: 0, height: 0 };
        var result = GetSize(rect);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle negative width and height', function ()
    {
        var rect = { width: -50, height: -100 };
        var result = GetSize(rect);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-100);
    });

    it('should handle floating point width and height', function ()
    {
        var rect = { width: 12.5, height: 7.3 };
        var result = GetSize(rect);

        expect(result.x).toBeCloseTo(12.5);
        expect(result.y).toBeCloseTo(7.3);
    });

    it('should handle very large values', function ()
    {
        var rect = { width: 1000000, height: 9999999 };
        var result = GetSize(rect);

        expect(result.x).toBe(1000000);
        expect(result.y).toBe(9999999);
    });

    it('should overwrite existing values in the out object', function ()
    {
        var rect = { width: 64, height: 128 };
        var out = new Vector2(999, 888);
        GetSize(rect, out);

        expect(out.x).toBe(64);
        expect(out.y).toBe(128);
    });

    it('should handle a plain object as out parameter', function ()
    {
        var rect = { width: 32, height: 16 };
        var out = { x: 0, y: 0 };
        var result = GetSize(rect, out);

        expect(result).toBe(out);
        expect(out.x).toBe(32);
        expect(out.y).toBe(16);
    });
});
