var RoundTo = require('../../src/math/RoundTo');

describe('Phaser.Math.RoundTo', function ()
{
    it('should round to integer by default (place = 0)', function ()
    {
        expect(RoundTo(123.456)).toBe(123);
    });

    it('should round to integer when place is 0', function ()
    {
        expect(RoundTo(123.456, 0)).toBe(123);
        expect(RoundTo(123.567, 0)).toBe(124);
    });

    it('should round to tens when place is 1', function ()
    {
        expect(RoundTo(123.456, 1)).toBe(120);
        expect(RoundTo(125, 1)).toBe(130);
    });

    it('should round to hundreds when place is 2', function ()
    {
        expect(RoundTo(123.456, 2)).toBe(100);
        expect(RoundTo(150, 2)).toBe(200);
    });

    it('should round to thousands when place is 3', function ()
    {
        expect(RoundTo(1234, 3)).toBe(1000);
        expect(RoundTo(1500, 3)).toBe(2000);
    });

    it('should round to one decimal place when place is -1', function ()
    {
        expect(RoundTo(123.456789, -1)).toBeCloseTo(123.5, 5);
    });

    it('should round to two decimal places when place is -2', function ()
    {
        expect(RoundTo(123.456789, -2)).toBeCloseTo(123.46, 5);
    });

    it('should round to three decimal places when place is -3', function ()
    {
        expect(RoundTo(123.456789, -3)).toBeCloseTo(123.457, 5);
    });

    it('should round zero correctly', function ()
    {
        expect(RoundTo(0, 0)).toBe(0);
        expect(RoundTo(0, 2)).toBe(0);
        expect(RoundTo(0, -2)).toBe(0);
    });

    it('should round negative values correctly', function ()
    {
        expect(RoundTo(-123.456, 0)).toBe(-123);
        expect(RoundTo(-123.567, 0)).toBe(-124);
        expect(RoundTo(-123.456, 1)).toBe(-120);
        expect(RoundTo(-123.456, 2)).toBe(-100);
    });

    it('should round negative values to decimal places correctly', function ()
    {
        expect(RoundTo(-123.456789, -1)).toBeCloseTo(-123.5, 5);
        expect(RoundTo(-123.456789, -2)).toBeCloseTo(-123.46, 5);
    });

    it('should work with base 2 (binary rounding)', function ()
    {
        expect(RoundTo(10, 1, 2)).toBe(10);
        expect(RoundTo(9, 1, 2)).toBe(10);
        expect(RoundTo(11, 1, 2)).toBe(12);
    });

    it('should work with base 16 (hex rounding)', function ()
    {
        expect(RoundTo(8, 1, 16)).toBe(16);
        expect(RoundTo(9, 1, 16)).toBe(16);
    });

    it('should return exact value when already rounded', function ()
    {
        expect(RoundTo(100, 2)).toBe(100);
        expect(RoundTo(1.5, -1)).toBeCloseTo(1.5, 5);
    });

    it('should handle very small numbers', function ()
    {
        expect(RoundTo(0.001, -2)).toBeCloseTo(0, 5);
        expect(RoundTo(0.005, -2)).toBeCloseTo(0.01, 5);
    });

    it('should handle very large numbers', function ()
    {
        expect(RoundTo(999999, 3)).toBe(1000000);
        expect(RoundTo(499999, 3)).toBe(500000);
    });

    it('should use base 10 by default', function ()
    {
        expect(RoundTo(123, 1, 10)).toBe(RoundTo(123, 1));
        expect(RoundTo(123.456, -2, 10)).toBeCloseTo(RoundTo(123.456, -2), 5);
    });
});
