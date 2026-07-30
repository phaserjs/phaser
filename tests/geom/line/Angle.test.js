var Angle = require('../../../src/geom/line/Angle');

describe('Phaser.Geom.Line.Angle', function ()
{
    it('should return zero for a horizontal line pointing right', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        expect(Angle(line)).toBe(0);
    });

    it('should return PI for a horizontal line pointing left', function ()
    {
        var line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        expect(Angle(line)).toBeCloseTo(Math.PI, 10);
    });

    it('should return PI/2 for a vertical line pointing down', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        expect(Angle(line)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should return -PI/2 for a vertical line pointing up', function ()
    {
        var line = { x1: 0, y1: 10, x2: 0, y2: 0 };
        expect(Angle(line)).toBeCloseTo(-Math.PI / 2, 10);
    });

    it('should return PI/4 for a 45-degree diagonal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        expect(Angle(line)).toBeCloseTo(Math.PI / 4, 10);
    });

    it('should return -PI/4 for a -45-degree diagonal line', function ()
    {
        var line = { x1: 0, y1: 10, x2: 10, y2: 0 };
        expect(Angle(line)).toBeCloseTo(-Math.PI / 4, 10);
    });

    it('should return 3*PI/4 for a 135-degree diagonal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: -10, y2: 10 };
        expect(Angle(line)).toBeCloseTo(3 * Math.PI / 4, 10);
    });

    it('should return -3*PI/4 for a -135-degree diagonal line', function ()
    {
        var line = { x1: 0, y1: 0, x2: -10, y2: -10 };
        expect(Angle(line)).toBeCloseTo(-3 * Math.PI / 4, 10);
    });

    it('should return zero when start and end points are the same', function ()
    {
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        expect(Angle(line)).toBe(0);
    });

    it('should work with negative coordinates', function ()
    {
        var line = { x1: -10, y1: -10, x2: -5, y2: -10 };
        expect(Angle(line)).toBe(0);
    });

    it('should work with floating point coordinates', function ()
    {
        var line = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 1.5 };
        expect(Angle(line)).toBeCloseTo(Math.PI / 4, 10);
    });

    it('should return a number', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };
        expect(typeof Angle(line)).toBe('number');
    });

    it('should return values in the range (-PI, PI]', function ()
    {
        var angles = [
            { x1: 1, y1: 0, x2: 2, y2: 0 },
            { x1: 0, y1: 0, x2: 1, y2: 1 },
            { x1: 0, y1: 0, x2: 0, y2: 1 },
            { x1: 0, y1: 0, x2: -1, y2: 1 },
            { x1: 0, y1: 0, x2: -1, y2: 0 },
            { x1: 0, y1: 0, x2: -1, y2: -1 },
            { x1: 0, y1: 0, x2: 0, y2: -1 },
            { x1: 0, y1: 0, x2: 1, y2: -1 }
        ];

        for (var i = 0; i < angles.length; i++)
        {
            var result = Angle(angles[i]);
            expect(result).toBeGreaterThan(-Math.PI - 0.0001);
            expect(result).toBeLessThanOrEqual(Math.PI + 0.0001);
        }
    });

    it('should use atan2 which correctly handles quadrant determination', function ()
    {
        var q1 = Angle({ x1: 0, y1: 0, x2: 1, y2: 1 });
        var q2 = Angle({ x1: 0, y1: 0, x2: -1, y2: 1 });
        var q3 = Angle({ x1: 0, y1: 0, x2: -1, y2: -1 });
        var q4 = Angle({ x1: 0, y1: 0, x2: 1, y2: -1 });

        expect(q1).toBeCloseTo(Math.PI / 4, 10);
        expect(q2).toBeCloseTo(3 * Math.PI / 4, 10);
        expect(q3).toBeCloseTo(-3 * Math.PI / 4, 10);
        expect(q4).toBeCloseTo(-Math.PI / 4, 10);
    });
});
