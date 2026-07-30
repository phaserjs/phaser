var Area = require('../../../src/geom/triangle/Area');

describe('Phaser.Geom.Triangle.Area', function ()
{
    it('should return the area of a right triangle', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 4, y2: 0, x3: 0, y3: 3 };

        expect(Area(triangle)).toBe(6);
    });

    it('should return the area of an equilateral-ish triangle', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 10, y2: 0, x3: 5, y3: 10 };

        expect(Area(triangle)).toBe(50);
    });

    it('should return zero for a degenerate triangle where all points are the same', function ()
    {
        var triangle = { x1: 5, y1: 5, x2: 5, y2: 5, x3: 5, y3: 5 };

        expect(Area(triangle)).toBe(0);
    });

    it('should return zero for a degenerate triangle where all points are collinear', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 5, y2: 5, x3: 10, y3: 10 };

        expect(Area(triangle)).toBe(0);
    });

    it('should always return a non-negative area regardless of vertex winding order', function ()
    {
        var cw = { x1: 0, y1: 0, x2: 4, y2: 0, x3: 0, y3: 3 };
        var ccw = { x1: 0, y1: 0, x2: 0, y2: 3, x3: 4, y3: 0 };

        expect(Area(cw)).toBe(6);
        expect(Area(ccw)).toBe(6);
    });

    it('should handle triangles with negative coordinates', function ()
    {
        var triangle = { x1: -4, y1: 0, x2: 0, y2: 0, x3: 0, y3: 3 };

        expect(Area(triangle)).toBe(6);
    });

    it('should handle triangles spanning negative and positive coordinates', function ()
    {
        var triangle = { x1: -5, y1: -5, x2: 5, y2: -5, x3: 0, y3: 5 };

        expect(Area(triangle)).toBe(50);
    });

    it('should return a correct floating point area', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 1, y2: 0, x3: 0, y3: 1 };

        expect(Area(triangle)).toBeCloseTo(0.5, 10);
    });

    it('should handle large coordinate values', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 1000, y2: 0, x3: 0, y3: 1000 };

        expect(Area(triangle)).toBe(500000);
    });

    it('should handle a unit triangle', function ()
    {
        var triangle = { x1: 0, y1: 0, x2: 2, y2: 0, x3: 1, y3: 2 };

        expect(Area(triangle)).toBe(2);
    });
});
