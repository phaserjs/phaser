var GetLineToPoints = require('../../../src/geom/intersects/GetLineToPoints');
var Line = require('../../../src/geom/line/Line');
var Vector3 = require('../../../src/math/Vector3');

describe('Phaser.Geom.Intersects.GetLineToPoints', function ()
{
    it('should return null when line does not intersect any segment', function ()
    {
        var line = new Line(0, 0, 1, 0);
        var points = [
            { x: 10, y: 10 },
            { x: 20, y: 10 },
            { x: 20, y: 20 },
            { x: 10, y: 20 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).toBeNull();
    });

    it('should return a Vector3 when intersection is found', function ()
    {
        var line = new Line(0, 5, 20, 5);
        var points = [
            { x: 5, y: 0 },
            { x: 15, y: 0 },
            { x: 15, y: 10 },
            { x: 5, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(Vector3);
    });

    it('should find the intersection point x and y correctly', function ()
    {
        // Horizontal line at y=5 crossing a vertical segment from (10,0) to (10,10)
        var line = new Line(0, 5, 20, 5);
        var points = [
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(10, 5);
        expect(result.y).toBeCloseTo(5, 5);
    });

    it('should return the closest intersection when multiple segments intersect', function ()
    {
        // Line going right at y=5, crossing two vertical segments
        var line = new Line(0, 5, 30, 5);
        var points = [
            { x: 5, y: 0 },
            { x: 5, y: 10 },
            { x: 25, y: 0 },
            { x: 25, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
        // Closest intersection should be near x=5
        expect(result.x).toBeCloseTo(5, 5);
        expect(result.y).toBeCloseTo(5, 5);
    });

    it('should store result in provided out vector when given', function ()
    {
        var line = new Line(0, 5, 20, 5);
        var points = [
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ];
        var out = new Vector3();

        var result = GetLineToPoints(line, points, false, out);

        expect(result).toBe(out);
        expect(out.x).toBeCloseTo(10, 5);
        expect(out.y).toBeCloseTo(5, 5);
    });

    it('should treat points as a closed shape (last point connects back to first)', function ()
    {
        // Triangle with vertices at (0,0), (10,0), (5,10)
        // A vertical line at x=5 should intersect the closing segment from (5,10) to (0,0)
        var line = new Line(5, -1, 5, 11);
        var points = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
    });

    it('should default isRay to false when not provided', function ()
    {
        // Segment that would intersect if extended as a ray but not as a line segment
        var line = new Line(0, 5, 4, 5);
        var points = [
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).toBeNull();
    });

    it('should find intersection when isRay is true and segment is beyond line end', function ()
    {
        // Ray starting at (0,5) going right, segment at x=10 which is beyond the line segment end
        var line = new Line(0, 5, 4, 5);
        var points = [
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ];

        var result = GetLineToPoints(line, points, true);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(10, 5);
        expect(result.y).toBeCloseTo(5, 5);
    });

    it('should return null for a two-point closed shape with no intersection', function ()
    {
        var line = new Line(0, 0, 5, 0);
        var points = [
            { x: 10, y: 10 },
            { x: 20, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).toBeNull();
    });

    it('should store closest distance in z component of result', function ()
    {
        var line = new Line(0, 5, 20, 5);
        var points = [
            { x: 10, y: 0 },
            { x: 10, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
        expect(typeof result.z).toBe('number');
        expect(result.z).toBeGreaterThanOrEqual(0);
    });

    it('should handle a single-point array (closed to itself)', function ()
    {
        var line = new Line(0, 0, 10, 0);
        var points = [
            { x: 5, y: 5 }
        ];

        // Single point forms a degenerate segment from itself to itself — no real intersection
        var result = GetLineToPoints(line, points);

        expect(result).toBeNull();
    });

    it('should pick the intersection with smaller z (distance) when two intersections exist', function ()
    {
        // Line going right at y=5, with two parallel vertical segments
        var line = new Line(0, 5, 50, 5);
        var points = [
            { x: 20, y: 0 },
            { x: 20, y: 10 },
            { x: 40, y: 0 },
            { x: 40, y: 10 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
        // Should be the closer one at x=20
        expect(result.x).toBeCloseTo(20, 5);
    });

    it('should work with floating point point coordinates', function ()
    {
        var line = new Line(0, 2.5, 10, 2.5);
        var points = [
            { x: 4.5, y: 0 },
            { x: 4.5, y: 5 }
        ];

        var result = GetLineToPoints(line, points);

        expect(result).not.toBeNull();
        expect(result.x).toBeCloseTo(4.5, 5);
        expect(result.y).toBeCloseTo(2.5, 5);
    });
});
