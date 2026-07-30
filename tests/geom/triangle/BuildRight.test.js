var BuildRight = require('../../../src/geom/triangle/BuildRight');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Triangle.BuildRight', function ()
{
    it('should return a Triangle instance', function ()
    {
        var result = BuildRight(0, 0, 100, 100);
        expect(result).toBeInstanceOf(Triangle);
    });

    it('should place the right angle vertex at x1/y1', function ()
    {
        var result = BuildRight(10, 20, 100, 50);
        expect(result.x1).toBe(10);
        expect(result.y1).toBe(20);
    });

    it('should place the second point directly above the right angle vertex', function ()
    {
        var result = BuildRight(10, 20, 100, 50);
        expect(result.x2).toBe(10);
        expect(result.y2).toBe(-30);
    });

    it('should place the third point directly to the right of the right angle vertex', function ()
    {
        var result = BuildRight(10, 20, 100, 50);
        expect(result.x3).toBe(110);
        expect(result.y3).toBe(20);
    });

    it('should default height to width when height is not provided', function ()
    {
        var result = BuildRight(0, 0, 100);
        expect(result.x1).toBe(0);
        expect(result.y1).toBe(0);
        expect(result.x2).toBe(0);
        expect(result.y2).toBe(-100);
        expect(result.x3).toBe(100);
        expect(result.y3).toBe(0);
    });

    it('should handle origin at 0,0 with positive width and height', function ()
    {
        var result = BuildRight(0, 0, 100, 200);
        expect(result.x1).toBe(0);
        expect(result.y1).toBe(0);
        expect(result.x2).toBe(0);
        expect(result.y2).toBe(-200);
        expect(result.x3).toBe(100);
        expect(result.y3).toBe(0);
    });

    it('should handle negative width extending left', function ()
    {
        var result = BuildRight(50, 50, -100, 100);
        expect(result.x1).toBe(50);
        expect(result.y1).toBe(50);
        expect(result.x2).toBe(50);
        expect(result.y2).toBe(-50);
        expect(result.x3).toBe(-50);
        expect(result.y3).toBe(50);
    });

    it('should handle negative height extending downward', function ()
    {
        var result = BuildRight(50, 50, 100, -100);
        expect(result.x1).toBe(50);
        expect(result.y1).toBe(50);
        expect(result.x2).toBe(50);
        expect(result.y2).toBe(150);
        expect(result.x3).toBe(150);
        expect(result.y3).toBe(50);
    });

    it('should handle both negative width and height', function ()
    {
        var result = BuildRight(0, 0, -50, -80);
        expect(result.x1).toBe(0);
        expect(result.y1).toBe(0);
        expect(result.x2).toBe(0);
        expect(result.y2).toBe(80);
        expect(result.x3).toBe(-50);
        expect(result.y3).toBe(0);
    });

    it('should handle negative coordinates for the right angle vertex', function ()
    {
        var result = BuildRight(-100, -100, 50, 75);
        expect(result.x1).toBe(-100);
        expect(result.y1).toBe(-100);
        expect(result.x2).toBe(-100);
        expect(result.y2).toBe(-175);
        expect(result.x3).toBe(-50);
        expect(result.y3).toBe(-100);
    });

    it('should handle zero width', function ()
    {
        var result = BuildRight(10, 10, 0, 100);
        expect(result.x1).toBe(10);
        expect(result.y1).toBe(10);
        expect(result.x2).toBe(10);
        expect(result.y2).toBe(-90);
        expect(result.x3).toBe(10);
        expect(result.y3).toBe(10);
    });

    it('should handle zero height', function ()
    {
        var result = BuildRight(10, 10, 100, 0);
        expect(result.x1).toBe(10);
        expect(result.y1).toBe(10);
        expect(result.x2).toBe(10);
        expect(result.y2).toBe(10);
        expect(result.x3).toBe(110);
        expect(result.y3).toBe(10);
    });

    it('should handle floating point coordinates', function ()
    {
        var result = BuildRight(1.5, 2.5, 3.5, 4.5);
        expect(result.x1).toBeCloseTo(1.5);
        expect(result.y1).toBeCloseTo(2.5);
        expect(result.x2).toBeCloseTo(1.5);
        expect(result.y2).toBeCloseTo(-2.0);
        expect(result.x3).toBeCloseTo(5.0);
        expect(result.y3).toBeCloseTo(2.5);
    });

    it('should handle large values', function ()
    {
        var result = BuildRight(1000, 2000, 5000, 3000);
        expect(result.x1).toBe(1000);
        expect(result.y1).toBe(2000);
        expect(result.x2).toBe(1000);
        expect(result.y2).toBe(-1000);
        expect(result.x3).toBe(6000);
        expect(result.y3).toBe(2000);
    });

    it('should produce a triangle where x1 equals x2 (vertical side)', function ()
    {
        var result = BuildRight(30, 40, 100, 80);
        expect(result.x1).toBe(result.x2);
    });

    it('should produce a triangle where y1 equals y3 (horizontal side)', function ()
    {
        var result = BuildRight(30, 40, 100, 80);
        expect(result.y1).toBe(result.y3);
    });
});
