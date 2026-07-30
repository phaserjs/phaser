var Wrap = require('../../src/math/Wrap');

describe('Phaser.Math.Wrap', function ()
{
    it('should return the value when within range', function ()
    {
        expect(Wrap(5, 0, 10)).toBe(5);
    });

    it('should wrap values above max back to min', function ()
    {
        expect(Wrap(12, 0, 10)).toBe(2);
    });

    it('should wrap values below min around to max', function ()
    {
        expect(Wrap(-3, 0, 10)).toBe(7);
    });

    it('should treat max as exclusive (value at max wraps to min)', function ()
    {
        expect(Wrap(10, 0, 10)).toBe(0);
    });

    it('should treat min as inclusive', function ()
    {
        expect(Wrap(0, 0, 10)).toBe(0);
    });

    it('should handle wrapping multiple times around', function ()
    {
        expect(Wrap(25, 0, 10)).toBe(5);
        expect(Wrap(-15, 0, 10)).toBe(5);
    });

    it('should work with negative ranges', function ()
    {
        expect(Wrap(-5, -10, 0)).toBe(-5);
        expect(Wrap(3, -10, 0)).toBe(-7);
        expect(Wrap(-13, -10, 0)).toBe(-3);
    });

    it('should work with floating point values', function ()
    {
        expect(Wrap(1.5, 0, 1)).toBeCloseTo(0.5);
        expect(Wrap(-0.25, 0, 1)).toBeCloseTo(0.75);
    });

    it('should handle a range of width 1', function ()
    {
        expect(Wrap(0, 0, 1)).toBe(0);
        expect(Wrap(1, 0, 1)).toBe(0);
        expect(Wrap(0.5, 0, 1)).toBe(0.5);
    });
});
