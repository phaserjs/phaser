var GetFastValue = require('../../../src/utils/object/GetFastValue');

describe('Phaser.Utils.Objects.GetFastValue', function ()
{
    it('should return the value when key exists on source', function ()
    {
        var source = { foo: 'bar' };
        expect(GetFastValue(source, 'foo')).toBe('bar');
    });

    it('should return defaultValue when key does not exist on source', function ()
    {
        var source = { foo: 'bar' };
        expect(GetFastValue(source, 'missing', 'default')).toBe('default');
    });

    it('should return undefined when key does not exist and no default provided', function ()
    {
        var source = { foo: 'bar' };
        expect(GetFastValue(source, 'missing')).toBeUndefined();
    });

    it('should return defaultValue when source is null', function ()
    {
        expect(GetFastValue(null, 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when source is undefined', function ()
    {
        expect(GetFastValue(undefined, 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when source is a number', function ()
    {
        expect(GetFastValue(42, 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when source is zero', function ()
    {
        expect(GetFastValue(0, 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when source is a string', function ()
    {
        expect(GetFastValue('hello', 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when source is an empty string', function ()
    {
        expect(GetFastValue('', 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when source is false', function ()
    {
        expect(GetFastValue(false, 'foo', 'default')).toBe('default');
    });

    it('should return defaultValue when the key value is undefined', function ()
    {
        var source = { foo: undefined };
        expect(GetFastValue(source, 'foo', 'default')).toBe('default');
    });

    it('should return numeric values correctly', function ()
    {
        var source = { count: 42 };
        expect(GetFastValue(source, 'count', 0)).toBe(42);
    });

    it('should return zero when the key value is zero', function ()
    {
        var source = { count: 0 };
        expect(GetFastValue(source, 'count', 99)).toBe(0);
    });

    it('should return false when the key value is false', function ()
    {
        var source = { flag: false };
        expect(GetFastValue(source, 'flag', true)).toBe(false);
    });

    it('should return null when the key value is null', function ()
    {
        var source = { value: null };
        expect(GetFastValue(source, 'value', 'default')).toBeNull();
    });

    it('should return an object when the key value is an object', function ()
    {
        var nested = { x: 1, y: 2 };
        var source = { pos: nested };
        expect(GetFastValue(source, 'pos', null)).toBe(nested);
    });

    it('should return an array when the key value is an array', function ()
    {
        var arr = [1, 2, 3];
        var source = { items: arr };
        expect(GetFastValue(source, 'items', null)).toBe(arr);
    });

    it('should not traverse nested keys', function ()
    {
        var source = { foo: { bar: 'baz' } };
        expect(GetFastValue(source, 'foo.bar', 'default')).toBe('default');
    });

    it('should return defaultValue when source is an empty object and key is missing', function ()
    {
        expect(GetFastValue({}, 'foo', 'default')).toBe('default');
    });

    it('should work with numeric default values', function ()
    {
        var source = {};
        expect(GetFastValue(source, 'missing', 100)).toBe(100);
    });

    it('should work with boolean default values', function ()
    {
        var source = {};
        expect(GetFastValue(source, 'missing', true)).toBe(true);
    });

    it('should return a function when the key value is a function', function ()
    {
        var fn = function () { return 42; };
        var source = { callback: fn };
        expect(GetFastValue(source, 'callback', null)).toBe(fn);
    });

    it('should work with inherited properties not returning them', function ()
    {
        function Base() {}
        Base.prototype.inherited = 'yes';
        var source = new Base();
        expect(GetFastValue(source, 'inherited', 'default')).toBe('default');
    });
});
