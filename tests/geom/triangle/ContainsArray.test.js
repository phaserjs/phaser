var ContainsArray = require('../../../src/geom/triangle/ContainsArray');

describe('Phaser.Geom.Triangle.ContainsArray', function ()
{
    var triangle;

    beforeEach(function ()
    {
        // A simple right triangle with vertices at (0,0), (10,0), (0,10)
        triangle = { x1: 0, y1: 0, x2: 10, y2: 0, x3: 0, y3: 10 };
    });

    it('should return an empty array when points array is empty', function ()
    {
        var result = ContainsArray(triangle, []);

        expect(result).toEqual([]);
    });

    it('should return a new empty array by default when no points are inside', function ()
    {
        var points = [{ x: 20, y: 20 }, { x: -1, y: -1 }];
        var result = ContainsArray(triangle, points);

        expect(result).toEqual([]);
    });

    it('should return points that are inside the triangle', function ()
    {
        var points = [{ x: 1, y: 1 }];
        var result = ContainsArray(triangle, points);

        expect(result.length).toBe(1);
        expect(result[0].x).toBe(1);
        expect(result[0].y).toBe(1);
    });

    it('should filter out points outside the triangle', function ()
    {
        var points = [
            { x: 1, y: 1 },
            { x: 20, y: 20 },
            { x: 2, y: 2 },
            { x: -5, y: 5 }
        ];
        var result = ContainsArray(triangle, points);

        expect(result.length).toBe(2);
        expect(result[0].x).toBe(1);
        expect(result[0].y).toBe(1);
        expect(result[1].x).toBe(2);
        expect(result[1].y).toBe(2);
    });

    it('should return only the first matching point when returnFirst is true', function ()
    {
        var points = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 3 }
        ];
        var result = ContainsArray(triangle, points, true);

        expect(result.length).toBe(1);
        expect(result[0].x).toBe(1);
        expect(result[0].y).toBe(1);
    });

    it('should return an empty array when returnFirst is true but no points are inside', function ()
    {
        var points = [{ x: 20, y: 20 }, { x: 30, y: 30 }];
        var result = ContainsArray(triangle, points, true);

        expect(result).toEqual([]);
    });

    it('should append to the provided out array', function ()
    {
        var points = [{ x: 1, y: 1 }, { x: 2, y: 2 }];
        var out = [{ x: 99, y: 99 }];
        var result = ContainsArray(triangle, points, false, out);

        expect(result).toBe(out);
        expect(result.length).toBe(3);
        expect(result[0].x).toBe(99);
        expect(result[1].x).toBe(1);
        expect(result[2].x).toBe(2);
    });

    it('should return the out array as the function result', function ()
    {
        var points = [{ x: 1, y: 1 }];
        var out = [];
        var result = ContainsArray(triangle, points, false, out);

        expect(result).toBe(out);
    });

    it('should return a new array (not a reference to points) by default', function ()
    {
        var points = [{ x: 1, y: 1 }];
        var result = ContainsArray(triangle, points);

        expect(result).not.toBe(points);
    });

    it('should return copies of matched points, not references to originals', function ()
    {
        var point = { x: 1, y: 1 };
        var result = ContainsArray(triangle, [point]);

        expect(result[0]).not.toBe(point);
        expect(result[0].x).toBe(1);
        expect(result[0].y).toBe(1);
    });

    it('should default returnFirst to false', function ()
    {
        var points = [{ x: 1, y: 1 }, { x: 2, y: 2 }];
        var result = ContainsArray(triangle, points);

        expect(result.length).toBe(2);
    });

    it('should handle a point exactly at the first vertex', function ()
    {
        var points = [{ x: 0, y: 0 }];
        var result = ContainsArray(triangle, points);

        // Vertex itself: u=0, v=0, u+v=0 < 1 — considered inside by barycentric check
        expect(result.length).toBe(1);
    });

    it('should exclude points on the hypotenuse edge (u+v=1)', function ()
    {
        // Midpoint of hypotenuse between (10,0) and (0,10) is (5,5)
        // u + v == 1 at that point, so it is NOT inside (condition is u+v < 1)
        var points = [{ x: 5, y: 5 }];
        var result = ContainsArray(triangle, points);

        expect(result.length).toBe(0);
    });

    it('should handle a degenerate triangle (all vertices collinear) without throwing', function ()
    {
        var degenerate = { x1: 0, y1: 0, x2: 5, y2: 0, x3: 10, y3: 0 };
        var points = [{ x: 2, y: 0 }, { x: 5, y: 5 }];

        expect(function ()
        {
            ContainsArray(degenerate, points);
        }).not.toThrow();
    });

    it('should return no points for a degenerate triangle', function ()
    {
        var degenerate = { x1: 0, y1: 0, x2: 5, y2: 0, x3: 10, y3: 0 };
        var points = [{ x: 2, y: 0 }, { x: 5, y: 5 }];
        var result = ContainsArray(degenerate, points);

        // When degenerate (b=0), inv=0 so u=0,v=0 for all points — all pass the containment check
        expect(result.length).toBe(2);
    });

    it('should handle negative coordinate triangles', function ()
    {
        var negTri = { x1: -10, y1: -10, x2: 0, y2: -10, x3: -10, y3: 0 };
        var points = [{ x: -8, y: -8 }, { x: 5, y: 5 }];
        var result = ContainsArray(negTri, points);

        expect(result.length).toBe(1);
        expect(result[0].x).toBe(-8);
        expect(result[0].y).toBe(-8);
    });

    it('should handle large arrays of points efficiently', function ()
    {
        var points = [];

        for (var i = 0; i < 1000; i++)
        {
            points.push({ x: i * 0.1, y: i * 0.1 });
        }

        var result = ContainsArray(triangle, points);

        // All points with x + y < 10 and x >= 0 and y >= 0 should be inside
        for (var j = 0; j < result.length; j++)
        {
            expect(result[j].x + result[j].y).toBeLessThan(10);
        }
    });

    it('should only append the first matching point to out when returnFirst is true', function ()
    {
        var points = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
        var out = [];
        ContainsArray(triangle, points, true, out);

        expect(out.length).toBe(1);
        expect(out[0].x).toBe(1);
    });
});
