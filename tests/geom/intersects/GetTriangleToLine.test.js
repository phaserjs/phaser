var GetTriangleToLine = require('../../../src/geom/intersects/GetTriangleToLine');
var Triangle = require('../../../src/geom/Triangle');
var Line = require('../../../src/geom/Line');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Intersects.GetTriangleToLine', function ()
{
    var triangle;
    var lineThrough;
    var lineMiss;

    beforeEach(function ()
    {
        // Triangle with vertices at (0,0), (100,0), (50,100)
        triangle = new Triangle(0, 0, 100, 0, 50, 100);

        // Line that passes through the triangle horizontally
        lineThrough = new Line(-10, 50, 110, 50);

        // Line that misses the triangle entirely
        lineMiss = new Line(200, 200, 300, 300);
    });

    it('should return an empty array when the line does not intersect the triangle', function ()
    {
        var result = GetTriangleToLine(triangle, lineMiss);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an array of intersection points when the line crosses the triangle', function ()
    {
        var result = GetTriangleToLine(triangle, lineThrough);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return Vector2 objects as intersection points', function ()
    {
        var result = GetTriangleToLine(triangle, lineThrough);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i]).toBeInstanceOf(Vector2);
        }
    });

    it('should use the provided out array', function ()
    {
        var out = [];
        var result = GetTriangleToLine(triangle, lineThrough, out);

        expect(result).toBe(out);
        expect(out.length).toBeGreaterThan(0);
    });

    it('should return the same reference as the provided out array when no intersection', function ()
    {
        var out = [];
        var result = GetTriangleToLine(triangle, lineMiss, out);

        expect(result).toBe(out);
        expect(out.length).toBe(0);
    });

    it('should create and return a new array when no out parameter is given', function ()
    {
        var result = GetTriangleToLine(triangle, lineMiss);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should find two intersection points when a line crosses two sides of the triangle', function ()
    {
        // Horizontal line crossing left and right sides of the triangle
        var line = new Line(-10, 50, 110, 50);
        var result = GetTriangleToLine(triangle, line);

        expect(result.length).toBe(2);
    });

    it('should find correct x coordinates for intersection with horizontal line', function ()
    {
        // At y=50, the triangle sides intersect at known x values
        // Left side from (0,0) to (50,100): x = y/2 = 25 at y=50
        // Right side from (100,0) to (50,100): x = 100 - y/2 = 75 at y=50
        var line = new Line(-10, 50, 110, 50);
        var result = GetTriangleToLine(triangle, line);

        expect(result.length).toBe(2);

        var xValues = result.map(function (pt) { return pt.x; }).sort(function (a, b) { return a - b; });
        expect(xValues[0]).toBeCloseTo(25, 5);
        expect(xValues[1]).toBeCloseTo(75, 5);
    });

    it('should handle a line along the base of the triangle (collinear with a side)', function ()
    {
        // Line along y=0 (the base of the triangle)
        var base = new Line(-10, 0, 110, 0);
        var result = GetTriangleToLine(triangle, base);

        // Should return an array (intersection exists since line is at the base)
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle a line that only touches a vertex', function ()
    {
        // Line passing through vertex (0,0) but otherwise outside
        var line = new Line(-10, -10, 10, 10);
        var result = GetTriangleToLine(triangle, line);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should append results to an existing out array', function ()
    {
        var existing = new Vector2(999, 999);
        var out = [existing];
        var result = GetTriangleToLine(triangle, lineThrough, out);

        expect(result[0]).toBe(existing);
        expect(result.length).toBeGreaterThan(1);
    });

    it('should handle a line that starts inside the triangle', function ()
    {
        // Line starting at centroid (50, 33) going outside
        var line = new Line(50, 33, 200, 33);
        var result = GetTriangleToLine(triangle, line);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should handle a line entirely inside the triangle', function ()
    {
        // Small line well within the triangle
        var line = new Line(45, 30, 55, 30);
        var result = GetTriangleToLine(triangle, line);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle a vertical line crossing the triangle', function ()
    {
        // Vertical line at x=50 from y=-10 to y=110
        var line = new Line(50, -10, 50, 110);
        var result = GetTriangleToLine(triangle, line);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return intersection y coordinates on the correct horizontal level', function ()
    {
        var line = new Line(-10, 50, 110, 50);
        var result = GetTriangleToLine(triangle, line);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].y).toBeCloseTo(50, 5);
        }
    });
});
