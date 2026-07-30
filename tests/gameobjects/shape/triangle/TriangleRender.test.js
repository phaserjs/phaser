var TriangleRender = require('../../../../src/gameobjects/shape/triangle/TriangleRender');

describe('TriangleRender', function ()
{
    it('should be importable', function ()
    {
        expect(TriangleRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof TriangleRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof TriangleRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(TriangleRender);
        expect(keys.length).toBe(2);
    });
});
