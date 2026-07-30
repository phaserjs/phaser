var GetRectangleIntersection = require('../../../src/geom/intersects/GetRectangleIntersection');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Intersects.GetRectangleIntersection', function ()
{
    it('should return a Rectangle object', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should return correct intersection area for overlapping rectangles', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should return a zero rectangle when there is no intersection', function ()
    {
        var rectA = new Rectangle(0, 0, 50, 50);
        var rectB = new Rectangle(100, 100, 50, 50);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should populate the output parameter when provided and there is intersection', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(25, 25, 100, 100);
        var output = new Rectangle();
        var result = GetRectangleIntersection(rectA, rectB, output);

        expect(result).toBe(output);
        expect(output.x).toBe(25);
        expect(output.y).toBe(25);
        expect(output.width).toBe(75);
        expect(output.height).toBe(75);
    });

    it('should return the output parameter unchanged when there is no intersection', function ()
    {
        var rectA = new Rectangle(0, 0, 50, 50);
        var rectB = new Rectangle(200, 200, 50, 50);
        var output = new Rectangle(10, 20, 30, 40);
        var result = GetRectangleIntersection(rectA, rectB, output);

        expect(result).toBe(output);
        expect(output.x).toBe(10);
        expect(output.y).toBe(20);
        expect(output.width).toBe(30);
        expect(output.height).toBe(40);
    });

    it('should handle partial overlap on x-axis only', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 50);
        var rectB = new Rectangle(50, 100, 100, 50);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle rectangles that share only an edge (touching, not overlapping)', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(100, 0, 100, 100);
        var result = GetRectangleIntersection(rectA, rectB);

        // Touching rectangles are considered intersecting; intersection is a line (zero width)
        expect(result.x).toBe(100);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(100);
    });

    it('should handle one rectangle fully contained within another', function ()
    {
        var rectA = new Rectangle(0, 0, 200, 200);
        var rectB = new Rectangle(50, 50, 50, 50);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(50);
        expect(result.y).toBe(50);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should handle identical rectangles', function ()
    {
        var rectA = new Rectangle(10, 20, 100, 80);
        var rectB = new Rectangle(10, 20, 100, 80);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(80);
    });

    it('should handle rectangles with negative coordinates', function ()
    {
        var rectA = new Rectangle(-100, -100, 150, 150);
        var rectB = new Rectangle(-50, -50, 150, 150);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-50);
        expect(result.width).toBe(100);
        expect(result.height).toBe(100);
    });

    it('should handle floating point coordinates', function ()
    {
        var rectA = new Rectangle(0, 0, 10.5, 10.5);
        var rectB = new Rectangle(5.5, 5.5, 10, 10);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBeCloseTo(5.5);
        expect(result.y).toBeCloseTo(5.5);
        expect(result.width).toBeCloseTo(5);
        expect(result.height).toBeCloseTo(5);
    });

    it('should create a new Rectangle when no output is provided', function ()
    {
        var rectA = new Rectangle(0, 0, 100, 100);
        var rectB = new Rectangle(50, 50, 100, 100);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should handle zero-size rectangles', function ()
    {
        var rectA = new Rectangle(0, 0, 0, 0);
        var rectB = new Rectangle(0, 0, 100, 100);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle overlap only in a thin horizontal strip', function ()
    {
        var rectA = new Rectangle(0, 0, 200, 10);
        var rectB = new Rectangle(0, 5, 200, 10);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(0);
        expect(result.y).toBe(5);
        expect(result.width).toBe(200);
        expect(result.height).toBe(5);
    });

    it('should handle overlap only in a thin vertical strip', function ()
    {
        var rectA = new Rectangle(0, 0, 10, 200);
        var rectB = new Rectangle(5, 0, 10, 200);
        var result = GetRectangleIntersection(rectA, rectB);

        expect(result.x).toBe(5);
        expect(result.y).toBe(0);
        expect(result.width).toBe(5);
        expect(result.height).toBe(200);
    });
});
