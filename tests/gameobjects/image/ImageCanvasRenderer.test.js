var ImageCanvasRenderer = require('../../../src/gameobjects/image/ImageCanvasRenderer');

describe('ImageCanvasRenderer', function ()
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
            frame: { name: 'testFrame' }
        };

        camera = {
            addToRenderList: vi.fn()
        };

        parentMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    });

    it('should be importable', function ()
    {
        expect(ImageCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof ImageCanvasRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with the source game object', function ()
    {
        ImageCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledTimes(1);
        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call renderer.batchSprite with src, src.frame, camera and parentMatrix', function ()
    {
        ImageCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledTimes(1);
        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, parentMatrix);
    });

    it('should call addToRenderList before batchSprite', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });
        renderer.batchSprite = vi.fn(function () { callOrder.push('batchSprite'); });

        ImageCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('batchSprite');
    });

    it('should pass src.frame (not src) as the second argument to batchSprite', function ()
    {
        var capturedArgs;

        renderer.batchSprite = vi.fn(function () { capturedArgs = Array.from(arguments); });

        ImageCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(capturedArgs[1]).toBe(src.frame);
        expect(capturedArgs[1]).not.toBe(src);
    });

    it('should work when parentMatrix is null', function ()
    {
        expect(function ()
        {
            ImageCanvasRenderer(renderer, src, camera, null);
        }).not.toThrow();

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, null);
    });

    it('should work when parentMatrix is undefined', function ()
    {
        expect(function ()
        {
            ImageCanvasRenderer(renderer, src, camera, undefined);
        }).not.toThrow();

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, undefined);
    });

    it('should pass the camera reference through to batchSprite', function ()
    {
        var capturedCamera;

        renderer.batchSprite = vi.fn(function (s, f, cam) { capturedCamera = cam; });

        ImageCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(capturedCamera).toBe(camera);
    });
});
