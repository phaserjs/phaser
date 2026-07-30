var CeilTo = require('../../src/math/CeilTo');

describe('Phaser.Math.CeilTo', function ()
{
    it('should ceil to the nearest integer by default (place=0, base=10)', function ()
    {
        expect(CeilTo(4.1)).toBe(5);
        expect(CeilTo(4.9)).toBe(5);
        expect(CeilTo(4.0)).toBe(4);
    });

    it('should return the value unchanged when it is already an integer', function ()
    {
        expect(CeilTo(5)).toBe(5);
        expect(CeilTo(0)).toBe(0);
        expect(CeilTo(-3)).toBe(-3);
    });

    it('should ceil negative values toward zero', function ()
    {
        expect(CeilTo(-4.9)).toBe(-4);
        expect(CeilTo(-4.1)).toBe(-4);
        expect(CeilTo(-4.0)).toBe(-4);
    });

    it('should ceil to the nearest 0.1 with place=-1', function ()
    {
        expect(CeilTo(1.11, -1)).toBeCloseTo(1.2, 10);
        expect(CeilTo(1.10, -1)).toBeCloseTo(1.1, 10);
        expect(CeilTo(1.01, -1)).toBeCloseTo(1.1, 10);
    });

    it('should ceil to the nearest 0.01 with place=-2', function ()
    {
        expect(CeilTo(1.111, -2)).toBeCloseTo(1.12, 10);
        expect(CeilTo(1.000, -2)).toBe(1);
        expect(CeilTo(1.001, -2)).toBeCloseTo(1.01, 10);
    });

    it('should ceil to the nearest 10 with place=1', function ()
    {
        expect(CeilTo(11, 1)).toBe(20);
        expect(CeilTo(10, 1)).toBe(10);
        expect(CeilTo(1,  1)).toBe(10);
    });

    it('should ceil to the nearest 100 with place=2', function ()
    {
        expect(CeilTo(101, 2)).toBe(200);
        expect(CeilTo(100, 2)).toBe(100);
        expect(CeilTo(1,   2)).toBe(100);
    });

    it('should work with a custom base', function ()
    {
        // base=2, place=0: ceil to nearest integer
        expect(CeilTo(4.1, 0, 2)).toBe(5);

        // base=2, place=-1: ceil to nearest 0.5
        expect(CeilTo(1.1, -1, 2)).toBeCloseTo(1.5, 10);
        expect(CeilTo(1.5, -1, 2)).toBeCloseTo(1.5, 10);

        // base=2, place=1: ceil to nearest 2
        expect(CeilTo(1, 1, 2)).toBe(2);
        expect(CeilTo(3, 1, 2)).toBe(4);
    });

    it('should handle zero', function ()
    {
        expect(CeilTo(0)).toBe(0);
        expect(CeilTo(0, 1)).toBe(0);
        expect(CeilTo(0, -1)).toBe(0);
    });

    it('should handle large values', function ()
    {
        expect(CeilTo(999.9)).toBe(1000);
        expect(CeilTo(100000.1)).toBe(100001);
    });

    it('should handle small fractional values', function ()
    {
        expect(CeilTo(0.001, -2)).toBeCloseTo(0.01, 10);
        expect(CeilTo(0.0, -2)).toBeCloseTo(0.0, 10);
    });

    it('should use place=0 when place is not provided', function ()
    {
        expect(CeilTo(3.2)).toBe(CeilTo(3.2, 0));
    });

    it('should use base=10 when base is not provided', function ()
    {
        expect(CeilTo(3.2, 1)).toBe(CeilTo(3.2, 1, 10));
    });
});
