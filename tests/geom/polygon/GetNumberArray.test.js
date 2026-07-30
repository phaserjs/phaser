var GetNumberArray = require('../../../src/geom/polygon/GetNumberArray');

describe('Phaser.Geom.Polygon.GetNumberArray', function ()
{
    it('should return an empty array for a polygon with no points', function ()
    {
        var polygon = { points: [] };
        var result = GetNumberArray(polygon);

        expect(result).toEqual([]);
    });

    it('should return a new array if no output is provided', function ()
    {
        var polygon = { points: [] };
        var result = GetNumberArray(polygon);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the provided output array', function ()
    {
        var polygon = { points: [] };
        var output = [];
        var result = GetNumberArray(polygon, output);

        expect(result).toBe(output);
    });

    it('should flatten a single point into two elements', function ()
    {
        var polygon = { points: [{ x: 3, y: 7 }] };
        var result = GetNumberArray(polygon);

        expect(result).toEqual([3, 7]);
    });

    it('should flatten multiple points into a flat x,y sequence', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 10, y: 20 },
                { x: 30, y: 40 }
            ]
        };
        var result = GetNumberArray(polygon);

        expect(result).toEqual([0, 0, 10, 20, 30, 40]);
    });

    it('should append to an existing output array', function ()
    {
        var polygon = {
            points: [
                { x: 5, y: 10 },
                { x: 15, y: 20 }
            ]
        };
        var output = [1, 2];
        var result = GetNumberArray(polygon, output);

        expect(result).toEqual([1, 2, 5, 10, 15, 20]);
    });

    it('should handle negative coordinate values', function ()
    {
        var polygon = {
            points: [
                { x: -5, y: -10 },
                { x: -15, y: -20 }
            ]
        };
        var result = GetNumberArray(polygon);

        expect(result).toEqual([-5, -10, -15, -20]);
    });

    it('should handle floating point coordinate values', function ()
    {
        var polygon = {
            points: [
                { x: 1.5, y: 2.7 },
                { x: 3.14, y: 0.001 }
            ]
        };
        var result = GetNumberArray(polygon);

        expect(result[0]).toBeCloseTo(1.5);
        expect(result[1]).toBeCloseTo(2.7);
        expect(result[2]).toBeCloseTo(3.14);
        expect(result[3]).toBeCloseTo(0.001);
    });

    it('should produce an array of length twice the number of points', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
            ]
        };
        var result = GetNumberArray(polygon);

        expect(result.length).toBe(polygon.points.length * 2);
    });

    it('should preserve point order in the output', function ()
    {
        var polygon = {
            points: [
                { x: 100, y: 200 },
                { x: 300, y: 400 },
                { x: 500, y: 600 }
            ]
        };
        var result = GetNumberArray(polygon);

        expect(result[0]).toBe(100);
        expect(result[1]).toBe(200);
        expect(result[2]).toBe(300);
        expect(result[3]).toBe(400);
        expect(result[4]).toBe(500);
        expect(result[5]).toBe(600);
    });

    it('should handle zero coordinates', function ()
    {
        var polygon = {
            points: [
                { x: 0, y: 0 }
            ]
        };
        var result = GetNumberArray(polygon);

        expect(result).toEqual([0, 0]);
    });
});
