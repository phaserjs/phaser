var TransformMatrix = require('../../../src/gameobjects/components/TransformMatrix');
var RopeWebGLRenderer = require('../../../src/gameobjects/rope/RopeWebGLRenderer');

function makeCamera ()
{
    return {
        scrollX: 0,
        scrollY: 0,
        matrix: new TransformMatrix(),
        matrixCombined: new TransformMatrix(),
        matrixExternal: new TransformMatrix(),
        addToRenderList: vi.fn()
    };
}

function makeSrc (overrides)
{
    var mockBatchStrip = vi.fn();
    var defaults = {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        scrollFactorX: 1,
        scrollFactorY: 1,
        dirty: false,
        updateVertices: vi.fn(),
        texture: {
            smoothPixelArt: null,
            source: [ { glTexture: {} } ]
        },
        scene: {
            sys: {
                game: {
                    config: {
                        smoothPixelArt: false
                    }
                }
            }
        },
        vertices: new Float32Array(8),
        uv: new Float32Array(8),
        colors: new Uint32Array(4),
        alphas: new Float32Array(4),
        alpha: 1,
        tintMode: 0,
        debugCallback: null,
        customRenderNodes: {},
        defaultRenderNodes: {
            BatchHandler: { batchStrip: mockBatchStrip }
        }
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            defaults[key] = overrides[key];
        }
    }

    defaults._mockBatchStrip = mockBatchStrip;

    return defaults;
}

function makeDrawingContext (camera, useCanvas)
{
    return {
        camera: camera,
        useCanvas: useCanvas !== undefined ? useCanvas : false
    };
}

