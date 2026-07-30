var CircumferencePoint = require('../../../src/geom/circle/CircumferencePoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Circle.CircumferencePoint', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 1 };
    });

    it('should return a Vector2 when no out parameter is given', function ()
    {
        var result = CircumferencePoint(circle, 0);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var out = new Vector2();
        var result = CircumferencePoint(circle, 0, out);

        expect(result).toBe(out);
    });

    it('should return the rightmost point at angle 0', function ()
    {
        var result = CircumferencePoint(circle, 0);

        expect(result.x).toBeCloseTo(1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return the bottom point at angle PI/2', function ()
    {
        var result = CircumferencePoint(circle, Math.PI / 2);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(1);
    });

    it('should return the leftmost point at angle PI', function ()
    {
        var result = CircumferencePoint(circle, Math.PI);

        expect(result.x).toBeCloseTo(-1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return the top point at angle 3*PI/2', function ()
    {
        var result = CircumferencePoint(circle, 3 * Math.PI / 2);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(-1);
    });

    it('should account for circle x and y offsets', function ()
    {
        var offsetCircle = { x: 10, y: 20, radius: 5 };
        var result = CircumferencePoint(offsetCircle, 0);

        expect(result.x).toBeCloseTo(15);
        expect(result.y).toBeCloseTo(20);
    });

    it('should scale with circle radius', function ()
    {
        var largeCircle = { x: 0, y: 0, radius: 100 };
        var result = CircumferencePoint(largeCircle, 0);

        expect(result.x).toBeCloseTo(100);
        expect(result.y).toBeCloseTo(0);
    });

    it('should handle a zero radius circle', function ()
    {
        var zeroCircle = { x: 5, y: 5, radius: 0 };
        var result = CircumferencePoint(zeroCircle, Math.PI / 4);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(5);
    });

    it('should handle negative angles', function ()
    {
        var result = CircumferencePoint(circle, -Math.PI / 2);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(-1);
    });

    it('should handle a full rotation (2*PI) same as angle 0', function ()
    {
        var result = CircumferencePoint(circle, 2 * Math.PI);

        expect(result.x).toBeCloseTo(1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should write results into a plain object with x and y if provided', function ()
    {
        var out = { x: 0, y: 0 };
        var result = CircumferencePoint(circle, 0, out);

        expect(result).toBe(out);
        expect(out.x).toBeCloseTo(1);
        expect(out.y).toBeCloseTo(0);
    });

    it('should handle floating point angle values', function ()
    {
        var result = CircumferencePoint(circle, 1.234);

        expect(result.x).toBeCloseTo(Math.cos(1.234));
        expect(result.y).toBeCloseTo(Math.sin(1.234));
    });

    it('should combine offset circle with radius correctly at PI/4', function ()
    {
        var c = { x: 3, y: 4, radius: 10 };
        var result = CircumferencePoint(c, Math.PI / 4);

        expect(result.x).toBeCloseTo(3 + 10 * Math.cos(Math.PI / 4));
        expect(result.y).toBeCloseTo(4 + 10 * Math.sin(Math.PI / 4));
    });
});
