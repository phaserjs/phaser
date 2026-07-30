var PerpSlope = require('../../../src/geom/line/PerpSlope');

describe('Phaser.Geom.Line.PerpSlope', function ()
{
    it('should return the negative reciprocal of the slope', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };
        expect(PerpSlope(line)).toBe(-1);
    });

    it('should return zero for a horizontal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 5 };
        expect(PerpSlope(line)).toBe(-0);
    });

    it('should return Infinity for a vertical line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 5, y2: 0 };
        expect(PerpSlope(line)).toBe(-Infinity);
    });

    it('should return the correct value for a positive slope', function ()
    {
        var line = { x1: 0, y1: 0, x2: 2, y2: 4 };
        expect(PerpSlope(line)).toBeCloseTo(-0.5);
    });

    it('should return the correct value for a negative slope', function ()
    {
        var line = { x1: 0, y1: 4, x2: 2, y2: 0 };
        expect(PerpSlope(line)).toBeCloseTo(0.5);
    });

    it('should handle lines with negative coordinates', function ()
    {
        var line = { x1: -2, y1: -2, x2: 2, y2: 2 };
        expect(PerpSlope(line)).toBe(-1);
    });

    it('should handle lines going in the negative direction', function ()
    {
        var line = { x1: 4, y1: 4, x2: 0, y2: 0 };
        expect(PerpSlope(line)).toBe(-1);
    });

    it('should handle a slope of 2', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 2 };
        expect(PerpSlope(line)).toBeCloseTo(-0.5);
    });

    it('should handle floating point coordinates', function ()
    {
        var line = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 2.5 };
        expect(PerpSlope(line)).toBeCloseTo(-0.5);
    });

    it('should handle a line with equal y values (vertical perpendicular)', function ()
    {
        var line = { x1: 1, y1: 3, x2: 5, y2: 3 };
        expect(isFinite(PerpSlope(line))).toBe(false);
    });

    it('should return -1 for a 45 degree line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3, y2: 3 };
        expect(PerpSlope(line)).toBe(-1);
    });

    it('should return 1 for a -45 degree line', function ()
    {
        var line = { x1: 0, y1: 3, x2: 3, y2: 0 };
        expect(PerpSlope(line)).toBe(1);
    });
});
