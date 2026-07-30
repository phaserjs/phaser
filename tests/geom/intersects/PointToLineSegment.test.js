var PointToLineSegment = require('../../../src/geom/intersects/PointToLineSegment');

describe('Phaser.Geom.Intersects.PointToLineSegment', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 10, y2: 0 };
    });

    it('should return true for a point exactly on the middle of a horizontal segment', function ()
    {
        var point = { x: 5, y: 0 };
        expect(PointToLineSegment(point, line)).toBe(true);
    });

    it('should return true for a point at the start endpoint', function ()
    {
        var point = { x: 0, y: 0 };
        expect(PointToLineSegment(point, line)).toBe(true);
    });

    it('should return true for a point at the end endpoint', function ()
    {
        var point = { x: 10, y: 0 };
        expect(PointToLineSegment(point, line)).toBe(true);
    });

    it('should return false for a point on the line extended beyond x2', function ()
    {
        var point = { x: 15, y: 0 };
        expect(PointToLineSegment(point, line)).toBe(false);
    });

    it('should return false for a point on the line extended before x1', function ()
    {
        var point = { x: -5, y: 0 };
        expect(PointToLineSegment(point, line)).toBe(false);
    });

    it('should return false for a point not on the line at all', function ()
    {
        var point = { x: 5, y: 5 };
        expect(PointToLineSegment(point, line)).toBe(false);
    });

    it('should return true for a point on a vertical segment', function ()
    {
        var vLine = { x1: 0, y1: 0, x2: 0, y2: 10 };
        var point = { x: 0, y: 5 };
        expect(PointToLineSegment(point, vLine)).toBe(true);
    });

    it('should return false for a point on the extension of a vertical segment', function ()
    {
        var vLine = { x1: 0, y1: 0, x2: 0, y2: 10 };
        var point = { x: 0, y: 15 };
        expect(PointToLineSegment(point, vLine)).toBe(false);
    });

    it('should return true for a point on a diagonal segment', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var point = { x: 5, y: 5 };
        expect(PointToLineSegment(point, diagLine)).toBe(true);
    });

    it('should return false for a point on a diagonal line extended beyond endpoint', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var point = { x: 15, y: 15 };
        expect(PointToLineSegment(point, diagLine)).toBe(false);
    });

    it('should return false for a point near but not on the diagonal segment', function ()
    {
        var diagLine = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var point = { x: 5, y: 7 };
        expect(PointToLineSegment(point, diagLine)).toBe(false);
    });

    it('should handle a segment defined with x2 < x1 (reversed direction)', function ()
    {
        var revLine = { x1: 10, y1: 0, x2: 0, y2: 0 };
        var point = { x: 5, y: 0 };
        expect(PointToLineSegment(point, revLine)).toBe(true);
    });

    it('should return false for a point outside a reversed segment', function ()
    {
        var revLine = { x1: 10, y1: 0, x2: 0, y2: 0 };
        var point = { x: 15, y: 0 };
        expect(PointToLineSegment(point, revLine)).toBe(false);
    });

    it('should work with negative coordinate segments', function ()
    {
        var negLine = { x1: -10, y1: -10, x2: -2, y2: -2 };
        var point = { x: -5, y: -5 };
        expect(PointToLineSegment(point, negLine)).toBe(true);
    });

    it('should return false for a point outside a negative coordinate segment', function ()
    {
        var negLine = { x1: -10, y1: -10, x2: -2, y2: -2 };
        var point = { x: 0, y: 0 };
        expect(PointToLineSegment(point, negLine)).toBe(false);
    });

    it('should return false when PointToLine itself returns false (point too far off line)', function ()
    {
        var point = { x: 5, y: 100 };
        expect(PointToLineSegment(point, line)).toBe(false);
    });
});
