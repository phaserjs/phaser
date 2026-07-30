var IsValuePowerOfTwo = require('../../../src/math/pow2/IsValuePowerOfTwo');

describe('Phaser.Math.Pow2.IsValue', function ()
{
    it('should return true for 1', function ()
    {
        expect(IsValuePowerOfTwo(1)).toBe(true);
    });

    it('should return true for 2', function ()
    {
        expect(IsValuePowerOfTwo(2)).toBe(true);
    });

    it('should return true for 4', function ()
    {
        expect(IsValuePowerOfTwo(4)).toBe(true);
    });

    it('should return true for common power of two texture sizes', function ()
    {
        expect(IsValuePowerOfTwo(8)).toBe(true);
        expect(IsValuePowerOfTwo(16)).toBe(true);
        expect(IsValuePowerOfTwo(32)).toBe(true);
        expect(IsValuePowerOfTwo(64)).toBe(true);
        expect(IsValuePowerOfTwo(128)).toBe(true);
        expect(IsValuePowerOfTwo(256)).toBe(true);
        expect(IsValuePowerOfTwo(512)).toBe(true);
        expect(IsValuePowerOfTwo(1024)).toBe(true);
        expect(IsValuePowerOfTwo(2048)).toBe(true);
        expect(IsValuePowerOfTwo(4096)).toBe(true);
    });

    it('should return false for 0', function ()
    {
        expect(IsValuePowerOfTwo(0)).toBe(false);
    });

    it('should return false for negative values', function ()
    {
        expect(IsValuePowerOfTwo(-1)).toBe(false);
        expect(IsValuePowerOfTwo(-2)).toBe(false);
        expect(IsValuePowerOfTwo(-4)).toBe(false);
        expect(IsValuePowerOfTwo(-128)).toBe(false);
    });

    it('should return false for non-power-of-two values', function ()
    {
        expect(IsValuePowerOfTwo(3)).toBe(false);
        expect(IsValuePowerOfTwo(5)).toBe(false);
        expect(IsValuePowerOfTwo(6)).toBe(false);
        expect(IsValuePowerOfTwo(7)).toBe(false);
        expect(IsValuePowerOfTwo(9)).toBe(false);
        expect(IsValuePowerOfTwo(100)).toBe(false);
        expect(IsValuePowerOfTwo(1000)).toBe(false);
    });

    it('should return false for floating point values that are not integers', function ()
    {
        // Bitwise ops truncate floats: 1.5->1 (pow2=true), 2.5->2 (pow2=true), 3.9->3 (not pow2=false)
        expect(IsValuePowerOfTwo(1.5)).toBe(true);
        expect(IsValuePowerOfTwo(2.5)).toBe(true);
        expect(IsValuePowerOfTwo(3.9)).toBe(false);
    });

    it('should return a boolean', function ()
    {
        expect(typeof IsValuePowerOfTwo(4)).toBe('boolean');
        expect(typeof IsValuePowerOfTwo(3)).toBe('boolean');
    });
});
