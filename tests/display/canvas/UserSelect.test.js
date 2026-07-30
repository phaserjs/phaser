var UserSelect = require('../../../src/display/canvas/UserSelect');

describe('Phaser.Display.Canvas.UserSelect', function ()
{
    var mockCanvas;

    beforeEach(function ()
    {
        mockCanvas = { style: {} };
    });

    it('should return the canvas element', function ()
    {
        var result = UserSelect(mockCanvas);

        expect(result).toBe(mockCanvas);
    });

    it('should default value to none when not provided', function ()
    {
        UserSelect(mockCanvas);

        expect(mockCanvas.style['user-select']).toBe('none');
    });

    it('should set user-select with all vendor prefixes', function ()
    {
        UserSelect(mockCanvas, 'text');

        expect(mockCanvas.style['-webkit-user-select']).toBe('text');
        expect(mockCanvas.style['-khtml-user-select']).toBe('text');
        expect(mockCanvas.style['-moz-user-select']).toBe('text');
        expect(mockCanvas.style['-ms-user-select']).toBe('text');
        expect(mockCanvas.style['user-select']).toBe('text');
    });

    it('should set -webkit-touch-callout to the given value', function ()
    {
        UserSelect(mockCanvas, 'auto');

        expect(mockCanvas.style['-webkit-touch-callout']).toBe('auto');
    });

    it('should set -webkit-touch-callout to none by default', function ()
    {
        UserSelect(mockCanvas);

        expect(mockCanvas.style['-webkit-touch-callout']).toBe('none');
    });

    it('should set -webkit-tap-highlight-color to transparent rgba', function ()
    {
        UserSelect(mockCanvas);

        expect(mockCanvas.style['-webkit-tap-highlight-color']).toBe('rgba(0, 0, 0, 0)');
    });

    it('should set -webkit-tap-highlight-color regardless of value argument', function ()
    {
        UserSelect(mockCanvas, 'text');

        expect(mockCanvas.style['-webkit-tap-highlight-color']).toBe('rgba(0, 0, 0, 0)');
    });

    it('should apply a custom value to all vendor-prefixed user-select properties', function ()
    {
        UserSelect(mockCanvas, 'all');

        expect(mockCanvas.style['-webkit-user-select']).toBe('all');
        expect(mockCanvas.style['-khtml-user-select']).toBe('all');
        expect(mockCanvas.style['-moz-user-select']).toBe('all');
        expect(mockCanvas.style['-ms-user-select']).toBe('all');
        expect(mockCanvas.style['user-select']).toBe('all');
        expect(mockCanvas.style['-webkit-touch-callout']).toBe('all');
    });

    it('should apply none explicitly when passed as value', function ()
    {
        UserSelect(mockCanvas, 'none');

        expect(mockCanvas.style['user-select']).toBe('none');
        expect(mockCanvas.style['-webkit-touch-callout']).toBe('none');
    });

    it('should set exactly seven style properties', function ()
    {
        UserSelect(mockCanvas);

        var keys = Object.keys(mockCanvas.style);

        expect(keys.length).toBe(7);
    });
});
