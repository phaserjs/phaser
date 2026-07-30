var ExternRender = require('../../../src/gameobjects/extern/ExternRender');

describe('ExternRender', function ()
{
    it('should be importable', function ()
    {
        expect(ExternRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(ExternRender).toHaveProperty('renderWebGL');
        expect(typeof ExternRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(ExternRender).toHaveProperty('renderCanvas');
        expect(typeof ExternRender.renderCanvas).toBe('object');
    });
});
