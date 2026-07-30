var WebGLSnapshot = require('../../../src/renderer/snapshot/WebGLSnapshot');
var CanvasPool = require('../../../src/display/canvas/CanvasPool');

describe('Phaser.Renderer.Snapshot.WebGL', function ()
{
    var mockGl;
    var mockCanvas;
    var mockCtx;
    var mockImageData;
    var capturedImage;
    var spyCreateWebGL;
    var spyRemove;

    beforeEach(function ()
    {
        mockImageData = { data: new Array(4).fill(0) };

        mockCtx = {
            getImageData: vi.fn(function (x, y, w, h)
            {
                mockImageData = { data: new Array(w * h * 4).fill(0) };
                return mockImageData;
            }),
            putImageData: vi.fn()
        };

        mockCanvas = {
            getContext: vi.fn(function ()
            {
                return mockCtx;
            }),
            toDataURL: vi.fn(function (type, encoder)
            {
                return 'data:' + type + ';base64,abc123';
            })
        };

        spyCreateWebGL = vi.spyOn(CanvasPool, 'createWebGL').mockReturnValue(mockCanvas);
        spyRemove = vi.spyOn(CanvasPool, 'remove').mockImplementation(function () {});

        mockGl = {
            drawingBufferWidth: 800,
            drawingBufferHeight: 600,
            RGBA: 0x1908,
            UNSIGNED_BYTE: 0x1401,
            readPixels: vi.fn()
        };

        capturedImage = null;

        global.Image = function ()
        {
            this.onerror = null;
            this.onload = null;
            this._src = '';
            capturedImage = this;

            Object.defineProperty(this, 'src', {
                set: function (val)
                {
                    this._src = val;
                    if (this.onload)
                    {
                        this.onload();
                    }
                },
                get: function ()
                {
                    return this._src;
                }
            });
        };
    });

    afterEach(function ()
    {
        spyCreateWebGL.mockRestore();
        spyRemove.mockRestore();
        delete global.Image;
    });

    // -------------------------------------------------------------------------
    // getPixel path
    // -------------------------------------------------------------------------

    describe('getPixel mode', function ()
    {
        it('should call readPixels at the correct coordinates', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: true,
                x: 10,
                y: 20
            };

            WebGLSnapshot(mockGl, config);

            expect(mockGl.readPixels).toHaveBeenCalledOnce();

            var args = mockGl.readPixels.mock.calls[0];
            expect(args[0]).toBe(10);
            expect(args[1]).toBe(600 - 20 - 1);
            expect(args[2]).toBe(1);
            expect(args[3]).toBe(1);
        });

        it('should call the callback with a Color object containing the pixel values', function ()
        {
            var callbackArg = null;

            var config = {
                callback: function (color)
                {
                    callbackArg = color;
                },
                getPixel: true,
                x: 0,
                y: 0
            };

            mockGl.readPixels.mockImplementation(function (x, y, w, h, fmt, type, pixels)
            {
                pixels[0] = 255;
                pixels[1] = 128;
                pixels[2] = 64;
                pixels[3] = 200;
            });

            WebGLSnapshot(mockGl, config);

            expect(callbackArg).not.toBeNull();
            expect(callbackArg.red).toBe(255);
            expect(callbackArg.green).toBe(128);
            expect(callbackArg.blue).toBe(64);
            expect(callbackArg.alpha).toBe(200);
        });

        it('should invert the Y coordinate to account for WebGL origin', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: true,
                x: 5,
                y: 100
            };

            WebGLSnapshot(mockGl, config);

            var destY = mockGl.readPixels.mock.calls[0][1];
            expect(destY).toBe(600 - 100 - 1);
        });

        it('should use absolute value and round for x and y coordinates', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: true,
                x: -7.9,
                y: -3.1
            };

            WebGLSnapshot(mockGl, config);

            var args = mockGl.readPixels.mock.calls[0];
            expect(args[0]).toBe(8);
            expect(args[1]).toBe(600 - 3 - 1);
        });

        it('should use bufferWidth and bufferHeight from config when isFramebuffer is true', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: true,
                x: 0,
                y: 10,
                isFramebuffer: true,
                bufferWidth: 256,
                bufferHeight: 128
            };

            WebGLSnapshot(mockGl, config);

            var destY = mockGl.readPixels.mock.calls[0][1];
            expect(destY).toBe(128 - 10 - 1);
        });

        it('should default bufferHeight to 1 when isFramebuffer is true and not specified', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: true,
                x: 0,
                y: 0,
                isFramebuffer: true
            };

            WebGLSnapshot(mockGl, config);

            var destY = mockGl.readPixels.mock.calls[0][1];
            expect(destY).toBe(1 - 0 - 1);
        });

        it('should default x and y to 0 when not specified', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: true
            };

            WebGLSnapshot(mockGl, config);

            var args = mockGl.readPixels.mock.calls[0];
            expect(args[0]).toBe(0);
            expect(args[1]).toBe(600 - 0 - 1);
        });
    });

    // -------------------------------------------------------------------------
    // area snapshot path
    // -------------------------------------------------------------------------

    describe('area snapshot mode', function ()
    {
        it('should call readPixels with inverted Y region', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                x: 10,
                y: 20,
                width: 100,
                height: 50
            };

            WebGLSnapshot(mockGl, config);

            var args = mockGl.readPixels.mock.calls[0];
            expect(args[0]).toBe(10);
            expect(args[1]).toBe(600 - 20 - 50);
            expect(args[2]).toBe(100);
            expect(args[3]).toBe(50);
        });

        it('should default width and height to drawingBuffer dimensions', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false
            };

            WebGLSnapshot(mockGl, config);

            expect(spyCreateWebGL).toHaveBeenCalledOnce();
            var args = spyCreateWebGL.mock.calls[0];
            expect(args[1]).toBe(800);
            expect(args[2]).toBe(600);
        });

        it('should create a canvas of the correct size', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 200,
                height: 100
            };

            WebGLSnapshot(mockGl, config);

            expect(spyCreateWebGL).toHaveBeenCalledOnce();
            var args = spyCreateWebGL.mock.calls[0];
            expect(args[1]).toBe(200);
            expect(args[2]).toBe(100);
        });

        it('should get a 2d context with willReadFrequently', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 4,
                height: 4
            };

            WebGLSnapshot(mockGl, config);

            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', { willReadFrequently: true });
        });

        it('should call putImageData after building image data', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 4,
                height: 4
            };

            WebGLSnapshot(mockGl, config);

            expect(mockCtx.putImageData).toHaveBeenCalledOnce();
        });

        it('should call toDataURL with the default type and encoder', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 4,
                height: 4
            };

            WebGLSnapshot(mockGl, config);

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png', 0.92);
        });

        it('should call toDataURL with custom type and encoder', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 4,
                height: 4,
                type: 'image/jpeg',
                encoder: 0.75
            };

            WebGLSnapshot(mockGl, config);

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.75);
        });

        it('should set image.src to the data URL from toDataURL', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 4,
                height: 4,
                type: 'image/png',
                encoder: 0.92
            };

            WebGLSnapshot(mockGl, config);

            expect(capturedImage._src).toBe('data:image/png;base64,abc123');
        });

        it('should call callback with the image on successful load', function ()
        {
            var callbackArg = undefined;

            var config = {
                callback: function (img)
                {
                    callbackArg = img;
                },
                getPixel: false,
                width: 4,
                height: 4
            };

            WebGLSnapshot(mockGl, config);

            // onload fires synchronously in our mock when src is set
            expect(callbackArg).toBe(capturedImage);
        });

        it('should remove the canvas from CanvasPool on successful load', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 4,
                height: 4
            };

            WebGLSnapshot(mockGl, config);

            expect(spyRemove).toHaveBeenCalledWith(mockCanvas);
        });

        it('should call callback with no argument and remove canvas on error', function ()
        {
            var callbackArg = 'not-called';

            global.Image = function ()
            {
                this.onerror = null;
                this.onload = null;
                capturedImage = this;

                Object.defineProperty(this, 'src', {
                    set: function (val)
                    {
                        this._src = val;
                        if (this.onerror)
                        {
                            this.onerror();
                        }
                    },
                    get: function ()
                    {
                        return this._src;
                    }
                });
            };

            var config = {
                callback: function (img)
                {
                    callbackArg = img;
                },
                getPixel: false,
                width: 4,
                height: 4
            };

            WebGLSnapshot(mockGl, config);

            expect(callbackArg).toBeUndefined();
            expect(spyRemove).toHaveBeenCalledWith(mockCanvas);
        });

        // -----------------------------------------------------------------------
        // Y-axis flip / pixel reordering
        // -----------------------------------------------------------------------

        it('should flip the Y-axis when copying pixels from WebGL to canvas', function ()
        {
            var width = 2;
            var height = 2;

            // WebGL row 0 (bottom) = red, WebGL row 1 (top) = blue
            // After Y-flip: canvas row 0 = blue, canvas row 1 = red
            var sourcePixels = new Uint8Array([
                // row 0 (WebGL bottom) – red
                255, 0, 0, 255,
                255, 0, 0, 255,
                // row 1 (WebGL top) – blue
                0, 0, 255, 255,
                0, 0, 255, 255
            ]);

            mockGl.readPixels.mockImplementation(function (x, y, w, h, fmt, type, pixels)
            {
                for (var i = 0; i < sourcePixels.length; i++)
                {
                    pixels[i] = sourcePixels[i];
                }
            });

            var capturedData = null;

            mockCtx.getImageData.mockImplementation(function (x, y, w, h)
            {
                mockImageData = { data: new Array(w * h * 4).fill(0) };
                return mockImageData;
            });

            mockCtx.putImageData.mockImplementation(function (imgData)
            {
                capturedData = imgData.data.slice();
            });

            var config = {
                callback: vi.fn(),
                getPixel: false,
                x: 0,
                y: 0,
                width: width,
                height: height
            };

            WebGLSnapshot(mockGl, config);

            // Canvas row 0 should be blue (was WebGL row 1 = top)
            expect(capturedData[0]).toBe(0);
            expect(capturedData[1]).toBe(0);
            expect(capturedData[2]).toBe(255);
            expect(capturedData[3]).toBe(255);

            // Canvas row 1 should be red (was WebGL row 0 = bottom)
            var row1Start = width * 4;
            expect(capturedData[row1Start + 0]).toBe(255);
            expect(capturedData[row1Start + 1]).toBe(0);
            expect(capturedData[row1Start + 2]).toBe(0);
            expect(capturedData[row1Start + 3]).toBe(255);
        });

        // -----------------------------------------------------------------------
        // unpremultiplyAlpha
        // -----------------------------------------------------------------------

        it('should not unpremultiply alpha when unpremultiplyAlpha is false', function ()
        {
            mockGl.readPixels.mockImplementation(function (x, y, w, h, fmt, type, pixels)
            {
                pixels[0] = 128;
                pixels[1] = 64;
                pixels[2] = 32;
                pixels[3] = 128;
            });

            var capturedData = null;

            mockCtx.getImageData.mockImplementation(function (x, y, w, h)
            {
                mockImageData = { data: new Array(w * h * 4).fill(0) };
                return mockImageData;
            });

            mockCtx.putImageData.mockImplementation(function (imgData)
            {
                capturedData = imgData.data.slice();
            });

            var config = {
                callback: vi.fn(),
                getPixel: false,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                unpremultiplyAlpha: false
            };

            WebGLSnapshot(mockGl, config);

            expect(capturedData[0]).toBe(128);
            expect(capturedData[1]).toBe(64);
            expect(capturedData[2]).toBe(32);
            expect(capturedData[3]).toBe(128);
        });

        it('should unpremultiply alpha when unpremultiplyAlpha is true and alpha is non-zero', function ()
        {
            // Pre-multiplied at ~50% alpha: r=128, g=64, b=32, a=128
            mockGl.readPixels.mockImplementation(function (x, y, w, h, fmt, type, pixels)
            {
                pixels[0] = 128;
                pixels[1] = 64;
                pixels[2] = 32;
                pixels[3] = 128;
            });

            var capturedData = null;

            mockCtx.getImageData.mockImplementation(function (x, y, w, h)
            {
                mockImageData = { data: new Array(w * h * 4).fill(0) };
                return mockImageData;
            });

            mockCtx.putImageData.mockImplementation(function (imgData)
            {
                capturedData = imgData.data.slice();
            });

            var config = {
                callback: vi.fn(),
                getPixel: false,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                unpremultiplyAlpha: true
            };

            WebGLSnapshot(mockGl, config);

            var ratio = 255 / 128;
            expect(capturedData[0]).toBe(Math.floor(128 * ratio));
            expect(capturedData[1]).toBe(Math.floor(64 * ratio));
            expect(capturedData[2]).toBe(Math.floor(32 * ratio));
            expect(capturedData[3]).toBe(128);
        });

        it('should not unpremultiply when alpha is zero even if unpremultiplyAlpha is true', function ()
        {
            mockGl.readPixels.mockImplementation(function (x, y, w, h, fmt, type, pixels)
            {
                pixels[0] = 100;
                pixels[1] = 100;
                pixels[2] = 100;
                pixels[3] = 0;
            });

            var capturedData = null;

            mockCtx.getImageData.mockImplementation(function (x, y, w, h)
            {
                mockImageData = { data: new Array(w * h * 4).fill(0) };
                return mockImageData;
            });

            mockCtx.putImageData.mockImplementation(function (imgData)
            {
                capturedData = imgData.data.slice();
            });

            var config = {
                callback: vi.fn(),
                getPixel: false,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                unpremultiplyAlpha: true
            };

            WebGLSnapshot(mockGl, config);

            // RGB unchanged because a === 0
            expect(capturedData[0]).toBe(100);
            expect(capturedData[1]).toBe(100);
            expect(capturedData[2]).toBe(100);
            expect(capturedData[3]).toBe(0);
        });

        it('should floor width and height to integers', function ()
        {
            var config = {
                callback: vi.fn(),
                getPixel: false,
                width: 10.7,
                height: 8.9
            };

            WebGLSnapshot(mockGl, config);

            expect(spyCreateWebGL).toHaveBeenCalledOnce();
            var args = spyCreateWebGL.mock.calls[0];
            expect(args[1]).toBe(10);
            expect(args[2]).toBe(8);
        });
    });
});
