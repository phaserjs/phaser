var Clone = require('../../../src/geom/circle/Clone');
var Circle = require('../../../src/geom/circle/Circle');

describe('Phaser.Geom.Circle.Clone', function ()
{
    it('should return a Circle instance', function ()
    {
        var source = new Circle(0, 0, 10);
        var result = Clone(source);

        expect(result).toBeInstanceOf(Circle);
    });

    it('should copy x, y and radius from the source Circle', function ()
    {
        var source = new Circle(10, 20, 30);
        var result = Clone(source);

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.radius).toBe(30);
    });

    it('should return a new object, not the same reference', function ()
    {
        var source = new Circle(10, 20, 30);
        var result = Clone(source);

        expect(result).not.toBe(source);
    });

    it('should be independent from the source after cloning', function ()
    {
        var source = new Circle(10, 20, 30);
        var result = Clone(source);

        source.x = 99;
        source.y = 99;
        source.radius = 99;

        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.radius).toBe(30);
    });

    it('should work with zero values', function ()
    {
        var source = new Circle(0, 0, 0);
        var result = Clone(source);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.radius).toBe(0);
    });

    it('should work with negative x and y values', function ()
    {
        var source = new Circle(-50, -100, 25);
        var result = Clone(source);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-100);
        expect(result.radius).toBe(25);
    });

    it('should work with floating point values', function ()
    {
        var source = new Circle(1.5, 2.7, 3.14);
        var result = Clone(source);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(2.7);
        expect(result.radius).toBeCloseTo(3.14);
    });

    it('should accept a plain circle-like object with x, y and radius properties', function ()
    {
        var source = { x: 5, y: 15, radius: 50 };
        var result = Clone(source);

        expect(result).toBeInstanceOf(Circle);
        expect(result.x).toBe(5);
        expect(result.y).toBe(15);
        expect(result.radius).toBe(50);
    });

    it('should work with large values', function ()
    {
        var source = new Circle(100000, 200000, 999999);
        var result = Clone(source);

        expect(result.x).toBe(100000);
        expect(result.y).toBe(200000);
        expect(result.radius).toBe(999999);
    });
});
