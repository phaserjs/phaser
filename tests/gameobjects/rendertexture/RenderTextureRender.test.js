var RenderTextureRender = require('../../../src/gameobjects/rendertexture/RenderTextureRender');

describe('RenderTextureRender', function ()
{
    it('should be importable', function ()
    {
        expect(RenderTextureRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(RenderTextureRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(RenderTextureRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof RenderTextureRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof RenderTextureRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(RenderTextureRender);
        expect(keys.length).toBe(2);
    });
});
