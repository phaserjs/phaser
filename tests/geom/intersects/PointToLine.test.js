var PointToLine = require('../../../src/geom/intersects/PointToLine');

describe('Phaser.Geom.Intersects.PointToLine', function ()
{
    var line;
    var point;

    beforeEach(function ()
    {
        // Horizontal line from (0,0) to (10,0)
        line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        point = { x: 5, y: 0 };
    });

    it('should return true when point is exactly on the line segment', function ()
    {
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should return true when point is at the start endpoint', function ()
    {
        point = { x: 0, y: 0 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should return true when point is at the end endpoint', function ()
    {
        point = { x: 10, y: 0 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should return false when point is far from the line', function ()
    {
        point = { x: 5, y: 10 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should use default lineThickness of 1 when not provided', function ()
    {
        // Point exactly 1 unit away from the line (borderline case)
        point = { x: 5, y: 1 };
        expect(PointToLine(point, line)).toBe(true);

        point = { x: 5, y: 1.001 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should return true when point is within custom lineThickness', function ()
    {
        point = { x: 5, y: 3 };
        expect(PointToLine(point, line, 5)).toBe(true);
    });

    it('should return false when point is outside custom lineThickness', function ()
    {
        point = { x: 5, y: 6 };
        expect(PointToLine(point, line, 5)).toBe(false);
    });

    it('should return false when line has zero length (degenerate line)', function ()
    {
        line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        point = { x: 5, y: 5 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should handle point beyond start endpoint (r < 0) within thickness', function ()
    {
        // Point is to the left of the line start, within 1 unit
        point = { x: -0.5, y: 0 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should handle point beyond start endpoint (r < 0) outside thickness', function ()
    {
        point = { x: -2, y: 0 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should handle point beyond end endpoint (r > 1) within thickness', function ()
    {
        point = { x: 10.5, y: 0 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should handle point beyond end endpoint (r > 1) outside thickness', function ()
    {
        point = { x: 12, y: 0 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should work with a diagonal line', function ()
    {
        line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        // Point exactly on the diagonal
        point = { x: 5, y: 5 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should return false for point off a diagonal line outside thickness', function ()
    {
        line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        point = { x: 5, y: 8 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should work with a vertical line', function ()
    {
        line = { x1: 5, y1: 0, x2: 5, y2: 10 };
        point = { x: 5, y: 5 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should return false for point off a vertical line outside thickness', function ()
    {
        line = { x1: 5, y1: 0, x2: 5, y2: 10 };
        point = { x: 7, y: 5 };
        expect(PointToLine(point, line)).toBe(false);
    });

    it('should return true for point off a vertical line within thickness', function ()
    {
        line = { x1: 5, y1: 0, x2: 5, y2: 10 };
        point = { x: 5.5, y: 5 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should work with negative coordinates', function ()
    {
        line = { x1: -10, y1: -10, x2: -5, y2: -5 };
        point = { x: -7, y: -7 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should handle larger lineThickness covering a wider area', function ()
    {
        line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        point = { x: 5, y: 9 };
        expect(PointToLine(point, line, 10)).toBe(true);

        point = { x: 5, y: 11 };
        expect(PointToLine(point, line, 10)).toBe(false);
    });

    it('should handle lineThickness of zero (point must be exactly on line)', function ()
    {
        point = { x: 5, y: 0 };
        expect(PointToLine(point, line, 0)).toBe(true);

        point = { x: 5, y: 0.001 };
        expect(PointToLine(point, line, 0)).toBe(false);
    });

    it('should treat endpoint regions as circular with correct radius', function ()
    {
        // Point is diagonally from start endpoint at exactly thickness distance
        var thickness = 5;
        // Distance from (0,0) to (3,4) is exactly 5
        point = { x: -3, y: -4 };
        expect(PointToLine(point, line, thickness)).toBe(true);

        // Slightly beyond
        point = { x: -3, y: -4.01 };
        expect(PointToLine(point, line, thickness)).toBe(false);
    });

    it('should handle floating point coordinates', function ()
    {
        line = { x1: 0.5, y1: 0.5, x2: 9.5, y2: 0.5 };
        point = { x: 5.0, y: 0.5 };
        expect(PointToLine(point, line)).toBe(true);
    });

    it('should handle line going in negative direction', function ()
    {
        line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        point = { x: 5, y: 0 };
        expect(PointToLine(point, line)).toBe(true);
    });
});
