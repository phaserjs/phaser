var CanvasSnapshot = require('../../../src/renderer/snapshot/CanvasSnapshot');
var CanvasPool = require('../../../src/display/canvas/CanvasPool');

describe('Phaser.Renderer.Snapshot.Canvas', function ()
{
    var mockCanvas;
    var mockCallback;
    var mockContext;
    var MockImage;
    var mockCopyCanvas;
    var mockCopyContext;
    var createWebGLSpy;
    var removeSpy;

    beforeEach(function ()
    {
        mockCallback = vi.fn();

        mockContext = {
            getImageData: vi.fn().mockReturnValue({
                data: [255, 0, 128, 255]
            }),
            drawImage: vi.fn()
        };

        mockCanvas = {
            width: 800,
            height: 600,
            getContext: vi.fn().mockReturnValue(mockContext),
            toDataURL: vi.fn().mockReturnValue('data:image/png;base64,fullcanvas')
        };

        mockCopyContext = {
            drawImage: vi.fn()
        };

        mockCopyCanvas = {
            width: 100,
            height: 100,
            getContext: vi.fn().mockReturnValue(mockCopyContext),
            toDataURL: vi.fn().mockReturnValue('data:image/png;base64,copycanvas')
        };

        createWebGLSpy = vi.spyOn(CanvasPool, 'createWebGL').mockReturnValue(mockCopyCanvas);
        removeSpy = vi.spyOn(CanvasPool, 'remove').mockImplementation(function () {});

        // Mock Image constructor — triggers onload immediately on src assignment
        MockImage = vi.fn().mockImplementation(function ()
        {
            var self = this;
            self.onload = null;
            self.onerror = null;
            Object.defineProperty(self, 'src',
            {
                set: function (value)
                {
                    self._src = value;
                    if (self.onload)
                    {
                        self.onload();
                    }
                },
                get: function ()
                {
                    return self._src;
                }
            });
        });

        vi.stubGlobal('Image', MockImage);
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    // -------------------------------------------------------------------------
    // getPixel mode
    // -------------------------------------------------------------------------

    describe('getPixel mode', function ()
    {
        it('should call the callback with a Color object', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 10,
                y: 20
            });

            expect(mockCallback).toHaveBeenCalledOnce();
            expect(mockCallback.mock.calls[0][0]).toBeDefined();
        });

        it('should sample the correct pixel coordinates', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 5,
                y: 15
            });

            expect(mockContext.getImageData).toHaveBeenCalledWith(5, 15, 1, 1);
        });

        it('should use absolute values for negative x and y', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: -10,
                y: -20
            });

            expect(mockContext.getImageData).toHaveBeenCalledWith(10, 20, 1, 1);
        });

        it('should round fractional coordinates', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 4.7,
                y: 3.2
            });

            expect(mockContext.getImageData).toHaveBeenCalledWith(5, 3, 1, 1);
        });

        it('should default x and y to 0 when not provided', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true
            });

            expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, 1, 1);
        });

        it('should pass the correct red channel value to the Color', function ()
        {
            mockContext.getImageData.mockReturnValue({ data: [100, 150, 200, 255] });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 0,
                y: 0
            });

            var color = mockCallback.mock.calls[0][0];
            expect(color.red).toBe(100);
        });

        it('should pass the correct green channel value to the Color', function ()
        {
            mockContext.getImageData.mockReturnValue({ data: [100, 150, 200, 255] });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 0,
                y: 0
            });

            var color = mockCallback.mock.calls[0][0];
            expect(color.green).toBe(150);
        });

        it('should pass the correct blue channel value to the Color', function ()
        {
            mockContext.getImageData.mockReturnValue({ data: [100, 150, 200, 255] });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 0,
                y: 0
            });

            var color = mockCallback.mock.calls[0][0];
            expect(color.blue).toBe(200);
        });

        it('should pass the correct alpha channel value to the Color', function ()
        {
            mockContext.getImageData.mockReturnValue({ data: [100, 150, 200, 128] });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 0,
                y: 0
            });

            var color = mockCallback.mock.calls[0][0];
            expect(color.alpha).toBe(128);
        });

        it('should not use CanvasPool in getPixel mode', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                getPixel: true,
                x: 0,
                y: 0
            });

            expect(createWebGLSpy).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // Full canvas capture mode
    // -------------------------------------------------------------------------

    describe('full canvas capture', function ()
    {
        it('should call canvas.toDataURL with default type and encoder', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback
            });

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png', 0.92);
        });

        it('should call the callback with the image on successful load', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback
            });

            expect(mockCallback).toHaveBeenCalledOnce();
            expect(mockCallback.mock.calls[0][0]).toBeInstanceOf(MockImage);
        });

        it('should call canvas.toDataURL with custom type and encoder', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                type: 'image/jpeg',
                encoder: 0.8
            });

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
        });

        it('should call the callback with no argument on image error', function ()
        {
            MockImage.mockImplementation(function ()
            {
                var self = this;
                self.onload = null;
                self.onerror = null;
                Object.defineProperty(self, 'src',
                {
                    set: function (value)
                    {
                        self._src = value;
                        if (self.onerror)
                        {
                            self.onerror();
                        }
                    },
                    get: function ()
                    {
                        return self._src;
                    }
                });
            });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback
            });

            expect(mockCallback).toHaveBeenCalledOnce();
            expect(mockCallback.mock.calls[0][0]).toBeUndefined();
        });

        it('should not use CanvasPool for full canvas capture', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback
            });

            expect(createWebGLSpy).not.toHaveBeenCalled();
        });

        it('should set image.src to the data URL returned by canvas.toDataURL', function ()
        {
            var capturedSrc = null;

            MockImage.mockImplementation(function ()
            {
                var self = this;
                self.onload = null;
                self.onerror = null;
                Object.defineProperty(self, 'src',
                {
                    set: function (value)
                    {
                        capturedSrc = value;
                        self._src = value;
                        if (self.onload)
                        {
                            self.onload();
                        }
                    },
                    get: function ()
                    {
                        return self._src;
                    }
                });
            });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback
            });

            expect(capturedSrc).toBe('data:image/png;base64,fullcanvas');
        });
    });

    // -------------------------------------------------------------------------
    // Area (partial) capture mode
    // -------------------------------------------------------------------------

    describe('area capture', function ()
    {
        it('should use CanvasPool.createWebGL when x is non-zero', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 0,
                width: 800,
                height: 600
            });

            expect(createWebGLSpy).toHaveBeenCalled();
        });

        it('should use CanvasPool.createWebGL when y is non-zero', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 0,
                y: 10,
                width: 800,
                height: 600
            });

            expect(createWebGLSpy).toHaveBeenCalled();
        });

        it('should use CanvasPool.createWebGL when width differs from canvas width', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 0,
                y: 0,
                width: 400,
                height: 600
            });

            expect(createWebGLSpy).toHaveBeenCalled();
        });

        it('should use CanvasPool.createWebGL when height differs from canvas height', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 0,
                y: 0,
                width: 800,
                height: 300
            });

            expect(createWebGLSpy).toHaveBeenCalled();
        });

        it('should call drawImage with the correct source region and destination', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 20,
                width: 100,
                height: 200
            });

            expect(mockCopyContext.drawImage).toHaveBeenCalledWith(
                mockCanvas, 10, 20, 100, 200, 0, 0, 100, 200
            );
        });

        it('should not call drawImage when width is zero', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 0,
                height: 100
            });

            expect(mockCopyContext.drawImage).not.toHaveBeenCalled();
        });

        it('should not call drawImage when height is zero', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 0
            });

            expect(mockCopyContext.drawImage).not.toHaveBeenCalled();
        });

        it('should call CanvasPool.remove with the copy canvas after load', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });

            expect(removeSpy).toHaveBeenCalledWith(mockCopyCanvas);
        });

        it('should call CanvasPool.remove with the copy canvas after error', function ()
        {
            MockImage.mockImplementation(function ()
            {
                var self = this;
                self.onload = null;
                self.onerror = null;
                Object.defineProperty(self, 'src',
                {
                    set: function (value)
                    {
                        self._src = value;
                        if (self.onerror)
                        {
                            self.onerror();
                        }
                    },
                    get: function ()
                    {
                        return self._src;
                    }
                });
            });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });

            expect(removeSpy).toHaveBeenCalledWith(mockCopyCanvas);
        });

        it('should call the callback with the image on successful area load', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });

            expect(mockCallback).toHaveBeenCalledOnce();
            expect(mockCallback.mock.calls[0][0]).toBeInstanceOf(MockImage);
        });

        it('should call the callback with no argument on area image error', function ()
        {
            MockImage.mockImplementation(function ()
            {
                var self = this;
                self.onload = null;
                self.onerror = null;
                Object.defineProperty(self, 'src',
                {
                    set: function (value)
                    {
                        self._src = value;
                        if (self.onerror)
                        {
                            self.onerror();
                        }
                    },
                    get: function ()
                    {
                        return self._src;
                    }
                });
            });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });

            expect(mockCallback).toHaveBeenCalledOnce();
            expect(mockCallback.mock.calls[0][0]).toBeUndefined();
        });

        it('should use custom type and encoder for area capture toDataURL', function ()
        {
            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 100,
                type: 'image/jpeg',
                encoder: 0.75
            });

            expect(mockCopyCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.75);
        });

        it('should set the image src to the copy canvas data URL', function ()
        {
            var capturedSrc = null;

            MockImage.mockImplementation(function ()
            {
                var self = this;
                self.onload = null;
                self.onerror = null;
                Object.defineProperty(self, 'src',
                {
                    set: function (value)
                    {
                        capturedSrc = value;
                        self._src = value;
                        if (self.onload)
                        {
                            self.onload();
                        }
                    },
                    get: function ()
                    {
                        return self._src;
                    }
                });
            });

            CanvasSnapshot(mockCanvas,
            {
                callback: mockCallback,
                x: 10,
                y: 10,
                width: 100,
                height: 100
            });

            expect(capturedSrc).toBe('data:image/png;base64,copycanvas');
        });
    });
});
