var GetClockwiseDistance = require('../../../src/math/angle/GetClockwiseDistance');

describe('Phaser.Math.Angle.GetClockwiseDistance', function ()
{
    it('should return zero when both angles are equal', function ()
    {
        expect(GetClockwiseDistance(0, 0)).toBeCloseTo(0);
        expect(GetClockwiseDistance(1, 1)).toBeCloseTo(0);
        expect(GetClockwiseDistance(-1, -1)).toBeCloseTo(0);
    });

    it('should return a positive distance for a clockwise step', function ()
    {
        var result = GetClockwiseDistance(0, Math.PI / 2);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should return 2pi minus the difference for a counter-clockwise step', function ()
    {
        var result = GetClockwiseDistance(Math.PI / 2, 0);
        expect(result).toBeCloseTo(2 * Math.PI - Math.PI / 2);
    });

    it('should return pi for opposite angles', function ()
    {
        expect(GetClockwiseDistance(0, Math.PI)).toBeCloseTo(Math.PI);
        expect(GetClockwiseDistance(Math.PI, 0)).toBeCloseTo(Math.PI);
    });

    it('should return a value in the range [0, 2pi)', function ()
    {
        var angles = [0, 0.1, 1, Math.PI / 4, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI - 0.001];
        var twoPi = 2 * Math.PI;

        for (var i = 0; i < angles.length; i++)
        {
            for (var j = 0; j < angles.length; j++)
            {
                var result = GetClockwiseDistance(angles[i], angles[j]);
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(twoPi);
            }
        }
    });

    it('should handle negative angles', function ()
    {
        var result = GetClockwiseDistance(-Math.PI / 2, 0);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should handle angles outside the [-pi, pi] range', function ()
    {
        var result = GetClockwiseDistance(0, 3 * Math.PI);
        expect(result).toBeCloseTo(Math.PI);
    });

    it('should handle large positive angles', function ()
    {
        var result = GetClockwiseDistance(0, 2 * Math.PI);
        expect(result).toBeCloseTo(0);
    });

    it('should handle large negative angles', function ()
    {
        var result = GetClockwiseDistance(0, -Math.PI / 2);
        expect(result).toBeCloseTo(3 * Math.PI / 2);
    });

    it('should be equivalent to normalizing (angle2 - angle1)', function ()
    {
        var pairs = [
            [0, 1],
            [1, 0],
            [-Math.PI, Math.PI / 3],
            [Math.PI / 4, 7 * Math.PI / 4]
        ];

        var twoPi = 2 * Math.PI;

        for (var i = 0; i < pairs.length; i++)
        {
            var a1 = pairs[i][0];
            var a2 = pairs[i][1];
            var result = GetClockwiseDistance(a1, a2);
            var diff = ((a2 - a1) % twoPi + twoPi) % twoPi;
            expect(result).toBeCloseTo(diff);
        }
    });
});
