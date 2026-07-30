var Format = require('../../../src/utils/string/Format');

describe('Phaser.Utils.String.Format', function ()
{
    it('should replace a single marker with a string value', function ()
    {
        expect(Format('Hello %1', ['World'])).toBe('Hello World');
    });

    it('should replace multiple markers with array values', function ()
    {
        expect(Format('The %1 is worth %2 gold', ['Sword', 500])).toBe('The Sword is worth 500 gold');
    });

    it('should replace markers with numeric values', function ()
    {
        expect(Format('%1 + %2 = %3', [1, 2, 3])).toBe('1 + 2 = 3');
    });

    it('should replace markers in order using 1-based indexing', function ()
    {
        expect(Format('%1 %2 %3', ['a', 'b', 'c'])).toBe('a b c');
    });

    it('should return undefined for markers with no corresponding value', function ()
    {
        expect(Format('%1 and %2', ['only'])).toBe('only and undefined');
    });

    it('should return the string unchanged when no markers are present', function ()
    {
        expect(Format('no markers here', ['value'])).toBe('no markers here');
    });

    it('should handle an empty string', function ()
    {
        expect(Format('', ['value'])).toBe('');
    });

    it('should handle an empty values array', function ()
    {
        expect(Format('%1 %2', [])).toBe('undefined undefined');
    });

    it('should handle repeated use of the same marker', function ()
    {
        expect(Format('%1 and %1', ['echo'])).toBe('echo and echo');
    });

    it('should handle markers with numbers greater than 9', function ()
    {
        var values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
        expect(Format('%10 %11', values)).toBe('j k');
    });

    it('should handle boolean values in the array', function ()
    {
        expect(Format('flag is %1', [true])).toBe('flag is true');
    });

    it('should handle object values by calling toString', function ()
    {
        expect(Format('value is %1', [[1, 2, 3]])).toBe('value is 1,2,3');
    });

    it('should not replace text that looks like a marker mid-word if not matching pattern', function ()
    {
        expect(Format('100%', ['x'])).toBe('100%');
    });

    it('should replace %1 at the start of the string', function ()
    {
        expect(Format('%1 at the start', ['Value'])).toBe('Value at the start');
    });

    it('should replace %1 at the end of the string', function ()
    {
        expect(Format('at the end %1', ['Value'])).toBe('at the end Value');
    });
});
