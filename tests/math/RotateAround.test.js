var RotateAround = require('../../src/math/RotateAround');

describe('Phaser.Math.RotateAround', function ()
{
    it('should return the same point object', function ()
    {
        var point = { x: 1, y: 0 };
        var result = RotateAround(point, 0, 0, 0);
        expect(result).toBe(point);
    });

    it('should not change the point when angle is zero', function ()
    {
        var point = { x: 5, y: 3 };
        RotateAround(point, 0, 0, 0);
        expect(point.x).toBeCloseTo(5);
        expect(point.y).toBeCloseTo(3);
    });

    it('should rotate a point 90 degrees around the origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAround(point, 0, 0, Math.PI / 2);
        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(1);
    });

    it('should rotate a point 180 degrees around the origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAround(point, 0, 0, Math.PI);
        expect(point.x).toBeCloseTo(-1);
        expect(point.y).toBeCloseTo(0);
    });

    it('should rotate a point 270 degrees around the origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAround(point, 0, 0, Math.PI * 1.5);
        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should rotate a point 360 degrees and return to the original position', function ()
    {
        var point = { x: 3, y: 4 };
        RotateAround(point, 0, 0, Math.PI * 2);
        expect(point.x).toBeCloseTo(3);
        expect(point.y).toBeCloseTo(4);
    });

    it('should rotate around a non-origin pivot point', function ()
    {
        var point = { x: 2, y: 1 };
        RotateAround(point, 1, 1, Math.PI / 2);
        expect(point.x).toBeCloseTo(1);
        expect(point.y).toBeCloseTo(2);
    });

    it('should rotate 90 degrees around a pivot that is the same as the point', function ()
    {
        var point = { x: 5, y: 5 };
        RotateAround(point, 5, 5, Math.PI / 2);
        expect(point.x).toBeCloseTo(5);
        expect(point.y).toBeCloseTo(5);
    });

    it('should handle negative angles (rotate clockwise)', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAround(point, 0, 0, -Math.PI / 2);
        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should preserve the distance from the pivot point', function ()
    {
        var point = { x: 3, y: 4 };
        var px = 1;
        var py = 1;
        var dx = point.x - px;
        var dy = point.y - py;
        var distBefore = Math.sqrt(dx * dx + dy * dy);

        RotateAround(point, px, py, Math.PI / 3);

        var dx2 = point.x - px;
        var dy2 = point.y - py;
        var distAfter = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        expect(distAfter).toBeCloseTo(distBefore);
    });

    it('should handle floating point angles', function ()
    {
        var point = { x: 2, y: 0 };
        RotateAround(point, 0, 0, 0.5);
        expect(point.x).toBeCloseTo(2 * Math.cos(0.5));
        expect(point.y).toBeCloseTo(2 * Math.sin(0.5));
    });

    it('should handle negative coordinates for the pivot', function ()
    {
        var point = { x: 0, y: 0 };
        RotateAround(point, -1, -1, Math.PI / 2);
        expect(point.x).toBeCloseTo(-2);
        expect(point.y).toBeCloseTo(0);
    });

    it('should rotate multiple times cumulatively', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAround(point, 0, 0, Math.PI / 2);
        RotateAround(point, 0, 0, Math.PI / 2);
        expect(point.x).toBeCloseTo(-1);
        expect(point.y).toBeCloseTo(0);
    });
});
