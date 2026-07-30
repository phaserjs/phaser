var BetweenY = require('../../../src/math/angle/BetweenY');

describe('Phaser.Math.Angle.BetweenY', function ()
{
    it('should return zero when the second point is directly below the first', function ()
    {
        expect(BetweenY(0, 0, 0, 1)).toBeCloseTo(0);
    });

    it('should return PI when the second point is directly above the first', function ()
    {
        expect(BetweenY(0, 0, 0, -1)).toBeCloseTo(Math.PI);
    });

    it('should return PI/2 when the second point is directly to the right', function ()
    {
        expect(BetweenY(0, 0, 1, 0)).toBeCloseTo(Math.PI / 2);
    });

    it('should return -PI/2 when the second point is directly to the left', function ()
    {
        expect(BetweenY(0, 0, -1, 0)).toBeCloseTo(-Math.PI / 2);
    });

    it('should return zero when both points are identical', function ()
    {
        expect(BetweenY(5, 5, 5, 5)).toBeCloseTo(0);
    });

    it('should return the correct angle for a diagonal segment (down-right)', function ()
    {
        expect(BetweenY(0, 0, 1, 1)).toBeCloseTo(Math.PI / 4);
    });

    it('should return the correct angle for a diagonal segment (down-left)', function ()
    {
        expect(BetweenY(0, 0, -1, 1)).toBeCloseTo(-Math.PI / 4);
    });

    it('should return the correct angle for a diagonal segment (up-right)', function ()
    {
        expect(BetweenY(0, 0, 1, -1)).toBeCloseTo(3 * Math.PI / 4);
    });

    it('should return the correct angle for a diagonal segment (up-left)', function ()
    {
        expect(BetweenY(0, 0, -1, -1)).toBeCloseTo(-3 * Math.PI / 4);
    });

    it('should work with non-origin starting points', function ()
    {
        expect(BetweenY(10, 10, 10, 20)).toBeCloseTo(0);
        expect(BetweenY(10, 10, 20, 10)).toBeCloseTo(Math.PI / 2);
    });

    it('should work with negative coordinates', function ()
    {
        expect(BetweenY(-5, -5, -5, -4)).toBeCloseTo(0);
        expect(BetweenY(-5, -5, -4, -5)).toBeCloseTo(Math.PI / 2);
    });

    it('should work with floating point coordinates', function ()
    {
        expect(BetweenY(0, 0, 0.5, 0.5)).toBeCloseTo(Math.PI / 4);
    });

    it('should return a value in the range of -PI to PI', function ()
    {
        var result = BetweenY(0, 0, 1, 1);
        expect(result).toBeGreaterThanOrEqual(-Math.PI);
        expect(result).toBeLessThanOrEqual(Math.PI);
    });

    it('should use atan2 of dx over dy (Y-axis based)', function ()
    {
        var x1 = 3, y1 = 4, x2 = 7, y2 = 9;
        expect(BetweenY(x1, y1, x2, y2)).toBeCloseTo(Math.atan2(x2 - x1, y2 - y1));
    });
});
