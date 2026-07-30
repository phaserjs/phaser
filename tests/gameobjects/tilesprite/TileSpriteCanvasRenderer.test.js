var TileSpriteCanvasRenderer = require('../../../src/gameobjects/tilesprite/TileSpriteCanvasRenderer');

describe('TileSpriteCanvasRenderer', function ()
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
            displayFrame: { name: 'testFrame' },
            updateCanvas: vi.fn()
        };

        camera = {
            addToRenderList: vi.fn()
        };

        parentMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
    });

    it('should be importable', function ()
    {
        expect(TileSpriteCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof TileSpriteCanvasRenderer).toBe('function');
    });

    it('should call src.updateCanvas', function ()
    {
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.updateCanvas).toHaveBeenCalledOnce();
    });

    it('should call camera.addToRenderList with src', function ()
    {
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call renderer.batchSprite with correct arguments', function ()
    {
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.displayFrame, camera, parentMatrix);
    });

    it('should call src.updateCanvas before camera.addToRenderList', function ()
    {
        var callOrder = [];

        src.updateCanvas = vi.fn(function () { callOrder.push('updateCanvas'); });
        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });

        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(callOrder[0]).toBe('updateCanvas');
        expect(callOrder[1]).toBe('addToRenderList');
    });

    it('should call camera.addToRenderList before renderer.batchSprite', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });
        renderer.batchSprite = vi.fn(function () { callOrder.push('batchSprite'); });

        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('batchSprite');
    });

    it('should pass src.displayFrame to renderer.batchSprite', function ()
    {
        var customFrame = { name: 'customFrame', width: 64, height: 64 };
        src.displayFrame = customFrame;

        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, customFrame, camera, parentMatrix);
    });

    it('should work when parentMatrix is null', function ()
    {
        expect(function ()
        {
            TileSpriteCanvasRenderer(renderer, src, camera, null);
        }).not.toThrow();

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.displayFrame, camera, null);
    });

    it('should work when parentMatrix is undefined', function ()
    {
        expect(function ()
        {
            TileSpriteCanvasRenderer(renderer, src, camera, undefined);
        }).not.toThrow();

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.displayFrame, camera, undefined);
    });

    it('should call each method exactly once per invocation', function ()
    {
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.updateCanvas).toHaveBeenCalledTimes(1);
        expect(camera.addToRenderList).toHaveBeenCalledTimes(1);
        expect(renderer.batchSprite).toHaveBeenCalledTimes(1);
    });

    it('should call each method the correct cumulative number of times across multiple invocations', function ()
    {
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);
        TileSpriteCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.updateCanvas).toHaveBeenCalledTimes(3);
        expect(camera.addToRenderList).toHaveBeenCalledTimes(3);
        expect(renderer.batchSprite).toHaveBeenCalledTimes(3);
    });
});
