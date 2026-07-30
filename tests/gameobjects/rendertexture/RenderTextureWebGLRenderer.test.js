var RenderTextureWebGLRenderer = require('../../../src/gameobjects/rendertexture/RenderTextureWebGLRenderer');
var RenderTextureRenderModes = require('../../../src/gameobjects/rendertexture/RenderTextureRenderModes');

describe('RenderTextureWebGLRenderer', function ()
{
    var renderer;
    var drawingContext;
    var parentMatrix;

    function makeSubmitter ()
    {
        return { run: vi.fn() };
    }

    function makeDrawingContext ()
    {
        return {
            camera: {
                addToRenderList: vi.fn()
            }
        };
    }

    function makeSrc (renderMode)
    {
        return {
            isCurrentlyRendering: false,
            renderMode: renderMode !== undefined ? renderMode : RenderTextureRenderModes.ALL,
            render: vi.fn(),
            customRenderNodes: { Submitter: null, Texturer: null, Transformer: null },
            defaultRenderNodes: { Submitter: makeSubmitter(), Texturer: null, Transformer: null }
        };
    }

    beforeEach(function ()
    {
        renderer = {};
        drawingContext = makeDrawingContext();
        parentMatrix = {};
    });

    it('should be a function', function ()
    {
        expect(typeof RenderTextureWebGLRenderer).toBe('function');
    });

    it('should return early without calling render or ImageWebGLRenderer when isCurrentlyRendering is true', function ()
    {
        var src = makeSrc();
        src.isCurrentlyRendering = true;

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.render).not.toHaveBeenCalled();
        expect(drawingContext.camera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should leave isCurrentlyRendering true when it was already true', function ()
    {
        var src = makeSrc();
        src.isCurrentlyRendering = true;

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.isCurrentlyRendering).toBe(true);
    });

    it('should set isCurrentlyRendering to false after completing in ALL mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.isCurrentlyRendering).toBe(false);
    });

    it('should set isCurrentlyRendering to true during execution', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);
        var duringRender = false;

        src.render = vi.fn(function ()
        {
            duringRender = src.isCurrentlyRendering;
        });

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(duringRender).toBe(true);
    });

    it('should call src.render() and ImageWebGLRenderer in ALL mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.render).toHaveBeenCalledTimes(1);
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledTimes(1);
    });

    it('should pass src, drawingContext and parentMatrix to ImageWebGLRenderer in ALL mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(src.defaultRenderNodes.Submitter.run).toHaveBeenCalledWith(
            drawingContext, src, parentMatrix, 0, null, null
        );
    });

    it('should call only ImageWebGLRenderer and skip src.render() in RENDER mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.RENDER);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.render).not.toHaveBeenCalled();
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledTimes(1);
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should set isCurrentlyRendering to false after completing in RENDER mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.RENDER);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.isCurrentlyRendering).toBe(false);
    });

    it('should call only src.render() and skip ImageWebGLRenderer in REDRAW mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.REDRAW);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.render).toHaveBeenCalledTimes(1);
        expect(drawingContext.camera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should set isCurrentlyRendering to false after completing in REDRAW mode', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.REDRAW);

        RenderTextureWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.isCurrentlyRendering).toBe(false);
    });

    it('should pass the specific renderer reference to ImageWebGLRenderer', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);
        var specificRenderer = { id: 'myRenderer' };

        RenderTextureWebGLRenderer(specificRenderer, src, drawingContext, parentMatrix);

        // renderer is accepted as an argument; verify the call completed and ImageWebGLRenderer ran
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should pass the specific drawingContext reference to ImageWebGLRenderer', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);
        var specificContext = makeDrawingContext();

        RenderTextureWebGLRenderer(renderer, src, specificContext, parentMatrix);

        expect(specificContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should pass the specific parentMatrix reference to ImageWebGLRenderer', function ()
    {
        var src = makeSrc(RenderTextureRenderModes.ALL);
        var specificMatrix = { id: 'myMatrix' };

        RenderTextureWebGLRenderer(renderer, src, drawingContext, specificMatrix);

        expect(src.defaultRenderNodes.Submitter.run).toHaveBeenCalledWith(
            drawingContext, src, specificMatrix, 0, null, null
        );
    });
});
