var GetPoints = require('../../../src/geom/polygon/GetPoints');

describe('Phaser.Geom.Polygon.GetPoints', function ()
{
    function makeSquare (size)
    {
        size = size || 100;
        return {
            points: [
                { x: 0, y: 0 },
                { x: size, y: 0 },
                { x: size, y: size },
                { x: 0, y: size }
            ]
        };
    }

    it('should return an empty array when quantity is zero', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 0);
        expect(result).toEqual([]);
    });

    it('should return the correct number of points', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 4);
        expect(result.length).toBe(4);
    });

    it('should return a new array when no output array is provided', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 4);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should append to the provided output array', function ()
    {
        var polygon = makeSquare(100);
        var out = [];
        var result = GetPoints(polygon, 4, undefined, out);
        expect(result).toBe(out);
        expect(out.length).toBe(4);
    });

    it('should calculate quantity from stepRate when quantity is falsy', function ()
    {
        var polygon = makeSquare(100);
        // perimeter = 400, stepRate = 100 → quantity = 4
        var result = GetPoints(polygon, 0, 100);
        expect(result.length).toBe(4);
    });

    it('should calculate quantity from stepRate when quantity is null', function ()
    {
        var polygon = makeSquare(100);
        // perimeter = 400, stepRate = 50 → quantity = 8
        var result = GetPoints(polygon, null, 50);
        expect(result.length).toBe(8);
    });

    it('should not use stepRate when quantity is a truthy value', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 2, 50);
        expect(result.length).toBe(2);
    });

    it('should ignore stepRate when it is zero or negative', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 0, 0);
        expect(result.length).toBe(0);
    });

    it('should return points with x and y numeric properties', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 4);
        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should return the first point at the start of the perimeter', function ()
    {
        var polygon = makeSquare(100);
        // quantity = 1, position = 0 → should be at (0, 0)
        var result = GetPoints(polygon, 1);
        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
    });

    it('should distribute points evenly around a square perimeter', function ()
    {
        var polygon = makeSquare(100);
        // 4 points on a 100x100 square: (0,0), (100,0), (100,100), (0,100)
        var result = GetPoints(polygon, 4);
        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
        expect(result[1].x).toBeCloseTo(100, 5);
        expect(result[1].y).toBeCloseTo(0, 5);
        expect(result[2].x).toBeCloseTo(100, 5);
        expect(result[2].y).toBeCloseTo(100, 5);
        expect(result[3].x).toBeCloseTo(0, 5);
        expect(result[3].y).toBeCloseTo(100, 5);
    });

    it('should return midpoints correctly with 8 points on a square', function ()
    {
        var polygon = makeSquare(100);
        // perimeter = 400, step = 50, 8 points
        var result = GetPoints(polygon, 8);
        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
        // second point should be at midpoint of top edge
        expect(result[1].x).toBeCloseTo(50, 5);
        expect(result[1].y).toBeCloseTo(0, 5);
    });

    it('should work with a triangle', function ()
    {
        var triangle = {
            points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 50, y: 100 }
            ]
        };
        var result = GetPoints(triangle, 3);
        expect(result.length).toBe(3);
        for (var i = 0; i < result.length; i++)
        {
            expect(typeof result[i].x).toBe('number');
            expect(typeof result[i].y).toBe('number');
        }
    });

    it('should work with a large quantity of points', function ()
    {
        var polygon = makeSquare(100);
        var result = GetPoints(polygon, 100);
        expect(result.length).toBe(100);
    });

    it('should not modify the provided output array beyond appending', function ()
    {
        var polygon = makeSquare(100);
        var out = [ { x: 999, y: 999 } ];
        GetPoints(polygon, 4, undefined, out);
        expect(out.length).toBe(5);
        expect(out[0].x).toBe(999);
        expect(out[0].y).toBe(999);
    });

    it('should handle a degenerate polygon with two points', function ()
    {
        var line = {
            points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 }
            ]
        };
        var result = GetPoints(line, 2);
        expect(result.length).toBe(2);
    });

    it('should return points on the perimeter boundary for edge fractions', function ()
    {
        var polygon = makeSquare(100);
        // 2 points: positions at 0 and 0.5 * 400 = 200 along perimeter
        var result = GetPoints(polygon, 2);
        // position 0 → (0,0)
        expect(result[0].x).toBeCloseTo(0, 5);
        expect(result[0].y).toBeCloseTo(0, 5);
        // position 200 → halfway around square: top edge (100) + right edge (100) = (100,100)
        expect(result[1].x).toBeCloseTo(100, 5);
        expect(result[1].y).toBeCloseTo(100, 5);
    });
});
