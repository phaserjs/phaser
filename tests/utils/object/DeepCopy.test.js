var DeepCopy = require('../../../src/utils/object/DeepCopy');

describe('Phaser.Utils.Objects.DeepCopy', function ()
{
    it('should return a number as-is', function ()
    {
        expect(DeepCopy(42)).toBe(42);
    });

    it('should return a string as-is', function ()
    {
        expect(DeepCopy('hello')).toBe('hello');
    });

    it('should return a boolean as-is', function ()
    {
        expect(DeepCopy(true)).toBe(true);
        expect(DeepCopy(false)).toBe(false);
    });

    it('should return null as-is', function ()
    {
        expect(DeepCopy(null)).toBeNull();
    });

    it('should return undefined as-is', function ()
    {
        expect(DeepCopy(undefined)).toBe(undefined);
    });

    it('should deep copy a flat object', function ()
    {
        var original = { a: 1, b: 2, c: 3 };
        var copy = DeepCopy(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
    });

    it('should deep copy a nested object', function ()
    {
        var original = { a: 1, b: { c: 2, d: 3 } };
        var copy = DeepCopy(original);

        expect(copy).toEqual(original);
        expect(copy.b).not.toBe(original.b);
    });

    it('should not modify the original object when the copy is mutated', function ()
    {
        var original = { a: 1, b: { c: 2 } };
        var copy = DeepCopy(original);

        copy.a = 99;
        copy.b.c = 99;

        expect(original.a).toBe(1);
        expect(original.b.c).toBe(2);
    });

    it('should deep copy a flat array', function ()
    {
        var original = [1, 2, 3];
        var copy = DeepCopy(original);

        expect(copy).toEqual(original);
        expect(copy).not.toBe(original);
        expect(Array.isArray(copy)).toBe(true);
    });

    it('should deep copy a nested array', function ()
    {
        var original = [1, [2, 3], [4, [5, 6]]];
        var copy = DeepCopy(original);

        expect(copy).toEqual(original);
        expect(copy[1]).not.toBe(original[1]);
        expect(copy[2][1]).not.toBe(original[2][1]);
    });

    it('should deep copy an object containing arrays', function ()
    {
        var original = { items: [1, 2, 3], nested: { values: [4, 5] } };
        var copy = DeepCopy(original);

        expect(copy).toEqual(original);
        expect(copy.items).not.toBe(original.items);
        expect(copy.nested.values).not.toBe(original.nested.values);
    });

    it('should deep copy an array containing objects', function ()
    {
        var original = [{ a: 1 }, { b: 2 }];
        var copy = DeepCopy(original);

        expect(copy).toEqual(original);
        expect(copy[0]).not.toBe(original[0]);
        expect(copy[1]).not.toBe(original[1]);
    });

    it('should handle an empty object', function ()
    {
        var original = {};
        var copy = DeepCopy(original);

        expect(copy).toEqual({});
        expect(copy).not.toBe(original);
    });

    it('should handle an empty array', function ()
    {
        var original = [];
        var copy = DeepCopy(original);

        expect(copy).toEqual([]);
        expect(copy).not.toBe(original);
        expect(Array.isArray(copy)).toBe(true);
    });

    it('should deep copy objects with mixed value types', function ()
    {
        var original = { num: 1, str: 'hello', bool: true, nil: null, arr: [1, 2], obj: { x: 10 } };
        var copy = DeepCopy(original);

        expect(copy.num).toBe(1);
        expect(copy.str).toBe('hello');
        expect(copy.bool).toBe(true);
        expect(copy.nil).toBeNull();
        expect(copy.arr).toEqual([1, 2]);
        expect(copy.arr).not.toBe(original.arr);
        expect(copy.obj).toEqual({ x: 10 });
        expect(copy.obj).not.toBe(original.obj);
    });

    it('should handle deeply nested structures', function ()
    {
        var original = { a: { b: { c: { d: { e: 42 } } } } };
        var copy = DeepCopy(original);

        expect(copy.a.b.c.d.e).toBe(42);
        expect(copy.a).not.toBe(original.a);
        expect(copy.a.b).not.toBe(original.a.b);
        expect(copy.a.b.c).not.toBe(original.a.b.c);
        expect(copy.a.b.c.d).not.toBe(original.a.b.c.d);
    });
});
