var PointLightWebGLRenderer = require('../../../src/gameobjects/pointlight/PointLightWebGLRenderer');
var TransformMatrix = require('../../../src/gameobjects/components/TransformMatrix');

// With an identity camera matrix, src at (0,0), scale (1,1), rotation 0:
// GetCalcMatrix produces an identity calcMatrix, so getX(x,y)=x and getY(x,y)=y.

describe('PointLightWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var camera;
    var mockBatchFn;

    beforeEach(function ()
    {
        mockBatchFn = vi.fn();

        camera = {
            matrix: new TransformMatrix(),
            matrixCombined: new TransformMatrix(),
            matrixExternal: new TransformMatrix(),
            scrollX: 0,
            scrollY: 0,
            addToRenderList: vi.fn()
        };

        drawingContext = {
            camera: camera,
            useCanvas: false
        };

        src = {
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            width: 128,
            height: 128,
            _radius: 64,
            customRenderNodes: {
                BatchHandler: { batch: mockBatchFn }
            },
            defaultRenderNodes: {
                BatchHandler: { batch: vi.fn() }
            }
        };

        renderer = {};
    });

    it('should be a function', function ()
    {
        expect(typeof PointLightWebGLRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with src', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call camera.addToRenderList exactly once', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(camera.addToRenderList).toHaveBeenCalledTimes(1);
    });

    it('should call batch on customRenderNodes.BatchHandler when present', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockBatchFn).toHaveBeenCalled();
        expect(src.defaultRenderNodes.BatchHandler.batch).not.toHaveBeenCalled();
    });

    it('should fall back to defaultRenderNodes.BatchHandler when customRenderNodes.BatchHandler is falsy', function ()
    {
        src.customRenderNodes.BatchHandler = null;

        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(src.defaultRenderNodes.BatchHandler.batch).toHaveBeenCalled();
    });

    it('should pass drawingContext as first argument to batch', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockBatchFn.mock.calls[0][0]).toBe(drawingContext);
    });

    it('should pass src as second argument to batch', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockBatchFn.mock.calls[0][1]).toBe(src);
    });

    it('should pass 12 arguments total to batch', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockBatchFn.mock.calls[0].length).toBe(12);
    });

    it('should call batch exactly once per render call', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        expect(mockBatchFn).toHaveBeenCalledTimes(1);
    });

    it('should compute vertex coordinates from identity transform', function ()
    {
        // radius=64, width=128, height=128
        // x = -64, y = -64, xw = -64+128 = 64, yh = -64+128 = 64
        // With identity calcMatrix: getX(x,y)=x, getY(x,y)=y
        // txTL = -64, tyTL = -64
        // txBL = -64, tyBL =  64
        // txTR =  64, tyTR = -64
        // txBR =  64, tyBR =  64
        // lightX = 0, lightY = 0

        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        var args = mockBatchFn.mock.calls[0];

        expect(args[2]).toBe(-64);  // txTL
        expect(args[3]).toBe(-64);  // tyTL
        expect(args[4]).toBe(-64);  // txBL
        expect(args[5]).toBe(64);   // tyBL
        expect(args[6]).toBe(64);   // txTR
        expect(args[7]).toBe(-64);  // tyTR
        expect(args[8]).toBe(64);   // txBR
        expect(args[9]).toBe(64);   // tyBR
        expect(args[10]).toBe(0);   // lightX
        expect(args[11]).toBe(0);   // lightY
    });

    it('should place light position at src origin', function ()
    {
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        var args = mockBatchFn.mock.calls[0];

        expect(args[10]).toBe(0);  // lightX = getX(0,0)
        expect(args[11]).toBe(0);  // lightY = getY(0,0)
    });

    it('should derive vertex positions from src._radius', function ()
    {
        src._radius = 32;
        src.width = 64;
        src.height = 64;

        // x = -32, y = -32, xw = 32, yh = 32
        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        var args = mockBatchFn.mock.calls[0];

        expect(args[2]).toBe(-32);  // txTL
        expect(args[3]).toBe(-32);  // tyTL
        expect(args[4]).toBe(-32);  // txBL
        expect(args[5]).toBe(32);   // tyBL
        expect(args[6]).toBe(32);   // txTR
        expect(args[7]).toBe(-32);  // tyTR
        expect(args[8]).toBe(32);   // txBR
        expect(args[9]).toBe(32);   // tyBR
    });

    it('should apply src translation to vertex positions', function ()
    {
        src.x = 100;
        src.y = 50;

        PointLightWebGLRenderer(renderer, src, drawingContext, null);

        var args = mockBatchFn.mock.calls[0];

        // With src translated to (100,50): getX(x,y) = x+100, getY(x,y) = y+50
        expect(args[2]).toBe(-64 + 100);  // txTL
        expect(args[3]).toBe(-64 + 50);   // tyTL
        expect(args[10]).toBe(100);        // lightX
        expect(args[11]).toBe(50);         // lightY
    });
});
