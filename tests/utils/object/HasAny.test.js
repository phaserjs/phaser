var HasAny = require('../../../src/utils/object/HasAny');

describe('Phaser.Utils.Objects.HasAny', function ()
{
    it('should return true when the object contains one of the keys', function ()
    {
        var source = { a: 1, b: 2, c: 3 };
        expect(HasAny(source, ['a'])).toBe(true);
    });

    it('should return true when the object contains multiple of the requested keys', function ()
    {
        var source = { a: 1, b: 2, c: 3 };
        expect(HasAny(source, ['a', 'b'])).toBe(true);
    });

    it('should return true when only one of the requested keys exists', function ()
    {
        var source = { a: 1 };
        expect(HasAny(source, ['x', 'y', 'a'])).toBe(true);
    });

    it('should return false when none of the keys exist on the object', function ()
    {
        var source = { a: 1, b: 2 };
        expect(HasAny(source, ['x', 'y', 'z'])).toBe(false);
    });

    it('should return false when the keys array is empty', function ()
    {
        var source = { a: 1, b: 2 };
        expect(HasAny(source, [])).toBe(false);
    });

    it('should return false when the source object is empty', function ()
    {
        var source = {};
        expect(HasAny(source, ['a', 'b'])).toBe(false);
    });

    it('should return false when both source and keys are empty', function ()
    {
        expect(HasAny({}, [])).toBe(false);
    });

    it('should return true when the key exists with a falsy value', function ()
    {
        var source = { a: 0, b: null, c: false, d: undefined };
        expect(HasAny(source, ['a'])).toBe(true);
        expect(HasAny(source, ['b'])).toBe(true);
        expect(HasAny(source, ['c'])).toBe(true);
        expect(HasAny(source, ['d'])).toBe(true);
    });

    it('should not find keys from the prototype chain', function ()
    {
        var source = Object.create({ inherited: true });
        expect(HasAny(source, ['inherited'])).toBe(false);
    });

    it('should find own properties even when prototype has same key', function ()
    {
        var source = Object.create({ shared: 'proto' });
        source.shared = 'own';
        expect(HasAny(source, ['shared'])).toBe(true);
    });

    it('should return true on first matching key without checking the rest', function ()
    {
        var source = { x: 10 };
        expect(HasAny(source, ['x', 'y', 'z'])).toBe(true);
    });

    it('should handle numeric string keys', function ()
    {
        var source = { '0': 'zero', '1': 'one' };
        expect(HasAny(source, ['0'])).toBe(true);
        expect(HasAny(source, ['2'])).toBe(false);
    });
});
