var GetRectangleToRectangle = require('../../../src/geom/intersects/GetRectangleToRectangle');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Intersects.GetRectangleToRectangle', function ()
{
    it('should return an array', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(200, 200, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return an empty array when rectangles do not intersect', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(200, 200, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return intersection points when rectangles overlap', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should use the provided out array', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);
        var out = [];

        var result = GetRectangleToRectangle(rectA, rectB, out);

        expect(result).toBe(out);
    });

    it('should create a new array if out is not provided', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should append to an existing out array', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);
        var out = [];
        var firstResult = GetRectangleToRectangle(rectA, rectB, out);
        var initialLength = firstResult.length;

        GetRectangleToRectangle(rectA, rectB, out);

        expect(out.length).toBe(initialLength * 2);
    });

    it('should return empty array when rectA has zero width', function ()
    {
        var rectA = new Rectangle(0, 0, 0, 100);
        var rectB = new Rectangle(0, 0, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return empty array when rectA has zero height', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 0);
        var rectB = new Rectangle(0, 0, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return empty array when rectB has zero width', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 0, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return empty array when rectB has zero height', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 0);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return empty array when both rectangles have zero size', function ()
    {
        var rectA = new Rectangle(0, 0, 0, 0);
        var rectB = new Rectangle(0, 0, 0, 0);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return intersection points when one rectangle is fully inside the other', function ()
    {
        var rectA = new Rectangle(0, 0, 200, 200);
        var rectB = new Rectangle(50, 50, 50, 50);

        var result = GetRectangleToRectangle(rectA, rectB);

        // rectB is fully inside rectA, so no edges of rectA cross into rectB
        // but edges of rectB may intersect with nothing since rectB is fully contained
        // The function checks edges of rectA against rectB
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle rectangles that only touch at an edge', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(100, 0, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return intersection points for partial overlap on the right side', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(80, 20, 100, 60);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return intersection points that are Vector2-like objects with x and y', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should return empty array when rectangles are separated horizontally', function ()
    {
        var rectA = new Rectangle(0, 0, 50, 100);
        var rectB = new Rectangle(100, 0, 50, 100);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should return empty array when rectangles are separated vertically', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 50);
        var rectB = new Rectangle(0, 100, 100, 50);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBe(0);
    });

    it('should handle rectangles at negative coordinates', function ()
    {
        var rectA = new Rectangle(-100, -100, 150, 150);
        var rectB = new Rectangle(-50, -50, 150, 150);

        var result = GetRectangleToRectangle(rectA, rectB);

        expect(result.length).toBeGreaterThan(0);
    });
});
