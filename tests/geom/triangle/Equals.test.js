var Equals = require('../../../src/geom/triangle/Equals');

describe('Phaser.Geom.Triangle.Equals', function ()
{
    it('should return true when two triangles have identical coordinates', function ()
    {
        var a = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return true when both triangles are at the origin with zero values', function ()
    {
        var a = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
        var b = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when x1 differs', function ()
    {
        var a = { x1: 1, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when y1 differs', function ()
    {
        var a = { x1: 0, y1: 1, x2: 100, y2: 0, x3: 50, y3: 100 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when x2 differs', function ()
    {
        var a = { x1: 0, y1: 0, x2: 99, y2: 0, x3: 50, y3: 100 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when y2 differs', function ()
    {
        var a = { x1: 0, y1: 0, x2: 100, y2: 1, x3: 50, y3: 100 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when x3 differs', function ()
    {
        var a = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 51, y3: 100 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when y3 differs', function ()
    {
        var a = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 101 };
        var b = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return true when both triangles have negative coordinates', function ()
    {
        var a = { x1: -10, y1: -20, x2: -30, y2: -40, x3: -50, y3: -60 };
        var b = { x1: -10, y1: -20, x2: -30, y2: -40, x3: -50, y3: -60 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when triangles have matching vertices in different order', function ()
    {
        var a = { x1: 0, y1: 0, x2: 100, y2: 0, x3: 50, y3: 100 };
        var b = { x1: 100, y1: 0, x2: 0, y2: 0, x3: 50, y3: 100 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return true when a triangle is compared to itself', function ()
    {
        var a = { x1: 10, y1: 20, x2: 30, y2: 40, x3: 50, y3: 60 };

        expect(Equals(a, a)).toBe(true);
    });

    it('should return true with floating point coordinates that are exactly equal', function ()
    {
        var a = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5, x3: 5.5, y3: 6.5 };
        var b = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5, x3: 5.5, y3: 6.5 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false with floating point coordinates that differ slightly', function ()
    {
        var a = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5, x3: 5.5, y3: 6.5 };
        var b = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5, x3: 5.5, y3: 6.500001 };

        expect(Equals(a, b)).toBe(false);
    });
});
