var DistanceSquared = require('../../../src/math/distance/DistanceSquared');

describe('Phaser.Math.Distance.Squared', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistanceSquared(0, 0, 0, 0)).toBe(0);
        expect(DistanceSquared(5, 5, 5, 5)).toBe(0);
    });

    it('should return the squared distance along the x axis', function ()
    {
        expect(DistanceSquared(0, 0, 3, 0)).toBe(9);
        expect(DistanceSquared(0, 0, 5, 0)).toBe(25);
    });

    it('should return the squared distance along the y axis', function ()
    {
        expect(DistanceSquared(0, 0, 0, 4)).toBe(16);
        expect(DistanceSquared(0, 0, 0, 6)).toBe(36);
    });

    it('should return the squared distance between two arbitrary points', function ()
    {
        expect(DistanceSquared(0, 0, 3, 4)).toBe(25);
    });

    it('should return the same result regardless of point order', function ()
    {
        expect(DistanceSquared(0, 0, 3, 4)).toBe(DistanceSquared(3, 4, 0, 0));
        expect(DistanceSquared(1, 2, 5, 6)).toBe(DistanceSquared(5, 6, 1, 2));
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistanceSquared(-3, -4, 0, 0)).toBe(25);
        expect(DistanceSquared(-3, 0, 3, 0)).toBe(36);
    });

    it('should work with floating point values', function ()
    {
        expect(DistanceSquared(0, 0, 1.5, 2)).toBeCloseTo(6.25);
        expect(DistanceSquared(0.5, 0.5, 1.5, 0.5)).toBeCloseTo(1);
    });

    it('should work with large coordinate values', function ()
    {
        expect(DistanceSquared(0, 0, 1000, 0)).toBe(1000000);
        expect(DistanceSquared(0, 0, 0, 1000)).toBe(1000000);
    });

    it('should work when points are at non-origin positions', function ()
    {
        expect(DistanceSquared(1, 1, 4, 5)).toBe(25);
        expect(DistanceSquared(10, 10, 13, 14)).toBe(25);
    });
});
