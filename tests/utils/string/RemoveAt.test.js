var RemoveAt = require('../../../src/utils/string/RemoveAt');

describe('Phaser.Utils.String.RemoveAt', function ()
{
    it('should remove the first character when index is 0', function ()
    {
        expect(RemoveAt('hello', 0)).toBe('ello');
    });

    it('should remove the last character when index is length minus one', function ()
    {
        expect(RemoveAt('hello', 4)).toBe('hell');
    });

    it('should remove a middle character', function ()
    {
        expect(RemoveAt('hello', 2)).toBe('helo');
    });

    it('should return an empty string when removing the only character', function ()
    {
        expect(RemoveAt('a', 0)).toBe('');
    });

    it('should remove a character from a two-character string at index 0', function ()
    {
        expect(RemoveAt('ab', 0)).toBe('b');
    });

    it('should remove a character from a two-character string at index 1', function ()
    {
        expect(RemoveAt('ab', 1)).toBe('a');
    });

    it('should handle strings with spaces', function ()
    {
        expect(RemoveAt('hello world', 5)).toBe('helloworld');
    });

    it('should handle numeric characters in strings', function ()
    {
        expect(RemoveAt('abc123', 3)).toBe('abc23');
    });

    it('should handle special characters', function ()
    {
        expect(RemoveAt('a!b', 1)).toBe('ab');
    });

    it('should return the original string minus the character at a given index', function ()
    {
        var str = 'phaser';
        expect(RemoveAt(str, 1)).toBe('paser');
    });

    it('should not modify the original string reference', function ()
    {
        var str = 'hello';
        RemoveAt(str, 0);
        expect(str).toBe('hello');
    });
});
