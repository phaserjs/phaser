var PointLightRender = require('../../../src/gameobjects/pointlight/PointLightRender');

describe('PointLightRender', function ()
{
    it('should be importable', function ()
    {
        expect(PointLightRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof PointLightRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof PointLightRender.renderCanvas).toBe('function');
    });

    it('should export renderCanvas as NOOP', function ()
    {
        var NOOP = require('../../../src/utils/NOOP');
        expect(PointLightRender.renderCanvas).toBe(NOOP);
    });

    it('should have exactly two exports', function ()
    {
        var keys = Object.keys(PointLightRender);
        expect(keys.length).toBe(2);
    });

    it('should have renderWebGL and renderCanvas as the exported keys', function ()
    {
        expect(PointLightRender).toHaveProperty('renderWebGL');
        expect(PointLightRender).toHaveProperty('renderCanvas');
    });

    it('renderCanvas should return undefined when called', function ()
    {
        var result = PointLightRender.renderCanvas();
        expect(result).toBeUndefined();
    });
});
