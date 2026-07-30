var GetLineToCircle = require('../../../src/geom/intersects/GetLineToCircle');

describe('Phaser.Geom.Intersects.GetLineToCircle', function ()
{
    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    function makeCircle(x, y, radius)
    {
        return {
            x: x,
            y: y,
            radius: radius,
            left: x - radius,
            right: x + radius,
            top: y - radius,
            bottom: y + radius
        };
    }

    it('should return an empty array when line does not intersect circle', function ()
    {
        var line = makeLine(0, 10, 10, 10);
        var circle = makeCircle(50, 50, 5);
        var result = GetLineToCircle(line, circle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array by default when out is not provided and no intersection', function ()
    {
        var line = makeLine(100, 100, 200, 200);
        var circle = makeCircle(0, 0, 1);
        var result = GetLineToCircle(line, circle);

        expect(result).toEqual([]);
    });

    it('should use provided out array', function ()
    {
        var line = makeLine(100, 100, 200, 200);
        var circle = makeCircle(0, 0, 1);
        var out = [];
        var result = GetLineToCircle(line, circle, out);

        expect(result).toBe(out);
    });

    it('should return two intersection points when line passes through circle', function ()
    {
        // Horizontal line passing through a circle centered at origin
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);
    });

    it('should return correct intersection points for horizontal line through circle', function ()
    {
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);

        // Sort by x to make assertion order deterministic
        result.sort(function (a, b) { return a.x - b.x; });

        expect(result[0].x).toBeCloseTo(-5, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
        expect(result[1].x).toBeCloseTo(5, 5);
        expect(result[1].y).toBeCloseTo(0, 5);
    });

    it('should return one intersection point when line is tangent to circle', function ()
    {
        // Line tangent to circle: line y=5 with circle centered at (0,0) radius 5
        var line = makeLine(-10, 5, 10, 5);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(5, 5);
    });

    it('should return Vector2 objects with x and y properties', function ()
    {
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);
        expect(typeof result[0].x).toBe('number');
        expect(typeof result[0].y).toBe('number');
    });

    it('should populate the provided out array with intersection points', function ()
    {
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var out = [];
        GetLineToCircle(line, circle, out);

        expect(out.length).toBe(2);
    });

    it('should return empty array when line segment ends before reaching circle', function ()
    {
        // Line segment from (-10,0) to (-6,0), circle at (0,0) radius 5 — segment ends just outside
        var line = makeLine(-10, 0, -6, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(0);
    });

    it('should return one point when line segment starts outside and ends inside circle', function ()
    {
        // Line from (-10,0) to (0,0): enters circle at (-5,0), ends inside
        var line = makeLine(-10, 0, 0, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(-5, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
    });

    it('should return one point when line segment starts inside and exits circle', function ()
    {
        // Line from (0,0) to (10,0): exits circle at (5,0)
        var line = makeLine(0, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(5, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
    });

    it('should return empty array when line segment is entirely inside circle', function ()
    {
        var line = makeLine(-1, 0, 1, 0);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(0);
    });

    it('should handle vertical line intersecting circle', function ()
    {
        var line = makeLine(0, -10, 0, 10);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);

        result.sort(function (a, b) { return a.y - b.y; });

        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(-5, 5);
        expect(result[1].x).toBeCloseTo(0, 5);
        expect(result[1].y).toBeCloseTo(5, 5);
    });

    it('should handle diagonal line intersecting circle', function ()
    {
        var line = makeLine(-10, -10, 10, 10);
        var circle = makeCircle(0, 0, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);

        result.forEach(function (pt)
        {
            var dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
            expect(dist).toBeCloseTo(5, 4);
        });
    });

    it('should handle circle not at origin', function ()
    {
        var line = makeLine(90, 100, 110, 100);
        var circle = makeCircle(100, 100, 5);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);

        result.sort(function (a, b) { return a.x - b.x; });

        expect(result[0].x).toBeCloseTo(95, 5);
        expect(result[0].y).toBeCloseTo(100, 5);
        expect(result[1].x).toBeCloseTo(105, 5);
        expect(result[1].y).toBeCloseTo(100, 5);
    });

    it('should append to existing out array contents', function ()
    {
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var existing = [{ x: 99, y: 99 }];
        GetLineToCircle(line, circle, existing);

        expect(existing.length).toBe(3);
        expect(existing[0].x).toBe(99);
    });

    it('should return the out array as its return value', function ()
    {
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 5);
        var out = [];
        var result = GetLineToCircle(line, circle, out);

        expect(result).toBe(out);
    });

    it('should handle a circle with a very small radius', function ()
    {
        var line = makeLine(-10, 0, 10, 0);
        var circle = makeCircle(0, 0, 0.001);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);

        result.sort(function (a, b) { return a.x - b.x; });

        expect(result[0].x).toBeCloseTo(-0.001, 3);
        expect(result[1].x).toBeCloseTo(0.001, 3);
    });

    it('should handle a circle with a large radius', function ()
    {
        var line = makeLine(-1000, 0, 1000, 0);
        var circle = makeCircle(0, 0, 500);
        var result = GetLineToCircle(line, circle);

        expect(result.length).toBe(2);

        result.sort(function (a, b) { return a.x - b.x; });

        expect(result[0].x).toBeCloseTo(-500, 3);
        expect(result[1].x).toBeCloseTo(500, 3);
    });
});
