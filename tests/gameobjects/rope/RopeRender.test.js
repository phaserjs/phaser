var RopeRender = require('../../../src/gameobjects/rope/RopeRender');

describe('RopeRender', function ()
{
    it('should be importable', function ()
    {
        expect(RopeRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof RopeRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof RopeRender.renderCanvas).toBe('function');
    });
});
