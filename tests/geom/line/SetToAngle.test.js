var SetToAngle = require('../../../src/geom/line/SetToAngle');

describe('Phaser.Geom.Line.SetToAngle', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 0, y2: 0 };
    });

    it('should set the start position of the line', function ()
    {
        SetToAngle(line, 10, 20, 0, 100);

        expect(line.x1).toBe(10);
        expect(line.y1).toBe(20);
    });

    it('should set the end position based on angle zero', function ()
    {
        SetToAngle(line, 0, 0, 0, 100);

        expect(line.x2).toBeCloseTo(100);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should set the end position based on angle PI/2 (pointing down)', function ()
    {
        SetToAngle(line, 0, 0, Math.PI / 2, 100);

        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(100);
    });

    it('should set the end position based on angle PI (pointing left)', function ()
    {
        SetToAngle(line, 0, 0, Math.PI, 100);

        expect(line.x2).toBeCloseTo(-100);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should set the end position based on angle 3*PI/2 (pointing up)', function ()
    {
        SetToAngle(line, 0, 0, 3 * Math.PI / 2, 100);

        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(-100);
    });

    it('should set the end position based on angle PI/4 (diagonal)', function ()
    {
        SetToAngle(line, 0, 0, Math.PI / 4, 100);

        expect(line.x2).toBeCloseTo(Math.cos(Math.PI / 4) * 100);
        expect(line.y2).toBeCloseTo(Math.sin(Math.PI / 4) * 100);
    });

    it('should offset end point by the start position', function ()
    {
        SetToAngle(line, 50, 30, 0, 100);

        expect(line.x2).toBeCloseTo(150);
        expect(line.y2).toBeCloseTo(30);
    });

    it('should handle a length of zero', function ()
    {
        SetToAngle(line, 10, 20, Math.PI / 4, 0);

        expect(line.x1).toBe(10);
        expect(line.y1).toBe(20);
        expect(line.x2).toBeCloseTo(10);
        expect(line.y2).toBeCloseTo(20);
    });

    it('should handle negative length', function ()
    {
        SetToAngle(line, 0, 0, 0, -100);

        expect(line.x2).toBeCloseTo(-100);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should handle negative start coordinates', function ()
    {
        SetToAngle(line, -50, -50, 0, 100);

        expect(line.x1).toBe(-50);
        expect(line.y1).toBe(-50);
        expect(line.x2).toBeCloseTo(50);
        expect(line.y2).toBeCloseTo(-50);
    });

    it('should handle floating point start coordinates', function ()
    {
        SetToAngle(line, 1.5, 2.5, 0, 10);

        expect(line.x1).toBe(1.5);
        expect(line.y1).toBe(2.5);
        expect(line.x2).toBeCloseTo(11.5);
        expect(line.y2).toBeCloseTo(2.5);
    });

    it('should return the updated line', function ()
    {
        var result = SetToAngle(line, 0, 0, 0, 100);

        expect(result).toBe(line);
    });

    it('should overwrite existing line values', function ()
    {
        line.x1 = 99;
        line.y1 = 99;
        line.x2 = 99;
        line.y2 = 99;

        SetToAngle(line, 5, 5, 0, 50);

        expect(line.x1).toBe(5);
        expect(line.y1).toBe(5);
        expect(line.x2).toBeCloseTo(55);
        expect(line.y2).toBeCloseTo(5);
    });
});
