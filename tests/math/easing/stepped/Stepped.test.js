var Stepped = require('../../../../src/math/easing/stepped/Stepped');

describe('Phaser.Math.Easing.Stepped', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Stepped(0)).toBe(0);
    });

    it('should return 0 when v is negative', function ()
    {
        expect(Stepped(-0.5)).toBe(0);
        expect(Stepped(-1)).toBe(0);
        expect(Stepped(-100)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Stepped(1)).toBe(1);
    });

    it('should return 1 when v is greater than 1', function ()
    {
        expect(Stepped(1.5)).toBe(1);
        expect(Stepped(100)).toBe(1);
    });

    it('should default to 1 step when steps is not provided', function ()
    {
        expect(Stepped(0.5)).toBeCloseTo(1);
    });

    it('should return 1 for any mid-range value with 1 step', function ()
    {
        expect(Stepped(0.1, 1)).toBeCloseTo(1);
        expect(Stepped(0.5, 1)).toBeCloseTo(1);
        expect(Stepped(0.9, 1)).toBeCloseTo(1);
    });

    it('should quantize to correct step with 2 steps', function ()
    {
        expect(Stepped(0.1, 2)).toBeCloseTo(0.5);
        expect(Stepped(0.4, 2)).toBeCloseTo(0.5);
        expect(Stepped(0.5, 2)).toBeCloseTo(1.0);
        expect(Stepped(0.9, 2)).toBeCloseTo(1.0);
    });

    it('should quantize to correct step with 4 steps', function ()
    {
        expect(Stepped(0.1, 4)).toBeCloseTo(0.25);
        expect(Stepped(0.3, 4)).toBeCloseTo(0.5);
        expect(Stepped(0.5, 4)).toBeCloseTo(0.75);
        expect(Stepped(0.7, 4)).toBeCloseTo(0.75);
        expect(Stepped(0.9, 4)).toBeCloseTo(1.0);
    });

    it('should quantize to correct step with 10 steps', function ()
    {
        expect(Stepped(0.05, 10)).toBeCloseTo(0.1);
        expect(Stepped(0.15, 10)).toBeCloseTo(0.2);
        expect(Stepped(0.55, 10)).toBeCloseTo(0.6);
        expect(Stepped(0.95, 10)).toBeCloseTo(1.0);
    });

    it('should always return a value between 0 and 1 for input in (0, 1)', function ()
    {
        var steps = [1, 2, 5, 10, 100];
        var values = [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99];

        for (var s = 0; s < steps.length; s++)
        {
            for (var i = 0; i < values.length; i++)
            {
                var result = Stepped(values[i], steps[s]);
                expect(result).toBeGreaterThan(0);
                expect(result).toBeLessThanOrEqual(1);
            }
        }
    });

    it('should produce a non-decreasing sequence as v increases', function ()
    {
        var prev = 0;
        for (var i = 0; i <= 100; i++)
        {
            var v = i / 100;
            var result = Stepped(v, 5);
            expect(result).toBeGreaterThanOrEqual(prev);
            prev = result;
        }
    });

    it('should handle a large number of steps', function ()
    {
        var result = Stepped(0.5, 1000);
        expect(result).toBeCloseTo(0.501, 2);
    });

    it('should return a multiple of (1/steps) for mid-range values', function ()
    {
        var steps = 4;
        var result = Stepped(0.3, steps);
        var multiple = Math.round(result * steps);
        expect(result).toBeCloseTo(multiple / steps);
    });
});
