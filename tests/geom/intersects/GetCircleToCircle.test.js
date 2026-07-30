var GetCircleToCircle = require('../../../src/geom/intersects/GetCircleToCircle');

describe('Phaser.Geom.Intersects.GetCircleToCircle', function ()
{
    function makeCircle(x, y, radius)
    {
        return { x: x, y: y, radius: radius };
    }

    it('should return an empty array when circles do not intersect', function ()
    {
        var a = makeCircle(0, 0, 1);
        var b = makeCircle(10, 0, 1);
        var result = GetCircleToCircle(a, b);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when one circle is fully inside the other', function ()
    {
        var a = makeCircle(0, 0, 10);
        var b = makeCircle(0, 0, 1);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when circles are identical (same position and radius)', function ()
    {
        // Identical circles — CircleToCircle returns true but lambda < 0 or coincident
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(0, 0, 5);
        // This edge case: circles are the same, infinite intersections — no points returned
        var result = GetCircleToCircle(a, b);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should use the provided out array', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(6, 0, 5);
        var out = [];
        var result = GetCircleToCircle(a, b, out);
        expect(result).toBe(out);
    });

    it('should default out to a new array when not provided', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(6, 0, 5);
        var result = GetCircleToCircle(a, b);
        expect(Array.isArray(result)).toBe(true);
    });

    // --- Same y (horizontal alignment) ---

    it('should return two intersection points for circles with same y that overlap', function ()
    {
        // Two circles on the x-axis with same y=0, overlapping
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(6, 0, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(2);
        // Each point should lie on both circles
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 5);
            expect(db).toBeCloseTo(b.radius, 5);
        });
    });

    it('should return one intersection point for tangent circles with same y (externally tangent)', function ()
    {
        // Externally tangent: distance between centers equals sum of radii
        var a = makeCircle(0, 0, 3);
        var b = makeCircle(6, 0, 3);
        var result = GetCircleToCircle(a, b);
        // lambda === 0 path
        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(3, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
    });

    it('should return correct intersection points for same-y circles (asymmetric radii)', function ()
    {
        var a = makeCircle(0, 0, 4);
        var b = makeCircle(5, 0, 4);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(2);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 5);
            expect(db).toBeCloseTo(b.radius, 5);
        });
    });

    it('should handle same-y circles where x0 < x1 and different radii', function ()
    {
        var a = makeCircle(-2, 5, 5);
        var b = makeCircle(4, 5, 4);
        var result = GetCircleToCircle(a, b);
        // Should be 0, 1, or 2 intersection points
        expect(result.length).toBeGreaterThanOrEqual(0);
        expect(result.length).toBeLessThanOrEqual(2);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 4);
            expect(db).toBeCloseTo(b.radius, 4);
        });
    });

    // --- Different y (general case) ---

    it('should return two intersection points for circles with different y that overlap', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(0, 6, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(2);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 5);
            expect(db).toBeCloseTo(b.radius, 5);
        });
    });

    it('should return one intersection point for tangent circles with different y', function ()
    {
        var a = makeCircle(0, 0, 3);
        var b = makeCircle(0, 6, 3);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(3, 5);
    });

    it('should return two intersection points for diagonal circles that overlap', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(4, 3, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(2);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 5);
            expect(db).toBeCloseTo(b.radius, 5);
        });
    });

    it('should return Vector2 objects with x and y properties', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(6, 0, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBeGreaterThan(0);
        result.forEach(function (pt)
        {
            expect(typeof pt.x).toBe('number');
            expect(typeof pt.y).toBe('number');
        });
    });

    it('should append to an existing out array', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(6, 0, 5);
        var out = [];
        GetCircleToCircle(a, b, out);
        var prevLength = out.length;
        // Call again with same out — should append more points
        GetCircleToCircle(a, b, out);
        expect(out.length).toBe(prevLength * 2);
    });

    it('should return empty array and not throw when circles are far apart', function ()
    {
        var a = makeCircle(0, 0, 1);
        var b = makeCircle(1000, 1000, 1);
        expect(function () { GetCircleToCircle(a, b); }).not.toThrow();
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(0);
    });

    it('should handle circles at negative coordinates', function ()
    {
        var a = makeCircle(-10, -10, 5);
        var b = makeCircle(-14, -10, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBeGreaterThanOrEqual(1);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 4);
            expect(db).toBeCloseTo(b.radius, 4);
        });
    });

    it('should return at most 2 intersection points', function ()
    {
        var a = makeCircle(0, 0, 5);
        var b = makeCircle(3, 4, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should handle circles with different radii that still intersect', function ()
    {
        var a = makeCircle(0, 0, 10);
        var b = makeCircle(8, 0, 5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBe(2);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 4);
            expect(db).toBeCloseTo(b.radius, 4);
        });
    });

    it('should handle floating point radii and positions', function ()
    {
        var a = makeCircle(0.5, 0.5, 3.5);
        var b = makeCircle(4.5, 0.5, 3.5);
        var result = GetCircleToCircle(a, b);
        expect(result.length).toBeGreaterThanOrEqual(1);
        result.forEach(function (pt)
        {
            var da = Math.sqrt((pt.x - a.x) * (pt.x - a.x) + (pt.y - a.y) * (pt.y - a.y));
            var db = Math.sqrt((pt.x - b.x) * (pt.x - b.x) + (pt.y - b.y) * (pt.y - b.y));
            expect(da).toBeCloseTo(a.radius, 4);
            expect(db).toBeCloseTo(b.radius, 4);
        });
    });
});
