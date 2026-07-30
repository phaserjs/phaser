var FromPercent = require('../../src/math/FromPercent');

describe('Phaser.Math.FromPercent', function ()
{
    it('should return min when percent is 0', function ()
    {
        expect(FromPercent(0, 0, 100)).toBe(0);
        expect(FromPercent(0, 50, 200)).toBe(50);
    });

    it('should return max when percent is 1', function ()
    {
        expect(FromPercent(1, 0, 100)).toBe(100);
        expect(FromPercent(1, 50, 200)).toBe(200);
    });

    it('should return midpoint when percent is 0.5', function ()
    {
        expect(FromPercent(0.5, 0, 100)).toBe(50);
        expect(FromPercent(0.5, 0, 200)).toBe(100);
    });

    it('should return correct value for arbitrary percent', function ()
    {
        expect(FromPercent(0.25, 0, 100)).toBe(25);
        expect(FromPercent(0.75, 0, 100)).toBe(75);
    });

    it('should clamp percent below 0 to 0', function ()
    {
        expect(FromPercent(-1, 0, 100)).toBe(0);
        expect(FromPercent(-0.5, 10, 50)).toBe(10);
    });

    it('should clamp percent above 1 to 1', function ()
    {
        expect(FromPercent(2, 0, 100)).toBe(100);
        expect(FromPercent(1.5, 10, 50)).toBe(50);
    });

    it('should work with negative min and max', function ()
    {
        expect(FromPercent(0, -100, -10)).toBe(-100);
        expect(FromPercent(1, -100, -10)).toBe(-10);
        expect(FromPercent(0.5, -100, -10)).toBe(-55);
    });

    it('should work with a range spanning negative to positive', function ()
    {
        expect(FromPercent(0, -50, 50)).toBe(-50);
        expect(FromPercent(1, -50, 50)).toBe(50);
        expect(FromPercent(0.5, -50, 50)).toBe(0);
    });

    it('should work with floating point ranges', function ()
    {
        expect(FromPercent(0.5, 0, 1)).toBeCloseTo(0.5);
        expect(FromPercent(0.1, 0, 1)).toBeCloseTo(0.1);
        expect(FromPercent(0.9, 0, 1)).toBeCloseTo(0.9);
    });

    it('should return min when min equals max', function ()
    {
        expect(FromPercent(0, 5, 5)).toBe(5);
        expect(FromPercent(0.5, 5, 5)).toBe(5);
        expect(FromPercent(1, 5, 5)).toBe(5);
    });

    it('should handle min greater than max', function ()
    {
        expect(FromPercent(0, 100, 0)).toBe(100);
        expect(FromPercent(1, 100, 0)).toBe(0);
        expect(FromPercent(0.5, 100, 0)).toBe(50);
    });

    it('should work with large numbers', function ()
    {
        expect(FromPercent(0.5, 0, 1000000)).toBe(500000);
        expect(FromPercent(1, 0, 1000000)).toBe(1000000);
    });
});
