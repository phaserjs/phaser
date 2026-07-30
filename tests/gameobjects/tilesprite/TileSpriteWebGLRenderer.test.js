var TileSpriteWebGLRenderer = require('../../../src/gameobjects/tilesprite/TileSpriteWebGLRenderer');

describe('TileSpriteWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var parentMatrix;
    var camera;
    var defaultSubmitter;
    var customSubmitter;
    var defaultTexturer;
    var customTexturer;
    var defaultTransformer;
    var customTransformer;

    beforeEach(function ()
    {
        renderer = {};

        camera = {
            addToRenderList: vi.fn()
        };

        drawingContext = {
            camera: camera
        };

        parentMatrix = {};

        defaultSubmitter = {
            run: vi.fn()
        };

        customSubmitter = {
            run: vi.fn()
        };

        defaultTexturer = {};
        customTexturer = {};
        defaultTransformer = {};
        customTransformer = {};

        src = {
            width: 100,
            height: 100,
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: defaultSubmitter,
                Texturer: defaultTexturer,
                Transformer: defaultTransformer
            }
        };
    });

    it('should be importable', function ()
    {
        expect(TileSpriteWebGLRenderer).toBeDefined();
        expect(typeof TileSpriteWebGLRenderer).toBe('function');
    });

    it('should return early when width is zero', function ()
    {
        src.width = 0;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(defaultSubmitter.run).not.toHaveBeenCalled();
    });

    it('should return early when height is zero', function ()
    {
        src.height = 0;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(defaultSubmitter.run).not.toHaveBeenCalled();
    });

    it('should return early when both width and height are zero', function ()
    {
        src.width = 0;
        src.height = 0;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).not.toHaveBeenCalled();
        expect(defaultSubmitter.run).not.toHaveBeenCalled();
    });

    it('should NOT return early when width is negative', function ()
    {
        src.width = -1;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(defaultSubmitter.run).toHaveBeenCalledOnce();
    });

    it('should NOT return early when height is negative', function ()
    {
        src.height = -1;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(defaultSubmitter.run).toHaveBeenCalledOnce();
    });

    it('should add src to the camera render list when dimensions are valid', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call the default Submitter run when no custom Submitter is set', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledOnce();
    });

    it('should call the custom Submitter run when custom Submitter is set', function ()
    {
        src.customRenderNodes.Submitter = customSubmitter;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledOnce();
        expect(defaultSubmitter.run).not.toHaveBeenCalled();
    });

    it('should pass drawingContext as first argument to Submitter.run', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            drawingContext,
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything()
        );
    });

    it('should pass src as second argument to Submitter.run', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            src,
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything()
        );
    });

    it('should pass parentMatrix as third argument to Submitter.run', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            parentMatrix,
            expect.anything(),
            expect.anything(),
            expect.anything()
        );
    });

    it('should pass 0 as fourth argument to Submitter.run', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            0,
            expect.anything(),
            expect.anything()
        );
    });

    it('should pass default Texturer as fifth argument when no custom Texturer is set', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            defaultTexturer,
            expect.anything()
        );
    });

    it('should pass custom Texturer as fifth argument when custom Texturer is set', function ()
    {
        src.customRenderNodes.Texturer = customTexturer;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            customTexturer,
            expect.anything()
        );
    });

    it('should pass default Transformer as sixth argument when no custom Transformer is set', function ()
    {
        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            defaultTransformer
        );
    });

    it('should pass custom Transformer as sixth argument when custom Transformer is set', function ()
    {
        src.customRenderNodes.Transformer = customTransformer;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(defaultSubmitter.run).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            customTransformer
        );
    });

    it('should use all custom render nodes when all are provided', function ()
    {
        src.customRenderNodes.Submitter = customSubmitter;
        src.customRenderNodes.Texturer = customTexturer;
        src.customRenderNodes.Transformer = customTransformer;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customSubmitter.run).toHaveBeenCalledWith(
            drawingContext,
            src,
            parentMatrix,
            0,
            customTexturer,
            customTransformer
        );
    });

    it('should process when width and height are both 1', function ()
    {
        src.width = 1;
        src.height = 1;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(defaultSubmitter.run).toHaveBeenCalledOnce();
    });

    it('should process when width and height are large values', function ()
    {
        src.width = 4096;
        src.height = 4096;

        TileSpriteWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(defaultSubmitter.run).toHaveBeenCalledOnce();
    });
});
