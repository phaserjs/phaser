var Rotate = require('../../src/math/Rotate');

describe('Phaser.Math.Rotate', function ()
{
    it('should return the point object', function ()
    {
        var point = { x: 1, y: 0 };
        var result = Rotate(point, 0);

        expect(result).toBe(point);
    });

    it('should not change the point when angle is zero', function ()
    {
        var point = { x: 3, y: 4 };
        Rotate(point, 0);

        expect(point.x).toBeCloseTo(3);
        expect(point.y).toBeCloseTo(4);
    });

    it('should rotate a point 90 degrees anti-clockwise', function ()
    {
        var point = { x: 1, y: 0 };
        Rotate(point, Math.PI / 2);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(1);
    });

    it('should rotate a point 180 degrees', function ()
    {
        var point = { x: 1, y: 0 };
        Rotate(point, Math.PI);

        expect(point.x).toBeCloseTo(-1);
        expect(point.y).toBeCloseTo(0);
    });

    it('should rotate a point 270 degrees anti-clockwise', function ()
    {
        var point = { x: 1, y: 0 };
        Rotate(point, 3 * Math.PI / 2);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should rotate a point 360 degrees back to its original position', function ()
    {
        var point = { x: 3, y: 4 };
        Rotate(point, 2 * Math.PI);

        expect(point.x).toBeCloseTo(3);
        expect(point.y).toBeCloseTo(4);
    });

    it('should rotate using a negative angle in a clockwise direction', function ()
    {
        var point = { x: 1, y: 0 };
        Rotate(point, -Math.PI / 2);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should mutate the point in place', function ()
    {
        var point = { x: 1, y: 0 };
        Rotate(point, Math.PI / 2);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(1);
    });

    it('should rotate the origin point and remain at origin', function ()
    {
        var point = { x: 0, y: 0 };
        Rotate(point, Math.PI / 4);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(0);
    });

    it('should correctly rotate a point at 45 degrees', function ()
    {
        var point = { x: 1, y: 0 };
        Rotate(point, Math.PI / 4);

        expect(point.x).toBeCloseTo(Math.SQRT2 / 2);
        expect(point.y).toBeCloseTo(Math.SQRT2 / 2);
    });

    it('should correctly rotate a point with negative coordinates', function ()
    {
        var point = { x: -1, y: 0 };
        Rotate(point, Math.PI / 2);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should correctly rotate a point with both x and y non-zero', function ()
    {
        var point = { x: 1, y: 1 };
        Rotate(point, Math.PI / 2);

        expect(point.x).toBeCloseTo(-1);
        expect(point.y).toBeCloseTo(1);
    });

    it('should preserve the distance from origin after rotation', function ()
    {
        var point = { x: 3, y: 4 };
        var distBefore = Math.sqrt(point.x * point.x + point.y * point.y);
        Rotate(point, 1.23);
        var distAfter = Math.sqrt(point.x * point.x + point.y * point.y);

        expect(distAfter).toBeCloseTo(distBefore);
    });

    it('should handle floating point angle values', function ()
    {
        var point = { x: 2, y: 0 };
        Rotate(point, 0.5);

        expect(point.x).toBeCloseTo(2 * Math.cos(0.5));
        expect(point.y).toBeCloseTo(2 * Math.sin(0.5));
    });
});
