var Pick = require('../../../src/utils/object/Pick');

describe('Phaser.Utils.Objects.Pick', function ()
{
    it('should return a new object with only the specified keys', function ()
    {
        var obj = { a: 1, b: 2, c: 3 };
        var result = Pick(obj, ['a', 'b']);

        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should return an empty object when no keys match', function ()
    {
        var obj = { a: 1, b: 2 };
        var result = Pick(obj, ['x', 'y']);

        expect(result).toEqual({});
    });

    it('should return an empty object when keys array is empty', function ()
    {
        var obj = { a: 1, b: 2 };
        var result = Pick(obj, []);

        expect(result).toEqual({});
    });

    it('should only include keys that exist on the object', function ()
    {
        var obj = { a: 1, b: 2 };
        var result = Pick(obj, ['a', 'z']);

        expect(result).toEqual({ a: 1 });
    });

    it('should return a new object, not the original', function ()
    {
        var obj = { a: 1, b: 2 };
        var result = Pick(obj, ['a', 'b']);

        expect(result).not.toBe(obj);
    });

    it('should handle keys with falsy values', function ()
    {
        var obj = { a: 0, b: false, c: null, d: '' };
        var result = Pick(obj, ['a', 'b', 'c', 'd']);

        expect(result).toEqual({ a: 0, b: false, c: null, d: '' });
    });

    it('should handle nested object values', function ()
    {
        var nested = { x: 1 };
        var obj = { a: nested, b: 2 };
        var result = Pick(obj, ['a']);

        expect(result.a).toBe(nested);
    });

    it('should handle all keys present on the object', function ()
    {
        var obj = { a: 1, b: 2, c: 3 };
        var result = Pick(obj, ['a', 'b', 'c']);

        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should not include inherited properties', function ()
    {
        var parent = { inherited: 42 };
        var obj = Object.create(parent);
        obj.own = 1;

        var result = Pick(obj, ['own', 'inherited']);

        expect(result).toEqual({ own: 1 });
        expect(result.inherited).toBeUndefined();
    });

    it('should handle duplicate keys in the keys array', function ()
    {
        var obj = { a: 1, b: 2 };
        var result = Pick(obj, ['a', 'a']);

        expect(result).toEqual({ a: 1 });
    });

    it('should handle array values on the object', function ()
    {
        var arr = [1, 2, 3];
        var obj = { a: arr, b: 2 };
        var result = Pick(obj, ['a']);

        expect(result.a).toBe(arr);
    });

    it('should handle a single key', function ()
    {
        var obj = { a: 1, b: 2, c: 3 };
        var result = Pick(obj, ['b']);

        expect(result).toEqual({ b: 2 });
    });
});
