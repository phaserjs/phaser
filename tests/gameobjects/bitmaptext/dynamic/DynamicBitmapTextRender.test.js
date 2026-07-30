var DynamicBitmapTextRender = require('../../../../src/gameobjects/bitmaptext/dynamic/DynamicBitmapTextRender');

describe('DynamicBitmapTextRender', function ()
{
    it('should be importable', function ()
    {
        expect(DynamicBitmapTextRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof DynamicBitmapTextRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof DynamicBitmapTextRender.renderCanvas).toBe('function');
    });

    it('should have exactly two exported properties', function ()
    {
        var keys = Object.keys(DynamicBitmapTextRender);
        expect(keys.length).toBe(2);
        expect(keys).toContain('renderWebGL');
        expect(keys).toContain('renderCanvas');
    });

    it('renderWebGL should be callable without throwing', function ()
    {
        // WebGL renderer returns early when src.text is empty
        var mockSrc = { text: '' };
        expect(function () { DynamicBitmapTextRender.renderWebGL(null, mockSrc, null, null); }).not.toThrow();
    });

    it('renderCanvas should be callable without throwing', function ()
    {
        // Canvas renderer reads renderer.currentContext then returns early when src._text is empty
        var mockRenderer = { currentContext: {} };
        var mockSrc = { _text: '' };
        expect(function () { DynamicBitmapTextRender.renderCanvas(mockRenderer, mockSrc, null, null); }).not.toThrow();
    });
});
