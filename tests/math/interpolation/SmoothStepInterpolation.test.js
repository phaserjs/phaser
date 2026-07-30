var SmoothStepInterpolation = require('../../../src/math/interpolation/SmoothStepInterpolation');

describe('Phaser.Math.Interpolation.SmoothStep', function ()
{
    it('should return min when t is 0', function ()
    {
        expect(SmoothStepInterpolation(0, 0, 100)).toBe(0);
    });

    it('should return max when t is 1', function ()
    {
        expect(SmoothStepInterpolation(1, 0, 100)).toBe(100);
    });

    it('should return the midpoint value when t is 0.5', function ()
    {
        expect(SmoothStepInterpolation(0.5, 0, 100)).toBe(50);
    });

    it('should return min when t is below 0', function ()
    {
        expect(SmoothStepInterpolation(-1, 0, 100)).toBe(0);
        expect(SmoothStepInterpolation(-0.5, 10, 20)).toBe(10);
    });

    it('should return max when t is above 1', function ()
    {
        expect(SmoothStepInterpolation(2, 0, 100)).toBe(100);
        expect(SmoothStepInterpolation(1.5, 10, 20)).toBe(20);
    });

    it('should return min when min and max are equal', function ()
    {
        expect(SmoothStepInterpolation(0.5, 50, 50)).toBe(50);
    });

    it('should interpolate correctly with negative min and positive max', function ()
    {
        expect(SmoothStepInterpolation(0, -100, 100)).toBe(-100);
        expect(SmoothStepInterpolation(1, -100, 100)).toBe(100);
        expect(SmoothStepInterpolation(0.5, -100, 100)).toBe(0);
    });

    it('should interpolate correctly with negative min and negative max', function ()
    {
        expect(SmoothStepInterpolation(0, -200, -100)).toBe(-200);
        expect(SmoothStepInterpolation(1, -200, -100)).toBe(-100);
        expect(SmoothStepInterpolation(0.5, -200, -100)).toBe(-150);
    });

    it('should produce an S-shaped curve (slower at edges than middle)', function ()
    {
        var atQuarter = SmoothStepInterpolation(0.25, 0, 1);
        var atHalf = SmoothStepInterpolation(0.5, 0, 1);
        var atThreeQuarter = SmoothStepInterpolation(0.75, 0, 1);

        // The smoothstep curve progresses slower near 0 and 1, faster in the middle
        // So the gain from 0→0.25 should be less than from 0.25→0.5
        var gainFirstQuarter = atQuarter - 0;
        var gainSecondQuarter = atHalf - atQuarter;

        expect(gainFirstQuarter).toBeLessThan(gainSecondQuarter);

        // And symmetric: gain from 0.5→0.75 equals gain from 0.25→0.5
        var gainThirdQuarter = atThreeQuarter - atHalf;
        expect(gainThirdQuarter).toBeCloseTo(gainSecondQuarter, 10);
    });

    it('should be symmetric around the midpoint', function ()
    {
        var low = SmoothStepInterpolation(0.25, 0, 1);
        var high = SmoothStepInterpolation(0.75, 0, 1);

        expect(low + high).toBeCloseTo(1, 10);
    });

    it('should return a value between min and max for t in [0, 1]', function ()
    {
        var min = 5;
        var max = 95;

        for (var i = 0; i <= 10; i++)
        {
            var t = i / 10;
            var result = SmoothStepInterpolation(t, min, max);

            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
        }
    });

    it('should work with floating point min and max values', function ()
    {
        expect(SmoothStepInterpolation(0, 0.5, 1.5)).toBeCloseTo(0.5, 10);
        expect(SmoothStepInterpolation(1, 0.5, 1.5)).toBeCloseTo(1.5, 10);
        expect(SmoothStepInterpolation(0.5, 0.5, 1.5)).toBeCloseTo(1.0, 10);
    });

    it('should produce known smoothstep values at t=0.25', function ()
    {
        // smoothstep(0.25) = 3*(0.25^2) - 2*(0.25^3) = 3*0.0625 - 2*0.015625 = 0.1875 - 0.03125 = 0.15625
        expect(SmoothStepInterpolation(0.25, 0, 1)).toBeCloseTo(0.15625, 5);
    });

    it('should produce known smoothstep values at t=0.75', function ()
    {
        // smoothstep(0.75) = 3*(0.75^2) - 2*(0.75^3) = 3*0.5625 - 2*0.421875 = 1.6875 - 0.84375 = 0.84375
        expect(SmoothStepInterpolation(0.75, 0, 1)).toBeCloseTo(0.84375, 5);
    });
});
