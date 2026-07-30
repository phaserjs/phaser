var Out = require('../../../../src/math/easing/quadratic/Out');

describe('Phaser.Math.Easing.Quadratic.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBe(1);
    });

    it('should return 0.5 when v is 0.5', function ()
    {
        expect(Out(0.5)).toBeCloseTo(0.75);
    });

    it('should return a value greater than v for values between 0 and 1', function ()
    {
        expect(Out(0.25)).toBeGreaterThan(0.25);
        expect(Out(0.5)).toBeGreaterThan(0.5);
        expect(Out(0.75)).toBeGreaterThan(0.75);
    });

    it('should produce values in range [0, 1] for inputs in [0, 1]', function ()
    {
        var steps = 100;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = Out(v);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should be monotonically increasing for inputs in [0, 1]', function ()
    {
        var prev = Out(0);

        for (var i = 1; i <= 100; i++)
        {
            var v = i / 100;
            var result = Out(v);

            expect(result).toBeGreaterThanOrEqual(prev);
            prev = result;
        }
    });

    it('should return the correct value at v = 0.25', function ()
    {
        expect(Out(0.25)).toBeCloseTo(0.4375);
    });

    it('should return the correct value at v = 0.75', function ()
    {
        expect(Out(0.75)).toBeCloseTo(0.9375);
    });

    it('should handle negative values', function ()
    {
        expect(Out(-1)).toBeCloseTo(-3);
        expect(Out(-0.5)).toBeCloseTo(-1.25);
    });

    it('should handle values greater than 1', function ()
    {
        expect(Out(2)).toBeCloseTo(0);
        expect(Out(1.5)).toBeCloseTo(0.75);
    });

    it('should satisfy the formula v * (2 - v)', function ()
    {
        var values = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];

        for (var i = 0; i < values.length; i++)
        {
            var v = values[i];

            expect(Out(v)).toBeCloseTo(v * (2 - v));
        }
    });
});
