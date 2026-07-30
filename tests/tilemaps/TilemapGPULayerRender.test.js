var TilemapGPULayerRender = require('../../src/tilemaps/TilemapGPULayerRender');

describe('TilemapGPULayerRender', function ()
{
    it('should be importable', function ()
    {
        expect(TilemapGPULayerRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(TilemapGPULayerRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(TilemapGPULayerRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof TilemapGPULayerRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof TilemapGPULayerRender.renderCanvas).toBe('function');
    });

    it('should export renderCanvas as a NOOP function that returns undefined', function ()
    {
        var result = TilemapGPULayerRender.renderCanvas();
        expect(result).toBeUndefined();
    });
});
