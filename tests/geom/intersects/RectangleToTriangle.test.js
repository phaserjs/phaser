var RectangleToTriangle = require('../../../src/geom/intersects/RectangleToTriangle');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Intersects.RectangleToTriangle', function ()
{
    //  rect(x, y, w, h), triangle(x1,y1, x2,y2, x3,y3)

    // -------------------------------------------------------------------------
    // Bounding box early-out tests
    // -------------------------------------------------------------------------

    it('should return false when triangle is entirely to the right of rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(200, 0, 300, 0, 250, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(false);
    });

    it('should return false when triangle is entirely to the left of rectangle', function ()
    {
        var rect = new Rectangle(200, 0, 100, 100);
        var tri = new Triangle(0, 0, 100, 0, 50, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(false);
    });

    it('should return false when triangle is entirely above rectangle', function ()
    {
        var rect = new Rectangle(0, 200, 100, 100);
        var tri = new Triangle(0, 0, 100, 0, 50, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(false);
    });

    it('should return false when triangle is entirely below rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(0, 200, 100, 200, 50, 300);

        expect(RectangleToTriangle(rect, tri)).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Triangle vertex inside rectangle
    // -------------------------------------------------------------------------

    it('should return true when a triangle vertex lies inside the rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(50, 50, 200, 0, 200, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when all triangle vertices lie inside the rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 200, 200);
        var tri = new Triangle(50, 50, 150, 50, 100, 150);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // Edge intersection tests
    // -------------------------------------------------------------------------

    it('should return true when a triangle edge crosses the left side of rectangle', function ()
    {
        var rect = new Rectangle(50, 0, 100, 100);
        var tri = new Triangle(0, 50, 200, 0, 200, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when a triangle edge crosses the top side of rectangle', function ()
    {
        var rect = new Rectangle(0, 50, 100, 100);
        var tri = new Triangle(50, 0, 0, 200, 100, 200);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when a triangle edge crosses the right side of rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(50, 50, 200, -10, 200, 110);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when a triangle edge crosses the bottom side of rectangle', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(50, -10, -10, 110, 110, 110);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // Rectangle contained inside triangle
    // -------------------------------------------------------------------------

    it('should return true when rectangle is entirely inside triangle', function ()
    {
        var rect = new Rectangle(40, 40, 20, 20);
        var tri = new Triangle(50, 0, 0, 100, 100, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when a large triangle completely contains the rectangle', function ()
    {
        var rect = new Rectangle(10, 10, 10, 10);
        var tri = new Triangle(-100, -100, 200, -100, 50, 200);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // No intersection despite overlapping bounding boxes
    // -------------------------------------------------------------------------

    it('should return false when bounding boxes overlap but shapes do not intersect', function ()
    {
        // Triangle in upper-left corner area with bounding box overlapping rect,
        // but the actual triangle body does not touch the rectangle.
        var rect = new Rectangle(80, 80, 40, 40);
        var tri = new Triangle(0, 0, 60, 0, 0, 60);

        expect(RectangleToTriangle(rect, tri)).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Touching / boundary cases
    // -------------------------------------------------------------------------

    it('should return true when a triangle vertex is exactly on the rectangle boundary', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(100, 50, 200, 0, 200, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when a triangle edge is coincident with a rectangle edge', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        // Bottom edge of rectangle (y=100) equals top edge of triangle
        var tri = new Triangle(0, 100, 100, 100, 50, 200);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // Partial overlap
    // -------------------------------------------------------------------------

    it('should return true when triangle partially overlaps the rectangle from the right', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(80, 20, 180, 50, 80, 80);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    it('should return true when triangle partially overlaps the rectangle from the top-left', function ()
    {
        var rect = new Rectangle(50, 50, 100, 100);
        var tri = new Triangle(0, 0, 100, 0, 0, 100);

        expect(RectangleToTriangle(rect, tri)).toBe(true);
    });

    // -------------------------------------------------------------------------
    // Return type
    // -------------------------------------------------------------------------

    it('should return a boolean', function ()
    {
        var rect = new Rectangle(0, 0, 100, 100);
        var tri = new Triangle(10, 10, 90, 10, 50, 90);

        var result = RectangleToTriangle(rect, tri);

        expect(typeof result).toBe('boolean');
    });

    it('should return a boolean false when shapes do not intersect', function ()
    {
        var rect = new Rectangle(0, 0, 10, 10);
        var tri = new Triangle(100, 100, 200, 100, 150, 200);

        var result = RectangleToTriangle(rect, tri);

        expect(typeof result).toBe('boolean');
        expect(result).toBe(false);
    });
});
