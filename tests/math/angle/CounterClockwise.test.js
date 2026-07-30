var CounterClockwise = require('../../../src/math/angle/CounterClockwise');

describe('Phaser.Math.Angle.CounterClockwise', function ()
{
    var TAU = Math.PI * 2;
    var PI_OVER_2 = Math.PI / 2;

    it('should convert 0 (East, clockwise) to 3PI/2 (East, counter-clockwise)', function ()
    {
        expect(CounterClockwise(0)).toBeCloseTo(3 * Math.PI / 2, 10);
    });

    it('should convert PI/2 (South, clockwise) to PI (South, counter-clockwise)', function ()
    {
        expect(CounterClockwise(PI_OVER_2)).toBeCloseTo(Math.PI, 10);
    });

    it('should convert PI (West, clockwise) to PI/2 (West, counter-clockwise)', function ()
    {
        expect(CounterClockwise(Math.PI)).toBeCloseTo(PI_OVER_2, 10);
    });

    it('should convert 3PI/2 (North, clockwise) to 0 (North, counter-clockwise)', function ()
    {
        expect(CounterClockwise(3 * Math.PI / 2)).toBeCloseTo(0, 10);
    });

    it('should return a value in the range [0, TAU)', function ()
    {
        var angles = [ 0, PI_OVER_2, Math.PI, 3 * PI_OVER_2, TAU - 0.001, 0.1, 1.0, 2.5, 4.0, 5.5 ];

        for (var i = 0; i < angles.length; i++)
        {
            var result = CounterClockwise(angles[i]);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(TAU);
        }
    });

    it('should wrap angles greater than PI by subtracting TAU before converting', function ()
    {
        // 3PI/2 > PI so it gets reduced to -PI/2 before conversion
        // -PI/2 in clockwise should map to 0 (North) in counter-clockwise
        expect(CounterClockwise(3 * Math.PI / 2)).toBeCloseTo(0, 10);
    });

    it('should handle an angle of exactly PI without subtracting TAU', function ()
    {
        // PI is not > PI, so no subtraction occurs
        expect(CounterClockwise(Math.PI)).toBeCloseTo(PI_OVER_2, 10);
    });

    it('should handle negative input angles', function ()
    {
        // -PI/2 (North in clockwise) should map to 0 (North in counter-clockwise)
        expect(CounterClockwise(-PI_OVER_2)).toBeCloseTo(0, 10);
    });

    it('should handle small positive angles near zero', function ()
    {
        var result = CounterClockwise(0.0001);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(TAU);
    });

    it('should handle an angle just above PI (triggering TAU subtraction)', function ()
    {
        var angle = Math.PI + 0.001;
        var result = CounterClockwise(angle);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(TAU);
    });

    it('should produce a different result for angle PI+epsilon vs PI-epsilon', function ()
    {
        var above = CounterClockwise(Math.PI + 0.01);
        var below = CounterClockwise(Math.PI - 0.01);
        expect(above).not.toBeCloseTo(below, 5);
    });

    it('should return a number', function ()
    {
        expect(typeof CounterClockwise(0)).toBe('number');
        expect(typeof CounterClockwise(Math.PI)).toBe('number');
        expect(typeof CounterClockwise(TAU)).toBe('number');
    });

    it('should treat TAU as equivalent to 0 in conversion', function ()
    {
        // TAU > PI so it subtracts TAU giving 0, same as input 0
        expect(CounterClockwise(TAU)).toBeCloseTo(CounterClockwise(0), 10);
    });

    it('should handle quarter-turn increments correctly in sequence', function ()
    {
        // CW 0 → CCW 270 (3PI/2)
        expect(CounterClockwise(0)).toBeCloseTo(3 * PI_OVER_2, 10);
        // CW 90 (PI/2) → CCW 180 (PI)
        expect(CounterClockwise(PI_OVER_2)).toBeCloseTo(Math.PI, 10);
        // CW 180 (PI) → CCW 90 (PI/2)
        expect(CounterClockwise(Math.PI)).toBeCloseTo(PI_OVER_2, 10);
        // CW 270 (3PI/2) → CCW 0
        expect(CounterClockwise(3 * PI_OVER_2)).toBeCloseTo(0, 10);
    });
});
