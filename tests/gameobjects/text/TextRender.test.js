var TextRender = require('../../../src/gameobjects/text/TextRender');

describe('TextRender', function ()
{
    it('should be importable', function ()
    {
        expect(TextRender).toBeDefined();
    });

    it('should export a renderWebGL property', function ()
    {
        expect(TextRender).toHaveProperty('renderWebGL');
    });

    it('should export a renderCanvas property', function ()
    {
        expect(TextRender).toHaveProperty('renderCanvas');
    });

    it('should export renderWebGL as a function', function ()
    {
        expect(typeof TextRender.renderWebGL).toBe('function');
    });

    it('should export renderCanvas as a function', function ()
    {
        expect(typeof TextRender.renderCanvas).toBe('function');
    });
});
