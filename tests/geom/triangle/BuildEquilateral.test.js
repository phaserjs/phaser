var BuildEquilateral = require('../../../src/geom/triangle/BuildEquilateral');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Triangle.BuildEquilateral', function ()
{
    it('should return a Triangle instance', function ()
    {
        var tri = BuildEquilateral(0, 0, 10);
        expect(tri).toBeInstanceOf(Triangle);
    });

    it('should set the apex at the given x, y coordinates', function ()
    {
        var tri = BuildEquilateral(5, 3, 10);
        expect(tri.x1).toBe(5);
        expect(tri.y1).toBe(3);
    });

    it('should place x2 half a side-length to the right of x', function ()
    {
        var tri = BuildEquilateral(0, 0, 20);
        expect(tri.x2).toBe(10);
    });

    it('should place x3 half a side-length to the left of x', function ()
    {
        var tri = BuildEquilateral(0, 0, 20);
        expect(tri.x3).toBe(-10);
    });

    it('should place y2 and y3 at y + height where height = length * sqrt(3) / 2', function ()
    {
        var length = 10;
        var height = length * (Math.sqrt(3) / 2);
        var tri = BuildEquilateral(0, 0, length);
        expect(tri.y2).toBeCloseTo(height);
        expect(tri.y3).toBeCloseTo(height);
    });

    it('should produce equal y coordinates for y2 and y3', function ()
    {
        var tri = BuildEquilateral(7, 4, 30);
        expect(tri.y2).toBeCloseTo(tri.y3);
    });

    it('should produce a triangle symmetric about the apex x', function ()
    {
        var tri = BuildEquilateral(10, 0, 40);
        expect(tri.x2 - 10).toBeCloseTo(10 - tri.x3);
    });

    it('should work with a zero-length side', function ()
    {
        var tri = BuildEquilateral(5, 5, 0);
        expect(tri.x1).toBe(5);
        expect(tri.y1).toBe(5);
        expect(tri.x2).toBe(5);
        expect(tri.y2).toBe(5);
        expect(tri.x3).toBe(5);
        expect(tri.y3).toBe(5);
    });

    it('should work with negative x and y coordinates', function ()
    {
        var length = 10;
        var height = length * (Math.sqrt(3) / 2);
        var tri = BuildEquilateral(-10, -5, length);
        expect(tri.x1).toBe(-10);
        expect(tri.y1).toBe(-5);
        expect(tri.x2).toBeCloseTo(-5);
        expect(tri.y2).toBeCloseTo(-5 + height);
        expect(tri.x3).toBeCloseTo(-15);
        expect(tri.y3).toBeCloseTo(-5 + height);
    });

    it('should work with floating point coordinates', function ()
    {
        var length = 7.5;
        var height = length * (Math.sqrt(3) / 2);
        var tri = BuildEquilateral(1.5, 2.5, length);
        expect(tri.x1).toBeCloseTo(1.5);
        expect(tri.y1).toBeCloseTo(2.5);
        expect(tri.x2).toBeCloseTo(1.5 + length / 2);
        expect(tri.y2).toBeCloseTo(2.5 + height);
        expect(tri.x3).toBeCloseTo(1.5 - length / 2);
        expect(tri.y3).toBeCloseTo(2.5 + height);
    });

    it('should produce base vertices below the apex', function ()
    {
        var tri = BuildEquilateral(0, 0, 50);
        expect(tri.y2).toBeGreaterThan(tri.y1);
        expect(tri.y3).toBeGreaterThan(tri.y1);
    });

    it('should produce equal side lengths for all three sides', function ()
    {
        var length = 20;
        var tri = BuildEquilateral(0, 0, length);

        var dx12 = tri.x2 - tri.x1;
        var dy12 = tri.y2 - tri.y1;
        var side12 = Math.sqrt(dx12 * dx12 + dy12 * dy12);

        var dx23 = tri.x3 - tri.x2;
        var dy23 = tri.y3 - tri.y2;
        var side23 = Math.sqrt(dx23 * dx23 + dy23 * dy23);

        var dx31 = tri.x1 - tri.x3;
        var dy31 = tri.y1 - tri.y3;
        var side31 = Math.sqrt(dx31 * dx31 + dy31 * dy31);

        expect(side12).toBeCloseTo(length);
        expect(side23).toBeCloseTo(length);
        expect(side31).toBeCloseTo(length);
    });
});
