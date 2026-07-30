var Percent = require('../../src/math/Percent');

describe('Phaser.Math.Percent', function ()
{
    it('should return 0 when value equals min', function ()
    {
        expect(Percent(0, 0, 100)).toBe(0);
    });

    it('should return 1 when value equals max', function ()
    {
        expect(Percent(100, 0, 100)).toBe(1);
    });

    it('should return 0.5 at the midpoint', function ()
    {
        expect(Percent(50, 0, 100)).toBe(0.5);
    });

    it('should return correct percentage for arbitrary values', function ()
    {
        expect(Percent(25, 0, 100)).toBe(0.25);
        expect(Percent(75, 0, 100)).toBe(0.75);
    });

    it('should clamp to 0 when value is below min', function ()
    {
        expect(Percent(-10, 0, 100)).toBe(0);
    });

    it('should clamp to 1 when value is above max (no upperMax)', function ()
    {
        expect(Percent(150, 0, 100)).toBe(1);
    });

    it('should default max to min + 1 when max is undefined', function ()
    {
        // Percent(value, min) => max defaults to min + 1
        expect(Percent(5, 5)).toBe(0);      // value === min => 0%
        expect(Percent(6, 5)).toBe(1);      // value === max (min + 1) => 100%
        expect(Percent(5.5, 5)).toBe(0.5);  // midpoint of [5, 6]
    });

    it('should handle upperMax - value between max and upperMax decreases from 1 to 0', function ()
    {
        // range [0, 100], upperMax = 200
        // At 100: should be 1 (100%)
        // At 150: should be 0.5 (halfway between max and upperMax)
        // At 200: should be 0 (reached upperMax)
        expect(Percent(100, 0, 100, 200)).toBe(1);
        expect(Percent(150, 0, 100, 200)).toBe(0.5);
        expect(Percent(200, 0, 100, 200)).toBe(0);
    });

    it('should return 0 when value exceeds upperMax', function ()
    {
        expect(Percent(250, 0, 100, 200)).toBe(0);
    });

    it('should work with negative ranges', function ()
    {
        expect(Percent(-50, -100, 0)).toBe(0.5);
        expect(Percent(-100, -100, 0)).toBe(0);
        expect(Percent(0, -100, 0)).toBe(1);
    });
});
