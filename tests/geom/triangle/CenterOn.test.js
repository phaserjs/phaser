var CenterOn = require('../../../src/geom/triangle/CenterOn');

describe('Phaser.Geom.Triangle.CenterOn', function ()
{
    function makeTriangle (x1, y1, x2, y2, x3, y3)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3 };
    }

    it('should return the triangle', function ()
    {
        var triangle = makeTriangle(0, 0, 6, 0, 3, 6);
        var result = CenterOn(triangle, 0, 0);

        expect(result).toBe(triangle);
    });

    it('should center a triangle at the origin using centroid', function ()
    {
        // centroid of (0,0), (6,0), (3,6) = (3, 2)
        var triangle = makeTriangle(0, 0, 6, 0, 3, 6);
        CenterOn(triangle, 3, 2);

        // No movement needed — centroid is already at (3,2)
        expect(triangle.x1).toBeCloseTo(0);
        expect(triangle.y1).toBeCloseTo(0);
        expect(triangle.x2).toBeCloseTo(6);
        expect(triangle.y2).toBeCloseTo(0);
        expect(triangle.x3).toBeCloseTo(3);
        expect(triangle.y3).toBeCloseTo(6);
    });

    it('should translate all vertices when centering at a new position', function ()
    {
        // centroid of (0,0), (6,0), (3,6) = (3, 2)
        // centering at (10, 10) => offset (+7, +8)
        var triangle = makeTriangle(0, 0, 6, 0, 3, 6);
        CenterOn(triangle, 10, 10);

        expect(triangle.x1).toBeCloseTo(7);
        expect(triangle.y1).toBeCloseTo(8);
        expect(triangle.x2).toBeCloseTo(13);
        expect(triangle.y2).toBeCloseTo(8);
        expect(triangle.x3).toBeCloseTo(10);
        expect(triangle.y3).toBeCloseTo(14);
    });

    it('should center on (0, 0)', function ()
    {
        // centroid of (0,0), (6,0), (3,6) = (3, 2)
        // centering at (0,0) => offset (-3, -2)
        var triangle = makeTriangle(0, 0, 6, 0, 3, 6);
        CenterOn(triangle, 0, 0);

        expect(triangle.x1).toBeCloseTo(-3);
        expect(triangle.y1).toBeCloseTo(-2);
        expect(triangle.x2).toBeCloseTo(3);
        expect(triangle.y2).toBeCloseTo(-2);
        expect(triangle.x3).toBeCloseTo(0);
        expect(triangle.y3).toBeCloseTo(4);
    });

    it('should work with negative target coordinates', function ()
    {
        // centroid of (3,3), (9,3), (6,9) = (6, 5)
        // centering at (-4, -2) => offset (-10, -7)
        var triangle = makeTriangle(3, 3, 9, 3, 6, 9);
        CenterOn(triangle, -4, -2);

        expect(triangle.x1).toBeCloseTo(-7);
        expect(triangle.y1).toBeCloseTo(-4);
        expect(triangle.x2).toBeCloseTo(-1);
        expect(triangle.y2).toBeCloseTo(-4);
        expect(triangle.x3).toBeCloseTo(-4);
        expect(triangle.y3).toBeCloseTo(2);
    });

    it('should work with floating point target coordinates', function ()
    {
        // centroid of (0,0), (3,0), (1.5,3) = (1.5, 1)
        var triangle = makeTriangle(0, 0, 3, 0, 1.5, 3);
        CenterOn(triangle, 1.5, 1);

        expect(triangle.x1).toBeCloseTo(0);
        expect(triangle.y1).toBeCloseTo(0);
        expect(triangle.x2).toBeCloseTo(3);
        expect(triangle.y2).toBeCloseTo(0);
        expect(triangle.x3).toBeCloseTo(1.5);
        expect(triangle.y3).toBeCloseTo(3);
    });

    it('should preserve the shape (relative distances) of the triangle', function ()
    {
        var triangle = makeTriangle(0, 0, 10, 0, 5, 10);
        var origW = triangle.x2 - triangle.x1;
        var origH = triangle.y3 - triangle.y1;

        CenterOn(triangle, 50, 50);

        expect(triangle.x2 - triangle.x1).toBeCloseTo(origW);
        expect(triangle.y3 - triangle.y1).toBeCloseTo(origH);
    });

    it('should accept a custom center function', function ()
    {
        // Custom center function always returns (0, 0)
        var customCenter = function (tri)
        {
            return { x: 0, y: 0 };
        };

        // centering at (5, 5) from (0,0) => offset (+5, +5)
        var triangle = makeTriangle(1, 1, 4, 1, 2, 4);
        CenterOn(triangle, 5, 5, customCenter);

        expect(triangle.x1).toBeCloseTo(6);
        expect(triangle.y1).toBeCloseTo(6);
        expect(triangle.x2).toBeCloseTo(9);
        expect(triangle.y2).toBeCloseTo(6);
        expect(triangle.x3).toBeCloseTo(7);
        expect(triangle.y3).toBeCloseTo(9);
    });

    it('should use the custom center function instead of centroid', function ()
    {
        // Custom center returns the first vertex
        var customCenter = function (tri)
        {
            return { x: tri.x1, y: tri.y1 };
        };

        var triangle = makeTriangle(2, 4, 8, 4, 5, 10);
        CenterOn(triangle, 0, 0, customCenter);

        // offset = (0 - 2, 0 - 4) = (-2, -4)
        expect(triangle.x1).toBeCloseTo(0);
        expect(triangle.y1).toBeCloseTo(0);
        expect(triangle.x2).toBeCloseTo(6);
        expect(triangle.y2).toBeCloseTo(0);
        expect(triangle.x3).toBeCloseTo(3);
        expect(triangle.y3).toBeCloseTo(6);
    });

    it('should handle a degenerate (zero-area) triangle', function ()
    {
        // All points on a line: centroid = (2, 2)
        var triangle = makeTriangle(0, 0, 2, 2, 4, 4);
        CenterOn(triangle, 2, 2);

        expect(triangle.x1).toBeCloseTo(0);
        expect(triangle.y1).toBeCloseTo(0);
        expect(triangle.x2).toBeCloseTo(2);
        expect(triangle.y2).toBeCloseTo(2);
        expect(triangle.x3).toBeCloseTo(4);
        expect(triangle.y3).toBeCloseTo(4);
    });

    it('should handle large coordinate values', function ()
    {
        var triangle = makeTriangle(1000, 1000, 2000, 1000, 1500, 2000);
        // centroid = (1500, 1333.33...)
        CenterOn(triangle, 0, 0);

        var newCentroidX = (triangle.x1 + triangle.x2 + triangle.x3) / 3;
        var newCentroidY = (triangle.y1 + triangle.y2 + triangle.y3) / 3;

        expect(newCentroidX).toBeCloseTo(0);
        expect(newCentroidY).toBeCloseTo(0);
    });
});
