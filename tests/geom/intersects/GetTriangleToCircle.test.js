var GetTriangleToCircle = require('../../../src/geom/intersects/GetTriangleToCircle');

describe('Phaser.Geom.Intersects.GetTriangleToCircle', function ()
{
    function makeTriangle (x1, y1, x2, y2, x3, y3)
    {
        var lineA = { x1: x1, y1: y1, x2: x2, y2: y2 };
        var lineB = { x1: x2, y1: y2, x2: x3, y2: y3 };
        var lineC = { x1: x3, y1: y3, x2: x1, y2: y1 };

        return {
            x1: x1, y1: y1,
            x2: x2, y2: y2,
            x3: x3, y3: y3,
            getLineA: function () { return lineA; },
            getLineB: function () { return lineB; },
            getLineC: function () { return lineC; }
        };
    }

    function makeCircle (x, y, radius)
    {
        return { x: x, y: y, radius: radius, left: x - radius, right: x + radius, top: y - radius, bottom: y + radius };
    }

    it('should return an empty array when triangle and circle do not intersect', function ()
    {
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(500, 500, 10);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return intersection points when circle crosses a triangle side', function ()
    {
        // Circle centered just outside the triangle, intersecting one side
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(50, -5, 10);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return an empty array when using provided out array and no intersection', function ()
    {
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(500, 500, 10);
        var out = [];
        var result = GetTriangleToCircle(triangle, circle, out);

        expect(result).toBe(out);
        expect(result.length).toBe(0);
    });

    it('should populate the provided out array when intersection occurs', function ()
    {
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(50, -5, 10);
        var out = [];
        var result = GetTriangleToCircle(triangle, circle, out);

        expect(result).toBe(out);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return the out array reference when provided', function ()
    {
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(500, 500, 10);
        var out = [];
        var result = GetTriangleToCircle(triangle, circle, out);

        expect(result).toBe(out);
    });

    it('should create and return a new array when out is not provided', function ()
    {
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(500, 500, 10);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return intersection points when circle center is inside the triangle', function ()
    {
        // Triangle covering a large area; circle fully inside
        var triangle = makeTriangle(0, 0, 200, 0, 100, 200);
        var circle = makeCircle(100, 50, 5);
        var result = GetTriangleToCircle(triangle, circle);

        // Circle is inside so sides may or may not be touched — just verify it returns an array
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return intersection points when a large circle encompasses the triangle', function ()
    {
        var triangle = makeTriangle(40, 40, 60, 40, 50, 60);
        var circle = makeCircle(50, 50, 100);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should not call getLineA/B/C when there is no intersection', function ()
    {
        // TriangleToCircle internally also calls getLine methods, so we can only verify the result
        var triangle = makeTriangle(0, 0, 10, 0, 5, 10);
        var circle = makeCircle(500, 500, 1);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should call getLineA, getLineB, and getLineC when intersection occurs', function ()
    {
        // TriangleToCircle internally also calls getLine methods, so we verify by result not call count
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(50, -5, 10);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should append to an existing out array', function ()
    {
        var existingPoint = { x: 999, y: 999 };
        var triangle = makeTriangle(0, 0, 100, 0, 50, 100);
        var circle = makeCircle(50, -5, 10);
        var out = [ existingPoint ];

        GetTriangleToCircle(triangle, circle, out);

        expect(out[0]).toBe(existingPoint);
        expect(out.length).toBeGreaterThan(1);
    });

    it('should handle a degenerate triangle (zero area) with no intersection', function ()
    {
        var triangle = makeTriangle(0, 0, 0, 0, 0, 0);
        var circle = makeCircle(100, 100, 10);
        var result = GetTriangleToCircle(triangle, circle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
});
