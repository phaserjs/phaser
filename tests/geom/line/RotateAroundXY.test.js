var RotateAroundXY = require('../../../src/geom/line/RotateAroundXY');

describe('Phaser.Geom.Line.RotateAroundXY', function ()
{
    var line;

    beforeEach(function ()
    {
        line = { x1: 0, y1: 0, x2: 1, y2: 0 };
    });

    it('should return the line object', function ()
    {
        var result = RotateAroundXY(line, 0, 0, 0);

        expect(result).toBe(line);
    });

    it('should not change the line when angle is zero', function ()
    {
        line.x1 = 1;
        line.y1 = 2;
        line.x2 = 3;
        line.y2 = 4;

        RotateAroundXY(line, 0, 0, 0);

        expect(line.x1).toBeCloseTo(1);
        expect(line.y1).toBeCloseTo(2);
        expect(line.x2).toBeCloseTo(3);
        expect(line.y2).toBeCloseTo(4);
    });

    it('should rotate 90 degrees around origin', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(1);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(2);
    });

    it('should rotate 180 degrees around origin', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, Math.PI);

        expect(line.x1).toBeCloseTo(-1);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(-2);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should rotate 270 degrees around origin', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, 3 * Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-1);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(-2);
    });

    it('should rotate 360 degrees and return to original position', function ()
    {
        line.x1 = 3;
        line.y1 = 4;
        line.x2 = 5;
        line.y2 = 6;

        RotateAroundXY(line, 0, 0, 2 * Math.PI);

        expect(line.x1).toBeCloseTo(3);
        expect(line.y1).toBeCloseTo(4);
        expect(line.x2).toBeCloseTo(5);
        expect(line.y2).toBeCloseTo(6);
    });

    it('should rotate around a non-origin pivot point', function ()
    {
        line.x1 = 2;
        line.y1 = 1;
        line.x2 = 3;
        line.y2 = 1;

        RotateAroundXY(line, 1, 1, Math.PI / 2);

        expect(line.x1).toBeCloseTo(1);
        expect(line.y1).toBeCloseTo(2);
        expect(line.x2).toBeCloseTo(1);
        expect(line.y2).toBeCloseTo(3);
    });

    it('should rotate a point on the pivot and leave it unchanged', function ()
    {
        line.x1 = 5;
        line.y1 = 5;
        line.x2 = 10;
        line.y2 = 5;

        RotateAroundXY(line, 5, 5, Math.PI / 4);

        expect(line.x1).toBeCloseTo(5);
        expect(line.y1).toBeCloseTo(5);
    });

    it('should rotate using a negative angle', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, -Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-1);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(-2);
    });

    it('should rotate using a fractional angle', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 0;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, Math.PI / 4);

        expect(line.x1).toBeCloseTo(Math.SQRT1_2);
        expect(line.y1).toBeCloseTo(Math.SQRT1_2);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should mutate the original line object', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, Math.PI / 2);

        expect(line.x1).not.toBeCloseTo(1);
        expect(line.y1).not.toBeCloseTo(0);
    });

    it('should handle a line at the pivot point for both endpoints', function ()
    {
        line.x1 = 3;
        line.y1 = 3;
        line.x2 = 3;
        line.y2 = 3;

        RotateAroundXY(line, 3, 3, Math.PI / 3);

        expect(line.x1).toBeCloseTo(3);
        expect(line.y1).toBeCloseTo(3);
        expect(line.x2).toBeCloseTo(3);
        expect(line.y2).toBeCloseTo(3);
    });

    it('should handle large rotation angles correctly', function ()
    {
        line.x1 = 1;
        line.y1 = 0;
        line.x2 = 2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, 4 * Math.PI);

        expect(line.x1).toBeCloseTo(1);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(2);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should handle negative coordinates in the line', function ()
    {
        line.x1 = -1;
        line.y1 = 0;
        line.x2 = -2;
        line.y2 = 0;

        RotateAroundXY(line, 0, 0, Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-1);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(-2);
    });

    it('should handle a negative pivot point', function ()
    {
        line.x1 = 0;
        line.y1 = 0;
        line.x2 = 1;
        line.y2 = 0;

        RotateAroundXY(line, -1, 0, Math.PI / 2);

        expect(line.x1).toBeCloseTo(-1);
        expect(line.y1).toBeCloseTo(1);
        expect(line.x2).toBeCloseTo(-1);
        expect(line.y2).toBeCloseTo(2);
    });
});
