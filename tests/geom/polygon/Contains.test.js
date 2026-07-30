var Contains = require('../../../src/geom/polygon/Contains');

describe('Phaser.Geom.Polygon.Contains', function ()
{
    function makePolygon (points)
    {
        return { points: points };
    }

    function pt (x, y)
    {
        return { x: x, y: y };
    }

    // Simple square: (0,0) -> (10,0) -> (10,10) -> (0,10)
    var square;

    beforeEach(function ()
    {
        square = makePolygon([
            pt(0, 0),
            pt(10, 0),
            pt(10, 10),
            pt(0, 10)
        ]);
    });

    it('should return true for a point clearly inside a square polygon', function ()
    {
        expect(Contains(square, 5, 5)).toBe(true);
    });

    it('should return false for a point clearly outside a square polygon', function ()
    {
        expect(Contains(square, 20, 20)).toBe(false);
    });

    it('should return false for a point to the left of the polygon', function ()
    {
        expect(Contains(square, -5, 5)).toBe(false);
    });

    it('should return false for a point to the right of the polygon', function ()
    {
        expect(Contains(square, 15, 5)).toBe(false);
    });

    it('should return false for a point above the polygon', function ()
    {
        expect(Contains(square, 5, -5)).toBe(false);
    });

    it('should return false for a point below the polygon', function ()
    {
        expect(Contains(square, 5, 15)).toBe(false);
    });

    it('should return true for a point near the center of a square', function ()
    {
        expect(Contains(square, 1, 1)).toBe(true);
        expect(Contains(square, 9, 9)).toBe(true);
        expect(Contains(square, 1, 9)).toBe(true);
        expect(Contains(square, 9, 1)).toBe(true);
    });

    it('should return false for a point at the origin when polygon does not include origin', function ()
    {
        var poly = makePolygon([
            pt(5, 5),
            pt(15, 5),
            pt(15, 15),
            pt(5, 15)
        ]);

        expect(Contains(poly, 0, 0)).toBe(false);
    });

    it('should return true for a point inside a triangle', function ()
    {
        var triangle = makePolygon([
            pt(0, 0),
            pt(10, 0),
            pt(5, 10)
        ]);

        expect(Contains(triangle, 5, 3)).toBe(true);
    });

    it('should return false for a point outside a triangle', function ()
    {
        var triangle = makePolygon([
            pt(0, 0),
            pt(10, 0),
            pt(5, 10)
        ]);

        expect(Contains(triangle, 0, 9)).toBe(false);
        expect(Contains(triangle, 10, 9)).toBe(false);
        expect(Contains(triangle, 5, -1)).toBe(false);
    });

    it('should return false for an empty polygon', function ()
    {
        var empty = makePolygon([]);

        expect(Contains(empty, 5, 5)).toBe(false);
    });

    it('should return false for a polygon with a single point', function ()
    {
        var single = makePolygon([ pt(5, 5) ]);

        expect(Contains(single, 5, 5)).toBe(false);
    });

    it('should return false for a polygon with two points', function ()
    {
        var line = makePolygon([ pt(0, 0), pt(10, 10) ]);

        expect(Contains(line, 5, 5)).toBe(false);
    });

    it('should work with negative coordinate polygons', function ()
    {
        var negPoly = makePolygon([
            pt(-10, -10),
            pt(0, -10),
            pt(0, 0),
            pt(-10, 0)
        ]);

        expect(Contains(negPoly, -5, -5)).toBe(true);
        expect(Contains(negPoly, 5, 5)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        var floatPoly = makePolygon([
            pt(0.0, 0.0),
            pt(1.0, 0.0),
            pt(1.0, 1.0),
            pt(0.0, 1.0)
        ]);

        expect(Contains(floatPoly, 0.5, 0.5)).toBe(true);
        expect(Contains(floatPoly, 1.5, 0.5)).toBe(false);
    });

    it('should work with a concave (L-shaped) polygon', function ()
    {
        var lShape = makePolygon([
            pt(0, 0),
            pt(4, 0),
            pt(4, 2),
            pt(2, 2),
            pt(2, 4),
            pt(0, 4)
        ]);

        // Inside the bottom portion
        expect(Contains(lShape, 1, 1)).toBe(true);

        // Inside the left vertical bar
        expect(Contains(lShape, 1, 3)).toBe(true);

        // Outside in the cut-out region
        expect(Contains(lShape, 3, 3)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var result = Contains(square, 5, 5);

        expect(typeof result).toBe('boolean');
    });

    it('should handle a large polygon with many points', function ()
    {
        var points = [];
        var sides = 64;
        var radius = 100;

        for (var i = 0; i < sides; i++)
        {
            var angle = (i / sides) * Math.PI * 2;
            points.push(pt(Math.cos(angle) * radius, Math.sin(angle) * radius));
        }

        var circle = makePolygon(points);

        expect(Contains(circle, 0, 0)).toBe(true);
        expect(Contains(circle, 50, 0)).toBe(true);
        expect(Contains(circle, 200, 0)).toBe(false);
    });
});
