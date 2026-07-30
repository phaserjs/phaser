var GetCentroid = require('../../src/math/GetCentroid');
var Vector2 = require('../../src/math/Vector2');

describe('Phaser.Math.GetCentroid', function ()
{
    it('should return a Vector2 instance when no out is provided', function ()
    {
        var result = GetCentroid([{ x: 0, y: 0 }]);
        expect(result).toBeInstanceOf(Vector2);
    });

    it('should use the provided out object', function ()
    {
        var out = new Vector2();
        var result = GetCentroid([{ x: 4, y: 6 }], out);
        expect(result).toBe(out);
    });

    it('should return the single point when given one point', function ()
    {
        var result = GetCentroid([{ x: 3, y: 7 }]);
        expect(result.x).toBe(3);
        expect(result.y).toBe(7);
    });

    it('should return the midpoint of two points', function ()
    {
        var result = GetCentroid([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
    });

    it('should return the centroid of three points forming a triangle', function ()
    {
        var result = GetCentroid([{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 3, y: 6 }]);
        expect(result.x).toBe(3);
        expect(result.y).toBe(2);
    });

    it('should return the centroid of four points forming a square', function ()
    {
        var result = GetCentroid([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }]);
        expect(result.x).toBe(2);
        expect(result.y).toBe(2);
    });

    it('should handle negative coordinates', function ()
    {
        var result = GetCentroid([{ x: -4, y: -4 }, { x: 4, y: 4 }]);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle floating point coordinates', function ()
    {
        var result = GetCentroid([{ x: 1.5, y: 2.5 }, { x: 2.5, y: 3.5 }]);
        expect(result.x).toBeCloseTo(2);
        expect(result.y).toBeCloseTo(3);
    });

    it('should handle all points at the same location', function ()
    {
        var result = GetCentroid([{ x: 5, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 5 }]);
        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
    });

    it('should handle points at the origin', function ()
    {
        var result = GetCentroid([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should accumulate into the out object x and y', function ()
    {
        var out = new Vector2(0, 0);
        GetCentroid([{ x: 2, y: 4 }, { x: 8, y: 10 }], out);
        expect(out.x).toBe(5);
        expect(out.y).toBe(7);
    });

    it('should throw when passed an empty array', function ()
    {
        expect(function () { GetCentroid([]); }).toThrow();
    });

    it('should throw when passed a non-array', function ()
    {
        expect(function () { GetCentroid('not an array'); }).toThrow();
        expect(function () { GetCentroid(null); }).toThrow();
        expect(function () { GetCentroid(42); }).toThrow();
    });

    it('should handle large numbers of points', function ()
    {
        var points = [];
        for (var i = 0; i < 100; i++)
        {
            points.push({ x: i, y: i });
        }
        var result = GetCentroid(points);
        expect(result.x).toBeCloseTo(49.5);
        expect(result.y).toBeCloseTo(49.5);
    });

    it('should handle large coordinate values', function ()
    {
        var result = GetCentroid([{ x: 1000000, y: 2000000 }, { x: 3000000, y: 4000000 }]);
        expect(result.x).toBe(2000000);
        expect(result.y).toBe(3000000);
    });
});
