var GetCollidesWith = require('../../../src/physics/arcade/GetCollidesWith');

describe('Phaser.Physics.Arcade.GetCollidesWith', function ()
{
    it('should return the value directly when given a single number', function ()
    {
        expect(GetCollidesWith(1)).toBe(1);
    });

    it('should return zero when given zero', function ()
    {
        expect(GetCollidesWith(0)).toBe(0);
    });

    it('should return a power-of-two category unchanged', function ()
    {
        expect(GetCollidesWith(2)).toBe(2);
        expect(GetCollidesWith(4)).toBe(4);
        expect(GetCollidesWith(8)).toBe(8);
        expect(GetCollidesWith(16)).toBe(16);
    });

    it('should return 0 for an empty array', function ()
    {
        expect(GetCollidesWith([])).toBe(0);
    });

    it('should return the single value from a one-element array', function ()
    {
        expect(GetCollidesWith([1])).toBe(1);
        expect(GetCollidesWith([4])).toBe(4);
    });

    it('should combine two categories using bitwise OR', function ()
    {
        expect(GetCollidesWith([1, 2])).toBe(3);
        expect(GetCollidesWith([4, 8])).toBe(12);
    });

    it('should combine multiple categories using bitwise OR', function ()
    {
        expect(GetCollidesWith([1, 2, 4])).toBe(7);
        expect(GetCollidesWith([1, 2, 4, 8])).toBe(15);
    });

    it('should handle duplicate categories without changing the result', function ()
    {
        expect(GetCollidesWith([1, 1])).toBe(1);
        expect(GetCollidesWith([4, 4, 4])).toBe(4);
    });

    it('should handle overlapping bits correctly', function ()
    {
        expect(GetCollidesWith([3, 5])).toBe(7);
    });

    it('should treat a non-array value as a direct assignment, not OR', function ()
    {
        expect(GetCollidesWith(7)).toBe(7);
    });

    it('should return correct mask for all common power-of-two categories combined', function ()
    {
        expect(GetCollidesWith([1, 2, 4, 8, 16, 32])).toBe(63);
    });
});
