var VideoCanvasRenderer = require('../../../src/gameobjects/video/VideoCanvasRenderer');

describe('VideoCanvasRenderer', function ()
{
    var renderer;
    var src;
    var camera;
    var parentMatrix;

    beforeEach(function ()
    {
        renderer = {
            batchSprite: vi.fn()
        };

        src = {
            videoTexture: {},
            frame: {}
        };

        camera = {
            addToRenderList: vi.fn()
        };

        parentMatrix = {};
    });

    it('should be importable', function ()
    {
        expect(VideoCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof VideoCanvasRenderer).toBe('function');
    });

    it('should call camera.addToRenderList when src.videoTexture is set', function ()
    {
        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledOnce();
    });

    it('should call camera.addToRenderList with src as the argument', function ()
    {
        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call renderer.batchSprite when src.videoTexture is set', function ()
    {
        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledOnce();
    });

    it('should call renderer.batchSprite with correct arguments', function ()
    {
        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, parentMatrix);
    });

    it('should pass src.frame to renderer.batchSprite', function ()
    {
        var frame = { key: 'testFrame' };
        src.frame = frame;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, frame, camera, parentMatrix);
    });

    it('should pass parentMatrix to renderer.batchSprite', function ()
    {
        var matrix = { a: 1, b: 0, c: 0, d: 1 };
        parentMatrix = matrix;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, matrix);
    });

    it('should not call camera.addToRenderList when src.videoTexture is falsy', function ()
    {
        src.videoTexture = null;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should not call renderer.batchSprite when src.videoTexture is null', function ()
    {
        src.videoTexture = null;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not call renderer.batchSprite when src.videoTexture is undefined', function ()
    {
        src.videoTexture = undefined;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not call renderer.batchSprite when src.videoTexture is false', function ()
    {
        src.videoTexture = false;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not call renderer.batchSprite when src.videoTexture is zero', function ()
    {
        src.videoTexture = 0;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not call renderer.batchSprite when src.videoTexture is an empty string', function ()
    {
        src.videoTexture = '';

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should call both methods in the correct order when videoTexture is set', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });
        renderer.batchSprite = vi.fn(function () { callOrder.push('batchSprite'); });

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('batchSprite');
    });

    it('should work when parentMatrix is undefined', function ()
    {
        VideoCanvasRenderer(renderer, src, camera, undefined);

        expect(camera.addToRenderList).toHaveBeenCalledOnce();
        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, undefined);
    });

    it('should work when videoTexture is a truthy non-object value', function ()
    {
        src.videoTexture = 1;

        VideoCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledOnce();
        expect(renderer.batchSprite).toHaveBeenCalledOnce();
    });
});
