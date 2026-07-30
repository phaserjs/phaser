var InOut = require('../../../../src/math/easing/elastic/InOut');

describe('Phaser.Math.Easing.Elastic.InOut', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(InOut(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(InOut(1)).toBe(1);
    });

    it('should return 0.5 at the midpoint v=0.5', function ()
    {
        expect(InOut(0.5)).toBeCloseTo(0.5, 10);
    });

    it('should return 0.015625 at v=0.25 with default parameters', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(0.015625, 8);
    });

    it('should return 0.984375 at v=0.75 with default parameters', function ()
    {
        expect(InOut(0.75)).toBeCloseTo(0.984375, 8);
    });

    it('should overshoot below 0 in the first half for appropriate v', function ()
    {
        // v=0.42 falls in the first branch and produces a negative value
        var result = InOut(0.42);
        expect(result).toBeLessThan(0);
        expect(result).toBeCloseTo(-0.13344, 4);
    });

    it('should overshoot above 1 in the second half for appropriate v', function ()
    {
        // v=0.58 falls in the second branch and produces a value above 1
        var result = InOut(0.58);
        expect(result).toBeGreaterThan(1);
        expect(result).toBeCloseTo(1.13344, 4);
    });

    it('should exhibit symmetry: InOut(v) === 1 - InOut(1 - v)', function ()
    {
        var pairs = [
            [0.1, 0.9],
            [0.2, 0.8],
            [0.42, 0.58],
            [0.4, 0.6]
        ];
        for (var i = 0; i < pairs.length; i++)
        {
            var v = pairs[i][0];
            var w = pairs[i][1];
            expect(InOut(v)).toBeCloseTo(1 - InOut(w), 10);
        }
    });

    it('should clamp amplitude to 1 when amplitude is below 1', function ()
    {
        var resultDefault = InOut(0.42);
        var resultExplicit = InOut(0.42, 0.5, 0.1);
        expect(resultDefault).toBeCloseTo(resultExplicit, 10);
    });

    it('should clamp amplitude to 1 when amplitude is 0', function ()
    {
        var resultClamped = InOut(0.42, 0, 0.1);
        var resultDefault = InOut(0.42);
        expect(resultClamped).toBeCloseTo(resultDefault, 10);
    });

    it('should use alternate s formula when amplitude is exactly 1', function ()
    {
        // amplitude=1 hits the else branch, but produces same s as clamped (period/4 == period*asin(1)/(2*PI))
        var resultClamped = InOut(0.42);
        var resultAmp1 = InOut(0.42, 1, 0.1);
        expect(resultAmp1).toBeCloseTo(resultClamped, 10);
    });

    it('should produce different result when amplitude is greater than 1', function ()
    {
        var resultAmp1 = InOut(0.42, 1, 0.1);
        var resultAmp2 = InOut(0.42, 2, 0.1);
        expect(resultAmp2).toBeCloseTo(-0.30136, 4);
        expect(Math.abs(resultAmp2)).toBeGreaterThan(Math.abs(resultAmp1));
    });

    it('should produce larger overshoot with larger amplitude', function ()
    {
        var resultAmp1 = InOut(0.42, 1, 0.1);
        var resultAmp3 = InOut(0.42, 3, 0.1);
        expect(Math.abs(resultAmp3)).toBeGreaterThan(Math.abs(resultAmp1));
        expect(resultAmp3).toBeCloseTo(-0.40765, 4);
    });

    it('should produce different results with different period values', function ()
    {
        var result1 = InOut(0.42, 0.1, 0.1);
        var result2 = InOut(0.42, 0.1, 0.5);
        expect(result1).not.toBeCloseTo(result2, 3);
        expect(result2).toBeCloseTo(-0.07023, 4);
    });

    it('should return 0 and 1 at boundaries regardless of amplitude and period', function ()
    {
        expect(InOut(0, 2, 0.5)).toBe(0);
        expect(InOut(1, 2, 0.5)).toBe(1);
        expect(InOut(0, 0.01, 1)).toBe(0);
        expect(InOut(1, 0.01, 1)).toBe(1);
    });

    it('should produce finite numbers for all v in (0, 1)', function ()
    {
        var values = [0.1, 0.2, 0.3, 0.42, 0.5, 0.58, 0.7, 0.8, 0.9];
        for (var i = 0; i < values.length; i++)
        {
            var result = InOut(values[i]);
            expect(isFinite(result)).toBe(true);
        }
    });

    it('should return a number type for all inputs', function ()
    {
        expect(typeof InOut(0)).toBe('number');
        expect(typeof InOut(0.5)).toBe('number');
        expect(typeof InOut(1)).toBe('number');
        expect(typeof InOut(0.42)).toBe('number');
    });

    it('should produce increasing trend from 0 to 1 overall', function ()
    {
        // Sample at coarse intervals — the overall direction should be ascending
        expect(InOut(0.25)).toBeLessThan(InOut(0.5));
        expect(InOut(0.5)).toBeLessThan(InOut(0.75));
    });
});
