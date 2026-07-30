var CONST = require('../../src/textures/const');

describe('const', function ()
{
    it('should be importable', function ()
    {
        expect(CONST).toBeDefined();
    });

    it('should define LINEAR as 0', function ()
    {
        expect(CONST.LINEAR).toBe(0);
    });

    it('should define NEAREST as 1', function ()
    {
        expect(CONST.NEAREST).toBe(1);
    });

    it('should have LINEAR and NEAREST as distinct values', function ()
    {
        expect(CONST.LINEAR).not.toBe(CONST.NEAREST);
    });

    it('should have LINEAR as a number', function ()
    {
        expect(typeof CONST.LINEAR).toBe('number');
    });

    it('should have NEAREST as a number', function ()
    {
        expect(typeof CONST.NEAREST).toBe('number');
    });

    it('should only export LINEAR and NEAREST', function ()
    {
        var keys = Object.keys(CONST);
        expect(keys.length).toBe(2);
        expect(keys).toContain('LINEAR');
        expect(keys).toContain('NEAREST');
    });
});
