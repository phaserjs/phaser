var ALIGN_CONST = require('../../../src/display/align/const');

describe('const', function ()
{
    it('should export an object', function ()
    {
        expect(typeof ALIGN_CONST).toBe('object');
    });

    it('should define TOP_LEFT as 0', function ()
    {
        expect(ALIGN_CONST.TOP_LEFT).toBe(0);
    });

    it('should define TOP_CENTER as 1', function ()
    {
        expect(ALIGN_CONST.TOP_CENTER).toBe(1);
    });

    it('should define TOP_RIGHT as 2', function ()
    {
        expect(ALIGN_CONST.TOP_RIGHT).toBe(2);
    });

    it('should define LEFT_TOP as 3', function ()
    {
        expect(ALIGN_CONST.LEFT_TOP).toBe(3);
    });

    it('should define LEFT_CENTER as 4', function ()
    {
        expect(ALIGN_CONST.LEFT_CENTER).toBe(4);
    });

    it('should define LEFT_BOTTOM as 5', function ()
    {
        expect(ALIGN_CONST.LEFT_BOTTOM).toBe(5);
    });

    it('should define CENTER as 6', function ()
    {
        expect(ALIGN_CONST.CENTER).toBe(6);
    });

    it('should define RIGHT_TOP as 7', function ()
    {
        expect(ALIGN_CONST.RIGHT_TOP).toBe(7);
    });

    it('should define RIGHT_CENTER as 8', function ()
    {
        expect(ALIGN_CONST.RIGHT_CENTER).toBe(8);
    });

    it('should define RIGHT_BOTTOM as 9', function ()
    {
        expect(ALIGN_CONST.RIGHT_BOTTOM).toBe(9);
    });

    it('should define BOTTOM_LEFT as 10', function ()
    {
        expect(ALIGN_CONST.BOTTOM_LEFT).toBe(10);
    });

    it('should define BOTTOM_CENTER as 11', function ()
    {
        expect(ALIGN_CONST.BOTTOM_CENTER).toBe(11);
    });

    it('should define BOTTOM_RIGHT as 12', function ()
    {
        expect(ALIGN_CONST.BOTTOM_RIGHT).toBe(12);
    });

    it('should have exactly 13 constants', function ()
    {
        expect(Object.keys(ALIGN_CONST).length).toBe(13);
    });

    it('should have all numeric values', function ()
    {
        Object.keys(ALIGN_CONST).forEach(function (key)
        {
            expect(typeof ALIGN_CONST[key]).toBe('number');
        });
    });

    it('should have unique values for all constants', function ()
    {
        var values = Object.values(ALIGN_CONST);
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have sequential values from 0 to 12', function ()
    {
        var values = Object.values(ALIGN_CONST).sort(function (a, b) { return a - b; });
        for (var i = 0; i < values.length; i++)
        {
            expect(values[i]).toBe(i);
        }
    });
});
