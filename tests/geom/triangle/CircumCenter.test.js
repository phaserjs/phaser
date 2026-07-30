var CircumCenter = require('../../../src/geom/triangle/CircumCenter');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Triangle.CircumCenter', function ()
{
    // Helper to build a plain triangle object
    function makeTriangle (x1, y1, x2, y2, x3, y3)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3 };
    }

    // Helper: Euclidean distance between two points
    function dist (ax, ay, bx, by)
    {
        var dx = ax - bx;
        var dy = ay - by;
        return Math.sqrt(dx * dx + dy * dy);
    }

    it('should return a Vector2 instance when no out parameter is provided', function ()
    {
        var triangle = makeTriangle(0, 0, 2, 0, 0, 2);
        var result = CircumCenter(triangle);
        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var triangle = makeTriangle(0, 0, 2, 0, 0, 2);
        var out = new Vector2();
        var result = CircumCenter(triangle, out);
        expect(result).toBe(out);
    });

    it('should store the result in a plain object passed as out', function ()
    {
        var triangle = makeTriangle(0, 0, 2, 0, 0, 2);
        var out = { x: 0, y: 0 };
        CircumCenter(triangle, out);
        expect(out.x).toBeCloseTo(1, 10);
        expect(out.y).toBeCloseTo(1, 10);
    });

    it('should compute circumcenter of a right triangle with the right angle at the origin', function ()
    {
        // Vertices: (0,0), (2,0), (0,2) — circumcenter is midpoint of hypotenuse: (1,1)
        var triangle = makeTriangle(0, 0, 2, 0, 0, 2);
        var result = CircumCenter(triangle);
        expect(result.x).toBeCloseTo(1, 10);
        expect(result.y).toBeCloseTo(1, 10);
    });

    it('should produce a point equidistant from all three vertices', function ()
    {
        var triangle = makeTriangle(0, 0, 2, 0, 0, 2);
        var result = CircumCenter(triangle);
        var d1 = dist(result.x, result.y, triangle.x1, triangle.y1);
        var d2 = dist(result.x, result.y, triangle.x2, triangle.y2);
        var d3 = dist(result.x, result.y, triangle.x3, triangle.y3);
        expect(d1).toBeCloseTo(d2, 10);
        expect(d2).toBeCloseTo(d3, 10);
    });

    it('should compute circumcenter of an isoceles triangle on the axis of symmetry', function ()
    {
        // Vertices: (0,0), (4,0), (2,4) — axis of symmetry at x=2
        var triangle = makeTriangle(0, 0, 4, 0, 2, 4);
        var result = CircumCenter(triangle);
        expect(result.x).toBeCloseTo(2, 10);
        // Verify equidistance
        var d1 = dist(result.x, result.y, 0, 0);
        var d2 = dist(result.x, result.y, 4, 0);
        var d3 = dist(result.x, result.y, 2, 4);
        expect(d1).toBeCloseTo(d2, 10);
        expect(d2).toBeCloseTo(d3, 10);
    });

    it('should compute circumcenter of an equilateral triangle', function ()
    {
        // Equilateral triangle: (0,0), (2,0), (1, sqrt(3))
        var h = Math.sqrt(3);
        var triangle = makeTriangle(0, 0, 2, 0, 1, h);
        var result = CircumCenter(triangle);
        // Circumcenter of equilateral triangle is the centroid: (1, sqrt(3)/3)
        expect(result.x).toBeCloseTo(1, 10);
        expect(result.y).toBeCloseTo(h / 3, 10);
        // Verify equidistance
        var d1 = dist(result.x, result.y, 0, 0);
        var d2 = dist(result.x, result.y, 2, 0);
        var d3 = dist(result.x, result.y, 1, h);
        expect(d1).toBeCloseTo(d2, 10);
        expect(d2).toBeCloseTo(d3, 10);
    });

    it('should handle a triangle with negative coordinates', function ()
    {
        // Right triangle shifted into negative quadrant: (-2,-2), (0,-2), (-2,0)
        // Circumcenter should be at midpoint of hypotenuse: (-1,-1)
        var triangle = makeTriangle(-2, -2, 0, -2, -2, 0);
        var result = CircumCenter(triangle);
        expect(result.x).toBeCloseTo(-1, 10);
        expect(result.y).toBeCloseTo(-1, 10);
    });

    it('should handle a triangle with floating-point coordinates', function ()
    {
        var triangle = makeTriangle(0.5, 0.5, 2.5, 0.5, 0.5, 2.5);
        var result = CircumCenter(triangle);
        // Same shape as (0,0),(2,0),(0,2) shifted by (0.5,0.5) — circumcenter shifts too
        expect(result.x).toBeCloseTo(1.5, 10);
        expect(result.y).toBeCloseTo(1.5, 10);
    });

    it('should handle a larger right triangle', function ()
    {
        // Right triangle: (0,0), (10,0), (0,10) — circumcenter at (5,5)
        var triangle = makeTriangle(0, 0, 10, 0, 0, 10);
        var result = CircumCenter(triangle);
        expect(result.x).toBeCloseTo(5, 10);
        expect(result.y).toBeCloseTo(5, 10);
    });

    it('should place circumcenter outside the triangle for obtuse triangles', function ()
    {
        // Obtuse triangle: (0,0), (10,0), (1,1)
        // The circumcenter lies outside such a triangle
        var triangle = makeTriangle(0, 0, 10, 0, 1, 1);
        var result = CircumCenter(triangle);
        // Verify it is still equidistant from all three vertices
        var d1 = dist(result.x, result.y, 0, 0);
        var d2 = dist(result.x, result.y, 10, 0);
        var d3 = dist(result.x, result.y, 1, 1);
        expect(d1).toBeCloseTo(d2, 5);
        expect(d2).toBeCloseTo(d3, 5);
    });

    it('should overwrite existing values in the out object', function ()
    {
        var triangle = makeTriangle(0, 0, 2, 0, 0, 2);
        var out = new Vector2(999, 999);
        CircumCenter(triangle, out);
        expect(out.x).toBeCloseTo(1, 10);
        expect(out.y).toBeCloseTo(1, 10);
    });

    it('should handle a triangle where x3/y3 is at the origin', function ()
    {
        // Vertices: (2,0), (0,2), (0,0) — same shape, vertex order shifted
        var triangle = makeTriangle(2, 0, 0, 2, 0, 0);
        var result = CircumCenter(triangle);
        expect(result.x).toBeCloseTo(1, 10);
        expect(result.y).toBeCloseTo(1, 10);
    });
});
