var GetBlendModes = require('../../../../src/renderer/canvas/utils/GetBlendModes');
var modes = require('../../../../src/renderer/BlendModes');

vi.mock('../../../../src/device/CanvasFeatures', function ()
{
    return { supportNewBlendModes: false };
});

var CanvasFeatures = require('../../../../src/device/CanvasFeatures');

describe('Phaser.Renderer.Canvas.GetBlendModes', function ()
{
    beforeEach(function ()
    {
        CanvasFeatures.supportNewBlendModes = false;
    });

    it('should return an array', function ()
    {
        var result = GetBlendModes();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return an array with 28 entries', function ()
    {
        var result = GetBlendModes();
        expect(result.length).toBe(28);
    });

    it('should map NORMAL to source-over', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.NORMAL]).toBe('source-over');
    });

    it('should map ADD to lighter', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.ADD]).toBe('lighter');
    });

    it('should map ERASE to destination-out regardless of blend mode support', function ()
    {
        CanvasFeatures.supportNewBlendModes = false;
        var result = GetBlendModes();
        expect(result[modes.ERASE]).toBe('destination-out');

        CanvasFeatures.supportNewBlendModes = true;
        result = GetBlendModes();
        expect(result[modes.ERASE]).toBe('destination-out');
    });

    it('should map SOURCE_IN to source-in regardless of blend mode support', function ()
    {
        CanvasFeatures.supportNewBlendModes = false;
        var result = GetBlendModes();
        expect(result[modes.SOURCE_IN]).toBe('source-in');

        CanvasFeatures.supportNewBlendModes = true;
        result = GetBlendModes();
        expect(result[modes.SOURCE_IN]).toBe('source-in');
    });

    it('should map SOURCE_OUT to source-out regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.SOURCE_OUT]).toBe('source-out');
    });

    it('should map SOURCE_ATOP to source-atop regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.SOURCE_ATOP]).toBe('source-atop');
    });

    it('should map DESTINATION_OVER to destination-over regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.DESTINATION_OVER]).toBe('destination-over');
    });

    it('should map DESTINATION_IN to destination-in regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.DESTINATION_IN]).toBe('destination-in');
    });

    it('should map DESTINATION_OUT to destination-out regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.DESTINATION_OUT]).toBe('destination-out');
    });

    it('should map DESTINATION_ATOP to destination-atop regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.DESTINATION_ATOP]).toBe('destination-atop');
    });

    it('should map LIGHTER to lighter regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.LIGHTER]).toBe('lighter');
    });

    it('should map COPY to copy regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.COPY]).toBe('copy');
    });

    it('should map XOR to xor regardless of blend mode support', function ()
    {
        var result = GetBlendModes();
        expect(result[modes.XOR]).toBe('xor');
    });

    describe('when supportNewBlendModes is false', function ()
    {
        beforeEach(function ()
        {
            CanvasFeatures.supportNewBlendModes = false;
        });

        it('should map MULTIPLY to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.MULTIPLY]).toBe('source-over');
        });

        it('should map SCREEN to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.SCREEN]).toBe('source-over');
        });

        it('should map OVERLAY to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.OVERLAY]).toBe('source-over');
        });

        it('should map DARKEN to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.DARKEN]).toBe('source-over');
        });

        it('should map LIGHTEN to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.LIGHTEN]).toBe('source-over');
        });

        it('should map COLOR_DODGE to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.COLOR_DODGE]).toBe('source-over');
        });

        it('should map COLOR_BURN to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.COLOR_BURN]).toBe('source-over');
        });

        it('should map HARD_LIGHT to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.HARD_LIGHT]).toBe('source-over');
        });

        it('should map SOFT_LIGHT to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.SOFT_LIGHT]).toBe('source-over');
        });

        it('should map DIFFERENCE to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.DIFFERENCE]).toBe('source-over');
        });

        it('should map EXCLUSION to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.EXCLUSION]).toBe('source-over');
        });

        it('should map HUE to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.HUE]).toBe('source-over');
        });

        it('should map SATURATION to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.SATURATION]).toBe('source-over');
        });

        it('should map COLOR to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.COLOR]).toBe('source-over');
        });

        it('should map LUMINOSITY to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.LUMINOSITY]).toBe('source-over');
        });
    });

    describe('when supportNewBlendModes is true', function ()
    {
        beforeEach(function ()
        {
            CanvasFeatures.supportNewBlendModes = true;
        });

        it('should map MULTIPLY to multiply', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.MULTIPLY]).toBe('multiply');
        });

        it('should map SCREEN to screen', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.SCREEN]).toBe('screen');
        });

        it('should map OVERLAY to overlay', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.OVERLAY]).toBe('overlay');
        });

        it('should map DARKEN to darken', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.DARKEN]).toBe('darken');
        });

        it('should map LIGHTEN to lighten', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.LIGHTEN]).toBe('lighten');
        });

        it('should map COLOR_DODGE to color-dodge', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.COLOR_DODGE]).toBe('color-dodge');
        });

        it('should map COLOR_BURN to color-burn', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.COLOR_BURN]).toBe('color-burn');
        });

        it('should map HARD_LIGHT to hard-light', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.HARD_LIGHT]).toBe('hard-light');
        });

        it('should map SOFT_LIGHT to soft-light', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.SOFT_LIGHT]).toBe('soft-light');
        });

        it('should map DIFFERENCE to difference', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.DIFFERENCE]).toBe('difference');
        });

        it('should map EXCLUSION to exclusion', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.EXCLUSION]).toBe('exclusion');
        });

        it('should map HUE to hue', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.HUE]).toBe('hue');
        });

        it('should map SATURATION to saturation', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.SATURATION]).toBe('saturation');
        });

        it('should map COLOR to color', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.COLOR]).toBe('color');
        });

        it('should map LUMINOSITY to luminosity', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.LUMINOSITY]).toBe('luminosity');
        });

        it('should still map NORMAL to source-over', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.NORMAL]).toBe('source-over');
        });

        it('should still map ADD to lighter', function ()
        {
            var result = GetBlendModes();
            expect(result[modes.ADD]).toBe('lighter');
        });
    });

    it('should return a new array on each call', function ()
    {
        var result1 = GetBlendModes();
        var result2 = GetBlendModes();
        expect(result1).not.toBe(result2);
    });

    it('should index entries using the numeric BlendMode constants', function ()
    {
        var result = GetBlendModes();
        expect(result[0]).toBe('source-over');
        expect(result[1]).toBe('lighter');
        expect(result[17]).toBe('destination-out');
        expect(result[27]).toBe('xor');
    });
});
