var NormalX = require('../../../src/geom/line/NormalX');

describe('Phaser.Geom.Line.NormalX', function ()
{
    it('should return the x component of the normal vector for a horizontal line', function ()
    {
        // Horizontal line pointing right: angle = 0, normal x = cos(0 - PI/2) = cos(-PI/2) = 0
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        expect(NormalX(line)).toBeCloseTo(0, 10);
    });

    it('should return the x component of the normal vector for a vertical line', function ()
    {
        // Vertical line pointing down: angle = PI/2, normal x = cos(PI/2 - PI/2) = cos(0) = 1
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        expect(NormalX(line)).toBeCloseTo(1, 10);
    });

    it('should return the x component of the normal vector for a 45-degree line', function ()
    {
        // 45-degree line: angle = PI/4, normal x = cos(PI/4 - PI/2) = cos(-PI/4) = sqrt(2)/2
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        expect(NormalX(line)).toBeCloseTo(Math.SQRT2 / 2, 10);
    });

    it('should return the x component for a line pointing left', function ()
    {
        // Leftward line: angle = PI, normal x = cos(PI - PI/2) = cos(PI/2) = 0
        var line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        expect(NormalX(line)).toBeCloseTo(0, 10);
    });

    it('should return the x component for a line pointing upward', function ()
    {
        // Upward line: angle = -PI/2, normal x = cos(-PI/2 - PI/2) = cos(-PI) = -1
        var line = { x1: 0, y1: 10, x2: 0, y2: 0 };
        expect(NormalX(line)).toBeCloseTo(-1, 10);
    });

    it('should return the x component for a line at 135 degrees', function ()
    {
        // 135-degree line: angle = 3*PI/4, normal x = cos(3*PI/4 - PI/2) = cos(PI/4) = sqrt(2)/2
        var line = { x1: 0, y1: 0, x2: -10, y2: 10 };
        expect(NormalX(line)).toBeCloseTo(Math.SQRT2 / 2, 10);
    });

    it('should return a value between -1 and 1', function ()
    {
        var lines = [
            { x1: 0, y1: 0, x2: 10, y2: 5 },
            { x1: -5, y1: 3, x2: 7, y2: -2 },
            { x1: 100, y1: 200, x2: -100, y2: -200 },
            { x1: 1, y1: 1, x2: 2, y2: 100 }
        ];

        for (var i = 0; i < lines.length; i++)
        {
            var result = NormalX(lines[i]);
            expect(result).toBeGreaterThanOrEqual(-1);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should return a number', function ()
    {
        var line = { x1: 0, y1: 0, x2: 5, y2: 3 };
        expect(typeof NormalX(line)).toBe('number');
    });

    it('should be perpendicular to the line direction (dot product with NormalY equals zero)', function ()
    {
        // NormalX = cos(angle - PI/2), NormalY = sin(angle - PI/2)
        // LineDir = (cos(angle), sin(angle))
        // Dot product = cos(angle)*cos(angle - PI/2) + sin(angle)*sin(angle - PI/2) = cos(PI/2) = 0
        var line = { x1: 0, y1: 0, x2: 3, y2: 4 };
        var angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
        var nx = NormalX(line);
        var ny = Math.sin(angle - Math.PI / 2);
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        var dot = nx * dx + ny * dy;
        expect(dot).toBeCloseTo(0, 10);
    });

    it('should handle non-origin lines the same as origin lines with same direction', function ()
    {
        var line1 = { x1: 0, y1: 0, x2: 5, y2: 5 };
        var line2 = { x1: 10, y1: 20, x2: 15, y2: 25 };
        expect(NormalX(line1)).toBeCloseTo(NormalX(line2), 10);
    });

    it('should handle floating point coordinates', function ()
    {
        var line = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 0.5 };
        // Horizontal line, normal x should be 0
        expect(NormalX(line)).toBeCloseTo(0, 10);
    });

    it('should handle negative coordinates', function ()
    {
        var line = { x1: -10, y1: -10, x2: -5, y2: -10 };
        // Horizontal line pointing right, normal x should be 0
        expect(NormalX(line)).toBeCloseTo(0, 10);
    });
});
