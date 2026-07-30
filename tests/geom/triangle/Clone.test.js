var Clone = require('../../../src/geom/triangle/Clone');
var Triangle = require('../../../src/geom/triangle/Triangle');

describe('Phaser.Geom.Triangle.Clone', function ()
{
    it('should return a Triangle instance', function ()
    {
        var source = new Triangle(0, 0, 100, 0, 50, 100);
        var result = Clone(source);

        expect(result).toBeInstanceOf(Triangle);
    });

    it('should copy all vertex coordinates from the source', function ()
    {
        var source = new Triangle(10, 20, 30, 40, 50, 60);
        var result = Clone(source);

        expect(result.x1).toBe(10);
        expect(result.y1).toBe(20);
        expect(result.x2).toBe(30);
        expect(result.y2).toBe(40);
        expect(result.x3).toBe(50);
        expect(result.y3).toBe(60);
    });

    it('should return a different object from the source', function ()
    {
        var source = new Triangle(0, 0, 100, 0, 50, 100);
        var result = Clone(source);

        expect(result).not.toBe(source);
    });

    it('should not be affected by mutations to the source after cloning', function ()
    {
        var source = new Triangle(10, 20, 30, 40, 50, 60);
        var result = Clone(source);

        source.x1 = 999;
        source.y1 = 999;

        expect(result.x1).toBe(10);
        expect(result.y1).toBe(20);
    });

    it('should clone a triangle with zero coordinates', function ()
    {
        var source = new Triangle(0, 0, 0, 0, 0, 0);
        var result = Clone(source);

        expect(result.x1).toBe(0);
        expect(result.y1).toBe(0);
        expect(result.x2).toBe(0);
        expect(result.y2).toBe(0);
        expect(result.x3).toBe(0);
        expect(result.y3).toBe(0);
    });

    it('should clone a triangle with negative coordinates', function ()
    {
        var source = new Triangle(-10, -20, -30, -40, -50, -60);
        var result = Clone(source);

        expect(result.x1).toBe(-10);
        expect(result.y1).toBe(-20);
        expect(result.x2).toBe(-30);
        expect(result.y2).toBe(-40);
        expect(result.x3).toBe(-50);
        expect(result.y3).toBe(-60);
    });

    it('should clone a triangle with floating point coordinates', function ()
    {
        var source = new Triangle(1.5, 2.7, 3.14, 4.99, 5.01, 6.123);
        var result = Clone(source);

        expect(result.x1).toBeCloseTo(1.5);
        expect(result.y1).toBeCloseTo(2.7);
        expect(result.x2).toBeCloseTo(3.14);
        expect(result.y2).toBeCloseTo(4.99);
        expect(result.x3).toBeCloseTo(5.01);
        expect(result.y3).toBeCloseTo(6.123);
    });

    it('should work with a plain object having the required properties', function ()
    {
        var source = { x1: 1, y1: 2, x2: 3, y2: 4, x3: 5, y3: 6 };
        var result = Clone(source);

        expect(result.x1).toBe(1);
        expect(result.y1).toBe(2);
        expect(result.x2).toBe(3);
        expect(result.y2).toBe(4);
        expect(result.x3).toBe(5);
        expect(result.y3).toBe(6);
    });
});
