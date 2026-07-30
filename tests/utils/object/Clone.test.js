var Clone = require('../../../src/utils/object/Clone');

describe('Phaser.Utils.Objects.Clone', function ()
{
    it('should return a new object', function ()
    {
        var obj = { a: 1 };
        var result = Clone(obj);

        expect(result).not.toBe(obj);
    });

    it('should clone primitive properties', function ()
    {
        var obj = { a: 1, b: 'hello', c: true, d: null };
        var result = Clone(obj);

        expect(result.a).toBe(1);
        expect(result.b).toBe('hello');
        expect(result.c).toBe(true);
        expect(result.d).toBeNull();
    });

    it('should return an empty object when given an empty object', function ()
    {
        var result = Clone({});

        expect(Object.keys(result).length).toBe(0);
    });

    it('should shallow clone array properties as new array instances', function ()
    {
        var arr = [1, 2, 3];
        var obj = { items: arr };
        var result = Clone(obj);

        expect(result.items).not.toBe(arr);
        expect(result.items).toEqual([1, 2, 3]);
    });

    it('should not affect the original object when modifying the clone', function ()
    {
        var obj = { a: 1, b: 2 };
        var result = Clone(obj);

        result.a = 99;

        expect(obj.a).toBe(1);
    });

    it('should share the same reference for nested objects (shallow clone)', function ()
    {
        var nested = { x: 10 };
        var obj = { child: nested };
        var result = Clone(obj);

        expect(result.child).toBe(nested);
    });

    it('should copy all enumerable properties', function ()
    {
        var obj = { x: 1, y: 2, z: 3 };
        var result = Clone(obj);

        expect(Object.keys(result).length).toBe(3);
        expect(result.x).toBe(1);
        expect(result.y).toBe(2);
        expect(result.z).toBe(3);
    });

    it('should clone array contents correctly', function ()
    {
        var obj = { arr: ['a', 'b', 'c'] };
        var result = Clone(obj);

        expect(result.arr[0]).toBe('a');
        expect(result.arr[1]).toBe('b');
        expect(result.arr[2]).toBe('c');
        expect(result.arr.length).toBe(3);
    });

    it('should not affect original array when modifying cloned array', function ()
    {
        var obj = { arr: [1, 2, 3] };
        var result = Clone(obj);

        result.arr.push(4);

        expect(obj.arr.length).toBe(3);
    });

    it('should handle objects with numeric keys', function ()
    {
        var obj = { 0: 'zero', 1: 'one', 2: 'two' };
        var result = Clone(obj);

        expect(result[0]).toBe('zero');
        expect(result[1]).toBe('one');
        expect(result[2]).toBe('two');
    });

    it('should handle mixed property types', function ()
    {
        var obj = { num: 42, str: 'text', arr: [1, 2], nested: { a: 1 }, flag: false };
        var result = Clone(obj);

        expect(result.num).toBe(42);
        expect(result.str).toBe('text');
        expect(result.arr).toEqual([1, 2]);
        expect(result.arr).not.toBe(obj.arr);
        expect(result.nested).toBe(obj.nested);
        expect(result.flag).toBe(false);
    });
});
