// Require the Color index first so static methods (IntegerToColor, HexStringToColor)
// are attached to the Color class before Vignette.js requires Color directly.
require('../../src/display/color/index');

var Vignette = require('../../src/filters/Vignette');

describe('Vignette', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should create a Vignette with default values', function ()
        {
            var v = new Vignette(mockCamera);

            expect(v.x).toBe(0.5);
            expect(v.y).toBe(0.5);
            expect(v.radius).toBe(0.5);
            expect(v.strength).toBe(0.5);
            expect(v.blendMode).toBe(0);
        });

        it('should create a Vignette with custom numeric values', function ()
        {
            var v = new Vignette(mockCamera, 0.1, 0.2, 0.3, 0.4, 0xff0000, 1);

            expect(v.x).toBe(0.1);
            expect(v.y).toBe(0.2);
            expect(v.radius).toBeCloseTo(0.3);
            expect(v.strength).toBeCloseTo(0.4);
            expect(v.blendMode).toBe(1);
        });

        it('should store the camera reference', function ()
        {
            var v = new Vignette(mockCamera);

            expect(v.camera).toBe(mockCamera);
        });

        it('should set renderNode to FilterVignette', function ()
        {
            var v = new Vignette(mockCamera);

            expect(v.renderNode).toBe('FilterVignette');
        });

        it('should have active set to true by default', function ()
        {
            var v = new Vignette(mockCamera);

            expect(v.active).toBe(true);
        });

        it('should create a Color object on the color property', function ()
        {
            var v = new Vignette(mockCamera);

            expect(v.color).toBeDefined();
            expect(typeof v.color).toBe('object');
        });

        it('should initialize color to black (0x000000) by default', function ()
        {
            var v = new Vignette(mockCamera);

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should accept a hex integer color in the constructor', function ()
        {
            var v = new Vignette(mockCamera, 0.5, 0.5, 0.5, 0.5, 0xff0000);

            expect(v.color.r).toBe(255);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should accept x=0 and y=0 without falling back to defaults', function ()
        {
            var v = new Vignette(mockCamera, 0, 0, 0, 0);

            expect(v.x).toBe(0);
            expect(v.y).toBe(0);
            expect(v.radius).toBe(0);
            expect(v.strength).toBe(0);
        });

        it('should accept x=1 and y=1', function ()
        {
            var v = new Vignette(mockCamera, 1, 1, 1, 1);

            expect(v.x).toBe(1);
            expect(v.y).toBe(1);
            expect(v.radius).toBe(1);
            expect(v.strength).toBe(1);
        });
    });

    describe('setColor', function ()
    {
        it('should return the Vignette instance for chaining', function ()
        {
            var v = new Vignette(mockCamera);
            var result = v.setColor(0xff0000);

            expect(result).toBe(v);
        });

        it('should set color from a hex integer', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor(0xff0000);

            expect(v.color.r).toBe(255);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should set color to white from integer 0xffffff', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor(0xffffff);

            expect(v.color.r).toBe(255);
            expect(v.color.g).toBe(255);
            expect(v.color.b).toBe(255);
        });

        it('should set color to black from integer 0x000000', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor(0x000000);

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should set color from a hex string with # prefix', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor('#00ff00');

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(255);
            expect(v.color.b).toBe(0);
        });

        it('should set color from a hex string with 0x prefix', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor('0x0000ff');

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(255);
        });

        it('should set color from a short hex string', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor('#f00');

            expect(v.color.r).toBe(255);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should set color from a Color-like object with setTo method', function ()
        {
            var v = new Vignette(mockCamera);
            var colorObj = {
                setTo: function () {},
                red: 128,
                green: 64,
                blue: 32,
                alpha: 255
            };

            v.setColor(colorObj);

            expect(v.color.r).toBe(128);
            expect(v.color.g).toBe(64);
            expect(v.color.b).toBe(32);
        });

        it('should set color from a plain object with r/g/b/a properties', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor({ r: 100, g: 150, b: 200, a: 255 });

            expect(v.color.r).toBe(100);
            expect(v.color.g).toBe(150);
            expect(v.color.b).toBe(200);
        });

        it('should default missing r/g/b values to 0 for plain objects', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor({});

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should set color to black when called with falsy value', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor(0xff0000);
            v.setColor(0);

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);
        });

        it('should overwrite a previously set color', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor(0xff0000);

            expect(v.color.r).toBe(255);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(0);

            v.setColor(0x0000ff);

            expect(v.color.r).toBe(0);
            expect(v.color.g).toBe(0);
            expect(v.color.b).toBe(255);
        });

        it('should not replace the color object reference, only update it', function ()
        {
            var v = new Vignette(mockCamera);
            var originalColor = v.color;

            v.setColor(0xff0000);

            expect(v.color).toBe(originalColor);
        });

        it('should handle a mixed-channel integer color correctly', function ()
        {
            var v = new Vignette(mockCamera);
            v.setColor(0x804020);

            expect(v.color.r).toBe(128);
            expect(v.color.g).toBe(64);
            expect(v.color.b).toBe(32);
        });
    });
});
