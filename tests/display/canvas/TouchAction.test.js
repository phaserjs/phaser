var TouchAction = require('../../../src/display/canvas/TouchAction');

describe('Phaser.Display.Canvas.TouchAction', function ()
{
    var mockCanvas;

    beforeEach(function ()
    {
        mockCanvas = { style: {} };
    });

    it('should return the canvas element', function ()
    {
        var result = TouchAction(mockCanvas);

        expect(result).toBe(mockCanvas);
    });

    it('should set touch-action to none by default', function ()
    {
        TouchAction(mockCanvas);

        expect(mockCanvas.style['touch-action']).toBe('none');
    });

    it('should set msTouchAction to none by default', function ()
    {
        TouchAction(mockCanvas);

        expect(mockCanvas.style['msTouchAction']).toBe('none');
    });

    it('should set ms-touch-action to none by default', function ()
    {
        TouchAction(mockCanvas);

        expect(mockCanvas.style['ms-touch-action']).toBe('none');
    });

    it('should set all three style properties when value is provided', function ()
    {
        TouchAction(mockCanvas, 'pan-x');

        expect(mockCanvas.style['touch-action']).toBe('pan-x');
        expect(mockCanvas.style['msTouchAction']).toBe('pan-x');
        expect(mockCanvas.style['ms-touch-action']).toBe('pan-x');
    });

    it('should accept auto as a value', function ()
    {
        TouchAction(mockCanvas, 'auto');

        expect(mockCanvas.style['touch-action']).toBe('auto');
        expect(mockCanvas.style['msTouchAction']).toBe('auto');
        expect(mockCanvas.style['ms-touch-action']).toBe('auto');
    });

    it('should accept manipulation as a value', function ()
    {
        TouchAction(mockCanvas, 'manipulation');

        expect(mockCanvas.style['touch-action']).toBe('manipulation');
        expect(mockCanvas.style['msTouchAction']).toBe('manipulation');
        expect(mockCanvas.style['ms-touch-action']).toBe('manipulation');
    });

    it('should accept pan-y as a value', function ()
    {
        TouchAction(mockCanvas, 'pan-y');

        expect(mockCanvas.style['touch-action']).toBe('pan-y');
        expect(mockCanvas.style['msTouchAction']).toBe('pan-y');
        expect(mockCanvas.style['ms-touch-action']).toBe('pan-y');
    });

    it('should use none when value is undefined', function ()
    {
        TouchAction(mockCanvas, undefined);

        expect(mockCanvas.style['touch-action']).toBe('none');
        expect(mockCanvas.style['msTouchAction']).toBe('none');
        expect(mockCanvas.style['ms-touch-action']).toBe('none');
    });

    it('should set all three properties to the same value', function ()
    {
        TouchAction(mockCanvas, 'pinch-zoom');

        var v = mockCanvas.style['touch-action'];

        expect(mockCanvas.style['msTouchAction']).toBe(v);
        expect(mockCanvas.style['ms-touch-action']).toBe(v);
    });
});
