var IsoTriangleRender = require('../../../../src/gameobjects/shape/isotriangle/IsoTriangleRender');

describe('IsoTriangleRender', function ()
{
    it('should be importable', function ()
    {
        expect(IsoTriangleRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(IsoTriangleRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(IsoTriangleRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof IsoTriangleRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof IsoTriangleRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(IsoTriangleRender);
        expect(keys.length).toBe(2);
    });
});
