var ScaleModes = require('../../src/renderer/ScaleModes');

describe('ScaleModes', function ()
{
    it('should be importable', function ()
    {
        expect(ScaleModes).toBeDefined();
    });

    it('should have DEFAULT equal to 0', function ()
    {
        expect(ScaleModes.DEFAULT).toBe(0);
    });

    it('should have LINEAR equal to 0', function ()
    {
        expect(ScaleModes.LINEAR).toBe(0);
    });

    it('should have NEAREST equal to 1', function ()
    {
        expect(ScaleModes.NEAREST).toBe(1);
    });

    it('should have DEFAULT and LINEAR share the same value', function ()
    {
        expect(ScaleModes.DEFAULT).toBe(ScaleModes.LINEAR);
    });

    it('should have NEAREST differ from LINEAR', function ()
    {
        expect(ScaleModes.NEAREST).not.toBe(ScaleModes.LINEAR);
    });

    it('should expose exactly three properties', function ()
    {
        var keys = Object.keys(ScaleModes);
        expect(keys.length).toBe(3);
    });

    it('should have numeric values for all scale modes', function ()
    {
        expect(typeof ScaleModes.DEFAULT).toBe('number');
        expect(typeof ScaleModes.LINEAR).toBe('number');
        expect(typeof ScaleModes.NEAREST).toBe('number');
    });
});
