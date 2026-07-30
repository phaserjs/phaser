var StarRender = require('../../../../src/gameobjects/shape/star/StarRender');

describe('StarRender', function ()
{
    it('should be importable', function ()
    {
        expect(StarRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof StarRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof StarRender.renderCanvas).toBe('function');
    });
});
