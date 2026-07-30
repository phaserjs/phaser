var GridRender = require('../../../../src/gameobjects/shape/grid/GridRender');

describe('GridRender', function ()
{
    it('should be importable', function ()
    {
        expect(GridRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof GridRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof GridRender.renderCanvas).toBe('function');
    });
});
