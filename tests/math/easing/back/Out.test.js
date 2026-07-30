var Out = require('../../../../src/math/easing/back/Out');

describe('Phaser.Math.Easing.Back.Out', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(Out(0)).toBeCloseTo(0, 10);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(Out(1)).toBeCloseTo(1, 10);
    });

    it('should overshoot above 1 at mid-range values with default overshoot', function ()
    {
        // Back Out overshoots past 1 before settling — value at 0.5 should exceed 1
        expect(Out(0.5)).toBeGreaterThan(1);
    });

    it('should use default overshoot of 1.70158 when not specified', function ()
    {
        // w = v-1 = -0.5, w*w*(2.70158*w + 1.70158) + 1
        expect(Out(0.5)).toBeCloseTo(1.0876975, 5);
    });

    it('should accept a custom overshoot value', function ()
    {
        // With overshoot=0: w=-0.5, 0.25*(1*-0.5+0)+1 = 0.875
        expect(Out(0.5, 0)).toBeCloseTo(0.875, 10);
    });

    it('should return 0 at v=0 regardless of overshoot', function ()
    {
        expect(Out(0, 0)).toBeCloseTo(0, 10);
        expect(Out(0, 2)).toBeCloseTo(0, 10);
        expect(Out(0, 5)).toBeCloseTo(0, 10);
    });

    it('should return 1 at v=1 regardless of overshoot', function ()
    {
        expect(Out(1, 0)).toBeCloseTo(1, 10);
        expect(Out(1, 2)).toBeCloseTo(1, 10);
        expect(Out(1, 5)).toBeCloseTo(1, 10);
    });

    it('should produce a larger overshoot with a higher overshoot parameter', function ()
    {
        var smallOvershoot = Out(0.5, 1);
        var largeOvershoot = Out(0.5, 5);

        expect(largeOvershoot).toBeGreaterThan(smallOvershoot);
    });

    it('should produce no overshoot when overshoot is 0', function ()
    {
        // With overshoot=0, acts as a simple ease-out cubic — stays <= 1 throughout [0, 1]
        for (var i = 0; i <= 10; i++)
        {
            var v = i / 10;
            expect(Out(v, 0)).toBeLessThanOrEqual(1 + 1e-10);
            expect(Out(v, 0)).toBeGreaterThanOrEqual(-1e-10);
        }
    });

    it('should produce increasing output values across [0, 1] near the endpoints', function ()
    {
        // The function starts at 0 and ends at 1, so early values should be less than later ones
        expect(Out(0.1)).toBeLessThan(Out(0.9));
        expect(Out(0.2)).toBeLessThan(Out(0.8));
    });

    it('should handle values at 0.25 correctly with default overshoot', function ()
    {
        // w = -0.75, w*w = 0.5625, (2.70158*-0.75 + 1.70158) = -2.02619 + 1.70158 = -0.32461
        // 0.5625 * -0.32461 + 1 = -0.18259 + 1 = 0.81741
        expect(Out(0.25)).toBeCloseTo(0.81741, 4);
    });

    it('should handle values at 0.75 correctly with default overshoot', function ()
    {
        // w = -0.25, w*w = 0.0625, (2.70158*-0.25 + 1.70158) = -0.675395 + 1.70158 = 1.026185
        // 0.0625 * 1.026185 + 1 = 0.064136 + 1 = 1.064136
        expect(Out(0.75)).toBeCloseTo(1.064136, 4);
    });

    it('should return a number', function ()
    {
        expect(typeof Out(0.5)).toBe('number');
        expect(typeof Out(0)).toBe('number');
        expect(typeof Out(1)).toBe('number');
    });

    it('should handle large overshoot values', function ()
    {
        // Extreme overshoot — output at 0.5 should be very large
        expect(Out(0.5, 100)).toBeGreaterThan(10);
        expect(Out(0, 100)).toBeCloseTo(0, 10);
        expect(Out(1, 100)).toBeCloseTo(1, 10);
    });
});
