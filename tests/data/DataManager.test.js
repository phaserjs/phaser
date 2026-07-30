var DataManager = require('../../src/data/DataManager');

function createMockEvents ()
{
    return {
        emit: vi.fn(),
        once: vi.fn(),
        off: vi.fn()
    };
}

function createParent (events)
{
    return {
        events: events || createMockEvents()
    };
}

function createManager ()
{
    var events = createMockEvents();
    var parent = createParent(events);
    var manager = new DataManager(parent);
    return manager;
}

describe('DataManager', function ()
{
    describe('constructor', function ()
    {
        it('should set parent from argument', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            expect(manager.parent).toBe(parent);
        });

        it('should use the provided eventEmitter argument', function ()
        {
            var events = createMockEvents();
            var customEvents = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent, customEvents);
            expect(manager.events).toBe(customEvents);
        });

        it('should fall back to parent.events when no eventEmitter provided', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            expect(manager.events).toBe(events);
        });

        it('should fall back to parent itself when parent has no events property', function ()
        {
            var parent = createMockEvents();
            var manager = new DataManager(parent);
            expect(manager.events).toBe(parent);
        });

        it('should initialise list as empty object', function ()
        {
            var manager = createManager();
            expect(manager.list).toEqual({});
        });

        it('should initialise values as empty object', function ()
        {
            var manager = createManager();
            expect(manager.values).toEqual({});
        });

        it('should initialise _frozen as false', function ()
        {
            var manager = createManager();
            expect(manager._frozen).toBe(false);
        });

        it('should register a destroy listener when parent has no sys property', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            new DataManager(parent);
            expect(events.once).toHaveBeenCalled();
        });

        it('should not register a destroy listener when parent has sys property', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            parent.sys = {};
            new DataManager(parent);
            expect(events.once).not.toHaveBeenCalled();
        });
    });

    describe('get', function ()
    {
        it('should return the value for a given key', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            expect(manager.get('gold')).toBe(100);
        });

        it('should return undefined for a key that does not exist', function ()
        {
            var manager = createManager();
            expect(manager.get('missing')).toBeUndefined();
        });

        it('should return an array of values when given an array of keys', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('armor', 50);
            manager.set('health', 200);
            var result = manager.get(['gold', 'armor', 'health']);
            expect(result).toEqual([100, 50, 200]);
        });

        it('should return undefined entries in the array for missing keys', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var result = manager.get(['gold', 'missing']);
            expect(result[0]).toBe(100);
            expect(result[1]).toBeUndefined();
        });

        it('should preserve the order of values matching the input key array', function ()
        {
            var manager = createManager();
            manager.set('a', 1);
            manager.set('b', 2);
            manager.set('c', 3);
            var result = manager.get(['c', 'a', 'b']);
            expect(result).toEqual([3, 1, 2]);
        });

        it('should return string values correctly', function ()
        {
            var manager = createManager();
            manager.set('name', 'hero');
            expect(manager.get('name')).toBe('hero');
        });

        it('should return object values correctly', function ()
        {
            var manager = createManager();
            var obj = { x: 1, y: 2 };
            manager.set('pos', obj);
            expect(manager.get('pos')).toBe(obj);
        });
    });

    describe('getAll', function ()
    {
        it('should return an empty object when no data is set', function ()
        {
            var manager = createManager();
            expect(manager.getAll()).toEqual({});
        });

        it('should return all key-value pairs', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            var result = manager.getAll();
            expect(result.gold).toBe(100);
            expect(result.health).toBe(200);
        });

        it('should return a new object, not the internal list', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var result = manager.getAll();
            result.gold = 999;
            expect(manager.get('gold')).toBe(100);
        });
    });

    describe('query', function ()
    {
        it('should return matching keys based on a regular expression', function ()
        {
            var manager = createManager();
            manager.set('playerGold', 100);
            manager.set('playerHealth', 200);
            manager.set('enemyGold', 50);
            var result = manager.query(/^player/);
            expect(result.playerGold).toBe(100);
            expect(result.playerHealth).toBe(200);
            expect(result.enemyGold).toBeUndefined();
        });

        it('should return an empty object when no keys match', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var result = manager.query(/^xyz/);
            expect(result).toEqual({});
        });

        it('should return all matching keys', function ()
        {
            var manager = createManager();
            manager.set('score1', 10);
            manager.set('score2', 20);
            manager.set('level', 3);
            var result = manager.query(/score/);
            expect(Object.keys(result).length).toBe(2);
            expect(result.score1).toBe(10);
            expect(result.score2).toBe(20);
        });
    });

    describe('set', function ()
    {
        it('should set a value for a string key', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            expect(manager.get('gold')).toBe(100);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.set('gold', 100);
            expect(result).toBe(manager);
        });

        it('should accept an object of key-value pairs', function ()
        {
            var manager = createManager();
            manager.set({ gold: 100, health: 200, name: 'hero' });
            expect(manager.get('gold')).toBe(100);
            expect(manager.get('health')).toBe(200);
            expect(manager.get('name')).toBe('hero');
        });

        it('should update an existing key value', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('gold', 200);
            expect(manager.get('gold')).toBe(200);
        });

        it('should not update when frozen', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.setFreeze(true);
            manager.set('gold', 999);
            expect(manager.get('gold')).toBe(100);
        });

        it('should not add new keys when frozen', function ()
        {
            var manager = createManager();
            manager.setFreeze(true);
            manager.set('gold', 100);
            expect(manager.has('gold')).toBe(false);
        });

        it('should emit SET_DATA event for a new key', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            manager.set('gold', 100);
            var emitCalls = events.emit.mock.calls;
            var setDataCall = emitCalls.find(function (call) { return call[0] === 'setdata'; });
            expect(setDataCall).toBeDefined();
        });

        it('should emit CHANGE_DATA event for an existing key', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            manager.set('gold', 100);
            events.emit.mockClear();
            manager.set('gold', 200);
            var emitCalls = events.emit.mock.calls;
            var changeDataCall = emitCalls.find(function (call) { return call[0] === 'changedata'; });
            expect(changeDataCall).toBeDefined();
        });

        it('should store values accessible via the values object', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            expect(manager.values.gold).toBe(100);
        });
    });

    describe('inc', function ()
    {
        it('should increment an existing value by 1 by default', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.inc('gold');
            expect(manager.get('gold')).toBe(101);
        });

        it('should increment by a given amount', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.inc('gold', 50);
            expect(manager.get('gold')).toBe(150);
        });

        it('should create the key with value 0 then increment when key does not exist', function ()
        {
            var manager = createManager();
            manager.inc('gold');
            expect(manager.get('gold')).toBe(1);
        });

        it('should decrement when a negative amount is given', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.inc('gold', -10);
            expect(manager.get('gold')).toBe(90);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.inc('gold', 1);
            expect(result).toBe(manager);
        });

        it('should not increment when frozen', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.setFreeze(true);
            manager.inc('gold', 10);
            expect(manager.get('gold')).toBe(100);
        });
    });

    describe('toggle', function ()
    {
        it('should toggle a boolean value from true to false', function ()
        {
            var manager = createManager();
            manager.set('active', true);
            manager.toggle('active');
            expect(manager.get('active')).toBe(false);
        });

        it('should toggle a boolean value from false to true', function ()
        {
            var manager = createManager();
            manager.set('active', false);
            manager.toggle('active');
            expect(manager.get('active')).toBe(true);
        });

        it('should create the key as true when key does not exist (toggling undefined)', function ()
        {
            var manager = createManager();
            manager.toggle('active');
            expect(manager.get('active')).toBe(true);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.toggle('active');
            expect(result).toBe(manager);
        });

        it('should not toggle when frozen', function ()
        {
            var manager = createManager();
            manager.set('active', true);
            manager.setFreeze(true);
            manager.toggle('active');
            expect(manager.get('active')).toBe(true);
        });
    });

    describe('each', function ()
    {
        it('should call the callback for each entry', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            var keys = [];
            manager.each(function (parent, key, value)
            {
                keys.push(key);
            });
            expect(keys).toContain('gold');
            expect(keys).toContain('health');
        });

        it('should pass parent, key, and value to the callback', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var receivedParent, receivedKey, receivedValue;
            manager.each(function (parent, key, value)
            {
                receivedParent = parent;
                receivedKey = key;
                receivedValue = value;
            });
            expect(receivedParent).toBe(manager.parent);
            expect(receivedKey).toBe('gold');
            expect(receivedValue).toBe(100);
        });

        it('should pass additional arguments to the callback', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var extraArgs = [];
            manager.each(function (parent, key, value, ctx, extra1, extra2)
            {
                extraArgs.push(extra1, extra2);
            }, null, 'foo', 'bar');
            expect(extraArgs).toContain('foo');
            expect(extraArgs).toContain('bar');
        });

        it('should call the callback with the given context', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var context = { name: 'ctx' };
            var receivedThis;
            manager.each(function ()
            {
                receivedThis = this;
            }, context);
            expect(receivedThis).toBe(context);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.each(function () {});
            expect(result).toBe(manager);
        });

        it('should not call the callback when the list is empty', function ()
        {
            var manager = createManager();
            var count = 0;
            manager.each(function () { count++; });
            expect(count).toBe(0);
        });
    });

    describe('merge', function ()
    {
        it('should merge new keys from a data object', function ()
        {
            var manager = createManager();
            manager.merge({ gold: 100, health: 200 });
            expect(manager.get('gold')).toBe(100);
            expect(manager.get('health')).toBe(200);
        });

        it('should overwrite existing keys by default', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.merge({ gold: 999 });
            expect(manager.get('gold')).toBe(999);
        });

        it('should not overwrite existing keys when overwrite is false', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.merge({ gold: 999, health: 200 }, false);
            expect(manager.get('gold')).toBe(100);
            expect(manager.get('health')).toBe(200);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.merge({ gold: 100 });
            expect(result).toBe(manager);
        });
    });

    describe('remove', function ()
    {
        it('should remove a key from the list', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.remove('gold');
            expect(manager.has('gold')).toBe(false);
        });

        it('should remove multiple keys when given an array', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            manager.set('armor', 50);
            manager.remove(['gold', 'health']);
            expect(manager.has('gold')).toBe(false);
            expect(manager.has('health')).toBe(false);
            expect(manager.has('armor')).toBe(true);
        });

        it('should do nothing for a key that does not exist', function ()
        {
            var manager = createManager();
            expect(function ()
            {
                manager.remove('missing');
            }).not.toThrow();
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var result = manager.remove('gold');
            expect(result).toBe(manager);
        });

        it('should not remove when frozen', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.setFreeze(true);
            manager.remove('gold');
            expect(manager.has('gold')).toBe(true);
        });

        it('should emit REMOVE_DATA event', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            manager.set('gold', 100);
            events.emit.mockClear();
            manager.remove('gold');
            var emitCalls = events.emit.mock.calls;
            var removeDataCall = emitCalls.find(function (call) { return call[0] === 'removedata'; });
            expect(removeDataCall).toBeDefined();
        });

        it('should also remove the key from the values object', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.remove('gold');
            expect(manager.values.gold).toBeUndefined();
        });
    });

    describe('pop', function ()
    {
        it('should return the value for the given key', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            var value = manager.pop('gold');
            expect(value).toBe(100);
        });

        it('should remove the key after popping', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.pop('gold');
            expect(manager.has('gold')).toBe(false);
        });

        it('should return undefined for a key that does not exist', function ()
        {
            var manager = createManager();
            var value = manager.pop('missing');
            expect(value).toBeUndefined();
        });

        it('should return undefined when frozen', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.setFreeze(true);
            var value = manager.pop('gold');
            expect(value).toBeUndefined();
        });

        it('should not remove the key when frozen', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.setFreeze(true);
            manager.pop('gold');
            expect(manager.has('gold')).toBe(true);
        });
    });

    describe('has', function ()
    {
        it('should return true for an existing key', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            expect(manager.has('gold')).toBe(true);
        });

        it('should return false for a key that does not exist', function ()
        {
            var manager = createManager();
            expect(manager.has('missing')).toBe(false);
        });

        it('should be case-sensitive', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            expect(manager.has('Gold')).toBe(false);
            expect(manager.has('GOLD')).toBe(false);
        });

        it('should return false after a key is removed', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.remove('gold');
            expect(manager.has('gold')).toBe(false);
        });
    });

    describe('setFreeze', function ()
    {
        it('should set _frozen to true', function ()
        {
            var manager = createManager();
            manager.setFreeze(true);
            expect(manager._frozen).toBe(true);
        });

        it('should set _frozen to false', function ()
        {
            var manager = createManager();
            manager.setFreeze(true);
            manager.setFreeze(false);
            expect(manager._frozen).toBe(false);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.setFreeze(true);
            expect(result).toBe(manager);
        });

        it('should expose frozen state via the freeze getter', function ()
        {
            var manager = createManager();
            manager.setFreeze(true);
            expect(manager.freeze).toBe(true);
        });
    });

    describe('freeze property', function ()
    {
        it('should get the frozen state', function ()
        {
            var manager = createManager();
            expect(manager.freeze).toBe(false);
        });

        it('should set the frozen state via the setter', function ()
        {
            var manager = createManager();
            manager.freeze = true;
            expect(manager._frozen).toBe(true);
        });

        it('should coerce truthy values to true', function ()
        {
            var manager = createManager();
            manager.freeze = 1;
            expect(manager._frozen).toBe(true);
        });

        it('should coerce falsy values to false', function ()
        {
            var manager = createManager();
            manager.freeze = true;
            manager.freeze = 0;
            expect(manager._frozen).toBe(false);
        });
    });

    describe('reset', function ()
    {
        it('should delete all keys from list', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            manager.reset();
            expect(manager.has('gold')).toBe(false);
            expect(manager.has('health')).toBe(false);
        });

        it('should set _frozen to false', function ()
        {
            var manager = createManager();
            manager.setFreeze(true);
            manager.reset();
            expect(manager._frozen).toBe(false);
        });

        it('should return the DataManager instance', function ()
        {
            var manager = createManager();
            var result = manager.reset();
            expect(result).toBe(manager);
        });

        it('should result in a count of zero', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            manager.reset();
            expect(manager.count).toBe(0);
        });
    });

    describe('destroy', function ()
    {
        it('should clear all data from the list', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.destroy();
            expect(Object.keys(manager.list).length).toBe(0);
        });

        it('should set parent to null', function ()
        {
            var manager = createManager();
            manager.destroy();
            expect(manager.parent).toBeNull();
        });

        it('should call events.off for data events', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            manager.destroy();
            expect(events.off).toHaveBeenCalled();
        });
    });

    describe('count property', function ()
    {
        it('should return zero for an empty DataManager', function ()
        {
            var manager = createManager();
            expect(manager.count).toBe(0);
        });

        it('should return the number of entries', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            expect(manager.count).toBe(2);
        });

        it('should decrease after a key is removed', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.set('health', 200);
            manager.remove('gold');
            expect(manager.count).toBe(1);
        });

        it('should not count undefined values', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.list['hidden'] = undefined;
            expect(manager.count).toBe(1);
        });
    });

    describe('values proxy', function ()
    {
        it('should reflect set values via the values object', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            expect(manager.values.gold).toBe(100);
        });

        it('should emit change events when updating via values object', function ()
        {
            var events = createMockEvents();
            var parent = createParent(events);
            var manager = new DataManager(parent);
            manager.set('gold', 100);
            events.emit.mockClear();
            manager.values.gold = 200;
            var emitCalls = events.emit.mock.calls;
            var changeDataCall = emitCalls.find(function (call) { return call[0] === 'changedata'; });
            expect(changeDataCall).toBeDefined();
        });

        it('should update the list when values object is written to', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.values.gold = 999;
            expect(manager.list.gold).toBe(999);
        });

        it('should not update the list when frozen and values object is written to', function ()
        {
            var manager = createManager();
            manager.set('gold', 100);
            manager.setFreeze(true);
            manager.values.gold = 999;
            expect(manager.list.gold).toBe(100);
        });
    });
});
