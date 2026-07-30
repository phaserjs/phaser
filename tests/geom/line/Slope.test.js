var Slope = require('../../../src/geom/line/Slope');

describe('Phaser.Geom.Line.Slope', function ()
{
    it('should return a positive slope for a rising line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };
        expect(Slope(line)).toBe(1);
    });

    it('should return a negative slope for a falling line', function ()
    {
        var line = { x1: 0, y1: 1, x2: 1, y2: 0 };
        expect(Slope(line)).toBe(-1);
    });

    it('should return zero for a horizontal line', function ()
    {
        var line = { x1: 0, y1: 5, x2: 10, y2: 5 };
        expect(Slope(line)).toBe(0);
    });

    it('should return Infinity for a vertical line', function ()
    {
        var line = { x1: 5, y1: 0, x2: 5, y2: 10 };
        expect(Slope(line)).toBe(Infinity);
    });

    it('should return -Infinity for a vertical line going downward', function ()
    {
        var line = { x1: 5, y1: 10, x2: 5, y2: 0 };
        expect(Slope(line)).toBe(-Infinity);
    });

    it('should return NaN when both points are identical', function ()
    {
        var line = { x1: 3, y1: 3, x2: 3, y2: 3 };
        expect(Slope(line)).toBeNaN();
    });

    it('should return the correct slope for a steep line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 10 };
        expect(Slope(line)).toBe(10);
    });

    it('should return the correct slope for a shallow line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 1 };
        expect(Slope(line)).toBe(0.1);
    });

    it('should handle negative coordinates', function ()
    {
        var line = { x1: -2, y1: -2, x2: 2, y2: 2 };
        expect(Slope(line)).toBe(1);
    });

    it('should handle a line defined right-to-left', function ()
    {
        var line = { x1: 4, y1: 4, x2: 0, y2: 0 };
        expect(Slope(line)).toBe(1);
    });

    it('should return a fractional slope correctly', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3, y2: 1 };
        expect(Slope(line)).toBeCloseTo(0.3333, 4);
    });

    it('should handle large coordinate values', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1000000, y2: 2000000 };
        expect(Slope(line)).toBe(2);
    });

    it('should handle floating point coordinates', function ()
    {
        var line = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 2.5 };
        expect(Slope(line)).toBe(2);
    });
});
