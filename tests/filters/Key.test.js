// Load the color index first so that Color.IntegerToRGB and Color.HexStringToColor
// are attached to the cached Color module before Key.js requires it.
require('../../src/display/color/index');

var Key = require('../../src/filters/Key');
var Color = require('../../src/display/color/Color');

// Minimal camera mock — Controller only stores the reference
var mockCamera = {};

describe('Key', function ()
{
    describe('constructor', function ()
    {
        it('should set default color to [1, 1, 1, 1]', function ()
        {
            var key = new Key(mockCamera);
            expect(key.color[0]).toBe(1);
            expect(key.color[1]).toBe(1);
            expect(key.color[2]).toBe(1);
            expect(key.color[3]).toBe(1);
        });

        it('should set default isolate to false', function ()
        {
            var key = new Key(mockCamera);
            expect(key.isolate).toBe(false);
        });

        it('should set default threshold to 0.0625', function ()
        {
            var key = new Key(mockCamera);
            expect(key.threshold).toBe(0.0625);
        });

        it('should set default feather to 0', function ()
        {
            var key = new Key(mockCamera);
            expect(key.feather).toBe(0);
        });

        it('should accept an empty config without error', function ()
        {
            var key = new Key(mockCamera, {});
            expect(key.color[0]).toBe(1);
            expect(key.isolate).toBe(false);
            expect(key.threshold).toBe(0.0625);
            expect(key.feather).toBe(0);
        });

        it('should apply color from config as a hex number', function ()
        {
            var key = new Key(mockCamera, { color: 0xff0000 });
            expect(key.color[0]).toBeCloseTo(1, 5);
            expect(key.color[1]).toBeCloseTo(0, 5);
            expect(key.color[2]).toBeCloseTo(0, 5);
        });

        it('should apply color from config as a hex string', function ()
        {
            var key = new Key(mockCamera, { color: '#00ff00' });
            expect(key.color[0]).toBeCloseTo(0, 5);
            expect(key.color[1]).toBeCloseTo(1, 5);
            expect(key.color[2]).toBeCloseTo(0, 5);
        });

        it('should apply alpha from config', function ()
        {
            var key = new Key(mockCamera, { alpha: 0.5 });
            expect(key.color[3]).toBe(0.5);
        });

        it('should apply config alpha after config color', function ()
        {
            // When both color and alpha are in config, color is applied first,
            // then alpha overwrites color[3].
            var key = new Key(mockCamera, { color: 0xff0000, alpha: 0.25 });
            expect(key.color[0]).toBeCloseTo(1, 5);
            expect(key.color[3]).toBe(0.25);
        });

        it('should apply isolate from config', function ()
        {
            var key = new Key(mockCamera, { isolate: true });
            expect(key.isolate).toBe(true);
        });

        it('should apply threshold from config', function ()
        {
            var key = new Key(mockCamera, { threshold: 0.2 });
            expect(key.threshold).toBe(0.2);
        });

        it('should apply feather from config', function ()
        {
            var key = new Key(mockCamera, { feather: 0.1 });
            expect(key.feather).toBe(0.1);
        });

        it('should store reference to camera', function ()
        {
            var key = new Key(mockCamera);
            expect(key.camera).toBe(mockCamera);
        });

        it('should set renderNode to FilterKey', function ()
        {
            var key = new Key(mockCamera);
            expect(key.renderNode).toBe('FilterKey');
        });
    });

    describe('setAlpha', function ()
    {
        it('should set the alpha component of the color array', function ()
        {
            var key = new Key(mockCamera);
            key.setAlpha(0.5);
            expect(key.color[3]).toBe(0.5);
        });

        it('should return this for chaining', function ()
        {
            var key = new Key(mockCamera);
            var result = key.setAlpha(0.5);
            expect(result).toBe(key);
        });

        it('should not affect the RGB components', function ()
        {
            var key = new Key(mockCamera);
            key.color = [ 0.2, 0.4, 0.6, 1 ];
            key.setAlpha(0.75);
            expect(key.color[0]).toBe(0.2);
            expect(key.color[1]).toBe(0.4);
            expect(key.color[2]).toBe(0.6);
        });

        it('should accept 0 for fully transparent', function ()
        {
            var key = new Key(mockCamera);
            key.setAlpha(0);
            expect(key.color[3]).toBe(0);
        });

        it('should accept 1 for fully opaque', function ()
        {
            var key = new Key(mockCamera);
            key.setAlpha(0);
            key.setAlpha(1);
            expect(key.color[3]).toBe(1);
        });

        it('should accept values greater than 1', function ()
        {
            var key = new Key(mockCamera);
            key.setAlpha(2);
            expect(key.color[3]).toBe(2);
        });
    });

    describe('setColor', function ()
    {
        describe('with a number', function ()
        {
            it('should set RGB from an integer color value', function ()
            {
                var key = new Key(mockCamera);
                key.setColor(0xff0000);
                expect(key.color[0]).toBeCloseTo(1, 5);
                expect(key.color[1]).toBeCloseTo(0, 5);
                expect(key.color[2]).toBeCloseTo(0, 5);
            });

            it('should set green from 0x00ff00', function ()
            {
                var key = new Key(mockCamera);
                key.setColor(0x00ff00);
                expect(key.color[0]).toBeCloseTo(0, 5);
                expect(key.color[1]).toBeCloseTo(1, 5);
                expect(key.color[2]).toBeCloseTo(0, 5);
            });

            it('should set blue from 0x0000ff', function ()
            {
                var key = new Key(mockCamera);
                key.setColor(0x0000ff);
                expect(key.color[0]).toBeCloseTo(0, 5);
                expect(key.color[1]).toBeCloseTo(0, 5);
                expect(key.color[2]).toBeCloseTo(1, 5);
            });

            it('should set a mixed color correctly', function ()
            {
                var key = new Key(mockCamera);
                key.setColor(0x804020);
                expect(key.color[0]).toBeCloseTo(0x80 / 255, 5);
                expect(key.color[1]).toBeCloseTo(0x40 / 255, 5);
                expect(key.color[2]).toBeCloseTo(0x20 / 255, 5);
            });

            it('should preserve the existing alpha value', function ()
            {
                var key = new Key(mockCamera);
                key.setAlpha(0.3);
                key.setColor(0xff0000);
                expect(key.color[3]).toBe(0.3);
            });

            it('should return this for chaining', function ()
            {
                var key = new Key(mockCamera);
                var result = key.setColor(0xff0000);
                expect(result).toBe(key);
            });
        });

        describe('with a string', function ()
        {
            it('should set RGB from a hex string with hash prefix', function ()
            {
                var key = new Key(mockCamera);
                key.setColor('#ff0000');
                expect(key.color[0]).toBeCloseTo(1, 5);
                expect(key.color[1]).toBeCloseTo(0, 5);
                expect(key.color[2]).toBeCloseTo(0, 5);
            });

            it('should set RGB from a shorthand hex string', function ()
            {
                var key = new Key(mockCamera);
                key.setColor('#f00');
                expect(key.color[0]).toBeCloseTo(1, 5);
                expect(key.color[1]).toBeCloseTo(0, 5);
                expect(key.color[2]).toBeCloseTo(0, 5);
            });

            it('should set green from #00ff00 string', function ()
            {
                var key = new Key(mockCamera);
                key.setColor('#00ff00');
                expect(key.color[0]).toBeCloseTo(0, 5);
                expect(key.color[1]).toBeCloseTo(1, 5);
                expect(key.color[2]).toBeCloseTo(0, 5);
            });

            it('should preserve the existing alpha value', function ()
            {
                var key = new Key(mockCamera);
                key.setAlpha(0.7);
                key.setColor('#0000ff');
                expect(key.color[3]).toBe(0.7);
            });

            it('should return this for chaining', function ()
            {
                var key = new Key(mockCamera);
                var result = key.setColor('#ff0000');
                expect(result).toBe(key);
            });
        });

        describe('with an array', function ()
        {
            it('should set RGB from a normalized array', function ()
            {
                var key = new Key(mockCamera);
                key.setColor([ 0.5, 0.25, 0.75 ]);
                expect(key.color[0]).toBe(0.5);
                expect(key.color[1]).toBe(0.25);
                expect(key.color[2]).toBe(0.75);
            });

            it('should set black from [0, 0, 0]', function ()
            {
                var key = new Key(mockCamera);
                key.setColor([ 0, 0, 0 ]);
                expect(key.color[0]).toBe(0);
                expect(key.color[1]).toBe(0);
                expect(key.color[2]).toBe(0);
            });

            it('should set white from [1, 1, 1]', function ()
            {
                var key = new Key(mockCamera);
                key.setColor([ 1, 1, 1 ]);
                expect(key.color[0]).toBe(1);
                expect(key.color[1]).toBe(1);
                expect(key.color[2]).toBe(1);
            });

            it('should preserve the existing alpha value', function ()
            {
                var key = new Key(mockCamera);
                key.setAlpha(0.6);
                key.setColor([ 0.1, 0.2, 0.3 ]);
                expect(key.color[3]).toBe(0.6);
            });

            it('should ignore the fourth element of the array', function ()
            {
                var key = new Key(mockCamera);
                key.setAlpha(0.9);
                key.setColor([ 0.1, 0.2, 0.3, 0.0 ]);
                expect(key.color[3]).toBe(0.9);
            });

            it('should return this for chaining', function ()
            {
                var key = new Key(mockCamera);
                var result = key.setColor([ 0.5, 0.5, 0.5 ]);
                expect(result).toBe(key);
            });
        });

        describe('with a Color instance', function ()
        {
            it('should set RGB from a Color object', function ()
            {
                var key = new Key(mockCamera);
                var color = new Color(255, 0, 0);
                key.setColor(color);
                expect(key.color[0]).toBeCloseTo(color.redGL, 5);
                expect(key.color[1]).toBeCloseTo(color.greenGL, 5);
                expect(key.color[2]).toBeCloseTo(color.blueGL, 5);
            });

            it('should set full red via Color object', function ()
            {
                var key = new Key(mockCamera);
                var color = new Color(255, 0, 0);
                key.setColor(color);
                expect(key.color[0]).toBeCloseTo(1, 5);
                expect(key.color[1]).toBeCloseTo(0, 5);
                expect(key.color[2]).toBeCloseTo(0, 5);
            });

            it('should preserve the existing alpha value', function ()
            {
                var key = new Key(mockCamera);
                key.setAlpha(0.4);
                var color = new Color(0, 255, 0);
                key.setColor(color);
                expect(key.color[3]).toBe(0.4);
            });

            it('should return this for chaining', function ()
            {
                var key = new Key(mockCamera);
                var color = new Color(128, 64, 32);
                var result = key.setColor(color);
                expect(result).toBe(key);
            });
        });

        describe('chaining', function ()
        {
            it('should support chaining setColor and setAlpha', function ()
            {
                var key = new Key(mockCamera);
                key.setColor([ 0.5, 0.5, 0.5 ]).setAlpha(0.5);
                expect(key.color[0]).toBe(0.5);
                expect(key.color[3]).toBe(0.5);
            });
        });
    });
});
