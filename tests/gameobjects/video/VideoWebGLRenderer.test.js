var VideoWebGLRenderer = require('../../../src/gameobjects/video/VideoWebGLRenderer');

describe('VideoWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var parentMatrix;
    var mockRun;
    var mockAddToRenderList;

    beforeEach(function ()
    {
        mockRun = vi.fn();
        mockAddToRenderList = vi.fn();

        renderer = {};

        src = {
            videoTexture: {},
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: { run: mockRun },
                Texturer: { name: 'defaultTexturer' },
                Transformer: { name: 'defaultTransformer' }
            }
        };

        drawingContext = {
            camera: {
                addToRenderList: mockAddToRenderList
            }
        };

        parentMatrix = {};
    });

    it('should be a function', function ()
    {
        expect(typeof VideoWebGLRenderer).toBe('function');
    });

    it('should return early if src.videoTexture is falsy', function ()
    {
        src.videoTexture = null;

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockAddToRenderList).not.toHaveBeenCalled();
        expect(mockRun).not.toHaveBeenCalled();
    });

    it('should return early if src.videoTexture is undefined', function ()
    {
        src.videoTexture = undefined;

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockAddToRenderList).not.toHaveBeenCalled();
        expect(mockRun).not.toHaveBeenCalled();
    });

    it('should return early if src.videoTexture is false', function ()
    {
        src.videoTexture = false;

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockAddToRenderList).not.toHaveBeenCalled();
        expect(mockRun).not.toHaveBeenCalled();
    });

    it('should add src to render list when videoTexture is set', function ()
    {
        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockAddToRenderList).toHaveBeenCalledOnce();
        expect(mockAddToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call run on the default Submitter when no custom Submitter is set', function ()
    {
        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockRun).toHaveBeenCalledOnce();
    });

    it('should call run with correct arguments using default nodes', function ()
    {
        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockRun).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            src.defaultRenderNodes.Texturer,
            src.defaultRenderNodes.Transformer
        );
    });

    it('should use custom Submitter when provided', function ()
    {
        var customRun = vi.fn();
        src.customRenderNodes.Submitter = { run: customRun };

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customRun).toHaveBeenCalledOnce();
        expect(mockRun).not.toHaveBeenCalled();
    });

    it('should pass custom Texturer to run when provided', function ()
    {
        var customTexturer = { name: 'customTexturer' };
        src.customRenderNodes.Texturer = customTexturer;

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockRun).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            customTexturer,
            src.defaultRenderNodes.Transformer
        );
    });

    it('should pass custom Transformer to run when provided', function ()
    {
        var customTransformer = { name: 'customTransformer' };
        src.customRenderNodes.Transformer = customTransformer;

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockRun).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            src.defaultRenderNodes.Texturer,
            customTransformer
        );
    });

    it('should use all custom render nodes when all are provided', function ()
    {
        var customRun = vi.fn();
        var customTexturer = { name: 'customTexturer' };
        var customTransformer = { name: 'customTransformer' };

        src.customRenderNodes.Submitter = { run: customRun };
        src.customRenderNodes.Texturer = customTexturer;
        src.customRenderNodes.Transformer = customTransformer;

        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customRun).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            customTexturer,
            customTransformer
        );
    });

    it('should pass 0 as the fourth argument to run', function ()
    {
        VideoWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var callArgs = mockRun.mock.calls[0];
        expect(callArgs[3]).toBe(0);
    });

    it('should pass parentMatrix as the third argument to run', function ()
    {
        var specificMatrix = { a: 1, b: 2 };

        VideoWebGLRenderer(renderer, src, drawingContext, specificMatrix);

        var callArgs = mockRun.mock.calls[0];
        expect(callArgs[2]).toBe(specificMatrix);
    });
});
