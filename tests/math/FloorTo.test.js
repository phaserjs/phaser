var FloorTo = require('../../src/math/FloorTo');

describe('Phaser.Math.FloorTo', function ()
{
    it('should floor to integer by default (place=0, base=10)', function ()
    {
        expect(FloorTo(9.7)).toBe(9);
        expect(FloorTo(9.2)).toBe(9);
        expect(FloorTo(1.9)).toBe(1);
    });

    it('should return the value unchanged when it is already an integer', function ()
    {
        expect(FloorTo(5)).toBe(5);
        expect(FloorTo(0)).toBe(0);
        expect(FloorTo(-3)).toBe(-3);
    });

    it('should floor negative values correctly', function ()
    {
        expect(FloorTo(-1.1)).toBe(-2);
        expect(FloorTo(-9.9)).toBe(-10);
        expect(FloorTo(-0.1)).toBe(-1);
    });

    it('should floor to one decimal place with place=-1', function ()
    {
        expect(FloorTo(9.99, -1)).toBeCloseTo(9.9, 10);
        expect(FloorTo(1.55, -1)).toBeCloseTo(1.5, 10);
        expect(FloorTo(3.78, -1)).toBeCloseTo(3.7, 10);
    });

    it('should floor to two decimal places with place=-2', function ()
    {
        expect(FloorTo(9.999, -2)).toBeCloseTo(9.99, 10);
        expect(FloorTo(1.555, -2)).toBeCloseTo(1.55, 10);
    });

    it('should floor to tens with place=1', function ()
    {
        expect(FloorTo(99, 1)).toBe(90);
        expect(FloorTo(55, 1)).toBe(50);
        expect(FloorTo(19, 1)).toBe(10);
    });

    it('should floor to hundreds with place=2', function ()
    {
        expect(FloorTo(999, 2)).toBe(900);
        expect(FloorTo(550, 2)).toBe(500);
        expect(FloorTo(199, 2)).toBe(100);
    });

    it('should work with a custom base', function ()
    {
        expect(FloorTo(7, 0, 2)).toBe(7);
        expect(FloorTo(8, 1, 2)).toBe(8);
        expect(FloorTo(9, 1, 2)).toBe(8);
    });

    it('should floor to zero when value is between 0 and 1 with place=0', function ()
    {
        expect(FloorTo(0.9)).toBe(0);
        expect(FloorTo(0.1)).toBe(0);
        expect(FloorTo(0.5)).toBe(0);
    });

    it('should handle zero value', function ()
    {
        expect(FloorTo(0)).toBe(0);
        expect(FloorTo(0, 1)).toBe(0);
        expect(FloorTo(0, -1)).toBe(0);
    });

    it('should handle large values', function ()
    {
        expect(FloorTo(12345.678, 0)).toBe(12345);
        expect(FloorTo(12345.678, 2)).toBe(12300);
    });

    it('should handle negative values with decimal place', function ()
    {
        expect(FloorTo(-1.55, -1)).toBeCloseTo(-1.6, 10);
        expect(FloorTo(-9.91, -1)).toBeCloseTo(-10.0, 10);
    });
});
