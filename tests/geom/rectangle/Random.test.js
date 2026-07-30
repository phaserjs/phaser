var Random = require('../../../src/geom/rectangle/Random');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Rectangle.Random', function ()
{
    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };
        var result = Random(rect);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var rect = { x: 0, y: 0, width: 100, height: 100 };
        var out = new Vector2();
        var result = Random(rect, out);

        expect(result).toBe(out);
    });

    it('should return a point within the rectangle bounds', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };

        for (var i = 0; i < 100; i++)
        {
            var result = Random(rect);

            expect(result.x).toBeGreaterThanOrEqual(rect.x);
            expect(result.x).toBeLessThan(rect.x + rect.width);
            expect(result.y).toBeGreaterThanOrEqual(rect.y);
            expect(result.y).toBeLessThan(rect.y + rect.height);
        }
    });

    it('should work with a zero-origin rectangle', function ()
    {
        var rect = { x: 0, y: 0, width: 200, height: 200 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(rect);

            expect(result.x).toBeGreaterThanOrEqual(0);
            expect(result.x).toBeLessThan(200);
            expect(result.y).toBeGreaterThanOrEqual(0);
            expect(result.y).toBeLessThan(200);
        }
    });

    it('should work with negative origin rectangle', function ()
    {
        var rect = { x: -50, y: -50, width: 100, height: 100 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(rect);

            expect(result.x).toBeGreaterThanOrEqual(-50);
            expect(result.x).toBeLessThan(50);
            expect(result.y).toBeGreaterThanOrEqual(-50);
            expect(result.y).toBeLessThan(50);
        }
    });

    it('should return the origin point for a zero-size rectangle', function ()
    {
        var rect = { x: 5, y: 10, width: 0, height: 0 };
        var result = Random(rect);

        expect(result.x).toBe(5);
        expect(result.y).toBe(10);
    });

    it('should update the provided out object coordinates', function ()
    {
        var rect = { x: 100, y: 200, width: 50, height: 75 };
        var out = { x: 0, y: 0 };
        Random(rect, out);

        expect(out.x).toBeGreaterThanOrEqual(100);
        expect(out.x).toBeLessThan(150);
        expect(out.y).toBeGreaterThanOrEqual(200);
        expect(out.y).toBeLessThan(275);
    });

    it('should work with floating point rectangle dimensions', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };

        for (var i = 0; i < 50; i++)
        {
            var result = Random(rect);

            expect(result.x).toBeGreaterThanOrEqual(1.5);
            expect(result.x).toBeLessThan(1.5 + 10.25);
            expect(result.y).toBeGreaterThanOrEqual(2.5);
            expect(result.y).toBeLessThan(2.5 + 5.75);
        }
    });

    it('should produce varied output across multiple calls', function ()
    {
        var rect = { x: 0, y: 0, width: 10000, height: 10000 };
        var results = [];

        for (var i = 0; i < 10; i++)
        {
            results.push(Random(rect));
        }

        var allSameX = results.every(function (r) { return r.x === results[0].x; });
        var allSameY = results.every(function (r) { return r.y === results[0].y; });

        expect(allSameX).toBe(false);
        expect(allSameY).toBe(false);
    });
});
