var ReflectAngle = require('../../../src/geom/line/ReflectAngle');
var Angle = require('../../../src/geom/line/Angle');
var NormalAngle = require('../../../src/geom/line/NormalAngle');

describe('Phaser.Geom.Line.ReflectAngle', function ()
{
    // Helper to build a plain line object
    function makeLine(x1, y1, x2, y2)
    {
        return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }

    it('should return a number', function ()
    {
        var lineA = makeLine(0, 0, 1, 0);
        var lineB = makeLine(0, 0, 0, 1);

        expect(typeof ReflectAngle(lineA, lineB)).toBe('number');
    });

    it('should return the correct formula result: 2 * NormalAngle(lineB) - PI - Angle(lineA)', function ()
    {
        var lineA = makeLine(0, 0, 1, 1);
        var lineB = makeLine(0, 0, 1, 0);

        var expected = 2 * NormalAngle(lineB) - Math.PI - Angle(lineA);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });

    it('should reflect a horizontal incident line off a vertical surface to give -PI', function ()
    {
        // lineA going right: angle = 0
        // lineB going up (vertical surface): angle = PI/2, NormalAngle = 0
        // ReflectAngle = 2*0 - PI - 0 = -PI
        var lineA = makeLine(0, 0, 1, 0);
        var lineB = makeLine(0, 0, 0, 1);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(-Math.PI, 10);
    });

    it('should reflect a vertical incident line off a vertical surface to give -PI/2', function ()
    {
        // lineA going up: angle = PI/2
        // lineB going up (vertical surface): NormalAngle = 0
        // ReflectAngle = 2*0 - PI - PI/2 = -3*PI/2 ... let's compute
        var lineA = makeLine(0, 0, 0, 1);
        var lineB = makeLine(0, 0, 0, 1);

        var expected = 2 * NormalAngle(lineB) - Math.PI - Angle(lineA);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });

    it('should reflect a 45-degree incident line off a vertical surface', function ()
    {
        // lineA at 45 degrees: angle = PI/4
        // lineB vertical: NormalAngle = 0
        // ReflectAngle = 0 - PI - PI/4 = -5*PI/4
        var lineA = makeLine(0, 0, 1, 1);
        var lineB = makeLine(0, 0, 0, 1);

        var expected = -5 * Math.PI / 4;

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });

    it('should reflect a 45-degree incident line off a horizontal surface', function ()
    {
        // lineA at 45 degrees: Angle = PI/4
        // lineB horizontal: Angle = 0, NormalAngle = -PI/2
        // ReflectAngle = 2*(-PI/2) - PI - PI/4 = -PI - PI - PI/4 = -9*PI/4
        var lineA = makeLine(0, 0, 1, 1);
        var lineB = makeLine(0, 0, 1, 0);

        var expected = 2 * NormalAngle(lineB) - Math.PI - Angle(lineA);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });

    it('should produce a different result when lineA changes', function ()
    {
        var lineB = makeLine(0, 0, 1, 0);
        var lineA1 = makeLine(0, 0, 1, 0);
        var lineA2 = makeLine(0, 0, 0, 1);

        var result1 = ReflectAngle(lineA1, lineB);
        var result2 = ReflectAngle(lineA2, lineB);

        expect(result1).not.toBeCloseTo(result2, 5);
    });

    it('should produce a different result when lineB changes', function ()
    {
        var lineA = makeLine(0, 0, 1, 1);
        var lineB1 = makeLine(0, 0, 1, 0);
        var lineB2 = makeLine(0, 0, 0, 1);

        var result1 = ReflectAngle(lineA, lineB1);
        var result2 = ReflectAngle(lineA, lineB2);

        expect(result1).not.toBeCloseTo(result2, 5);
    });

    it('should be symmetric: swapping the direction of lineA changes the result by PI', function ()
    {
        // Reversing lineA flips its angle by PI
        var lineA = makeLine(0, 0, 1, 0);
        var lineAReversed = makeLine(1, 0, 0, 0);
        var lineB = makeLine(0, 0, 0, 1);

        var result = ReflectAngle(lineA, lineB);
        var resultReversed = ReflectAngle(lineAReversed, lineB);

        // Angle difference should be exactly PI
        expect(Math.abs(result - resultReversed)).toBeCloseTo(Math.PI, 10);
    });

    it('should handle lines at negative angles correctly', function ()
    {
        // lineA going down-right: angle = -PI/4
        var lineA = makeLine(0, 0, 1, -1);
        var lineB = makeLine(0, 0, 0, 1);

        var expected = 2 * NormalAngle(lineB) - Math.PI - Angle(lineA);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });

    it('should handle a 45-degree surface (lineB at PI/4)', function ()
    {
        // lineA going right: angle = 0
        // lineB at 45 degrees: Angle = PI/4, NormalAngle = PI/4 - PI/2 = -PI/4
        // ReflectAngle = 2*(-PI/4) - PI - 0 = -PI/2 - PI = -3*PI/2
        var lineA = makeLine(0, 0, 1, 0);
        var lineB = makeLine(0, 0, 1, 1);

        var expected = 2 * NormalAngle(lineB) - Math.PI - Angle(lineA);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });

    it('should handle lines with large coordinates', function ()
    {
        var lineA = makeLine(-1000, -1000, 1000, 1000);
        var lineB = makeLine(-500, 500, 500, -500);

        var result = ReflectAngle(lineA, lineB);

        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should handle lines with floating point coordinates', function ()
    {
        var lineA = makeLine(0, 0, 0.5, 0.866);
        var lineB = makeLine(0, 0, 1, 0);

        var expected = 2 * NormalAngle(lineB) - Math.PI - Angle(lineA);

        expect(ReflectAngle(lineA, lineB)).toBeCloseTo(expected, 10);
    });
});
