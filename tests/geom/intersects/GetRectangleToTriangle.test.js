var GetRectangleToTriangle = require('../../../src/geom/intersects/GetRectangleToTriangle');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Intersects.GetRectangleToTriangle', function ()
{
    it('should return an empty array when rectangle and triangle do not intersect', function ()
    {
        var rect = new Rectangle(0, 0, 10, 10);
        var triangle = new Triangle(50, 50, 60, 50, 55, 60);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return intersection points when triangle edge crosses rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var triangle = new Triangle(-10, 50, 110, 50, 50, -10);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should use the provided out array', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var triangle = new Triangle(-10, 50, 110, 50, 50, -10);
        var out = [];
        var result = GetRectangleToTriangle(rect, triangle, out);

        expect(result).toBe(out);
        expect(out.length).toBeGreaterThan(0);
    });

    it('should return the out array unchanged when there is no intersection', function ()
    {
        var rect = new Rectangle(0, 0, 10, 10);
        var triangle = new Triangle(100, 100, 200, 100, 150, 200);
        var out = [];
        var result = GetRectangleToTriangle(rect, triangle, out);

        expect(result).toBe(out);
        expect(out.length).toBe(0);
    });

    it('should create a new array when out is not provided', function ()
    {
        var rect = new Rectangle(0, 0, 10, 10);
        var triangle = new Triangle(100, 100, 200, 100, 150, 200);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return intersection points when triangle overlaps rectangle from two sides', function ()
    {
        var rect = new Rectangle(40, 40, 20, 20);
        var triangle = new Triangle(0, 50, 100, 50, 50, 0);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return intersection points when rectangle is inside the triangle', function ()
    {
        var rect = new Rectangle(40, 40, 20, 20);
        var triangle = new Triangle(0, 0, 200, 0, 100, 200);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle a triangle that is completely inside the rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 200, 200);
        var triangle = new Triangle(50, 50, 150, 50, 100, 150);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should populate existing out array with new intersection points', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var triangle = new Triangle(-10, 50, 110, 50, 50, -10);
        var out = [{ x: 0, y: 0 }];
        var result = GetRectangleToTriangle(rect, triangle, out);

        expect(result.length).toBeGreaterThan(1);
    });

    it('should return an array when shapes share only a boundary edge', function ()
    {
        var rect = new Rectangle(0, 0, 50, 50);
        var triangle = new Triangle(50, 0, 100, 0, 75, 50);
        var result = GetRectangleToTriangle(rect, triangle);

        expect(Array.isArray(result)).toBe(true);
    });
});
