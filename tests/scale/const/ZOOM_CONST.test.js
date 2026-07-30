var ZOOM_CONST = require('../../../src/scale/const/ZOOM_CONST');

describe('ZOOM_CONST', function ()
{
    it('should be importable', function ()
    {
        expect(ZOOM_CONST).toBeDefined();
    });

    it('should define NO_ZOOM as 1', function ()
    {
        expect(ZOOM_CONST.NO_ZOOM).toBe(1);
    });

    it('should define ZOOM_2X as 2', function ()
    {
        expect(ZOOM_CONST.ZOOM_2X).toBe(2);
    });

    it('should define ZOOM_4X as 4', function ()
    {
        expect(ZOOM_CONST.ZOOM_4X).toBe(4);
    });

    it('should define MAX_ZOOM as -1', function ()
    {
        expect(ZOOM_CONST.MAX_ZOOM).toBe(-1);
    });

    it('should export exactly four constants', function ()
    {
        expect(Object.keys(ZOOM_CONST).length).toBe(4);
    });

    it('should have numeric values for all constants', function ()
    {
        expect(typeof ZOOM_CONST.NO_ZOOM).toBe('number');
        expect(typeof ZOOM_CONST.ZOOM_2X).toBe('number');
        expect(typeof ZOOM_CONST.ZOOM_4X).toBe('number');
        expect(typeof ZOOM_CONST.MAX_ZOOM).toBe('number');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            ZOOM_CONST.NO_ZOOM,
            ZOOM_CONST.ZOOM_2X,
            ZOOM_CONST.ZOOM_4X,
            ZOOM_CONST.MAX_ZOOM
        ];
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have ZOOM_2X double the value of NO_ZOOM', function ()
    {
        expect(ZOOM_CONST.ZOOM_2X).toBe(ZOOM_CONST.NO_ZOOM * 2);
    });

    it('should have ZOOM_4X double the value of ZOOM_2X', function ()
    {
        expect(ZOOM_CONST.ZOOM_4X).toBe(ZOOM_CONST.ZOOM_2X * 2);
    });

    it('should have MAX_ZOOM as a negative value', function ()
    {
        expect(ZOOM_CONST.MAX_ZOOM).toBeLessThan(0);
    });
});
