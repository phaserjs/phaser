var CaptureFrameWebGLRenderer = require('../../../src/gameobjects/captureframe/CaptureFrameWebGLRenderer');

describe('CaptureFrameWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var mockBatch;
    var mockCamera;
    var mockSrcDrawingContext;

    beforeEach(function ()
    {
        mockBatch = vi.fn();
        mockCamera = { addToRenderList: vi.fn() };
        mockSrcDrawingContext = {
            resize: vi.fn(),
            use: vi.fn(),
            release: vi.fn()
        };

        renderer = {};

        src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                BatchHandler: { batch: mockBatch }
            },
            drawingContext: mockSrcDrawingContext
        };

        drawingContext = {
            useCanvas: false,
            camera: mockCamera,
            width: 800,
            height: 600,
            texture: {}
        };
    });

    it('should be importable', function ()
    {
        expect(CaptureFrameWebGLRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof CaptureFrameWebGLRenderer).toBe('function');
    });

    it('should call addToRenderList with src when useCanvas is false', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockCamera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should not call addToRenderList when useCanvas is true', function ()
    {
        drawingContext.useCanvas = true;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockCamera.addToRenderList).not.toHaveBeenCalled();
    });

    it('should resize src drawingContext to match drawingContext dimensions', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockSrcDrawingContext.resize).toHaveBeenCalledWith(800, 600);
    });

    it('should call use() on src drawingContext', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockSrcDrawingContext.use).toHaveBeenCalled();
    });

    it('should call release() on src drawingContext', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockSrcDrawingContext.release).toHaveBeenCalled();
    });

    it('should call batch on defaultRenderNodes.BatchHandler when no custom handler', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockBatch).toHaveBeenCalled();
    });

    it('should prefer customRenderNodes.BatchHandler over default when present', function ()
    {
        var customBatch = vi.fn();
        src.customRenderNodes.BatchHandler = { batch: customBatch };

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(customBatch).toHaveBeenCalled();
        expect(mockBatch).not.toHaveBeenCalled();
    });

    it('should pass src.drawingContext as first argument to batch', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockBatch.mock.calls[0][0]).toBe(mockSrcDrawingContext);
    });

    it('should pass drawingContext.texture as second argument to batch', function ()
    {
        var mockTexture = { id: 'texture' };
        drawingContext.texture = mockTexture;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockBatch.mock.calls[0][1]).toBe(mockTexture);
    });

    it('should pass correct quad coordinates using width and height', function ()
    {
        drawingContext.width = 320;
        drawingContext.height = 240;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        var args = mockBatch.mock.calls[0];

        // Quad in order TL, BL, TR, BR: x, y pairs
        expect(args[2]).toBe(0);    // TL x
        expect(args[3]).toBe(240);  // TL y (height)
        expect(args[4]).toBe(0);    // BL x
        expect(args[5]).toBe(0);    // BL y
        expect(args[6]).toBe(320);  // TR x (width)
        expect(args[7]).toBe(240);  // TR y (height)
        expect(args[8]).toBe(320);  // BR x (width)
        expect(args[9]).toBe(0);    // BR y
    });

    it('should pass correct texture coordinates to batch', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        var args = mockBatch.mock.calls[0];

        // Texture coords: x=0, y=0, w=1, h=1
        expect(args[10]).toBe(0);
        expect(args[11]).toBe(0);
        expect(args[12]).toBe(1);
        expect(args[13]).toBe(1);
    });

    it('should pass false for tint color flag', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        var args = mockBatch.mock.calls[0];

        expect(args[14]).toBe(false);
    });

    it('should pass white tint colors for all four corners', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        var args = mockBatch.mock.calls[0];

        expect(args[15]).toBe(0xffffffff);
        expect(args[16]).toBe(0xffffffff);
        expect(args[17]).toBe(0xffffffff);
        expect(args[18]).toBe(0xffffffff);
    });

    it('should pass an empty object as render options', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        var args = mockBatch.mock.calls[0];

        expect(typeof args[19]).toBe('object');
    });

    it('should return early without calling batch when useCanvas is true', function ()
    {
        drawingContext.useCanvas = true;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockBatch).not.toHaveBeenCalled();
    });

    it('should return early without resizing src drawingContext when useCanvas is true', function ()
    {
        drawingContext.useCanvas = true;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockSrcDrawingContext.resize).not.toHaveBeenCalled();
    });

    it('should call use() before batch', function ()
    {
        var callOrder = [];
        mockSrcDrawingContext.use = vi.fn(function () { callOrder.push('use'); });
        mockBatch = vi.fn(function () { callOrder.push('batch'); });
        src.defaultRenderNodes.BatchHandler.batch = mockBatch;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(callOrder.indexOf('use')).toBeLessThan(callOrder.indexOf('batch'));
    });

    it('should call batch before release', function ()
    {
        var callOrder = [];
        mockBatch = vi.fn(function () { callOrder.push('batch'); });
        src.defaultRenderNodes.BatchHandler.batch = mockBatch;
        mockSrcDrawingContext.release = vi.fn(function () { callOrder.push('release'); });

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(callOrder.indexOf('batch')).toBeLessThan(callOrder.indexOf('release'));
    });

    it('should handle different width and height values correctly', function ()
    {
        drawingContext.width = 1920;
        drawingContext.height = 1080;

        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockSrcDrawingContext.resize).toHaveBeenCalledWith(1920, 1080);

        var args = mockBatch.mock.calls[0];
        expect(args[3]).toBe(1080);  // TL y = height
        expect(args[6]).toBe(1920);  // TR x = width
        expect(args[7]).toBe(1080);  // TR y = height
        expect(args[8]).toBe(1920);  // BR x = width
    });

    it('should not produce unexpected side effects when called multiple times with useCanvas false', function ()
    {
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);
        CaptureFrameWebGLRenderer(renderer, src, drawingContext);

        expect(mockCamera.addToRenderList).toHaveBeenCalledTimes(2);
        expect(mockBatch).toHaveBeenCalledTimes(2);
        expect(mockSrcDrawingContext.release).toHaveBeenCalledTimes(2);
    });
});
