var IsSizePowerOfTwo = require('../../../src/math/pow2/IsSizePowerOfTwo');

describe('Phaser.Math.Pow2.IsSize', function ()
{
    it('should return true when both width and height are powers of two', function ()
    {
        expect(IsSizePowerOfTwo(1, 1)).toBe(true);
        expect(IsSizePowerOfTwo(2, 2)).toBe(true);
        expect(IsSizePowerOfTwo(4, 4)).toBe(true);
        expect(IsSizePowerOfTwo(8, 8)).toBe(true);
        expect(IsSizePowerOfTwo(16, 16)).toBe(true);
        expect(IsSizePowerOfTwo(32, 32)).toBe(true);
        expect(IsSizePowerOfTwo(64, 64)).toBe(true);
        expect(IsSizePowerOfTwo(128, 128)).toBe(true);
        expect(IsSizePowerOfTwo(256, 256)).toBe(true);
        expect(IsSizePowerOfTwo(512, 512)).toBe(true);
        expect(IsSizePowerOfTwo(1024, 1024)).toBe(true);
        expect(IsSizePowerOfTwo(2048, 2048)).toBe(true);
        expect(IsSizePowerOfTwo(4096, 4096)).toBe(true);
    });

    it('should return true when width and height are different powers of two', function ()
    {
        expect(IsSizePowerOfTwo(2, 4)).toBe(true);
        expect(IsSizePowerOfTwo(4, 2)).toBe(true);
        expect(IsSizePowerOfTwo(16, 32)).toBe(true);
        expect(IsSizePowerOfTwo(128, 256)).toBe(true);
        expect(IsSizePowerOfTwo(512, 1024)).toBe(true);
        expect(IsSizePowerOfTwo(1, 4096)).toBe(true);
    });

    it('should return false when width is not a power of two', function ()
    {
        expect(IsSizePowerOfTwo(3, 4)).toBe(false);
        expect(IsSizePowerOfTwo(5, 8)).toBe(false);
        expect(IsSizePowerOfTwo(6, 16)).toBe(false);
        expect(IsSizePowerOfTwo(100, 128)).toBe(false);
        expect(IsSizePowerOfTwo(255, 256)).toBe(false);
    });

    it('should return false when height is not a power of two', function ()
    {
        expect(IsSizePowerOfTwo(4, 3)).toBe(false);
        expect(IsSizePowerOfTwo(8, 5)).toBe(false);
        expect(IsSizePowerOfTwo(16, 6)).toBe(false);
        expect(IsSizePowerOfTwo(128, 100)).toBe(false);
        expect(IsSizePowerOfTwo(256, 255)).toBe(false);
    });

    it('should return false when neither width nor height are powers of two', function ()
    {
        expect(IsSizePowerOfTwo(3, 3)).toBe(false);
        expect(IsSizePowerOfTwo(5, 7)).toBe(false);
        expect(IsSizePowerOfTwo(100, 200)).toBe(false);
        expect(IsSizePowerOfTwo(300, 400)).toBe(false);
    });

    it('should return false when width is zero', function ()
    {
        expect(IsSizePowerOfTwo(0, 4)).toBe(false);
    });

    it('should return false when height is zero', function ()
    {
        expect(IsSizePowerOfTwo(4, 0)).toBe(false);
    });

    it('should return false when both width and height are zero', function ()
    {
        expect(IsSizePowerOfTwo(0, 0)).toBe(false);
    });

    it('should return false when width is negative', function ()
    {
        expect(IsSizePowerOfTwo(-1, 4)).toBe(false);
        expect(IsSizePowerOfTwo(-4, 4)).toBe(false);
        expect(IsSizePowerOfTwo(-16, 16)).toBe(false);
    });

    it('should return false when height is negative', function ()
    {
        expect(IsSizePowerOfTwo(4, -1)).toBe(false);
        expect(IsSizePowerOfTwo(4, -4)).toBe(false);
        expect(IsSizePowerOfTwo(16, -16)).toBe(false);
    });

    it('should return false for floating point values that are not integers', function ()
    {
        // Bitwise operators in JavaScript truncate floats to integers,
        // so 2.5 behaves as 2 (a power of two) and 1.5 behaves as 1.
        expect(IsSizePowerOfTwo(2.5, 4)).toBe(true);
        expect(IsSizePowerOfTwo(4, 2.5)).toBe(true);
        expect(IsSizePowerOfTwo(1.5, 1.5)).toBe(true);
        // Floats that truncate to non-powers-of-two still return false
        expect(IsSizePowerOfTwo(3.9, 4)).toBe(false);
        expect(IsSizePowerOfTwo(4, 3.9)).toBe(false);
    });
});
