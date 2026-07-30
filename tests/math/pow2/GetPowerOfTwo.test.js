var GetPowerOfTwo = require('../../../src/math/pow2/GetPowerOfTwo');

describe('Phaser.Math.Pow2.GetPowerOfTwo', function ()
{
    it('should return 1 for value of 1', function ()
    {
        expect(GetPowerOfTwo(1)).toBe(1);
    });

    it('should return the same value when input is already a power of 2', function ()
    {
        expect(GetPowerOfTwo(2)).toBe(2);
        expect(GetPowerOfTwo(4)).toBe(4);
        expect(GetPowerOfTwo(8)).toBe(8);
        expect(GetPowerOfTwo(16)).toBe(16);
        expect(GetPowerOfTwo(32)).toBe(32);
        expect(GetPowerOfTwo(64)).toBe(64);
        expect(GetPowerOfTwo(128)).toBe(128);
        expect(GetPowerOfTwo(256)).toBe(256);
        expect(GetPowerOfTwo(512)).toBe(512);
        expect(GetPowerOfTwo(1024)).toBe(1024);
    });

    it('should return the next power of 2 when input is between powers of 2', function ()
    {
        expect(GetPowerOfTwo(3)).toBe(4);
        expect(GetPowerOfTwo(5)).toBe(8);
        expect(GetPowerOfTwo(6)).toBe(8);
        expect(GetPowerOfTwo(7)).toBe(8);
        expect(GetPowerOfTwo(9)).toBe(16);
        expect(GetPowerOfTwo(15)).toBe(16);
        expect(GetPowerOfTwo(17)).toBe(32);
        expect(GetPowerOfTwo(100)).toBe(128);
        expect(GetPowerOfTwo(300)).toBe(512);
    });

    it('should return 8 for value of 7', function ()
    {
        expect(GetPowerOfTwo(7)).toBe(8);
    });

    it('should return 8 for value of 8', function ()
    {
        expect(GetPowerOfTwo(8)).toBe(8);
    });

    it('should return 16 for value of 9', function ()
    {
        expect(GetPowerOfTwo(9)).toBe(16);
    });

    it('should return a number type', function ()
    {
        expect(typeof GetPowerOfTwo(7)).toBe('number');
    });

    it('should handle large power-of-2 values', function ()
    {
        expect(GetPowerOfTwo(2048)).toBe(2048);
        expect(GetPowerOfTwo(4096)).toBe(4096);
        expect(GetPowerOfTwo(2049)).toBe(4096);
    });
});
