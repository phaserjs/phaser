var GetAspectRatio = require('../../../src/geom/rectangle/GetAspectRatio');

describe('Phaser.Geom.Rectangle.GetAspectRatio', function ()
{
    it('should return the correct ratio for a square', function ()
    {
        var rect = { width: 100, height: 100 };

        expect(GetAspectRatio(rect)).toBe(1);
    });

    it('should return the correct ratio for a landscape rectangle', function ()
    {
        var rect = { width: 200, height: 100 };

        expect(GetAspectRatio(rect)).toBe(2);
    });

    it('should return the correct ratio for a portrait rectangle', function ()
    {
        var rect = { width: 100, height: 200 };

        expect(GetAspectRatio(rect)).toBe(0.5);
    });

    it('should return NaN when height is zero', function ()
    {
        var rect = { width: 100, height: 0 };

        expect(GetAspectRatio(rect)).toBeNaN();
    });

    it('should return NaN when both width and height are zero', function ()
    {
        var rect = { width: 0, height: 0 };

        expect(GetAspectRatio(rect)).toBeNaN();
    });

    it('should return zero when width is zero and height is non-zero', function ()
    {
        var rect = { width: 0, height: 100 };

        expect(GetAspectRatio(rect)).toBe(0);
    });

    it('should return the correct ratio for floating point dimensions', function ()
    {
        var rect = { width: 16, height: 9 };

        expect(GetAspectRatio(rect)).toBeCloseTo(1.7778, 4);
    });

    it('should handle negative width', function ()
    {
        var rect = { width: -100, height: 100 };

        expect(GetAspectRatio(rect)).toBe(-1);
    });

    it('should handle negative height', function ()
    {
        var rect = { width: 100, height: -100 };

        expect(GetAspectRatio(rect)).toBe(-1);
    });

    it('should handle both negative width and height', function ()
    {
        var rect = { width: -200, height: -100 };

        expect(GetAspectRatio(rect)).toBe(2);
    });

    it('should return the correct ratio for a 4:3 rectangle', function ()
    {
        var rect = { width: 400, height: 300 };

        expect(GetAspectRatio(rect)).toBeCloseTo(1.3333, 4);
    });

    it('should return the correct ratio for a 16:9 rectangle', function ()
    {
        var rect = { width: 1920, height: 1080 };

        expect(GetAspectRatio(rect)).toBeCloseTo(1.7778, 4);
    });

    it('should handle very small floating point dimensions', function ()
    {
        var rect = { width: 0.1, height: 0.2 };

        expect(GetAspectRatio(rect)).toBeCloseTo(0.5, 5);
    });

    it('should handle very large dimensions', function ()
    {
        var rect = { width: 1000000, height: 500000 };

        expect(GetAspectRatio(rect)).toBe(2);
    });
});
