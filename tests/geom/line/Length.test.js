var Length = require('../../../src/geom/line/Length');

describe('Phaser.Geom.Line.Length', function ()
{
    it('should return zero for a zero-length line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 0 };
        expect(Length(line)).toBe(0);
    });

    it('should return zero when start and end points are the same', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        expect(Length(line)).toBe(0);
    });

    it('should return the correct length for a horizontal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        expect(Length(line)).toBe(10);
    });

    it('should return the correct length for a vertical line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        expect(Length(line)).toBe(10);
    });

    it('should return the correct length for a diagonal line (3-4-5 triangle)', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3, y2: 4 };
        expect(Length(line)).toBe(5);
    });

    it('should return the correct length for a diagonal line (5-12-13 triangle)', function ()
    {
        var line = { x1: 0, y1: 0, x2: 5, y2: 12 };
        expect(Length(line)).toBe(13);
    });

    it('should work with negative coordinates', function ()
    {
        var line = { x1: -3, y1: -4, x2: 0, y2: 0 };
        expect(Length(line)).toBe(5);
    });

    it('should work when start point is greater than end point', function ()
    {
        var line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        expect(Length(line)).toBe(10);
    });

    it('should work with floating point coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1.5, y2: 2 };
        expect(Length(line)).toBeCloseTo(2.5, 10);
    });

    it('should return the same length regardless of direction', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 3, y2: 4 };
        var line2 = { x1: 3, y1: 4, x2: 0, y2: 0 };
        expect(Length(line1)).toBe(Length(line2));
    });

    it('should work with large coordinate values', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3000, y2: 4000 };
        expect(Length(line)).toBe(5000);
    });

    it('should work with non-origin start points', function ()
    {
        var line = { x1: 1, y1: 1, x2: 4, y2: 5 };
        expect(Length(line)).toBe(5);
    });
});
