var BresenhamPoints = require('../../../src/geom/line/BresenhamPoints');

describe('Phaser.Geom.Line.BresenhamPoints', function ()
{
    it('should return an array', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 0 };
        var result = BresenhamPoints(line);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should include the start point', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 0 };
        var result = BresenhamPoints(line);
        expect(result[0].x).toBe(0);
        expect(result[0].y).toBe(0);
    });

    it('should include the end point', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 0 };
        var result = BresenhamPoints(line);
        var last = result[result.length - 1];
        expect(last.x).toBe(4);
        expect(last.y).toBe(0);
    });

    it('should return a single point for a zero-length line', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(1);
        expect(result[0].x).toBe(5);
        expect(result[0].y).toBe(5);
    });

    it('should return correct points for a horizontal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3, y2: 0 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(4);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[1]).toEqual({ x: 1, y: 0 });
        expect(result[2]).toEqual({ x: 2, y: 0 });
        expect(result[3]).toEqual({ x: 3, y: 0 });
    });

    it('should return correct points for a vertical line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 3 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(4);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[1]).toEqual({ x: 0, y: 1 });
        expect(result[2]).toEqual({ x: 0, y: 2 });
        expect(result[3]).toEqual({ x: 0, y: 3 });
    });

    it('should return correct points for a diagonal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 3, y2: 3 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(4);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[1]).toEqual({ x: 1, y: 1 });
        expect(result[2]).toEqual({ x: 2, y: 2 });
        expect(result[3]).toEqual({ x: 3, y: 3 });
    });

    it('should handle a line going left (negative x direction)', function ()
    {
        var line = { x1: 3, y1: 0, x2: 0, y2: 0 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(4);
        expect(result[0]).toEqual({ x: 3, y: 0 });
        expect(result[3]).toEqual({ x: 0, y: 0 });
    });

    it('should handle a line going upward (negative y direction)', function ()
    {
        var line = { x1: 0, y1: 3, x2: 0, y2: 0 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(4);
        expect(result[0]).toEqual({ x: 0, y: 3 });
        expect(result[3]).toEqual({ x: 0, y: 0 });
    });

    it('should use stepRate of 1 by default', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 0 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(5);
    });

    it('should apply stepRate to reduce point density', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 0 };
        var result = BresenhamPoints(line, 2);
        expect(result.length).toBe(3);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[1]).toEqual({ x: 2, y: 0 });
        expect(result[2]).toEqual({ x: 4, y: 0 });
    });

    it('should apply stepRate of 4 correctly', function ()
    {
        var line = { x1: 0, y1: 0, x2: 8, y2: 0 };
        var result = BresenhamPoints(line, 4);
        expect(result.length).toBe(3);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[1]).toEqual({ x: 4, y: 0 });
        expect(result[2]).toEqual({ x: 8, y: 0 });
    });

    it('should push results into a provided array', function ()
    {
        var line = { x1: 0, y1: 0, x2: 2, y2: 0 };
        var existing = [{ x: -1, y: -1 }];
        var result = BresenhamPoints(line, 1, existing);
        expect(result).toBe(existing);
        expect(result.length).toBe(4);
        expect(result[0]).toEqual({ x: -1, y: -1 });
        expect(result[1]).toEqual({ x: 0, y: 0 });
    });

    it('should return the provided results array', function ()
    {
        var line = { x1: 0, y1: 0, x2: 2, y2: 0 };
        var arr = [];
        var result = BresenhamPoints(line, 1, arr);
        expect(result).toBe(arr);
    });

    it('should round floating point coordinates before processing', function ()
    {
        var line = { x1: 0.4, y1: 0.4, x2: 2.6, y2: 0.4 };
        var result = BresenhamPoints(line);
        expect(result[0].x).toBe(0);
        expect(result[0].y).toBe(0);
        var last = result[result.length - 1];
        expect(last.x).toBe(3);
        expect(last.y).toBe(0);
    });

    it('should handle negative coordinates', function ()
    {
        var line = { x1: -2, y1: -2, x2: 0, y2: 0 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(3);
        expect(result[0]).toEqual({ x: -2, y: -2 });
        expect(result[2]).toEqual({ x: 0, y: 0 });
    });

    it('should return objects with x and y properties', function ()
    {
        var line = { x1: 0, y1: 0, x2: 2, y2: 2 };
        var result = BresenhamPoints(line);
        result.forEach(function (point)
        {
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });
    });

    it('should handle a line with more y travel than x travel', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 4 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(5);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[4]).toEqual({ x: 1, y: 4 });
    });

    it('should handle a line with more x travel than y travel', function ()
    {
        var line = { x1: 0, y1: 0, x2: 4, y2: 1 };
        var result = BresenhamPoints(line);
        expect(result.length).toBe(5);
        expect(result[0]).toEqual({ x: 0, y: 0 });
        expect(result[4]).toEqual({ x: 4, y: 1 });
    });

    it('should not mutate the original line object', function ()
    {
        var line = { x1: 1, y1: 2, x2: 5, y2: 6 };
        BresenhamPoints(line);
        expect(line.x1).toBe(1);
        expect(line.y1).toBe(2);
        expect(line.x2).toBe(5);
        expect(line.y2).toBe(6);
    });
});
