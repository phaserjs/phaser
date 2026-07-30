var HueToComponent = require('../../../src/display/color/HueToComponent');

describe('Phaser.Display.Color.HueToComponent', function ()
{
    it('should return p when t is in the final range (>= 2/3)', function ()
    {
        expect(HueToComponent(0.2, 0.8, 0.7)).toBeCloseTo(0.2);
        expect(HueToComponent(0.1, 0.9, 1.0)).toBeCloseTo(0.1);
        expect(HueToComponent(0.5, 0.5, 0.75)).toBeCloseTo(0.5);
    });

    it('should return q when t is in the range [1/6, 1/2)', function ()
    {
        expect(HueToComponent(0.2, 0.8, 1 / 6)).toBeCloseTo(0.8);
        expect(HueToComponent(0.2, 0.8, 0.3)).toBeCloseTo(0.8);
        expect(HueToComponent(0.0, 1.0, 0.49)).toBeCloseTo(1.0);
    });

    it('should interpolate when t is in the range [0, 1/6)', function ()
    {
        expect(HueToComponent(0, 1, 0)).toBeCloseTo(0);
        expect(HueToComponent(0, 1, 1 / 12)).toBeCloseTo(0.5);
        expect(HueToComponent(0, 1, 1 / 6 - 0.0001)).toBeCloseTo(1, 1);
    });

    it('should interpolate when t is in the range [1/2, 2/3)', function ()
    {
        expect(HueToComponent(0, 1, 0.5)).toBeCloseTo(1);
        expect(HueToComponent(0, 1, 7 / 12)).toBeCloseTo(0.5);
        expect(HueToComponent(0, 1, 2 / 3 - 0.0001)).toBeCloseTo(0, 1);
    });

    it('should wrap t upward when t is negative', function ()
    {
        // t = -0.1 becomes 0.9, which is >= 2/3, so returns p
        expect(HueToComponent(0.2, 0.8, -0.1)).toBeCloseTo(0.2);
    });

    it('should wrap t downward when t is greater than 1', function ()
    {
        // t = 1.1 becomes 0.1, which is < 1/6, so interpolates
        var result = HueToComponent(0, 1, 1.1);
        expect(result).toBeCloseTo(HueToComponent(0, 1, 0.1));
    });

    it('should return 0 when p and q are both 0', function ()
    {
        expect(HueToComponent(0, 0, 0)).toBeCloseTo(0);
        expect(HueToComponent(0, 0, 0.25)).toBeCloseTo(0);
        expect(HueToComponent(0, 0, 0.5)).toBeCloseTo(0);
        expect(HueToComponent(0, 0, 0.75)).toBeCloseTo(0);
    });

    it('should return p when p equals q', function ()
    {
        expect(HueToComponent(0.5, 0.5, 0)).toBeCloseTo(0.5);
        expect(HueToComponent(0.5, 0.5, 0.25)).toBeCloseTo(0.5);
        expect(HueToComponent(0.5, 0.5, 0.5)).toBeCloseTo(0.5);
        expect(HueToComponent(0.5, 0.5, 0.75)).toBeCloseTo(0.5);
    });

    it('should return a value in the range [0, 1] for typical HSL inputs', function ()
    {
        var p = 0.2;
        var q = 0.8;
        var offsets = [0, 1 / 3, 2 / 3];

        for (var i = 0; i < offsets.length; i++)
        {
            var result = HueToComponent(p, q, offsets[i]);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(1);
        }
    });

    it('should handle t exactly at boundary 1/6', function ()
    {
        // At t = 1/6, the first branch is false (not < 1/6), second branch is true (< 1/2)
        expect(HueToComponent(0.2, 0.8, 1 / 6)).toBeCloseTo(0.8);
    });

    it('should handle t exactly at boundary 1/2', function ()
    {
        // At t = 1/2, second branch is false (not < 1/2), third branch is true (< 2/3)
        expect(HueToComponent(0, 1, 0.5)).toBeCloseTo(1);
    });

    it('should handle t exactly at boundary 2/3', function ()
    {
        // At t = 2/3, third branch is false (not < 2/3), returns p
        expect(HueToComponent(0.3, 0.9, 2 / 3)).toBeCloseTo(0.3);
    });

    it('should handle t exactly at 0', function ()
    {
        expect(HueToComponent(0, 1, 0)).toBeCloseTo(0);
    });

    it('should handle t exactly at 1', function ()
    {
        // t = 1 is not > 1, so no wrap. t >= 2/3, returns p
        expect(HueToComponent(0.4, 0.9, 1)).toBeCloseTo(0.4);
    });
});
