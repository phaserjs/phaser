var GetValue = require('../../../src/utils/object/GetValue');

describe('Phaser.Utils.Objects.GetValue', function ()
{
    it('should return the value when key exists at top level', function ()
    {
        var source = { lives: 3 };

        expect(GetValue(source, 'lives', 1)).toBe(3);
    });

    it('should return the default value when key is missing', function ()
    {
        var source = { lives: 3 };

        expect(GetValue(source, 'score', 0)).toBe(0);
    });

    it('should return nested value using dot notation', function ()
    {
        var source = { render: { screen: { width: 1024 } } };

        expect(GetValue(source, 'render.screen.width', 800)).toBe(1024);
    });

    it('should return default value when nested key is missing', function ()
    {
        var source = { render: { screen: { width: 1024 } } };

        expect(GetValue(source, 'render.screen.height', 600)).toBe(600);
    });

    it('should return default value when source is null', function ()
    {
        expect(GetValue(null, 'key', 42)).toBe(42);
    });

    it('should return default value when source is undefined', function ()
    {
        expect(GetValue(undefined, 'key', 42)).toBe(42);
    });

    it('should return default value when source is a number', function ()
    {
        expect(GetValue(99, 'key', 42)).toBe(42);
    });

    it('should return value from altSource when not found in source', function ()
    {
        var source = { a: 1 };
        var altSource = { b: 2 };

        expect(GetValue(source, 'b', 0, altSource)).toBe(2);
    });

    it('should prefer source over altSource when key exists in both', function ()
    {
        var source = { x: 10 };
        var altSource = { x: 99 };

        expect(GetValue(source, 'x', 0, altSource)).toBe(10);
    });

    it('should return default value when both source and altSource are null', function ()
    {
        expect(GetValue(null, 'key', 'default', null)).toBe('default');
    });

    it('should return default value when both source and altSource are undefined', function ()
    {
        expect(GetValue(undefined, 'key', 'default', undefined)).toBe('default');
    });

    it('should return nested value from altSource using dot notation', function ()
    {
        var source = {};
        var altSource = { render: { screen: { width: 800 } } };

        expect(GetValue(source, 'render.screen.width', 0, altSource)).toBe(800);
    });

    it('should prefer nested value in source over altSource', function ()
    {
        var source = { render: { screen: { width: 1024 } } };
        var altSource = { render: { screen: { width: 800 } } };

        expect(GetValue(source, 'render.screen.width', 0, altSource)).toBe(1024);
    });

    it('should return default when nested key is missing in both source and altSource', function ()
    {
        var source = { render: {} };
        var altSource = { render: {} };

        expect(GetValue(source, 'render.screen.width', 640, altSource)).toBe(640);
    });

    it('should handle a value of zero correctly', function ()
    {
        var source = { count: 0 };

        expect(GetValue(source, 'count', 10)).toBe(0);
    });

    it('should handle a value of false correctly', function ()
    {
        var source = { active: false };

        expect(GetValue(source, 'active', true)).toBe(false);
    });

    it('should handle a value of null correctly', function ()
    {
        var source = { data: null };

        expect(GetValue(source, 'data', 'fallback')).toBeNull();
    });

    it('should handle a string value', function ()
    {
        var source = { name: 'phaser' };

        expect(GetValue(source, 'name', 'unknown')).toBe('phaser');
    });

    it('should handle a deeply nested key', function ()
    {
        var source = { a: { b: { c: { d: 99 } } } };

        expect(GetValue(source, 'a.b.c.d', 0)).toBe(99);
    });

    it('should return default when intermediate nested key is missing', function ()
    {
        var source = { a: {} };

        expect(GetValue(source, 'a.b.c', 'default')).toBe('default');
    });

    it('should return an object value when key points to an object', function ()
    {
        var inner = { x: 1 };
        var source = { child: inner };

        expect(GetValue(source, 'child', null)).toBe(inner);
    });

    it('should handle source with enumerable own properties', function ()
    {
        var source = Object.assign({}, { foo: 'bar' });

        expect(GetValue(source, 'foo', 'default')).toBe('bar');
    });

    it('should return default value when source is an empty object and no altSource', function ()
    {
        expect(GetValue({}, 'missing', 'fallback')).toBe('fallback');
    });

    it('should use altSource when source is null but altSource has the key', function ()
    {
        var altSource = { score: 100 };

        expect(GetValue(null, 'score', 0, altSource)).toBe(100);
    });

    it('should return default when source is null and altSource does not have the key', function ()
    {
        var altSource = { other: 1 };

        expect(GetValue(null, 'score', 0, altSource)).toBe(0);
    });
});
