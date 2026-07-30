var SameDimensions = require('../../../src/geom/rectangle/SameDimensions');

describe('Phaser.Geom.Rectangle.SameDimensions', function ()
{
    it('should return true when both rectangles have the same width and height', function ()
    {
        var a = { width: 100, height: 200 };
        var b = { width: 100, height: 200 };

        expect(SameDimensions(a, b)).toBe(true);
    });

    it('should return false when widths differ', function ()
    {
        var a = { width: 100, height: 200 };
        var b = { width: 50, height: 200 };

        expect(SameDimensions(a, b)).toBe(false);
    });

    it('should return false when heights differ', function ()
    {
        var a = { width: 100, height: 200 };
        var b = { width: 100, height: 150 };

        expect(SameDimensions(a, b)).toBe(false);
    });

    it('should return false when both width and height differ', function ()
    {
        var a = { width: 100, height: 200 };
        var b = { width: 50, height: 100 };

        expect(SameDimensions(a, b)).toBe(false);
    });

    it('should return true when both rectangles have zero dimensions', function ()
    {
        var a = { width: 0, height: 0 };
        var b = { width: 0, height: 0 };

        expect(SameDimensions(a, b)).toBe(true);
    });

    it('should return true when comparing a rectangle to itself', function ()
    {
        var a = { width: 100, height: 200 };

        expect(SameDimensions(a, a)).toBe(true);
    });

    it('should use strict equality and return false for type-coercible but not strictly equal values', function ()
    {
        var a = { width: 100, height: 200 };
        var b = { width: '100', height: '200' };

        expect(SameDimensions(a, b)).toBe(false);
    });

    it('should return true for floating point dimensions that are exactly equal', function ()
    {
        var a = { width: 10.5, height: 20.75 };
        var b = { width: 10.5, height: 20.75 };

        expect(SameDimensions(a, b)).toBe(true);
    });

    it('should return false for floating point dimensions that differ slightly', function ()
    {
        var a = { width: 10.5, height: 20.75 };
        var b = { width: 10.5, height: 20.76 };

        expect(SameDimensions(a, b)).toBe(false);
    });

    it('should return true for negative dimensions that are equal', function ()
    {
        var a = { width: -100, height: -200 };
        var b = { width: -100, height: -200 };

        expect(SameDimensions(a, b)).toBe(true);
    });

    it('should return false when one rectangle has negative dimensions and the other positive', function ()
    {
        var a = { width: 100, height: 200 };
        var b = { width: -100, height: -200 };

        expect(SameDimensions(a, b)).toBe(false);
    });
});
