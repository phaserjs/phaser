var Offset = require('../../../src/geom/line/Offset');

describe('Phaser.Geom.Line.Offset', function ()
{
    it('should offset both endpoints by the given x and y values', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        Offset(line, 5, 5);
        expect(line.x1).toBe(5);
        expect(line.y1).toBe(5);
        expect(line.x2).toBe(15);
        expect(line.y2).toBe(15);
    });

    it('should return the modified line object', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var result = Offset(line, 5, 5);
        expect(result).toBe(line);
    });

    it('should not change the line when offset is zero', function ()
    {
        var line = { x1: 1, y1: 2, x2: 3, y2: 4 };
        Offset(line, 0, 0);
        expect(line.x1).toBe(1);
        expect(line.y1).toBe(2);
        expect(line.x2).toBe(3);
        expect(line.y2).toBe(4);
    });

    it('should work with negative offsets', function ()
    {
        var line = { x1: 10, y1: 10, x2: 20, y2: 20 };
        Offset(line, -5, -3);
        expect(line.x1).toBe(5);
        expect(line.y1).toBe(7);
        expect(line.x2).toBe(15);
        expect(line.y2).toBe(17);
    });

    it('should work with mixed positive and negative offsets', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        Offset(line, 5, -5);
        expect(line.x1).toBe(5);
        expect(line.y1).toBe(-5);
        expect(line.x2).toBe(15);
        expect(line.y2).toBe(5);
    });

    it('should work with floating point offsets', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };
        Offset(line, 0.5, 1.5);
        expect(line.x1).toBeCloseTo(0.5);
        expect(line.y1).toBeCloseTo(1.5);
        expect(line.x2).toBeCloseTo(1.5);
        expect(line.y2).toBeCloseTo(2.5);
    });

    it('should preserve the line length and angle after offset', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3, y2: 4 };
        var dx = line.x2 - line.x1;
        var dy = line.y2 - line.y1;
        Offset(line, 10, 20);
        expect(line.x2 - line.x1).toBe(dx);
        expect(line.y2 - line.y1).toBe(dy);
    });

    it('should work when offset causes negative coordinates', function ()
    {
        var line = { x1: 1, y1: 1, x2: 5, y2: 5 };
        Offset(line, -10, -10);
        expect(line.x1).toBe(-9);
        expect(line.y1).toBe(-9);
        expect(line.x2).toBe(-5);
        expect(line.y2).toBe(-5);
    });

    it('should work with large offset values', function ()
    {
        var line = { x1: 0, y1: 0, x2: 100, y2: 100 };
        Offset(line, 1000000, 2000000);
        expect(line.x1).toBe(1000000);
        expect(line.y1).toBe(2000000);
        expect(line.x2).toBe(1000100);
        expect(line.y2).toBe(2000100);
    });

    it('should only offset x when y is zero', function ()
    {
        var line = { x1: 5, y1: 5, x2: 15, y2: 15 };
        Offset(line, 3, 0);
        expect(line.x1).toBe(8);
        expect(line.y1).toBe(5);
        expect(line.x2).toBe(18);
        expect(line.y2).toBe(15);
    });

    it('should only offset y when x is zero', function ()
    {
        var line = { x1: 5, y1: 5, x2: 15, y2: 15 };
        Offset(line, 0, 7);
        expect(line.x1).toBe(5);
        expect(line.y1).toBe(12);
        expect(line.x2).toBe(15);
        expect(line.y2).toBe(22);
    });
});
