var Intersection = require('../../../src/geom/rectangle/Intersection');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Rectangle.Intersection', function ()
{
    it('should return a Rectangle when rectangles intersect', function ()
    {
        var a = new Rectangle(0, 0, 100, 100);
        var b = new Rectangle(50, 50, 100, 100);
        var result = Intersection(a, b);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should return correct intersection area for overlapping rectangles', function ()
    {
        var a = new Rectangle(0, 0, 100, 100);
        var b = new Rectangle(50, 50, 100, 100);
        var result = Intersection(a, b);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should return zero width and height when rectangles do not intersect', function ()
    {
        var a = new Rectangle(0, 0, 50, 50);
        var b = new Rectangle(100, 100, 50, 50);
        var result = Intersection(a, b);

        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should use the provided out Rectangle', function ()
    {
        var a = new Rectangle(0, 0, 100, 100);
        var b = new Rectangle(25, 25, 50, 50);
        var out = new Rectangle();
        var result = Intersection(a, b, out);

        expect(result).toBe(out);
    });

    it('should create a new Rectangle when out is not provided', function ()
    {
        var a = new Rectangle(0, 0, 100, 100);
        var b = new Rectangle(25, 25, 50, 50);
        var result = Intersection(a, b);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should return full rect when one rectangle is fully inside the other', function ()
    {
        var outer = new Rectangle(0, 0, 200, 200);
        var inner = new Rectangle(50, 50, 100, 100);
        var result = Intersection(outer, inner);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
        expect(result.width).toBe(100);
        expect(result.height).toBe(100);
    });

    it('should handle partial horizontal overlap only', function ()
    {
        var a = new Rectangle(0, 0, 100, 50);
        var b = new Rectangle(50, 0, 100, 50);
        var result = Intersection(a, b);

        expect(result.x).toBe(50);
        expect(result.y).toBe(0);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should handle partial vertical overlap only', function ()
    {
        var a = new Rectangle(0, 0, 50, 100);
        var b = new Rectangle(0, 50, 50, 100);
        var result = Intersection(a, b);

        expect(result.x).toBe(0);
        expect(result.y).toBe(50);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should return zero size when rectangles only share an edge', function ()
    {
        var a = new Rectangle(0, 0, 100, 100);
        var b = new Rectangle(100, 0, 100, 100);
        var result = Intersection(a, b);

        // Touching counts as intersection; the shared vertical edge has zero width but full height
        expect(result.width).toBe(0);
        expect(result.height).toBe(100);
    });

    it('should return zero size when rectangles only share a corner', function ()
    {
        var a = new Rectangle(0, 0, 100, 100);
        var b = new Rectangle(100, 100, 100, 100);
        var result = Intersection(a, b);

        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle negative coordinates', function ()
    {
        var a = new Rectangle(-100, -100, 150, 150);
        var b = new Rectangle(-50, -50, 150, 150);
        var result = Intersection(a, b);

        // a.right=50, b.right=100; out.width = min(50,100) - max(-100,-50) = 50-(-50) = 100
        expect(result.x).toBe(-50);
        expect(result.y).toBe(-50);
        expect(result.width).toBe(100);
        expect(result.height).toBe(100);
    });

    it('should handle identical rectangles', function ()
    {
        var a = new Rectangle(10, 20, 100, 80);
        var b = new Rectangle(10, 20, 100, 80);
        var result = Intersection(a, b);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(80);
    });

    it('should overwrite previous out Rectangle values when no intersection', function ()
    {
        var a = new Rectangle(0, 0, 50, 50);
        var b = new Rectangle(200, 200, 50, 50);
        var out = new Rectangle(99, 99, 99, 99);
        Intersection(a, b, out);

        expect(out.width).toBe(0);
        expect(out.height).toBe(0);
    });

    it('should handle floating point coordinates', function ()
    {
        var a = new Rectangle(0.5, 0.5, 100.5, 100.5);
        var b = new Rectangle(50.5, 50.5, 100.5, 100.5);
        var result = Intersection(a, b);

        expect(result.x).toBeCloseTo(50.5);
        expect(result.y).toBeCloseTo(50.5);
        expect(result.width).toBeCloseTo(50.5);
        expect(result.height).toBeCloseTo(50.5);
    });
});
