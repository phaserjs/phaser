var CaptureFrameRender = require('../../../src/gameobjects/captureframe/CaptureFrameRender');

describe('CaptureFrameRender', function ()
{
    it('should be importable', function ()
    {
        expect(CaptureFrameRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(CaptureFrameRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(CaptureFrameRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof CaptureFrameRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof CaptureFrameRender.renderCanvas).toBe('function');
    });

    it('should have renderCanvas as NOOP (returns undefined)', function ()
    {
        var result = CaptureFrameRender.renderCanvas();
        expect(result).toBeUndefined();
    });

    it('should have renderCanvas that accepts arguments without throwing', function ()
    {
        expect(function ()
        {
            CaptureFrameRender.renderCanvas({}, {}, {});
        }).not.toThrow();
    });
});
