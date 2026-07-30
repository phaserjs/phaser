var RenderTextureCanvasRenderer = require('../../../src/gameobjects/rendertexture/RenderTextureCanvasRenderer');
var RenderTextureRenderModes = require('../../../src/gameobjects/rendertexture/RenderTextureRenderModes');

describe('RenderTextureCanvasRenderer', function ()
{
    var renderer;
    var camera;
    var parentMatrix;
    var src;

    beforeEach(function ()
    {
        renderer = {
            batchSprite: vi.fn()
        };
        camera = {
            addToRenderList: vi.fn()
        };
        parentMatrix = {};
        src = {
            renderMode: RenderTextureRenderModes.ALL,
            render: vi.fn(),
            frame: {}
        };
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    it('should be importable', function ()
    {
        expect(RenderTextureCanvasRenderer).toBeDefined();
        expect(typeof RenderTextureCanvasRenderer).toBe('function');
    });

    it('should return undefined', function ()
    {
        var result = RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(result).toBeUndefined();
    });

    it('should call src.render() when renderMode is ALL', function ()
    {
        src.renderMode = RenderTextureRenderModes.ALL;

        RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.render).toHaveBeenCalledOnce();
    });

    it('should call src.render() when renderMode is REDRAW', function ()
    {
        src.renderMode = RenderTextureRenderModes.REDRAW;

        RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.render).toHaveBeenCalledOnce();
    });

    it('should not call src.render() when renderMode is RENDER', function ()
    {
        src.renderMode = RenderTextureRenderModes.RENDER;

        RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.render).not.toHaveBeenCalled();
    });

    it('should call src.render with no arguments', function ()
    {
        src.renderMode = RenderTextureRenderModes.ALL;

        RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.render).toHaveBeenCalledWith();
    });

    it('should not throw in ALL mode', function ()
    {
        src.renderMode = RenderTextureRenderModes.ALL;

        expect(function ()
        {
            RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);
        }).not.toThrow();
    });

    it('should not throw in RENDER mode', function ()
    {
        src.renderMode = RenderTextureRenderModes.RENDER;

        expect(function ()
        {
            RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);
        }).not.toThrow();
    });

    it('should not throw in REDRAW mode', function ()
    {
        src.renderMode = RenderTextureRenderModes.REDRAW;

        expect(function ()
        {
            RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);
        }).not.toThrow();
    });

    it('should call src.render exactly once in ALL mode, not multiple times', function ()
    {
        src.renderMode = RenderTextureRenderModes.ALL;

        RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.render).toHaveBeenCalledTimes(1);
    });

    it('should call src.render exactly once in REDRAW mode, not multiple times', function ()
    {
        src.renderMode = RenderTextureRenderModes.REDRAW;

        RenderTextureCanvasRenderer(renderer, src, camera, parentMatrix);

        expect(src.render).toHaveBeenCalledTimes(1);
    });
});
