var ParseRichText = require('../../../src/gameobjects/bitmaptext/RichTextParser');

describe('RichTextParser', function ()
{
    test('plain text without tags is a single unstyled segment', function ()
    {
        expect(ParseRichText('Hello world')).toEqual([
            { text: 'Hello world' }
        ]);
    });

    test('a styled run between plain runs', function ()
    {
        expect(ParseRichText('a[x]b[/x]c')).toEqual([
            { text: 'a' },
            { text: 'b', style: 'x' },
            { text: 'c' }
        ]);
    });

    test('an unclosed tag styles the rest of the text', function ()
    {
        expect(ParseRichText('a[x]bc')).toEqual([
            { text: 'a' },
            { text: 'bc', style: 'x' }
        ]);
    });

    test('a mismatched closing tag warns and resets the style', function ()
    {
        var warn = vi.spyOn(console, 'warn').mockImplementation(function () {});

        expect(ParseRichText('[x]a[/y]b')).toEqual([
            { text: 'a', style: 'x' },
            { text: 'b' }
        ]);

        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('[x]a[/y]b'));

        warn.mockRestore();
    });

    test('an unmatched closing tag is ignored, with a warning', function ()
    {
        var warn = vi.spyOn(console, 'warn').mockImplementation(function () {});

        expect(ParseRichText('a[/x]b')).toEqual([
            { text: 'ab' }
        ]);

        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('a[/x]b'));

        warn.mockRestore();
    });

    test('adjacent styled runs', function ()
    {
        expect(ParseRichText('a[x]b[/x][y]c[/y]d')).toEqual([
            { text: 'a' },
            { text: 'b', style: 'x' },
            { text: 'c', style: 'y' },
            { text: 'd' }
        ]);
    });

    test('a bracket without a closing bracket warns and drops the rest', function ()
    {
        var warn = vi.spyOn(console, 'warn').mockImplementation(function () {});

        expect(ParseRichText('a[b')).toEqual([
            { text: 'a' }
        ]);

        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('a[b'));

        warn.mockRestore();
    });

    test('a bracket as the very last character warns and is dropped', function ()
    {
        var warn = vi.spyOn(console, 'warn').mockImplementation(function () {});

        expect(ParseRichText('ab[')).toEqual([
            { text: 'ab' }
        ]);

        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('ab['));

        warn.mockRestore();
    });

    test('empty runs are not emitted', function ()
    {
        expect(ParseRichText('[x][/x]')).toEqual([]);
        expect(ParseRichText('')).toEqual([]);
    });

    test('escaped open bracket is a literal bracket', function ()
    {
        expect(ParseRichText('a[[b')).toEqual([
            { text: 'a[b' }
        ]);
    });

    test('escaped close bracket is a literal bracket', function ()
    {
        expect(ParseRichText('a]]b')).toEqual([
            { text: 'a]b' }
        ]);
    });

    test('a stray close bracket warns and is dropped', function ()
    {
        var warn = vi.spyOn(console, 'warn').mockImplementation(function () {});

        expect(ParseRichText('a]b')).toEqual([
            { text: 'ab' }
        ]);

        expect(warn).toHaveBeenCalledOnce();
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('a]b'));

        warn.mockRestore();
    });

    test('newlines pass through unchanged', function ()
    {
        expect(ParseRichText('a\n[x]b\nc[/x]')).toEqual([
            { text: 'a\n' },
            { text: 'b\nc', style: 'x' }
        ]);
    });
});
