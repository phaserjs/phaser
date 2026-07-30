var BitmapTextRender = require('../../../../src/gameobjects/bitmaptext/static/BitmapTextRender');

describe('BitmapTextRender', function ()
{
    it('should be importable', function ()
    {
        expect(BitmapTextRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof BitmapTextRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof BitmapTextRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(BitmapTextRender);
        expect(keys.length).toBe(2);
        expect(keys).toContain('renderWebGL');
        expect(keys).toContain('renderCanvas');
    });


});
