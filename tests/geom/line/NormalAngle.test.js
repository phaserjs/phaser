var NormalAngle = require('../../../src/geom/line/NormalAngle');

describe('Phaser.Geom.Line.NormalAngle', function ()
{
    it('should return -PI/2 for a horizontal line pointing right', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 0 };

        expect(NormalAngle(line)).toBeCloseTo(-Math.PI / 2, 10);
    });

    it('should return 0 for a vertical line pointing up', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: 1 };

        expect(NormalAngle(line)).toBeCloseTo(0, 10);
    });

    it('should return -PI/4 for a 45-degree line going up-right', function ()
    {
        var line = { x1: 0, y1: 0, x2: 1, y2: 1 };

        expect(NormalAngle(line)).toBeCloseTo(-Math.PI / 4, 10);
    });

    it('should return PI/2 for a horizontal line pointing left', function ()
    {
        var line = { x1: 0, y1: 0, x2: -1, y2: 0 };

        expect(NormalAngle(line)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should return PI for a vertical line pointing down', function ()
    {
        var line = { x1: 0, y1: 0, x2: 0, y2: -1 };

        var result = NormalAngle(line);

        // atan2(-1,0) = -PI/2, normal = -PI/2 - PI/2 = -PI, wrapped to -PI (boundary)
        expect(Math.abs(result)).toBeCloseTo(Math.PI, 10);
    });

    it('should return 3*PI/4 for a line going down-left, wrapping the result', function ()
    {
        // atan2(-1,-1) = -3*PI/4, normal = -3*PI/4 - PI/2 = -5*PI/4, wrapped to 3*PI/4
        var line = { x1: 0, y1: 0, x2: -1, y2: -1 };

        expect(NormalAngle(line)).toBeCloseTo(3 * Math.PI / 4, 10);
    });

    it('should return a value within [-PI, PI]', function ()
    {
        var lines = [
            { x1: 0, y1: 0, x2: 1, y2: 0 },
            { x1: 0, y1: 0, x2: 0, y2: 1 },
            { x1: 0, y1: 0, x2: -1, y2: 0 },
            { x1: 0, y1: 0, x2: 0, y2: -1 },
            { x1: 0, y1: 0, x2: 1, y2: 1 },
            { x1: 0, y1: 0, x2: -1, y2: 1 },
            { x1: 0, y1: 0, x2: 1, y2: -1 },
            { x1: 0, y1: 0, x2: -1, y2: -1 }
        ];

        for (var i = 0; i < lines.length; i++)
        {
            var result = NormalAngle(lines[i]);

            expect(result).toBeGreaterThanOrEqual(-Math.PI);
            expect(result).toBeLessThanOrEqual(Math.PI);
        }
    });

    it('should return a number', function ()
    {
        var line = { x1: 0, y1: 0, x2: 5, y2: 5 };

        expect(typeof NormalAngle(line)).toBe('number');
    });

    it('should work with non-origin start points', function ()
    {
        // Same direction as (0,0)->(1,0), just translated
        var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
        var line2 = { x1: 5, y1: 3, x2: 6, y2: 3 };

        expect(NormalAngle(line1)).toBeCloseTo(NormalAngle(line2), 10);
    });

    it('should work with longer line lengths giving the same angle', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 1, y2: 1 };
        var line2 = { x1: 0, y1: 0, x2: 100, y2: 100 };

        expect(NormalAngle(line1)).toBeCloseTo(NormalAngle(line2), 10);
    });

    it('should return PI/4 for a line going up-left at 135 degrees', function ()
    {
        // atan2(1,-1) = 3*PI/4, normal = 3*PI/4 - PI/2 = PI/4
        var line = { x1: 0, y1: 0, x2: -1, y2: 1 };

        expect(NormalAngle(line)).toBeCloseTo(Math.PI / 4, 10);
    });

    it('should return -3*PI/4 for a line going down-right', function ()
    {
        // atan2(-1,1) = -PI/4, normal = -PI/4 - PI/2 = -3*PI/4
        var line = { x1: 0, y1: 0, x2: 1, y2: -1 };

        expect(NormalAngle(line)).toBeCloseTo(-3 * Math.PI / 4, 10);
    });
});
