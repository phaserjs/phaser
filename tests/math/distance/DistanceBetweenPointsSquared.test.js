var DistanceBetweenPointsSquared = require('../../../src/math/distance/DistanceBetweenPointsSquared');

describe('Phaser.Math.Distance.BetweenPointsSquared', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
        expect(DistanceBetweenPointsSquared({ x: 5, y: 3 }, { x: 5, y: 3 })).toBe(0);
    });

    it('should return the squared distance for a horizontal separation', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 3, y: 0 })).toBe(9);
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: -4, y: 0 })).toBe(16);
    });

    it('should return the squared distance for a vertical separation', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 0, y: 5 })).toBe(25);
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 0, y: -6 })).toBe(36);
    });

    it('should return the squared distance for a diagonal separation', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(25);
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: -3, y: -4 })).toBe(25);
    });

    it('should be symmetric regardless of point order', function ()
    {
        var a = { x: 1, y: 2 };
        var b = { x: 5, y: 6 };

        expect(DistanceBetweenPointsSquared(a, b)).toBe(DistanceBetweenPointsSquared(b, a));
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: -1, y: -1 }, { x: -4, y: -5 })).toBe(25);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 1.5, y: 2 })).toBeCloseTo(6.25);
        expect(DistanceBetweenPointsSquared({ x: 0.5, y: 0.5 }, { x: 1.5, y: 1.5 })).toBeCloseTo(2);
    });

    it('should return the squared value (not the square root)', function ()
    {
        var result = DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 3, y: 4 });

        expect(result).toBe(25);
        expect(result).not.toBe(5);
    });

    it('should work with large coordinate values', function ()
    {
        expect(DistanceBetweenPointsSquared({ x: 0, y: 0 }, { x: 1000, y: 0 })).toBe(1000000);
    });
});
