var ShaderCanvasRenderer = require('../../../src/gameobjects/shader/ShaderCanvasRenderer');

describe('ShaderCanvasRenderer', function ()
{
    it('should be importable', function ()
    {
        expect(ShaderCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof ShaderCanvasRenderer).toBe('function');
    });

    it('should be callable without arguments and return undefined', function ()
    {
        var result = ShaderCanvasRenderer();

        expect(result).toBeUndefined();
    });

    it('should be callable with renderer, src, and camera arguments without throwing', function ()
    {
        var renderer = {};
        var src = {};
        var camera = {};

        expect(function ()
        {
            ShaderCanvasRenderer(renderer, src, camera);
        }).not.toThrow();
    });

    it('should be instantiable with new', function ()
    {
        var instance = new ShaderCanvasRenderer();

        expect(instance).toBeDefined();
    });
});
