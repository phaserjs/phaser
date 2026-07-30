var ORIENTATION_CONST = require('../../../src/scale/const/ORIENTATION_CONST');

describe('ORIENTATION_CONST', function ()
{
    it('should export a LANDSCAPE constant with the correct value', function ()
    {
        expect(ORIENTATION_CONST.LANDSCAPE).toBe('landscape-primary');
    });

    it('should export a LANDSCAPE_SECONDARY constant with the correct value', function ()
    {
        expect(ORIENTATION_CONST.LANDSCAPE_SECONDARY).toBe('landscape-secondary');
    });

    it('should export a PORTRAIT constant with the correct value', function ()
    {
        expect(ORIENTATION_CONST.PORTRAIT).toBe('portrait-primary');
    });

    it('should export a PORTRAIT_SECONDARY constant with the correct value', function ()
    {
        expect(ORIENTATION_CONST.PORTRAIT_SECONDARY).toBe('portrait-secondary');
    });

    it('should export exactly four orientation constants', function ()
    {
        expect(Object.keys(ORIENTATION_CONST).length).toBe(4);
    });

    it('should have string type values for all constants', function ()
    {
        expect(typeof ORIENTATION_CONST.LANDSCAPE).toBe('string');
        expect(typeof ORIENTATION_CONST.LANDSCAPE_SECONDARY).toBe('string');
        expect(typeof ORIENTATION_CONST.PORTRAIT).toBe('string');
        expect(typeof ORIENTATION_CONST.PORTRAIT_SECONDARY).toBe('string');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            ORIENTATION_CONST.LANDSCAPE,
            ORIENTATION_CONST.LANDSCAPE_SECONDARY,
            ORIENTATION_CONST.PORTRAIT,
            ORIENTATION_CONST.PORTRAIT_SECONDARY
        ];
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have landscape constants containing the word landscape', function ()
    {
        expect(ORIENTATION_CONST.LANDSCAPE).toContain('landscape');
        expect(ORIENTATION_CONST.LANDSCAPE_SECONDARY).toContain('landscape');
    });

    it('should have portrait constants containing the word portrait', function ()
    {
        expect(ORIENTATION_CONST.PORTRAIT).toContain('portrait');
        expect(ORIENTATION_CONST.PORTRAIT_SECONDARY).toContain('portrait');
    });
});
