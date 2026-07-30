var GetShortestDistance = require('../../../src/math/angle/GetShortestDistance');

describe('Phaser.Math.Angle.GetShortestDistance', function ()
{
    it('should return zero when both angles are equal', function ()
    {
        expect(GetShortestDistance(0, 0)).toBe(0);
        expect(GetShortestDistance(1, 1)).toBe(0);
        expect(GetShortestDistance(-1, -1)).toBe(0);
    });

    it('should return a positive value for clockwise rotation', function ()
    {
        var result = GetShortestDistance(0, 1);
        expect(result).toBeCloseTo(1, 10);
        expect(result).toBeGreaterThan(0);
    });

    it('should return a negative value for counter-clockwise rotation', function ()
    {
        var result = GetShortestDistance(1, 0);
        expect(result).toBeCloseTo(-1, 10);
        expect(result).toBeLessThan(0);
    });

    it('should return the shortest path across the pi boundary', function ()
    {
        var PI = Math.PI;
        // Going from just before pi to just past -pi should be a small positive step
        var result = GetShortestDistance(PI - 0.1, -(PI - 0.1));
        expect(result).toBeCloseTo(0.2, 5);
    });

    it('should return a value in the range [-pi, pi)', function ()
    {
        var PI = Math.PI;
        var angles = [0, 0.5, 1, 1.5, PI, -PI, -1, -0.5, 2, -2, PI / 2, -PI / 2];

        for (var i = 0; i < angles.length; i++)
        {
            for (var j = 0; j < angles.length; j++)
            {
                var result = GetShortestDistance(angles[i], angles[j]);
                expect(result).toBeGreaterThanOrEqual(-PI);
                expect(result).toBeLessThan(PI);
            }
        }
    });

    it('should handle angle1 of zero', function ()
    {
        expect(GetShortestDistance(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2, 10);
        expect(GetShortestDistance(0, -Math.PI / 2)).toBeCloseTo(-Math.PI / 2, 10);
    });

    it('should handle angle2 of zero', function ()
    {
        expect(GetShortestDistance(Math.PI / 2, 0)).toBeCloseTo(-Math.PI / 2, 10);
        expect(GetShortestDistance(-Math.PI / 2, 0)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should choose the shortest path between two angles near pi and -pi', function ()
    {
        var PI = Math.PI;
        // Distance from ~pi to ~-pi wraps to a small value rather than ~2*pi
        var result = GetShortestDistance(PI - 0.01, -(PI - 0.01));
        expect(Math.abs(result)).toBeCloseTo(0.02, 5);
    });

    it('should return pi distance for opposite angles', function ()
    {
        // pi/2 to -pi/2 is shortest distance of -pi (or pi)
        var result = GetShortestDistance(Math.PI / 2, -Math.PI / 2);
        expect(Math.abs(result)).toBeCloseTo(Math.PI, 10);
    });

    it('should handle large positive angles by wrapping', function ()
    {
        var PI = Math.PI;
        // 3*pi is equivalent to pi, and distance from 0 to pi wraps to -pi
        var result = GetShortestDistance(0, 3 * PI);
        expect(result).toBeGreaterThanOrEqual(-PI);
        expect(result).toBeLessThan(PI);
    });

    it('should handle large negative angles by wrapping', function ()
    {
        var PI = Math.PI;
        var result = GetShortestDistance(0, -3 * PI);
        expect(result).toBeGreaterThanOrEqual(-PI);
        expect(result).toBeLessThan(PI);
    });

    it('should handle floating point angle values', function ()
    {
        var result = GetShortestDistance(0.1, 0.4);
        expect(result).toBeCloseTo(0.3, 10);
    });

    it('should return a negative result when angle2 is less than angle1 within range', function ()
    {
        var result = GetShortestDistance(0.5, 0.2);
        expect(result).toBeCloseTo(-0.3, 10);
    });

    it('should handle negative angle inputs', function ()
    {
        var result = GetShortestDistance(-1, -0.5);
        expect(result).toBeCloseTo(0.5, 10);
    });

    it('should handle both angles being negative', function ()
    {
        var result = GetShortestDistance(-2, -1);
        expect(result).toBeCloseTo(1, 10);
    });
});
