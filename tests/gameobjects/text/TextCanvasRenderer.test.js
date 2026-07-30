var TextCanvasRenderer = require('../../../src/gameobjects/text/TextCanvasRenderer');

describe('TextCanvasRenderer', function ()
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
            width: 100,
            height: 50,
            frame: {}
        };

        camera = {
            addToRenderList: vi.fn()
        };

        parentMatrix = {};
    });

    it('should be importable', function ()
    {
        expect(TextCanvasRenderer).toBeDefined();
        expect(typeof TextCanvasRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with src when width and height are non-zero', function ()
    {
        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call renderer.batchSprite with correct arguments when width and height are non-zero', function ()
    {
        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, parentMatrix);
    });

    it('should not render when src.width is zero', function ()
    {
        src.width = 0;

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not render when src.height is zero', function ()
    {
        src.height = 0;

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not render when both src.width and src.height are zero', function ()
    {
        src.width = 0;
        src.height = 0;

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(renderer.batchSprite).not.toHaveBeenCalled();
    });

    it('should not render when src.width is negative', function ()
    {
        src.width = -1;

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(renderer.batchSprite).toHaveBeenCalled();
    });

    it('should pass parentMatrix to renderer.batchSprite', function ()
    {
        var customMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

        TextCanvasRenderer(renderer, src, camera, customMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera, customMatrix);
    });

    it('should pass src.frame to renderer.batchSprite', function ()
    {
        var customFrame = { name: 'frame0', realWidth: 100, realHeight: 50 };
        src.frame = customFrame;

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, customFrame, camera, parentMatrix);
    });

    it('should render when src.width is 1 and src.height is 1', function ()
    {
        src.width = 1;
        src.height = 1;

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(renderer.batchSprite).toHaveBeenCalled();
    });

    it('should call addToRenderList before batchSprite', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });
        renderer.batchSprite = vi.fn(function () { callOrder.push('batchSprite'); });

        TextCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('batchSprite');
    });
});
