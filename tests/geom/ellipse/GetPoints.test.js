var GetPoints = require('../../../src/geom/ellipse/GetPoints');
var Circumference = require('../../../src/geom/ellipse/Circumference');

describe('Phaser.Geom.Ellipse.GetPoints', function ()
{
    var ellipse;

    beforeEach(function ()
    {
        ellipse = { x: 0, y: 0, width: 100, height: 100 };
    });

    it('should return an empty array when quantity is zero and stepRate is not set', function ()
    {
        var result = GetPoints(ellipse, 0);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return the correct number of points for a given quantity', function ()
    {
        var result = GetPoints(ellipse, 8);

        expect(result.length).toBe(8);
    });

    it('should return Vector2-like objects with x and y properties', function ()
    {
        var result = GetPoints(ellipse, 4);

        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should derive quantity from stepRate when quantity is falsy', function ()
    {
        var circumference = Circumference(ellipse);
        var stepRate = 10;
        var expectedQuantity = Math.ceil(circumference / stepRate);

        var result = GetPoints(ellipse, 0, stepRate);

        expect(result.length).toBe(expectedQuantity);
    });

    it('should use quantity over stepRate when quantity is truthy', function ()
    {
        var result = GetPoints(ellipse, 5, 1);

        expect(result.length).toBe(5);
    });

    it('should use a provided output array', function ()
    {
        var out = [];
        var result = GetPoints(ellipse, 4, 0, out);

        expect(result).toBe(out);
        expect(out.length).toBe(4);
    });

    it('should append to an existing output array', function ()
    {
        var out = [];
        var fakeVec = { x: 999, y: 999 };
        out.push(fakeVec);

        GetPoints(ellipse, 3, 0, out);

        expect(out.length).toBe(4);
        expect(out[0]).toBe(fakeVec);
    });

    it('should create a new array when out is not provided', function ()
    {
        var result = GetPoints(ellipse, 4);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(4);
    });

    it('should place points on the circumference of a circle', function ()
    {
        var radius = 50;
        var circle = { x: 0, y: 0, width: radius * 2, height: radius * 2 };
        var result = GetPoints(circle, 8);

        for (var i = 0; i < result.length; i++)
        {
            var dist = Math.sqrt(result[i].x * result[i].x + result[i].y * result[i].y);
            expect(dist).toBeCloseTo(radius, 5);
        }
    });

    it('should start at angle 0 (rightmost point) for the first point', function ()
    {
        var result = GetPoints(ellipse, 4);

        // i=0: angle = FromPercent(0/4, 0, TAU) = 0
        // cos(0) = 1, sin(0) = 0 => x = ellipse.x + halfWidth, y = ellipse.y
        expect(result[0].x).toBeCloseTo(ellipse.x + ellipse.width / 2, 5);
        expect(result[0].y).toBeCloseTo(ellipse.y, 5);
    });

    it('should distribute points evenly around a circle', function ()
    {
        var circle = { x: 0, y: 0, width: 200, height: 200 };
        var quantity = 4;
        var result = GetPoints(circle, quantity);

        // For a circle with 4 points, angles should be 0, PI/2, PI, 3PI/2
        expect(result[0].x).toBeCloseTo(100, 5);
        expect(result[0].y).toBeCloseTo(0, 5);

        expect(result[1].x).toBeCloseTo(0, 5);
        expect(result[1].y).toBeCloseTo(100, 5);

        expect(result[2].x).toBeCloseTo(-100, 5);
        expect(result[2].y).toBeCloseTo(0, 5);

        expect(result[3].x).toBeCloseTo(0, 5);
        expect(result[3].y).toBeCloseTo(-100, 5);
    });

    it('should respect ellipse x and y offset', function ()
    {
        var offsetEllipse = { x: 50, y: 75, width: 100, height: 100 };
        var result = GetPoints(offsetEllipse, 4);

        // First point at angle 0: x = 50 + 50 = 100, y = 75
        expect(result[0].x).toBeCloseTo(100, 5);
        expect(result[0].y).toBeCloseTo(75, 5);
    });

    it('should handle non-circular (stretched) ellipse correctly', function ()
    {
        var stretched = { x: 0, y: 0, width: 200, height: 100 };
        var result = GetPoints(stretched, 4);

        // At angle 0: x = halfWidth = 100, y = 0
        expect(result[0].x).toBeCloseTo(100, 5);
        expect(result[0].y).toBeCloseTo(0, 5);

        // At angle PI/2: x = 0, y = halfHeight = 50
        expect(result[1].x).toBeCloseTo(0, 5);
        expect(result[1].y).toBeCloseTo(50, 5);
    });

    it('should return an empty array when quantity is null and stepRate is not positive', function ()
    {
        var result = GetPoints(ellipse, null, 0);

        expect(result.length).toBe(0);
    });

    it('should return an empty array when quantity is undefined and stepRate is not provided', function ()
    {
        var result = GetPoints(ellipse, undefined);

        expect(result.length).toBe(0);
    });

    it('should handle large quantities without error', function ()
    {
        var result = GetPoints(ellipse, 360);

        expect(result.length).toBe(360);
    });

    it('should return 1 point when quantity is 1', function ()
    {
        var result = GetPoints(ellipse, 1);

        expect(result.length).toBe(1);
        // Only point at i=0, angle=0
        expect(result[0].x).toBeCloseTo(ellipse.x + ellipse.width / 2, 5);
        expect(result[0].y).toBeCloseTo(ellipse.y, 5);
    });

    it('should derive quantity from stepRate when quantity is false', function ()
    {
        var circumference = Circumference(ellipse);
        var stepRate = 5;
        var expectedQuantity = Math.ceil(circumference / stepRate);

        var result = GetPoints(ellipse, false, stepRate);

        expect(result.length).toBe(expectedQuantity);
    });
});
