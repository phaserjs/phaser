var Map = require('../../src/structs/Map');

describe('Phaser.Structs.Map', function ()
{
    it('should create an empty map with default values', function ()
    {
        var map = new Map();
        expect(map.size).toBe(0);
        expect(map.entries).toEqual({});
    });

    it('should create a map from an array of key-value pairs', function ()
    {
        var map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        expect(map.size).toBe(3);
        expect(map.get('a')).toBe(1);
        expect(map.get('b')).toBe(2);
        expect(map.get('c')).toBe(3);
    });

    it('should create an empty map when passed undefined', function ()
    {
        var map = new Map(undefined);
        expect(map.size).toBe(0);
    });

    it('should create an empty map when passed null', function ()
    {
        var map = new Map(null);
        expect(map.size).toBe(0);
    });

    it('should create an empty map when passed an empty array', function ()
    {
        var map = new Map([]);
        expect(map.size).toBe(0);
    });

    describe('setAll', function ()
    {
        it('should add all elements from the array', function ()
        {
            var map = new Map();
            map.setAll([['x', 10], ['y', 20]]);
            expect(map.size).toBe(2);
            expect(map.get('x')).toBe(10);
            expect(map.get('y')).toBe(20);
        });

        it('should replace existing values for duplicate keys', function ()
        {
            var map = new Map([['a', 1]]);
            map.setAll([['a', 99]]);
            expect(map.size).toBe(1);
            expect(map.get('a')).toBe(99);
        });

        it('should return this for chaining', function ()
        {
            var map = new Map();
            var result = map.setAll([['k', 'v']]);
            expect(result).toBe(map);
        });

        it('should do nothing when passed a non-array', function ()
        {
            var map = new Map();
            map.setAll('invalid');
            expect(map.size).toBe(0);
        });

        it('should do nothing when passed null', function ()
        {
            var map = new Map();
            map.setAll(null);
            expect(map.size).toBe(0);
        });

        it('should do nothing when passed undefined', function ()
        {
            var map = new Map();
            map.setAll(undefined);
            expect(map.size).toBe(0);
        });
    });

    describe('set', function ()
    {
        it('should add a new key-value pair', function ()
        {
            var map = new Map();
            map.set('key', 'value');
            expect(map.get('key')).toBe('value');
            expect(map.size).toBe(1);
        });

        it('should increment size only for new keys', function ()
        {
            var map = new Map();
            map.set('a', 1);
            map.set('b', 2);
            expect(map.size).toBe(2);
        });

        it('should not increment size when overwriting an existing key', function ()
        {
            var map = new Map();
            map.set('a', 1);
            map.set('a', 2);
            expect(map.size).toBe(1);
            expect(map.get('a')).toBe(2);
        });

        it('should return this for chaining', function ()
        {
            var map = new Map();
            var result = map.set('k', 'v');
            expect(result).toBe(map);
        });

        it('should accept any value type', function ()
        {
            var map = new Map();
            var obj = { x: 1 };
            map.set('obj', obj);
            map.set('num', 42);
            map.set('bool', true);
            map.set('nil', null);
            expect(map.get('obj')).toBe(obj);
            expect(map.get('num')).toBe(42);
            expect(map.get('bool')).toBe(true);
            expect(map.get('nil')).toBeNull();
        });
    });

    describe('get', function ()
    {
        it('should return the value for an existing key', function ()
        {
            var map = new Map([['hello', 'world']]);
            expect(map.get('hello')).toBe('world');
        });

        it('should return undefined for a missing key', function ()
        {
            var map = new Map();
            expect(map.get('missing')).toBeUndefined();
        });

        it('should return the updated value after overwrite', function ()
        {
            var map = new Map([['a', 1]]);
            map.set('a', 99);
            expect(map.get('a')).toBe(99);
        });
    });

    describe('getArray', function ()
    {
        it('should return an empty array for an empty map', function ()
        {
            var map = new Map();
            expect(map.getArray()).toEqual([]);
        });

        it('should return all values as an array', function ()
        {
            var map = new Map([['a', 1], ['b', 2], ['c', 3]]);
            var arr = map.getArray();
            expect(arr.length).toBe(3);
            expect(arr).toContain(1);
            expect(arr).toContain(2);
            expect(arr).toContain(3);
        });

        it('should return a new array each time', function ()
        {
            var map = new Map([['a', 1]]);
            var arr1 = map.getArray();
            var arr2 = map.getArray();
            expect(arr1).not.toBe(arr2);
        });
    });

    describe('has', function ()
    {
        it('should return true for an existing key', function ()
        {
            var map = new Map([['a', 1]]);
            expect(map.has('a')).toBe(true);
        });

        it('should return false for a missing key', function ()
        {
            var map = new Map();
            expect(map.has('missing')).toBe(false);
        });

        it('should return false after a key has been deleted', function ()
        {
            var map = new Map([['a', 1]]);
            map.delete('a');
            expect(map.has('a')).toBe(false);
        });
    });

    describe('delete', function ()
    {
        it('should remove an existing entry', function ()
        {
            var map = new Map([['a', 1]]);
            map.delete('a');
            expect(map.has('a')).toBe(false);
        });

        it('should decrement size when deleting an existing key', function ()
        {
            var map = new Map([['a', 1], ['b', 2]]);
            map.delete('a');
            expect(map.size).toBe(1);
        });

        it('should not decrement size when deleting a missing key', function ()
        {
            var map = new Map([['a', 1]]);
            map.delete('nonexistent');
            expect(map.size).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            var map = new Map([['a', 1]]);
            var result = map.delete('a');
            expect(result).toBe(map);
        });

        it('should not throw when deleting a key that does not exist', function ()
        {
            var map = new Map();
            expect(function () { map.delete('ghost'); }).not.toThrow();
        });
    });

    describe('clear', function ()
    {
        it('should remove all entries', function ()
        {
            var map = new Map([['a', 1], ['b', 2], ['c', 3]]);
            map.clear();
            expect(map.size).toBe(0);
            expect(map.keys().length).toBe(0);
        });

        it('should reset size to zero', function ()
        {
            var map = new Map([['a', 1]]);
            map.clear();
            expect(map.size).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var map = new Map([['a', 1]]);
            var result = map.clear();
            expect(result).toBe(map);
        });

        it('should work on an already empty map', function ()
        {
            var map = new Map();
            expect(function () { map.clear(); }).not.toThrow();
            expect(map.size).toBe(0);
        });
    });

    describe('keys', function ()
    {
        it('should return an empty array for an empty map', function ()
        {
            var map = new Map();
            expect(map.keys()).toEqual([]);
        });

        it('should return all keys', function ()
        {
            var map = new Map([['a', 1], ['b', 2]]);
            var keys = map.keys();
            expect(keys.length).toBe(2);
            expect(keys).toContain('a');
            expect(keys).toContain('b');
        });

        it('should not include deleted keys', function ()
        {
            var map = new Map([['a', 1], ['b', 2]]);
            map.delete('a');
            var keys = map.keys();
            expect(keys).not.toContain('a');
            expect(keys).toContain('b');
        });
    });

    describe('values', function ()
    {
        it('should return an empty array for an empty map', function ()
        {
            var map = new Map();
            expect(map.values()).toEqual([]);
        });

        it('should return all values', function ()
        {
            var map = new Map([['a', 10], ['b', 20]]);
            var vals = map.values();
            expect(vals.length).toBe(2);
            expect(vals).toContain(10);
            expect(vals).toContain(20);
        });

        it('should reflect the current state after mutations', function ()
        {
            var map = new Map([['a', 1]]);
            map.set('a', 99);
            var vals = map.values();
            expect(vals).toContain(99);
            expect(vals).not.toContain(1);
        });
    });

    describe('dump', function ()
    {
        it('should not throw when called', function ()
        {
            var map = new Map([['a', 1], ['b', 2]]);
            expect(function () { map.dump(); }).not.toThrow();
        });

        it('should not throw on an empty map', function ()
        {
            var map = new Map();
            expect(function () { map.dump(); }).not.toThrow();
        });
    });

    describe('each', function ()
    {
        it('should iterate over all entries', function ()
        {
            var map = new Map([['a', 1], ['b', 2], ['c', 3]]);
            var visited = {};
            map.each(function (key, value)
            {
                visited[key] = value;
            });
            expect(visited).toEqual({ a: 1, b: 2, c: 3 });
        });

        it('should stop iteration when callback returns false', function ()
        {
            var map = new Map([['a', 1], ['b', 2], ['c', 3]]);
            var count = 0;
            map.each(function (key, value)
            {
                count++;
                return false;
            });
            expect(count).toBe(1);
        });

        it('should not stop iteration when callback returns undefined', function ()
        {
            var map = new Map([['a', 1], ['b', 2]]);
            var count = 0;
            map.each(function (key, value)
            {
                count++;
            });
            expect(count).toBe(2);
        });

        it('should return this for chaining', function ()
        {
            var map = new Map([['a', 1]]);
            var result = map.each(function () {});
            expect(result).toBe(map);
        });

        it('should pass key and value to the callback', function ()
        {
            var map = new Map([['myKey', 'myValue']]);
            var capturedKey, capturedValue;
            map.each(function (key, value)
            {
                capturedKey = key;
                capturedValue = value;
            });
            expect(capturedKey).toBe('myKey');
            expect(capturedValue).toBe('myValue');
        });

        it('should not iterate on an empty map', function ()
        {
            var map = new Map();
            var count = 0;
            map.each(function () { count++; });
            expect(count).toBe(0);
        });
    });

    describe('contains', function ()
    {
        it('should return true if the value exists', function ()
        {
            var map = new Map([['a', 42]]);
            expect(map.contains(42)).toBe(true);
        });

        it('should return false if the value does not exist', function ()
        {
            var map = new Map([['a', 1]]);
            expect(map.contains(99)).toBe(false);
        });

        it('should return false for an empty map', function ()
        {
            var map = new Map();
            expect(map.contains('anything')).toBe(false);
        });

        it('should use strict equality for value comparison', function ()
        {
            var map = new Map([['a', 1]]);
            expect(map.contains('1')).toBe(false);
            expect(map.contains(1)).toBe(true);
        });

        it('should work with object references', function ()
        {
            var obj = { x: 1 };
            var other = { x: 1 };
            var map = new Map([['a', obj]]);
            expect(map.contains(obj)).toBe(true);
            expect(map.contains(other)).toBe(false);
        });

        it('should return false after a value is deleted', function ()
        {
            var map = new Map([['a', 100]]);
            map.delete('a');
            expect(map.contains(100)).toBe(false);
        });
    });

    describe('merge', function ()
    {
        it('should add new keys from the source map', function ()
        {
            var map = new Map([['a', 1]]);
            var other = new Map([['b', 2], ['c', 3]]);
            map.merge(other);
            expect(map.get('b')).toBe(2);
            expect(map.get('c')).toBe(3);
        });

        it('should overwrite existing keys (merge always overwrites via set)', function ()
        {
            var map = new Map([['a', 1]]);
            var other = new Map([['a', 99]]);
            map.merge(other);
            expect(map.get('a')).toBe(99);
        });

        it('should overwrite existing keys when override is true', function ()
        {
            var map = new Map([['a', 1]]);
            var other = new Map([['a', 99]]);
            map.merge(other, true);
            expect(map.get('a')).toBe(99);
        });

        it('should not change size when overriding an existing key', function ()
        {
            var map = new Map([['a', 1]]);
            var other = new Map([['a', 99]]);
            map.merge(other, true);
            expect(map.size).toBe(1);
        });

        it('should increment size for new keys merged in', function ()
        {
            var map = new Map([['a', 1]]);
            var other = new Map([['b', 2]]);
            map.merge(other);
            expect(map.size).toBe(2);
        });

        it('should return this for chaining', function ()
        {
            var map = new Map();
            var other = new Map();
            var result = map.merge(other);
            expect(result).toBe(map);
        });

        it('should handle merging an empty map', function ()
        {
            var map = new Map([['a', 1]]);
            var other = new Map();
            map.merge(other);
            expect(map.size).toBe(1);
            expect(map.get('a')).toBe(1);
        });

        it('should handle merging into an empty map', function ()
        {
            var map = new Map();
            var other = new Map([['x', 10], ['y', 20]]);
            map.merge(other);
            expect(map.size).toBe(2);
            expect(map.get('x')).toBe(10);
            expect(map.get('y')).toBe(20);
        });
    });
});
