var ShaderRender = require('../../../src/gameobjects/shader/ShaderRender');

describe('ShaderRender', function ()
{
    it('should be importable', function ()
    {
        expect(ShaderRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof ShaderRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof ShaderRender.renderCanvas).toBe('function');
    });
});
