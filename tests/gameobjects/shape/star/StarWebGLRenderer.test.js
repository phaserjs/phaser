// Populate the require cache with mock functions BEFORE requiring StarWebGLRenderer,
// so that StarWebGLRenderer's own require() calls get the mocks instead of real modules.

var FillPathWebGL = vi.fn();
var GetCalcMatrix = vi.fn(function () { return { calc: { mockCalcMatrix: true } }; });
var StrokePathWebGL = vi.fn();

var fillPath = require.resolve('../../../../src/gameobjects/shape/FillPathWebGL');
var calcPath = require.resolve('../../../../src/gameobjects/GetCalcMatrix');
var strokePath = require.resolve('../../../../src/gameobjects/shape/StrokePathWebGL');

require.cache[fillPath] = { id: fillPath, filename: fillPath, loaded: true, exports: FillPathWebGL };
require.cache[calcPath] = { id: calcPath, filename: calcPath, loaded: true, exports: GetCalcMatrix };
require.cache[strokePath] = { id: strokePath, filename: strokePath, loaded: true, exports: StrokePathWebGL };

var StarWebGLRenderer = require('../../../../src/gameobjects/shape/star/StarWebGLRenderer');

function createMockSrc (overrides)
{
    var defaults = {
        _displayOriginX: 0,
        _displayOriginY: 0,
        alpha: 1,
        isFilled: false,
        isStroked: false,
        customRenderNodes: { Submitter: null },
        defaultRenderNodes: { Submitter: { name: 'defaultSubmitter' } }
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            defaults[key] = overrides[key];
        }
    }

    return defaults;
}

function createMockDrawingContext (overrides)
{
    var defaults = {
        camera: {
            addToRenderList: vi.fn()
        },
        useCanvas: false
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            defaults[key] = overrides[key];
        }
    }

    return defaults;
}

