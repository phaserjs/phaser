var ArcRender = require('../../../../src/gameobjects/shape/arc/ArcRender');

describe('ArcRender', function ()
{
    it('should be importable', function ()
    {
        expect(ArcRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof ArcRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof ArcRender.renderCanvas).toBe('function');
    });
});
