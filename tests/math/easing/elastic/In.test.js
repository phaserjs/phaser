var In = require('../../../../src/math/easing/elastic/In');

describe('Phaser.Math.Easing.Elastic.In', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(In(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(In(1)).toBe(1);
    });

    it('should return 0 when v is 0 regardless of amplitude and period', function ()
    {
        expect(In(0, 2, 0.3)).toBe(0);
    });

    it('should return 1 when v is 1 regardless of amplitude and period', function ()
    {
        expect(In(1, 2, 0.3)).toBe(1);
    });

    it('should return a number for mid-range values with default parameters', function ()
    {
        var result = In(0.5);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should return approximately 0.03125 for v=0.5 with default parameters', function ()
    {
        // amplitude defaults to 0.1, clamped to 1; period defaults to 0.1
        // s = 0.1 / 4 = 0.025
        // result = -(1 * 2^(-5) * sin((-0.5 - 0.025) * 20*PI))
        // sin(-10.5*PI) = -1, so result = -(-0.03125) = 0.03125
        expect(In(0.5)).toBeCloseTo(0.03125, 10);
    });

    it('should return approximately 0.5 for v=0.9 with default parameters', function ()
    {
        // s = 0.025; v_adj = -0.1
        // result = -(0.5 * sin((-0.125) * 20*PI))
        // sin(-2.5*PI) = -1, so result = 0.5
        expect(In(0.9)).toBeCloseTo(0.5, 10);
    });

    it('should return approximately 0.001953125 for v=0.1 with default parameters', function ()
    {
        // s = 0.025; v_adj = -0.9
        // result = -(1/512 * sin(-18.5*PI))
        // sin(-18.5*PI) = -1, so result = 1/512
        expect(In(0.1)).toBeCloseTo(1 / 512, 10);
    });

    it('should return a negative value for v=0.25 with default parameters', function ()
    {
        // Elastic ease-in oscillates before reaching 1, producing negative values mid-range
        var result = In(0.25);
        expect(result).toBeLessThan(0);
    });

    it('should return a negative value for v=0.75 with default parameters', function ()
    {
        var result = In(0.75);
        expect(result).toBeLessThan(0);
    });

    it('should clamp amplitude to 1 when amplitude is less than 1', function ()
    {
        // amplitude=0.1 (default, clamped to 1) and amplitude=0.5 should produce the same result
        // as amplitude=1, because the branch sets amplitude = 1 for any value < 1
        expect(In(0.5, 0.5)).toBeCloseTo(In(0.5, 1), 10);
        expect(In(0.3, 0.01)).toBeCloseTo(In(0.3, 1), 10);
        expect(In(0.7, 0.99)).toBeCloseTo(In(0.7, 1), 10);
    });

    it('should clamp amplitude to 1 when amplitude is 0.1 (default)', function ()
    {
        // The default 0.1 is less than 1, so it becomes 1
        expect(In(0.5)).toBeCloseTo(In(0.5, 1), 10);
    });

    it('should use the asin formula for s when amplitude is >= 1', function ()
    {
        // amplitude=1 uses s = period/4 = 0.075; amplitude=2 uses s = period*asin(0.5)/(2*PI) = 0.025
        // With period=0.3, v=0.5: amp=1 gives -0.015625, amp=2 gives -0.0625
        var resultAmp1 = In(0.5, 1, 0.3);
        var resultAmp2 = In(0.5, 2, 0.3);
        expect(resultAmp1).not.toBeCloseTo(resultAmp2, 5);
        expect(resultAmp1).toBeCloseTo(-0.015625, 5);
        expect(resultAmp2).toBeCloseTo(-0.0625, 5);
    });

    it('should produce correct result for amplitude=2 and period=0.3', function ()
    {
        // s = 0.3 * asin(0.5) / (2*PI) = 0.025
        // v_adj = -0.5; result = -(2 * 2^(-5) * sin(-0.525 * 2*PI/0.3))
        // sin(-3.5*PI) = sin(0.5*PI) = 1, so result = -(0.0625 * 1) = -0.0625
        expect(In(0.5, 2, 0.3)).toBeCloseTo(-0.0625, 10);
    });

    it('should affect oscillation with different period values', function ()
    {
        // Different period with same amplitude and v should produce different results
        var resultPeriod01 = In(0.5, 1, 0.1);
        var resultPeriod02 = In(0.5, 1, 0.2);
        expect(resultPeriod01).not.toBeCloseTo(resultPeriod02, 5);
    });

    it('should return -0.03125 for v=0.5 with amplitude=2 and period=0.2', function ()
    {
        // s = 0.2 * asin(0.5) / (2*PI) = 0.2 * (PI/6) / (2*PI) = 1/60
        // v_adj = -0.5
        // result = -(2 * 2^(-5) * sin((-0.5 - 1/60) * 10*PI))
        // sin(-5.1667*PI) = sin(0.8333*PI) = sin(5*PI/6) = 0.5
        // result = -(0.0625 * 0.5) = -0.03125
        expect(In(0.5, 2, 0.2)).toBeCloseTo(-0.03125, 5);
    });

    it('should produce oscillating (non-monotonic) values between 0 and 1', function ()
    {
        // Elastic ease-in is not monotonic — it oscillates below 0 before reaching 1
        var hasNegative = false;
        var steps = 20;
        for (var i = 1; i < steps; i++)
        {
            var v = i / steps;
            var result = In(v);
            if (result < 0)
            {
                hasNegative = true;
                break;
            }
        }
        expect(hasNegative).toBe(true);
    });

    it('should always return 0 for v=0 and 1 for v=1 regardless of parameters', function ()
    {
        var amplitudes = [ 0.1, 0.5, 1, 2, 5 ];
        var periods = [ 0.1, 0.2, 0.5 ];
        for (var a = 0; a < amplitudes.length; a++)
        {
            for (var p = 0; p < periods.length; p++)
            {
                expect(In(0, amplitudes[a], periods[p])).toBe(0);
                expect(In(1, amplitudes[a], periods[p])).toBe(1);
            }
        }
    });

    it('should return a finite number for all values in the 0-1 range', function ()
    {
        for (var i = 0; i <= 100; i++)
        {
            var v = i / 100;
            var result = In(v);
            expect(isFinite(result)).toBe(true);
        }
    });

    it('should produce values that grow in magnitude as v approaches 1', function ()
    {
        // The 2^(10*(v-1)) factor grows exponentially as v approaches 1
        // so the oscillation amplitude increases — compare absolute magnitudes at peaks
        var r1 = Math.abs(In(0.1));
        var r5 = Math.abs(In(0.5));
        var r9 = Math.abs(In(0.9));
        expect(r5).toBeGreaterThan(r1);
        expect(r9).toBeGreaterThan(r5);
    });
});
