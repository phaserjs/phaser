var Pad = require('../../../src/utils/string/Pad');

describe('Phaser.Utils.String.Pad', function ()
{
    it('should return the string unchanged when no length is specified', function ()
    {
        expect(Pad('hello')).toBe('hello');
    });

    it('should return the string unchanged when length is less than string length', function ()
    {
        expect(Pad('hello', 3)).toBe('hello');
    });

    it('should return the string unchanged when length equals string length', function ()
    {
        expect(Pad('hello', 5)).toBe('hello');
    });

    it('should pad both sides by default (dir=3)', function ()
    {
        expect(Pad('c64', 7, '*')).toBe('**c64**');
    });

    it('should pad the left side when dir=1', function ()
    {
        expect(Pad('bob', 6, '-', 1)).toBe('---bob');
    });

    it('should pad the right side when dir=2', function ()
    {
        expect(Pad('bob', 6, '-', 2)).toBe('bob---');
    });

    it('should pad both sides when dir=3', function ()
    {
        expect(Pad('bob', 7, '-', 3)).toBe('--bob--');
    });

    it('should pad numbers converted to strings on the left', function ()
    {
        expect(Pad(512, 6, '0', 1)).toBe('000512');
    });

    it('should pad numbers on the right', function ()
    {
        expect(Pad(512, 6, '0', 2)).toBe('512000');
    });

    it('should use space as default pad character', function ()
    {
        expect(Pad('hi', 5, undefined, 2)).toBe('hi   ');
    });

    it('should use both directions as default when dir is not specified', function ()
    {
        expect(Pad('hi', 6)).toBe('  hi  ');
    });

    it('should handle odd padding difference by placing extra pad on the right when dir=3', function ()
    {
        // length 6, string 'ab' (length 2), padlen=4, right=ceil(4/2)=2, left=2
        expect(Pad('ab', 6, '-', 3)).toBe('--ab--');
    });

    it('should handle odd total pad length favoring right side when dir=3', function ()
    {
        // length 6, string 'abc' (length 3), padlen=3, right=ceil(3/2)=2, left=1
        expect(Pad('abc', 6, '-', 3)).toBe('-abc--');
    });

    it('should handle single character string padded left', function ()
    {
        expect(Pad('x', 4, '0', 1)).toBe('000x');
    });

    it('should handle single character string padded right', function ()
    {
        expect(Pad('x', 4, '0', 2)).toBe('x000');
    });

    it('should handle single character string padded both sides', function ()
    {
        expect(Pad('x', 5, '-', 3)).toBe('--x--');
    });

    it('should convert number to string and pad', function ()
    {
        expect(Pad(7, 3, '0', 1)).toBe('007');
    });

    it('should convert object to string via toString', function ()
    {
        var obj = { toString: function () { return 'obj'; } };
        expect(Pad(obj, 5, '-', 2)).toBe('obj--');
    });

    it('should return an empty string padded to the requested length on the right', function ()
    {
        expect(Pad('', 3, 'x', 2)).toBe('xxx');
    });

    it('should return an empty string padded to the requested length on the left', function ()
    {
        expect(Pad('', 3, 'x', 1)).toBe('xxx');
    });

    it('should return an empty string padded on both sides', function ()
    {
        expect(Pad('', 4, 'x', 3)).toBe('xxxx');
    });

    it('should not pad when len is 0', function ()
    {
        expect(Pad('hello', 0)).toBe('hello');
    });

    it('should handle multi-character pad string', function ()
    {
        // Array(n).join('ab') repeats 'ab' (n-1) times
        expect(Pad('hi', 6, 'ab', 2)).toBe('hiabababab');
    });

    it('should handle dir=2 as right pad (default case in switch)', function ()
    {
        expect(Pad('test', 8, '.', 2)).toBe('test....');
    });

    it('should handle a zero number input', function ()
    {
        expect(Pad(0, 4, '0', 1)).toBe('0000');
    });
});
