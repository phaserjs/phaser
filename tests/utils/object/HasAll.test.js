var HasAll = require('../../../src/utils/object/HasAll');

describe('Phaser.Utils.Objects.HasAll', function ()
{
    it('should return true when object contains all specified keys', function ()
    {
        var source = { a: 1, b: 2, c: 3 };

        expect(HasAll(source, ['a', 'b', 'c'])).toBe(true);
    });

    it('should return true when keys array is empty', function ()
    {
        var source = { a: 1 };

        expect(HasAll(source, [])).toBe(true);
    });

    it('should return false when object is missing one key', function ()
    {
        var source = { a: 1, b: 2 };

        expect(HasAll(source, ['a', 'b', 'c'])).toBe(false);
    });

    it('should return false when object is missing all keys', function ()
    {
        var source = {};

        expect(HasAll(source, ['a', 'b', 'c'])).toBe(false);
    });

    it('should return false when checking a single missing key', function ()
    {
        var source = { a: 1 };

        expect(HasAll(source, ['b'])).toBe(false);
    });

    it('should return true when checking a single present key', function ()
    {
        var source = { a: 1 };

        expect(HasAll(source, ['a'])).toBe(true);
    });

    it('should return true when object has more keys than requested', function ()
    {
        var source = { a: 1, b: 2, c: 3, d: 4, e: 5 };

        expect(HasAll(source, ['a', 'c'])).toBe(true);
    });

    it('should return true for keys with falsy values', function ()
    {
        var source = { a: 0, b: null, c: false, d: '' };

        expect(HasAll(source, ['a', 'b', 'c', 'd'])).toBe(true);
    });

    it('should return true for keys with undefined values', function ()
    {
        var source = { a: undefined };

        expect(HasAll(source, ['a'])).toBe(true);
    });

    it('should not find keys from prototype chain', function ()
    {
        var source = Object.create({ inherited: true });

        expect(HasAll(source, ['inherited'])).toBe(false);
    });

    it('should return true for own properties not on prototype', function ()
    {
        var source = Object.create({ inherited: true });
        source.own = 42;

        expect(HasAll(source, ['own'])).toBe(true);
    });

    it('should handle numeric string keys', function ()
    {
        var source = { '0': 'zero', '1': 'one' };

        expect(HasAll(source, ['0', '1'])).toBe(true);
        expect(HasAll(source, ['0', '2'])).toBe(false);
    });
});
