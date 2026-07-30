var Equals = require('../../../src/geom/ellipse/Equals');

describe('Phaser.Geom.Ellipse.Equals', function ()
{
    it('should return true when both ellipses have identical properties', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };
        var b = { x: 10, y: 20, width: 100, height: 50 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return true when both ellipses are at origin with zero size', function ()
    {
        var a = { x: 0, y: 0, width: 0, height: 0 };
        var b = { x: 0, y: 0, width: 0, height: 0 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when x values differ', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };
        var b = { x: 99, y: 20, width: 100, height: 50 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when y values differ', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };
        var b = { x: 10, y: 99, width: 100, height: 50 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when width values differ', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };
        var b = { x: 10, y: 20, width: 200, height: 50 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when height values differ', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };
        var b = { x: 10, y: 20, width: 100, height: 99 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return false when all properties differ', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };
        var b = { x: 1, y: 2, width: 10, height: 5 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should work with negative values', function ()
    {
        var a = { x: -10, y: -20, width: 100, height: 50 };
        var b = { x: -10, y: -20, width: 100, height: 50 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when negative and positive values differ', function ()
    {
        var a = { x: -10, y: 20, width: 100, height: 50 };
        var b = { x: 10, y: 20, width: 100, height: 50 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should work with floating point values', function ()
    {
        var a = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };
        var b = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };

        expect(Equals(a, b)).toBe(true);
    });

    it('should return false when floating point values differ slightly', function ()
    {
        var a = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };
        var b = { x: 1.5, y: 2.5, width: 10.26, height: 5.75 };

        expect(Equals(a, b)).toBe(false);
    });

    it('should return true when comparing an ellipse to itself', function ()
    {
        var a = { x: 10, y: 20, width: 100, height: 50 };

        expect(Equals(a, a)).toBe(true);
    });
});
