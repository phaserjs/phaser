var InOut = require('../../../../src/math/easing/back/InOut');

describe('Phaser.Math.Easing.Back.InOut', function ()
{
    it('should return 0 when v is 0', function ()
    {
        expect(InOut(0)).toBeCloseTo(0, 10);
    });

    it('should return 1 when v is 1', function ()
    {
        expect(InOut(1)).toBe(1);
    });

    it('should return 0.5 when v is 0.5', function ()
    {
        expect(InOut(0.5)).toBeCloseTo(0.5, 10);
    });

    it('should use default overshoot of 1.70158 when not specified', function ()
    {
        var s = 1.70158 * 1.525;
        var v = 0.3;
        var v2 = v * 2;
        var expected = 0.5 * (v2 * v2 * ((s + 1) * v2 - s));

        expect(InOut(v)).toBeCloseTo(expected, 10);
    });

    it('should pull back below zero early in the animation (default overshoot)', function ()
    {
        expect(InOut(0.1)).toBeLessThan(0);
        expect(InOut(0.2)).toBeLessThan(0);
    });

    it('should overshoot above one late in the animation (default overshoot)', function ()
    {
        expect(InOut(0.9)).toBeGreaterThan(1);
        expect(InOut(0.8)).toBeGreaterThan(1);
    });

    it('should be symmetric: InOut(v) + InOut(1 - v) equals 1', function ()
    {
        var values = [ 0.1, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.9 ];

        for (var i = 0; i < values.length; i++)
        {
            var v = values[i];
            expect(InOut(v) + InOut(1 - v)).toBeCloseTo(1, 10);
        }
    });

    it('should be monotonically increasing through midpoint with zero overshoot', function ()
    {
        expect(InOut(0, 0)).toBe(0);
        expect(InOut(0.25, 0)).toBeGreaterThan(InOut(0, 0));
        expect(InOut(0.5, 0)).toBeGreaterThan(InOut(0.25, 0));
        expect(InOut(0.75, 0)).toBeGreaterThan(InOut(0.5, 0));
        expect(InOut(1, 0)).toBeGreaterThan(InOut(0.75, 0));
    });

    it('should return 0 at v=0 and 1 at v=1 regardless of overshoot', function ()
    {
        var overshoots = [ 0, 1, 1.70158, 2, 3, 5 ];

        for (var i = 0; i < overshoots.length; i++)
        {
            expect(InOut(0, overshoots[i])).toBeCloseTo(0, 10);
            expect(InOut(1, overshoots[i])).toBe(1);
        }
    });

    it('should return 0.5 at v=0.5 regardless of overshoot', function ()
    {
        var overshoots = [ 0, 1, 1.70158, 2, 3, 5 ];

        for (var i = 0; i < overshoots.length; i++)
        {
            expect(InOut(0.5, overshoots[i])).toBeCloseTo(0.5, 10);
        }
    });

    it('should produce more pronounced overshoot with higher overshoot value', function ()
    {
        var lowOvershoot = InOut(0.9, 1);
        var highOvershoot = InOut(0.9, 4);

        expect(highOvershoot).toBeGreaterThan(lowOvershoot);
    });

    it('should produce more pronounced pullback with higher overshoot value', function ()
    {
        var lowOvershoot = InOut(0.1, 1);
        var highOvershoot = InOut(0.1, 4);

        expect(highOvershoot).toBeLessThan(lowOvershoot);
    });

    it('should not overshoot with zero overshoot value', function ()
    {
        var steps = 20;

        for (var i = 0; i <= steps; i++)
        {
            var v = i / steps;
            var result = InOut(v, 0);

            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should use the first-half formula when v < 0.5', function ()
    {
        var overshoot = 2;
        var s = overshoot * 1.525;
        var v = 0.25;
        var v2 = v * 2;
        var expected = 0.5 * (v2 * v2 * ((s + 1) * v2 - s));

        expect(InOut(v, overshoot)).toBeCloseTo(expected, 10);
    });

    it('should use the second-half formula when v >= 0.5', function ()
    {
        var overshoot = 2;
        var s = overshoot * 1.525;
        var v = 0.75;
        var v2 = v * 2 - 2;
        var expected = 0.5 * (v2 * v2 * ((s + 1) * v2 + s) + 2);

        expect(InOut(v, overshoot)).toBeCloseTo(expected, 10);
    });

    it('should handle v exactly at the boundary (v=0.5) using second-half formula', function ()
    {
        var overshoot = 2;
        var s = overshoot * 1.525;
        var v2 = 0.5 * 2 - 2; // v*=2 equals 1 (not < 1), so second half: v -= 2 gives -1
        var expected = 0.5 * (v2 * v2 * ((s + 1) * v2 + s) + 2);

        expect(InOut(0.5, overshoot)).toBeCloseTo(expected, 10);
    });

    it('should produce correct value at v=0.1 with default overshoot', function ()
    {
        // manually computed: ~-0.037518536
        expect(InOut(0.1)).toBeCloseTo(-0.037518536, 5);
    });

    it('should produce correct value at v=0.9 with default overshoot', function ()
    {
        // manually computed: ~1.037518536
        expect(InOut(0.9)).toBeCloseTo(1.037518536, 5);
    });

    it('should handle negative v values without throwing', function ()
    {
        expect(function () { InOut(-0.1); }).not.toThrow();
        expect(function () { InOut(-1); }).not.toThrow();
    });

    it('should handle v values greater than 1 without throwing', function ()
    {
        expect(function () { InOut(1.1); }).not.toThrow();
        expect(function () { InOut(2); }).not.toThrow();
    });

    it('should return a number for all inputs', function ()
    {
        var inputs = [ -0.5, 0, 0.1, 0.5, 0.9, 1, 1.5 ];

        for (var i = 0; i < inputs.length; i++)
        {
            expect(typeof InOut(inputs[i])).toBe('number');
        }
    });
});
