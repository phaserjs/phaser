var TileSpriteRender = require('../../../src/gameobjects/tilesprite/TileSpriteRender');

describe('TileSpriteRender', function ()
{
    it('should be importable', function ()
    {
        expect(TileSpriteRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof TileSpriteRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof TileSpriteRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(TileSpriteRender);
        expect(keys.length).toBe(2);
        expect(keys).toContain('renderWebGL');
        expect(keys).toContain('renderCanvas');
    });
});
