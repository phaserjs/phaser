var SpriteRender = require('../../../src/gameobjects/sprite/SpriteRender');

describe('SpriteRender', function ()
{
    it('should be importable', function ()
    {
        expect(SpriteRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof SpriteRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof SpriteRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(SpriteRender);
        expect(keys.length).toBe(2);
        expect(keys).toContain('renderWebGL');
        expect(keys).toContain('renderCanvas');
    });
});
