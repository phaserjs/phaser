var GetBounds = require('../../../src/geom/circle/GetBounds');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Circle.GetBounds', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = {
            left: 50,
            top: 50,
            diameter: 100
        };
    });

    it('should return a Rectangle when no out parameter is given', function ()
    {
        var result = GetBounds(circle);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should set x to circle.left', function ()
    {
        var result = GetBounds(circle);

        expect(result.x).toBe(50);
    });

    it('should set y to circle.top', function ()
    {
        var result = GetBounds(circle);

        expect(result.y).toBe(50);
    });

    it('should set width to circle.diameter', function ()
    {
        var result = GetBounds(circle);

        expect(result.width).toBe(100);
    });

    it('should set height to circle.diameter', function ()
    {
        var result = GetBounds(circle);

        expect(result.height).toBe(100);
    });

    it('should populate a provided Rectangle out object', function ()
    {
        var out = new Rectangle();

        var result = GetBounds(circle, out);

        expect(result).toBe(out);
        expect(out.x).toBe(50);
        expect(out.y).toBe(50);
        expect(out.width).toBe(100);
        expect(out.height).toBe(100);
    });

    it('should populate a plain object as out', function ()
    {
        var out = { x: 0, y: 0, width: 0, height: 0 };

        var result = GetBounds(circle, out);

        expect(result).toBe(out);
        expect(out.x).toBe(50);
        expect(out.y).toBe(50);
        expect(out.width).toBe(100);
        expect(out.height).toBe(100);
    });

    it('should return the out parameter that was passed in', function ()
    {
        var out = new Rectangle();

        var result = GetBounds(circle, out);

        expect(result).toBe(out);
    });

    it('should handle a circle at the origin with zero radius', function ()
    {
        var zeroCircle = { left: 0, top: 0, diameter: 0 };

        var result = GetBounds(zeroCircle);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle a circle with negative position', function ()
    {
        var negCircle = { left: -150, top: -75, diameter: 50 };

        var result = GetBounds(negCircle);

        expect(result.x).toBe(-150);
        expect(result.y).toBe(-75);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
    });

    it('should handle floating point values', function ()
    {
        var floatCircle = { left: 10.5, top: 20.25, diameter: 33.75 };

        var result = GetBounds(floatCircle);

        expect(result.x).toBeCloseTo(10.5);
        expect(result.y).toBeCloseTo(20.25);
        expect(result.width).toBeCloseTo(33.75);
        expect(result.height).toBeCloseTo(33.75);
    });

    it('should produce equal width and height since both come from diameter', function ()
    {
        var result = GetBounds(circle);

        expect(result.width).toBe(result.height);
    });
});
