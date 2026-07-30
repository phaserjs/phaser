var Offset = require('../../../src/geom/triangle/Offset');

describe('Phaser.Geom.Triangle.Offset', function ()
{
    var triangle;

    beforeEach(function ()
    {
        triangle = { x1: 0, y1: 0, x2: 10, y2: 0, x3: 5, y3: 10 };
    });

    it('should return the triangle', function ()
    {
        var result = Offset(triangle, 0, 0);

        expect(result).toBe(triangle);
    });

    it('should move all vertices by positive x and y offsets', function ()
    {
        Offset(triangle, 5, 3);

        expect(triangle.x1).toBe(5);
        expect(triangle.y1).toBe(3);
        expect(triangle.x2).toBe(15);
        expect(triangle.y2).toBe(3);
        expect(triangle.x3).toBe(10);
        expect(triangle.y3).toBe(13);
    });

    it('should move all vertices by negative x and y offsets', function ()
    {
        Offset(triangle, -5, -3);

        expect(triangle.x1).toBe(-5);
        expect(triangle.y1).toBe(-3);
        expect(triangle.x2).toBe(5);
        expect(triangle.y2).toBe(-3);
        expect(triangle.x3).toBe(0);
        expect(triangle.y3).toBe(7);
    });

    it('should not change vertices when offset is zero', function ()
    {
        Offset(triangle, 0, 0);

        expect(triangle.x1).toBe(0);
        expect(triangle.y1).toBe(0);
        expect(triangle.x2).toBe(10);
        expect(triangle.y2).toBe(0);
        expect(triangle.x3).toBe(5);
        expect(triangle.y3).toBe(10);
    });

    it('should move only horizontally when y offset is zero', function ()
    {
        Offset(triangle, 7, 0);

        expect(triangle.x1).toBe(7);
        expect(triangle.y1).toBe(0);
        expect(triangle.x2).toBe(17);
        expect(triangle.y2).toBe(0);
        expect(triangle.x3).toBe(12);
        expect(triangle.y3).toBe(10);
    });

    it('should move only vertically when x offset is zero', function ()
    {
        Offset(triangle, 0, 4);

        expect(triangle.x1).toBe(0);
        expect(triangle.y1).toBe(4);
        expect(triangle.x2).toBe(10);
        expect(triangle.y2).toBe(4);
        expect(triangle.x3).toBe(5);
        expect(triangle.y3).toBe(14);
    });

    it('should work with floating point offsets', function ()
    {
        Offset(triangle, 1.5, 2.5);

        expect(triangle.x1).toBeCloseTo(1.5);
        expect(triangle.y1).toBeCloseTo(2.5);
        expect(triangle.x2).toBeCloseTo(11.5);
        expect(triangle.y2).toBeCloseTo(2.5);
        expect(triangle.x3).toBeCloseTo(6.5);
        expect(triangle.y3).toBeCloseTo(12.5);
    });

    it('should work when starting from non-zero vertex positions', function ()
    {
        triangle = { x1: 100, y1: 200, x2: 150, y2: 200, x3: 125, y3: 250 };

        Offset(triangle, 10, 20);

        expect(triangle.x1).toBe(110);
        expect(triangle.y1).toBe(220);
        expect(triangle.x2).toBe(160);
        expect(triangle.y2).toBe(220);
        expect(triangle.x3).toBe(135);
        expect(triangle.y3).toBe(270);
    });

    it('should work with large offsets', function ()
    {
        Offset(triangle, 10000, 10000);

        expect(triangle.x1).toBe(10000);
        expect(triangle.y1).toBe(10000);
        expect(triangle.x2).toBe(10010);
        expect(triangle.y2).toBe(10000);
        expect(triangle.x3).toBe(10005);
        expect(triangle.y3).toBe(10010);
    });

    it('should be additive when called multiple times', function ()
    {
        Offset(triangle, 5, 5);
        Offset(triangle, 5, 5);

        expect(triangle.x1).toBe(10);
        expect(triangle.y1).toBe(10);
        expect(triangle.x2).toBe(20);
        expect(triangle.y2).toBe(10);
        expect(triangle.x3).toBe(15);
        expect(triangle.y3).toBe(20);
    });
});
