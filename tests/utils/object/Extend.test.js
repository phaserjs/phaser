var Extend = require('../../../src/utils/object/Extend');

describe('Phaser.Utils.Objects.Extend', function ()
{
    it('should return the target object', function ()
    {
        var target = {};
        var result = Extend(target, { a: 1 });

        expect(result).toBe(target);
    });

    it('should copy properties from source to target', function ()
    {
        var target = {};
        Extend(target, { a: 1, b: 2 });

        expect(target.a).toBe(1);
        expect(target.b).toBe(2);
    });

    it('should overwrite existing properties on target', function ()
    {
        var target = { a: 1 };
        Extend(target, { a: 99 });

        expect(target.a).toBe(99);
    });

    it('should merge multiple source objects', function ()
    {
        var target = {};
        Extend(target, { a: 1 }, { b: 2 }, { c: 3 });

        expect(target.a).toBe(1);
        expect(target.b).toBe(2);
        expect(target.c).toBe(3);
    });

    it('should have later sources overwrite earlier ones for the same key', function ()
    {
        var target = {};
        Extend(target, { a: 1 }, { a: 2 });

        expect(target.a).toBe(2);
    });

    it('should not copy undefined values to target', function ()
    {
        var target = { a: 1 };
        Extend(target, { a: undefined });

        expect(target.a).toBe(1);
    });

    it('should not copy undefined values from source when key does not exist on target', function ()
    {
        var target = {};
        Extend(target, { a: undefined });

        expect(target.hasOwnProperty('a')).toBe(false);
    });

    it('should handle null source objects gracefully', function ()
    {
        var target = { a: 1 };

        expect(function () { Extend(target, null); }).not.toThrow();
        expect(target.a).toBe(1);
    });

    it('should handle undefined source objects gracefully', function ()
    {
        var target = { a: 1 };

        expect(function () { Extend(target, undefined); }).not.toThrow();
        expect(target.a).toBe(1);
    });

    it('should use empty object as target when no arguments are provided', function ()
    {
        var result = Extend();

        expect(typeof result).toBe('object');
    });

    it('should perform a shallow copy by default', function ()
    {
        var nested = { x: 1 };
        var target = {};
        Extend(target, { nested: nested });

        expect(target.nested).toBe(nested);
    });

    it('should perform a deep copy when first argument is true', function ()
    {
        var nested = { x: 1 };
        var target = {};
        Extend(true, target, { nested: nested });

        expect(target.nested).not.toBe(nested);
        expect(target.nested.x).toBe(1);
    });

    it('should deeply clone nested plain objects', function ()
    {
        var source = { a: { b: { c: 42 } } };
        var target = {};
        Extend(true, target, source);

        expect(target.a.b.c).toBe(42);

        source.a.b.c = 99;

        expect(target.a.b.c).toBe(42);
    });

    it('should deeply clone arrays', function ()
    {
        var source = { arr: [1, 2, 3] };
        var target = {};
        Extend(true, target, source);

        expect(Array.isArray(target.arr)).toBe(true);
        expect(target.arr).not.toBe(source.arr);
        expect(target.arr[0]).toBe(1);
        expect(target.arr[1]).toBe(2);
        expect(target.arr[2]).toBe(3);
    });

    it('should not mutate original nested objects during deep copy', function ()
    {
        var source = { config: { debug: false } };
        var target = {};
        Extend(true, target, source);

        target.config.debug = true;

        expect(source.config.debug).toBe(false);
    });

    it('should merge into existing nested objects during deep copy', function ()
    {
        var target = { config: { a: 1, b: 2 } };
        Extend(true, target, { config: { b: 99, c: 3 } });

        expect(target.config.a).toBe(1);
        expect(target.config.b).toBe(99);
        expect(target.config.c).toBe(3);
    });

    it('should copy string values', function ()
    {
        var target = {};
        Extend(target, { name: 'phaser' });

        expect(target.name).toBe('phaser');
    });

    it('should copy boolean values', function ()
    {
        var target = {};
        Extend(target, { flag: false });

        expect(target.flag).toBe(false);
    });

    it('should copy null values', function ()
    {
        var target = { a: 1 };
        Extend(target, { a: null });

        expect(target.a).toBeNull();
    });

    it('should copy numeric zero', function ()
    {
        var target = { a: 1 };
        Extend(target, { a: 0 });

        expect(target.a).toBe(0);
    });

    it('should copy function values', function ()
    {
        var fn = function () { return 42; };
        var target = {};
        Extend(target, { fn: fn });

        expect(target.fn).toBe(fn);
    });

    it('should prevent circular reference by skipping when target equals copy', function ()
    {
        var target = {};
        target.self = target;

        expect(function () { Extend(target, target); }).not.toThrow();
    });

    it('should treat second argument as target when first argument is true', function ()
    {
        var target = { a: 1 };
        var result = Extend(true, target, { b: 2 });

        expect(result).toBe(target);
        expect(target.b).toBe(2);
    });

    it('should handle arrays inside nested objects during deep copy', function ()
    {
        var source = { data: { items: [10, 20, 30] } };
        var target = {};
        Extend(true, target, source);

        expect(target.data.items[0]).toBe(10);
        expect(target.data.items).not.toBe(source.data.items);
    });

    it('should copy properties from source when target has no matching key in deep mode', function ()
    {
        var target = {};
        Extend(true, target, { a: { x: 5 } });

        expect(target.a.x).toBe(5);
    });

    it('should use empty array as clone base when target property is not an array in deep mode', function ()
    {
        var target = { arr: 'notanarray' };
        Extend(true, target, { arr: [1, 2] });

        expect(Array.isArray(target.arr)).toBe(true);
        expect(target.arr[0]).toBe(1);
        expect(target.arr[1]).toBe(2);
    });

    it('should use empty object as clone base when target property is not a plain object in deep mode', function ()
    {
        var target = { obj: 'notanobject' };
        Extend(true, target, { obj: { x: 1 } });

        expect(typeof target.obj).toBe('object');
        expect(target.obj.x).toBe(1);
    });
});
