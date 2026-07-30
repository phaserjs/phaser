var StampRender = require('../../../src/gameobjects/stamp/StampRender');

describe('StampRender', function ()
{
    it('should be importable', function ()
    {
        expect(StampRender).toBeDefined();
    });

    it('should export a renderCanvas property', function ()
    {
        expect(StampRender).toHaveProperty('renderCanvas');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof StampRender.renderCanvas).toBe('function');
    });
});
