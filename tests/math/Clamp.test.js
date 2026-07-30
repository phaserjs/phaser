var Clamp = require('../../src/math/Clamp');

describe('Phaser.Math.Clamp', function ()
{
    it('should return the value when within range', function ()
    {
        expect(Clamp(5, 0, 10)).toBe(5);
    });

    it('should return min when value is below min', function ()
    {
        expect(Clamp(-5, 0, 10)).toBe(0);
    });

    it('should return max when value is above max', function ()
    {
        expect(Clamp(15, 0, 10)).toBe(10);
    });

    it('should return min when value equals min', function ()
    {
        expect(Clamp(0, 0, 10)).toBe(0);
    });

    it('should return max when value equals max', function ()
    {
        expect(Clamp(10, 0, 10)).toBe(10);
    });

    it('should work with negative ranges', function ()
    {
        expect(Clamp(-5, -10, -1)).toBe(-5);
        expect(Clamp(-15, -10, -1)).toBe(-10);
        expect(Clamp(0, -10, -1)).toBe(-1);
    });

    it('should work with floating point values', function ()
    {
        expect(Clamp(0.5, 0, 1)).toBe(0.5);
        expect(Clamp(-0.1, 0, 1)).toBe(0);
        expect(Clamp(1.5, 0, 1)).toBe(1);
    });

    it('should handle min equal to max', function ()
    {
        expect(Clamp(5, 3, 3)).toBe(3);
        expect(Clamp(1, 3, 3)).toBe(3);
    });
});
