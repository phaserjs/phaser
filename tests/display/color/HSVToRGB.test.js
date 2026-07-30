var HSVToRGB = require('../../../src/display/color/HSVToRGB');

describe('Phaser.Display.Color.HSVToRGB', function ()
{
    it('should return an object with r, g, b, and color properties when no out is given', function ()
    {
        var result = HSVToRGB(0, 1, 1);

        expect(result).toHaveProperty('r');
        expect(result).toHaveProperty('g');
        expect(result).toHaveProperty('b');
        expect(result).toHaveProperty('color');
    });

    it('should return pure red for h=0, s=1, v=1', function ()
    {
        var result = HSVToRGB(0, 1, 1);

        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should return pure green for h=0.333, s=1, v=1', function ()
    {
        var result = HSVToRGB(1 / 3, 1, 1);

        expect(result.r).toBe(0);
        expect(result.g).toBe(255);
        expect(result.b).toBe(0);
    });

    it('should return pure blue for h=0.667, s=1, v=1', function ()
    {
        var result = HSVToRGB(2 / 3, 1, 1);

        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(255);
    });

    it('should return black for v=0', function ()
    {
        var result = HSVToRGB(0, 1, 0);

        expect(result.r).toBe(0);
        expect(result.g).toBe(0);
        expect(result.b).toBe(0);
    });

    it('should return white for s=0, v=1', function ()
    {
        var result = HSVToRGB(0, 0, 1);

        expect(result.r).toBe(255);
        expect(result.g).toBe(255);
        expect(result.b).toBe(255);
    });

    it('should default s to 1 when undefined', function ()
    {
        var resultWithS = HSVToRGB(0, 1, 1);
        var resultWithoutS = HSVToRGB(0, undefined, 1);

        expect(resultWithoutS.r).toBe(resultWithS.r);
        expect(resultWithoutS.g).toBe(resultWithS.g);
        expect(resultWithoutS.b).toBe(resultWithS.b);
    });

    it('should default v to 1 when undefined', function ()
    {
        var resultWithV = HSVToRGB(0, 1, 1);
        var resultWithoutV = HSVToRGB(0, 1, undefined);

        expect(resultWithoutV.r).toBe(resultWithV.r);
        expect(resultWithoutV.g).toBe(resultWithV.g);
        expect(resultWithoutV.b).toBe(resultWithV.b);
    });

    it('should return a grey color when saturation is 0', function ()
    {
        var result = HSVToRGB(0.5, 0, 0.5);

        expect(result.r).toBe(result.g);
        expect(result.g).toBe(result.b);
    });

    it('should return yellow for h=0.1667, s=1, v=1', function ()
    {
        var result = HSVToRGB(1 / 6, 1, 1);

        expect(result.r).toBe(255);
        expect(result.g).toBe(255);
        expect(result.b).toBe(0);
    });

    it('should return cyan for h=0.5, s=1, v=1', function ()
    {
        var result = HSVToRGB(0.5, 1, 1);

        expect(result.r).toBe(0);
        expect(result.g).toBe(255);
        expect(result.b).toBe(255);
    });

    it('should return magenta for h=0.8333, s=1, v=1', function ()
    {
        var result = HSVToRGB(5 / 6, 1, 1);

        expect(result.r).toBe(255);
        expect(result.g).toBe(0);
        expect(result.b).toBe(255);
    });

    it('should set the color property to the packed RGB integer', function ()
    {
        var result = HSVToRGB(0, 1, 1);

        expect(result.color).toBe(result.r * 65536 + result.g * 256 + result.b);
    });

    it('should populate a plain out object when provided', function ()
    {
        var out = { r: 0, g: 0, b: 0, color: 0 };
        var result = HSVToRGB(0, 1, 1, out);

        expect(result).toBe(out);
        expect(out.r).toBe(255);
        expect(out.g).toBe(0);
        expect(out.b).toBe(0);
    });

    it('should call setTo on an out object that has a setTo method', function ()
    {
        var called = false;
        var args = null;
        var out = {
            alpha: 255,
            setTo: function (r, g, b, alpha, flag)
            {
                called = true;
                args = { r: r, g: g, b: b, alpha: alpha, flag: flag };
                return out;
            }
        };

        var result = HSVToRGB(0, 1, 1, out);

        expect(called).toBe(true);
        expect(result).toBe(out);
        expect(args.r).toBe(255);
        expect(args.g).toBe(0);
        expect(args.b).toBe(0);
        expect(args.alpha).toBe(255);
        expect(args.flag).toBe(true);
    });

    it('should handle h=1 the same as h=0', function ()
    {
        var result0 = HSVToRGB(0, 1, 1);
        var result1 = HSVToRGB(1, 1, 1);

        expect(result1.r).toBe(result0.r);
        expect(result1.g).toBe(result0.g);
        expect(result1.b).toBe(result0.b);
    });

    it('should scale brightness correctly at half value', function ()
    {
        var full = HSVToRGB(0, 1, 1);
        var half = HSVToRGB(0, 1, 0.5);

        expect(half.r).toBe(Math.round(full.r * 0.5));
        expect(half.g).toBe(0);
        expect(half.b).toBe(0);
    });

    it('should return values in the 0-255 range for any valid input', function ()
    {
        var hValues = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
        var sValues = [0, 0.25, 0.5, 0.75, 1];
        var vValues = [0, 0.25, 0.5, 0.75, 1];

        for (var hi = 0; hi < hValues.length; hi++)
        {
            for (var si = 0; si < sValues.length; si++)
            {
                for (var vi = 0; vi < vValues.length; vi++)
                {
                    var result = HSVToRGB(hValues[hi], sValues[si], vValues[vi]);

                    expect(result.r).toBeGreaterThanOrEqual(0);
                    expect(result.r).toBeLessThanOrEqual(255);
                    expect(result.g).toBeGreaterThanOrEqual(0);
                    expect(result.g).toBeLessThanOrEqual(255);
                    expect(result.b).toBeGreaterThanOrEqual(0);
                    expect(result.b).toBeLessThanOrEqual(255);
                }
            }
        }
    });
});
