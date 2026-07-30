var GetNormal = require('../../../src/geom/line/GetNormal');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Geom.Line.GetNormal', function ()
{
    // Helper to create a simple line object
    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    it('should return a Vector2 when no out parameter is provided', function ()
    {
        var line = makeLine(0, 0, 1, 0);
        var result = GetNormal(line);

        expect(result).toBeInstanceOf(Vector2);
    });

    it('should return the out object when one is provided', function ()
    {
        var line = makeLine(0, 0, 1, 0);
        var out = new Vector2();
        var result = GetNormal(line, out);

        expect(result).toBe(out);
    });

    it('should return a unit vector for a horizontal line pointing right', function ()
    {
        // angle = 0, normal angle = -PI/2, so x = cos(-PI/2) = 0, y = sin(-PI/2) = -1
        var line = makeLine(0, 0, 1, 0);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(0, 10);
        expect(result.y).toBeCloseTo(-1, 10);
    });

    it('should return a unit vector for a horizontal line pointing left', function ()
    {
        // angle = PI, normal angle = PI/2, so x = cos(PI/2) = 0, y = sin(PI/2) = 1
        var line = makeLine(1, 0, 0, 0);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(0, 10);
        expect(result.y).toBeCloseTo(1, 10);
    });

    it('should return a unit vector for a vertical line pointing up', function ()
    {
        // angle = PI/2, normal angle = 0, so x = cos(0) = 1, y = sin(0) = 0
        var line = makeLine(0, 0, 0, 1);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(1, 10);
        expect(result.y).toBeCloseTo(0, 10);
    });

    it('should return a unit vector for a vertical line pointing down', function ()
    {
        // angle = -PI/2, normal angle = -PI, so x = cos(-PI) = -1, y = sin(-PI) = 0
        var line = makeLine(0, 1, 0, 0);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(-1, 10);
        expect(result.y).toBeCloseTo(0, 10);
    });

    it('should return a unit vector for a 45-degree diagonal line', function ()
    {
        // angle = PI/4, normal angle = PI/4 - PI/2 = -PI/4
        // x = cos(-PI/4) = sqrt(2)/2, y = sin(-PI/4) = -sqrt(2)/2
        var line = makeLine(0, 0, 1, 1);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(Math.SQRT2 / 2, 10);
        expect(result.y).toBeCloseTo(-Math.SQRT2 / 2, 10);
    });

    it('should return a unit vector for a 135-degree diagonal line', function ()
    {
        // angle = 3*PI/4, normal angle = 3*PI/4 - PI/2 = PI/4
        // x = cos(PI/4) = sqrt(2)/2, y = sin(PI/4) = sqrt(2)/2
        var line = makeLine(0, 0, -1, 1);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(Math.SQRT2 / 2, 10);
        expect(result.y).toBeCloseTo(Math.SQRT2 / 2, 10);
    });

    it('should produce a vector with magnitude of 1 for any line', function ()
    {
        var lines = [
            makeLine(0, 0, 1, 0),
            makeLine(0, 0, 0, 1),
            makeLine(0, 0, 1, 1),
            makeLine(0, 0, 3, 4),
            makeLine(2, 5, -7, 3),
            makeLine(-1, -1, 1, 1)
        ];

        for (var i = 0; i < lines.length; i++)
        {
            var result = GetNormal(lines[i]);
            var magnitude = Math.sqrt(result.x * result.x + result.y * result.y);

            expect(magnitude).toBeCloseTo(1, 10);
        }
    });

    it('should write into a provided plain object with x and y properties', function ()
    {
        var line = makeLine(0, 0, 1, 0);
        var out = { x: 99, y: 99 };
        var result = GetNormal(line, out);

        expect(result).toBe(out);
        expect(out.x).toBeCloseTo(0, 10);
        expect(out.y).toBeCloseTo(-1, 10);
    });

    it('should work with a line that has negative coordinates', function ()
    {
        // Same direction as (0,0)->(1,0), just shifted
        var line = makeLine(-5, -3, -4, -3);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(0, 10);
        expect(result.y).toBeCloseTo(-1, 10);
    });

    it('should work with a line that has large coordinates', function ()
    {
        var line = makeLine(0, 0, 1000, 0);
        var result = GetNormal(line);

        expect(result.x).toBeCloseTo(0, 10);
        expect(result.y).toBeCloseTo(-1, 10);
    });

    it('should produce a normal perpendicular to the line direction', function ()
    {
        // The dot product of the line direction and its normal should be ~0
        var line = makeLine(0, 0, 3, 4);
        var dx = line.x2 - line.x1;
        var dy = line.y2 - line.y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        var dirX = dx / len;
        var dirY = dy / len;

        var normal = GetNormal(line);
        var dot = dirX * normal.x + dirY * normal.y;

        expect(dot).toBeCloseTo(0, 10);
    });
});
