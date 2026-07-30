var ImageWebGLRenderer = require('../../../src/gameobjects/image/ImageWebGLRenderer');

describe('ImageWebGLRenderer', function ()
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
        mockSubmitter = { run: vi.fn() };
        mockTexturer = {};
        mockTransformer = {};

        renderer = {};

        drawingContext = {
            camera: {
                addToRenderList: vi.fn()
            }
        };

        src = {
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
        expect(ImageWebGLRenderer).toBeDefined();
        expect(typeof ImageWebGLRenderer).toBe('function');
    });

    it('should call addToRenderList with the src game object', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledOnce();
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call run on the default Submitter when no custom Submitter is set', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run).toHaveBeenCalledOnce();
    });

    it('should pass drawingContext as the first argument to run', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][0]).toBe(drawingContext);
    });

    it('should pass src as the second argument to run', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][1]).toBe(src);
    });

    it('should pass parentMatrix as the third argument to run', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][2]).toBe(parentMatrix);
    });

    it('should pass 0 as the fourth argument to run', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][3]).toBe(0);
    });

    it('should pass the default Texturer as the fifth argument to run when no custom Texturer is set', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][4]).toBe(mockTexturer);
    });

    it('should pass the default Transformer as the sixth argument to run when no custom Transformer is set', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][5]).toBe(mockTransformer);
    });

    it('should use custom Submitter over default Submitter when set', function ()
    {
        var customSubmitter = { run: vi.fn() };
        src.customRenderNodes.Submitter = customSubmitter;

        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledOnce();
        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should pass custom Texturer to run when set', function ()
    {
        var customTexturer = {};
        src.customRenderNodes.Texturer = customTexturer;

        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][4]).toBe(customTexturer);
    });

    it('should pass custom Transformer to run when set', function ()
    {
        var customTransformer = {};
        src.customRenderNodes.Transformer = customTransformer;

        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(mockSubmitter.run.mock.calls[0][5]).toBe(customTransformer);
    });

    it('should use all custom render nodes when all are set', function ()
    {
        var customSubmitter = { run: vi.fn() };
        var customTexturer = {};
        var customTransformer = {};

        src.customRenderNodes = {
            Submitter: customSubmitter,
            Texturer: customTexturer,
            Transformer: customTransformer
        };

        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledOnce();
        expect(customSubmitter.run.mock.calls[0][4]).toBe(customTexturer);
        expect(customSubmitter.run.mock.calls[0][5]).toBe(customTransformer);
        expect(mockSubmitter.run).not.toHaveBeenCalled();
    });

    it('should call addToRenderList before calling run', function ()
    {
        var callOrder = [];

        drawingContext.camera.addToRenderList = vi.fn(function ()
        {
            callOrder.push('addToRenderList');
        });

        mockSubmitter.run = vi.fn(function ()
        {
            callOrder.push('run');
        });

        ImageWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('run');
    });

    it('should work with a null parentMatrix', function ()
    {
        ImageWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockSubmitter.run.mock.calls[0][2]).toBeNull();
    });
});
