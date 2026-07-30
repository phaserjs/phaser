var NineSliceRender = require('../../../src/gameobjects/nineslice/NineSliceRender');

describe('NineSliceRender', function ()
{
    it('should be importable', function ()
    {
        expect(NineSliceRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof NineSliceRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof NineSliceRender.renderCanvas).toBe('function');
    });

    it('should export renderCanvas as NOOP', function ()
    {
        var NOOP = require('../../../src/utils/NOOP');

        expect(NineSliceRender.renderCanvas).toBe(NOOP);
    });

    it('should export renderWebGL as the WebGL renderer', function ()
    {
        var webGLRenderer = require('../../../src/gameobjects/nineslice/NineSliceWebGLRenderer');

        expect(NineSliceRender.renderWebGL).toBe(webGLRenderer);
    });

    it('should return undefined when renderCanvas is called', function ()
    {
        var result = NineSliceRender.renderCanvas();

        expect(result).toBeUndefined();
    });
});
