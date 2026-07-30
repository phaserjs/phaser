var SpriteGPULayerWebGLRenderer = require('../../../src/gameobjects/spritegpulayer/SpriteGPULayerWebGLRenderer');

describe('SpriteGPULayerWebGLRenderer', function ()
{
    var renderer;
    var drawingContext;
    var submitterRun;

    beforeEach(function ()
    {
        renderer = {};

        submitterRun = vi.fn();

        drawingContext = {
            camera: {
                addToRenderList: vi.fn()
            }
        };
    });

    it('should be importable', function ()
    {
        expect(SpriteGPULayerWebGLRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof SpriteGPULayerWebGLRenderer).toBe('function');
    });

    it('should call addToRenderList on the camera with src', function ()
    {
        var src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: { run: submitterRun }
            }
        };

        SpriteGPULayerWebGLRenderer(renderer, src, drawingContext);

        expect(drawingContext.camera.addToRenderList).toHaveBeenCalledWith(src);
    });

    it('should use defaultRenderNodes.Submitter when customRenderNodes.Submitter is not set', function ()
    {
        var defaultSubmitterRun = vi.fn();
        var src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: { run: defaultSubmitterRun }
            }
        };

        SpriteGPULayerWebGLRenderer(renderer, src, drawingContext);

        expect(defaultSubmitterRun).toHaveBeenCalledWith(drawingContext);
    });

    it('should use customRenderNodes.Submitter when it is set', function ()
    {
        var customSubmitterRun = vi.fn();
        var defaultSubmitterRun = vi.fn();
        var src = {
            customRenderNodes: {
                Submitter: { run: customSubmitterRun }
            },
            defaultRenderNodes: {
                Submitter: { run: defaultSubmitterRun }
            }
        };

        SpriteGPULayerWebGLRenderer(renderer, src, drawingContext);

        expect(customSubmitterRun).toHaveBeenCalledWith(drawingContext);
        expect(defaultSubmitterRun).not.toHaveBeenCalled();
    });

    it('should pass drawingContext to the submitter run call', function ()
    {
        var capturedArg;
        var src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: {
                    run: function (ctx)
                    {
                        capturedArg = ctx;
                    }
                }
            }
        };

        SpriteGPULayerWebGLRenderer(renderer, src, drawingContext);

        expect(capturedArg).toBe(drawingContext);
    });

    it('should call addToRenderList before running the submitter', function ()
    {
        var callOrder = [];
        drawingContext.camera.addToRenderList = vi.fn(function ()
        {
            callOrder.push('addToRenderList');
        });

        var src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: {
                    run: function ()
                    {
                        callOrder.push('submitter');
                    }
                }
            }
        };

        SpriteGPULayerWebGLRenderer(renderer, src, drawingContext);

        expect(callOrder[0]).toBe('addToRenderList');
        expect(callOrder[1]).toBe('submitter');
    });

    it('should work without a parentMatrix argument', function ()
    {
        var src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: { run: submitterRun }
            }
        };

        expect(function ()
        {
            SpriteGPULayerWebGLRenderer(renderer, src, drawingContext);
        }).not.toThrow();
    });

    it('should work with a parentMatrix argument', function ()
    {
        var parentMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        var src = {
            customRenderNodes: {},
            defaultRenderNodes: {
                Submitter: { run: submitterRun }
            }
        };

        expect(function ()
        {
            SpriteGPULayerWebGLRenderer(renderer, src, drawingContext, parentMatrix);
        }).not.toThrow();
    });
});
