var Equals = require('../../../src/geom/line/Equals');

describe('Phaser.Geom.Line.Equals', function ()
{
    it('should return true when both lines have identical coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var toCompare = { x1: 0, y1: 0, x2: 10, y2: 10 };

        expect(Equals(line, toCompare)).toBe(true);
    });

    it('should return false when x1 values differ', function ()
    {
        var line = { x1: 1, y1: 0, x2: 10, y2: 10 };
        var toCompare = { x1: 0, y1: 0, x2: 10, y2: 10 };

        expect(Equals(line, toCompare)).toBe(false);
    });

    it('should return false when y1 values differ', function ()
    {
        var line = { x1: 0, y1: 1, x2: 10, y2: 10 };
        var toCompare = { x1: 0, y1: 0, x2: 10, y2: 10 };

        expect(Equals(line, toCompare)).toBe(false);
    });

    it('should return false when x2 values differ', function ()
    {
        var line = { x1: 0, y1: 0, x2: 99, y2: 10 };
        var toCompare = { x1: 0, y1: 0, x2: 10, y2: 10 };

        expect(Equals(line, toCompare)).toBe(false);
    });

    it('should return false when y2 values differ', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 99 };
        var toCompare = { x1: 0, y1: 0, x2: 10, y2: 10 };

        expect(Equals(line, toCompare)).toBe(false);
    });

    it('should return true when both lines are at the origin', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 0 };
        var toCompare = { x1: 0, y1: 0, x2: 0, y2: 0 };

        expect(Equals(line, toCompare)).toBe(true);
    });

    it('should return true when both lines have negative coordinates', function ()
    {
        var line = { x1: -10, y1: -20, x2: -5, y2: -1 };
        var toCompare = { x1: -10, y1: -20, x2: -5, y2: -1 };

        expect(Equals(line, toCompare)).toBe(true);
    });

    it('should return false when lines have opposite sign coordinates', function ()
    {
        var line = { x1: -10, y1: -20, x2: -5, y2: -1 };
        var toCompare = { x1: 10, y1: 20, x2: 5, y2: 1 };

        expect(Equals(line, toCompare)).toBe(false);
    });

    it('should return true when both lines have floating point coordinates', function ()
    {
        var line = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5 };
        var toCompare = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5 };

        expect(Equals(line, toCompare)).toBe(true);
    });

    it('should return false when floating point coordinates differ slightly', function ()
    {
        var line = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.5 };
        var toCompare = { x1: 1.5, y1: 2.5, x2: 3.5, y2: 4.500001 };

        expect(Equals(line, toCompare)).toBe(false);
    });

    it('should return true when a line is compared to itself', function ()
    {
        var line = { x1: 5, y1: 10, x2: 15, y2: 20 };

        expect(Equals(line, line)).toBe(true);
    });

    it('should use strict equality and not coerce types', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };
        var toCompare = { x1: '0', y1: '0', x2: '1', y2: '1' };

        expect(Equals(line, toCompare)).toBe(false);
    });
});
