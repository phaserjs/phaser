var CircumferencePoint = require('../../../src/geom/ellipse/CircumferencePoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Ellipse.CircumferencePoint', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 50 };
    });

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var result = CircumferencePoint(ellipse, 0);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var out = new Vector2();
        var result = CircumferencePoint(ellipse, 0, out);

        expect(result).toBe(out);
    });

    it('should calculate the point at angle 0 (rightmost point)', function ()
    {
        var result = CircumferencePoint(ellipse, 0);

        expect(result.x).toBeCloseTo(50, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should calculate the point at angle PI/2 (bottom point)', function ()
    {
        var result = CircumferencePoint(ellipse, Math.PI / 2);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(25, 5);
    });

    it('should calculate the point at angle PI (leftmost point)', function ()
    {
        var result = CircumferencePoint(ellipse, Math.PI);

        expect(result.x).toBeCloseTo(-50, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should calculate the point at angle 3*PI/2 (top point)', function ()
    {
        var result = CircumferencePoint(ellipse, 3 * Math.PI / 2);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(-25, 5);
    });

    it('should account for ellipse x and y offset', function ()
    {
        ellipse.x = 100;
        ellipse.y = 200;

        var result = CircumferencePoint(ellipse, 0);

        expect(result.x).toBeCloseTo(150, 5);
        expect(result.y).toBeCloseTo(200, 5);
    });

    it('should account for negative ellipse x and y offset', function ()
    {
        ellipse.x = -50;
        ellipse.y = -100;

        var result = CircumferencePoint(ellipse, Math.PI / 2);

        expect(result.x).toBeCloseTo(-50, 5);
        expect(result.y).toBeCloseTo(-75, 5);
    });

    it('should handle a circle (equal width and height)', function ()
    {
        ellipse.width = 100;
        ellipse.height = 100;

        var result = CircumferencePoint(ellipse, Math.PI / 4);

        expect(result.x).toBeCloseTo(50 * Math.cos(Math.PI / 4), 5);
        expect(result.y).toBeCloseTo(50 * Math.sin(Math.PI / 4), 5);
    });

    it('should handle zero dimensions', function ()
    {
        ellipse.width = 0;
        ellipse.height = 0;

        var result = CircumferencePoint(ellipse, Math.PI / 4);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should handle a negative angle', function ()
    {
        var result = CircumferencePoint(ellipse, -Math.PI / 2);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(-25, 5);
    });

    it('should handle angle 2*PI (full rotation, same as angle 0)', function ()
    {
        var result = CircumferencePoint(ellipse, 2 * Math.PI);

        expect(result.x).toBeCloseTo(50, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should store results in the provided plain object with x and y', function ()
    {
        var out = { x: 0, y: 0 };
        var result = CircumferencePoint(ellipse, 0, out);

        expect(result).toBe(out);
        expect(out.x).toBeCloseTo(50, 5);
        expect(out.y).toBeCloseTo(0, 5);
    });

    it('should use half-width and half-height for radius calculations', function ()
    {
        ellipse.width = 200;
        ellipse.height = 80;

        var result = CircumferencePoint(ellipse, 0);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should handle floating point angles', function ()
    {
        var angle = 1.2345;
        var result = CircumferencePoint(ellipse, angle);

        expect(result.x).toBeCloseTo(ellipse.x + 50 * Math.cos(angle), 5);
        expect(result.y).toBeCloseTo(ellipse.y + 25 * Math.sin(angle), 5);
    });
});
