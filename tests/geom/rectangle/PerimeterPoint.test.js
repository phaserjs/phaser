var PerimeterPoint = require('../../../src/geom/rectangle/PerimeterPoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Rectangle.PerimeterPoint', function ()
{
    var rect;

    beforeEach(function ()
    {
        // 200x100 rectangle at (0,0): centerX=100, centerY=50
        rect = { x: 0, y: 0, width: 200, height: 100, centerX: 100, centerY: 50 };
    });

    it('should return a Vector2 when no out parameter is given', function ()
    {
        var result = PerimeterPoint(rect, 0);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should use the provided out object', function ()
    {
        var out = new Vector2();
        var result = PerimeterPoint(rect, 0, out);

        expect(result).toBe(out);
    });

    it('should return the right-center point at 0 degrees', function ()
    {
        var result = PerimeterPoint(rect, 0);

        expect(result.x).toBeCloseTo(200, 5);
        expect(result.y).toBeCloseTo(50, 5);
    });

    it('should return the bottom-center point at 90 degrees', function ()
    {
        var result = PerimeterPoint(rect, 90);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(100, 5);
    });

    it('should return the left-center point at 180 degrees', function ()
    {
        var result = PerimeterPoint(rect, 180);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(50, 5);
    });

    it('should return the top-center point at 270 degrees', function ()
    {
        var result = PerimeterPoint(rect, 270);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return the top-center point at -90 degrees', function ()
    {
        var result = PerimeterPoint(rect, -90);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return the right-center point at 360 degrees', function ()
    {
        var result = PerimeterPoint(rect, 360);

        expect(result.x).toBeCloseTo(200, 5);
        expect(result.y).toBeCloseTo(50, 5);
    });

    it('should return the bottom-right corner for a square at 45 degrees', function ()
    {
        var square = { width: 100, height: 100, centerX: 50, centerY: 50 };
        var result = PerimeterPoint(square, 45);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(100, 5);
    });

    it('should return the bottom-left corner for a square at 135 degrees', function ()
    {
        var square = { width: 100, height: 100, centerX: 50, centerY: 50 };
        var result = PerimeterPoint(square, 135);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(100, 5);
    });

    it('should return the top-left corner for a square at 225 degrees', function ()
    {
        var square = { width: 100, height: 100, centerX: 50, centerY: 50 };
        var result = PerimeterPoint(square, 225);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return the top-right corner for a square at 315 degrees', function ()
    {
        var square = { width: 100, height: 100, centerX: 50, centerY: 50 };
        var result = PerimeterPoint(square, 315);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should clamp to the horizontal edge for shallow angles on a wide rectangle', function ()
    {
        // Wide rectangle: width=400, height=100, so half-width=200, half-height=50
        // At 10 degrees the ray hits the right edge before the top/bottom edge
        var wide = { width: 400, height: 100, centerX: 200, centerY: 50 };
        var result = PerimeterPoint(wide, 10);

        expect(result.x).toBeCloseTo(400, 5);
        expect(result.y).toBeCloseTo(50 + Math.tan(10 * Math.PI / 180) * 200, 5);
    });

    it('should clamp to the vertical edge for steep angles on a wide rectangle', function ()
    {
        // At 80 degrees the ray hits the bottom edge before the left/right edge
        var wide = { width: 400, height: 100, centerX: 200, centerY: 50 };
        var result = PerimeterPoint(wide, 80);

        expect(result.y).toBeCloseTo(100, 5);
    });

    it('should work with a rectangle offset from the origin', function ()
    {
        var offset = { width: 200, height: 100, centerX: 300, centerY: 200 };
        var result = PerimeterPoint(offset, 0);

        expect(result.x).toBeCloseTo(400, 5);
        expect(result.y).toBeCloseTo(200, 5);
    });

    it('should work with a rectangle offset from the origin at 90 degrees', function ()
    {
        var offset = { width: 200, height: 100, centerX: 300, centerY: 200 };
        var result = PerimeterPoint(offset, 90);

        expect(result.x).toBeCloseTo(300, 5);
        expect(result.y).toBeCloseTo(250, 5);
    });

    it('should populate the out object x and y properties', function ()
    {
        var out = { x: 0, y: 0 };
        PerimeterPoint(rect, 0, out);

        expect(out.x).toBeCloseTo(200, 5);
        expect(out.y).toBeCloseTo(50, 5);
    });

    it('should return a point on the right edge for small positive angles', function ()
    {
        var result = PerimeterPoint(rect, 26.565);

        // tan(26.565°) ≈ 0.5, so dy/dx = 0.5, dx = 100 (half-width), dy = 50 (half-height) — hits corner
        expect(result.x).toBeCloseTo(200, 0);
    });

    it('should return a point on the bottom edge for large positive angles below 90', function ()
    {
        var result = PerimeterPoint(rect, 63.435);

        // tan(63.435°) ≈ 2, dy/dx = 2, half-height=50, half-width=100; ray hits bottom edge
        expect(result.y).toBeCloseTo(100, 0);
    });

    it('should handle floating point angle values', function ()
    {
        var result = PerimeterPoint(rect, 45.5);

        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
        expect(isNaN(result.x)).toBe(false);
        expect(isNaN(result.y)).toBe(false);
    });

    it('should return symmetric points for opposite angles', function ()
    {
        var r1 = PerimeterPoint(rect, 45);
        var r2 = PerimeterPoint(rect, 225);

        // Opposite angles should produce points mirrored through the center
        expect(r1.x + r2.x).toBeCloseTo(rect.centerX * 2, 5);
        expect(r1.y + r2.y).toBeCloseTo(rect.centerY * 2, 5);
    });

    it('should return symmetric points for 0 and 180 degrees', function ()
    {
        var r1 = PerimeterPoint(rect, 0);
        var r2 = PerimeterPoint(rect, 180);

        expect(r1.x + r2.x).toBeCloseTo(rect.centerX * 2, 5);
        expect(r1.y + r2.y).toBeCloseTo(rect.centerY * 2, 5);
    });

    it('should return symmetric points for 90 and 270 degrees', function ()
    {
        var r1 = PerimeterPoint(rect, 90);
        var r2 = PerimeterPoint(rect, 270);

        expect(r1.x + r2.x).toBeCloseTo(rect.centerX * 2, 5);
        expect(r1.y + r2.y).toBeCloseTo(rect.centerY * 2, 5);
    });
});
