var GetTriangleToTriangle = require('../../../src/geom/intersects/GetTriangleToTriangle');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Intersects.GetTriangleToTriangle', function ()
{
    it('should return an empty array when triangles do not intersect', function ()
    {
        // triangleA far left, triangleB far right
        var triangleA = new Triangle(0, 0, 10, 0, 5, 10);
        var triangleB = new Triangle(100, 100, 110, 100, 105, 110);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return intersection points when triangles overlap', function ()
    {
        // Two overlapping triangles sharing a region
        var triangleA = new Triangle(0, 0, 20, 0, 10, 20);
        var triangleB = new Triangle(5, 5, 25, 5, 15, 25);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should use the provided out array', function ()
    {
        var triangleA = new Triangle(0, 0, 20, 0, 10, 20);
        var triangleB = new Triangle(5, 5, 25, 5, 15, 25);
        var out = [];

        var result = GetTriangleToTriangle(triangleA, triangleB, out);

        expect(result).toBe(out);
        expect(out.length).toBeGreaterThan(0);
    });

    it('should return the out array unchanged when triangles do not intersect', function ()
    {
        var triangleA = new Triangle(0, 0, 10, 0, 5, 10);
        var triangleB = new Triangle(100, 100, 110, 100, 105, 110);
        var out = [];

        var result = GetTriangleToTriangle(triangleA, triangleB, out);

        expect(result).toBe(out);
        expect(out.length).toBe(0);
    });

    it('should create a new array when out is not provided', function ()
    {
        var triangleA = new Triangle(0, 0, 10, 0, 5, 10);
        var triangleB = new Triangle(100, 100, 110, 100, 105, 110);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return points with x and y properties', function ()
    {
        var triangleA = new Triangle(0, 0, 20, 0, 10, 20);
        var triangleB = new Triangle(5, 5, 25, 5, 15, 25);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should detect intersection when one triangle is fully inside the other', function ()
    {
        // Large outer triangle containing a small inner triangle
        var outer = new Triangle(0, 0, 100, 0, 50, 100);
        var inner = new Triangle(30, 20, 60, 20, 45, 50);

        var result = GetTriangleToTriangle(outer, inner);

        expect(Array.isArray(result)).toBe(true);
        // When one triangle is fully inside the other, edges may not cross
        // but TriangleToTriangle should still return true
    });

    it('should handle triangles that share an edge', function ()
    {
        // Two triangles that share an edge along y=0
        var triangleA = new Triangle(0, 0, 10, 0, 5, -10);
        var triangleB = new Triangle(0, 0, 10, 0, 5, 10);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle triangles that share a single vertex', function ()
    {
        var triangleA = new Triangle(0, 0, 10, 0, 5, 10);
        var triangleB = new Triangle(5, 10, 15, 10, 10, 20);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should append to an existing out array with pre-existing entries', function ()
    {
        var triangleA = new Triangle(0, 0, 20, 0, 10, 20);
        var triangleB = new Triangle(5, 5, 25, 5, 15, 25);
        var existing = [{ x: 999, y: 999 }];

        var result = GetTriangleToTriangle(triangleA, triangleB, existing);

        expect(result).toBe(existing);
        expect(result.length).toBeGreaterThan(1);
        expect(result[0].x).toBe(999);
    });

    it('should return intersection points within a reasonable coordinate range', function ()
    {
        var triangleA = new Triangle(0, 0, 20, 0, 10, 20);
        var triangleB = new Triangle(5, 5, 25, 5, 15, 25);

        var result = GetTriangleToTriangle(triangleA, triangleB);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBeGreaterThanOrEqual(-1);
            expect(result[i].x).toBeLessThanOrEqual(30);
            expect(result[i].y).toBeGreaterThanOrEqual(-1);
            expect(result[i].y).toBeLessThanOrEqual(30);
        }
    });
});
