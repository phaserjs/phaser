var ShortestBetween = require('../../../src/math/angle/ShortestBetween');

describe('Phaser.Math.Angle.ShortestBetween', function ()
{
    it('should return zero when both angles are equal', function ()
    {
        expect(ShortestBetween(0, 0)).toBe(0);
        expect(ShortestBetween(90, 90)).toBe(0);
        expect(ShortestBetween(-90, -90)).toBe(0);
        expect(ShortestBetween(180, 180)).toBe(0);
        expect(ShortestBetween(-180, -180)).toBe(0);
    });

    it('should return positive value for counter-clockwise rotation', function ()
    {
        expect(ShortestBetween(0, 90)).toBe(90);
        expect(ShortestBetween(-90, 0)).toBe(90);
        expect(ShortestBetween(0, 45)).toBe(45);
    });

    it('should return negative value for clockwise rotation', function ()
    {
        expect(ShortestBetween(90, 0)).toBe(-90);
        expect(ShortestBetween(0, -90)).toBe(-90);
        expect(ShortestBetween(45, 0)).toBe(-45);
    });

    it('should find the shortest path when crossing the 180 boundary', function ()
    {
        expect(ShortestBetween(170, -170)).toBe(20);
        expect(ShortestBetween(-170, 170)).toBe(-20);
    });

    it('should handle 180 degree difference', function ()
    {
        expect(ShortestBetween(0, 180)).toBe(-180);
        expect(ShortestBetween(0, -180)).toBe(-180);
    });

    it('should handle angles at the extremes of the range', function ()
    {
        expect(ShortestBetween(-180, 0)).toBe(-180);
        expect(ShortestBetween(180, 0)).toBe(-180);
    });

    it('should return the shortest angle not exceeding 180 degrees in magnitude', function ()
    {
        var result = ShortestBetween(10, -10);
        expect(Math.abs(result)).toBeLessThanOrEqual(180);
    });

    it('should work with small angle differences', function ()
    {
        expect(ShortestBetween(0, 1)).toBe(1);
        expect(ShortestBetween(0, -1)).toBe(-1);
        expect(ShortestBetween(89, 90)).toBe(1);
    });

    it('should work with floating point angles', function ()
    {
        expect(ShortestBetween(0, 45.5)).toBeCloseTo(45.5);
        expect(ShortestBetween(10.5, 20.5)).toBeCloseTo(10);
        expect(ShortestBetween(170.5, -170.5)).toBeCloseTo(19);
    });

    it('should handle negative to positive transitions correctly', function ()
    {
        expect(ShortestBetween(-45, 45)).toBe(90);
        expect(ShortestBetween(-135, 135)).toBe(-90);
    });
});
