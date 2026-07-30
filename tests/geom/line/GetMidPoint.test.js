var GetMidPoint = require('../../../src/geom/line/GetMidPoint');

describe('Phaser.Geom.Line.GetMidPoint', function ()
{
    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var result = GetMidPoint(line);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should return the midpoint of a simple horizontal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(5);
        expect(result.y).toBe(0);
    });

    it('should return the midpoint of a simple vertical line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(0);
        expect(result.y).toBe(5);
    });

    it('should return the midpoint of a diagonal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(5);
        expect(result.y).toBe(5);
    });

    it('should populate a provided out object', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        var out = { x: 0, y: 0 };
        var result = GetMidPoint(line, out);

        expect(result).toBe(out);
        expect(out.x).toBe(5);
        expect(out.y).toBe(5);
    });

    it('should return the same out object that was passed in', function ()
    {
        var line = { x1: 2, y1: 4, x2: 8, y2: 12 };
        var out = { x: 0, y: 0 };
        var result = GetMidPoint(line, out);

        expect(result).toBe(out);
    });

    it('should work with negative coordinates', function ()
    {
        var line = { x1: -10, y1: -10, x2: 10, y2: 10 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should work with lines in negative space', function ()
    {
        var line = { x1: -20, y1: -30, x2: -10, y2: -10 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(-15);
        expect(result.y).toBe(-20);
    });

    it('should return the start point when both endpoints are the same', function ()
    {
        var line = { x1: 5, y1: 7, x2: 5, y2: 7 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(5);
        expect(result.y).toBe(7);
    });

    it('should work with floating point coordinates', function ()
    {
        var line = { x1: 1.5, y1: 2.5, x2: 4.5, y2: 6.5 };
        var result = GetMidPoint(line);

        expect(result.x).toBeCloseTo(3);
        expect(result.y).toBeCloseTo(4.5);
    });

    it('should work with large coordinate values', function ()
    {
        var line = { x1: 1000000, y1: 2000000, x2: 3000000, y2: 4000000 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(2000000);
        expect(result.y).toBe(3000000);
    });

    it('should work when x1 is greater than x2', function ()
    {
        var line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(5);
        expect(result.y).toBe(0);
    });

    it('should work when y1 is greater than y2', function ()
    {
        var line = { x1: 0, y1: 10, x2: 0, y2: 0 };
        var result = GetMidPoint(line);

        expect(result.x).toBe(0);
        expect(result.y).toBe(5);
    });
});
