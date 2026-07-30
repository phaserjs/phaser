var EllipseRender = require('../../../../src/gameobjects/shape/ellipse/EllipseRender');

describe('EllipseRender', function ()
{
    it('should be importable', function ()
    {
        expect(EllipseRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(typeof EllipseRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(typeof EllipseRender.renderCanvas).toBe('function');
    });
});
