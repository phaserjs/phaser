var SCALE_MODE_CONST = require('../../../src/scale/const/SCALE_MODE_CONST');

describe('SCALE_MODE_CONST', function ()
{
    it('should export NONE as 0', function ()
    {
        expect(SCALE_MODE_CONST.NONE).toBe(0);
    });

    it('should export WIDTH_CONTROLS_HEIGHT as 1', function ()
    {
        expect(SCALE_MODE_CONST.WIDTH_CONTROLS_HEIGHT).toBe(1);
    });

    it('should export HEIGHT_CONTROLS_WIDTH as 2', function ()
    {
        expect(SCALE_MODE_CONST.HEIGHT_CONTROLS_WIDTH).toBe(2);
    });

    it('should export FIT as 3', function ()
    {
        expect(SCALE_MODE_CONST.FIT).toBe(3);
    });

    it('should export ENVELOP as 4', function ()
    {
        expect(SCALE_MODE_CONST.ENVELOP).toBe(4);
    });

    it('should export RESIZE as 5', function ()
    {
        expect(SCALE_MODE_CONST.RESIZE).toBe(5);
    });

    it('should export EXPAND as 6', function ()
    {
        expect(SCALE_MODE_CONST.EXPAND).toBe(6);
    });

    it('should have exactly 7 constants', function ()
    {
        expect(Object.keys(SCALE_MODE_CONST).length).toBe(7);
    });

    it('should have all unique values', function ()
    {
        var values = Object.values(SCALE_MODE_CONST);
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have all numeric values', function ()
    {
        Object.values(SCALE_MODE_CONST).forEach(function (value)
        {
            expect(typeof value).toBe('number');
        });
    });

    it('should have sequential values starting from 0', function ()
    {
        var values = Object.values(SCALE_MODE_CONST).sort(function (a, b) { return a - b; });
        for (var i = 0; i < values.length; i++)
        {
            expect(values[i]).toBe(i);
        }
    });
});
