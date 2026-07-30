var GeometryMask = require('../../../src/display/mask/GeometryMask');

describe('GeometryMask', function ()
{
    var mockGraphics;

    beforeEach(function ()
    {
        mockGraphics = {
            renderCanvas: vi.fn()
        };
    });

    describe('constructor', function ()
    {
        it('should set geometryMask to the provided graphics object', function ()
        {
            var mask = new GeometryMask(null, mockGraphics);
            expect(mask.geometryMask).toBe(mockGraphics);
        });

        it('should accept null as graphicsGeometry', function ()
        {
            var mask = new GeometryMask(null, null);
            expect(mask.geometryMask).toBeNull();
        });

        it('should ignore the scene parameter', function ()
        {
            var mask = new GeometryMask('some-scene', mockGraphics);
            expect(mask.geometryMask).toBe(mockGraphics);
        });
    });

    describe('setShape', function ()
    {
        it('should update geometryMask to the new graphics object', function ()
        {
            var mask = new GeometryMask(null, mockGraphics);
            var newGraphics = { renderCanvas: vi.fn() };

            mask.setShape(newGraphics);

            expect(mask.geometryMask).toBe(newGraphics);
        });

        it('should return this for chaining', function ()
        {
            var mask = new GeometryMask(null, mockGraphics);
            var result = mask.setShape(mockGraphics);

            expect(result).toBe(mask);
        });

        it('should allow setting shape to null', function ()
        {
            var mask = new GeometryMask(null, mockGraphics);
            mask.setShape(null);

            expect(mask.geometryMask).toBeNull();
        });

        it('should replace previous shape with new one', function ()
        {
            var mask = new GeometryMask(null, mockGraphics);
            var secondGraphics = { renderCanvas: vi.fn() };
            var thirdGraphics = { renderCanvas: vi.fn() };

            mask.setShape(secondGraphics);
            expect(mask.geometryMask).toBe(secondGraphics);

            mask.setShape(thirdGraphics);
            expect(mask.geometryMask).toBe(thirdGraphics);
        });
    });

    describe('preRenderCanvas', function ()
    {
        it('should call save on the current context', function ()
        {
            var mockContext = {
                save: vi.fn(),
                clip: vi.fn()
            };
            var mockRenderer = { currentContext: mockContext };
            var mockCamera = {};
            var mask = new GeometryMask(null, mockGraphics);

            mask.preRenderCanvas(mockRenderer, {}, mockCamera);

            expect(mockContext.save).toHaveBeenCalledOnce();
        });

        it('should call renderCanvas on the geometry mask', function ()
        {
            var mockContext = {
                save: vi.fn(),
                clip: vi.fn()
            };
            var mockRenderer = { currentContext: mockContext };
            var mockCamera = {};
            var mask = new GeometryMask(null, mockGraphics);

            mask.preRenderCanvas(mockRenderer, {}, mockCamera);

            expect(mockGraphics.renderCanvas).toHaveBeenCalledOnce();
            expect(mockGraphics.renderCanvas).toHaveBeenCalledWith(mockRenderer, mockGraphics, mockCamera, null, null, true);
        });

        it('should call clip on the current context', function ()
        {
            var mockContext = {
                save: vi.fn(),
                clip: vi.fn()
            };
            var mockRenderer = { currentContext: mockContext };
            var mockCamera = {};
            var mask = new GeometryMask(null, mockGraphics);

            mask.preRenderCanvas(mockRenderer, {}, mockCamera);

            expect(mockContext.clip).toHaveBeenCalledOnce();
        });

        it('should call save before clip', function ()
        {
            var callOrder = [];
            var mockContext = {
                save: vi.fn(function () { callOrder.push('save'); }),
                clip: vi.fn(function () { callOrder.push('clip'); })
            };
            var mockRenderer = { currentContext: mockContext };
            var mask = new GeometryMask(null, mockGraphics);

            mask.preRenderCanvas(mockRenderer, {}, {});

            expect(callOrder[0]).toBe('save');
            expect(callOrder[1]).toBe('clip');
        });
    });

    describe('postRenderCanvas', function ()
    {
        it('should call restore on the current context', function ()
        {
            var mockContext = { restore: vi.fn() };
            var mockRenderer = { currentContext: mockContext };
            var mask = new GeometryMask(null, mockGraphics);

            mask.postRenderCanvas(mockRenderer);

            expect(mockContext.restore).toHaveBeenCalledOnce();
        });

        it('should call restore exactly once', function ()
        {
            var mockContext = { restore: vi.fn() };
            var mockRenderer = { currentContext: mockContext };
            var mask = new GeometryMask(null, mockGraphics);

            mask.postRenderCanvas(mockRenderer);

            expect(mockContext.restore).toHaveBeenCalledTimes(1);
        });
    });

    describe('destroy', function ()
    {
        it('should set geometryMask to null', function ()
        {
            var mask = new GeometryMask(null, mockGraphics);
            mask.destroy();

            expect(mask.geometryMask).toBeNull();
        });

        it('should null the reference even if geometryMask was already null', function ()
        {
            var mask = new GeometryMask(null, null);
            mask.destroy();

            expect(mask.geometryMask).toBeNull();
        });
    });
});
