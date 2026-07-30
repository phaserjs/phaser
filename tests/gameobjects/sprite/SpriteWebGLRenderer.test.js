var SpriteWebGLRenderer = require('../../../src/gameobjects/sprite/SpriteWebGLRenderer');

describe('SpriteWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var parentMatrix;
    var mockSubmitter;
    var mockTexturer;
    var mockTransformer;

    beforeEach(function ()
    {
        renderer = {};

        mockSubmitter = { run: vi.fn() };
        mockTexturer = {};
        mockTransformer = {};

        drawingContext = {
            camera: {
                addToRenderList: vi.fn()
            }
        };

        parentMatrix = {};

        src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: mockSubmitter,
                Texturer: mockTexturer,
                Transformer: mockTransformer
            }
        };
    });

    it('should call addToRenderList with the src game object', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call addToRenderList exactly once', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledTimes(1);
    });

    it('should use defaultRenderNodes.Submitter when no custom Submitter is set', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run).toHaveBeenCalledTimes(1);
    });

    it('should use customRenderNodes.Submitter when one is set', function ()
    {
        var customSubmitter = { run: vi.fn() };
        src.customRenderNodes.Submitter = customSubmitter;

        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledTimes(1);
        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should pass drawingContext as the first argument to Submitter.run', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][0]).toBe(drawingContext);
    });

    it('should pass src as the second argument to Submitter.run', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][1]).toBe(src);
    });

    it('should pass parentMatrix as the third argument to Submitter.run', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][2]).toBe(parentMatrix);
    });

    it('should pass 0 as the fourth argument to Submitter.run', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][3]).toBe(0);
    });

    it('should pass defaultRenderNodes.Texturer as the fifth argument when no custom Texturer', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][4]).toBe(mockTexturer);
    });

    it('should pass customRenderNodes.Texturer as the fifth argument when one is set', function ()
    {
        var customTexturer = {};
        src.customRenderNodes.Texturer = customTexturer;

        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][4]).toBe(customTexturer);
    });

    it('should pass defaultRenderNodes.Transformer as the sixth argument when no custom Transformer', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][5]).toBe(mockTransformer);
    });

    it('should pass customRenderNodes.Transformer as the sixth argument when one is set', function ()
    {
        var customTransformer = {};
        src.customRenderNodes.Transformer = customTransformer;

        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][5]).toBe(customTransformer);
    });

    it('should pass all custom render nodes when all are set', function ()
    {
        var customSubmitter = { run: vi.fn() };
        var customTexturer = {};
        var customTransformer = {};

        src.customRenderNodes.Submitter = customSubmitter;
        src.customRenderNodes.Texturer = customTexturer;
        src.customRenderNodes.Transformer = customTransformer;

        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            customTexturer,
            customTransformer
        );
    });

    it('should pass all default render nodes when none are custom', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            mockTexturer,
            mockTransformer
        );
    });

    it('should work with a null parentMatrix', function ()
    {
        SpriteWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockSubmitter.run.mock.calls[0][2]).toBeNull();
    });
});
