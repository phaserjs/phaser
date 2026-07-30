// Require color index to register Color.IntegerToColor before ColorBand needs it
require('../../src/display/color/index.js');

var GradientMap = require('../../src/filters/GradientMap');
var ColorRamp = require('../../src/display/ColorRamp');

describe('GradientMap', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {
            scene: {
                renderer: {
                    createUint8ArrayTexture: function () { return {}; }
                },
                textures: {
                    exists: function () { return false; },
                    addGLTexture: function () { return {}; }
                }
            }
        };
    });

    describe('constructor - default values', function ()
    {
        it('should set dither to false by default', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.dither).toBe(false);
        });

        it('should set unpremultiply to true by default', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.unpremultiply).toBe(true);
        });

        it('should set alpha to 1 by default', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.alpha).toBe(1);
        });

        it('should set color to [0, 0, 0, 0] by default', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.color).toEqual([ 0, 0, 0, 0 ]);
        });

        it('should set colorFactor to [0.3, 0.6, 0.1, 0] by default', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.colorFactor[0]).toBeCloseTo(0.3);
            expect(filter.colorFactor[1]).toBeCloseTo(0.6);
            expect(filter.colorFactor[2]).toBeCloseTo(0.1);
            expect(filter.colorFactor[3]).toBe(0);
        });

        it('should create a default ramp when none is provided', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.ramp).toBeDefined();
        });

        it('should work without a config object', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter).toBeDefined();
        });

        it('should work with an empty config object', function ()
        {
            var filter = new GradientMap(mockCamera, {});
            expect(filter).toBeDefined();
        });
    });

    describe('constructor - ramp', function ()
    {
        it('should create a ColorRamp when no ramp config is provided', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.ramp instanceof ColorRamp).toBe(true);
        });

        it('should use a provided ramp config object to create a ColorRamp', function ()
        {
            var filter = new GradientMap(mockCamera, {
                ramp: { colorStart: 0xff0000, colorEnd: 0x0000ff }
            });
            expect(filter.ramp instanceof ColorRamp).toBe(true);
        });

        it('should use a ColorRamp instance directly without wrapping it', function ()
        {
            var existingRamp = new ColorRamp(mockCamera.scene, {}, false);
            var filter = new GradientMap(mockCamera, { ramp: existingRamp });
            expect(filter.ramp).toBe(existingRamp);
        });

        it('should pass the scene to the ColorRamp constructor', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.ramp.scene).toBe(mockCamera.scene);
        });
    });

    describe('constructor - dither', function ()
    {
        it('should set dither to true when config.dither is true', function ()
        {
            var filter = new GradientMap(mockCamera, { dither: true });
            expect(filter.dither).toBe(true);
        });

        it('should set dither to false when config.dither is false', function ()
        {
            var filter = new GradientMap(mockCamera, { dither: false });
            expect(filter.dither).toBe(false);
        });

        it('should coerce truthy dither value to boolean true', function ()
        {
            var filter = new GradientMap(mockCamera, { dither: 1 });
            expect(filter.dither).toBe(true);
        });

        it('should coerce falsy dither value to boolean false', function ()
        {
            var filter = new GradientMap(mockCamera, { dither: 0 });
            expect(filter.dither).toBe(false);
        });
    });

    describe('constructor - color', function ()
    {
        it('should set color values from config', function ()
        {
            var filter = new GradientMap(mockCamera, {
                color: [ 0.1, 0.2, 0.3, 0.4 ]
            });
            expect(filter.color[0]).toBeCloseTo(0.1);
            expect(filter.color[1]).toBeCloseTo(0.2);
            expect(filter.color[2]).toBeCloseTo(0.3);
            expect(filter.color[3]).toBeCloseTo(0.4);
        });

        it('should fall back to 0 for undefined color channels', function ()
        {
            var filter = new GradientMap(mockCamera, {
                color: [ undefined, undefined, undefined, undefined ]
            });
            expect(filter.color[0]).toBe(0);
            expect(filter.color[1]).toBe(0);
            expect(filter.color[2]).toBe(0);
            expect(filter.color[3]).toBe(0);
        });

        it('should accept negative color values', function ()
        {
            var filter = new GradientMap(mockCamera, {
                color: [ -0.5, -0.5, -0.5, -0.5 ]
            });
            expect(filter.color[0]).toBeCloseTo(-0.5);
            expect(filter.color[1]).toBeCloseTo(-0.5);
            expect(filter.color[2]).toBeCloseTo(-0.5);
            expect(filter.color[3]).toBeCloseTo(-0.5);
        });

        it('should default all color channels to 0 when no color config is given', function ()
        {
            var filter = new GradientMap(mockCamera, {});
            expect(filter.color).toEqual([ 0, 0, 0, 0 ]);
        });

        it('should produce a 4-element array for color', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.color.length).toBe(4);
        });
    });

    describe('constructor - colorFactor', function ()
    {
        it('should set colorFactor values from config', function ()
        {
            var filter = new GradientMap(mockCamera, {
                colorFactor: [ 0.25, 0.5, 0.15, 0.1 ]
            });
            expect(filter.colorFactor[0]).toBeCloseTo(0.25);
            expect(filter.colorFactor[1]).toBeCloseTo(0.5);
            expect(filter.colorFactor[2]).toBeCloseTo(0.15);
            expect(filter.colorFactor[3]).toBeCloseTo(0.1);
        });

        it('should fall back to 0 for undefined colorFactor channels', function ()
        {
            var filter = new GradientMap(mockCamera, {
                colorFactor: [ undefined, undefined, undefined, undefined ]
            });
            expect(filter.colorFactor[0]).toBe(0);
            expect(filter.colorFactor[1]).toBe(0);
            expect(filter.colorFactor[2]).toBe(0);
            expect(filter.colorFactor[3]).toBe(0);
        });

        it('should accept negative colorFactor values', function ()
        {
            var filter = new GradientMap(mockCamera, {
                colorFactor: [ -0.3, -0.6, -0.1, 0 ]
            });
            expect(filter.colorFactor[0]).toBeCloseTo(-0.3);
            expect(filter.colorFactor[1]).toBeCloseTo(-0.6);
            expect(filter.colorFactor[2]).toBeCloseTo(-0.1);
            expect(filter.colorFactor[3]).toBe(0);
        });

        it('should keep default luminance weights when no colorFactor config is given', function ()
        {
            var filter = new GradientMap(mockCamera, {});
            expect(filter.colorFactor[0]).toBeCloseTo(0.3);
            expect(filter.colorFactor[1]).toBeCloseTo(0.6);
            expect(filter.colorFactor[2]).toBeCloseTo(0.1);
            expect(filter.colorFactor[3]).toBe(0);
        });

        it('should produce a 4-element array for colorFactor', function ()
        {
            var filter = new GradientMap(mockCamera);
            expect(filter.colorFactor.length).toBe(4);
        });
    });

    describe('constructor - unpremultiply', function ()
    {
        it('should default unpremultiply to true when not specified', function ()
        {
            var filter = new GradientMap(mockCamera, {});
            expect(filter.unpremultiply).toBe(true);
        });

        it('should set unpremultiply to false when config says false', function ()
        {
            var filter = new GradientMap(mockCamera, { unpremultiply: false });
            expect(filter.unpremultiply).toBe(false);
        });

        it('should set unpremultiply to true when config says true', function ()
        {
            var filter = new GradientMap(mockCamera, { unpremultiply: true });
            expect(filter.unpremultiply).toBe(true);
        });
    });

    describe('constructor - alpha', function ()
    {
        it('should default alpha to 1 when not specified', function ()
        {
            var filter = new GradientMap(mockCamera, {});
            expect(filter.alpha).toBe(1);
        });

        it('should set alpha from config', function ()
        {
            var filter = new GradientMap(mockCamera, { alpha: 0.5 });
            expect(filter.alpha).toBeCloseTo(0.5);
        });

        it('should allow alpha of 0', function ()
        {
            var filter = new GradientMap(mockCamera, { alpha: 0 });
            expect(filter.alpha).toBe(0);
        });

        it('should allow alpha greater than 1', function ()
        {
            var filter = new GradientMap(mockCamera, { alpha: 2 });
            expect(filter.alpha).toBe(2);
        });

        it('should allow negative alpha', function ()
        {
            var filter = new GradientMap(mockCamera, { alpha: -1 });
            expect(filter.alpha).toBe(-1);
        });
    });

    describe('property mutation', function ()
    {
        it('should allow dither to be changed after construction', function ()
        {
            var filter = new GradientMap(mockCamera);
            filter.dither = true;
            expect(filter.dither).toBe(true);
        });

        it('should allow alpha to be changed after construction', function ()
        {
            var filter = new GradientMap(mockCamera);
            filter.alpha = 0.75;
            expect(filter.alpha).toBeCloseTo(0.75);
        });

        it('should allow unpremultiply to be changed after construction', function ()
        {
            var filter = new GradientMap(mockCamera);
            filter.unpremultiply = false;
            expect(filter.unpremultiply).toBe(false);
        });

        it('should allow ramp to be replaced after construction', function ()
        {
            var filter = new GradientMap(mockCamera);
            var newRamp = new ColorRamp(mockCamera.scene, {}, false);
            filter.ramp = newRamp;
            expect(filter.ramp).toBe(newRamp);
        });

        it('should allow individual color channel values to be mutated', function ()
        {
            var filter = new GradientMap(mockCamera);
            filter.color[0] = 0.9;
            expect(filter.color[0]).toBeCloseTo(0.9);
        });

        it('should allow individual colorFactor channel values to be mutated', function ()
        {
            var filter = new GradientMap(mockCamera);
            filter.colorFactor[1] = 0.7;
            expect(filter.colorFactor[1]).toBeCloseTo(0.7);
        });
    });
});
