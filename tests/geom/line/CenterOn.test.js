var CenterOn = require('../../../src/geom/line/CenterOn');

describe('Phaser.Geom.Line.CenterOn', function ()
{
    it('should return the line object', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var result = CenterOn(line, 5, 5);

        expect(result).toBe(line);
    });

    it('should center a horizontal line on the given coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        CenterOn(line, 20, 5);

        expect(line.x1).toBe(15);
        expect(line.y1).toBe(5);
        expect(line.x2).toBe(25);
        expect(line.y2).toBe(5);
    });

    it('should center a vertical line on the given coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        CenterOn(line, 5, 20);

        expect(line.x1).toBe(5);
        expect(line.y1).toBe(15);
        expect(line.x2).toBe(5);
        expect(line.y2).toBe(25);
    });

    it('should center a diagonal line on the given coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        CenterOn(line, 0, 0);

        expect(line.x1).toBe(-5);
        expect(line.y1).toBe(-5);
        expect(line.x2).toBe(5);
        expect(line.y2).toBe(5);
    });

    it('should not move a line already centered on the target point', function ()
    {
        var line = { x1: -5, y1: -5, x2: 5, y2: 5 };
        CenterOn(line, 0, 0);

        expect(line.x1).toBe(-5);
        expect(line.y1).toBe(-5);
        expect(line.x2).toBe(5);
        expect(line.y2).toBe(5);
    });

    it('should work with negative coordinates', function ()
    {
        var line = { x1: -10, y1: -10, x2: 0, y2: 0 };
        CenterOn(line, -20, -20);

        expect(line.x1).toBe(-25);
        expect(line.y1).toBe(-25);
        expect(line.x2).toBe(-15);
        expect(line.y2).toBe(-15);
    });

    it('should work when centering on zero', function ()
    {
        var line = { x1: 10, y1: 20, x2: 30, y2: 40 };
        CenterOn(line, 0, 0);

        expect(line.x1).toBe(-10);
        expect(line.y1).toBe(-10);
        expect(line.x2).toBe(10);
        expect(line.y2).toBe(10);
    });

    it('should work with floating point coordinates', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };
        CenterOn(line, 0.5, 0.5);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(1);
        expect(line.y2).toBeCloseTo(1);
    });

    it('should preserve the length of the line after centering', function ()
    {
        var line = { x1: 0, y1: 0, x2: 6, y2: 8 };
        var origLenSq = Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2);

        CenterOn(line, 100, 200);

        var newLenSq = Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2);

        expect(newLenSq).toBeCloseTo(origLenSq);
    });

    it('should correctly center a zero-length line (point)', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        CenterOn(line, 10, 20);

        expect(line.x1).toBe(10);
        expect(line.y1).toBe(20);
        expect(line.x2).toBe(10);
        expect(line.y2).toBe(20);
    });

    it('should mutate the original line object', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        CenterOn(line, 50, 50);

        expect(line.x1).toBe(45);
        expect(line.y1).toBe(45);
        expect(line.x2).toBe(55);
        expect(line.y2).toBe(55);
    });
});
