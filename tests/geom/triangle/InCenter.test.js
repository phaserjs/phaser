var InCenter = require('../../../src/geom/triangle/InCenter');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Triangle.InCenter', function ()
{
    // Helper: plain triangle object
    function makeTriangle (x1, y1, x2, y2, x3, y3)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3 };
    }

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var triangle = makeTriangle(0, 0, 3, 0, 0, 4);
        var result = InCenter(triangle);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should use the provided out Vector2 object', function ()
    {
        var triangle = makeTriangle(0, 0, 3, 0, 0, 4);
        var out = new Vector2();
        var result = InCenter(triangle, out);

        expect(result).toBe(out);
    });

    it('should return the correct incenter for a 3-4-5 right triangle', function ()
    {
        // Right angle at origin, legs along axes
        // Incenter of 3-4-5 triangle is at (1, 1)
        var triangle = makeTriangle(0, 0, 3, 0, 0, 4);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(1, 10);
        expect(result.y).toBeCloseTo(1, 10);
    });

    it('should return the centroid for an equilateral triangle', function ()
    {
        // Equilateral triangle: (0,0), (2,0), (1, sqrt(3))
        // All sides equal, so incenter == centroid == (1, sqrt(3)/3)
        var h = Math.sqrt(3);
        var triangle = makeTriangle(0, 0, 2, 0, 1, h);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(1, 5);
        expect(result.y).toBeCloseTo(h / 3, 5);
    });

    it('should return the correct incenter for a right isosceles triangle', function ()
    {
        // (0,0), (4,0), (0,4) — right isosceles
        // Incenter x == y by symmetry
        // x = 2*(2 - sqrt(2)) ≈ 1.1716
        var triangle = makeTriangle(0, 0, 4, 0, 0, 4);
        var result = InCenter(triangle);
        var expected = 2 * (2 - Math.sqrt(2));

        expect(result.x).toBeCloseTo(expected, 5);
        expect(result.y).toBeCloseTo(expected, 5);
    });

    it('should return the correct incenter for a general scalene triangle', function ()
    {
        // Triangle (0,0), (6,0), (2,4)
        // d1 = dist((2,4),(6,0)) = sqrt(16+16) = sqrt(32)
        // d2 = dist((0,0),(2,4)) = sqrt(4+16)  = sqrt(20)
        // d3 = dist((6,0),(0,0)) = 6
        // p = sqrt(32)+sqrt(20)+6
        var x1 = 0, y1 = 0;
        var x2 = 6, y2 = 0;
        var x3 = 2, y3 = 4;
        var d1 = Math.sqrt((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2));
        var d2 = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3));
        var d3 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        var p = d1 + d2 + d3;
        var expectedX = (x1 * d1 + x2 * d2 + x3 * d3) / p;
        var expectedY = (y1 * d1 + y2 * d2 + y3 * d3) / p;

        var triangle = makeTriangle(x1, y1, x2, y2, x3, y3);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(expectedX, 5);
        expect(result.y).toBeCloseTo(expectedY, 5);
    });

    it('should write result into the provided out object coordinates', function ()
    {
        var triangle = makeTriangle(0, 0, 3, 0, 0, 4);
        var out = new Vector2(999, 999);
        InCenter(triangle, out);

        expect(out.x).toBeCloseTo(1, 5);
        expect(out.y).toBeCloseTo(1, 5);
    });

    it('should work with a translated triangle', function ()
    {
        // Shift the 3-4-5 triangle by (10, 10) — incenter shifts by same amount
        var triangle = makeTriangle(10, 10, 13, 10, 10, 14);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(11, 5);
        expect(result.y).toBeCloseTo(11, 5);
    });

    it('should work with negative coordinates', function ()
    {
        // Mirror 3-4-5 triangle into negative quadrant
        var triangle = makeTriangle(0, 0, -3, 0, 0, -4);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(-1, 5);
        expect(result.y).toBeCloseTo(-1, 5);
    });

    it('should work with floating point vertex coordinates', function ()
    {
        // Scale the 3-4-5 triangle by 0.5
        var triangle = makeTriangle(0, 0, 1.5, 0, 0, 2);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(0.5, 5);
        expect(result.y).toBeCloseTo(0.5, 5);
    });

    it('should return a point inside the triangle', function ()
    {
        // The incenter is always inside a valid triangle
        // Use a simple triangle and verify x,y are within bounding box
        var triangle = makeTriangle(0, 0, 10, 0, 5, 8);
        var result = InCenter(triangle);

        expect(result.x).toBeGreaterThan(0);
        expect(result.x).toBeLessThan(10);
        expect(result.y).toBeGreaterThan(0);
        expect(result.y).toBeLessThan(8);
    });

    it('should be symmetric: incenter of vertically symmetric triangle lies on axis of symmetry', function ()
    {
        // Triangle symmetric about x=5
        var triangle = makeTriangle(0, 0, 10, 0, 5, 6);
        var result = InCenter(triangle);

        expect(result.x).toBeCloseTo(5, 5);
    });
});
