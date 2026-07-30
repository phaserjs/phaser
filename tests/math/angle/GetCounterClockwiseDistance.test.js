var GetCounterClockwiseDistance = require('../../../src/math/angle/GetCounterClockwiseDistance');

var TAU = Math.PI * 2;

describe('Phaser.Math.Angle.GetCounterClockwiseDistance', function ()
{
    it('should return 0 when both angles are equal', function ()
    {
        expect(GetCounterClockwiseDistance(0, 0)).toBe(0);
        expect(GetCounterClockwiseDistance(Math.PI, Math.PI)).toBe(0);
        expect(GetCounterClockwiseDistance(-Math.PI / 2, -Math.PI / 2)).toBe(0);
    });

    it('should return 0 when angles differ by a full rotation', function ()
    {
        expect(GetCounterClockwiseDistance(0, TAU)).toBeCloseTo(0);
        expect(GetCounterClockwiseDistance(0, -TAU)).toBeCloseTo(0);
        expect(GetCounterClockwiseDistance(Math.PI, Math.PI + TAU)).toBeCloseTo(0);
    });

    it('should return -PI/2 when angle2 is PI/2 counter-clockwise from angle1', function ()
    {
        expect(GetCounterClockwiseDistance(0, -Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
        expect(GetCounterClockwiseDistance(Math.PI / 2, 0)).toBeCloseTo(-Math.PI / 2);
    });

    it('should return -3PI/2 when angle2 is PI/2 clockwise from angle1', function ()
    {
        expect(GetCounterClockwiseDistance(0, Math.PI / 2)).toBeCloseTo(-3 * Math.PI / 2);
    });

    it('should return -PI when angles are opposite (PI apart)', function ()
    {
        expect(GetCounterClockwiseDistance(0, Math.PI)).toBeCloseTo(-Math.PI);
        expect(GetCounterClockwiseDistance(Math.PI, 0)).toBeCloseTo(-Math.PI);
    });

    it('should return -PI/4 when angle2 is PI/4 counter-clockwise from angle1', function ()
    {
        expect(GetCounterClockwiseDistance(Math.PI / 4, 0)).toBeCloseTo(-Math.PI / 4);
        expect(GetCounterClockwiseDistance(0, -Math.PI / 4)).toBeCloseTo(-Math.PI / 4);
    });

    it('should always return a value in the range (-2PI, 0]', function ()
    {
        var angles = [ -TAU, -Math.PI, -Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2, Math.PI, TAU ];
        var i, j, result;

        for (i = 0; i < angles.length; i++)
        {
            for (j = 0; j < angles.length; j++)
            {
                result = GetCounterClockwiseDistance(angles[i], angles[j]);
                expect(result).toBeGreaterThan(-TAU - 1e-10);
                expect(result).toBeLessThanOrEqual(0 + 1e-10);
            }
        }
    });

    it('should handle negative angles correctly', function ()
    {
        expect(GetCounterClockwiseDistance(-Math.PI / 2, -Math.PI)).toBeCloseTo(-Math.PI / 2);
        expect(GetCounterClockwiseDistance(0, -Math.PI)).toBeCloseTo(-Math.PI);
    });

    it('should handle large angles by normalizing them', function ()
    {
        expect(GetCounterClockwiseDistance(0, 3 * TAU)).toBeCloseTo(0);
        expect(GetCounterClockwiseDistance(0, TAU + Math.PI / 2)).toBeCloseTo(-3 * Math.PI / 2);
    });

    it('should return the shorter counter-clockwise path for a quarter turn CCW', function ()
    {
        var result = GetCounterClockwiseDistance(Math.PI / 2, 0);

        expect(result).toBeCloseTo(-Math.PI / 2);
        expect(result).toBeGreaterThan(-Math.PI);
    });

    it('should return the long way around for a clockwise quarter turn', function ()
    {
        var result = GetCounterClockwiseDistance(0, Math.PI / 2);

        expect(result).toBeCloseTo(-3 * Math.PI / 2);
        expect(result).toBeLessThan(-Math.PI);
    });
});
