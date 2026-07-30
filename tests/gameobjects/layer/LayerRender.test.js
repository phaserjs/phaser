var LayerRender = require('../../../src/gameobjects/layer/LayerRender');

describe('LayerRender', function ()
{
    it('should be importable', function ()
    {
        expect(LayerRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof LayerRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof LayerRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(LayerRender);
        expect(keys.length).toBe(2);
    });

    it('should have renderWebGL and renderCanvas as the exported keys', function ()
    {
        expect(LayerRender).toHaveProperty('renderWebGL');
        expect(LayerRender).toHaveProperty('renderCanvas');
    });

    it('renderWebGL should return early when layer has no children', function ()
    {
        var layer = { list: [], depthSort: function () {} };
        expect(function () { LayerRender.renderWebGL(null, layer, null, null, 0, null, 0); }).not.toThrow();
    });

    it('renderCanvas should return early when layer has no children', function ()
    {
        var layer = { list: [], depthSort: function () {} };
        expect(function () { LayerRender.renderCanvas(null, layer, null); }).not.toThrow();
    });

    it('renderWebGL should return undefined when layer has no children', function ()
    {
        var layer = { list: [], depthSort: function () {} };
        var result = LayerRender.renderWebGL(null, layer, null, null, 0, null, 0);
        expect(result).toBeUndefined();
    });

    it('renderCanvas should return undefined when layer has no children', function ()
    {
        var layer = { list: [], depthSort: function () {} };
        var result = LayerRender.renderCanvas(null, layer, null);
        expect(result).toBeUndefined();
    });
});
