var RotateAroundDistance = require('../../src/math/RotateAroundDistance');

describe('Phaser.Math.RotateAroundDistance', function ()
{
    it('should return the same point object', function ()
    {
        var point = { x: 1, y: 0 };
        var result = RotateAroundDistance(point, 0, 0, 0, 1);

        expect(result).toBe(point);
    });

    it('should place the point at the given distance from the origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, 0, 5);

        var dist = Math.sqrt(point.x * point.x + point.y * point.y);

        expect(dist).toBeCloseTo(5);
    });

    it('should not rotate when angle is zero and point is on positive x-axis', function ()
    {
        var point = { x: 3, y: 0 };
        RotateAroundDistance(point, 0, 0, 0, 3);

        expect(point.x).toBeCloseTo(3);
        expect(point.y).toBeCloseTo(0);
    });

    it('should rotate 90 degrees around origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, Math.PI / 2, 1);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(1);
    });

    it('should rotate 180 degrees around origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, Math.PI, 1);

        expect(point.x).toBeCloseTo(-1);
        expect(point.y).toBeCloseTo(0);
    });

    it('should rotate 270 degrees around origin', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, 3 * Math.PI / 2, 1);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should rotate 360 degrees and return to original position', function ()
    {
        var point = { x: 2, y: 0 };
        RotateAroundDistance(point, 0, 0, Math.PI * 2, 2);

        expect(point.x).toBeCloseTo(2);
        expect(point.y).toBeCloseTo(0);
    });

    it('should rotate around a non-origin pivot point', function ()
    {
        var point = { x: 5, y: 2 };
        RotateAroundDistance(point, 2, 2, 0, 3);

        expect(point.x).toBeCloseTo(5);
        expect(point.y).toBeCloseTo(2);
    });

    it('should rotate 90 degrees around a non-origin pivot', function ()
    {
        var point = { x: 5, y: 2 };
        RotateAroundDistance(point, 2, 2, Math.PI / 2, 3);

        expect(point.x).toBeCloseTo(2);
        expect(point.y).toBeCloseTo(5);
    });

    it('should override the current distance with the given distance', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, 0, 10);

        expect(point.x).toBeCloseTo(10);
        expect(point.y).toBeCloseTo(0);
    });

    it('should work with a distance of zero, placing point at pivot', function ()
    {
        var point = { x: 5, y: 3 };
        RotateAroundDistance(point, 2, 2, Math.PI / 4, 0);

        expect(point.x).toBeCloseTo(2);
        expect(point.y).toBeCloseTo(2);
    });

    it('should work with negative angles', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, -Math.PI / 2, 1);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-1);
    });

    it('should work with a point below the pivot', function ()
    {
        var point = { x: 0, y: -1 };
        RotateAroundDistance(point, 0, 0, Math.PI / 2, 1);

        expect(point.x).toBeCloseTo(1);
        expect(point.y).toBeCloseTo(0);
    });

    it('should work with floating point coordinates', function ()
    {
        var point = { x: 1.5, y: 0 };
        RotateAroundDistance(point, 0, 0, Math.PI / 4, 1.5);

        expect(point.x).toBeCloseTo(1.5 * Math.cos(Math.PI / 4));
        expect(point.y).toBeCloseTo(1.5 * Math.sin(Math.PI / 4));
    });

    it('should correctly combine existing angle and rotation angle', function ()
    {
        // Point is at 45 degrees from origin at distance sqrt(2)
        var point = { x: 1, y: 1 };
        // Rotate by another 45 degrees, keeping distance at sqrt(2)
        var dist = Math.sqrt(2);
        RotateAroundDistance(point, 0, 0, Math.PI / 4, dist);

        // Should now be at 90 degrees: (0, sqrt(2))
        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(dist);
    });

    it('should mutate the point x and y properties', function ()
    {
        var point = { x: 1, y: 0 };
        RotateAroundDistance(point, 0, 0, Math.PI / 2, 1);

        expect(point.x).not.toBeCloseTo(1);
        expect(point.y).not.toBeCloseTo(0);
    });

    it('should work with negative pivot coordinates', function ()
    {
        var point = { x: -1, y: -2 };
        RotateAroundDistance(point, -2, -2, 0, 1);

        expect(point.x).toBeCloseTo(-1);
        expect(point.y).toBeCloseTo(-2);
    });
});
