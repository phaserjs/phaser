var GraphicsRender = require('../../../src/gameobjects/graphics/GraphicsRender');

describe('GraphicsRender', function ()
{
    it('should be importable', function ()
    {
        expect(GraphicsRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof GraphicsRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof GraphicsRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(GraphicsRender);
        expect(keys.length).toBe(2);
    });

    it('should have renderWebGL and renderCanvas as the exported keys', function ()
    {
        expect(GraphicsRender).toHaveProperty('renderWebGL');
        expect(GraphicsRender).toHaveProperty('renderCanvas');
    });
});
