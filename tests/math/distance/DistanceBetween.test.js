var DistanceBetween = require('../../../src/math/distance/DistanceBetween');

describe('Phaser.Math.Distance.Between', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistanceBetween(0, 0, 0, 0)).toBe(0);
        expect(DistanceBetween(5, 5, 5, 5)).toBe(0);
        expect(DistanceBetween(-3, -3, -3, -3)).toBe(0);
    });

    it('should return correct distance for a 3-4-5 right triangle', function ()
    {
        expect(DistanceBetween(0, 0, 3, 4)).toBe(5);
        expect(DistanceBetween(0, 0, 4, 3)).toBe(5);
    });

    it('should return correct distance along the x-axis', function ()
    {
        expect(DistanceBetween(0, 0, 10, 0)).toBe(10);
        expect(DistanceBetween(0, 0, -10, 0)).toBe(10);
    });

    it('should return correct distance along the y-axis', function ()
    {
        expect(DistanceBetween(0, 0, 0, 10)).toBe(10);
        expect(DistanceBetween(0, 0, 0, -10)).toBe(10);
    });

    it('should return the same distance regardless of direction', function ()
    {
        expect(DistanceBetween(0, 0, 3, 4)).toBe(DistanceBetween(3, 4, 0, 0));
        expect(DistanceBetween(-5, 2, 7, -3)).toBe(DistanceBetween(7, -3, -5, 2));
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistanceBetween(-3, -4, 0, 0)).toBe(5);
        expect(DistanceBetween(-1, -1, -4, -5)).toBe(5);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(DistanceBetween(0, 0, 1.5, 2)).toBeCloseTo(2.5, 5);
        expect(DistanceBetween(0.5, 0.5, 0.5, 1.5)).toBeCloseTo(1, 5);
    });

    it('should return correct distance for diagonal unit movement', function ()
    {
        expect(DistanceBetween(0, 0, 1, 1)).toBeCloseTo(Math.sqrt(2), 10);
    });

    it('should work with large coordinate values', function ()
    {
        expect(DistanceBetween(0, 0, 3000, 4000)).toBe(5000);
    });

    it('should return a non-negative value for any inputs', function ()
    {
        expect(DistanceBetween(100, 200, -50, -80)).toBeGreaterThanOrEqual(0);
        expect(DistanceBetween(-100, -200, 50, 80)).toBeGreaterThanOrEqual(0);
    });
});
