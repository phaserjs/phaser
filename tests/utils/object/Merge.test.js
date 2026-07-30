var Merge = require('../../../src/utils/object/Merge');

describe('Phaser.Utils.Objects.Merge', function ()
{
    it('should return a new object containing properties from both objects', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { b: 2 };
        var result = Merge(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
    });

    it('should return a brand new object, not a reference to either input', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { b: 2 };
        var result = Merge(obj1, obj2);

        expect(result).not.toBe(obj1);
        expect(result).not.toBe(obj2);
    });

    it('should not modify the original objects', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { b: 2 };
        Merge(obj1, obj2);

        expect(obj1.b).toBeUndefined();
        expect(obj2.a).toBeUndefined();
    });

    it('should give precedence to obj1 when both objects share the same key', function ()
    {
        var obj1 = { x: 10 };
        var obj2 = { x: 99 };
        var result = Merge(obj1, obj2);

        expect(result.x).toBe(10);
    });

    it('should include all unique keys from obj2 not present in obj1', function ()
    {
        var obj1 = { a: 1 };
        var obj2 = { b: 2, c: 3, d: 4 };
        var result = Merge(obj1, obj2);

        expect(result.b).toBe(2);
        expect(result.c).toBe(3);
        expect(result.d).toBe(4);
    });

    it('should work when obj1 is an empty object', function ()
    {
        var obj1 = {};
        var obj2 = { a: 1, b: 2 };
        var result = Merge(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
    });

    it('should work when obj2 is an empty object', function ()
    {
        var obj1 = { a: 1, b: 2 };
        var obj2 = {};
        var result = Merge(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
    });

    it('should work when both objects are empty', function ()
    {
        var result = Merge({}, {});

        expect(Object.keys(result).length).toBe(0);
    });

    it('should handle string values', function ()
    {
        var obj1 = { name: 'Alice' };
        var obj2 = { greeting: 'Hello' };
        var result = Merge(obj1, obj2);

        expect(result.name).toBe('Alice');
        expect(result.greeting).toBe('Hello');
    });

    it('should handle boolean values', function ()
    {
        var obj1 = { enabled: true };
        var obj2 = { visible: false };
        var result = Merge(obj1, obj2);

        expect(result.enabled).toBe(true);
        expect(result.visible).toBe(false);
    });

    it('should handle null values from obj1', function ()
    {
        var obj1 = { a: null };
        var obj2 = { a: 42 };
        var result = Merge(obj1, obj2);

        expect(result.a).toBeNull();
    });

    it('should handle numeric zero as a value without being overridden', function ()
    {
        var obj1 = { x: 0 };
        var obj2 = { x: 99 };
        var result = Merge(obj1, obj2);

        expect(result.x).toBe(0);
    });

    it('should perform a shallow copy, so nested objects are not deep cloned', function ()
    {
        var nested = { deep: true };
        var obj1 = { ref: nested };
        var obj2 = { other: 1 };
        var result = Merge(obj1, obj2);

        expect(result.ref).toBe(nested);
    });

    it('should handle multiple overlapping keys correctly', function ()
    {
        var obj1 = { a: 1, b: 2, c: 3 };
        var obj2 = { b: 20, c: 30, d: 40 };
        var result = Merge(obj1, obj2);

        expect(result.a).toBe(1);
        expect(result.b).toBe(2);
        expect(result.c).toBe(3);
        expect(result.d).toBe(40);
    });
});
