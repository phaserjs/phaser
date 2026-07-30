var HasValue = require('../../../src/utils/object/HasValue');

describe('Phaser.Utils.Objects.HasValue', function ()
{
    it('should return true when the key exists on the source object', function ()
    {
        var source = { foo: 'bar' };
        expect(HasValue(source, 'foo')).toBe(true);
    });

    it('should return false when the key does not exist on the source object', function ()
    {
        var source = { foo: 'bar' };
        expect(HasValue(source, 'baz')).toBe(false);
    });

    it('should return true when the value is undefined but key exists', function ()
    {
        var source = { foo: undefined };
        expect(HasValue(source, 'foo')).toBe(true);
    });

    it('should return true when the value is null but key exists', function ()
    {
        var source = { foo: null };
        expect(HasValue(source, 'foo')).toBe(true);
    });

    it('should return true when the value is zero but key exists', function ()
    {
        var source = { count: 0 };
        expect(HasValue(source, 'count')).toBe(true);
    });

    it('should return true when the value is false but key exists', function ()
    {
        var source = { active: false };
        expect(HasValue(source, 'active')).toBe(true);
    });

    it('should return false for inherited properties', function ()
    {
        function Parent() {}
        Parent.prototype.inherited = true;
        var source = new Parent();
        expect(HasValue(source, 'inherited')).toBe(false);
    });

    it('should return true for own properties even when prototype has same key', function ()
    {
        function Parent() {}
        Parent.prototype.foo = 'prototype';
        var source = new Parent();
        source.foo = 'own';
        expect(HasValue(source, 'foo')).toBe(true);
    });

    it('should return false on an empty object', function ()
    {
        var source = {};
        expect(HasValue(source, 'anything')).toBe(false);
    });

    it('should return true for numeric string keys', function ()
    {
        var source = { '0': 'zero' };
        expect(HasValue(source, '0')).toBe(true);
    });

    it('should return false when checking a numeric key as number on string-keyed object', function ()
    {
        var source = {};
        source[1] = 'value';
        expect(HasValue(source, '1')).toBe(true);
    });

    it('should work with nested objects as values', function ()
    {
        var source = { nested: { a: 1 } };
        expect(HasValue(source, 'nested')).toBe(true);
        expect(HasValue(source, 'a')).toBe(false);
    });

    it('should work with array objects', function ()
    {
        var source = [10, 20, 30];
        expect(HasValue(source, '0')).toBe(true);
        expect(HasValue(source, '3')).toBe(false);
    });
});
