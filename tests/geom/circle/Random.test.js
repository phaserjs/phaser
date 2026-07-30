var Random = require('../../../src/geom/circle/Random');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Circle.Random', function ()
{
    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var result = Random(circle);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var out = new Vector2();
        var result = Random(circle, out);

        expect(result).toBe(out);
    });

    it('should set x and y properties on the out object', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var out = new Vector2();
        Random(circle, out);

        expect(typeof out.x).toBe('number');
        expect(typeof out.y).toBe('number');
    });

    it('should return a point within the circle bounds for a unit circle at origin', function ()
    {
        var circle = { x: 0, y: 0, radius: 1 };

        for (var i = 0; i < 200; i++)
        {
            var out = Random(circle);
            var dist = Math.sqrt(out.x * out.x + out.y * out.y);

            expect(dist).toBeLessThanOrEqual(1 + 1e-10);
        }
    });

    it('should return a point within the circle bounds for a larger radius', function ()
    {
        var circle = { x: 0, y: 0, radius: 50 };

        for (var i = 0; i < 200; i++)
        {
            var out = Random(circle);
            var dist = Math.sqrt(out.x * out.x + out.y * out.y);

            expect(dist).toBeLessThanOrEqual(50 + 1e-10);
        }
    });

    it('should offset the point by the circle center', function ()
    {
        var circle = { x: 100, y: 200, radius: 10 };

        for (var i = 0; i < 100; i++)
        {
            var out = Random(circle);
            var dx = out.x - 100;
            var dy = out.y - 200;
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeLessThanOrEqual(10 + 1e-10);
        }
    });

    it('should return the circle center when radius is zero', function ()
    {
        var circle = { x: 5, y: 7, radius: 0 };

        for (var i = 0; i < 20; i++)
        {
            var out = Random(circle);

            expect(out.x).toBeCloseTo(5);
            expect(out.y).toBeCloseTo(7);
        }
    });

    it('should work with negative circle center coordinates', function ()
    {
        var circle = { x: -50, y: -100, radius: 20 };

        for (var i = 0; i < 100; i++)
        {
            var out = Random(circle);
            var dx = out.x - (-50);
            var dy = out.y - (-100);
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeLessThanOrEqual(20 + 1e-10);
        }
    });

    it('should accept a plain object as the out parameter', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var out = { x: 0, y: 0 };
        var result = Random(circle, out);

        expect(result).toBe(out);
        expect(typeof out.x).toBe('number');
        expect(typeof out.y).toBe('number');
    });

    it('should produce both positive and negative x values over many iterations', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var hasPositiveX = false;
        var hasNegativeX = false;

        for (var i = 0; i < 200; i++)
        {
            var out = Random(circle);

            if (out.x > 0) { hasPositiveX = true; }
            if (out.x < 0) { hasNegativeX = true; }

            if (hasPositiveX && hasNegativeX) { break; }
        }

        expect(hasPositiveX).toBe(true);
        expect(hasNegativeX).toBe(true);
    });

    it('should produce both positive and negative y values over many iterations', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var hasPositiveY = false;
        var hasNegativeY = false;

        for (var i = 0; i < 200; i++)
        {
            var out = Random(circle);

            if (out.y > 0) { hasPositiveY = true; }
            if (out.y < 0) { hasNegativeY = true; }

            if (hasPositiveY && hasNegativeY) { break; }
        }

        expect(hasPositiveY).toBe(true);
        expect(hasNegativeY).toBe(true);
    });

    it('should produce points distributed within the full radius, not just on the edge', function ()
    {
        var circle = { x: 0, y: 0, radius: 10 };
        var hasInnerPoint = false;

        for (var i = 0; i < 500; i++)
        {
            var out = Random(circle);
            var dist = Math.sqrt(out.x * out.x + out.y * out.y);

            if (dist < 5)
            {
                hasInnerPoint = true;
                break;
            }
        }

        expect(hasInnerPoint).toBe(true);
    });

    it('should work with floating point radius', function ()
    {
        var circle = { x: 0, y: 0, radius: 3.14159 };

        for (var i = 0; i < 100; i++)
        {
            var out = Random(circle);
            var dist = Math.sqrt(out.x * out.x + out.y * out.y);

            expect(dist).toBeLessThanOrEqual(3.14159 + 1e-10);
        }
    });
});
