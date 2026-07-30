var RopeCanvasRenderer = require('../../../src/gameobjects/rope/RopeCanvasRenderer');

describe('RopeCanvasRenderer', function ()
{
    it('should be importable', function ()
    {
        expect(RopeCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof RopeCanvasRenderer).toBe('function');
    });

    it('should be callable with no arguments', function ()
    {
        expect(function ()
        {
            RopeCanvasRenderer();
        }).not.toThrow();
    });

    it('should be instantiable with new', function ()
    {
        var instance = new RopeCanvasRenderer();
        expect(instance).toBeDefined();
    });
});
