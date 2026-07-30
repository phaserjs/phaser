var ImageRender = require('../../../src/gameobjects/image/ImageRender');

describe('ImageRender', function ()
{
    it('should be importable', function ()
    {
        expect(ImageRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof ImageRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof ImageRender.renderCanvas).toBe('function');
    });
});
