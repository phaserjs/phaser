var Random = require('../../../src/geom/ellipse/Random');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Ellipse.Random', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 100 };
    });

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var result = Random(ellipse);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var out = new Vector2();
        var result = Random(ellipse, out);

        expect(result).toBe(out);
    });

    it('should set x and y properties on a plain object passed as out', function ()
    {
        var out = { x: 0, y: 0 };
        var result = Random(ellipse, out);

        expect(result).toBe(out);
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should return a point within the bounds of a unit ellipse centered at origin', function ()
    {
        var e = { x: 0, y: 0, width: 2, height: 2 };

        for (var i = 0; i < 500; i++)
        {
            var out = Random(e);
            var nx = out.x / (e.width / 2);
            var ny = out.y / (e.height / 2);

            expect(nx * nx + ny * ny).toBeLessThanOrEqual(1 + 1e-10);
        }
    });

    it('should return points within an ellipse centered at origin with given width and height', function ()
    {
        var e = { x: 0, y: 0, width: 200, height: 100 };

        for (var i = 0; i < 500; i++)
        {
            var out = Random(e);
            var nx = out.x / (e.width / 2);
            var ny = out.y / (e.height / 2);

            expect(nx * nx + ny * ny).toBeLessThanOrEqual(1 + 1e-10);
        }
    });

    it('should return points offset by the ellipse x and y position', function ()
    {
        var e = { x: 500, y: 300, width: 100, height: 100 };

        for (var i = 0; i < 200; i++)
        {
            var out = Random(e);

            expect(out.x).toBeGreaterThanOrEqual(e.x - e.width / 2 - 1e-10);
            expect(out.x).toBeLessThanOrEqual(e.x + e.width / 2 + 1e-10);
            expect(out.y).toBeGreaterThanOrEqual(e.y - e.height / 2 - 1e-10);
            expect(out.y).toBeLessThanOrEqual(e.y + e.height / 2 + 1e-10);
        }
    });

    it('should return only the center point when width and height are zero', function ()
    {
        var e = { x: 42, y: 99, width: 0, height: 0 };

        for (var i = 0; i < 50; i++)
        {
            var out = Random(e);

            expect(out.x).toBeCloseTo(42);
            expect(out.y).toBeCloseTo(99);
        }
    });

    it('should return points distributed across both positive and negative offsets over many iterations', function ()
    {
        var e = { x: 0, y: 0, width: 200, height: 200 };
        var hasPositiveX = false;
        var hasNegativeX = false;
        var hasPositiveY = false;
        var hasNegativeY = false;

        for (var i = 0; i < 500; i++)
        {
            var out = Random(e);

            if (out.x > 0) { hasPositiveX = true; }
            if (out.x < 0) { hasNegativeX = true; }
            if (out.y > 0) { hasPositiveY = true; }
            if (out.y < 0) { hasNegativeY = true; }
        }

        expect(hasPositiveX).toBe(true);
        expect(hasNegativeX).toBe(true);
        expect(hasPositiveY).toBe(true);
        expect(hasNegativeY).toBe(true);
    });

    it('should handle negative ellipse position correctly', function ()
    {
        var e = { x: -100, y: -200, width: 50, height: 80 };

        for (var i = 0; i < 200; i++)
        {
            var out = Random(e);
            var nx = (out.x - e.x) / (e.width / 2);
            var ny = (out.y - e.y) / (e.height / 2);

            expect(nx * nx + ny * ny).toBeLessThanOrEqual(1 + 1e-10);
        }
    });

    it('should not produce points outside a narrow ellipse', function ()
    {
        var e = { x: 0, y: 0, width: 400, height: 10 };

        for (var i = 0; i < 300; i++)
        {
            var out = Random(e);
            var nx = out.x / (e.width / 2);
            var ny = out.y / (e.height / 2);

            expect(nx * nx + ny * ny).toBeLessThanOrEqual(1 + 1e-10);
        }
    });
});
