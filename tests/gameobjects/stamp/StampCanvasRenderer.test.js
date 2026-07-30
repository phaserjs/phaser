var StampCanvasRenderer = require('../../../src/gameobjects/stamp/StampCanvasRenderer');

describe('StampCanvasRenderer', function ()
{
    var renderer;
    var src;
    var camera;
    var matrixValues;

    beforeEach(function ()
    {
        matrixValues = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

        camera = {
            addToRenderList: vi.fn(),
            matrix: {
                copyFrom: vi.fn(),
                loadIdentity: vi.fn()
            },
            scrollX: 100,
            scrollY: 200
        };

        src = {
            frame: { name: 'testFrame' }
        };

        renderer = {
            batchSprite: vi.fn()
        };
    });

    it('should be importable', function ()
    {
        expect(StampCanvasRenderer).toBeDefined();
        expect(typeof StampCanvasRenderer).toBe('function');
    });

    it('should call camera.addToRenderList with src', function ()
    {
        StampCanvasRenderer(renderer, src, camera);

        expect(camera.addToRenderList).toHaveBeenCalledWith(src);
        expect(camera.addToRenderList).toHaveBeenCalledTimes(1);
    });

    it('should call camera.matrix.loadIdentity', function ()
    {
        StampCanvasRenderer(renderer, src, camera);

        expect(camera.matrix.loadIdentity).toHaveBeenCalledTimes(1);
    });

    it('should call renderer.batchSprite with src, src.frame, and camera', function ()
    {
        StampCanvasRenderer(renderer, src, camera);

        expect(renderer.batchSprite).toHaveBeenCalledWith(src, src.frame, camera);
        expect(renderer.batchSprite).toHaveBeenCalledTimes(1);
    });

    it('should set camera scrollX and scrollY to 0 before calling batchSprite', function ()
    {
        renderer.batchSprite = vi.fn(function (s, frame, cam)
        {
            expect(cam.scrollX).toBe(0);
            expect(cam.scrollY).toBe(0);
        });

        camera.scrollX = 300;
        camera.scrollY = 400;

        StampCanvasRenderer(renderer, src, camera);
    });

    it('should restore camera scrollX after calling batchSprite', function ()
    {
        camera.scrollX = 300;
        camera.scrollY = 400;

        StampCanvasRenderer(renderer, src, camera);

        expect(camera.scrollX).toBe(300);
    });

    it('should restore camera scrollY after calling batchSprite', function ()
    {
        camera.scrollX = 300;
        camera.scrollY = 400;

        StampCanvasRenderer(renderer, src, camera);

        expect(camera.scrollY).toBe(400);
    });

    it('should restore camera scrollX and scrollY when they are zero', function ()
    {
        camera.scrollX = 0;
        camera.scrollY = 0;

        StampCanvasRenderer(renderer, src, camera);

        expect(camera.scrollX).toBe(0);
        expect(camera.scrollY).toBe(0);
    });

    it('should restore camera scrollX and scrollY when they are negative', function ()
    {
        camera.scrollX = -50;
        camera.scrollY = -75;

        StampCanvasRenderer(renderer, src, camera);

        expect(camera.scrollX).toBe(-50);
        expect(camera.scrollY).toBe(-75);
    });

    it('should restore camera scrollX and scrollY with floating point values', function ()
    {
        camera.scrollX = 12.5;
        camera.scrollY = 33.7;

        StampCanvasRenderer(renderer, src, camera);

        expect(camera.scrollX).toBeCloseTo(12.5);
        expect(camera.scrollY).toBeCloseTo(33.7);
    });

    it('should call camera.matrix.copyFrom once to restore the matrix after batchSprite', function ()
    {
        StampCanvasRenderer(renderer, src, camera);

        // camera.matrix.copyFrom is called once at the end to restore from tempMatrix.
        // The first save is tempMatrix.copyFrom(camera.matrix), which is on the module-level tempMatrix.
        expect(camera.matrix.copyFrom).toHaveBeenCalledTimes(1);
    });

    it('should call operations in the correct order', function ()
    {
        var callOrder = [];

        camera.addToRenderList = vi.fn(function () { callOrder.push('addToRenderList'); });
        camera.matrix.loadIdentity = vi.fn(function () { callOrder.push('loadIdentity'); });
        renderer.batchSprite = vi.fn(function () { callOrder.push('batchSprite'); });
        camera.matrix.copyFrom = vi.fn(function () { callOrder.push('copyFrom'); });

        StampCanvasRenderer(renderer, src, camera);

        // Order: addToRenderList, loadIdentity, batchSprite, copyFrom (restore)
        // tempMatrix.copyFrom(camera.matrix) happens before loadIdentity but is on the internal tempMatrix
        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('loadIdentity');
        expect(callOrder[2]).toBe('batchSprite');
        expect(callOrder[3]).toBe('copyFrom');
    });
});
