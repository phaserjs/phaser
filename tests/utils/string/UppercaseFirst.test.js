var UppercaseFirst = require('../../../src/utils/string/UppercaseFirst');

describe('Phaser.Utils.String.UppercaseFirst', function ()
{
    it('should capitalize the first letter of a lowercase string', function ()
    {
        expect(UppercaseFirst('abc')).toBe('Abc');
    });

    it('should capitalize the first word of a sentence', function ()
    {
        expect(UppercaseFirst('the happy family')).toBe('The happy family');
    });

    it('should return an empty string when given an empty string', function ()
    {
        expect(UppercaseFirst('')).toBe('');
    });

    it('should leave an already capitalized string unchanged', function ()
    {
        expect(UppercaseFirst('Hello')).toBe('Hello');
    });

    it('should capitalize a single lowercase letter', function ()
    {
        expect(UppercaseFirst('a')).toBe('A');
    });

    it('should return a single uppercase letter unchanged', function ()
    {
        expect(UppercaseFirst('A')).toBe('A');
    });

    it('should only capitalize the first letter and leave the rest unchanged', function ()
    {
        expect(UppercaseFirst('hELLO')).toBe('HELLO');
    });

    it('should handle strings that start with a number', function ()
    {
        expect(UppercaseFirst('123abc')).toBe('123abc');
    });

    it('should handle strings that start with a space', function ()
    {
        expect(UppercaseFirst(' hello')).toBe(' hello');
    });

    it('should handle strings with only uppercase letters', function ()
    {
        expect(UppercaseFirst('HELLO')).toBe('HELLO');
    });

    it('should handle a string with a single space', function ()
    {
        expect(UppercaseFirst(' ')).toBe(' ');
    });

    it('should handle strings starting with a special character', function ()
    {
        expect(UppercaseFirst('!hello')).toBe('!hello');
    });
});
