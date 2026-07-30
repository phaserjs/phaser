var GetPoint = require('../../../src/geom/circle/GetPoint');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Circle.GetPoint', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 100 };
    });

    it('should return a Vector2 instance when no out parameter is given', function ()
    {
        var result = GetPoint(circle, 0);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the provided out object', function ()
    {
        var out = new Vector2();
        var result = GetPoint(circle, 0, out);

        expect(result).toBe(out);
    });

    it('should return a point on the right side of the circle at position 0', function ()
    {
        var result = GetPoint(circle, 0);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return a point on the bottom of the circle at position 0.25', function ()
    {
        var result = GetPoint(circle, 0.25);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(100, 5);
    });

    it('should return a point on the left side of the circle at position 0.5', function ()
    {
        var result = GetPoint(circle, 0.5);

        expect(result.x).toBeCloseTo(-100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should return a point on the top of the circle at position 0.75', function ()
    {
        var result = GetPoint(circle, 0.75);

        expect(result.x).toBeCloseTo(0, 5);
        expect(result.y).toBeCloseTo(-100, 5);
    });

    it('should return a point close to start at position 1', function ()
    {
        var result = GetPoint(circle, 1);

        expect(result.x).toBeCloseTo(100, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should clamp position below 0 to 0', function ()
    {
        var atZero = GetPoint(circle, 0);
        var belowZero = GetPoint(circle, -0.5);

        expect(belowZero.x).toBeCloseTo(atZero.x, 5);
        expect(belowZero.y).toBeCloseTo(atZero.y, 5);
    });

    it('should clamp position above 1 to 1', function ()
    {
        var atOne = GetPoint(circle, 1);
        var aboveOne = GetPoint(circle, 1.5);

        expect(aboveOne.x).toBeCloseTo(atOne.x, 5);
        expect(aboveOne.y).toBeCloseTo(atOne.y, 5);
    });

    it('should use the circle center offset correctly', function ()
    {
        var offsetCircle = { x: 50, y: 75, radius: 100 };
        var result = GetPoint(offsetCircle, 0);

        expect(result.x).toBeCloseTo(150, 5);
        expect(result.y).toBeCloseTo(75, 5);
    });

    it('should use the circle radius correctly', function ()
    {
        var smallCircle = { x: 0, y: 0, radius: 25 };
        var result = GetPoint(smallCircle, 0);

        expect(result.x).toBeCloseTo(25, 5);
        expect(result.y).toBeCloseTo(0, 5);
    });

    it('should place the point at the correct distance from center', function ()
    {
        var result = GetPoint(circle, 0.33);
        var dx = result.x - circle.x;
        var dy = result.y - circle.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        expect(dist).toBeCloseTo(100, 5);
    });

    it('should work with a zero-radius circle', function ()
    {
        var zeroCircle = { x: 10, y: 20, radius: 0 };
        var result = GetPoint(zeroCircle, 0.5);

        expect(result.x).toBeCloseTo(10, 5);
        expect(result.y).toBeCloseTo(20, 5);
    });

    it('should write results into a plain object with x and y properties', function ()
    {
        var out = { x: 0, y: 0 };
        var result = GetPoint(circle, 0, out);

        expect(result).toBe(out);
        expect(out.x).toBeCloseTo(100, 5);
        expect(out.y).toBeCloseTo(0, 5);
    });
});
