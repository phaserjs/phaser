var GetBounds = require('../../../src/geom/ellipse/GetBounds');
var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Ellipse.GetBounds', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = {
            left: 10,
            top: 20,
            width: 100,
            height: 50
        };
    });

    it('should return a Rectangle when no out parameter is given', function ()
    {
        var result = GetBounds(ellipse);

        expect(result).toBeInstanceOf(Rectangle);
    });

    it('should set x to ellipse.left', function ()
    {
        var result = GetBounds(ellipse);

        expect(result.x).toBe(10);
    });

    it('should set y to ellipse.top', function ()
    {
        var result = GetBounds(ellipse);

        expect(result.y).toBe(20);
    });

    it('should set width to ellipse.width', function ()
    {
        var result = GetBounds(ellipse);

        expect(result.width).toBe(100);
    });

    it('should set height to ellipse.height', function ()
    {
        var result = GetBounds(ellipse);

        expect(result.height).toBe(50);
    });

    it('should return the provided out object', function ()
    {
        var out = new Rectangle();
        var result = GetBounds(ellipse, out);

        expect(result).toBe(out);
    });

    it('should populate a provided Rectangle with correct values', function ()
    {
        var out = new Rectangle();
        GetBounds(ellipse, out);

        expect(out.x).toBe(10);
        expect(out.y).toBe(20);
        expect(out.width).toBe(100);
        expect(out.height).toBe(50);
    });

    it('should populate a plain object with correct values', function ()
    {
        var out = { x: 0, y: 0, width: 0, height: 0 };
        GetBounds(ellipse, out);

        expect(out.x).toBe(10);
        expect(out.y).toBe(20);
        expect(out.width).toBe(100);
        expect(out.height).toBe(50);
    });

    it('should return the plain object when provided as out', function ()
    {
        var out = { x: 0, y: 0, width: 0, height: 0 };
        var result = GetBounds(ellipse, out);

        expect(result).toBe(out);
    });

    it('should handle an ellipse at the origin with zero dimensions', function ()
    {
        var zeroEllipse = { left: 0, top: 0, width: 0, height: 0 };
        var result = GetBounds(zeroEllipse);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });

    it('should handle negative position values', function ()
    {
        var negEllipse = { left: -50, top: -30, width: 80, height: 40 };
        var result = GetBounds(negEllipse);

        expect(result.x).toBe(-50);
        expect(result.y).toBe(-30);
        expect(result.width).toBe(80);
        expect(result.height).toBe(40);
    });

    it('should handle floating point values', function ()
    {
        var floatEllipse = { left: 1.5, top: 2.7, width: 3.3, height: 4.9 };
        var result = GetBounds(floatEllipse);

        expect(result.x).toBeCloseTo(1.5);
        expect(result.y).toBeCloseTo(2.7);
        expect(result.width).toBeCloseTo(3.3);
        expect(result.height).toBeCloseTo(4.9);
    });

    it('should overwrite existing values in the out object', function ()
    {
        var out = new Rectangle(999, 999, 999, 999);
        GetBounds(ellipse, out);

        expect(out.x).toBe(10);
        expect(out.y).toBe(20);
        expect(out.width).toBe(100);
        expect(out.height).toBe(50);
    });
});
