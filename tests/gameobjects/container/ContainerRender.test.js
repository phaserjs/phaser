var ContainerRender = require('../../../src/gameobjects/container/ContainerRender');

describe('ContainerRender', function ()
{
    it('should be importable', function ()
    {
        expect(ContainerRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(ContainerRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(ContainerRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof ContainerRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof ContainerRender.renderCanvas).toBe('function');
    });


});
