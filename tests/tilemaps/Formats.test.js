var Formats = require('../../src/tilemaps/Formats');

describe('Formats', function ()
{
    it('should be importable', function ()
    {
        expect(Formats).toBeDefined();
    });

    it('should define CSV as 0', function ()
    {
        expect(Formats.CSV).toBe(0);
    });

    it('should define TILED_JSON as 1', function ()
    {
        expect(Formats.TILED_JSON).toBe(1);
    });

    it('should define ARRAY_2D as 2', function ()
    {
        expect(Formats.ARRAY_2D).toBe(2);
    });

    it('should define WELTMEISTER as 3', function ()
    {
        expect(Formats.WELTMEISTER).toBe(3);
    });

    it('should have exactly four format constants', function ()
    {
        expect(Object.keys(Formats).length).toBe(4);
    });

    it('should have unique values for all format constants', function ()
    {
        var values = Object.values(Formats);
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have numeric values for all format constants', function ()
    {
        Object.values(Formats).forEach(function (value)
        {
            expect(typeof value).toBe('number');
        });
    });
});
