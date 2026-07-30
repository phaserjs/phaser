var RotateAroundPoint = require('../../../src/geom/line/RotateAroundPoint');

describe('Phaser.Geom.Line.RotateAroundPoint', function ()
{
    it('should return the line object', function ()
    {
        var line = { x1: 1, y1: 0, x2: -1, y2: 0 };
        var point = { x: 0, y: 0 };
        var result = RotateAroundPoint(line, point, 0);

        expect(result).toBe(line);
    });

    it('should not change the line when angle is zero', function ()
    {
        var line = { x1: 10, y1: 5, x2: 20, y2: 15 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, 0);

        expect(line.x1).toBeCloseTo(10);
        expect(line.y1).toBeCloseTo(5);
        expect(line.x2).toBeCloseTo(20);
        expect(line.y2).toBeCloseTo(15);
    });

    it('should rotate 90 degrees around the origin', function ()
    {
        var line = { x1: 1, y1: 0, x2: 2, y2: 0 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, Math.PI / 2);

        expect(line.x1).toBeCloseTo(0);
        expect(line.y1).toBeCloseTo(1);
        expect(line.x2).toBeCloseTo(0);
        expect(line.y2).toBeCloseTo(2);
    });

    it('should rotate 180 degrees around the origin', function ()
    {
        var line = { x1: 1, y1: 0, x2: 2, y2: 0 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, Math.PI);

        expect(line.x1).toBeCloseTo(-1);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(-2);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should rotate 360 degrees and return to original position', function ()
    {
        var line = { x1: 3, y1: 4, x2: -2, y2: 7 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, Math.PI * 2);

        expect(line.x1).toBeCloseTo(3);
        expect(line.y1).toBeCloseTo(4);
        expect(line.x2).toBeCloseTo(-2);
        expect(line.y2).toBeCloseTo(7);
    });

    it('should rotate around a non-origin point', function ()
    {
        var line = { x1: 2, y1: 1, x2: 4, y2: 1 };
        var point = { x: 2, y: 1 };
        RotateAroundPoint(line, point, Math.PI / 2);

        // x1,y1 is the pivot point itself, should not move
        expect(line.x1).toBeCloseTo(2);
        expect(line.y1).toBeCloseTo(1);
        // x2,y2 is 2 units to the right of pivot, after 90deg rotation it should be 2 units below
        expect(line.x2).toBeCloseTo(2);
        expect(line.y2).toBeCloseTo(3);
    });

    it('should rotate around a point offset from the line', function ()
    {
        var line = { x1: 1, y1: 0, x2: -1, y2: 0 };
        var point = { x: 5, y: 5 };
        RotateAroundPoint(line, point, Math.PI / 2);

        // x1 relative to pivot: (-4, -5), after 90deg: (5, -4), absolute: (10, 1)
        expect(line.x1).toBeCloseTo(10);
        expect(line.y1).toBeCloseTo(1);
        // x2 relative to pivot: (-6, -5), after 90deg: (5, -6), absolute: (10, -1)
        expect(line.x2).toBeCloseTo(10);
        expect(line.y2).toBeCloseTo(-1);
    });

    it('should rotate by a negative angle', function ()
    {
        var line = { x1: 0, y1: 1, x2: 0, y2: 2 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, -Math.PI / 2);

        expect(line.x1).toBeCloseTo(1);
        expect(line.y1).toBeCloseTo(0);
        expect(line.x2).toBeCloseTo(2);
        expect(line.y2).toBeCloseTo(0);
    });

    it('should mutate the line in place', function ()
    {
        var line = { x1: 1, y1: 0, x2: 2, y2: 0 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, Math.PI / 4);

        expect(line.x1).not.toBeCloseTo(1);
        expect(line.y1).not.toBeCloseTo(0);
    });

    it('should handle a line at the pivot point', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        var point = { x: 5, y: 5 };
        RotateAroundPoint(line, point, Math.PI / 3);

        expect(line.x1).toBeCloseTo(5);
        expect(line.y1).toBeCloseTo(5);
        expect(line.x2).toBeCloseTo(5);
        expect(line.y2).toBeCloseTo(5);
    });

    it('should handle floating point angle values', function ()
    {
        var line = { x1: 1, y1: 0, x2: 0, y2: 1 };
        var point = { x: 0, y: 0 };
        RotateAroundPoint(line, point, 0.1234);

        var expectedX1 = Math.cos(0.1234);
        var expectedY1 = Math.sin(0.1234);
        var expectedX2 = -Math.sin(0.1234);
        var expectedY2 = Math.cos(0.1234);

        expect(line.x1).toBeCloseTo(expectedX1);
        expect(line.y1).toBeCloseTo(expectedY1);
        expect(line.x2).toBeCloseTo(expectedX2);
        expect(line.y2).toBeCloseTo(expectedY2);
    });
});
