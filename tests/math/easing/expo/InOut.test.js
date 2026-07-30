var InOut = require('../../../../src/math/easing/expo/InOut');

describe('Phaser.Math.Easing.Expo.InOut', function ()
{
    it('should return approximately 0 at v = 0', function ()
    {
        // InOut(0) = 0.5 * 2^(-10) ≈ 0.000488, not exactly 0
        expect(InOut(0)).toBeCloseTo(0, 2);
    });

    it('should return approximately 1 at v = 1', function ()
    {
        // InOut(1) = 0.5 * (2 - 2^(-10)) ≈ 0.999512, not exactly 1
        expect(InOut(1)).toBeCloseTo(1, 2);
    });

    it('should return exactly 0.5 at v = 0.5 (midpoint)', function ()
    {
        expect(InOut(0.5)).toBeCloseTo(0.5, 10);
    });

    it('should return a value less than 0.5 for v < 0.5', function ()
    {
        expect(InOut(0.25)).toBeLessThan(0.5);
    });

    it('should return a value greater than 0.5 for v > 0.5', function ()
    {
        expect(InOut(0.75)).toBeGreaterThan(0.5);
    });

    it('should produce symmetrical output around the midpoint', function ()
    {
        expect(InOut(0.25)).toBeCloseTo(1 - InOut(0.75), 10);
        expect(InOut(0.1)).toBeCloseTo(1 - InOut(0.9), 10);
        expect(InOut(0.4)).toBeCloseTo(1 - InOut(0.6), 10);
    });

    it('should be monotonically increasing', function ()
    {
        var prev = InOut(0);
        for (var i = 1; i <= 20; i++)
        {
            var next = InOut(i / 20);
            expect(next).toBeGreaterThanOrEqual(prev);
            prev = next;
        }
    });

    it('should remain in the range [0, 1] for inputs in [0, 1]', function ()
    {
        for (var i = 0; i <= 20; i++)
        {
            var result = InOut(i / 20);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should accelerate slowly at the start (first half is concave)', function ()
    {
        var v01 = InOut(0.1);
        var v02 = InOut(0.2);
        var v03 = InOut(0.3);

        // increments should be increasing (accelerating) in first half
        expect(v02 - v01).toBeGreaterThan(v01 - InOut(0));
        expect(v03 - v02).toBeGreaterThan(v02 - v01);
    });

    it('should decelerate slowly at the end (second half is convex)', function ()
    {
        var v07 = InOut(0.7);
        var v08 = InOut(0.8);
        var v09 = InOut(0.9);
        var v10 = InOut(1.0);

        // increments should be decreasing (decelerating) in second half
        expect(v08 - v07).toBeGreaterThan(v09 - v08);
        expect(v09 - v08).toBeGreaterThan(v10 - v09);
    });

    it('should use the first branch for v < 0.5', function ()
    {
        // 0.5 * 2^(10*(2v-1)) for v < 0.5
        var v = 0.25;
        var expected = 0.5 * Math.pow(2, 10 * (2 * v - 1));
        expect(InOut(v)).toBeCloseTo(expected, 10);
    });

    it('should use the second branch for v >= 0.5', function ()
    {
        // 0.5 * (2 - 2^(-10*(2v-1))) for v >= 0.5
        var v = 0.75;
        var expected = 0.5 * (2 - Math.pow(2, -10 * (2 * v - 1)));
        expect(InOut(v)).toBeCloseTo(expected, 10);
    });

    it('should handle v = 0.5 exactly on the boundary between branches', function ()
    {
        // At v=0.5, v*2 == 1, so it takes the first branch: 0.5 * 2^(10*(1-1)) = 0.5 * 1 = 0.5
        expect(InOut(0.5)).toBeCloseTo(0.5, 10);
    });

    it('should return a number type', function ()
    {
        expect(typeof InOut(0.5)).toBe('number');
        expect(typeof InOut(0)).toBe('number');
        expect(typeof InOut(1)).toBe('number');
    });
});
