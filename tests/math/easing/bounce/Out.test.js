var Out = require('../../../../src/math/easing/bounce/Out');

describe('Phaser.Math.Easing.Bounce.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBe(0);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBeCloseTo(1, 10);
    });

    it('should use the first segment when v is less than 1/2.75', function ()
    {
        // v < ~0.3636: returns 7.5625 * v * v
        var v = 0.2;
        expect(Out(v)).toBeCloseTo(7.5625 * v * v, 10);
    });

    it('should return 1 at the boundary v = 1/2.75 (end of first segment)', function ()
    {
        // At v = 1/2.75: 7.5625 * (1/2.75)^2 = (121/16) * (16/121) = 1
        var v = 1 / 2.75;
        expect(Out(v)).toBeCloseTo(1, 5);
    });

    it('should use the second segment when v is between 1/2.75 and 2/2.75', function ()
    {
        // v ~0.5 is in range [1/2.75, 2/2.75] i.e. [~0.3636, ~0.7273]
        var v = 0.5;
        var adjusted = v - 1.5 / 2.75;
        var expected = 7.5625 * adjusted * adjusted + 0.75;
        expect(Out(v)).toBeCloseTo(expected, 10);
    });

    it('should return approximately 0.765625 when v is 0.5', function ()
    {
        // 7.5625 * (0.5 - 1.5/2.75)^2 + 0.75
        expect(Out(0.5)).toBeCloseTo(0.765625, 5);
    });

    it('should use the third segment when v is between 2/2.75 and 2.5/2.75', function ()
    {
        // v ~0.8 is in range [2/2.75, 2.5/2.75] i.e. [~0.7273, ~0.9091]
        var v = 0.8;
        var adjusted = v - 2.25 / 2.75;
        var expected = 7.5625 * adjusted * adjusted + 0.9375;
        expect(Out(v)).toBeCloseTo(expected, 10);
    });

    it('should use the fourth segment when v is greater than or equal to 2.5/2.75', function ()
    {
        // v ~0.95 is above 2.5/2.75 (~0.9091)
        var v = 0.95;
        var adjusted = v - 2.625 / 2.75;
        var expected = 7.5625 * adjusted * adjusted + 0.984375;
        expect(Out(v)).toBeCloseTo(expected, 10);
    });

    it('should return approximately 0.984375 at the peak of the fourth segment bounce', function ()
    {
        // At exactly v = 2.625/2.75 the adjusted value is 0, so result is 0.984375
        var v = 2.625 / 2.75;
        expect(Out(v)).toBeCloseTo(0.984375, 10);
    });

    it('should return approximately 0.9375 at the peak of the third segment bounce', function ()
    {
        // At exactly v = 2.25/2.75 the adjusted value is 0, so result is 0.9375
        var v = 2.25 / 2.75;
        expect(Out(v)).toBeCloseTo(0.9375, 10);
    });

    it('should return approximately 0.75 at the peak of the second segment bounce', function ()
    {
        // At exactly v = 1.5/2.75 the adjusted value is 0, so result is 0.75
        var v = 1.5 / 2.75;
        expect(Out(v)).toBeCloseTo(0.75, 10);
    });

    it('should produce monotonically increasing values from 0 to 1 overall', function ()
    {
        // The output at v=1 should be greater than at v=0
        expect(Out(1)).toBeGreaterThan(Out(0));
    });

    it('should return values within [0, 1] for all inputs in [0, 1]', function ()
    {
        var steps = 100;
        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = Out(v);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1.01); // allow small overshoot from bounce
        }
    });

    it('should handle the segment boundary at 2/2.75 correctly', function ()
    {
        // Just below 2/2.75 uses segment 2, just above uses segment 3
        var below = (2 / 2.75) - 0.0001;
        var above = (2 / 2.75) + 0.0001;
        // Both should be close to each other (continuity)
        expect(Math.abs(Out(above) - Out(below))).toBeLessThan(0.01);
    });

    it('should handle the segment boundary at 2.5/2.75 correctly', function ()
    {
        var below = (2.5 / 2.75) - 0.0001;
        var above = (2.5 / 2.75) + 0.0001;
        expect(Math.abs(Out(above) - Out(below))).toBeLessThan(0.01);
    });

    it('should return a number for any finite input', function ()
    {
        expect(typeof Out(0)).toBe('number');
        expect(typeof Out(0.5)).toBe('number');
        expect(typeof Out(1)).toBe('number');
    });
});
