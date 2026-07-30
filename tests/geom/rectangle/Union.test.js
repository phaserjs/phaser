var Union = require('../../../src/geom/rectangle/Union');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Rectangle.Union', function ()
{
    it('should return a new Rectangle when no out parameter is provided', function ()
    {
        var rectA = new Rectangle(0, 0, 10, 10);
        var rectB = new Rectangle(5, 5, 10, 10);
        var result = Union(rectA, rectB);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should use the provided out Rectangle', function ()
    {
        var rectA = new Rectangle(0, 0, 10, 10);
        var rectB = new Rectangle(5, 5, 10, 10);
        var out = new Rectangle();
        var result = Union(rectA, rectB, out);

        expect(result).toBe(out);
    });

    it('should compute the union of two non-overlapping rectangles', function ()
    {
        var rectA = new Rectangle(0, 0, 10, 10);
        var rectB = new Rectangle(20, 20, 10, 10);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(30);
        expect(result.height).toBe(30);
    });

    it('should compute the union of two overlapping rectangles', function ()
    {
        var rectA = new Rectangle(0, 0, 20, 20);
        var rectB = new Rectangle(10, 10, 20, 20);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(30);
        expect(result.height).toBe(30);
    });

    it('should compute the union when one rectangle contains the other', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(10, 10, 20, 20);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(100);
        expect(result.height).toBe(100);
    });

    it('should compute the union of identical rectangles', function ()
    {
        var rectA = new Rectangle(5, 5, 10, 10);
        var rectB = new Rectangle(5, 5, 10, 10);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
    });

    it('should handle rectangles with negative coordinates', function ()
    {
        var rectA = new Rectangle(-20, -20, 10, 10);
        var rectB = new Rectangle(10, 10, 10, 10);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(-20);
        expect(result.y).toBe(-20);
        expect(result.width).toBe(40);
        expect(result.height).toBe(40);
    });

    it('should handle rectangles where rectB is to the left of rectA', function ()
    {
        var rectA = new Rectangle(50, 0, 10, 10);
        var rectB = new Rectangle(0, 0, 10, 10);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(60);
        expect(result.height).toBe(10);
    });

    it('should handle rectangles where rectB is above rectA', function ()
    {
        var rectA = new Rectangle(0, 50, 10, 10);
        var rectB = new Rectangle(0, 0, 10, 10);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(10);
        expect(result.height).toBe(60);
    });

    it('should handle zero-size rectangles', function ()
    {
        var rectA = new Rectangle(5, 5, 0, 0);
        var rectB = new Rectangle(10, 10, 0, 0);
        var result = Union(rectA, rectB);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
        expect(result.width).toBe(5);
        expect(result.height).toBe(5);
    });

    it('should handle floating point coordinates', function ()
    {
        var rectA = new Rectangle(0.5, 0.5, 10.5, 10.5);
        var rectB = new Rectangle(5.5, 5.5, 10.5, 10.5);
        var result = Union(rectA, rectB);

        expect(result.x).toBeCloseTo(0.5);
        expect(result.y).toBeCloseTo(0.5);
        expect(result.width).toBeCloseTo(15.5);
        expect(result.height).toBeCloseTo(15.5);
    });

    it('should correctly use the out rectangle when out is one of the input rectangles', function ()
    {
        var rectA = new Rectangle(0, 0, 10, 10);
        var rectB = new Rectangle(5, 5, 10, 10);
        var result = Union(rectA, rectB, rectA);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(15);
        expect(result.height).toBe(15);
    });

    it('should return correct right and bottom values', function ()
    {
        var rectA = new Rectangle(0, 0, 10, 10);
        var rectB = new Rectangle(5, 5, 20, 20);
        var result = Union(rectA, rectB);

        expect(result.right).toBe(25);
        expect(result.bottom).toBe(25);
    });
});
