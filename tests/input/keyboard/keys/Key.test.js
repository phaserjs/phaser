var Key = require('../../../../src/input/keyboard/keys/Key');
var Events = require('../../../../src/input/keyboard/events');

function mockPlugin(loopTime)
{
    return {
        game: {
            loop: {
                time: loopTime || 0
            }
        }
    };
}

function mockEvent(overrides)
{
    return Object.assign({
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        metaKey: false,
        location: 0,
        timeStamp: 0
    }, overrides);
}

describe('Key', function ()
{
    var plugin;
    var key;

    beforeEach(function ()
    {
        plugin = mockPlugin(1000);
        key = new Key(plugin, 65);
    });

    afterEach(function ()
    {
        if (key.plugin)
        {
            key.destroy();
        }
    });

    describe('constructor', function ()
    {
        it('should set plugin reference', function ()
        {
            expect(key.plugin).toBe(plugin);
        });

        it('should set keyCode', function ()
        {
            expect(key.keyCode).toBe(65);
        });

        it('should default originalEvent to undefined', function ()
        {
            expect(key.originalEvent).toBeUndefined();
        });

        it('should default enabled to true', function ()
        {
            expect(key.enabled).toBe(true);
        });

        it('should default isDown to false', function ()
        {
            expect(key.isDown).toBe(false);
        });

        it('should default isUp to true', function ()
        {
            expect(key.isUp).toBe(true);
        });

        it('should default altKey to false', function ()
        {
            expect(key.altKey).toBe(false);
        });

        it('should default ctrlKey to false', function ()
        {
            expect(key.ctrlKey).toBe(false);
        });

        it('should default shiftKey to false', function ()
        {
            expect(key.shiftKey).toBe(false);
        });

        it('should default metaKey to false', function ()
        {
            expect(key.metaKey).toBe(false);
        });

        it('should default location to 0', function ()
        {
            expect(key.location).toBe(0);
        });

        it('should default timeDown to 0', function ()
        {
            expect(key.timeDown).toBe(0);
        });

        it('should default duration to 0', function ()
        {
            expect(key.duration).toBe(0);
        });

        it('should default timeUp to 0', function ()
        {
            expect(key.timeUp).toBe(0);
        });

        it('should default emitOnRepeat to false', function ()
        {
            expect(key.emitOnRepeat).toBe(false);
        });

        it('should default repeats to 0', function ()
        {
            expect(key.repeats).toBe(0);
        });
    });

    describe('setEmitOnRepeat', function ()
    {
        it('should set emitOnRepeat to true', function ()
        {
            key.setEmitOnRepeat(true);
            expect(key.emitOnRepeat).toBe(true);
        });

        it('should set emitOnRepeat to false', function ()
        {
            key.emitOnRepeat = true;
            key.setEmitOnRepeat(false);
            expect(key.emitOnRepeat).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var result = key.setEmitOnRepeat(true);
            expect(result).toBe(key);
        });
    });

    describe('onDown', function ()
    {
        it('should store originalEvent', function ()
        {
            var event = mockEvent({ timeStamp: 500 });
            key.onDown(event);
            expect(key.originalEvent).toBe(event);
        });

        it('should set isDown to true on first press', function ()
        {
            key.onDown(mockEvent({ timeStamp: 100 }));
            expect(key.isDown).toBe(true);
        });

        it('should set isUp to false on first press', function ()
        {
            key.onDown(mockEvent({ timeStamp: 100 }));
            expect(key.isUp).toBe(false);
        });

        it('should record timeDown from event timestamp', function ()
        {
            key.onDown(mockEvent({ timeStamp: 250 }));
            expect(key.timeDown).toBe(250);
        });

        it('should reset duration to 0 on press', function ()
        {
            key.duration = 999;
            key.onDown(mockEvent({ timeStamp: 100 }));
            expect(key.duration).toBe(0);
        });

        it('should copy modifier keys from event', function ()
        {
            key.onDown(mockEvent({ altKey: true, ctrlKey: true, shiftKey: true, metaKey: true, location: 1 }));
            expect(key.altKey).toBe(true);
            expect(key.ctrlKey).toBe(true);
            expect(key.shiftKey).toBe(true);
            expect(key.metaKey).toBe(true);
            expect(key.location).toBe(1);
        });

        it('should increment repeats on each call', function ()
        {
            key.onDown(mockEvent());
            key.onDown(mockEvent());
            key.onDown(mockEvent());
            expect(key.repeats).toBe(3);
        });

        it('should emit DOWN event on first press', function ()
        {
            var called = false;
            key.on(Events.DOWN, function () { called = true; });
            key.onDown(mockEvent());
            expect(called).toBe(true);
        });

        it('should not emit DOWN event on repeat when emitOnRepeat is false', function ()
        {
            var count = 0;
            key.on(Events.DOWN, function () { count++; });
            key.onDown(mockEvent());
            key.onDown(mockEvent());
            key.onDown(mockEvent());
            expect(count).toBe(1);
        });

        it('should emit DOWN event on repeat when emitOnRepeat is true', function ()
        {
            key.setEmitOnRepeat(true);
            var count = 0;
            key.on(Events.DOWN, function () { count++; });
            key.onDown(mockEvent());
            key.onDown(mockEvent());
            key.onDown(mockEvent());
            expect(count).toBe(3);
        });

        it('should do nothing if not enabled', function ()
        {
            key.enabled = false;
            key.onDown(mockEvent({ timeStamp: 100 }));
            expect(key.isDown).toBe(false);
            expect(key.repeats).toBe(0);
        });

        it('should still store originalEvent even when disabled', function ()
        {
            key.enabled = false;
            var event = mockEvent();
            key.onDown(event);
            expect(key.originalEvent).toBe(event);
        });

        it('should pass key and event to DOWN listener', function ()
        {
            var receivedKey = null;
            var receivedEvent = null;
            key.on(Events.DOWN, function (k, e) { receivedKey = k; receivedEvent = e; });
            var event = mockEvent();
            key.onDown(event);
            expect(receivedKey).toBe(key);
            expect(receivedEvent).toBe(event);
        });
    });

    describe('onUp', function ()
    {
        it('should store originalEvent', function ()
        {
            var event = mockEvent({ timeStamp: 500 });
            key.onUp(event);
            expect(key.originalEvent).toBe(event);
        });

        it('should set isDown to false', function ()
        {
            key.isDown = true;
            key.onUp(mockEvent({ timeStamp: 500 }));
            expect(key.isDown).toBe(false);
        });

        it('should set isUp to true', function ()
        {
            key.isUp = false;
            key.onUp(mockEvent({ timeStamp: 500 }));
            expect(key.isUp).toBe(true);
        });

        it('should record timeUp from event timestamp', function ()
        {
            key.onUp(mockEvent({ timeStamp: 800 }));
            expect(key.timeUp).toBe(800);
        });

        it('should calculate duration as timeUp minus timeDown', function ()
        {
            key.onDown(mockEvent({ timeStamp: 200 }));
            key.onUp(mockEvent({ timeStamp: 700 }));
            expect(key.duration).toBe(500);
        });

        it('should reset repeats to 0', function ()
        {
            key.repeats = 5;
            key.onUp(mockEvent({ timeStamp: 500 }));
            expect(key.repeats).toBe(0);
        });

        it('should emit UP event', function ()
        {
            var called = false;
            key.on(Events.UP, function () { called = true; });
            key.onUp(mockEvent());
            expect(called).toBe(true);
        });

        it('should do nothing if not enabled', function ()
        {
            key.enabled = false;
            key.isDown = true;
            key.isUp = false;
            key.onUp(mockEvent({ timeStamp: 500 }));
            expect(key.isDown).toBe(true);
            expect(key.isUp).toBe(false);
        });

        it('should still store originalEvent even when disabled', function ()
        {
            key.enabled = false;
            var event = mockEvent();
            key.onUp(event);
            expect(key.originalEvent).toBe(event);
        });

        it('should pass key and event to UP listener', function ()
        {
            var receivedKey = null;
            var receivedEvent = null;
            key.on(Events.UP, function (k, e) { receivedKey = k; receivedEvent = e; });
            var event = mockEvent();
            key.onUp(event);
            expect(receivedKey).toBe(key);
            expect(receivedEvent).toBe(event);
        });
    });

    describe('reset', function ()
    {
        it('should set isDown to false', function ()
        {
            key.isDown = true;
            key.reset();
            expect(key.isDown).toBe(false);
        });

        it('should set isUp to true', function ()
        {
            key.isUp = false;
            key.reset();
            expect(key.isUp).toBe(true);
        });

        it('should clear altKey', function ()
        {
            key.altKey = true;
            key.reset();
            expect(key.altKey).toBe(false);
        });

        it('should clear ctrlKey', function ()
        {
            key.ctrlKey = true;
            key.reset();
            expect(key.ctrlKey).toBe(false);
        });

        it('should clear shiftKey', function ()
        {
            key.shiftKey = true;
            key.reset();
            expect(key.shiftKey).toBe(false);
        });

        it('should clear metaKey', function ()
        {
            key.metaKey = true;
            key.reset();
            expect(key.metaKey).toBe(false);
        });

        it('should reset timeDown to 0', function ()
        {
            key.timeDown = 500;
            key.reset();
            expect(key.timeDown).toBe(0);
        });

        it('should reset duration to 0', function ()
        {
            key.duration = 300;
            key.reset();
            expect(key.duration).toBe(0);
        });

        it('should reset timeUp to 0', function ()
        {
            key.timeUp = 800;
            key.reset();
            expect(key.timeUp).toBe(0);
        });

        it('should reset repeats to 0', function ()
        {
            key.repeats = 7;
            key.reset();
            expect(key.repeats).toBe(0);
        });

        it('should not reset enabled flag', function ()
        {
            key.enabled = false;
            key.reset();
            expect(key.enabled).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var result = key.reset();
            expect(result).toBe(key);
        });

        it('should reset state after a down/up cycle', function ()
        {
            key.onDown(mockEvent({ timeStamp: 100, altKey: true }));
            key.onUp(mockEvent({ timeStamp: 400 }));
            key.reset();
            expect(key.isDown).toBe(false);
            expect(key.isUp).toBe(true);
            expect(key.altKey).toBe(false);
            expect(key.duration).toBe(0);
            expect(key.repeats).toBe(0);
        });
    });

    describe('getDuration', function ()
    {
        it('should return 0 when key is not down', function ()
        {
            expect(key.getDuration()).toBe(0);
        });

        it('should return elapsed time since key was pressed when down', function ()
        {
            key.onDown(mockEvent({ timeStamp: 800 }));
            plugin.game.loop.time = 1000;
            expect(key.getDuration()).toBe(200);
        });

        it('should return 0 after key is released', function ()
        {
            key.onDown(mockEvent({ timeStamp: 800 }));
            key.onUp(mockEvent({ timeStamp: 900 }));
            expect(key.getDuration()).toBe(0);
        });

        it('should update as loop time advances', function ()
        {
            key.onDown(mockEvent({ timeStamp: 0 }));
            plugin.game.loop.time = 500;
            expect(key.getDuration()).toBe(500);
            plugin.game.loop.time = 1500;
            expect(key.getDuration()).toBe(1500);
        });
    });

    describe('destroy', function ()
    {
        it('should set plugin to null', function ()
        {
            key.destroy();
            expect(key.plugin).toBeNull();
        });

        it('should set originalEvent to null', function ()
        {
            key.originalEvent = mockEvent();
            key.destroy();
            expect(key.originalEvent).toBeNull();
        });

        it('should remove all event listeners', function ()
        {
            var count = 0;
            key.on(Events.DOWN, function () { count++; });
            key.destroy();
            key.emit(Events.DOWN);
            expect(count).toBe(0);
        });
    });
});
