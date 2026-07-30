var BaseCache = require('../../src/cache/BaseCache');

describe('BaseCache', function ()
{
    var cache;

    beforeEach(function ()
    {
        cache = new BaseCache();
    });

    afterEach(function ()
    {
        if (cache.entries !== null)
        {
            cache.destroy();
        }
    });

    describe('constructor', function ()
    {
        it('should create entries map on construction', function ()
        {
            expect(cache.entries).not.toBeNull();
        });

        it('should create events emitter on construction', function ()
        {
            expect(cache.events).not.toBeNull();
        });
    });

    describe('add', function ()
    {
        it('should add an item to the cache', function ()
        {
            cache.add('key1', { value: 42 });
            expect(cache.has('key1')).toBe(true);
        });

        it('should return the cache instance for chaining', function ()
        {
            var result = cache.add('key1', 'data');
            expect(result).toBe(cache);
        });

        it('should store the exact data provided', function ()
        {
            var data = { foo: 'bar', num: 123 };
            cache.add('myKey', data);
            expect(cache.get('myKey')).toBe(data);
        });

        it('should emit an ADD event when an item is added', function ()
        {
            var emitted = false;
            var emittedKey = null;
            var emittedData = null;

            cache.events.on('add', function (c, key, data)
            {
                emitted = true;
                emittedKey = key;
                emittedData = data;
            });

            var data = { value: 1 };
            cache.add('testKey', data);

            expect(emitted).toBe(true);
            expect(emittedKey).toBe('testKey');
            expect(emittedData).toBe(data);
        });

        it('should allow storing primitive values', function ()
        {
            cache.add('num', 42);
            cache.add('str', 'hello');
            cache.add('bool', true);

            expect(cache.get('num')).toBe(42);
            expect(cache.get('str')).toBe('hello');
            expect(cache.get('bool')).toBe(true);
        });

        it('should overwrite existing entry with same key', function ()
        {
            cache.add('key1', 'original');
            cache.add('key1', 'updated');
            expect(cache.get('key1')).toBe('updated');
        });

        it('should support chaining multiple adds', function ()
        {
            cache.add('a', 1).add('b', 2).add('c', 3);
            expect(cache.has('a')).toBe(true);
            expect(cache.has('b')).toBe(true);
            expect(cache.has('c')).toBe(true);
        });
    });

    describe('has', function ()
    {
        it('should return true for an existing key', function ()
        {
            cache.add('exists', 'data');
            expect(cache.has('exists')).toBe(true);
        });

        it('should return false for a missing key', function ()
        {
            expect(cache.has('missing')).toBe(false);
        });

        it('should return false after a key has been removed', function ()
        {
            cache.add('tempKey', { value: 1 });
            cache.remove('tempKey');
            expect(cache.has('tempKey')).toBe(false);
        });
    });

    describe('exists', function ()
    {
        it('should return true for an existing key', function ()
        {
            cache.add('exists', 'data');
            expect(cache.exists('exists')).toBe(true);
        });

        it('should return false for a missing key', function ()
        {
            expect(cache.exists('missing')).toBe(false);
        });

        it('should behave identically to has', function ()
        {
            cache.add('key1', 'data');
            expect(cache.exists('key1')).toBe(cache.has('key1'));
            expect(cache.exists('nope')).toBe(cache.has('nope'));
        });
    });

    describe('get', function ()
    {
        it('should return the stored data for a valid key', function ()
        {
            var data = { name: 'test' };
            cache.add('item', data);
            expect(cache.get('item')).toBe(data);
        });

        it('should return undefined for a missing key', function ()
        {
            var result = cache.get('nonexistent');
            expect(result).toBeUndefined();
        });

        it('should return the most recently added value for a duplicate key', function ()
        {
            cache.add('key', 'first');
            cache.add('key', 'second');
            expect(cache.get('key')).toBe('second');
        });
    });

    describe('remove', function ()
    {
        it('should remove an existing item from the cache', function ()
        {
            cache.add('toRemove', 'data');
            cache.remove('toRemove');
            expect(cache.has('toRemove')).toBe(false);
        });

        it('should return the cache instance for chaining', function ()
        {
            cache.add('toRemove', 'data');
            var result = cache.remove('toRemove');
            expect(result).toBe(cache);
        });

        it('should return the cache instance even when key does not exist', function ()
        {
            var result = cache.remove('nonexistent');
            expect(result).toBe(cache);
        });

        it('should emit a REMOVE event when an item is removed', function ()
        {
            var emitted = false;
            var emittedKey = null;

            cache.add('toRemove', { value: 99 });

            cache.events.on('remove', function (c, key)
            {
                emitted = true;
                emittedKey = key;
            });

            cache.remove('toRemove');

            expect(emitted).toBe(true);
            expect(emittedKey).toBe('toRemove');
        });

        it('should not emit a REMOVE event when key does not exist', function ()
        {
            var emitted = false;

            cache.events.on('remove', function ()
            {
                emitted = true;
            });

            cache.remove('nonexistent');

            expect(emitted).toBe(false);
        });

        it('should not affect other entries when removing one key', function ()
        {
            cache.add('keep', 'data1');
            cache.add('remove', 'data2');
            cache.remove('remove');
            expect(cache.has('keep')).toBe(true);
            expect(cache.get('keep')).toBe('data1');
        });
    });

    describe('getKeys', function ()
    {
        it('should return an empty array when cache is empty', function ()
        {
            var keys = cache.getKeys();
            expect(Array.isArray(keys)).toBe(true);
            expect(keys.length).toBe(0);
        });

        it('should return all keys in the cache', function ()
        {
            cache.add('alpha', 1);
            cache.add('beta', 2);
            cache.add('gamma', 3);

            var keys = cache.getKeys();
            expect(keys.length).toBe(3);
            expect(keys).toContain('alpha');
            expect(keys).toContain('beta');
            expect(keys).toContain('gamma');
        });

        it('should not include removed keys', function ()
        {
            cache.add('a', 1);
            cache.add('b', 2);
            cache.remove('a');

            var keys = cache.getKeys();
            expect(keys).not.toContain('a');
            expect(keys).toContain('b');
        });

        it('should return a single key after one add', function ()
        {
            cache.add('onlyKey', 'value');
            var keys = cache.getKeys();
            expect(keys.length).toBe(1);
            expect(keys[0]).toBe('onlyKey');
        });
    });

    describe('destroy', function ()
    {
        it('should set entries to null', function ()
        {
            cache.destroy();
            expect(cache.entries).toBeNull();
        });

        it('should set events to null', function ()
        {
            cache.destroy();
            expect(cache.events).toBeNull();
        });

        it('should remove all event listeners before nulling events', function ()
        {
            var listenerCalled = false;

            cache.events.on('add', function ()
            {
                listenerCalled = true;
            });

            cache.destroy();

            expect(cache.events).toBeNull();
            expect(listenerCalled).toBe(false);
        });
    });
});
