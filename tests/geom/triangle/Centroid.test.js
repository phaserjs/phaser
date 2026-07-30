var Centroid = require('../../../src/geom/triangle/Centroid');

describe('Phaser.Geom.Triangle.Centroid', function ()
{
    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 6, y2: 0, x3: 3, y3: 6 };
        var result = Centroid(triangle);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should calculate the centroid of a simple triangle', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 6, y2: 0, x3: 3, y3: 6 };
        var result = Centroid(triangle);

        expect(result.x).toBe(3);
        expect(result.y).toBe(2);
    });

    it('should calculate the centroid of an equilateral triangle', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 6, y2: 0, x3: 3, y3: 3 };
        var result = Centroid(triangle);

        expect(result.x).toBe(3);
        expect(result.y).toBe(1);
    });

    it('should write result to the provided out object', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 9, y2: 0, x3: 0, y3: 9 };
        var out = { x: 0, y: 0 };
        var result = Centroid(triangle, out);

        expect(result).toBe(out);
        expect(out.x).toBe(3);
        expect(out.y).toBe(3);
    });

    it('should return the out object itself', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 3, y2: 0, x3: 0, y3: 3 };
        var out = { x: 0, y: 0 };
        var result = Centroid(triangle, out);

        expect(result).toBe(out);
    });

    it('should handle negative coordinates', function ()
    {
        var triangle = { x1: -3, y1: -3, x2: 3, y2: -3, x3: 0, y3: 3 };
        var result = Centroid(triangle);

        expect(result.x).toBe(0);
        expect(result.y).toBeCloseTo(-1, 5);
    });

    it('should handle a degenerate triangle where all points are the same', function ()
    {
        var triangle = { x1: 5, y1: 5, x2: 5, y2: 5, x3: 5, y3: 5 };
        var result = Centroid(triangle);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
    });

    it('should handle a degenerate triangle where all points are collinear', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 3, y2: 3, x3: 6, y3: 6 };
        var result = Centroid(triangle);

        expect(result.x).toBe(3);
        expect(result.y).toBe(3);
    });

    it('should handle floating point coordinates', function ()
    {
        var triangle = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 0.5, x3: 1.0, y3: 1.5 };
        var result = Centroid(triangle);

        expect(result.x).toBeCloseTo(1.0, 5);
        expect(result.y).toBeCloseTo(0.8333, 3);
    });

    it('should handle a triangle at the origin', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
        var result = Centroid(triangle);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle large coordinate values', function ()
    {
        var triangle = { x1: 1000, y1: 2000, x2: 3000, y2: 4000, x3: 5000, y3: 6000 };
        var result = Centroid(triangle);

        expect(result.x).toBe(3000);
        expect(result.y).toBe(4000);
    });

    it('should overwrite existing values in the out object', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 3, y2: 0, x3: 0, y3: 3 };
        var out = { x: 999, y: 888 };
        Centroid(triangle, out);

        expect(out.x).toBe(1);
        expect(out.y).toBe(1);
    });
});
