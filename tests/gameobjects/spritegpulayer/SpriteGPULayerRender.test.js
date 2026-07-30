var SpriteGPULayerRender = require('../../../src/gameobjects/spritegpulayer/SpriteGPULayerRender');

describe('SpriteGPULayerRender', function ()
{
    it('should be importable', function ()
    {
        expect(SpriteGPULayerRender).toBeDefined();
    });

    it('should export a renderWebGL function', function ()
    {
        expect(typeof SpriteGPULayerRender.renderWebGL).toBe('function');
    });

    it('should export a renderCanvas function', function ()
    {
        expect(typeof SpriteGPULayerRender.renderCanvas).toBe('function');
    });

    it('should have renderCanvas as a NOOP that returns undefined', function ()
    {
        var result = SpriteGPULayerRender.renderCanvas();
        expect(result).toBeUndefined();
    });

    it('should have renderCanvas that accepts arguments without throwing', function ()
    {
        expect(function ()
        {
            SpriteGPULayerRender.renderCanvas({}, {}, {});
        }).not.toThrow();
    });
});
