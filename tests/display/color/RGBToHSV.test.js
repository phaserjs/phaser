var RGBToHSV = require('../../../src/display/color/RGBToHSV');

describe('Phaser.Display.Color.RGBToHSV', function ()
{
    it('should return an object with h, s, v properties when no out is given', function ()
    {
        var result = RGBToHSV(255, 0, 0);

        expect(result).toHaveProperty('h');
        expect(result).toHaveProperty('s');
        expect(result).toHaveProperty('v');
    });

    it('should return the provided out object', function ()
    {
        var out = { h: 0, s: 0, v: 0 };
        var result = RGBToHSV(255, 0, 0, out);

        expect(result).toBe(out);
    });

    it('should convert pure red to HSV', function ()
    {
        var result = RGBToHSV(255, 0, 0);

        expect(result.h).toBeCloseTo(0, 5);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should convert pure green to HSV', function ()
    {
        var result = RGBToHSV(0, 255, 0);

        expect(result.h).toBeCloseTo(1 / 3, 5);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should convert pure blue to HSV', function ()
    {
        var result = RGBToHSV(0, 0, 255);

        expect(result.h).toBeCloseTo(2 / 3, 5);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should convert black to HSV', function ()
    {
        var result = RGBToHSV(0, 0, 0);

        expect(result.h).toBeCloseTo(0, 5);
        expect(result.s).toBeCloseTo(0, 5);
        expect(result.v).toBeCloseTo(0, 5);
    });

    it('should convert white to HSV', function ()
    {
        var result = RGBToHSV(255, 255, 255);

        expect(result.h).toBeCloseTo(0, 5);
        expect(result.s).toBeCloseTo(0, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should convert grey to HSV with zero saturation', function ()
    {
        var result = RGBToHSV(128, 128, 128);

        expect(result.s).toBeCloseTo(0, 5);
        expect(result.v).toBeCloseTo(128 / 255, 5);
    });

    it('should convert yellow to HSV', function ()
    {
        var result = RGBToHSV(255, 255, 0);

        expect(result.h).toBeCloseTo(1 / 6, 5);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should convert cyan to HSV', function ()
    {
        var result = RGBToHSV(0, 255, 255);

        expect(result.h).toBeCloseTo(0.5, 5);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should convert magenta to HSV', function ()
    {
        var result = RGBToHSV(255, 0, 255);

        expect(result.h).toBeCloseTo(5 / 6, 5);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should handle h wrapping when g < b with red as max', function ()
    {
        // Red is max, green < blue — triggers the +6 branch
        var result = RGBToHSV(255, 0, 128);

        expect(result.h).toBeGreaterThanOrEqual(0);
        expect(result.h).toBeLessThan(1);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should return h in [0, 1] range for all primary and secondary hues', function ()
    {
        var colors = [
            [255, 0, 0],
            [255, 255, 0],
            [0, 255, 0],
            [0, 255, 255],
            [0, 0, 255],
            [255, 0, 255]
        ];

        for (var i = 0; i < colors.length; i++)
        {
            var result = RGBToHSV(colors[i][0], colors[i][1], colors[i][2]);

            expect(result.h).toBeGreaterThanOrEqual(0);
            expect(result.h).toBeLessThan(1);
        }
    });

    it('should store values in _h, _s, _v when out has _h property', function ()
    {
        var out = { _h: 0, _s: 0, _v: 0 };
        var result = RGBToHSV(255, 0, 0, out);

        expect(result._h).toBeCloseTo(0, 5);
        expect(result._s).toBeCloseTo(1, 5);
        expect(result._v).toBeCloseTo(1, 5);
        expect(result.h).toBeUndefined();
    });

    it('should not mutate _h/_s/_v on plain out object without those properties', function ()
    {
        var out = { h: 0, s: 0, v: 0 };
        RGBToHSV(0, 255, 0, out);

        expect(out.h).toBeCloseTo(1 / 3, 5);
        expect(out.s).toBeCloseTo(1, 5);
        expect(out.v).toBeCloseTo(1, 5);
    });

    it('should handle achromatic color (max === 0) with zero saturation', function ()
    {
        var result = RGBToHSV(0, 0, 0);

        expect(result.s).toBe(0);
    });

    it('should produce s = 0 when all channels are equal', function ()
    {
        var values = [0, 64, 128, 192, 255];

        for (var i = 0; i < values.length; i++)
        {
            var v = values[i];
            var result = RGBToHSV(v, v, v);

            expect(result.s).toBeCloseTo(0, 5);
        }
    });

    it('should produce v in [0, 1] for all valid inputs', function ()
    {
        var result1 = RGBToHSV(0, 0, 0);
        var result2 = RGBToHSV(255, 255, 255);
        var result3 = RGBToHSV(128, 64, 32);

        expect(result1.v).toBeGreaterThanOrEqual(0);
        expect(result1.v).toBeLessThanOrEqual(1);
        expect(result2.v).toBeGreaterThanOrEqual(0);
        expect(result2.v).toBeLessThanOrEqual(1);
        expect(result3.v).toBeGreaterThanOrEqual(0);
        expect(result3.v).toBeLessThanOrEqual(1);
    });

    it('should correctly convert a known mid-tone color', function ()
    {
        // HSL orange-ish: rgb(255, 128, 0)
        var result = RGBToHSV(255, 128, 0);

        expect(result.h).toBeCloseTo(128 / (6 * 255), 4);
        expect(result.s).toBeCloseTo(1, 5);
        expect(result.v).toBeCloseTo(1, 5);
    });

    it('should default out object h to 0 for achromatic colors', function ()
    {
        var result = RGBToHSV(100, 100, 100);

        expect(result.h).toBe(0);
    });
});
