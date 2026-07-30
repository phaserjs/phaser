var Rotate = require('../../../src/geom/line/Rotate');

describe('Phaser.Geom.Line.Rotate', function ()
{
    it('should return the same line object', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };

        var result = Rotate(line, 0);

        expect(result).toBe(line);
    });

    it('should not change the line when angle is zero', function ()
    {
        var line = { x1: 0, y1: -5, x2: 0, y2: 5 };

        Rotate(line, 0);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-5);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(5);
    });

    it('should rotate a horizontal line 90 degrees around its midpoint', function ()
    {
        var line = { x1: -5, y1: 0, x2: 5, y2: 0 };

        Rotate(line, Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-5);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(5);
    });

    it('should rotate a horizontal line 180 degrees around its midpoint', function ()
    {
        var line = { x1: -5, y1: 0, x2: 5, y2: 0 };

        Rotate(line, Math.PI);

        expect(line.x1).toBeCloseTo(5);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(-5);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should rotate a vertical line 90 degrees around its midpoint', function ()
    {
        var line = { x1: 0, y1: -5, x2: 0, y2: 5 };

        Rotate(line, Math.PI / 2);

        expect(line.x1).toBeCloseTo(5);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(-5);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should rotate around the midpoint, not the origin', function ()
    {
        var line = { x1: 5, y1: 0, x2: 15, y2: 0 };
        var midX = 10;
        var midY = 0;

        Rotate(line, Math.PI / 2);

        expect(line.x1).toBeCloseTo(midX);
        expect(line.y1).toBeCloseTo(midY - 5);
        expect(line.x2).toBeCloseTo(midX);
        expect(line.y2).toBeCloseTo(midY + 5);
    });

    it('should rotate a line by a full circle and return to original position', function ()
    {
        var line = { x1: -5, y1: 3, x2: 5, y2: 3 };
        var origX1 = line.x1;
        var origY1 = line.y1;
        var origX2 = line.x2;
        var origY2 = line.y2;

        Rotate(line, Math.PI * 2);

        expect(line.x1).toBeCloseTo(origX1);
        expect(line.y1).toBeCloseTo(origY1);
        expect(line.x2).toBeCloseTo(origX2);
        expect(line.y2).toBeCloseTo(origY2);
    });

    it('should handle negative angles', function ()
    {
        var line = { x1: -5, y1: 0, x2: 5, y2: 0 };

        Rotate(line, -Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(5);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(-5);
    });

    it('should handle a line that is a single point (zero length)', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };

        Rotate(line, Math.PI / 4);

        expect(line.x1).toBeCloseTo(5);
        expect(line.y1).toBeCloseTo(5);
        expect(line.x2).toBeCloseTo(5);
        expect(line.y2).toBeCloseTo(5);
    });

    it('should rotate a diagonal line 45 degrees around its midpoint', function ()
    {
        var line = { x1: -1, y1: -1, x2: 1, y2: 1 };

        Rotate(line, Math.PI / 4);

        var len = Math.sqrt(2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(-len);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(len);
    });

    it('should preserve the length of the line after rotation', function ()
    {
        var line = { x1: 0, y1: 0, x2: 6, y2: 8 };
        var origLen = Math.sqrt(
            Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2)
        );

        Rotate(line, 1.23);

        var newLen = Math.sqrt(
            Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2)
        );

        expect(newLen).toBeCloseTo(origLen);
    });

    it('should preserve the midpoint of the line after rotation', function ()
    {
        var line = { x1: 2, y1: 4, x2: 8, y2: 10 };
        var origMidX = (line.x1 + line.x2) / 2;
        var origMidY = (line.y1 + line.y2) / 2;

        Rotate(line, 0.75);

        var newMidX = (line.x1 + line.x2) / 2;
        var newMidY = (line.y1 + line.y2) / 2;

        expect(newMidX).toBeCloseTo(origMidX);
        expect(newMidY).toBeCloseTo(origMidY);
    });
});
