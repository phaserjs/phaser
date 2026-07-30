var GetPoint = require('../../../src/geom/ellipse/GetPoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Ellipse.GetPoint', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 50 };
    });

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var result = GetPoint(ellipse, 0);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var out = new Vector2();
        var result = GetPoint(ellipse, 0, out);

        expect(result).toBe(out);
    });

    it('should return the rightmost point at position 0', function ()
    {
        // position 0 => angle 0 => cos(0)=1, sin(0)=0
        var result = GetPoint(ellipse, 0);

        expect(result.x).toBeCloseTo(50, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return the leftmost point at position 0.5', function ()
    {
        // position 0.5 => angle PI => cos(PI)=-1, sin(PI)=0
        var result = GetPoint(ellipse, 0.5);

        expect(result.x).toBeCloseTo(-50, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return the bottom point at position 0.25', function ()
    {
        // position 0.25 => angle PI/2 => cos(PI/2)=0, sin(PI/2)=1
        var result = GetPoint(ellipse, 0.25);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(25, 5);
    });

    it('should return the top point at position 0.75', function ()
    {
        // position 0.75 => angle 3*PI/2 => cos=0, sin=-1
        var result = GetPoint(ellipse, 0.75);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(-25, 5);
    });

    it('should return approximately the rightmost point at position 1', function ()
    {
        // position 1 => angle TAU (2*PI) => same as 0
        var result = GetPoint(ellipse, 1);

        expect(result.x).toBeCloseTo(50, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should account for ellipse center offset', function ()
    {
        ellipse.x = 100;
        ellipse.y = 200;

        var result = GetPoint(ellipse, 0);

        expect(result.x).toBeCloseTo(150, 5);
        expect(result.y).toBeCloseTo(200, 5);
    });

    it('should account for ellipse center offset at position 0.5', function ()
    {
        ellipse.x = 100;
        ellipse.y = 200;

        var result = GetPoint(ellipse, 0.5);

        expect(result.x).toBeCloseTo(50, 5);
        expect(result.y).toBeCloseTo(200, 5);
    });

    it('should handle a circular ellipse (equal width and height)', function ()
    {
        ellipse.width = 100;
        ellipse.height = 100;

        var result0 = GetPoint(ellipse, 0);
        var result25 = GetPoint(ellipse, 0.25);

        expect(result0.x).toBeCloseTo(50, 5);
        expect(result0.y).toBeCloseTo(0, 5);
        expect(result25.x).toBeCloseTo(0, 5);
        expect(result25.y).toBeCloseTo(50, 5);
    });

    it('should handle a zero-size ellipse', function ()
    {
        ellipse.width = 0;
        ellipse.height = 0;

        var result = GetPoint(ellipse, 0.25);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should write results into the provided plain object with x/y properties', function ()
    {
        var out = new Vector2();
        GetPoint(ellipse, 0, out);

        expect(typeof out.x).toBe('number');
        expect(typeof out.y).toBe('number');
    });

    it('should handle negative ellipse center coordinates', function ()
    {
        ellipse.x = -100;
        ellipse.y = -50;

        var result = GetPoint(ellipse, 0);

        expect(result.x).toBeCloseTo(-50, 5);
        expect(result.y).toBeCloseTo(-50, 5);
    });

    it('should produce a point that lies on the ellipse boundary', function ()
    {
        ellipse.x = 0;
        ellipse.y = 0;
        ellipse.width = 200;
        ellipse.height = 100;

        var hw = ellipse.width / 2;
        var hh = ellipse.height / 2;

        // For any point (x, y) on ellipse: (x/hw)^2 + (y/hh)^2 === 1
        var positions = [ 0, 0.1, 0.25, 0.333, 0.5, 0.75, 0.9 ];

        for (var i = 0; i < positions.length; i++)
        {
            var p = GetPoint(ellipse, positions[i]);
            var check = (p.x / hw) * (p.x / hw) + (p.y / hh) * (p.y / hh);

            expect(check).toBeCloseTo(1, 5);
        }
    });
});
