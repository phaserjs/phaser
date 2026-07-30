var RenderTextureRenderModes = require('../../../src/gameobjects/rendertexture/RenderTextureRenderModes');

describe('RenderTextureRenderModes', function ()
{
    it('should export a RENDER constant with value "render"', function ()
    {
        expect(RenderTextureRenderModes.RENDER).toBe('render');
    });

    it('should export a REDRAW constant with value "redraw"', function ()
    {
        expect(RenderTextureRenderModes.REDRAW).toBe('redraw');
    });

    it('should export an ALL constant with value "all"', function ()
    {
        expect(RenderTextureRenderModes.ALL).toBe('all');
    });

    it('should export exactly three properties', function ()
    {
        expect(Object.keys(RenderTextureRenderModes).length).toBe(3);
    });

    it('should have all constants as strings', function ()
    {
        expect(typeof RenderTextureRenderModes.RENDER).toBe('string');
        expect(typeof RenderTextureRenderModes.REDRAW).toBe('string');
        expect(typeof RenderTextureRenderModes.ALL).toBe('string');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            RenderTextureRenderModes.RENDER,
            RenderTextureRenderModes.REDRAW,
            RenderTextureRenderModes.ALL
        ];
        var unique = new Set(values);
        expect(unique.size).toBe(3);
    });
});
