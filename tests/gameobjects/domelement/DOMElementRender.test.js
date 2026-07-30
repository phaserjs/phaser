var DOMElementRender = require('../../../src/gameobjects/domelement/DOMElementRender');

describe('DOMElementRender', function ()
{
    it('should be importable', function ()
    {
        expect(DOMElementRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof DOMElementRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof DOMElementRender.renderCanvas).toBe('function');
    });

    it('should have renderWebGL and renderCanvas as the only exports', function ()
    {
        var keys = Object.keys(DOMElementRender);

        expect(keys.length).toBe(2);
        expect(keys).toContain('renderWebGL');
        expect(keys).toContain('renderCanvas');
    });

    it('should call renderWebGL without throwing', function ()
    {
        var mockSrc = { node: null };

        expect(function ()
        {
            DOMElementRender.renderWebGL({}, mockSrc, {});
        }).not.toThrow();
    });

    it('should call renderCanvas without throwing', function ()
    {
        var mockSrc = { node: null };

        expect(function ()
        {
            DOMElementRender.renderCanvas({}, mockSrc, {});
        }).not.toThrow();
    });

    it('should return undefined from renderWebGL', function ()
    {
        expect(DOMElementRender.renderWebGL({}, { node: null }, {})).toBeUndefined();
    });

    it('should return undefined from renderCanvas', function ()
    {
        expect(DOMElementRender.renderCanvas({}, { node: null }, {})).toBeUndefined();
    });
});
