var GetCenter = require('../../../src/geom/rectangle/GetCenter');

describe('Phaser.Geom.Rectangle.GetCenter', function ()
{
    it('should return a new Vector2 when no out parameter is provided', function ()
    {
        var rect = { centerX: 50, centerY: 50 };
        var result = GetCenter(rect);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should return the center of a rectangle', function ()
    {
        var rect = { centerX: 100, centerY: 75 };
        var result = GetCenter(rect);

        expect(result.x).toBe(100);
        expect(result.y).toBe(75);
    });

    it('should update the provided out object', function ()
    {
        var rect = { centerX: 40, centerY: 60 };
        var out = { x: 0, y: 0 };
        var result = GetCenter(rect, out);

        expect(result).toBe(out);
        expect(out.x).toBe(40);
        expect(out.y).toBe(60);
    });

    it('should return the same out object that was passed in', function ()
    {
        var rect = { centerX: 10, centerY: 20 };
        var out = { x: 0, y: 0 };
        var result = GetCenter(rect, out);

        expect(result).toBe(out);
    });

    it('should handle a rectangle at the origin', function ()
    {
        var rect = { centerX: 0, centerY: 0 };
        var result = GetCenter(rect);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle negative center coordinates', function ()
    {
        var rect = { centerX: -50, centerY: -30 };
        var result = GetCenter(rect);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-30);
    });

    it('should handle floating point center coordinates', function ()
    {
        var rect = { centerX: 10.5, centerY: 20.5 };
        var result = GetCenter(rect);

        expect(result.x).toBeCloseTo(10.5);
        expect(result.y).toBeCloseTo(20.5);
    });

    it('should handle large coordinate values', function ()
    {
        var rect = { centerX: 999999, centerY: 888888 };
        var result = GetCenter(rect);

        expect(result.x).toBe(999999);
        expect(result.y).toBe(888888);
    });

    it('should overwrite existing values in the out object', function ()
    {
        var rect = { centerX: 5, centerY: 10 };
        var out = { x: 100, y: 200 };
        GetCenter(rect, out);

        expect(out.x).toBe(5);
        expect(out.y).toBe(10);
    });
});
