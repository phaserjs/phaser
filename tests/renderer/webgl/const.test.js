var WEBGL_CONST = require('../../../src/renderer/webgl/const');

describe('const', function ()
{
    it('should export an object', function ()
    {
        expect(typeof WEBGL_CONST).toBe('object');
    });

    it('should define BYTE with correct enum and size', function ()
    {
        expect(WEBGL_CONST.BYTE.enum).toBe(0x1400);
        expect(WEBGL_CONST.BYTE.size).toBe(1);
    });

    it('should define UNSIGNED_BYTE with correct enum and size', function ()
    {
        expect(WEBGL_CONST.UNSIGNED_BYTE.enum).toBe(0x1401);
        expect(WEBGL_CONST.UNSIGNED_BYTE.size).toBe(1);
    });

    it('should define SHORT with correct enum and size', function ()
    {
        expect(WEBGL_CONST.SHORT.enum).toBe(0x1402);
        expect(WEBGL_CONST.SHORT.size).toBe(2);
    });

    it('should define UNSIGNED_SHORT with correct enum and size', function ()
    {
        expect(WEBGL_CONST.UNSIGNED_SHORT.enum).toBe(0x1403);
        expect(WEBGL_CONST.UNSIGNED_SHORT.size).toBe(2);
    });

    it('should define INT with correct enum and size', function ()
    {
        expect(WEBGL_CONST.INT.enum).toBe(0x1404);
        expect(WEBGL_CONST.INT.size).toBe(4);
    });

    it('should define UNSIGNED_INT with correct enum and size', function ()
    {
        expect(WEBGL_CONST.UNSIGNED_INT.enum).toBe(0x1405);
        expect(WEBGL_CONST.UNSIGNED_INT.size).toBe(4);
    });

    it('should define FLOAT with correct enum and size', function ()
    {
        expect(WEBGL_CONST.FLOAT.enum).toBe(0x1406);
        expect(WEBGL_CONST.FLOAT.size).toBe(4);
    });

    it('should have exactly seven constants', function ()
    {
        expect(Object.keys(WEBGL_CONST).length).toBe(7);
    });

    it('should have sequential enum values starting at 0x1400', function ()
    {
        expect(WEBGL_CONST.BYTE.enum).toBe(0x1400);
        expect(WEBGL_CONST.UNSIGNED_BYTE.enum).toBe(WEBGL_CONST.BYTE.enum + 1);
        expect(WEBGL_CONST.SHORT.enum).toBe(WEBGL_CONST.BYTE.enum + 2);
        expect(WEBGL_CONST.UNSIGNED_SHORT.enum).toBe(WEBGL_CONST.BYTE.enum + 3);
        expect(WEBGL_CONST.INT.enum).toBe(WEBGL_CONST.BYTE.enum + 4);
        expect(WEBGL_CONST.UNSIGNED_INT.enum).toBe(WEBGL_CONST.BYTE.enum + 5);
        expect(WEBGL_CONST.FLOAT.enum).toBe(WEBGL_CONST.BYTE.enum + 6);
    });

    it('should have size of 1 for byte types', function ()
    {
        expect(WEBGL_CONST.BYTE.size).toBe(1);
        expect(WEBGL_CONST.UNSIGNED_BYTE.size).toBe(1);
    });

    it('should have size of 2 for short types', function ()
    {
        expect(WEBGL_CONST.SHORT.size).toBe(2);
        expect(WEBGL_CONST.UNSIGNED_SHORT.size).toBe(2);
    });

    it('should have size of 4 for int and float types', function ()
    {
        expect(WEBGL_CONST.INT.size).toBe(4);
        expect(WEBGL_CONST.UNSIGNED_INT.size).toBe(4);
        expect(WEBGL_CONST.FLOAT.size).toBe(4);
    });

    it('should have enum and size properties on each constant', function ()
    {
        var keys = Object.keys(WEBGL_CONST);

        for (var i = 0; i < keys.length; i++)
        {
            var entry = WEBGL_CONST[keys[i]];
            expect(typeof entry.enum).toBe('number');
            expect(typeof entry.size).toBe('number');
        }
    });
});
