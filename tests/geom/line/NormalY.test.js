var NormalY = require('../../../src/geom/line/NormalY');

describe('Phaser.Geom.Line.NormalY', function ()
{
    // NormalY returns Math.sin(Angle(line) - PI/2)
    // which equals -cos(Angle(line))

    it('should return -1 for a horizontal line pointing right', function ()
    {
        // angle = 0, sin(0 - PI/2) = -1
        var line = { x1: 0, y1: 0, x2: 10, y2: 0 };
        expect(NormalY(line)).toBeCloseTo(-1, 10);
    });

    it('should return 1 for a horizontal line pointing left', function ()
    {
        // angle = PI, sin(PI - PI/2) = sin(PI/2) = 1
        var line = { x1: 10, y1: 0, x2: 0, y2: 0 };
        expect(NormalY(line)).toBeCloseTo(1, 10);
    });

    it('should return 0 for a vertical line pointing down', function ()
    {
        // angle = PI/2, sin(PI/2 - PI/2) = sin(0) = 0
        var line = { x1: 0, y1: 0, x2: 0, y2: 10 };
        expect(NormalY(line)).toBeCloseTo(0, 10);
    });

    it('should return 0 for a vertical line pointing up', function ()
    {
        // angle = -PI/2, sin(-PI/2 - PI/2) = sin(-PI) = 0
        var line = { x1: 0, y1: 10, x2: 0, y2: 0 };
        expect(NormalY(line)).toBeCloseTo(0, 10);
    });

    it('should return -sqrt(2)/2 for a 45-degree diagonal line', function ()
    {
        // angle = PI/4, sin(PI/4 - PI/2) = sin(-PI/4) = -sqrt(2)/2
        var line = { x1: 0, y1: 0, x2: 10, y2: 10 };
        expect(NormalY(line)).toBeCloseTo(-Math.SQRT2 / 2, 10);
    });

    it('should return sqrt(2)/2 for a 135-degree diagonal line', function ()
    {
        // angle = 3*PI/4, sin(3PI/4 - PI/2) = sin(PI/4) = sqrt(2)/2
        var line = { x1: 0, y1: 0, x2: -10, y2: 10 };
        expect(NormalY(line)).toBeCloseTo(Math.SQRT2 / 2, 10);
    });

    it('should return a number between -1 and 1 inclusive', function ()
    {
        var lines = [
            { x1: 0, y1: 0, x2: 3, y2: 4 },
            { x1: -5, y1: 2, x2: 8, y2: -3 },
            { x1: 100, y1: 200, x2: 50, y2: 300 },
            { x1: 0, y1: 0, x2: 1, y2: 1000 }
        ];

        for (var i = 0; i < lines.length; i++)
        {
            var result = NormalY(lines[i]);
            expect(result).toBeGreaterThanOrEqual(-1);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should return a number for a zero-length line', function ()
    {
        // atan2(0, 0) = 0, so NormalY = sin(-PI/2) = -1
        var line = { x1: 5, y1: 5, x2: 5, y2: 5 };
        expect(typeof NormalY(line)).toBe('number');
    });

    it('should work with negative coordinates', function ()
    {
        // Same as horizontal right line, just translated
        var line = { x1: -10, y1: -5, x2: 0, y2: -5 };
        expect(NormalY(line)).toBeCloseTo(-1, 10);
    });

    it('should work with floating point coordinates', function ()
    {
        var line = { x1: 0.5, y1: 0.5, x2: 1.5, y2: 0.5 };
        expect(NormalY(line)).toBeCloseTo(-1, 10);
    });

    it('should return the correct value for a 30-degree line', function ()
    {
        // angle = PI/6, sin(PI/6 - PI/2) = sin(-PI/3) = -sqrt(3)/2
        var line = { x1: 0, y1: 0, x2: Math.cos(Math.PI / 6), y2: Math.sin(Math.PI / 6) };
        expect(NormalY(line)).toBeCloseTo(-Math.sqrt(3) / 2, 10);
    });

    it('should return the correct value for a 60-degree line', function ()
    {
        // angle = PI/3, sin(PI/3 - PI/2) = sin(-PI/6) = -0.5
        var line = { x1: 0, y1: 0, x2: Math.cos(Math.PI / 3), y2: Math.sin(Math.PI / 3) };
        expect(NormalY(line)).toBeCloseTo(-0.5, 10);
    });
});
