var MergeRight = require('../../../src/utils/object/MergeRight');

describe('Phaser.Utils.Objects.MergeRight', function ()
{
    it('should return a new object with values from obj1', function ()
    {
        var obj1 = { a: 1, b: 2 };
        var obj2 = {};
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
    });

    it('should overwrite obj1 keys with values from obj2 when keys match', function ()
    {
        var obj1 = { a: 1, b: 2 };
        var obj2 = { a: 10, b: 20 };
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(10);
        expect(result.b).toBe(20);
    });

    it('should ignore keys in obj2 that do not exist in obj1', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { a: 99, b: 42, c: 'hello' };
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(99);
        expect(result.hasOwnProperty('b')).toBe(false);
        expect(result.hasOwnProperty('c')).toBe(false);
    });

    it('should not modify the original obj1', function ()
    {
        var obj1 = { a: 1, b: 2 };
        var obj2 = { a: 99 };
        MergeRight(obj1, obj2);

        expect(obj1.a).toBe(1);
        expect(obj1.b).toBe(2);
    });

    it('should not modify the original obj2', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { a: 99, x: 100 };
        MergeRight(obj1, obj2);

        expect(obj2.a).toBe(99);
        expect(obj2.x).toBe(100);
    });

    it('should return a new object distinct from obj1 and obj2', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { a: 2 };
        var result = MergeRight(obj1, obj2);

        expect(result).not.toBe(obj1);
        expect(result).not.toBe(obj2);
    });

    it('should handle obj2 with no matching keys', function ()
    {
        var obj1 = { a: 1, b: 2 };
        var obj2 = { x: 10, y: 20 };
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
        expect(result.hasOwnProperty('x')).toBe(false);
        expect(result.hasOwnProperty('y')).toBe(false);
    });

    it('should handle empty obj1', function ()
    {
        var obj1 = {};
        var obj2 = { a: 1, b: 2 };
        var result = MergeRight(obj1, obj2);

        expect(result.hasOwnProperty('a')).toBe(false);
        expect(result.hasOwnProperty('b')).toBe(false);
    });

    it('should handle empty obj2', function ()
    {
        var obj1 = { a: 1, b: 2 };
        var obj2 = {};
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
    });

    it('should handle both objects empty', function ()
    {
        var result = MergeRight({}, {});

        expect(Object.keys(result).length).toBe(0);
    });

    it('should overwrite with falsy values from obj2', function ()
    {
        var obj1 = { a: 1, b: true, c: 'hello', d: 42 };
        var obj2 = { a: 0, b: false, c: '', d: null };
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(0);
        expect(result.b).toBe(false);
        expect(result.c).toBe('');
        expect(result.d).toBeNull();
    });

    it('should overwrite with string values', function ()
    {
        var obj1 = { name: 'Alice' };
        var obj2 = { name: 'Bob' };
        var result = MergeRight(obj1, obj2);

        expect(result.name).toBe('Bob');
    });

    it('should partially overwrite when obj2 only has some matching keys', function ()
    {
        var obj1 = { a: 1, b: 2, c: 3 };
        var obj2 = { a: 10, c: 30 };
        var result = MergeRight(obj1, obj2);

        expect(result.a).toBe(10);
        expect(result.b).toBe(2);
        expect(result.c).toBe(30);
    });

    it('should copy object references from obj2 when overwriting', function ()
    {
        var inner = { x: 99 };
        var obj1 = { nested: { x: 1 } };
        var obj2 = { nested: inner };
        var result = MergeRight(obj1, obj2);

        expect(result.nested).toBe(inner);
    });
});
