var Floor = require('../../../src/math/fuzzy/Floor');

describe('Phaser.Math.Fuzzy.Floor', function ()
{
    it('should floor a clean integer value', function ()
    {
        expect(Floor(3)).toBe(3);
        expect(Floor(0)).toBe(0);
        expect(Floor(-1)).toBe(-1);
    });

    it('should floor a standard floating point value', function ()
    {
        expect(Floor(3.4)).toBe(3);
        expect(Floor(3.6)).toBe(3);
    });

    it('should floor a value just below an integer without fuzzy correction', function ()
    {
        expect(Floor(2.5)).toBe(2);
    });

    it('should floor a value within default epsilon of the next integer up', function ()
    {
        expect(Floor(2.9999)).toBe(3);
        expect(Floor(2.99999)).toBe(3);
    });

    it('should floor a value just outside default epsilon correctly', function ()
    {
        expect(Floor(2.999)).toBe(2);
    });

    it('should use the default epsilon of 0.0001 when not specified', function ()
    {
        expect(Floor(4.9999)).toBe(5);
        expect(Floor(4.9998)).toBe(4);
    });

    it('should use a custom epsilon value', function ()
    {
        expect(Floor(2.99, 0.01)).toBe(3);
        expect(Floor(2.98, 0.01)).toBe(2);
    });

    it('should work with epsilon of zero', function ()
    {
        expect(Floor(2.9999, 0)).toBe(2);
        expect(Floor(3.0, 0)).toBe(3);
    });

    it('should work with a large epsilon', function ()
    {
        expect(Floor(2.5, 0.6)).toBe(3);
        expect(Floor(2.3, 0.6)).toBe(2);
    });

    it('should handle zero value', function ()
    {
        expect(Floor(0)).toBe(0);
        expect(Floor(0, 0.0001)).toBe(0);
    });

    it('should handle negative values', function ()
    {
        expect(Floor(-1.5)).toBe(-2);
        expect(Floor(-1.0)).toBe(-1);
    });

    it('should handle negative values within epsilon of the next integer up', function ()
    {
        expect(Floor(-1.9999)).toBe(-2);
        expect(Floor(-0.9999)).toBe(-1);
    });

    it('should handle very large values', function ()
    {
        expect(Floor(1000000.9999)).toBe(1000001);
        expect(Floor(1000000.5)).toBe(1000000);
    });

    it('should handle very small positive values', function ()
    {
        expect(Floor(0.0001)).toBe(0);
        expect(Floor(0.00009, 0.0001)).toBe(0);
    });

    it('should return a number type', function ()
    {
        expect(typeof Floor(3.5)).toBe('number');
    });
});
