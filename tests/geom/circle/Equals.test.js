var Equals = require('../../../src/geom/circle/Equals');

describe('Phaser.Geom.Circle.Equals', function ()
{
    it('should return true when both circles have identical x, y and radius', function ()
    {
        var a = { x: 0, y: 0, radius: 10 };
        var b = { x: 0, y: 0, radius: 10 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when x values differ', function ()
    {
        var a = { x: 1, y: 0, radius: 10 };
        var b = { x: 2, y: 0, radius: 10 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when y values differ', function ()
    {
        var a = { x: 0, y: 1, radius: 10 };
        var b = { x: 0, y: 2, radius: 10 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when radius values differ', function ()
    {
        var a = { x: 0, y: 0, radius: 10 };
        var b = { x: 0, y: 0, radius: 20 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when all properties differ', function ()
    {
        var a = { x: 1, y: 2, radius: 3 };
        var b = { x: 4, y: 5, radius: 6 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return true when comparing a circle to itself', function ()
    {
        var a = { x: 5, y: 10, radius: 15 };

        expect(Equals(a, a)).toBe(true);
    });

    it('should return true with negative x and y values', function ()
    {
        var a = { x: -5, y: -10, radius: 15 };
        var b = { x: -5, y: -10, radius: 15 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when only x is negative on one circle', function ()
    {
        var a = { x: -5, y: 10, radius: 15 };
        var b = { x: 5, y: 10, radius: 15 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return true with floating point values', function ()
    {
        var a = { x: 1.5, y: 2.5, radius: 3.5 };
        var b = { x: 1.5, y: 2.5, radius: 3.5 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when floating point values differ slightly', function ()
    {
        var a = { x: 1.5, y: 2.5, radius: 3.5 };
        var b = { x: 1.5, y: 2.5, radius: 3.50001 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return true when all values are zero', function ()
    {
        var a = { x: 0, y: 0, radius: 0 };
        var b = { x: 0, y: 0, radius: 0 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return true with large values', function ()
    {
        var a = { x: 999999, y: 999999, radius: 999999 };
        var b = { x: 999999, y: 999999, radius: 999999 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return a boolean value', function ()
    {
        var a = { x: 0, y: 0, radius: 10 };
        var b = { x: 0, y: 0, radius: 10 };

        expect(typeof Equals(a, b)).toBe('boolean');
    });
});
