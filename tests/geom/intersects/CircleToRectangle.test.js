var CircleToRectangle = require('../../../src/geom/intersects/CircleToRectangle');

describe('Phaser.Geom.Intersects.CircleToRectangle', function ()
{
    var circle;
    var rect;

    beforeEach(function ()
    {
        // Rectangle at (0,0) with width=100, height=80 — center is at (50, 40)
        rect = { x: 0, y: 0, width: 100, height: 80 };
        // Circle centered in the rectangle
        circle = { x: 50, y: 40, radius: 10 };
    });

    it('should return true when circle center is inside rectangle', function ()
    {
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle center is at rectangle center', function ()
    {
        circle = { x: 50, y: 40, radius: 1 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return false when circle is completely to the left of rectangle', function ()
    {
        circle = { x: -50, y: 40, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return false when circle is completely to the right of rectangle', function ()
    {
        circle = { x: 200, y: 40, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return false when circle is completely above rectangle', function ()
    {
        circle = { x: 50, y: -50, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return false when circle is completely below rectangle', function ()
    {
        circle = { x: 50, y: 200, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return true when circle overlaps the left edge', function ()
    {
        // Circle centered left of rect, radius reaches inside
        circle = { x: -5, y: 40, radius: 20 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle overlaps the right edge', function ()
    {
        circle = { x: 105, y: 40, radius: 20 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle overlaps the top edge', function ()
    {
        circle = { x: 50, y: -5, radius: 20 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle overlaps the bottom edge', function ()
    {
        circle = { x: 50, y: 85, radius: 20 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle just touches the left edge', function ()
    {
        // Circle center at x=-10, radius=10: rightmost point at x=0, touching rect left edge
        circle = { x: -10, y: 40, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return false when circle just misses the left edge', function ()
    {
        // Circle center at x=-11, radius=10: rightmost point at x=-1, missing rect
        circle = { x: -11, y: 40, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return true when circle intersects the top-left corner', function ()
    {
        // Circle centered at (-5,-5) with radius 10: distance to corner (0,0) = sqrt(50) ~ 7.07 < 10
        circle = { x: -5, y: -5, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return false when circle is near corner but does not reach it', function ()
    {
        // Circle centered at (-8,-8), radius 10: distance to corner (0,0) = sqrt(128) ~ 11.31 > 10
        circle = { x: -8, y: -8, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return true when circle intersects the top-right corner', function ()
    {
        // Corner at (100,0), circle at (105,  -5), radius=10: dist=sqrt(50)~7.07 < 10
        circle = { x: 105, y: -5, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return false when circle misses the top-right corner', function ()
    {
        // Corner at (100,0), circle at (108, -8), radius=10: dist=sqrt(128)~11.31 > 10
        circle = { x: 108, y: -8, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return true when circle intersects the bottom-left corner', function ()
    {
        // Corner at (0,80), circle at (-5, 85), radius=10: dist=sqrt(50)~7.07 < 10
        circle = { x: -5, y: 85, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle intersects the bottom-right corner', function ()
    {
        // Corner at (100,80), circle at (105, 85), radius=10: dist=sqrt(50)~7.07 < 10
        circle = { x: 105, y: 85, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when circle center is on the rectangle edge', function ()
    {
        circle = { x: 0, y: 40, radius: 5 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return true when large circle completely contains the rectangle', function ()
    {
        circle = { x: 50, y: 40, radius: 200 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should work with a rectangle not at the origin', function ()
    {
        rect = { x: 100, y: 100, width: 100, height: 100 };
        // Circle center inside rect
        circle = { x: 150, y: 150, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return false when circle is outside a non-origin rectangle', function ()
    {
        rect = { x: 100, y: 100, width: 100, height: 100 };
        circle = { x: 0, y: 0, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should work correctly with a zero-width rectangle', function ()
    {
        rect = { x: 50, y: 0, width: 0, height: 100 };
        // Circle centered on the zero-width rect line
        circle = { x: 50, y: 50, radius: 5 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should work correctly with a zero-height rectangle', function ()
    {
        rect = { x: 0, y: 50, width: 100, height: 0 };
        circle = { x: 50, y: 50, radius: 5 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should handle a circle with zero radius inside the rectangle', function ()
    {
        circle = { x: 50, y: 40, radius: 0 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should handle a circle with zero radius outside the rectangle', function ()
    {
        circle = { x: -1, y: 40, radius: 0 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return true when circle exactly touches corner at distance equal to radius', function ()
    {
        // Corner at (0,0). Circle at (-6,-8), radius=10: dist=sqrt(36+64)=sqrt(100)=10 exactly
        circle = { x: -6, y: -8, radius: 10 };
        expect(CircleToRectangle(circle, rect)).toBe(true);
    });

    it('should return false when circle is just outside corner distance', function ()
    {
        // Corner at (0,0). Circle at (-6,-8), radius=9.99: dist=10 > 9.99
        circle = { x: -6, y: -8, radius: 9.99 };
        expect(CircleToRectangle(circle, rect)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var result = CircleToRectangle(circle, rect);
        expect(typeof result).toBe('boolean');
    });
});
