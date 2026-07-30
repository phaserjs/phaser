var RETRO_FONT_CONST = require('../../../src/gameobjects/bitmaptext/const');

describe('const', function ()
{
    it('should export an object', function ()
    {
        expect(typeof RETRO_FONT_CONST).toBe('object');
    });

    it('should define TEXT_SET1 as a string containing full printable ASCII range', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET1).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET1).toBe(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~');
    });

    it('should define TEXT_SET2 as a string containing space through uppercase Z', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET2).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET2).toBe(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    });

    it('should define TEXT_SET3 as uppercase letters followed by digits and a trailing space', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET3).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET3).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ');
    });

    it('should define TEXT_SET4 as uppercase letters, a space, then digits', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET4).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET4).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789');
    });

    it('should define TEXT_SET5 as uppercase letters followed by punctuation and digits', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET5).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET5).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() \'!?-*:0123456789');
    });

    it('should define TEXT_SET6 as uppercase letters, digits, and punctuation with trailing space', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET6).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET6).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789"(),-.\' ');
    });

    it('should define TEXT_SET7 as an interleaved character set', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET7).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET7).toBe('AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW")28FLRX-\'39');
    });

    it('should define TEXT_SET8 as digits first followed by letters', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET8).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET8).toBe('0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    });

    it('should define TEXT_SET9 as uppercase letters with parentheses, hyphen, digits, and punctuation', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET9).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET9).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,\'"?!');
    });

    it('should define TEXT_SET10 as only the 26 uppercase letters', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET10).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET10).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        expect(RETRO_FONT_CONST.TEXT_SET10.length).toBe(26);
    });

    it('should define TEXT_SET11 as uppercase letters with punctuation and digits', function ()
    {
        expect(typeof RETRO_FONT_CONST.TEXT_SET11).toBe('string');
        expect(RETRO_FONT_CONST.TEXT_SET11).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ.,"-+!?()\':;0123456789');
    });

    it('should have exactly 11 TEXT_SET properties', function ()
    {
        var keys = Object.keys(RETRO_FONT_CONST).filter(function (k)
        {
            return k.indexOf('TEXT_SET') === 0;
        });
        expect(keys.length).toBe(11);
    });

    it('TEXT_SET1 should contain lowercase letters', function ()
    {
        expect(RETRO_FONT_CONST.TEXT_SET1.indexOf('a')).toBeGreaterThan(-1);
        expect(RETRO_FONT_CONST.TEXT_SET1.indexOf('z')).toBeGreaterThan(-1);
    });

    it('TEXT_SET2 should not contain lowercase letters', function ()
    {
        expect(RETRO_FONT_CONST.TEXT_SET2.indexOf('a')).toBe(-1);
        expect(RETRO_FONT_CONST.TEXT_SET2.indexOf('z')).toBe(-1);
    });

    it('TEXT_SET10 should not contain digits or spaces', function ()
    {
        expect(RETRO_FONT_CONST.TEXT_SET10.indexOf('0')).toBe(-1);
        expect(RETRO_FONT_CONST.TEXT_SET10.indexOf(' ')).toBe(-1);
    });

    it('TEXT_SET3 space should be at the end, TEXT_SET4 space should be in the middle', function ()
    {
        var set3 = RETRO_FONT_CONST.TEXT_SET3;
        var set4 = RETRO_FONT_CONST.TEXT_SET4;

        expect(set3[set3.length - 1]).toBe(' ');
        expect(set4.indexOf(' ')).toBe(26);
        expect(set4[set4.length - 1]).not.toBe(' ');
    });
});
