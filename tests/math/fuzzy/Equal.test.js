var Equal = require('../../../src/math/fuzzy/Equal');

describe('Phaser.Math.Fuzzy.Equal', function ()
{
    it('should return true when both values are identical', function ()
    {
        expect(Equal(5, 5)).toBe(true);
    });

    it('should return true when difference is less than default epsilon', function ()
    {
        expect(Equal(1, 1.00009)).toBe(true);
    });

    it('should return false when difference equals default epsilon', function ()
    {
        expect(Equal(1, 1.0002)).toBe(false);
    });

    it('should return false when difference is greater than default epsilon', function ()
    {
        expect(Equal(1, 1.001)).toBe(false);
    });

    it('should return true when difference is less than custom epsilon', function ()
    {
        expect(Equal(1, 1.04, 0.05)).toBe(true);
    });

    it('should return false when difference equals custom epsilon', function ()
    {
        expect(Equal(1, 1.05, 0.05)).toBe(false);
    });

    it('should return false when difference is greater than custom epsilon', function ()
    {
        expect(Equal(1, 1.1, 0.05)).toBe(false);
    });

    it('should handle negative values', function ()
    {
        expect(Equal(-5, -5)).toBe(true);
        expect(Equal(-5, -5.00009)).toBe(true);
        expect(Equal(-5, -4.999)).toBe(false);
    });

    it('should handle values of opposite sign', function ()
    {
        expect(Equal(-1, 1)).toBe(false);
        expect(Equal(-0.00004, 0.00004, 0.0001)).toBe(true);
    });

    it('should return true for zero compared to zero', function ()
    {
        expect(Equal(0, 0)).toBe(true);
    });

    it('should handle very small epsilon values', function ()
    {
        expect(Equal(1, 1.000001, 0.00001)).toBe(true);
        expect(Equal(1, 1.0001, 0.00001)).toBe(false);
    });

    it('should handle large numbers', function ()
    {
        expect(Equal(1000000, 1000000)).toBe(true);
        expect(Equal(1000000, 1000000.00009)).toBe(true);
        expect(Equal(1000000, 1000001)).toBe(false);
    });

    it('should use absolute difference so order of arguments does not matter', function ()
    {
        expect(Equal(1, 1.00009)).toBe(Equal(1.00009, 1));
        expect(Equal(5, 3)).toBe(Equal(3, 5));
    });
});
