var In = require('../../../../src/math/easing/bounce/In');

describe('Phaser.Math.Easing.Bounce.In', function ()
{
    it('should return 0 when given 0', function ()
    {
        expect(In(0)).toBeCloseTo(0, 5);
    });

    it('should return 1 when given 1', function ()
    {
        expect(In(1)).toBeCloseTo(1, 5);
    });

    it('should return a value in range [0, 1] for all valid inputs', function ()
    {
        var steps = 100;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = In(v);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should use the first branch when transformed value is less than 1/2.75 (v close to 1)', function ()
    {
        // transformed = 1 - 0.9 = 0.1, which is < 1/2.75 (~0.3636)
        // return 1 - (7.5625 * 0.1 * 0.1) = 1 - 0.075625 = 0.924375
        expect(In(0.9)).toBeCloseTo(0.924375, 5);
    });

    it('should use the second branch when transformed value is between 1/2.75 and 2/2.75', function ()
    {
        // transformed = 1 - 0.5 = 0.5, which is >= 1/2.75 (~0.3636) and < 2/2.75 (~0.7272)
        // v -= 1.5/2.75 = 0.5 - 0.54545... = -0.04545...
        // 7.5625 * (-0.04545...)^2 + 0.75 = 0.015625 + 0.75 = 0.765625
        // return 1 - 0.765625 = 0.234375
        expect(In(0.5)).toBeCloseTo(0.234375, 5);
    });

    it('should use the third branch when transformed value is between 2/2.75 and 2.5/2.75', function ()
    {
        // transformed = 1 - 0.2 = 0.8, which is >= 2/2.75 (~0.7272) and < 2.5/2.75 (~0.9090)
        // v -= 2.25/2.75 = 0.8 - 0.81818... = -0.01818...
        // 7.5625 * (-0.01818...)^2 + 0.9375 = 0.0025 + 0.9375 = 0.94
        // return 1 - 0.94 = 0.06
        expect(In(0.2)).toBeCloseTo(0.06, 5);
    });

    it('should use the fourth branch when transformed value is >= 2.5/2.75 (v close to 0)', function ()
    {
        // transformed = 1 - 0.05 = 0.95, which is >= 2.5/2.75 (~0.9090)
        // v -= 2.625/2.75 = 0.95 - 0.95454... = -0.00454...
        // 7.5625 * (-0.00454...)^2 + 0.984375 = 0.00015625 + 0.984375 = 0.984531...
        // return 1 - 0.984531... = 0.015468...
        expect(In(0.05)).toBeCloseTo(0.015469, 4);
    });

    it('should be monotonically increasing overall from 0 to 1', function ()
    {
        // The bounce-in easing begins near 0 and ends at 1,
        // but due to the bounce effect it is not strictly monotonic at fine scale.
        // Verify the general trend by comparing start and end quarters.
        expect(In(0.25)).toBeLessThan(In(0.75));
        expect(In(0.75)).toBeLessThan(In(1));
    });

    it('should return a number type', function ()
    {
        expect(typeof In(0)).toBe('number');
        expect(typeof In(0.5)).toBe('number');
        expect(typeof In(1)).toBe('number');
    });

    it('should return near 0 for very small input values', function ()
    {
        expect(In(0.001)).toBeCloseTo(0, 2);
    });

    it('should return near 1 for input values close to 1', function ()
    {
        expect(In(0.999)).toBeCloseTo(1, 2);
    });

    it('should handle the branch boundary near 1/2.75 correctly', function ()
    {
        // At v = 1 - (1/2.75), transformed is exactly 1/2.75
        var boundary = 1 - (1 / 2.75);

        // Just below the boundary (slightly larger v means smaller transformed)
        var justBelow = In(boundary + 0.001);

        // Just above the boundary (slightly smaller v means larger transformed)
        var justAbove = In(boundary - 0.001);

        expect(typeof justBelow).toBe('number');
        expect(typeof justAbove).toBe('number');
        expect(justBelow).toBeGreaterThanOrEqual(0);
        expect(justAbove).toBeGreaterThanOrEqual(0);
    });

    it('should handle the branch boundary near 2/2.75 correctly', function ()
    {
        var boundary = 1 - (2 / 2.75);
        var result = In(boundary);

        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
    });

    it('should handle the branch boundary near 2.5/2.75 correctly', function ()
    {
        var boundary = 1 - (2.5 / 2.75);
        var result = In(boundary);

        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
    });
});
