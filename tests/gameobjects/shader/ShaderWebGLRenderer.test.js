var ShaderWebGLRenderer = require('../../../src/gameobjects/shader/ShaderWebGLRenderer');

describe('ShaderWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var parentMatrix;
    var camera;

    beforeEach(function ()
    {
        camera = {
            addToRenderList: vi.fn(),
            setSize: vi.fn()
        };

        drawingContext = {
            camera: camera,
            width: 100,
            height: 100,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src = {
            renderToTexture: false,
            width: 100,
            height: 100,
            renderNode: {
                run: vi.fn()
            },
            drawingContext: drawingContext
        };

        renderer = {};
        parentMatrix = {};
    });

    it('should be importable', function ()
    {
        expect(ShaderWebGLRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof ShaderWebGLRenderer).toBe('function');
    });

    it('should add src to the render list via camera', function ()
    {
        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call renderNode.run with the drawingContext, src, and parentMatrix', function ()
    {
        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.renderNode.run).toHaveBeenCalledWith(drawingContext, src, parentMatrix);
    });

    it('should not call drawingContext.use when renderToTexture is false', function ()
    {
        src.renderToTexture = false;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.use).not.toHaveBeenCalled();
    });

    it('should not call drawingContext.release when renderToTexture is false', function ()
    {
        src.renderToTexture = false;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.release).not.toHaveBeenCalled();
    });

    it('should call drawingContext.use when renderToTexture is true', function ()
    {
        src.renderToTexture = true;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.use).toHaveBeenCalled();
    });

    it('should call drawingContext.release when renderToTexture is true', function ()
    {
        src.renderToTexture = true;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(drawingContext.release).toHaveBeenCalled();
    });

    it('should use src.drawingContext when renderToTexture is true', function ()
    {
        var srcDrawingContext = {
            camera: camera,
            width: 100,
            height: 100,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src.renderToTexture = true;
        src.drawingContext = srcDrawingContext;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(srcDrawingContext.use).toHaveBeenCalled();
        expect(srcDrawingContext.release).toHaveBeenCalled();
    });

    it('should not resize when renderToTexture dimensions match src dimensions', function ()
    {
        var srcDrawingContext = {
            camera: camera,
            width: 200,
            height: 200,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src.renderToTexture = true;
        src.width = 200;
        src.height = 200;
        src.drawingContext = srcDrawingContext;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(srcDrawingContext.resize).not.toHaveBeenCalled();
    });

    it('should resize when drawingContext width differs from src width', function ()
    {
        var srcDrawingContext = {
            camera: {
                addToRenderList: vi.fn(),
                setSize: vi.fn()
            },
            width: 50,
            height: 200,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src.renderToTexture = true;
        src.width = 200;
        src.height = 200;
        src.drawingContext = srcDrawingContext;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(srcDrawingContext.resize).toHaveBeenCalledWith(200, 200);
    });

    it('should resize when drawingContext height differs from src height', function ()
    {
        var srcDrawingContext = {
            camera: {
                addToRenderList: vi.fn(),
                setSize: vi.fn()
            },
            width: 200,
            height: 50,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src.renderToTexture = true;
        src.width = 200;
        src.height = 200;
        src.drawingContext = srcDrawingContext;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(srcDrawingContext.resize).toHaveBeenCalledWith(200, 200);
    });

    it('should update camera size when resizing', function ()
    {
        var innerCamera = {
            addToRenderList: vi.fn(),
            setSize: vi.fn()
        };

        var srcDrawingContext = {
            camera: innerCamera,
            width: 50,
            height: 50,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src.renderToTexture = true;
        src.width = 300;
        src.height = 150;
        src.drawingContext = srcDrawingContext;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(innerCamera.setSize).toHaveBeenCalledWith(300, 150);
    });

    it('should run renderNode with src.drawingContext when renderToTexture is true', function ()
    {
        var srcDrawingContext = {
            camera: camera,
            width: 100,
            height: 100,
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        src.renderToTexture = true;
        src.drawingContext = srcDrawingContext;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.renderNode.run).toHaveBeenCalledWith(srcDrawingContext, src, parentMatrix);
    });

    it('should run renderNode with the original drawingContext when renderToTexture is false', function ()
    {
        src.renderToTexture = false;

        ShaderWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.renderNode.run).toHaveBeenCalledWith(drawingContext, src, parentMatrix);
    });

    it('should pass parentMatrix to renderNode.run', function ()
    {
        var matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

        ShaderWebGLRenderer(renderer, src, drawingContext, matrix);

        expect(src.renderNode.run).toHaveBeenCalledWith(drawingContext, src, matrix);
    });
});
