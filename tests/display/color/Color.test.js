var Color = require('../../../src/display/color/Color');

describe('Phaser.Display.Color', function ()
{
    describe('constructor', function ()
    {
        it('should create a color with default values', function ()
        {
            var color = new Color();
            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
            expect(color.alpha).toBe(255);
        });

        it('should create a color with given RGBA values', function ()
        {
            var color = new Color(100, 150, 200, 128);
            expect(color.red).toBe(100);
            expect(color.green).toBe(150);
            expect(color.blue).toBe(200);
            expect(color.alpha).toBe(128);
        });

        it('should initialize gl array with normalized values', function ()
        {
            var color = new Color(255, 0, 0, 255);
            expect(color.gl[0]).toBeCloseTo(1, 5);
            expect(color.gl[1]).toBeCloseTo(0, 5);
            expect(color.gl[2]).toBeCloseTo(0, 5);
            expect(color.gl[3]).toBeCloseTo(1, 5);
        });

        it('should initialize rgba string', function ()
        {
            var color = new Color(255, 128, 0, 255);
            expect(typeof color.rgba).toBe('string');
            expect(color.rgba).toContain('rgba(');
        });

        it('should initialize color property', function ()
        {
            var color = new Color(255, 255, 255, 255);
            expect(typeof color.color).toBe('number');
            expect(color.color).toBeGreaterThan(0);
        });

        it('should default alpha to 255 when not provided', function ()
        {
            var color = new Color(10, 20, 30);
            expect(color.alpha).toBe(255);
        });
    });

    describe('transparent', function ()
    {
        it('should set all components to zero', function ()
        {
            var color = new Color(100, 150, 200, 255);
            color.transparent();
            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
            expect(color.alpha).toBe(0);
        });

        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.transparent();
            expect(result).toBe(color);
        });

        it('should update gl array to zeros', function ()
        {
            var color = new Color(255, 255, 255, 255);
            color.transparent();
            expect(color.gl[0]).toBe(0);
            expect(color.gl[1]).toBe(0);
            expect(color.gl[2]).toBe(0);
            expect(color.gl[3]).toBe(0);
        });
    });

    describe('setTo', function ()
    {
        it('should set RGBA values', function ()
        {
            var color = new Color();
            color.setTo(10, 20, 30, 40);
            expect(color.red).toBe(10);
            expect(color.green).toBe(20);
            expect(color.blue).toBe(30);
            expect(color.alpha).toBe(40);
        });

        it('should default alpha to 255 when not provided', function ()
        {
            var color = new Color();
            color.setTo(10, 20, 30);
            expect(color.alpha).toBe(255);
        });

        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.setTo(10, 20, 30, 40);
            expect(result).toBe(color);
        });

        it('should update the rgba string', function ()
        {
            var color = new Color();
            color.setTo(255, 0, 128, 255);
            expect(color.rgba).toBe('rgba(255,0,128,1)');
        });

        it('should clamp values to 255 maximum', function ()
        {
            var color = new Color();
            color.setTo(300, 300, 300, 300);
            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);
            expect(color.alpha).toBe(255);
        });

        it('should handle zero values', function ()
        {
            var color = new Color(100, 100, 100, 100);
            color.setTo(0, 0, 0, 0);
            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
            expect(color.alpha).toBe(0);
        });
    });

    describe('setGLTo', function ()
    {
        it('should set normalized GL values', function ()
        {
            var color = new Color();
            color.setGLTo(0.5, 0.25, 0.75, 1.0);
            expect(color.gl[0]).toBeCloseTo(0.5, 5);
            expect(color.gl[1]).toBeCloseTo(0.25, 5);
            expect(color.gl[2]).toBeCloseTo(0.75, 5);
            expect(color.gl[3]).toBeCloseTo(1.0, 5);
        });

        it('should default alpha to 1 when not provided', function ()
        {
            var color = new Color();
            color.setGLTo(1, 0, 0);
            expect(color.gl[3]).toBeCloseTo(1, 5);
        });

        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.setGLTo(1, 0, 0);
            expect(result).toBe(color);
        });

        it('should update integer RGB values from GL', function ()
        {
            var color = new Color();
            color.setGLTo(1, 0, 0, 1);
            expect(color.r).toBe(255);
            expect(color.g).toBe(0);
            expect(color.b).toBe(0);
        });

        it('should clamp GL values to 1', function ()
        {
            var color = new Color();
            color.setGLTo(2, 2, 2, 2);
            expect(color.gl[0]).toBe(1);
            expect(color.gl[1]).toBe(1);
            expect(color.gl[2]).toBe(1);
            expect(color.gl[3]).toBe(1);
        });
    });

    describe('setFromRGB', function ()
    {
        it('should set color from an rgb object', function ()
        {
            var color = new Color();
            color.setFromRGB({ r: 100, g: 150, b: 200 });
            expect(color.red).toBe(100);
            expect(color.green).toBe(150);
            expect(color.blue).toBe(200);
        });

        it('should set alpha when provided in object', function ()
        {
            var color = new Color();
            color.setFromRGB({ r: 100, g: 150, b: 200, a: 128 });
            expect(color.alpha).toBe(128);
        });

        it('should not change alpha when not provided in object', function ()
        {
            var color = new Color(0, 0, 0, 64);
            color.setFromRGB({ r: 100, g: 150, b: 200 });
            expect(color.alpha).toBe(64);
        });

        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.setFromRGB({ r: 0, g: 0, b: 0 });
            expect(result).toBe(color);
        });
    });

    describe('setFromHSV', function ()
    {
        it('should set color from HSV values', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 1);
            expect(color.red).toBe(255);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should produce black for v=0', function ()
        {
            var color = new Color();
            color.setFromHSV(0.5, 1, 0);
            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should produce white for s=0, v=1', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 0, 1);
            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);
        });

        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.setFromHSV(0, 1, 1);
            expect(result).toBe(color);
        });
    });

    describe('clone', function ()
    {
        it('should return a new Color object', function ()
        {
            var color = new Color(100, 150, 200, 128);
            var clone = color.clone();
            expect(clone).not.toBe(color);
        });

        it('should have the same RGBA values as the original', function ()
        {
            var color = new Color(100, 150, 200, 128);
            var clone = color.clone();
            expect(clone.r).toBe(color.r);
            expect(clone.g).toBe(color.g);
            expect(clone.b).toBe(color.b);
            expect(clone.a).toBe(color.a);
        });

        it('should be independent from the original', function ()
        {
            var color = new Color(100, 150, 200, 128);
            var clone = color.clone();
            color.setTo(0, 0, 0, 0);
            expect(clone.red).toBe(100);
            expect(clone.green).toBe(150);
            expect(clone.blue).toBe(200);
            expect(clone.alpha).toBe(128);
        });
    });

    describe('gray', function ()
    {
        it('should set R, G and B to the given shade', function ()
        {
            var color = new Color();
            color.gray(128);
            expect(color.red).toBe(128);
            expect(color.green).toBe(128);
            expect(color.blue).toBe(128);
        });

        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.gray(128);
            expect(result).toBe(color);
        });

        it('should produce black at shade 0', function ()
        {
            var color = new Color(255, 255, 255);
            color.gray(0);
            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should produce white at shade 255', function ()
        {
            var color = new Color(0, 0, 0);
            color.gray(255);
            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);
        });
    });

    describe('random', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.random();
            expect(result).toBe(color);
        });

        it('should set RGB values within default range 0-255', function ()
        {
            var color = new Color();
            for (var i = 0; i < 20; i++)
            {
                color.random();
                expect(color.red).toBeGreaterThanOrEqual(0);
                expect(color.red).toBeLessThanOrEqual(255);
                expect(color.green).toBeGreaterThanOrEqual(0);
                expect(color.green).toBeLessThanOrEqual(255);
                expect(color.blue).toBeGreaterThanOrEqual(0);
                expect(color.blue).toBeLessThanOrEqual(255);
            }
        });

        it('should set RGB values within custom range', function ()
        {
            var color = new Color();
            for (var i = 0; i < 20; i++)
            {
                color.random(100, 200);
                expect(color.red).toBeGreaterThanOrEqual(100);
                expect(color.red).toBeLessThan(200);
                expect(color.green).toBeGreaterThanOrEqual(100);
                expect(color.green).toBeLessThan(200);
                expect(color.blue).toBeGreaterThanOrEqual(100);
                expect(color.blue).toBeLessThan(200);
            }
        });

        it('should produce integer RGB values', function ()
        {
            var color = new Color();
            color.random();
            expect(Number.isInteger(color.red)).toBe(true);
            expect(Number.isInteger(color.green)).toBe(true);
            expect(Number.isInteger(color.blue)).toBe(true);
        });
    });

    describe('randomGray', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color();
            var result = color.randomGray();
            expect(result).toBe(color);
        });

        it('should produce equal R, G and B values', function ()
        {
            var color = new Color();
            for (var i = 0; i < 20; i++)
            {
                color.randomGray();
                expect(color.red).toBe(color.green);
                expect(color.green).toBe(color.blue);
            }
        });

        it('should set values within default range 0-255', function ()
        {
            var color = new Color();
            for (var i = 0; i < 20; i++)
            {
                color.randomGray();
                expect(color.red).toBeGreaterThanOrEqual(0);
                expect(color.red).toBeLessThanOrEqual(255);
            }
        });

        it('should set values within custom range', function ()
        {
            var color = new Color();
            for (var i = 0; i < 20; i++)
            {
                color.randomGray(50, 150);
                expect(color.red).toBeGreaterThanOrEqual(50);
                expect(color.red).toBeLessThan(150);
            }
        });
    });

    describe('saturate', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 0.5, 1);
            var result = color.saturate(10);
            expect(result).toBe(color);
        });

        it('should increase the saturation by the percentage amount', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 0.5, 1);
            var before = color.s;
            color.saturate(10);
            expect(color.s).toBeCloseTo(before + 0.1, 2);
        });

        it('should increase saturation by 50 percent', function ()
        {
            var color = new Color();
            color.setFromHSV(0.5, 0.2, 0.8);
            var before = color.s;
            color.saturate(50);
            expect(color.s).toBeCloseTo(before + 0.5, 2);
        });
    });

    describe('desaturate', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 0.5, 1);
            var result = color.desaturate(10);
            expect(result).toBe(color);
        });

        it('should decrease the saturation by the percentage amount', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 0.5, 1);
            var before = color.s;
            color.desaturate(10);
            expect(color.s).toBeCloseTo(before - 0.1, 2);
        });

        it('should decrease saturation by 50 percent', function ()
        {
            var color = new Color();
            color.setFromHSV(0.5, 0.8, 0.8);
            var before = color.s;
            color.desaturate(50);
            expect(color.s).toBeCloseTo(before - 0.5, 2);
        });
    });

    describe('lighten', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 0.5);
            var result = color.lighten(10);
            expect(result).toBe(color);
        });

        it('should increase the value (brightness) by the percentage amount', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 0.5);
            var before = color.v;
            color.lighten(10);
            expect(color.v).toBeCloseTo(before + 0.1, 2);
        });

        it('should increase value by 25 percent', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 0.5);
            var before = color.v;
            color.lighten(25);
            expect(color.v).toBeCloseTo(before + 0.25, 2);
        });
    });

    describe('darken', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 0.8);
            var result = color.darken(10);
            expect(result).toBe(color);
        });

        it('should decrease the value (brightness) by the percentage amount', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 0.8);
            var before = color.v;
            color.darken(10);
            expect(color.v).toBeCloseTo(before - 0.1, 2);
        });

        it('should decrease value by 25 percent', function ()
        {
            var color = new Color();
            color.setFromHSV(0, 1, 0.8);
            var before = color.v;
            color.darken(25);
            expect(color.v).toBeCloseTo(before - 0.25, 2);
        });
    });

    describe('brighten', function ()
    {
        it('should return the Color object', function ()
        {
            var color = new Color(100, 100, 100);
            var result = color.brighten(10);
            expect(result).toBe(color);
        });

        it('should increase RGB values by the given percentage of 255', function ()
        {
            var color = new Color(100, 100, 100);
            color.brighten(10);
            var expected = Math.max(0, Math.min(255, 100 - Math.round(255 * -(10 / 100))));
            expect(color.red).toBe(expected);
            expect(color.green).toBe(expected);
            expect(color.blue).toBe(expected);
        });

        it('should clamp to 255 when brightening at maximum', function ()
        {
            var color = new Color(255, 255, 255);
            color.brighten(50);
            expect(color.red).toBe(255);
            expect(color.green).toBe(255);
            expect(color.blue).toBe(255);
        });

        it('should clamp to 0 when brightening past minimum (negative amount)', function ()
        {
            var color = new Color(0, 0, 0);
            color.brighten(0);
            expect(color.red).toBe(0);
            expect(color.green).toBe(0);
            expect(color.blue).toBe(0);
        });

        it('should brighten each channel independently', function ()
        {
            var color = new Color(50, 100, 150);
            color.brighten(20);
            var delta = Math.round(255 * 0.2);
            expect(color.red).toBe(Math.min(255, 50 + delta));
            expect(color.green).toBe(Math.min(255, 100 + delta));
            expect(color.blue).toBe(Math.min(255, 150 + delta));
        });
    });

    describe('color property', function ()
    {
        it('should return a packed 24-bit integer', function ()
        {
            var color = new Color(255, 0, 0, 255);
            expect(typeof color.color).toBe('number');
            expect(color.color).toBe(255 << 16 | 0 << 8 | 0);
        });

        it('should update when RGB values change', function ()
        {
            var color = new Color(0, 0, 0);
            var before = color.color;
            color.setTo(255, 0, 0);
            expect(color.color).not.toBe(before);
        });
    });

    describe('color32 property', function ()
    {
        it('should return a number', function ()
        {
            var color = new Color(255, 0, 0, 255);
            expect(typeof color.color32).toBe('number');
        });

        it('should update when alpha changes', function ()
        {
            var color = new Color(255, 0, 0, 255);
            var before = color.color32;
            color.setTo(255, 0, 0, 128);
            expect(color.color32).not.toBe(before);
        });
    });

    describe('rgba property', function ()
    {
        it('should return a valid rgba string', function ()
        {
            var color = new Color(255, 128, 0, 255);
            expect(color.rgba).toBe('rgba(255,128,0,1)');
        });

        it('should reflect alpha as a fraction', function ()
        {
            var color = new Color(0, 0, 0, 0);
            expect(color.rgba).toBe('rgba(0,0,0,0)');
        });

        it('should update when values change', function ()
        {
            var color = new Color(0, 0, 0, 255);
            color.setTo(100, 200, 50, 255);
            expect(color.rgba).toBe('rgba(100,200,50,1)');
        });
    });

    describe('redGL / greenGL / blueGL / alphaGL properties', function ()
    {
        it('should normalize red to 0-1 range', function ()
        {
            var color = new Color(255, 0, 0, 255);
            expect(color.redGL).toBeCloseTo(1, 5);
        });

        it('should normalize green to 0-1 range', function ()
        {
            var color = new Color(0, 128, 0, 255);
            expect(color.greenGL).toBeCloseTo(128 / 255, 5);
        });

        it('should normalize blue to 0-1 range', function ()
        {
            var color = new Color(0, 0, 64, 255);
            expect(color.blueGL).toBeCloseTo(64 / 255, 5);
        });

        it('should normalize alpha to 0-1 range', function ()
        {
            var color = new Color(0, 0, 0, 128);
            expect(color.alphaGL).toBeCloseTo(128 / 255, 5);
        });
    });
});
