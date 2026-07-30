var Shadow = require('../../src/filters/Shadow');

describe('Shadow', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {
            width: 800,
            height: 600
        };
    });

    describe('constructor', function ()
    {
        it('should create a Shadow with default values', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(shadow.x).toBe(0);
            expect(shadow.y).toBe(0);
            expect(shadow.decay).toBeCloseTo(0.1);
            expect(shadow.power).toBe(1);
            expect(shadow.samples).toBe(6);
            expect(shadow.intensity).toBe(1);
        });

        it('should set the renderNode to FilterShadow', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(shadow.renderNode).toBe('FilterShadow');
        });

        it('should store the camera reference', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(shadow.camera).toBe(mockCamera);
        });

        it('should create a Shadow with custom values', function ()
        {
            var shadow = new Shadow(mockCamera, 2, 3, 0.5, 2, 0xff0000, 8, 0.75);

            expect(shadow.x).toBe(2);
            expect(shadow.y).toBe(3);
            expect(shadow.decay).toBeCloseTo(0.5);
            expect(shadow.power).toBe(2);
            expect(shadow.samples).toBe(8);
            expect(shadow.intensity).toBeCloseTo(0.75);
        });

        it('should initialize glcolor as a 4-element array', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(Array.isArray(shadow.glcolor)).toBe(true);
            expect(shadow.glcolor.length).toBe(4);
        });

        it('should initialize glcolor with alpha 1 when no color is given', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(shadow.glcolor[0]).toBe(0);
            expect(shadow.glcolor[1]).toBe(0);
            expect(shadow.glcolor[2]).toBe(0);
            expect(shadow.glcolor[3]).toBe(1);
        });

        it('should apply color when provided in constructor', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 0, 0.1, 1, 0xff0000, 6, 1);

            expect(shadow.glcolor[0]).toBeCloseTo(1);
            expect(shadow.glcolor[1]).toBeCloseTo(0);
            expect(shadow.glcolor[2]).toBeCloseTo(0);
        });

        it('should be active by default', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(shadow.active).toBe(true);
        });

        it('should default x to 0 when undefined', function ()
        {
            var shadow = new Shadow(mockCamera, undefined);

            expect(shadow.x).toBe(0);
        });

        it('should default y to 0 when undefined', function ()
        {
            var shadow = new Shadow(mockCamera, 1, undefined);

            expect(shadow.y).toBe(0);
        });

        it('should default decay to 0.1 when undefined', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 0, undefined);

            expect(shadow.decay).toBeCloseTo(0.1);
        });

        it('should default power to 1 when undefined', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 0, 0.1, undefined);

            expect(shadow.power).toBe(1);
        });

        it('should default samples to 6 when undefined', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 0, 0.1, 1, undefined, undefined);

            expect(shadow.samples).toBe(6);
        });

        it('should default intensity to 1 when undefined', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 0, 0.1, 1, undefined, 6, undefined);

            expect(shadow.intensity).toBe(1);
        });
    });

    describe('color property', function ()
    {
        it('should get black color by default', function ()
        {
            var shadow = new Shadow(mockCamera);

            expect(shadow.color).toBe(0x000000);
        });

        it('should set and get red color', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.color = 0xff0000;

            expect(shadow.color).toBe(0xff0000);
        });

        it('should set and get green color', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.color = 0x00ff00;

            expect(shadow.color).toBe(0x00ff00);
        });

        it('should set and get blue color', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.color = 0x0000ff;

            expect(shadow.color).toBe(0x0000ff);
        });

        it('should set and get white color', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.color = 0xffffff;

            expect(shadow.color).toBe(0xffffff);
        });

        it('should update glcolor when color is set', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.color = 0xff8040;

            expect(shadow.glcolor[0]).toBeCloseTo(1);
            expect(shadow.glcolor[1]).toBeCloseTo(0x80 / 255);
            expect(shadow.glcolor[2]).toBeCloseTo(0x40 / 255);
        });

        it('should preserve glcolor alpha when color is set', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.color = 0xff0000;

            expect(shadow.glcolor[3]).toBe(1);
        });
    });

    describe('getPadding', function ()
    {
        it('should return the paddingOverride when it is set', function ()
        {
            var shadow = new Shadow(mockCamera);
            var result = shadow.getPadding();

            expect(result).toBe(shadow.paddingOverride);
        });

        it('should update currentPadding from override when override is active', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.paddingOverride.setTo(10, 20, 30, 40);

            shadow.getPadding();

            expect(shadow.currentPadding.x).toBe(10);
            expect(shadow.currentPadding.y).toBe(20);
            expect(shadow.currentPadding.width).toBe(30);
            expect(shadow.currentPadding.height).toBe(40);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var shadow = new Shadow(mockCamera);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result).toBe(shadow.currentPadding);
        });

        it('should compute zero padding when x and y offsets are zero', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 0, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
            expect(result.width).toBeCloseTo(0);
            expect(result.height).toBeCloseTo(0);
        });

        it('should compute padding based on x offset, camera width, decay and intensity', function ()
        {
            var shadow = new Shadow(mockCamera, 1, 0, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            var expectedX = Math.ceil(Math.abs(1) * 800 * (0.1 * 1));

            expect(result.x).toBe(-expectedX);
            expect(result.width).toBe(expectedX * 2);
        });

        it('should compute padding based on y offset, camera height, decay and intensity', function ()
        {
            var shadow = new Shadow(mockCamera, 0, 1, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            var expectedY = Math.ceil(Math.abs(1) * 600 * (0.1 * 1));

            expect(result.y).toBe(-expectedY);
            expect(result.height).toBe(expectedY * 2);
        });

        it('should use absolute value for negative x offset', function ()
        {
            var shadow = new Shadow(mockCamera, -1, 0, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            var expectedX = Math.ceil(Math.abs(-1) * 800 * (0.1 * 1));

            expect(result.x).toBe(-expectedX);
            expect(result.width).toBe(expectedX * 2);
        });

        it('should use absolute value for negative y offset', function ()
        {
            var shadow = new Shadow(mockCamera, 0, -1, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            var expectedY = Math.ceil(Math.abs(-1) * 600 * (0.1 * 1));

            expect(result.y).toBe(-expectedY);
            expect(result.height).toBe(expectedY * 2);
        });

        it('should scale padding with intensity', function ()
        {
            var shadow1 = new Shadow(mockCamera, 1, 1, 0.1, 1, undefined, 6, 1);
            shadow1.paddingOverride = null;

            var shadow2 = new Shadow(mockCamera, 1, 1, 0.1, 1, undefined, 6, 2);
            shadow2.paddingOverride = null;

            var result1 = shadow1.getPadding();
            var result2 = shadow2.getPadding();

            expect(Math.abs(result2.x)).toBeGreaterThan(Math.abs(result1.x));
            expect(Math.abs(result2.y)).toBeGreaterThan(Math.abs(result1.y));
        });

        it('should scale padding with decay', function ()
        {
            var shadow1 = new Shadow(mockCamera, 1, 1, 0.1, 1, undefined, 6, 1);
            shadow1.paddingOverride = null;

            var shadow2 = new Shadow(mockCamera, 1, 1, 0.5, 1, undefined, 6, 1);
            shadow2.paddingOverride = null;

            var result1 = shadow1.getPadding();
            var result2 = shadow2.getPadding();

            expect(Math.abs(result2.x)).toBeGreaterThan(Math.abs(result1.x));
            expect(Math.abs(result2.y)).toBeGreaterThan(Math.abs(result1.y));
        });

        it('should set currentPadding x and y as negative values', function ()
        {
            var shadow = new Shadow(mockCamera, 1, 1, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result.x).toBeLessThan(0);
            expect(result.y).toBeLessThan(0);
        });

        it('should set currentPadding width and height as positive values', function ()
        {
            var shadow = new Shadow(mockCamera, 1, 1, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
        });

        it('should produce symmetric padding (width = 2 * abs(x))', function ()
        {
            var shadow = new Shadow(mockCamera, 0.5, 0.5, 0.2, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result.width).toBe(Math.abs(result.x) * 2);
            expect(result.height).toBe(Math.abs(result.y) * 2);
        });

        it('should ceil the computed padding values', function ()
        {
            // Use values that would produce a fractional pixel count
            var shadow = new Shadow(mockCamera, 0.1, 0.1, 0.1, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            var rawX = Math.abs(0.1) * 800 * (0.1 * 1);
            var rawY = Math.abs(0.1) * 600 * (0.1 * 1);

            expect(Math.abs(result.x)).toBe(Math.ceil(rawX));
            expect(Math.abs(result.y)).toBe(Math.ceil(rawY));
        });

        it('should use camera width and height in the calculation', function ()
        {
            var narrowCamera = { width: 100, height: 100 };
            var wideCamera = { width: 1000, height: 1000 };

            var shadow1 = new Shadow(narrowCamera, 1, 1, 0.1, 1, undefined, 6, 1);
            shadow1.paddingOverride = null;

            var shadow2 = new Shadow(wideCamera, 1, 1, 0.1, 1, undefined, 6, 1);
            shadow2.paddingOverride = null;

            var result1 = shadow1.getPadding();
            var result2 = shadow2.getPadding();

            expect(Math.abs(result2.x)).toBeGreaterThan(Math.abs(result1.x));
            expect(Math.abs(result2.y)).toBeGreaterThan(Math.abs(result1.y));
        });

        it('should return zero padding when decay is zero', function ()
        {
            var shadow = new Shadow(mockCamera, 1, 1, 0, 1, undefined, 6, 1);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
            expect(result.width).toBeCloseTo(0);
            expect(result.height).toBeCloseTo(0);
        });

        it('should return zero padding when intensity is zero', function ()
        {
            var shadow = new Shadow(mockCamera, 1, 1, 0.1, 1, undefined, 6, 0);
            shadow.paddingOverride = null;

            var result = shadow.getPadding();

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
            expect(result.width).toBeCloseTo(0);
            expect(result.height).toBeCloseTo(0);
        });
    });
});
