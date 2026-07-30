var GetEasedPoints = require('../../../src/geom/line/GetEasedPoints');

describe('Phaser.Geom.Line.GetEasedPoints', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 100, y2: 0 };
    });

    it('should return an array', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the correct number of points', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5);

        expect(result.length).toBe(5);
    });

    it('should return Vector2 objects', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 4);

        expect(typeof result[0].x).toBe('number');
        expect(typeof result[0].y).toBe('number');
    });

    it('should start at the line start point with linear ease', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
    });

    it('should end at the line end point with linear ease', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5);

        expect(result[result.length - 1].x).toBeCloseTo(100);
        expect(result[result.length - 1].y).toBeCloseTo(0);
    });

    it('should distribute points linearly along a horizontal line', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[1].x).toBeCloseTo(25);
        expect(result[2].x).toBeCloseTo(50);
        expect(result[3].x).toBeCloseTo(75);
        expect(result[4].x).toBeCloseTo(100);
    });

    it('should work with a diagonal line', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 100, y2: 100 };
        var result = GetEasedPoints(diagLine, 'Linear', 3);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
        expect(result[1].x).toBeCloseTo(50);
        expect(result[1].y).toBeCloseTo(50);
        expect(result[2].x).toBeCloseTo(100);
        expect(result[2].y).toBeCloseTo(100);
    });

    it('should work with a vertical line', function ()
    {
        var vertLine = { x1: 0, y1: 0, x2: 0, y2: 200 };
        var result = GetEasedPoints(vertLine, 'Linear', 3);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
        expect(result[1].x).toBeCloseTo(0);
        expect(result[1].y).toBeCloseTo(100);
        expect(result[2].x).toBeCloseTo(0);
        expect(result[2].y).toBeCloseTo(200);
    });

    it('should work with a line with negative coordinates', function ()
    {
        var negLine = { x1: -100, y1: -100, x2: 100, y2: 100 };
        var result = GetEasedPoints(negLine, 'Linear', 3);

        expect(result[0].x).toBeCloseTo(-100);
        expect(result[0].y).toBeCloseTo(-100);
        expect(result[1].x).toBeCloseTo(0);
        expect(result[1].y).toBeCloseTo(0);
        expect(result[2].x).toBeCloseTo(100);
        expect(result[2].y).toBeCloseTo(100);
    });

    it('should return a single point when quantity is 1', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 1);

        expect(result.length).toBe(1);
    });

    it('should return 2 points for quantity of 2', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 2);

        expect(result.length).toBe(2);
        expect(result[0].x).toBeCloseTo(0);
        expect(result[1].x).toBeCloseTo(100);
    });

    it('should accept a custom ease function', function ()
    {
        var customEase = function (v) { return v * v; };
        var result = GetEasedPoints(line, customEase, 3);

        expect(result.length).toBe(3);
        // With v^2 ease: at t=0 -> 0, at t=0.5 -> 0.25, at t=1 -> 1
        expect(result[0].x).toBeCloseTo(0);
        expect(result[1].x).toBeCloseTo(25);
        expect(result[2].x).toBeCloseTo(100);
    });

    it('should apply ease-in effect so points cluster at start', function ()
    {
        // Quad.in clusters at start — first half of points cover less distance
        var result = GetEasedPoints(line, 'Quad.in', 5);
        var firstGap = result[1].x - result[0].x;
        var lastGap = result[4].x - result[3].x;

        expect(firstGap).toBeLessThan(lastGap);
    });

    it('should apply ease-out effect so points cluster at end', function ()
    {
        // Quad.out clusters at end — last half of points cover less distance
        var result = GetEasedPoints(line, 'Quad.out', 5);
        var firstGap = result[1].x - result[0].x;
        var lastGap = result[4].x - result[3].x;

        expect(firstGap).toBeGreaterThan(lastGap);
    });

    it('should default collinearThreshold to 0 when not provided', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 10);

        expect(result.length).toBe(10);
    });

    it('should reduce points when collinearThreshold filters clustered points', function ()
    {
        // Use a large threshold to force many points to be removed
        var result = GetEasedPoints(line, 'Linear', 10, 50);

        expect(result.length).toBeLessThan(10);
    });

    it('should always include the end point when using collinearThreshold', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 10, 5);
        var last = result[result.length - 1];

        expect(last.x).toBeCloseTo(100);
        expect(last.y).toBeCloseTo(0);
    });

    it('should always include the start point when using collinearThreshold', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 10, 5);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
    });

    it('should return all points when collinearThreshold is 0', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 8, 0);

        expect(result.length).toBe(8);
    });

    it('should work with easeParams array', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5, 0, []);

        expect(result.length).toBe(5);
    });

    it('should not mutate the original line object', function ()
    {
        var originalX1 = line.x1;
        var originalY1 = line.y1;
        var originalX2 = line.x2;
        var originalY2 = line.y2;

        GetEasedPoints(line, 'Linear', 5);

        expect(line.x1).toBe(originalX1);
        expect(line.y1).toBe(originalY1);
        expect(line.x2).toBe(originalX2);
        expect(line.y2).toBe(originalY2);
    });

    it('should return points with y values along a non-horizontal line', function ()
    {
        var slopedLine = { x1: 0, y1: 0, x2: 0, y2: 100 };
        var result = GetEasedPoints(slopedLine, 'Linear', 5);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBeCloseTo(0);
        }

        expect(result[0].y).toBeCloseTo(0);
        expect(result[4].y).toBeCloseTo(100);
    });

    it('should handle a zero-length line', function ()
    {
        var zeroLine = { x1: 50, y1: 50, x2: 50, y2: 50 };
        var result = GetEasedPoints(zeroLine, 'Linear', 5);

        expect(result.length).toBe(5);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBeCloseTo(50);
            expect(result[i].y).toBeCloseTo(50);
        }
    });

    it('should work with Sine ease', function ()
    {
        var result = GetEasedPoints(line, 'Sine.out', 5);

        expect(result.length).toBe(5);
        expect(result[0].x).toBeCloseTo(0);
        expect(result[result.length - 1].x).toBeCloseTo(100);
    });

    it('should work with large quantity values', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 100);

        expect(result.length).toBe(100);
        expect(result[0].x).toBeCloseTo(0);
        expect(result[99].x).toBeCloseTo(100);
    });

    it('should produce points strictly between start and end for linear ease', function ()
    {
        var result = GetEasedPoints(line, 'Linear', 5);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBeGreaterThanOrEqual(0);
            expect(result[i].x).toBeLessThanOrEqual(100);
        }
    });
});