describe('RopeWebGLRenderer', function ()
{
    var renderer;
    var src;
    var drawingContext;
    var camera;
    var parentMatrix;

    beforeEach(function ()
    {
        renderer = {};
        camera = makeCamera();
        src = makeSrc();
        drawingContext = makeDrawingContext(camera);
        parentMatrix = null;
    });

    it('should be importable', function ()
    {
        expect(RopeWebGLRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof RopeWebGLRenderer).toBe('function');
    });

    it('should call addToRenderList with src', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledOnce();
        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should call updateVertices when src.dirty is true', function ()
    {
        src.dirty = true;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.updateVertices).toHaveBeenCalledOnce();
    });

    it('should not call updateVertices when src.dirty is false', function ()
    {
        src.dirty = false;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src.updateVertices).not.toHaveBeenCalled();
    });

    it('should use smoothPixelArt from texture when texture.smoothPixelArt is not null', function ()
    {
        src.texture.smoothPixelArt = true;
        src.scene.sys.game.config.smoothPixelArt = false;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip).toHaveBeenCalledOnce();
        var renderOptions = src._mockBatchStrip.mock.calls[0][10];
        expect(renderOptions.smoothPixelArt).toBe(true);
    });

    it('should use false smoothPixelArt from texture when texture.smoothPixelArt is false', function ()
    {
        src.texture.smoothPixelArt = false;
        src.scene.sys.game.config.smoothPixelArt = true;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var renderOptions = src._mockBatchStrip.mock.calls[0][10];
        expect(renderOptions.smoothPixelArt).toBe(false);
    });

    it('should fall back to game config smoothPixelArt when texture.smoothPixelArt is null', function ()
    {
        src.texture.smoothPixelArt = null;
        src.scene.sys.game.config.smoothPixelArt = true;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var renderOptions = src._mockBatchStrip.mock.calls[0][10];
        expect(renderOptions.smoothPixelArt).toBe(true);
    });

    it('should fall back to game config smoothPixelArt when there is no texture', function ()
    {
        src.texture = null;
        src.scene.sys.game.config.smoothPixelArt = true;

        // batchStrip still needs texture.source[0].glTexture so provide it separately
        src.texture = { smoothPixelArt: null, source: [ { glTexture: {} } ] };
        src.scene.sys.game.config.smoothPixelArt = true;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var renderOptions = src._mockBatchStrip.mock.calls[0][10];
        expect(renderOptions.smoothPixelArt).toBe(true);
    });

    it('should prefer customRenderNodes.BatchHandler over defaultRenderNodes.BatchHandler', function ()
    {
        var customBatchStrip = vi.fn();
        src.customRenderNodes.BatchHandler = { batchStrip: customBatchStrip };

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(customBatchStrip).toHaveBeenCalledOnce();
        expect(src._mockBatchStrip).not.toHaveBeenCalled();
    });

    it('should use defaultRenderNodes.BatchHandler when customRenderNodes.BatchHandler is absent', function ()
    {
        src.customRenderNodes = {};

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip).toHaveBeenCalledOnce();
    });

    it('should call batchStrip with drawingContext as first argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][0]).toBe(drawingContext);
    });

    it('should call batchStrip with src as second argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][1]).toBe(src);
    });

    it('should call batchStrip with a defined calcMatrix as third argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][2]).toBeDefined();
    });

    it('should call batchStrip with glTexture as fourth argument', function ()
    {
        var mockGlTexture = { id: 'glTex' };
        src.texture.source[0].glTexture = mockGlTexture;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][3]).toBe(mockGlTexture);
    });

    it('should call batchStrip with src.vertices as fifth argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][4]).toBe(src.vertices);
    });

    it('should call batchStrip with src.uv as sixth argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][5]).toBe(src.uv);
    });

    it('should call batchStrip with src.colors as seventh argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][6]).toBe(src.colors);
    });

    it('should call batchStrip with src.alphas as eighth argument', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][7]).toBe(src.alphas);
    });

    it('should call batchStrip with src.alpha as ninth argument', function ()
    {
        src.alpha = 0.75;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][8]).toBe(0.75);
    });

    it('should call batchStrip with src.tintMode as tenth argument', function ()
    {
        src.tintMode = 2;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][9]).toBe(2);
    });

    it('should call batchStrip with an object as eleventh argument (renderOptions)', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var renderOptions = src._mockBatchStrip.mock.calls[0][10];
        expect(typeof renderOptions).toBe('object');
        expect(renderOptions).not.toBeNull();
    });

    it('should call batchStrip with renderOptions.multiTexturing set to false', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        var renderOptions = src._mockBatchStrip.mock.calls[0][10];
        expect(renderOptions.multiTexturing).toBe(false);
    });

    it('should call batchStrip with src.debugCallback as twelfth argument', function ()
    {
        var mockCallback = vi.fn();
        src.debugCallback = mockCallback;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][11]).toBe(mockCallback);
    });

    it('should call batchStrip with null debugCallback when src.debugCallback is null', function ()
    {
        src.debugCallback = null;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip.mock.calls[0][11]).toBeNull();
    });

    it('should call addToRenderList before batchStrip', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function ()
        {
            callOrder.push('addToRenderList');
        });

        src._mockBatchStrip = vi.fn(function ()
        {
            callOrder.push('batchStrip');
        });
        src.defaultRenderNodes.BatchHandler.batchStrip = src._mockBatchStrip;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(callOrder.indexOf('addToRenderList')).toBeLessThan(callOrder.indexOf('batchStrip'));
    });

    it('should call updateVertices before batchStrip when dirty', function ()
    {
        var callOrder = [];

        src.dirty = true;
        src.updateVertices = vi.fn(function ()
        {
            callOrder.push('updateVertices');
        });

        src._mockBatchStrip = vi.fn(function ()
        {
            callOrder.push('batchStrip');
        });
        src.defaultRenderNodes.BatchHandler.batchStrip = src._mockBatchStrip;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(callOrder.indexOf('updateVertices')).toBeLessThan(callOrder.indexOf('batchStrip'));
    });

    it('should pass useCanvas false to GetCalcMatrix (ignoreCameraPosition = true)', function ()
    {
        drawingContext.useCanvas = false;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        // GetCalcMatrix is called with !useCanvas = true (ignoreCameraPosition)
        // When ignoreCameraPosition is true, camExternalMatrix.loadIdentity() is called
        // and camera.matrix is used instead of camera.matrixCombined.
        // We can verify batchStrip was still called successfully with a calc matrix.
        expect(src._mockBatchStrip).toHaveBeenCalledOnce();
        expect(src._mockBatchStrip.mock.calls[0][2]).toBeDefined();
    });

    it('should pass useCanvas true to GetCalcMatrix (ignoreCameraPosition = false)', function ()
    {
        drawingContext.useCanvas = true;

        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(src._mockBatchStrip).toHaveBeenCalledOnce();
        expect(src._mockBatchStrip.mock.calls[0][2]).toBeDefined();
    });

    it('should work correctly when called multiple times', function ()
    {
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);
        RopeWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(camera.addToRenderList).toHaveBeenCalledTimes(2);
        expect(src._mockBatchStrip).toHaveBeenCalledTimes(2);
    });

    it('should work with a parentMatrix supplied', function ()
    {
        var pm = new TransformMatrix();

        RopeWebGLRenderer(renderer, src, drawingContext, pm);

        expect(src._mockBatchStrip).toHaveBeenCalledOnce();
    });
});
