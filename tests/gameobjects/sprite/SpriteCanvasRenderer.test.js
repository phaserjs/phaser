var SpriteCanvasRenderer = require('../../../src/gameobjects/sprite/SpriteCanvasRenderer');

describe('SpriteCanvasRenderer', function ()
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
            frame: { name: 'frame0' }
        };

        camera = {
            addToRenderList: vi.fn()
        };

        parentMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    });

    it('should be importable', function ()
    {
        expect(SpriteCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof SpriteCanvasRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with the src game object', function ()
    {
        SpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call renderer.batchSprite with src, src.frame, camera and parentMatrix', function ()
    {
        SpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, parentMatrix);
    });

    it('should call camera.addToRenderList before renderer.batchSprite', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });
        renderer.batchSprite = vi.fn(function () { callOrder.push('batchSprite'); });

        SpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('batchSprite');
    });

    it('should call each method exactly once per render call', function ()
    {
        SpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledTimes(1);
        expect(renderer.batchSprite).toHaveBeenCalledTimes(1);
    });

    it('should pass src.frame as the second argument to batchSprite', function ()
    {
        var customFrame = { name: 'customFrame', realWidth: 64, realHeight: 64 };
        src.frame = customFrame;

        SpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, customFrame, camera, parentMatrix);
    });

    it('should work when parentMatrix is null', function ()
    {
        expect(function ()
        {
            SpriteCanvasRenderer(renderer, src, camera, null);
        }).not.toThrow();

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, null);
    });

    it('should work when parentMatrix is undefined', function ()
    {
        expect(function ()
        {
            SpriteCanvasRenderer(renderer, src, camera, undefined);
        }).not.toThrow();

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, undefined);
    });
});
