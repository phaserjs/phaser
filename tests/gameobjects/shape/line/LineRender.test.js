var NOOP = require('../../../../src/utils/NOOP');

vi.mock('../../../../src/gameobjects/shape/line/LineWebGLRenderer', function ()
{
    return function () {};
});

vi.mock('../../../../src/gameobjects/shape/line/LineCanvasRenderer', function ()
{
    return function () {};
});

describe('LineRender', function ()
{
    it('should be importable', function ()
    {
        var LineRender = require('../../../../src/gameobjects/shape/line/LineRender');

        expect(LineRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        var LineRender = require('../../../../src/gameobjects/shape/line/LineRender');

        expect(typeof LineRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        var LineRender = require('../../../../src/gameobjects/shape/line/LineRender');

        expect(typeof LineRender.renderCanvas).toBe('function');
    });
});
