var RectangleRender = require('../../../../src/gameobjects/shape/rectangle/RectangleRender');

describe('RectangleRender', function ()
{
    it('should be importable', function ()
    {
        expect(RectangleRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof RectangleRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof RectangleRender.renderCanvas).toBe('function');
    });
});
