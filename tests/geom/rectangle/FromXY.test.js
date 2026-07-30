var FromXY = require('../../../src/geom/rectangle/FromXY');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Rectangle.FromXY', function ()
{
    it('should return a new Rectangle when no out is provided', function ()
    {
        var result = FromXY(0, 0, 10, 10);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should use the provided out Rectangle', function ()
    {
        var out = new Rectangle();
        var result = FromXY(0, 0, 10, 10, out);

        expect(result).toBe(out);
    });

    it('should set x to the minimum of x1 and x2 when x1 < x2', function ()
    {
        var result = FromXY(2, 0, 8, 0);

        expect(result.x).toBe(2);
    });

    it('should set x to the minimum of x1 and x2 when x2 < x1', function ()
    {
        var result = FromXY(8, 0, 2, 0);

        expect(result.x).toBe(2);
    });

    it('should set y to the minimum of y1 and y2 when y1 < y2', function ()
    {
        var result = FromXY(0, 3, 0, 9);

        expect(result.y).toBe(3);
    });

    it('should set y to the minimum of y1 and y2 when y2 < y1', function ()
    {
        var result = FromXY(0, 9, 0, 3);

        expect(result.y).toBe(3);
    });

    it('should set width to the absolute difference of x1 and x2', function ()
    {
        var result = FromXY(2, 0, 8, 0);

        expect(result.width).toBe(6);
    });

    it('should set height to the absolute difference of y1 and y2', function ()
    {
        var result = FromXY(0, 3, 0, 9);

        expect(result.height).toBe(6);
    });

    it('should produce the same result regardless of point order', function ()
    {
        var r1 = FromXY(2, 3, 8, 9);
        var r2 = FromXY(8, 9, 2, 3);

        expect(r1.x).toBe(r2.x);
        expect(r1.y).toBe(r2.y);
        expect(r1.width).toBe(r2.width);
        expect(r1.height).toBe(r2.height);
    });

    it('should return zero width and height when both points are the same', function ()
    {
        var result = FromXY(5, 5, 5, 5);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should work with negative coordinates', function ()
    {
        var result = FromXY(-10, -20, -2, -5);

        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
        expect(result.width).toBe(8);
        expect(result.height).toBe(15);
    });

    it('should work when coordinates span negative and positive values', function ()
    {
        var result = FromXY(-5, -5, 5, 5);

        expect(result.x).toBe(-5);
        expect(result.y).toBe(-5);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
    });

    it('should work with floating point coordinates', function ()
    {
        var result = FromXY(1.5, 2.5, 4.5, 6.5);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(2.5);
        expect(result.width).toBeCloseTo(3);
        expect(result.height).toBeCloseTo(4);
    });

    it('should work when x1 equals x2 (zero width)', function ()
    {
        var result = FromXY(5, 0, 5, 10);

        expect(result.x).toBe(5);
        expect(result.width).toBe(0);
        expect(result.height).toBe(10);
    });

    it('should work when y1 equals y2 (zero height)', function ()
    {
        var result = FromXY(0, 7, 10, 7);

        expect(result.y).toBe(7);
        expect(result.height).toBe(0);
        expect(result.width).toBe(10);
    });

    it('should modify the out Rectangle in place', function ()
    {
        var out = new Rectangle(100, 100, 100, 100);

        FromXY(1, 2, 3, 4, out);

        expect(out.x).toBe(1);
        expect(out.y).toBe(2);
        expect(out.width).toBe(2);
        expect(out.height).toBe(2);
    });
});
