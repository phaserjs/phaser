var TilemapLayerRender = require('../../src/tilemaps/TilemapLayerRender');

describe('TilemapLayerRender', function ()
{
    it('should be importable', function ()
    {
        expect(TilemapLayerRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(TilemapLayerRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(TilemapLayerRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof TilemapLayerRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof TilemapLayerRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(TilemapLayerRender);
        expect(keys.length).toBe(2);
    });
});
