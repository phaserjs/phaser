var BlitterRender = require('../../../src/gameobjects/blitter/BlitterRender');

describe('BlitterRender', function ()
{
    it('should be importable', function ()
    {
        expect(BlitterRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(BlitterRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(BlitterRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof BlitterRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof BlitterRender.renderCanvas).toBe('function');
    });

});
