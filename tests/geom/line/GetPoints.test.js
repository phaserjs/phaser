var GetPoints = require('../../../src/geom/line/GetPoints');

describe('Phaser.Geom.Line.GetPoints', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 100, y2: 0 };
    });

    it('should return an empty array when quantity is zero and no stepRate is given', function ()
    {
        var result = GetPoints(line, 0);

        expect(result).toEqual([]);
    });

    it('should return an array with the correct number of points', function ()
    {
        var result = GetPoints(line, 5);

        expect(result.length).toBe(5);
    });

    it('should start at the first endpoint (x1, y1)', function ()
    {
        var result = GetPoints(line, 4);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
    });

    it('should not include the last endpoint (x2, y2)', function ()
    {
        var result = GetPoints(line, 4);

        var last = result[result.length - 1];

        expect(last.x).not.toBeCloseTo(100);
    });

    it('should return evenly spaced points along a horizontal line', function ()
    {
        var result = GetPoints(line, 4);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[1].x).toBeCloseTo(25);
        expect(result[2].x).toBeCloseTo(50);
        expect(result[3].x).toBeCloseTo(75);
    });

    it('should return evenly spaced points along a vertical line', function ()
    {
        var vertLine = { x1: 0, y1: 0, x2: 0, y2: 100 };
        var result = GetPoints(vertLine, 4);

        expect(result[0].y).toBeCloseTo(0);
        expect(result[1].y).toBeCloseTo(25);
        expect(result[2].y).toBeCloseTo(50);
        expect(result[3].y).toBeCloseTo(75);
    });

    it('should return evenly spaced points along a diagonal line', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 100, y2: 100 };
        var result = GetPoints(diagLine, 5);

        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
        expect(result[2].x).toBeCloseTo(40);
        expect(result[2].y).toBeCloseTo(40);
        expect(result[4].x).toBeCloseTo(80);
        expect(result[4].y).toBeCloseTo(80);
    });

    it('should calculate quantity from stepRate when quantity is 0', function ()
    {
        // line length is 100, stepRate 25 => 4 points
        var result = GetPoints(line, 0, 25);

        expect(result.length).toBe(4);
    });

    it('should calculate quantity from stepRate when quantity is falsey', function ()
    {
        var result = GetPoints(line, null, 50);

        expect(result.length).toBe(2);
    });

    it('should ignore stepRate when quantity is non-zero', function ()
    {
        var result = GetPoints(line, 3, 10);

        expect(result.length).toBe(3);
    });

    it('should use the provided output array', function ()
    {
        var out = [];
        var result = GetPoints(line, 3, undefined, out);

        expect(result).toBe(out);
        expect(out.length).toBe(3);
    });

    it('should append to an existing output array', function ()
    {
        var out = [];
        GetPoints(line, 2, undefined, out);
        GetPoints(line, 2, undefined, out);

        expect(out.length).toBe(4);
    });

    it('should return Vector2 objects', function ()
    {
        var result = GetPoints(line, 3);

        expect(typeof result[0].x).toBe('number');
        expect(typeof result[0].y).toBe('number');
    });

    it('should return a single point at x1, y1 when quantity is 1', function ()
    {
        var result = GetPoints(line, 1);

        expect(result.length).toBe(1);
        expect(result[0].x).toBeCloseTo(0);
        expect(result[0].y).toBeCloseTo(0);
    });

    it('should work with negative coordinate lines', function ()
    {
        var negLine = { x1: -100, y1: -100, x2: 100, y2: 100 };
        var result = GetPoints(negLine, 4);

        expect(result[0].x).toBeCloseTo(-100);
        expect(result[0].y).toBeCloseTo(-100);
        expect(result[2].x).toBeCloseTo(0);
        expect(result[2].y).toBeCloseTo(0);
    });

    it('should work with a zero-length line', function ()
    {
        var zeroLine = { x1: 50, y1: 50, x2: 50, y2: 50 };
        var result = GetPoints(zeroLine, 3);

        expect(result.length).toBe(3);
        expect(result[0].x).toBeCloseTo(50);
        expect(result[0].y).toBeCloseTo(50);
        expect(result[1].x).toBeCloseTo(50);
        expect(result[2].x).toBeCloseTo(50);
    });

    it('should return an empty array when stepRate is zero and quantity is zero', function ()
    {
        var result = GetPoints(line, 0, 0);

        expect(result).toEqual([]);
    });

    it('should handle floating point quantity from stepRate', function ()
    {
        // line length 100, stepRate 30 => quantity = 3.333...
        // loop runs while i < 3.333, so i = 0, 1, 2, 3 => 4 points
        var result = GetPoints(line, 0, 30);

        expect(result.length).toBe(4);
    });
});
