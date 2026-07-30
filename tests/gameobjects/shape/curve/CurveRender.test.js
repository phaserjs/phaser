var CurveRender = require('../../../../src/gameobjects/shape/curve/CurveRender');

describe('CurveRender', function ()
{
    it('should be importable', function ()
    {
        expect(CurveRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof CurveRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof CurveRender.renderCanvas).toBe('function');
    });
});