describe('StarWebGLRenderer', function ()
{
    beforeEach(function ()
    {
        vi.clearAllMocks();

        GetCalcMatrix.mockImplementation(function ()
        {
            return { calc: { mockCalcMatrix: true } };
        });
    });

    it('should be a function', function ()
    {
        expect(typeof StarWebGLRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with the src object', function ()
    {
        var src = createMockSrc();
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledTimes(1);
    });

    it('should call GetCalcMatrix with src, camera, parentMatrix, and !useCanvas', function ()
    {
        var src = createMockSrc();
        var drawingContext = createMockDrawingContext();
        var parentMatrix = { mock: true };

        StarWebGLRenderer(null, src, drawingContext, parentMatrix);

        expect(GetCalcMatrix).toHaveBeenCalledWith(src, drawingContext.camera, parentMatrix, true);
    });

    it('should pass !useCanvas=false when drawingContext.useCanvas is true', function ()
    {
        var src = createMockSrc();
        var drawingContext = createMockDrawingContext({ useCanvas: true, camera: { addToRenderList: vi.fn() } });

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(GetCalcMatrix).toHaveBeenCalledWith(src, drawingContext.camera, null, false);
    });

    it('should call FillPathWebGL when src.isFilled is true', function ()
    {
        var src = createMockSrc({ isFilled: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(FillPathWebGL).toHaveBeenCalledTimes(1);
    });

    it('should not call FillPathWebGL when src.isFilled is false', function ()
    {
        var src = createMockSrc({ isFilled: false });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(FillPathWebGL).not.toHaveBeenCalled();
    });

    it('should call StrokePathWebGL when src.isStroked is true', function ()
    {
        var src = createMockSrc({ isStroked: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(StrokePathWebGL).toHaveBeenCalledTimes(1);
    });

    it('should not call StrokePathWebGL when src.isStroked is false', function ()
    {
        var src = createMockSrc({ isStroked: false });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(StrokePathWebGL).not.toHaveBeenCalled();
    });

    it('should call both FillPathWebGL and StrokePathWebGL when isFilled and isStroked are both true', function ()
    {
        var src = createMockSrc({ isFilled: true, isStroked: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(FillPathWebGL).toHaveBeenCalledTimes(1);
        expect(StrokePathWebGL).toHaveBeenCalledTimes(1);
    });

    it('should call neither FillPathWebGL nor StrokePathWebGL when both flags are false', function ()
    {
        var src = createMockSrc({ isFilled: false, isStroked: false });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        expect(FillPathWebGL).not.toHaveBeenCalled();
        expect(StrokePathWebGL).not.toHaveBeenCalled();
    });

    it('should pass the src alpha to FillPathWebGL', function ()
    {
        var src = createMockSrc({ isFilled: true, alpha: 0.5 });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[4]).toBe(0.5);
    });

    it('should pass the src alpha to StrokePathWebGL', function ()
    {
        var src = createMockSrc({ isStroked: true, alpha: 0.75 });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[4]).toBe(0.75);
    });

    it('should pass _displayOriginX as dx to FillPathWebGL', function ()
    {
        var src = createMockSrc({ isFilled: true, _displayOriginX: 10 });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[5]).toBe(10);
    });

    it('should pass _displayOriginY as dy to FillPathWebGL', function ()
    {
        var src = createMockSrc({ isFilled: true, _displayOriginY: 20 });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[6]).toBe(20);
    });

    it('should pass _displayOriginX as dx to StrokePathWebGL', function ()
    {
        var src = createMockSrc({ isStroked: true, _displayOriginX: 5 });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[5]).toBe(5);
    });

    it('should pass _displayOriginY as dy to StrokePathWebGL', function ()
    {
        var src = createMockSrc({ isStroked: true, _displayOriginY: 15 });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[6]).toBe(15);
    });

    it('should use customRenderNodes.Submitter when it is truthy', function ()
    {
        var customSubmitter = { name: 'customSubmitter' };
        var src = createMockSrc({
            isFilled: true,
            customRenderNodes: { Submitter: customSubmitter },
            defaultRenderNodes: { Submitter: { name: 'defaultSubmitter' } }
        });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[1]).toBe(customSubmitter);
    });

    it('should fall back to defaultRenderNodes.Submitter when customRenderNodes.Submitter is null', function ()
    {
        var defaultSubmitter = { name: 'defaultSubmitter' };
        var src = createMockSrc({
            isFilled: true,
            customRenderNodes: { Submitter: null },
            defaultRenderNodes: { Submitter: defaultSubmitter }
        });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[1]).toBe(defaultSubmitter);
    });

    it('should fall back to defaultRenderNodes.Submitter when customRenderNodes.Submitter is undefined', function ()
    {
        var defaultSubmitter = { name: 'defaultSubmitter' };
        var src = createMockSrc({
            isStroked: true,
            customRenderNodes: { Submitter: undefined },
            defaultRenderNodes: { Submitter: defaultSubmitter }
        });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[1]).toBe(defaultSubmitter);
    });

    it('should pass calcMatrix from GetCalcMatrix result to FillPathWebGL', function ()
    {
        var fakeCalc = { a: 1, b: 0, c: 0, d: 1 };
        GetCalcMatrix.mockImplementation(function ()
        {
            return { calc: fakeCalc };
        });

        var src = createMockSrc({ isFilled: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[2]).toBe(fakeCalc);
    });

    it('should pass calcMatrix from GetCalcMatrix result to StrokePathWebGL', function ()
    {
        var fakeCalc = { a: 2, b: 0, c: 0, d: 2 };
        GetCalcMatrix.mockImplementation(function ()
        {
            return { calc: fakeCalc };
        });

        var src = createMockSrc({ isStroked: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[2]).toBe(fakeCalc);
    });

    it('should pass drawingContext as the first argument to FillPathWebGL', function ()
    {
        var src = createMockSrc({ isFilled: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[0]).toBe(drawingContext);
    });

    it('should pass drawingContext as the first argument to StrokePathWebGL', function ()
    {
        var src = createMockSrc({ isStroked: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[0]).toBe(drawingContext);
    });

    it('should pass src as the fourth argument to FillPathWebGL', function ()
    {
        var src = createMockSrc({ isFilled: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[3]).toBe(src);
    });

    it('should pass src as the fourth argument to StrokePathWebGL', function ()
    {
        var src = createMockSrc({ isStroked: true });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = StrokePathWebGL.mock.calls[0];
        expect(callArgs[3]).toBe(src);
    });

    it('should handle negative display origin values', function ()
    {
        var src = createMockSrc({
            isFilled: true,
            _displayOriginX: -5,
            _displayOriginY: -3
        });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[5]).toBe(-5);
        expect(callArgs[6]).toBe(-3);
    });

    it('should handle zero display origin values', function ()
    {
        var src = createMockSrc({
            isFilled: true,
            _displayOriginX: 0,
            _displayOriginY: 0
        });
        var drawingContext = createMockDrawingContext();

        StarWebGLRenderer(null, src, drawingContext, null);

        var callArgs = FillPathWebGL.mock.calls[0];
        expect(callArgs[5]).toBe(0);
        expect(callArgs[6]).toBe(0);
    });
});
