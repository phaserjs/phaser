var GetShortestDistance = require('../../../src/geom/line/GetShortestDistance');

describe('Phaser.Geom.Line.GetShortestDistance', function ()
{
    it('should return false when the line has zero length', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var point = { x: 10, y: 10 };

        expect(GetShortestDistance(line, point)).toBe(false);
    });

    it('should return zero when the point lies on the line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var point = { x: 5, y: 0 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(0);
    });

    it('should return the perpendicular distance from a horizontal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var point = { x: 5, y: 3 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(3);
    });

    it('should return the perpendicular distance from a vertical line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        var point = { x: 4, y: 5 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(4);
    });

    it('should return a positive distance regardless of which side of the line the point is on', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var pointAbove = { x: 5, y: 3 };
        var pointBelow = { x: 5, y: -3 };

        expect(GetShortestDistance(line, pointAbove)).toBeCloseTo(3);
        expect(GetShortestDistance(line, pointBelow)).toBeCloseTo(3);
    });

    it('should return the correct distance from a diagonal line', function ()
    {
        // Line from (0,0) to (4,4), point at (0,4)
        // Perpendicular distance = |0*4 - 4*0 + 4*0 - 0*4| / sqrt(32) ... using formula
        // Expected: distance from point (0,4) to line y=x is |0 - 4| / sqrt(2) = 4/sqrt(2) ≈ 2.828
        var line = { x1: 0, y1: 0, x2: 4, y2: 4 };
        var point = { x: 0, y: 4 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(4 / Math.sqrt(2));
    });

    it('should work with negative coordinates', function ()
    {
        var line = { x1: -10, y1: 0, x2: 10, y2: 0 };
        var point = { x: 0, y: -5 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(5);
    });

    it('should work when the point is beyond the endpoints of the line segment', function ()
    {
        // The function treats the line as infinite, so distance is still perpendicular
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var point = { x: 20, y: 3 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(3);
    });

    it('should return zero when the point is at the start of the line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var point = { x: 0, y: 0 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(0);
    });

    it('should return zero when the point is at the end of the line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var point = { x: 10, y: 0 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(0);
    });

    it('should return a number (not false) when the line has non-zero length', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 0 };
        var point = { x: 0, y: 1 };
        var result = GetShortestDistance(line, point);

        expect(typeof result).toBe('number');
    });

    it('should handle floating point line coordinates', function ()
    {
        var line = { x1: 0.5, y1: 0.5, x2: 10.5, y2: 0.5 };
        var point = { x: 5.5, y: 3.5 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(3);
    });

    it('should return 1 for a unit distance from a horizontal unit line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 0 };
        var point = { x: 0.5, y: 1 };

        expect(GetShortestDistance(line, point)).toBeCloseTo(1);
    });
});
