var Extend = require('../../../src/geom/line/Extend');

describe('Phaser.Geom.Line.Extend', function ()
{
    function makeLine (x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    it('should return the line instance', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        var result = Extend(line, 0, 0);
        expect(result).toBe(line);
    });

    it('should extend a horizontal line at both ends equally when right is omitted', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, 5);
        expect(line.x1).toBeCloseTo(-5);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(15);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should extend a horizontal line with explicit left and right amounts', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, 2, 3);
        expect(line.x1).toBeCloseTo(-2);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(13);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should extend a vertical line at both ends equally when right is omitted', function ()
    {
        var line = makeLine(0, 0, 0, 10);
        Extend(line, 5);
        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-5);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(15);
    });

    it('should extend a diagonal line correctly', function ()
    {
        // 3-4-5 right triangle: length = 5, unit vector = (0.6, 0.8)
        var line = makeLine(0, 0, 3, 4);
        Extend(line, 5, 5);
        expect(line.x1).toBeCloseTo(-3);
        expect(line.y1).toBeCloseTo(-4);
        expect(line.x2).toBeCloseTo(6);
        expect(line.y2).toBeCloseTo(8);
    });

    it('should only extend the start point when right is zero', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, 5, 0);
        expect(line.x1).toBeCloseTo(-5);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBe(10);
        expect(line.y2).toBe(0);
    });

    it('should only extend the end point when left is zero', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, 0, 5);
        expect(line.x1).toBe(0);
        expect(line.y1).toBe(0);
        expect(line.x2).toBeCloseTo(15);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should leave the line unchanged when both left and right are zero', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, 0, 0);
        expect(line.x1).toBe(0);
        expect(line.y1).toBe(0);
        expect(line.x2).toBe(10);
        expect(line.y2).toBe(0);
    });

    it('should shrink the line when negative values are passed', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, -2, -3);
        expect(line.x1).toBeCloseTo(2);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(7);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should extend symmetrically when right defaults to left', function ()
    {
        var line = makeLine(0, 0, 10, 0);
        Extend(line, 10);
        expect(line.x1).toBeCloseTo(-10);
        expect(line.x2).toBeCloseTo(20);
    });

    it('should work correctly with a line going in the negative direction', function ()
    {
        var line = makeLine(10, 0, 0, 0);
        Extend(line, 5, 5);
        // slopX = -10, slopY = 0, length = 10
        // x1 = 10 - (-10/10)*5 = 10 + 5 = 15
        // x2 = 0 + (-10/10)*5 = 0 - 5 = -5
        expect(line.x1).toBeCloseTo(15);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(-5);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should work with floating point coordinates', function ()
    {
        var line = makeLine(0.5, 0.5, 4.5, 0.5);
        // horizontal line, length = 4
        Extend(line, 1, 1);
        expect(line.x1).toBeCloseTo(-0.5);
        expect(line.y1).toBeCloseTo(0.5);
        expect(line.x2).toBeCloseTo(5.5);
        expect(line.y2).toBeCloseTo(0.5);
    });

    it('should extend a diagonal line with different left and right amounts', function ()
    {
        // 3-4-5 triangle, length = 5
        var line = makeLine(0, 0, 3, 4);
        Extend(line, 0, 10);
        // x2 = 3 + (3/5)*10 = 3 + 6 = 9
        // y2 = 4 + (4/5)*10 = 4 + 8 = 12
        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(9);
        expect(line.y2).toBeCloseTo(12);
    });

    it('should handle a line with large coordinates', function ()
    {
        var line = makeLine(1000, 1000, 2000, 1000);
        Extend(line, 500, 500);
        expect(line.x1).toBeCloseTo(500);
        expect(line.y1).toBeCloseTo(1000);
        expect(line.x2).toBeCloseTo(2500);
        expect(line.y2).toBeCloseTo(1000);
    });
});
