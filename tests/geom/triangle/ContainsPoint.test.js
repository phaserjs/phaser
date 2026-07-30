var ContainsPoint = require('../../../src/geom/triangle/ContainsPoint');

describe('Phaser.Geom.Triangle.ContainsPoint', function ()
{
    var triangle;

    beforeEach(function ()
    {
        // A simple right triangle with vertices at (0,0), (100,0), (0,100)
        triangle = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 0, y3: 100 };
    });

    it('should return true for a point clearly inside the triangle', function ()
    {
        var vec = { x: 10, y: 10 };
        expect(ContainsPoint(triangle, vec)).toBe(true);
    });

    it('should return false for a point clearly outside the triangle', function ()
    {
        var vec = { x: 200, y: 200 };
        expect(ContainsPoint(triangle, vec)).toBe(false);
    });

    it('should return false for a point on the opposite side of the hypotenuse', function ()
    {
        var vec = { x: 80, y: 80 };
        expect(ContainsPoint(triangle, vec)).toBe(false);
    });

    it('should return true for a point near the centroid', function ()
    {
        var vec = { x: 33, y: 33 };
        expect(ContainsPoint(triangle, vec)).toBe(true);
    });

    it('should return false for a point with negative coordinates', function ()
    {
        var vec = { x: -10, y: -10 };
        expect(ContainsPoint(triangle, vec)).toBe(false);
    });

    it('should return false for a point far outside on the x axis', function ()
    {
        var vec = { x: 200, y: 0 };
        expect(ContainsPoint(triangle, vec)).toBe(false);
    });

    it('should return false for a point far outside on the y axis', function ()
    {
        var vec = { x: 0, y: 200 };
        expect(ContainsPoint(triangle, vec)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var vec = { x: 10, y: 10 };
        expect(typeof ContainsPoint(triangle, vec)).toBe('boolean');
    });

    it('should work with a triangle in a different position', function ()
    {
        var t = { x1: 50, y1: 50, x2: 150, y2: 50, x3: 100, y3: 150 };
        var inside = { x: 100, y: 80 };
        var outside = { x: 10, y: 10 };
        expect(ContainsPoint(t, inside)).toBe(true);
        expect(ContainsPoint(t, outside)).toBe(false);
    });

    it('should handle floating point coordinates in the vector', function ()
    {
        var vec = { x: 10.5, y: 10.5 };
        expect(ContainsPoint(triangle, vec)).toBe(true);
    });

    it('should handle a point exactly at a vertex', function ()
    {
        var vec = { x: 0, y: 0 };
        expect(typeof ContainsPoint(triangle, vec)).toBe('boolean');
    });
});
