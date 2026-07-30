var EllipseWebGLRenderer = require('../../../../src/gameobjects/shape/ellipse/EllipseWebGLRenderer');

describe('EllipseWebGLRenderer', function ()
{
    var mockCamera;
    var mockDrawingContext;
    var mockSrc;

    beforeEach(function ()
    {
        mockCamera = {
            addToRenderList: vi.fn(),
            // Required by GetCalcMatrix when ignoreCameraPosition = true (useCanvas = false)
            matrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
            scrollX: 0,
            scrollY: 0
        };

        mockDrawingContext = {
            camera: mockCamera,
            useCanvas: false
        };

        mockSrc = {
            _displayOriginX: 10,
            _displayOriginY: 20,
            alpha: 1,
            isFilled: false,
            isStroked: false,
            customRenderNodes: { Submitter: null },
            defaultRenderNodes: { Submitter: null },
            // Required by GetCalcMatrix
            scrollFactorX: 1,
            scrollFactorY: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1
        };
    });

    it('should be importable', function ()
    {
        expect(EllipseWebGLRenderer).toBeDefined();
    });

    it('should export a function', function ()
    {
        expect(typeof EllipseWebGLRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with the source object', function ()
    {
        // isFilled and isStroked are both false, so no WebGL rendering occurs
        EllipseWebGLRenderer(null, mockSrc, mockDrawingContext, null);

        expect(mockCamera.addToRenderList).toHaveBeenCalledWith(mockSrc);
        expect(mockCamera.addToRenderList).toHaveBeenCalledTimes(1);
    });
});
