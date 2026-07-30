var PolygonRender = require('../../../../src/gameobjects/shape/polygon/PolygonRender');

describe('PolygonRender', function ()
{
    it('should be importable', function ()
    {
        expect(PolygonRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof PolygonRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof PolygonRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(PolygonRender);
        expect(keys.length).toBe(2);
    });


});
