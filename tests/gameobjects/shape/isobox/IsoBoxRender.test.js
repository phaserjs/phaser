var IsoBoxRender = require('../../../../src/gameobjects/shape/isobox/IsoBoxRender');

describe('IsoBoxRender', function ()
{
    it('should be importable', function ()
    {
        expect(IsoBoxRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof IsoBoxRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof IsoBoxRender.renderCanvas).toBe('function');
    });

    it('should export exactly two properties', function ()
    {
        var keys = Object.keys(IsoBoxRender);
        expect(keys.length).toBe(2);
        expect(keys).toContain('renderWebGL');
        expect(keys).toContain('renderCanvas');
    });
});
