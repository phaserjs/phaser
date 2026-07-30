var CENTER_CONST = require('../../../src/scale/const/CENTER_CONST');

describe('CENTER_CONST', function ()
{
    it('should be importable', function ()
    {
        expect(CENTER_CONST).toBeDefined();
    });

    it('should have NO_CENTER equal to 0', function ()
    {
        expect(CENTER_CONST.NO_CENTER).toBe(0);
    });

    it('should have CENTER_BOTH equal to 1', function ()
    {
        expect(CENTER_CONST.CENTER_BOTH).toBe(1);
    });

    it('should have CENTER_HORIZONTALLY equal to 2', function ()
    {
        expect(CENTER_CONST.CENTER_HORIZONTALLY).toBe(2);
    });

    it('should have CENTER_VERTICALLY equal to 3', function ()
    {
        expect(CENTER_CONST.CENTER_VERTICALLY).toBe(3);
    });

    it('should have exactly four constants', function ()
    {
        expect(Object.keys(CENTER_CONST).length).toBe(4);
    });

    it('should have all constants as numbers', function ()
    {
        expect(typeof CENTER_CONST.NO_CENTER).toBe('number');
        expect(typeof CENTER_CONST.CENTER_BOTH).toBe('number');
        expect(typeof CENTER_CONST.CENTER_HORIZONTALLY).toBe('number');
        expect(typeof CENTER_CONST.CENTER_VERTICALLY).toBe('number');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            CENTER_CONST.NO_CENTER,
            CENTER_CONST.CENTER_BOTH,
            CENTER_CONST.CENTER_HORIZONTALLY,
            CENTER_CONST.CENTER_VERTICALLY
        ];
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have constants with sequential integer values starting from 0', function ()
    {
        expect(CENTER_CONST.NO_CENTER).toBe(0);
        expect(CENTER_CONST.CENTER_BOTH).toBe(CENTER_CONST.NO_CENTER + 1);
        expect(CENTER_CONST.CENTER_HORIZONTALLY).toBe(CENTER_CONST.CENTER_BOTH + 1);
        expect(CENTER_CONST.CENTER_VERTICALLY).toBe(CENTER_CONST.CENTER_HORIZONTALLY + 1);
    });
});
