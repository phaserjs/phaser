var Equals = require('../../../src/geom/rectangle/Equals');

describe('Phaser.Geom.Rectangle.Equals', function ()
{
    it('should return true when both rectangles have identical properties', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var toCompare = { x: 10, y: 20, width: 100, height: 50 };

        expect(Equals(rect, toCompare)).toBe(true);
    });

    it('should return true when both rectangles are at origin with zero size', function ()
    {
        var rect = { x: 0, y: 0, width: 0, height: 0 };
        var toCompare = { x: 0, y: 0, width: 0, height: 0 };

        expect(Equals(rect, toCompare)).toBe(true);
    });

    it('should return false when x values differ', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var toCompare = { x: 11, y: 20, width: 100, height: 50 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should return false when y values differ', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var toCompare = { x: 10, y: 21, width: 100, height: 50 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should return false when width values differ', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var toCompare = { x: 10, y: 20, width: 101, height: 50 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should return false when height values differ', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };
        var toCompare = { x: 10, y: 20, width: 100, height: 51 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should return false when all properties differ', function ()
    {
        var rect = { x: 0, y: 0, width: 10, height: 10 };
        var toCompare = { x: 5, y: 5, width: 20, height: 20 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should return true when comparing a rectangle to itself', function ()
    {
        var rect = { x: 10, y: 20, width: 100, height: 50 };

        expect(Equals(rect, rect)).toBe(true);
    });

    it('should return true with negative coordinate values', function ()
    {
        var rect = { x: -10, y: -20, width: 100, height: 50 };
        var toCompare = { x: -10, y: -20, width: 100, height: 50 };

        expect(Equals(rect, toCompare)).toBe(true);
    });

    it('should return false with negative coordinates that do not match', function ()
    {
        var rect = { x: -10, y: -20, width: 100, height: 50 };
        var toCompare = { x: -10, y: -21, width: 100, height: 50 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should return true with floating point values that match exactly', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };
        var toCompare = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };

        expect(Equals(rect, toCompare)).toBe(true);
    });

    it('should return false with floating point values that differ slightly', function ()
    {
        var rect = { x: 1.5, y: 2.5, width: 10.25, height: 5.75 };
        var toCompare = { x: 1.5, y: 2.5, width: 10.26, height: 5.75 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should use strict equality and return false for same area but different dimensions', function ()
    {
        var rect = { x: 0, y: 0, width: 10, height: 20 };
        var toCompare = { x: 0, y: 0, width: 20, height: 10 };

        expect(Equals(rect, toCompare)).toBe(false);
    });

    it('should use strict equality and return false when comparing number to string', function ()
    {
        var rect = { x: 0, y: 0, width: 10, height: 10 };
        var toCompare = { x: 0, y: 0, width: '10', height: 10 };

        expect(Equals(rect, toCompare)).toBe(false);
    });
});
