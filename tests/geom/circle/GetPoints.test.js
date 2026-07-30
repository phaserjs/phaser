var GetPoints = require('../../../src/geom/circle/GetPoints');

describe('Phaser.Geom.Circle.GetPoints', function ()
{
    var circle;

    beforeEach(function ()
    {
        circle = { x: 0, y: 0, radius: 100 };
    });

    it('should return an empty array when quantity is zero and no stepRate is given', function ()
    {
        var result = GetPoints(circle, 0);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return the correct number of points for a given quantity', function ()
    {
        var result = GetPoints(circle, 4);

        expect(result.length).toBe(4);
    });

    it('should return Vector2-like objects with x and y properties', function ()
    {
        var result = GetPoints(circle, 4);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should return points on the circumference of the circle', function ()
    {
        var result = GetPoints(circle, 8);

        for (var i = 0; i < result.length; i++)
        {
            var dist = Math.sqrt(result[i].x * result[i].x + result[i].y * result[i].y);

            expect(dist).toBeCloseTo(circle.radius, 5);
        }
    });

    it('should derive quantity from stepRate when quantity is falsy', function ()
    {
        var circumference = 2 * Math.PI * circle.radius;
        var stepRate = circumference / 8;
        var result = GetPoints(circle, 0, stepRate);

        expect(result.length).toBeCloseTo(8, 0);
    });

    it('should derive quantity from stepRate when quantity is null', function ()
    {
        var circumference = 2 * Math.PI * circle.radius;
        var stepRate = circumference / 4;
        var result = GetPoints(circle, null, stepRate);

        expect(result.length).toBeCloseTo(4, 0);
    });

    it('should derive quantity from stepRate when quantity is undefined', function ()
    {
        var circumference = 2 * Math.PI * circle.radius;
        var stepRate = circumference / 6;
        var result = GetPoints(circle, undefined, stepRate);

        expect(result.length).toBeCloseTo(6, 0);
    });

    it('should use the provided out array', function ()
    {
        var out = [];
        var result = GetPoints(circle, 4, undefined, out);

        expect(result).toBe(out);
        expect(out.length).toBe(4);
    });

    it('should append points to an existing out array', function ()
    {
        var out = [{ x: 999, y: 999 }];
        var result = GetPoints(circle, 4, undefined, out);

        expect(result.length).toBe(5);
        expect(result[0].x).toBe(999);
    });

    it('should return a new array when no out array is provided', function ()
    {
        var result = GetPoints(circle, 4);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should distribute points evenly around the full circle', function ()
    {
        var result = GetPoints(circle, 4);

        // For a circle centred at 0,0 with radius 100, 4 evenly spaced points
        // should be at angles 0, PI/2, PI, 3PI/2 (TAU = 2*PI, steps at 0, 0.25, 0.5, 0.75)
        expect(result[0].x).toBeCloseTo(100, 5);
        expect(result[0].y).toBeCloseTo(0, 5);

        expect(result[1].x).toBeCloseTo(0, 5);
        expect(result[1].y).toBeCloseTo(100, 5);

        expect(result[2].x).toBeCloseTo(-100, 5);
        expect(result[2].y).toBeCloseTo(0, 5);

        expect(result[3].x).toBeCloseTo(0, 5);
        expect(result[3].y).toBeCloseTo(-100, 5);
    });

    it('should work with a circle at a non-zero position', function ()
    {
        var offsetCircle = { x: 50, y: 75, radius: 10 };
        var result = GetPoints(offsetCircle, 4);

        for (var i = 0; i < result.length; i++)
        {
            var dx = result[i].x - offsetCircle.x;
            var dy = result[i].y - offsetCircle.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            expect(dist).toBeCloseTo(offsetCircle.radius, 5);
        }
    });

    it('should return 1 point when quantity is 1', function ()
    {
        var result = GetPoints(circle, 1);

        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(100, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
    });

    it('should not use stepRate when quantity is a truthy number', function ()
    {
        var result = GetPoints(circle, 4, 1);

        expect(result.length).toBe(4);
    });
});
