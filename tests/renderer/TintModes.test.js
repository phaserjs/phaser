var TintModes = require('../../src/renderer/TintModes');

describe('TintModes', function ()
{
    it('should export MULTIPLY as 0', function ()
    {
        expect(TintModes.MULTIPLY).toBe(0);
    });

    it('should export FILL as 1', function ()
    {
        expect(TintModes.FILL).toBe(1);
    });

    it('should export ADD as 2', function ()
    {
        expect(TintModes.ADD).toBe(2);
    });

    it('should export SCREEN as 4', function ()
    {
        expect(TintModes.SCREEN).toBe(4);
    });

    it('should export OVERLAY as 5', function ()
    {
        expect(TintModes.OVERLAY).toBe(5);
    });

    it('should export HARD_LIGHT as 6', function ()
    {
        expect(TintModes.HARD_LIGHT).toBe(6);
    });

    it('should not export SUBTRACT', function ()
    {
        expect(TintModes.SUBTRACT).toBeUndefined();
    });

    it('should have numeric values for all exported modes', function ()
    {
        expect(typeof TintModes.MULTIPLY).toBe('number');
        expect(typeof TintModes.FILL).toBe('number');
        expect(typeof TintModes.ADD).toBe('number');
        expect(typeof TintModes.SCREEN).toBe('number');
        expect(typeof TintModes.OVERLAY).toBe('number');
        expect(typeof TintModes.HARD_LIGHT).toBe('number');
    });

    it('should have unique values for all exported modes', function ()
    {
        var values = [
            TintModes.MULTIPLY,
            TintModes.FILL,
            TintModes.ADD,
            TintModes.SCREEN,
            TintModes.OVERLAY,
            TintModes.HARD_LIGHT
        ];

        var unique = new Set(values);

        expect(unique.size).toBe(values.length);
    });
});
