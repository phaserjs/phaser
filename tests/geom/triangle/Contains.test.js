var Contains = require('../../../src/geom/triangle/Contains');

describe('Phaser.Geom.Triangle.Contains', function ()
{
    var triangle;

    beforeEach(function ()
    {
        // A simple right triangle with vertices at (0,0), (100,0), (0,100)
        triangle = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 0, y3: 100 };
    });

    it('should return true for a point clearly inside the triangle', function ()
    {
        expect(Contains(triangle, 10, 10)).toBe(true);
    });

    it('should return true for a point near the centroid', function ()
    {
        expect(Contains(triangle, 25, 25)).toBe(true);
    });

    it('should return false for a point clearly outside the triangle', function ()
    {
        expect(Contains(triangle, 90, 90)).toBe(false);
    });

    it('should return false for a point outside on the right side', function ()
    {
        expect(Contains(triangle, 200, 50)).toBe(false);
    });

    it('should return false for a point outside on the top side', function ()
    {
        expect(Contains(triangle, 50, 200)).toBe(false);
    });

    it('should return false for a point with negative coordinates', function ()
    {
        expect(Contains(triangle, -10, -10)).toBe(false);
    });

    it('should return true for origin vertex (barycentric u=0, v=0)', function ()
    {
        // At (0,0): v2=0 → u=0, v=0 → satisfies u>=0 && v>=0 && u+v<1
        expect(Contains(triangle, 0, 0)).toBe(true);
    });

    it('should return false for a point on the hypotenuse boundary', function ()
    {
        // Point on hypotenuse: (50, 50) satisfies x+y=100
        expect(Contains(triangle, 50, 50)).toBe(false);
    });

    it('should return true for a point just inside the hypotenuse', function ()
    {
        expect(Contains(triangle, 49, 49)).toBe(true);
    });

    it('should return false for a point just outside the hypotenuse', function ()
    {
        expect(Contains(triangle, 51, 51)).toBe(false);
    });

    it('should work with a triangle at non-origin position', function ()
    {
        var t = { x1: 100, y1: 100, x2: 200, y2: 100, x3: 100, y3: 200 };
        expect(Contains(t, 110, 110)).toBe(true);
        expect(Contains(t, 10, 10)).toBe(false);
    });

    it('should work with a triangle with negative coordinates', function ()
    {
        var t = { x1: -100, y1: -100, x2: 0, y2: -100, x3: -100, y3: 0 };
        expect(Contains(t, -90, -90)).toBe(true);
        expect(Contains(t, 10, 10)).toBe(false);
    });

    it('should return true for degenerate triangle (b=0 → inv=0 → u=0,v=0)', function ()
    {
        // Collinear points: b=0 → inv=0 → u=0, v=0 → condition is true
        var degenerate = { x1: 0, y1: 0, x2: 50, y2: 0, x3: 100, y3: 0 };
        expect(Contains(degenerate, 50, 0)).toBe(true);
        expect(Contains(degenerate, 25, 0)).toBe(true);
    });

    it('should return false for a point with x far to the right', function ()
    {
        expect(Contains(triangle, 1000, 1)).toBe(false);
    });

    it('should return false for a point with y far below', function ()
    {
        expect(Contains(triangle, 1, 1000)).toBe(false);
    });

    it('should work with floating point coordinates', function ()
    {
        var t = { x1: 0, y1: 0, x2: 1, y2: 0, x3: 0, y3: 1 };
        expect(Contains(t, 0.1, 0.1)).toBe(true);
        expect(Contains(t, 0.6, 0.6)).toBe(false);
    });

    it('should return true for a point near x1,y1 but inside', function ()
    {
        expect(Contains(triangle, 1, 1)).toBe(true);
    });

    it('should return false for a point at x2,y2 vertex', function ()
    {
        // Vertex (100, 0) — boundary
        expect(Contains(triangle, 100, 0)).toBe(false);
    });

    it('should return false for a point at x3,y3 vertex', function ()
    {
        // Vertex (0, 100) — boundary
        expect(Contains(triangle, 0, 100)).toBe(false);
    });

    it('should handle a large triangle correctly', function ()
    {
        var t = { x1: 0, y1: 0, x2: 10000, y2: 0, x3: 0, y3: 10000 };
        expect(Contains(t, 1000, 1000)).toBe(true);
        expect(Contains(t, 9000, 9000)).toBe(false);
    });
});
