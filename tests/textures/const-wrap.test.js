var CONST = require('../../src/textures/const-wrap');

describe('const-wrap', function ()
{
    it('should export an object', function ()
    {
        expect(typeof CONST).toBe('object');
    });

    it('should define CLAMP_TO_EDGE as 33071', function ()
    {
        expect(CONST.CLAMP_TO_EDGE).toBe(33071);
    });

    it('should define REPEAT as 10497', function ()
    {
        expect(CONST.REPEAT).toBe(10497);
    });

    it('should define MIRRORED_REPEAT as 33648', function ()
    {
        expect(CONST.MIRRORED_REPEAT).toBe(33648);
    });

    it('should have exactly three properties', function ()
    {
        expect(Object.keys(CONST).length).toBe(3);
    });

    it('should have all values as numbers', function ()
    {
        expect(typeof CONST.CLAMP_TO_EDGE).toBe('number');
        expect(typeof CONST.REPEAT).toBe('number');
        expect(typeof CONST.MIRRORED_REPEAT).toBe('number');
    });

    it('should have unique values for each wrap mode', function ()
    {
        var values = [CONST.CLAMP_TO_EDGE, CONST.REPEAT, CONST.MIRRORED_REPEAT];
        var unique = new Set(values);
        expect(unique.size).toBe(3);
    });
});
