var TextWebGLRenderer = require('../../../src/gameobjects/text/TextWebGLRenderer');

describe('TextWebGLRenderer', function ()
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

        src = {
            width: 100,
            height: 50,
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: mockSubmitter,
                Texturer: mockTexturer,
                Transformer: mockTransformer
            }
        };

        parentMatrix = {};
    });

    it('should be importable', function ()
    {
        expect(TextWebGLRenderer).toBeDefined();
        expect(typeof TextWebGLRenderer).toBe('function');
    });

    it('should return early when src.width is 0', function ()
    {
        src.width = 0;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should return early when src.height is 0', function ()
    {
        src.height = 0;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should return early when both width and height are 0', function ()
    {
        src.width = 0;
        src.height = 0;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).not.toHaveBeenCalled();
        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should call addToRenderList when dimensions are valid', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledOnce();
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should use defaultRenderNodes.Submitter when no custom Submitter exists', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run).toHaveBeenCalledOnce();
    });

    it('should use customRenderNodes.Submitter over defaultRenderNodes.Submitter', function ()
    {
        var customSubmitter = { run: vi.fn() };
        src.customRenderNodes.Submitter = customSubmitter;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledOnce();
        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should pass drawingContext as first argument to Submitter.run', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[0]).toBe(drawingContext);
    });

    it('should pass src as second argument to Submitter.run', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[1]).toBe(src);
    });

    it('should pass parentMatrix as third argument to Submitter.run', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[2]).toBe(parentMatrix);
    });

    it('should pass 0 as fourth argument to Submitter.run', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[3]).toBe(0);
    });

    it('should pass defaultRenderNodes.Texturer as fifth argument when no custom Texturer', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[4]).toBe(mockTexturer);
    });

    it('should pass customRenderNodes.Texturer as fifth argument when custom Texturer exists', function ()
    {
        var customTexturer = {};
        src.customRenderNodes.Texturer = customTexturer;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[4]).toBe(customTexturer);
    });

    it('should pass defaultRenderNodes.Transformer as sixth argument when no custom Transformer', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[5]).toBe(mockTransformer);
    });

    it('should pass customRenderNodes.Transformer as sixth argument when custom Transformer exists', function ()
    {
        var customTransformer = {};
        src.customRenderNodes.Transformer = customTransformer;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args[5]).toBe(customTransformer);
    });

    it('should use all custom render nodes when all are defined', function ()
    {
        var customSubmitter = { run: vi.fn() };
        var customTexturer = {};
        var customTransformer = {};

        src.customRenderNodes.Submitter = customSubmitter;
        src.customRenderNodes.Texturer = customTexturer;
        src.customRenderNodes.Transformer = customTransformer;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledOnce();
        var args = customSubmitter.run.mock.calls[0];
        expect(args[4]).toBe(customTexturer);
        expect(args[5]).toBe(customTransformer);
    });

    it('should not call Submitter.run when width is 0', function ()
    {
        src.width = 0;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should not call Submitter.run when height is 0', function ()
    {
        src.height = 0;

        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should call Submitter.run with exactly 6 arguments', function ()
    {
        TextWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var args = mockSubmitter.run.mock.calls[0];
        expect(args.length).toBe(6);
    });
});
