var RoundAwayFromZero = require('../../src/math/RoundAwayFromZero');

describe('Phaser.Math.RoundAwayFromZero', function ()
{
    it('should return zero for zero', function ()
    {
        expect(RoundAwayFromZero(0)).toBe(0);
    });

    it('should return the same integer for a positive integer', function ()
    {
        expect(RoundAwayFromZero(5)).toBe(5);
        expect(RoundAwayFromZero(1)).toBe(1);
        expect(RoundAwayFromZero(100)).toBe(100);
    });

    it('should return the same integer for a negative integer', function ()
    {
        expect(RoundAwayFromZero(-5)).toBe(-5);
        expect(RoundAwayFromZero(-1)).toBe(-1);
        expect(RoundAwayFromZero(-100)).toBe(-100);
    });

    it('should round positive floats up (away from zero)', function ()
    {
        expect(RoundAwayFromZero(4.1)).toBe(5);
        expect(RoundAwayFromZero(4.5)).toBe(5);
        expect(RoundAwayFromZero(4.9)).toBe(5);
        expect(RoundAwayFromZero(0.1)).toBe(1);
    });

    it('should round negative floats down (away from zero)', function ()
    {
        expect(RoundAwayFromZero(-4.1)).toBe(-5);
        expect(RoundAwayFromZero(-4.5)).toBe(-5);
        expect(RoundAwayFromZero(-4.9)).toBe(-5);
        expect(RoundAwayFromZero(-0.1)).toBe(-1);
    });

    it('should behave as ceil for positive values', function ()
    {
        expect(RoundAwayFromZero(2.3)).toBe(Math.ceil(2.3));
        expect(RoundAwayFromZero(7.8)).toBe(Math.ceil(7.8));
    });

    it('should behave as floor for negative values', function ()
    {
        expect(RoundAwayFromZero(-2.3)).toBe(Math.floor(-2.3));
        expect(RoundAwayFromZero(-7.8)).toBe(Math.floor(-7.8));
    });

    it('should return an integer for any float input', function ()
    {
        expect(Number.isInteger(RoundAwayFromZero(3.14))).toBe(true);
        expect(Number.isInteger(RoundAwayFromZero(-3.14))).toBe(true);
        expect(Number.isInteger(RoundAwayFromZero(0.001))).toBe(true);
        expect(Number.isInteger(RoundAwayFromZero(-0.001))).toBe(true);
    });

    it('should handle large positive numbers', function ()
    {
        expect(RoundAwayFromZero(999999.5)).toBe(1000000);
        expect(RoundAwayFromZero(1000000.1)).toBe(1000001);
    });

    it('should handle large negative numbers', function ()
    {
        expect(RoundAwayFromZero(-999999.5)).toBe(-1000000);
        expect(RoundAwayFromZero(-1000000.1)).toBe(-1000001);
    });

    it('should always move away from zero, not toward it', function ()
    {
        expect(Math.abs(RoundAwayFromZero(0.5))).toBeGreaterThanOrEqual(Math.abs(0.5));
        expect(Math.abs(RoundAwayFromZero(-0.5))).toBeGreaterThanOrEqual(Math.abs(-0.5));
        expect(Math.abs(RoundAwayFromZero(1.1))).toBeGreaterThanOrEqual(Math.abs(1.1));
        expect(Math.abs(RoundAwayFromZero(-1.1))).toBeGreaterThanOrEqual(Math.abs(-1.1));
    });
});
