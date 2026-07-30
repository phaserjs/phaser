var LineToLine = require('../../../src/geom/intersects/LineToLine');

describe('Phaser.Geom.Intersects.LineToLine', function ()
{
    it('should return true when two lines intersect at a right angle', function ()
    {
        var line1 = { x1: 0, y1: 5, x2: 10, y2: 5 };
        var line2 = { x1: 5, y1: 0, x2: 5, y2: 10 };

        expect(LineToLine(line1, line2)).toBe(true);
    });

    it('should return false when two lines are parallel and horizontal', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 0, y1: 5, x2: 10, y2: 5 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when two lines are parallel and vertical', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 0, y2: 10 };
        var line2 = { x1: 5, y1: 0, x2: 5, y2: 10 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when two lines are parallel and diagonal', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var line2 = { x1: 0, y1: 5, x2: 10, y2: 15 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when lines do not overlap (would intersect if extended)', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 3, y2: 0 };
        var line2 = { x1: 5, y1: -5, x2: 5, y2: 5 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when line1 is zero length', function ()
    {
        var line1 = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var line2 = { x1: 0, y1: 0, x2: 10, y2: 10 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when line2 is zero length', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var line2 = { x1: 5, y1: 5, x2: 5, y2: 5 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when both lines are zero length', function ()
    {
        var line1 = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var line2 = { x1: 5, y1: 5, x2: 5, y2: 5 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should populate out object with intersection point', function ()
    {
        var line1 = { x1: 0, y1: 5, x2: 10, y2: 5 };
        var line2 = { x1: 5, y1: 0, x2: 5, y2: 10 };
        var out = { x: 0, y: 0 };

        LineToLine(line1, line2, out);

        expect(out.x).toBeCloseTo(5);
        expect(out.y).toBeCloseTo(5);
    });

    it('should not modify out object when lines do not intersect', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 0, y1: 5, x2: 10, y2: 5 };
        var out = { x: 99, y: 99 };

        LineToLine(line1, line2, out);

        expect(out.x).toBe(99);
        expect(out.y).toBe(99);
    });

    it('should work without an out object', function ()
    {
        var line1 = { x1: 0, y1: 5, x2: 10, y2: 5 };
        var line2 = { x1: 5, y1: 0, x2: 5, y2: 10 };

        expect(function () { LineToLine(line1, line2); }).not.toThrow();
        expect(LineToLine(line1, line2)).toBe(true);
    });

    it('should detect intersection at line endpoints', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 10, y1: 0, x2: 10, y2: 10 };

        expect(LineToLine(line1, line2)).toBe(true);
    });

    it('should detect intersection at the start of both lines', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 0, y1: 0, x2: 0, y2: 10 };

        expect(LineToLine(line1, line2)).toBe(true);
    });

    it('should return correct intersection point for diagonal lines', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var line2 = { x1: 0, y1: 10, x2: 10, y2: 0 };
        var out = { x: 0, y: 0 };

        var result = LineToLine(line1, line2, out);

        expect(result).toBe(true);
        expect(out.x).toBeCloseTo(5);
        expect(out.y).toBeCloseTo(5);
    });

    it('should return false when lines are collinear (same line)', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 0, y1: 0, x2: 10, y2: 0 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should return false when lines are collinear and overlapping', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 5, y1: 0, x2: 15, y2: 0 };

        expect(LineToLine(line1, line2)).toBe(false);
    });

    it('should handle negative coordinate lines', function ()
    {
        var line1 = { x1: -10, y1: 0, x2: 10, y2: 0 };
        var line2 = { x1: 0, y1: -10, x2: 0, y2: 10 };
        var out = { x: 0, y: 0 };

        var result = LineToLine(line1, line2, out);

        expect(result).toBe(true);
        expect(out.x).toBeCloseTo(0);
        expect(out.y).toBeCloseTo(0);
    });

    it('should handle floating point line coordinates', function ()
    {
        var line1 = { x1: 0, y1: 2.5, x2: 10, y2: 2.5 };
        var line2 = { x1: 3.5, y1: 0, x2: 3.5, y2: 10 };
        var out = { x: 0, y: 0 };

        var result = LineToLine(line1, line2, out);

        expect(result).toBe(true);
        expect(out.x).toBeCloseTo(3.5);
        expect(out.y).toBeCloseTo(2.5);
    });

    it('should return false when lines are T-shaped but do not overlap', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 4, y2: 0 };
        var line2 = { x1: 5, y1: -5, x2: 5, y2: 5 };

        expect(LineToLine(line1, line2)).toBe(false);
    });
});
