var Reverse = require('../../../src/utils/string/Reverse');

describe('Phaser.Utils.String.Reverse', function ()
{
    it('should reverse a simple string', function ()
    {
        expect(Reverse('hello')).toBe('olleh');
    });

    it('should reverse the example from the docs', function ()
    {
        expect(Reverse('Atari 520ST')).toBe('TS025 iratA');
    });

    it('should return an empty string when given an empty string', function ()
    {
        expect(Reverse('')).toBe('');
    });

    it('should return a single character unchanged', function ()
    {
        expect(Reverse('a')).toBe('a');
    });

    it('should return a palindrome unchanged', function ()
    {
        expect(Reverse('racecar')).toBe('racecar');
        expect(Reverse('madam')).toBe('madam');
    });

    it('should reverse a string with spaces', function ()
    {
        expect(Reverse('hello world')).toBe('dlrow olleh');
    });

    it('should reverse a string with numbers', function ()
    {
        expect(Reverse('12345')).toBe('54321');
    });

    it('should reverse a string with special characters', function ()
    {
        expect(Reverse('!@#$%')).toBe('%$#@!');
    });

    it('should preserve case when reversing', function ()
    {
        expect(Reverse('AbCdEf')).toBe('fEdCbA');
    });

    it('should reverse a string with mixed alphanumeric content', function ()
    {
        expect(Reverse('abc123')).toBe('321cba');
    });

    it('should return a string type', function ()
    {
        expect(typeof Reverse('test')).toBe('string');
    });
});
