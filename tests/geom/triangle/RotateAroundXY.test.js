var RotateAroundXY = require('../../../src/geom/triangle/RotateAroundXY');

describe('Phaser.Geom.Triangle.RotateAroundXY', function ()
{
    var triangle;

    beforeEach(function ()
    {
        triangle = { x1: 0, y1: -10, x2: -10, y2: 10, x3: 10, y3: 10 };
    });

    it('should return the triangle', function ()
    {
        var result = RotateAroundXY(triangle, 0, 0, 0);

        expect(result).toBe(triangle);
    });

    it('should not change vertices when angle is zero', function ()
    {
        RotateAroundXY(triangle, 0, 0, 0);

        expect(triangle.x1).toBeCloseTo(0);
        expect(triangle.y1).toBeCloseTo(-10);
        expect(triangle.x2).toBeCloseTo(-10);
        expect(triangle.y2).toBeCloseTo(10);
        expect(triangle.x3).toBeCloseTo(10);
        expect(triangle.y3).toBeCloseTo(10);
    });

    it('should rotate 90 degrees around the origin', function ()
    {
        var t = { x1: 1, y1: 0, x2: 0, y2: 1, x3: -1, y3: 0 };

        RotateAroundXY(t, 0, 0, Math.PI / 2);

        expect(t.x1).toBeCloseTo(0);
        expect(t.y1).toBeCloseTo(1);
        expect(t.x2).toBeCloseTo(-1);
        expect(t.y2).toBeCloseTo(0);
        expect(t.x3).toBeCloseTo(0);
        expect(t.y3).toBeCloseTo(-1);
    });

    it('should rotate 180 degrees around the origin', function ()
    {
        var t = { x1: 1, y1: 0, x2: 0, y2: 1, x3: -1, y3: 0 };

        RotateAroundXY(t, 0, 0, Math.PI);

        expect(t.x1).toBeCloseTo(-1);
        expect(t.y1).toBeCloseTo(0);
        expect(t.x2).toBeCloseTo(0);
        expect(t.y2).toBeCloseTo(-1);
        expect(t.x3).toBeCloseTo(1);
        expect(t.y3).toBeCloseTo(0);
    });

    it('should rotate 360 degrees back to original position', function ()
    {
        var t = { x1: 5, y1: 3, x2: -2, y2: 8, x3: 1, y3: -4 };

        RotateAroundXY(t, 0, 0, Math.PI * 2);

        expect(t.x1).toBeCloseTo(5);
        expect(t.y1).toBeCloseTo(3);
        expect(t.x2).toBeCloseTo(-2);
        expect(t.y2).toBeCloseTo(8);
        expect(t.x3).toBeCloseTo(1);
        expect(t.y3).toBeCloseTo(-4);
    });

    it('should rotate around a non-origin pivot point', function ()
    {
        var t = { x1: 2, y1: 1, x2: 2, y2: 3, x3: 4, y3: 1 };

        RotateAroundXY(t, 2, 2, Math.PI / 2);

        expect(t.x1).toBeCloseTo(3);
        expect(t.y1).toBeCloseTo(2);
        expect(t.x2).toBeCloseTo(1);
        expect(t.y2).toBeCloseTo(2);
        expect(t.x3).toBeCloseTo(3);
        expect(t.y3).toBeCloseTo(4);
    });

    it('should not move the triangle when rotating around a point it coincides with', function ()
    {
        var t = { x1: 5, y1: 5, x2: 5, y2: 5, x3: 5, y3: 5 };

        RotateAroundXY(t, 5, 5, Math.PI / 3);

        expect(t.x1).toBeCloseTo(5);
        expect(t.y1).toBeCloseTo(5);
        expect(t.x2).toBeCloseTo(5);
        expect(t.y2).toBeCloseTo(5);
        expect(t.x3).toBeCloseTo(5);
        expect(t.y3).toBeCloseTo(5);
    });

    it('should rotate by a negative angle', function ()
    {
        var t = { x1: 1, y1: 0, x2: 0, y2: 1, x3: -1, y3: 0 };

        RotateAroundXY(t, 0, 0, -Math.PI / 2);

        expect(t.x1).toBeCloseTo(0);
        expect(t.y1).toBeCloseTo(-1);
        expect(t.x2).toBeCloseTo(1);
        expect(t.y2).toBeCloseTo(0);
        expect(t.x3).toBeCloseTo(0);
        expect(t.y3).toBeCloseTo(1);
    });

    it('should mutate the original triangle object', function ()
    {
        var t = { x1: 1, y1: 0, x2: 0, y2: 1, x3: -1, y3: 0 };

        RotateAroundXY(t, 0, 0, Math.PI / 4);

        expect(t.x1).not.toBeCloseTo(1);
        expect(t.y1).not.toBeCloseTo(0);
    });

    it('should handle floating point angle values', function ()
    {
        var t = { x1: 1, y1: 0, x2: 0, y2: 0, x3: 0, y3: 1 };
        var angle = 1.2345;

        RotateAroundXY(t, 0, 0, angle);

        expect(t.x1).toBeCloseTo(Math.cos(angle));
        expect(t.y1).toBeCloseTo(Math.sin(angle));
    });

    it('should handle a pivot point with negative coordinates', function ()
    {
        var t = { x1: 0, y1: 0, x2: 2, y2: 0, x3: 0, y3: 2 };

        RotateAroundXY(t, -1, -1, Math.PI / 2);

        expect(t.x1).toBeCloseTo(-2);
        expect(t.y1).toBeCloseTo(0);
        expect(t.x2).toBeCloseTo(-2);
        expect(t.y2).toBeCloseTo(2);
        expect(t.x3).toBeCloseTo(-4);
        expect(t.y3).toBeCloseTo(0);
    });
});
