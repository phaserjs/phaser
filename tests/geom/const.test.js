var GEOM_CONST = require('../../src/geom/const');

describe('const', function ()
{
    it('should export an object', function ()
    {
        expect(typeof GEOM_CONST).toBe('object');
    });

    it('should define CIRCLE as 0', function ()
    {
        expect(GEOM_CONST.CIRCLE).toBe(0);
    });

    it('should define ELLIPSE as 1', function ()
    {
        expect(GEOM_CONST.ELLIPSE).toBe(1);
    });

    it('should define LINE as 2', function ()
    {
        expect(GEOM_CONST.LINE).toBe(2);
    });

    it('should define POINT as 3', function ()
    {
        expect(GEOM_CONST.POINT).toBe(3);
    });

    it('should define POLYGON as 4', function ()
    {
        expect(GEOM_CONST.POLYGON).toBe(4);
    });

    it('should define RECTANGLE as 5', function ()
    {
        expect(GEOM_CONST.RECTANGLE).toBe(5);
    });

    it('should define TRIANGLE as 6', function ()
    {
        expect(GEOM_CONST.TRIANGLE).toBe(6);
    });

    it('should have exactly 7 constants', function ()
    {
        expect(Object.keys(GEOM_CONST).length).toBe(7);
    });

    it('should have all unique values', function ()
    {
        var values = Object.values(GEOM_CONST);
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have sequential integer values starting from 0', function ()
    {
        var values = Object.values(GEOM_CONST).sort(function (a, b) { return a - b; });
        for (var i = 0; i < values.length; i++)
        {
            expect(values[i]).toBe(i);
        }
    });
});
