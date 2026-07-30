var ORIENTATION_CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');

describe('ORIENTATION_CONST', function ()
{
    it('should export ORTHOGONAL as 0', function ()
    {
        expect(ORIENTATION_CONST.ORTHOGONAL).toBe(0);
    });

    it('should export ISOMETRIC as 1', function ()
    {
        expect(ORIENTATION_CONST.ISOMETRIC).toBe(1);
    });

    it('should export STAGGERED as 2', function ()
    {
        expect(ORIENTATION_CONST.STAGGERED).toBe(2);
    });

    it('should export HEXAGONAL as 3', function ()
    {
        expect(ORIENTATION_CONST.HEXAGONAL).toBe(3);
    });

    it('should have exactly four orientation constants', function ()
    {
        expect(Object.keys(ORIENTATION_CONST).length).toBe(4);
    });

    it('should have all unique values', function ()
    {
        var values = Object.values(ORIENTATION_CONST);
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have all numeric values', function ()
    {
        Object.values(ORIENTATION_CONST).forEach(function (value)
        {
            expect(typeof value).toBe('number');
        });
    });
});
