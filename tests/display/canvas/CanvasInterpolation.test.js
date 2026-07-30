var CanvasInterpolation = require('../../../src/display/canvas/CanvasInterpolation');

describe('Phaser.Display.Canvas.CanvasInterpolation.setCrisp', function ()
{
    var mockCanvas;

    beforeEach(function ()
    {
        mockCanvas = { style: {} };
    });

    describe('setCrisp', function ()
    {
        it('should return the canvas', function ()
        {
            var result = CanvasInterpolation.setCrisp(mockCanvas);

            expect(result).toBe(mockCanvas);
        });

        it('should set image-rendering to pixelated as the final value', function ()
        {
            CanvasInterpolation.setCrisp(mockCanvas);

            expect(mockCanvas.style['image-rendering']).toBe('pixelated');
        });

        it('should set msInterpolationMode to nearest-neighbor', function ()
        {
            CanvasInterpolation.setCrisp(mockCanvas);

            expect(mockCanvas.style.msInterpolationMode).toBe('nearest-neighbor');
        });

        it('should apply all vendor-prefixed image-rendering values in sequence', function ()
        {
            var applied = [];
            var canvas = {
                style: new Proxy({}, {
                    set: function (target, prop, value)
                    {
                        if (prop === 'image-rendering')
                        {
                            applied.push(value);
                        }
                        target[prop] = value;
                        return true;
                    }
                })
            };

            CanvasInterpolation.setCrisp(canvas);

            expect(applied).toEqual([
                'optimizeSpeed',
                '-moz-crisp-edges',
                '-o-crisp-edges',
                '-webkit-optimize-contrast',
                'optimize-contrast',
                'crisp-edges',
                'pixelated'
            ]);
        });

        it('should not alter other style properties', function ()
        {
            mockCanvas.style.color = 'red';

            CanvasInterpolation.setCrisp(mockCanvas);

            expect(mockCanvas.style.color).toBe('red');
        });
    });

    describe('setBicubic', function ()
    {
        it('should return the canvas', function ()
        {
            var result = CanvasInterpolation.setBicubic(mockCanvas);

            expect(result).toBe(mockCanvas);
        });

        it('should set image-rendering to auto', function ()
        {
            CanvasInterpolation.setBicubic(mockCanvas);

            expect(mockCanvas.style['image-rendering']).toBe('auto');
        });

        it('should set msInterpolationMode to bicubic', function ()
        {
            CanvasInterpolation.setBicubic(mockCanvas);

            expect(mockCanvas.style.msInterpolationMode).toBe('bicubic');
        });

        it('should not alter other style properties', function ()
        {
            mockCanvas.style.color = 'blue';

            CanvasInterpolation.setBicubic(mockCanvas);

            expect(mockCanvas.style.color).toBe('blue');
        });

        it('should override a previously set crisp style', function ()
        {
            CanvasInterpolation.setCrisp(mockCanvas);
            CanvasInterpolation.setBicubic(mockCanvas);

            expect(mockCanvas.style['image-rendering']).toBe('auto');
            expect(mockCanvas.style.msInterpolationMode).toBe('bicubic');
        });
    });
});
