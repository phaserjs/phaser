var Out = require('../../../../src/math/easing/elastic/Out');

describe('Phaser.Math.Easing.Elastic.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBe(1);
    });

    it('should return a number for mid-range values with default parameters', function ()
    {
        var result = Out(0.5);
        expect(typeof result).toBe('number');
        expect(isNaN(result)).toBe(false);
    });

    it('should return a value greater than 1 for mid-range v (overshoot)', function ()
    {
        // v=0.25 hits a sin peak of 1, giving ~1.177 with default params
        var result = Out(0.25);
        expect(result).toBeGreaterThan(1);
    });

    it('should return 0 when v is 0 regardless of amplitude and period', function ()
    {
        expect(Out(0, 2, 0.5)).toBe(0);
        expect(Out(0, 0.5, 0.2)).toBe(0);
    });

    it('should return 1 when v is 1 regardless of amplitude and period', function ()
    {
        expect(Out(1, 2, 0.5)).toBe(1);
        expect(Out(1, 0.5, 0.2)).toBe(1);
    });

    it('should clamp amplitude to 1 when amplitude is below 1', function ()
    {
        var resultLow = Out(0.5, 0.1, 0.1);
        var resultDefault = Out(0.5, 1, 0.1);
        expect(resultLow).toBeCloseTo(resultDefault, 10);
    });

    it('should use amplitude > 1 for larger overshoot', function ()
    {
        // v=0.37 avoids trig coincidences that cause amp=1 and amp=2 to cancel to same value
        var resultDefault = Out(0.37);
        var resultLarge = Out(0.37, 2, 0.1);
        expect(typeof resultLarge).toBe('number');
        expect(resultLarge).not.toBeCloseTo(resultDefault, 5);
    });

    it('should vary with different period values', function ()
    {
        // v=0.37 avoids trig coincidences that cause period=0.1 and period=0.5 to cancel to same value
        var result1 = Out(0.37, 1, 0.1);
        var result2 = Out(0.37, 1, 0.5);
        expect(result1).not.toBeCloseTo(result2, 5);
    });

    it('should produce a value near 1 for v close to 1', function ()
    {
        var result = Out(0.99);
        expect(result).toBeCloseTo(1, 0);
    });

    it('should produce a value near 0 for v close to 0', function ()
    {
        var result = Out(0.01);
        expect(result).toBeCloseTo(0, 0);
    });

    it('should return a finite number for all mid-range inputs', function ()
    {
        var values = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        for (var i = 0; i < values.length; i++)
        {
            var result = Out(values[i]);
            expect(isFinite(result)).toBe(true);
        }
    });

    it('should compute correct value with amplitude=1 at v=0.5', function ()
    {
        var v = 0.5;
        var amplitude = 1;
        var period = 0.1;
        var s = period / 4;
        var expected = amplitude * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) / period) + 1;
        expect(Out(v, amplitude, period)).toBeCloseTo(expected, 10);
    });

    it('should compute correct value with amplitude=2 at v=0.5', function ()
    {
        var v = 0.5;
        var amplitude = 2;
        var period = 0.1;
        var s = period * Math.asin(1 / amplitude) / (2 * Math.PI);
        var expected = amplitude * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) / period) + 1;
        expect(Out(v, amplitude, period)).toBeCloseTo(expected, 10);
    });

    it('should handle default amplitude and period parameters', function ()
    {
        var withDefaults = Out(0.5);
        var withExplicit = Out(0.5, 0.1, 0.1);
        expect(withDefaults).toBeCloseTo(withExplicit, 10);
    });
});
