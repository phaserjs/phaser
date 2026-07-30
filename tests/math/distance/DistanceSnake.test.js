var DistanceSnake = require('../../../src/math/distance/DistanceSnake');

describe('Phaser.Math.Distance.Snake', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistanceSnake(0, 0, 0, 0)).toBe(0);
        expect(DistanceSnake(5, 5, 5, 5)).toBe(0);
        expect(DistanceSnake(-3, -3, -3, -3)).toBe(0);
    });

    it('should return the horizontal distance when y coordinates are equal', function ()
    {
        expect(DistanceSnake(0, 0, 5, 0)).toBe(5);
        expect(DistanceSnake(5, 0, 0, 0)).toBe(5);
        expect(DistanceSnake(-5, 0, 5, 0)).toBe(10);
    });

    it('should return the vertical distance when x coordinates are equal', function ()
    {
        expect(DistanceSnake(0, 0, 0, 5)).toBe(5);
        expect(DistanceSnake(0, 5, 0, 0)).toBe(5);
        expect(DistanceSnake(0, -5, 0, 5)).toBe(10);
    });

    it('should return the sum of horizontal and vertical distances', function ()
    {
        expect(DistanceSnake(0, 0, 3, 4)).toBe(7);
        expect(DistanceSnake(1, 1, 4, 5)).toBe(7);
    });

    it('should be symmetric (same result regardless of point order)', function ()
    {
        expect(DistanceSnake(0, 0, 3, 4)).toBe(DistanceSnake(3, 4, 0, 0));
        expect(DistanceSnake(-2, 5, 7, -3)).toBe(DistanceSnake(7, -3, -2, 5));
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistanceSnake(-1, -1, -4, -5)).toBe(7);
        expect(DistanceSnake(-5, -5, 5, 5)).toBe(20);
    });

    it('should work with floating point values', function ()
    {
        expect(DistanceSnake(0, 0, 1.5, 2.5)).toBeCloseTo(4);
        expect(DistanceSnake(0.1, 0.2, 0.4, 0.6)).toBeCloseTo(0.7);
    });

    it('should return a non-negative value for any input', function ()
    {
        expect(DistanceSnake(10, 10, 0, 0)).toBeGreaterThanOrEqual(0);
        expect(DistanceSnake(-10, -10, 0, 0)).toBeGreaterThanOrEqual(0);
        expect(DistanceSnake(-5, 3, 7, -2)).toBeGreaterThanOrEqual(0);
    });

    it('should handle large coordinate values', function ()
    {
        expect(DistanceSnake(0, 0, 1000000, 1000000)).toBe(2000000);
        expect(DistanceSnake(-1000000, -1000000, 1000000, 1000000)).toBe(4000000);
    });
});
