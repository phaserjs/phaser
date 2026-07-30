var HSLToColor = require('../../../src/display/color/HSLToColor');
var Color = require('../../../src/display/color/Color');

describe('Phaser.Display.Color.HSLToColor', function ()
{
    describe('return value', function ()
    {
        it('should return a Color object', function ()
        {
            var result = HSLToColor(0, 0, 0);

            expect(result).toBeInstanceOf(Color);
        });

        it('should return the provided color object when one is passed', function ()
        {
            var color = new Color();
            var result = HSLToColor(0, 0, 0.5, color);

            expect(result).toBe(color);
        });

        it('should create a new Color object when none is provided', function ()
        {
            var result = HSLToColor(0, 0, 0.5);

            expect(result).toBeInstanceOf(Color);
        });
    });

    describe('achromatic colors (saturation = 0)', function ()
    {
        it('should produce black when lightness is 0', function ()
        {
            var result = HSLToColor(0, 0, 0);

            expect(result.redGL).toBeCloseTo(0);
            expect(result.greenGL).toBeCloseTo(0);
            expect(result.blueGL).toBeCloseTo(0);
        });

        it('should produce white when lightness is 1', function ()
        {
            var result = HSLToColor(0, 0, 1);

            expect(result.redGL).toBeCloseTo(1);
            expect(result.greenGL).toBeCloseTo(1);
            expect(result.blueGL).toBeCloseTo(1);
        });

        it('should produce mid-grey when lightness is 0.5', function ()
        {
            var result = HSLToColor(0, 0, 0.5);

            expect(result.redGL).toBeCloseTo(0.5);
            expect(result.greenGL).toBeCloseTo(0.5);
            expect(result.blueGL).toBeCloseTo(0.5);
        });

        it('should set equal r, g, b channels for any hue when saturation is 0', function ()
        {
            var hues = [0, 0.1, 0.25, 0.5, 0.75, 1];

            hues.forEach(function (h)
            {
                var result = HSLToColor(h, 0, 0.3);

                expect(result.redGL).toBeCloseTo(0.3);
                expect(result.greenGL).toBeCloseTo(0.3);
                expect(result.blueGL).toBeCloseTo(0.3);
            });
        });
    });

    describe('pure hues (saturation = 1, lightness = 0.5)', function ()
    {
        it('should produce red when hue is 0', function ()
        {
            var result = HSLToColor(0, 1, 0.5);

            expect(result.redGL).toBeCloseTo(1);
            expect(result.greenGL).toBeCloseTo(0);
            expect(result.blueGL).toBeCloseTo(0);
        });

        it('should produce green when hue is 1/3', function ()
        {
            var result = HSLToColor(1 / 3, 1, 0.5);

            expect(result.redGL).toBeCloseTo(0);
            expect(result.greenGL).toBeCloseTo(1);
            expect(result.blueGL).toBeCloseTo(0);
        });

        it('should produce blue when hue is 2/3', function ()
        {
            var result = HSLToColor(2 / 3, 1, 0.5);

            expect(result.redGL).toBeCloseTo(0);
            expect(result.greenGL).toBeCloseTo(0);
            expect(result.blueGL).toBeCloseTo(1);
        });

        it('should produce yellow when hue is 1/6', function ()
        {
            var result = HSLToColor(1 / 6, 1, 0.5);

            expect(result.redGL).toBeCloseTo(1);
            expect(result.greenGL).toBeCloseTo(1);
            expect(result.blueGL).toBeCloseTo(0);
        });

        it('should produce cyan when hue is 0.5', function ()
        {
            var result = HSLToColor(0.5, 1, 0.5);

            expect(result.redGL).toBeCloseTo(0);
            expect(result.greenGL).toBeCloseTo(1);
            expect(result.blueGL).toBeCloseTo(1);
        });

        it('should produce magenta when hue is 5/6', function ()
        {
            var result = HSLToColor(5 / 6, 1, 0.5);

            expect(result.redGL).toBeCloseTo(1);
            expect(result.greenGL).toBeCloseTo(0);
            expect(result.blueGL).toBeCloseTo(1);
        });
    });

    describe('lightness branches', function ()
    {
        it('should use the l*(1+s) formula when lightness is below 0.5', function ()
        {
            // l=0.25, s=1 → q = 0.25*(1+1) = 0.5, p = 2*0.25 - 0.5 = 0
            var result = HSLToColor(0, 1, 0.25);

            expect(result.redGL).toBeCloseTo(0.5);
            expect(result.greenGL).toBeCloseTo(0);
            expect(result.blueGL).toBeCloseTo(0);
        });

        it('should use the l+s-l*s formula when lightness is above 0.5', function ()
        {
            // l=0.75, s=1 → q = 0.75 + 1 - 0.75*1 = 1, p = 2*0.75 - 1 = 0.5
            var result = HSLToColor(0, 1, 0.75);

            expect(result.redGL).toBeCloseTo(1);
            expect(result.greenGL).toBeCloseTo(0.5);
            expect(result.blueGL).toBeCloseTo(0.5);
        });

        it('should handle lightness exactly at 0.5 boundary', function ()
        {
            var result = HSLToColor(0, 1, 0.5);

            expect(result.redGL).toBeCloseTo(1);
            expect(result.greenGL).toBeCloseTo(0);
            expect(result.blueGL).toBeCloseTo(0);
        });
    });

    describe('alpha channel', function ()
    {
        it('should always set alpha to 1', function ()
        {
            var result = HSLToColor(0, 1, 0.5);

            expect(result.alphaGL).toBeCloseTo(1);
        });

        it('should set alpha to 1 for achromatic colors', function ()
        {
            var result = HSLToColor(0, 0, 0.5);

            expect(result.alphaGL).toBeCloseTo(1);
        });
    });

    describe('integer RGB values', function ()
    {
        it('should set red to 255 for pure red', function ()
        {
            var result = HSLToColor(0, 1, 0.5);

            expect(result.red).toBe(255);
        });

        it('should set all channels to 0 for black', function ()
        {
            var result = HSLToColor(0, 0, 0);

            expect(result.red).toBe(0);
            expect(result.green).toBe(0);
            expect(result.blue).toBe(0);
        });

        it('should set all channels to 255 for white', function ()
        {
            var result = HSLToColor(0, 0, 1);

            expect(result.red).toBe(255);
            expect(result.green).toBe(255);
            expect(result.blue).toBe(255);
        });
    });

    describe('existing color object mutation', function ()
    {
        it('should update an existing color object in-place', function ()
        {
            var color = new Color(255, 0, 0);

            HSLToColor(2 / 3, 1, 0.5, color);

            expect(color.redGL).toBeCloseTo(0);
            expect(color.greenGL).toBeCloseTo(0);
            expect(color.blueGL).toBeCloseTo(1);
        });

        it('should overwrite previous values on the provided color', function ()
        {
            var color = new Color();

            HSLToColor(0, 0, 1, color);

            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);

            HSLToColor(0, 0, 0, color);

            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });
    });

    describe('partial saturation', function ()
    {
        it('should produce a muted color when saturation is 0.5', function ()
        {
            var result = HSLToColor(0, 0.5, 0.5);

            expect(result.redGL).toBeGreaterThan(result.greenGL);
            expect(result.redGL).toBeGreaterThan(result.blueGL);
            expect(result.redGL).toBeGreaterThan(0.5);
            expect(result.redGL).toBeLessThanOrEqual(1);
        });

        it('should produce values between 0 and 1 for all channels', function ()
        {
            var hValues = [0, 0.1, 0.3, 0.5, 0.7, 0.9];
            var sValues = [0.2, 0.5, 0.8];
            var lValues = [0.2, 0.5, 0.8];

            hValues.forEach(function (h)
            {
                sValues.forEach(function (s)
                {
                    lValues.forEach(function (l)
                    {
                        var result = HSLToColor(h, s, l);

                        expect(result.redGL).toBeGreaterThanOrEqual(0);
                        expect(result.redGL).toBeLessThanOrEqual(1);
                        expect(result.greenGL).toBeGreaterThanOrEqual(0);
                        expect(result.greenGL).toBeLessThanOrEqual(1);
                        expect(result.blueGL).toBeGreaterThanOrEqual(0);
                        expect(result.blueGL).toBeLessThanOrEqual(1);
                    });
                });
            });
        });
    });
});
