// Require the color index first so static methods (IntegerToColor, HexStringToColor, etc.)
// are attached to the Color class before ColorBand uses them.
require('../../src/display/color/index');
var ColorBand = require('../../src/display/ColorBand');
var Color = require('../../src/display/color/Color');

describe('ColorBand', function ()
{
    describe('constructor', function ()
    {
        it('should create with default values when no config is given', function ()
        {
            var band = new ColorBand();
            expect(band.isColorBand).toBe(true);
            expect(band.start).toBe(0);
            expect(band.middle).toBe(0.5);
            expect(band.end).toBe(1);
            expect(band.interpolation).toBe(0);
            expect(band.colorSpace).toBe(0);
        });

        it('should create Color instances for colorStart and colorEnd', function ()
        {
            var band = new ColorBand();
            expect(band.colorStart).toBeInstanceOf(Color);
            expect(band.colorEnd).toBeInstanceOf(Color);
        });

        it('should set start from config', function ()
        {
            var band = new ColorBand({ start: 0.25 });
            expect(band.start).toBe(0.25);
        });

        it('should set middle from config', function ()
        {
            var band = new ColorBand({ middle: 0.3 });
            expect(band.middle).toBe(0.3);
        });

        it('should set middle to 0.5 by default even when other config is present', function ()
        {
            var band = new ColorBand({ start: 0.1 });
            expect(band.middle).toBe(0.5);
        });

        it('should set end from config.end', function ()
        {
            var band = new ColorBand({ end: 0.75 });
            expect(band.end).toBe(0.75);
        });

        it('should compute end from start + size when config.end is not given', function ()
        {
            var band = new ColorBand({ start: 0.2, size: 0.4 });
            expect(band.end).toBeCloseTo(0.6);
        });

        it('should prefer config.end over config.size', function ()
        {
            var band = new ColorBand({ start: 0.2, size: 0.4, end: 0.9 });
            expect(band.end).toBe(0.9);
        });

        it('should set interpolation from config', function ()
        {
            var band = new ColorBand({ interpolation: 3 });
            expect(band.interpolation).toBe(3);
        });

        it('should set colorSpace from config', function ()
        {
            var band = new ColorBand({ colorSpace: 2 });
            expect(band.colorSpace).toBe(2);
        });

        it('should set colorStart via config.colorStart number', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000 });
            expect(band.colorStart.red).toBe(255);
            expect(band.colorStart.green).toBe(0);
            expect(band.colorStart.blue).toBe(0);
        });

        it('should set colorEnd via config.colorEnd number', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0x0000ff });
            expect(band.colorEnd.red).toBe(0);
            expect(band.colorEnd.green).toBe(0);
            expect(band.colorEnd.blue).toBe(255);
        });
    });

    describe('setColors', function ()
    {
        it('should return this for chaining', function ()
        {
            var band = new ColorBand();
            var result = band.setColors(0xff0000, 0x0000ff);
            expect(result).toBe(band);
        });

        it('should default start to black (0x000000) when undefined', function ()
        {
            var band = new ColorBand();
            band.setColors(undefined, undefined);
            expect(band.colorStart.red).toBe(0);
            expect(band.colorStart.green).toBe(0);
            expect(band.colorStart.blue).toBe(0);
        });

        it('should set end equal to start when end is undefined', function ()
        {
            var band = new ColorBand();
            band.setColors(0xff0000);
            expect(band.colorStart.red).toBe(band.colorEnd.red);
            expect(band.colorStart.green).toBe(band.colorEnd.green);
            expect(band.colorStart.blue).toBe(band.colorEnd.blue);
        });

        it('should accept a number for start', function ()
        {
            var band = new ColorBand();
            band.setColors(0x00ff00, 0x000000);
            expect(band.colorStart.green).toBe(255);
            expect(band.colorStart.red).toBe(0);
        });

        it('should accept a number for end', function ()
        {
            var band = new ColorBand();
            band.setColors(0x000000, 0x0000ff);
            expect(band.colorEnd.blue).toBe(255);
        });

        it('should accept a hex string for start', function ()
        {
            var band = new ColorBand();
            band.setColors('#ff0000', '#0000ff');
            expect(band.colorStart.red).toBe(255);
            expect(band.colorStart.green).toBe(0);
            expect(band.colorStart.blue).toBe(0);
        });

        it('should accept a hex string for end', function ()
        {
            var band = new ColorBand();
            band.setColors('#000000', '#00ff00');
            expect(band.colorEnd.green).toBe(255);
        });

        it('should accept an array [r, g, b] for start with default alpha 1', function ()
        {
            var band = new ColorBand();
            band.setColors([1, 0, 0], [0, 0, 0]);
            expect(band.colorStart.red).toBe(255);
            expect(band.colorStart.green).toBe(0);
            expect(band.colorStart.blue).toBe(0);
            expect(band.colorStart.alpha).toBe(255);
        });

        it('should accept an array [r, g, b, a] for start', function ()
        {
            var band = new ColorBand();
            band.setColors([1, 0, 0, 0.5], [0, 0, 0]);
            expect(band.colorStart.red).toBe(255);
            expect(band.colorStart.alphaGL).toBeCloseTo(0.5);
        });

        it('should accept an array [r, g, b] for end with default alpha 1', function ()
        {
            var band = new ColorBand();
            band.setColors([0, 0, 0], [0, 0, 1]);
            expect(band.colorEnd.blue).toBe(255);
            expect(band.colorEnd.alpha).toBe(255);
        });

        it('should accept an array [r, g, b, a] for end', function ()
        {
            var band = new ColorBand();
            band.setColors([0, 0, 0], [0, 0, 1, 0.25]);
            expect(band.colorEnd.alphaGL).toBeCloseTo(0.25);
        });

        it('should accept a Color object for start', function ()
        {
            var band = new ColorBand();
            var color = new Color(128, 64, 32, 200);
            band.setColors(color, new Color(0, 0, 0));
            expect(band.colorStart.red).toBe(128);
            expect(band.colorStart.green).toBe(64);
            expect(band.colorStart.blue).toBe(32);
            expect(band.colorStart.alpha).toBe(200);
        });

        it('should accept a Color object for end', function ()
        {
            var band = new ColorBand();
            var color = new Color(10, 20, 30, 100);
            band.setColors(new Color(0, 0, 0), color);
            expect(band.colorEnd.red).toBe(10);
            expect(band.colorEnd.green).toBe(20);
            expect(band.colorEnd.blue).toBe(30);
            expect(band.colorEnd.alpha).toBe(100);
        });
    });

    describe('getColor', function ()
    {
        it('should return colorStart values at index 0', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff });
            var color = band.getColor(0);
            expect(color.r).toBe(255);
            expect(color.g).toBe(0);
            expect(color.b).toBe(0);
        });

        it('should return colorEnd values at index 1', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff });
            var color = band.getColor(1);
            expect(color.r).toBe(0);
            expect(color.g).toBe(0);
            expect(color.b).toBe(255);
        });

        it('should return a blended color at index 0.5 with linear interpolation', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 0 });
            var color = band.getColor(0.5);
            expect(color.r).toBeGreaterThan(0);
            expect(color.r).toBeLessThan(255);
        });

        it('should clamp index below 0 to 0', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff });
            var colorNeg = band.getColor(-1);
            var colorZero = band.getColor(0);
            expect(colorNeg.r).toBe(colorZero.r);
            expect(colorNeg.b).toBe(colorZero.b);
        });

        it('should clamp index above 1 to 1', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff });
            var colorOver = band.getColor(2);
            var colorOne = band.getColor(1);
            expect(colorOver.r).toBe(colorOne.r);
            expect(colorOver.b).toBe(colorOne.b);
        });

        it('should interpolate alpha between start and end', function ()
        {
            var band = new ColorBand();
            band.setColors([1, 1, 1, 0], [1, 1, 1, 1]);
            var color = band.getColor(0.5);
            // alpha is in 0-255 range; Linear(0, 255, 0.5) = 127.5
            expect(color.a).toBeCloseTo(127.5, 0);
        });

        it('should apply gamma curve when middle is not 0.5', function ()
        {
            var bandDefault = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, middle: 0.5 });
            // middle=0.75 gives gamma ~2.4, so 0.5^2.4 ~0.19 — color is darker than default at index 0.5
            var bandShifted = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, middle: 0.75 });
            var colorDefault = bandDefault.getColor(0.5);
            var colorShifted = bandShifted.getColor(0.5);
            expect(colorShifted.r).toBeLessThan(colorDefault.r);
        });

        it('should use CURVED interpolation (mode 1) and still return values in range', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 1 });
            var color0 = band.getColor(0);
            var color5 = band.getColor(0.5);
            var color1 = band.getColor(1);
            expect(color0.r).toBe(0);
            expect(color1.r).toBe(255);
            expect(color5.r).toBeGreaterThanOrEqual(0);
            expect(color5.r).toBeLessThanOrEqual(255);
        });

        it('should use SINUSOIDAL interpolation (mode 2) and still return values in range', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 2 });
            var color0 = band.getColor(0);
            var color1 = band.getColor(1);
            var color5 = band.getColor(0.5);
            expect(color0.r).toBe(0);
            expect(color1.r).toBe(255);
            expect(color5.r).toBeGreaterThanOrEqual(0);
            expect(color5.r).toBeLessThanOrEqual(255);
        });

        it('should use CURVE_START interpolation (mode 3) and still return values in range', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 3 });
            var color0 = band.getColor(0);
            var color1 = band.getColor(1);
            var color5 = band.getColor(0.5);
            expect(color0.r).toBe(0);
            expect(color1.r).toBe(255);
            expect(color5.r).toBeGreaterThanOrEqual(0);
            expect(color5.r).toBeLessThanOrEqual(255);
        });

        it('should use CURVE_END interpolation (mode 4) and still return values in range', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 4 });
            var color0 = band.getColor(0);
            var color1 = band.getColor(1);
            var color5 = band.getColor(0.5);
            expect(color0.r).toBe(0);
            expect(color1.r).toBe(255);
            expect(color5.r).toBeGreaterThanOrEqual(0);
            expect(color5.r).toBeLessThanOrEqual(255);
        });

        it('should produce different midpoint values for CURVE_START vs CURVE_END', function ()
        {
            var bandStart = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 3 });
            var bandEnd = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, interpolation: 4 });
            var colorStart = bandStart.getColor(0.25);
            var colorEnd = bandEnd.getColor(0.25);
            // CURVE_START eases out (fast at start), so midpoint is brighter than CURVE_END
            expect(colorStart.r).toBeGreaterThan(colorEnd.r);
        });

        it('should work with HSVA_NEAREST color space (mode 1)', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff, colorSpace: 1 });
            var color = band.getColor(0.5);
            expect(color).toBeDefined();
            expect(color.r).toBeGreaterThanOrEqual(0);
            expect(color.b).toBeGreaterThanOrEqual(0);
        });

        it('should work with HSVA_PLUS color space (mode 2)', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff, colorSpace: 2 });
            var color = band.getColor(0.5);
            expect(color).toBeDefined();
        });

        it('should work with HSVA_MINUS color space (mode 3)', function ()
        {
            var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff, colorSpace: 3 });
            var color = band.getColor(0.5);
            expect(color).toBeDefined();
        });

        it('should return same start color at index 0 regardless of interpolation mode', function ()
        {
            var modes = [0, 1, 2, 3, 4];
            modes.forEach(function (mode)
            {
                var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff, interpolation: mode });
                var color = band.getColor(0);
                expect(color.r).toBe(255);
                expect(color.b).toBe(0);
            });
        });

        it('should return same end color at index 1 regardless of interpolation mode', function ()
        {
            var modes = [0, 1, 2, 3, 4];
            modes.forEach(function (mode)
            {
                var band = new ColorBand({ colorStart: 0xff0000, colorEnd: 0x0000ff, interpolation: mode });
                var color = band.getColor(1);
                expect(color.r).toBe(0);
                expect(color.b).toBe(255);
            });
        });

        it('should return the midpoint color at the middle position with linear interpolation', function ()
        {
            var band = new ColorBand({ colorStart: 0x000000, colorEnd: 0xffffff, middle: 0.5, interpolation: 0 });
            var colorAtMiddle = band.getColor(0.5);
            // At index=0.5 with middle=0.5, gamma=1, so linear blend at 0.5
            expect(colorAtMiddle.r).toBeGreaterThan(100);
            expect(colorAtMiddle.r).toBeLessThan(160);
        });
    });
});
