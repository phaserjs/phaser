var DistancePower = require('../../../src/math/distance/DistancePower');

describe('Phaser.Math.Distance.Power', function ()
{
    it('should return zero when both points are the same', function ()
    {
        expect(DistancePower(0, 0, 0, 0)).toBe(0);
        expect(DistancePower(5, 5, 5, 5)).toBe(0);
        expect(DistancePower(-3, 7, -3, 7)).toBe(0);
    });

    it('should return Euclidean distance with default pow of 2', function ()
    {
        expect(DistancePower(0, 0, 3, 4)).toBe(5);
        expect(DistancePower(0, 0, 5, 12)).toBe(13);
    });

    it('should return Euclidean distance when pow is explicitly 2', function ()
    {
        expect(DistancePower(0, 0, 3, 4, 2)).toBe(5);
        expect(DistancePower(1, 1, 4, 5, 2)).toBe(5);
    });

    it('should handle horizontal distances', function ()
    {
        expect(DistancePower(0, 0, 5, 0)).toBe(5);
        expect(DistancePower(-5, 0, 5, 0)).toBe(10);
    });

    it('should handle vertical distances', function ()
    {
        expect(DistancePower(0, 0, 0, 5)).toBe(5);
        expect(DistancePower(0, -5, 0, 5)).toBe(10);
    });

    it('should be symmetric — distance from A to B equals B to A', function ()
    {
        // Symmetry holds for even powers (squaring eliminates sign)
        expect(DistancePower(1, 2, 4, 6)).toBeCloseTo(DistancePower(4, 6, 1, 2));
        expect(DistancePower(0, 0, 3, 4, 2)).toBeCloseTo(DistancePower(3, 4, 0, 0, 2));
    });

    it('should work with negative coordinates', function ()
    {
        expect(DistancePower(-3, -4, 0, 0)).toBe(5);
        expect(DistancePower(-3, 0, 0, -4)).toBe(5);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(DistancePower(0, 0, 1.5, 2)).toBeCloseTo(Math.sqrt(1.5 * 1.5 + 2 * 2));
    });

    it('should produce correct result with pow of 1 (Manhattan-like)', function ()
    {
        // sqrt((3-0)^1 + (4-0)^1) = sqrt(3 + 4) = sqrt(7)
        expect(DistancePower(0, 0, 3, 4, 1)).toBeCloseTo(Math.sqrt(7));
    });

    it('should produce correct result with pow of 3', function ()
    {
        // sqrt((3-0)^3 + (4-0)^3) = sqrt(27 + 64) = sqrt(91)
        expect(DistancePower(0, 0, 3, 4, 3)).toBeCloseTo(Math.sqrt(91));
    });

    it('should produce correct result with pow of 4', function ()
    {
        // sqrt((3-0)^4 + (4-0)^4) = sqrt(81 + 256) = sqrt(337)
        expect(DistancePower(0, 0, 3, 4, 4)).toBeCloseTo(Math.sqrt(337));
    });

    it('should return a non-negative number for any inputs', function ()
    {
        expect(DistancePower(0, 0, -3, -4)).toBeGreaterThanOrEqual(0);
        expect(DistancePower(100, 200, -50, -100)).toBeGreaterThanOrEqual(0);
    });
});
