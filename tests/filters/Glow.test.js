var Glow = require('../../src/filters/Glow');

describe('Glow', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = {};
    });

    describe('constructor', function ()
    {
        it('should set default outerStrength to 4', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.outerStrength).toBe(4);
        });

        it('should set default innerStrength to 0', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.innerStrength).toBe(0);
        });

        it('should set default scale to 1', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.scale).toBe(1);
        });

        it('should set default knockout to false', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.knockout).toBe(false);
        });

        it('should set default glcolor to [1, 1, 1, 1] when no color is given', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.glcolor[0]).toBe(1);
            expect(glow.glcolor[1]).toBe(1);
            expect(glow.glcolor[2]).toBe(1);
            expect(glow.glcolor[3]).toBe(1);
        });

        it('should set renderNode to FilterGlow', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.renderNode).toBe('FilterGlow');
        });

        it('should store the camera reference', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.camera).toBe(mockCamera);
        });

        it('should accept custom outerStrength', function ()
        {
            var glow = new Glow(mockCamera, undefined, 8, undefined, undefined, undefined, 10, 10);
            expect(glow.outerStrength).toBe(8);
        });

        it('should accept custom innerStrength', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, 3, undefined, undefined, 10, 10);
            expect(glow.innerStrength).toBe(3);
        });

        it('should accept custom scale', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, 2.5, undefined, 10, 10);
            expect(glow.scale).toBe(2.5);
        });

        it('should accept custom knockout as true', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, true, 10, 10);
            expect(glow.knockout).toBe(true);
        });

        it('should round and clamp quality to minimum 1', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 0, 10);
            expect(glow.quality).toBe(1);
        });

        it('should round quality to nearest integer', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 7.6, 10);
            expect(glow.quality).toBe(8);
        });

        it('should round and clamp distance to minimum 1', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 0);
            expect(glow.distance).toBe(1);
        });

        it('should round distance to nearest integer', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 5.7);
            expect(glow.distance).toBe(6);
        });

        it('should apply color when provided', function ()
        {
            var glow = new Glow(mockCamera, 0xff0000, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.glcolor[0]).toBeCloseTo(1, 5);
            expect(glow.glcolor[1]).toBeCloseTo(0, 5);
            expect(glow.glcolor[2]).toBeCloseTo(0, 5);
        });

        it('should be active by default', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.active).toBe(true);
        });
    });

    describe('color', function ()
    {
        it('should return 0xffffff when glcolor is [1,1,1,1]', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            expect(glow.color).toBe(0xffffff);
        });

        it('should set red component correctly', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0xff0000;
            expect(glow.glcolor[0]).toBeCloseTo(1, 5);
            expect(glow.glcolor[1]).toBeCloseTo(0, 5);
            expect(glow.glcolor[2]).toBeCloseTo(0, 5);
        });

        it('should set green component correctly', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0x00ff00;
            expect(glow.glcolor[0]).toBeCloseTo(0, 5);
            expect(glow.glcolor[1]).toBeCloseTo(1, 5);
            expect(glow.glcolor[2]).toBeCloseTo(0, 5);
        });

        it('should set blue component correctly', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0x0000ff;
            expect(glow.glcolor[0]).toBeCloseTo(0, 5);
            expect(glow.glcolor[1]).toBeCloseTo(0, 5);
            expect(glow.glcolor[2]).toBeCloseTo(1, 5);
        });

        it('should get back the color that was set for 0xff0000', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0xff0000;
            expect(glow.color).toBe(0xff0000);
        });

        it('should get back the color that was set for 0x00ff00', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0x00ff00;
            expect(glow.color).toBe(0x00ff00);
        });

        it('should get back the color that was set for 0x0000ff', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0x0000ff;
            expect(glow.color).toBe(0x0000ff);
        });

        it('should handle 0x000000 (black)', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.color = 0x000000;
            expect(glow.glcolor[0]).toBeCloseTo(0, 5);
            expect(glow.glcolor[1]).toBeCloseTo(0, 5);
            expect(glow.glcolor[2]).toBeCloseTo(0, 5);
            expect(glow.color).toBe(0x000000);
        });
    });

    describe('distance getter', function ()
    {
        it('should return the distance set at construction', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 20);
            expect(glow.distance).toBe(20);
        });

        it('should be readonly - assigning throws or has no effect', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 15);
            expect(function ()
            {
                glow.distance = 999;
            }).toThrow();
        });
    });

    describe('quality getter', function ()
    {
        it('should return the quality set at construction', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 5, 10);
            expect(glow.quality).toBe(5);
        });

        it('should be readonly - assigning throws or has no effect', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 5, 10);
            expect(function ()
            {
                glow.quality = 999;
            }).toThrow();
        });
    });

    describe('getPadding', function ()
    {
        it('should return the paddingOverride when it is set', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            var result = glow.getPadding();
            expect(result).toBe(glow.paddingOverride);
        });

        it('should copy paddingOverride values into currentPadding when override is active', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.paddingOverride.x = 5;
            glow.paddingOverride.y = 6;
            glow.paddingOverride.width = 7;
            glow.paddingOverride.height = 8;
            glow.getPadding();
            expect(glow.currentPadding.x).toBe(5);
            expect(glow.currentPadding.y).toBe(6);
            expect(glow.currentPadding.width).toBe(7);
            expect(glow.currentPadding.height).toBe(8);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, undefined, undefined, 10, 10);
            glow.setPaddingOverride(null);
            var result = glow.getPadding();
            expect(result).toBe(glow.currentPadding);
        });

        it('should calculate padding based on distance when override is null', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, 1, undefined, 10, 10);
            glow.setPaddingOverride(null);
            var padding = glow.getPadding();
            expect(padding.left).toBe(-10);
            expect(padding.top).toBe(-10);
            expect(padding.right).toBe(10);
            expect(padding.bottom).toBe(10);
        });

        it('should multiply distance by scale when calculating padding', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, 2, undefined, 10, 10);
            glow.setPaddingOverride(null);
            var padding = glow.getPadding();
            expect(padding.left).toBe(-20);
            expect(padding.top).toBe(-20);
            expect(padding.right).toBe(20);
            expect(padding.bottom).toBe(20);
        });

        it('should ceil the distance calculation for padding', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, 1.5, undefined, 10, 10);
            glow.setPaddingOverride(null);
            var padding = glow.getPadding();
            var expected = Math.ceil(10 * 1.5);
            expect(padding.left).toBe(-expected);
            expect(padding.right).toBe(expected);
        });

        it('should use scale of 0.5 correctly for padding', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, 0.5, undefined, 10, 10);
            glow.setPaddingOverride(null);
            var padding = glow.getPadding();
            var expected = Math.ceil(10 * 0.5);
            expect(padding.left).toBe(-expected);
            expect(padding.right).toBe(expected);
        });

        it('should use a minimum distance of 1 in padding calculation', function ()
        {
            var glow = new Glow(mockCamera, undefined, undefined, undefined, 1, undefined, 10, 0);
            glow.setPaddingOverride(null);
            var padding = glow.getPadding();
            expect(padding.left).toBe(-1);
            expect(padding.right).toBe(1);
        });
    });
});
