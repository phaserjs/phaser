var Camera = require('../../../../src/renderer/webgl/renderNodes/Camera');

describe('Camera', function ()
{
    var mockBatchHandlerQuadSingle;
    var mockFillCamera;
    var mockListCompositor;
    var mockManager;

    beforeEach(function ()
    {
        mockBatchHandlerQuadSingle = { batch: vi.fn() };
        mockFillCamera = { run: vi.fn() };
        mockListCompositor = { run: vi.fn() };

        mockManager = {
            getNode: function (name)
            {
                if (name === 'BatchHandlerQuadSingle') { return mockBatchHandlerQuadSingle; }
                if (name === 'FillCamera') { return mockFillCamera; }
                if (name === 'ListCompositor') { return mockListCompositor; }
                return null;
            },
            finishBatch: vi.fn(),
            renderer: {
                game: {
                    config: {
                        smoothPixelArt: false
                    }
                }
            }
        };
    });

    it('should be importable', function ()
    {
        expect(Camera).toBeDefined();
    });

    it('should be a constructor function', function ()
    {
        expect(typeof Camera).toBe('function');
    });

    describe('constructor', function ()
    {
        it('should create an instance of Camera', function ()
        {
            var node = new Camera(mockManager);
            expect(node).toBeDefined();
        });

        it('should set the name to Camera', function ()
        {
            var node = new Camera(mockManager);
            expect(node.name).toBe('Camera');
        });

        it('should store the manager reference', function ()
        {
            var node = new Camera(mockManager);
            expect(node.manager).toBe(mockManager);
        });

        it('should assign batchHandlerQuadSingleNode from manager', function ()
        {
            var node = new Camera(mockManager);
            expect(node.batchHandlerQuadSingleNode).toBe(mockBatchHandlerQuadSingle);
        });

        it('should assign fillCameraNode from manager', function ()
        {
            var node = new Camera(mockManager);
            expect(node.fillCameraNode).toBe(mockFillCamera);
        });

        it('should assign listCompositorNode from manager', function ()
        {
            var node = new Camera(mockManager);
            expect(node.listCompositorNode).toBe(mockListCompositor);
        });

        it('should create a _parentTransformMatrix instance', function ()
        {
            var node = new Camera(mockManager);
            expect(node._parentTransformMatrix).toBeDefined();
            expect(typeof node._parentTransformMatrix).toBe('object');
        });

        it('should call manager.getNode for BatchHandlerQuadSingle', function ()
        {
            var spy = vi.spyOn(mockManager, 'getNode');
            new Camera(mockManager);
            var calls = spy.mock.calls.map(function (c) { return c[0]; });
            expect(calls).toContain('BatchHandlerQuadSingle');
        });

        it('should call manager.getNode for FillCamera', function ()
        {
            var spy = vi.spyOn(mockManager, 'getNode');
            new Camera(mockManager);
            var calls = spy.mock.calls.map(function (c) { return c[0]; });
            expect(calls).toContain('FillCamera');
        });

        it('should call manager.getNode for ListCompositor', function ()
        {
            var spy = vi.spyOn(mockManager, 'getNode');
            new Camera(mockManager);
            var calls = spy.mock.calls.map(function (c) { return c[0]; });
            expect(calls).toContain('ListCompositor');
        });
    });

    describe('run', function ()
    {
        var node;
        var mockCamera;
        var mockDrawingContext;
        var mockTexture;

        beforeEach(function ()
        {
            node = new Camera(mockManager);

            mockTexture = { id: 'tex' };

            mockCamera = {
                alpha: 1,
                x: 0,
                y: 0,
                width: 800,
                height: 600,
                dirty: true,
                forceComposite: false,
                roundPixels: false,
                filters: {
                    internal: { getActive: function () { return []; } },
                    external: { getActive: function () { return []; } }
                },
                backgroundColor: {
                    alphaGL: 0,
                    red: 0,
                    green: 0,
                    blue: 0,
                    alpha: 0
                },
                flashEffect: {
                    postRenderWebGL: function () { return false; }
                },
                fadeEffect: {
                    postRenderWebGL: function () { return false; }
                },
                matrixExternal: {
                    copyFrom: function (m) { return m; },
                    multiply: function (a, b) { return b; },
                    decomposeMatrix: function ()
                    {
                        return { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 };
                    }
                },
                emit: vi.fn()
            };

            mockDrawingContext = {
                renderer: {
                    drawingContextPool: {
                        get: function (w, h)
                        {
                            return {
                                width: w,
                                height: h,
                                texture: mockTexture,
                                setCamera: vi.fn(),
                                setScissorBox: vi.fn(),
                                use: vi.fn(),
                                release: vi.fn()
                            };
                        }
                    }
                },
                width: 800,
                height: 600,
                camera: mockCamera,
                getClone: function ()
                {
                    return {
                        width: 800,
                        height: 600,
                        camera: mockCamera,
                        texture: mockTexture,
                        setCamera: vi.fn(),
                        setScissorBox: vi.fn(),
                        use: vi.fn(),
                        release: vi.fn()
                    };
                }
            };
        });

        it('should be a function', function ()
        {
            expect(typeof node.run).toBe('function');
        });

        it('should set camera.dirty to false after running', function ()
        {
            mockCamera.dirty = true;
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockCamera.dirty).toBe(false);
        });

        it('should emit POST_RENDER event on camera', function ()
        {
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockCamera.emit).toHaveBeenCalled();
            var emitArgs = mockCamera.emit.mock.calls[0];
            expect(emitArgs[1]).toBe(mockCamera);
        });

        it('should call listCompositorNode.run with children and renderStep', function ()
        {
            var children = [{ id: 1 }, { id: 2 }];
            node.run(mockDrawingContext, children, mockCamera);
            expect(mockListCompositor.run).toHaveBeenCalledOnce();
            var args = mockListCompositor.run.mock.calls[0];
            expect(args[1]).toBe(children);
        });

        it('should call finishBatch on manager', function ()
        {
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockManager.finishBatch).toHaveBeenCalledOnce();
        });

        it('should not call fillCameraNode when backgroundColor alphaGL is 0', function ()
        {
            mockCamera.backgroundColor.alphaGL = 0;
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockFillCamera.run).not.toHaveBeenCalled();
        });

        it('should call fillCameraNode when backgroundColor alphaGL is greater than 0', function ()
        {
            mockCamera.backgroundColor.alphaGL = 1;
            mockCamera.backgroundColor.red = 255;
            mockCamera.backgroundColor.green = 0;
            mockCamera.backgroundColor.blue = 0;
            mockCamera.backgroundColor.alpha = 255;
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockFillCamera.run).toHaveBeenCalled();
        });

        it('should call fillCameraNode for flash effect when postRenderWebGL returns true', function ()
        {
            mockCamera.flashEffect.postRenderWebGL = function () { return true; };
            mockCamera.flashEffect.red = 255;
            mockCamera.flashEffect.green = 255;
            mockCamera.flashEffect.blue = 255;
            mockCamera.flashEffect.alpha = 1;
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockFillCamera.run).toHaveBeenCalled();
        });

        it('should call fillCameraNode for fade effect when postRenderWebGL returns true', function ()
        {
            mockCamera.fadeEffect.postRenderWebGL = function () { return true; };
            mockCamera.fadeEffect.red = 0;
            mockCamera.fadeEffect.green = 0;
            mockCamera.fadeEffect.blue = 0;
            mockCamera.fadeEffect.alpha = 1;
            node.run(mockDrawingContext, [], mockCamera);
            expect(mockFillCamera.run).toHaveBeenCalled();
        });

        it('should use a framebuffer when forceFramebuffer is true', function ()
        {
            var poolGetSpy = vi.spyOn(mockDrawingContext.renderer.drawingContextPool, 'get');
            node.run(mockDrawingContext, [], mockCamera, null, true);
            expect(poolGetSpy).toHaveBeenCalledWith(800, 600);
        });

        it('should use a framebuffer when camera.forceComposite is true', function ()
        {
            var poolGetSpy = vi.spyOn(mockDrawingContext.renderer.drawingContextPool, 'get');
            mockCamera.forceComposite = true;
            node.run(mockDrawingContext, [], mockCamera);
            expect(poolGetSpy).toHaveBeenCalledWith(800, 600);
        });

        it('should use a framebuffer when camera alpha is less than 1', function ()
        {
            var poolGetSpy = vi.spyOn(mockDrawingContext.renderer.drawingContextPool, 'get');
            mockCamera.alpha = 0.5;
            node.run(mockDrawingContext, [], mockCamera);
            expect(poolGetSpy).toHaveBeenCalledWith(800, 600);
        });

        it('should not allocate a framebuffer when no framebuffer conditions are met', function ()
        {
            var poolGetSpy = vi.spyOn(mockDrawingContext.renderer.drawingContextPool, 'get');
            mockCamera.alpha = 1;
            mockCamera.forceComposite = false;
            node.run(mockDrawingContext, [], mockCamera, null, false);
            expect(poolGetSpy).not.toHaveBeenCalled();
        });

        it('should batch the framebuffer to parent when useFramebuffers is true', function ()
        {
            node.run(mockDrawingContext, [], mockCamera, null, true);
            expect(mockBatchHandlerQuadSingle.batch).toHaveBeenCalled();
        });

        it('should not batch when not using framebuffers', function ()
        {
            node.run(mockDrawingContext, [], mockCamera, null, false);
            expect(mockBatchHandlerQuadSingle.batch).not.toHaveBeenCalled();
        });

        it('should multiply camera matrixExternal by provided parentTransformMatrix', function ()
        {
            var multiplySpy = vi.fn(function (a, b) { return b; });
            mockCamera.matrixExternal.multiply = multiplySpy;

            var customMatrix = {
                decomposeMatrix: function ()
                {
                    return { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 };
                },
                setQuad: vi.fn(function () { this.quad = [0, 0, 0, 0, 0, 0, 0, 0]; }),
                quad: [0, 0, 0, 0, 0, 0, 0, 0]
            };
            node.run(mockDrawingContext, [], mockCamera, customMatrix, true);
            expect(multiplySpy).toHaveBeenCalledWith(customMatrix, customMatrix);
        });
    });
});
