var VideoRender = require('../../../src/gameobjects/video/VideoRender');

describe('VideoRender', function ()
{
    it('should be importable', function ()
    {
        expect(VideoRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof VideoRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof VideoRender.renderCanvas).toBe('function');
    });

    it('should have renderWebGL that does not throw when src has no videoTexture', function ()
    {
        var src = { videoTexture: null };
        expect(function ()
        {
            VideoRender.renderWebGL(null, src, null, null);
        }).not.toThrow();
    });

    it('should have renderCanvas that does not throw when src has no videoTexture', function ()
    {
        var src = { videoTexture: null };
        expect(function ()
        {
            VideoRender.renderCanvas(null, src, null, null);
        }).not.toThrow();
    });

    it('should have renderWebGL that returns undefined when src has no videoTexture', function ()
    {
        var src = { videoTexture: null };
        var result = VideoRender.renderWebGL(null, src, null, null);
        expect(result).toBeUndefined();
    });

    it('should have renderCanvas that returns undefined when src has no videoTexture', function ()
    {
        var src = { videoTexture: null };
        var result = VideoRender.renderCanvas(null, src, null, null);
        expect(result).toBeUndefined();
    });
});
