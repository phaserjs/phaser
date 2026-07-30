var EventEmitter = require('eventemitter3');
var Timeline = require('../../src/time/Timeline');

function createMockScene ()
{
    var sysEvents = new EventEmitter();

    return {
        sys: {
            events: sysEvents,
            tweens: { add: vi.fn(function () { return { paused: false, stop: vi.fn() }; }) },
            sound: { play: vi.fn() }
        }
    };
}

function createTimeline (config)
{
    var scene = createMockScene();
    return new Timeline(scene, config);
}

describe('Timeline', function ()
{
    describe('constructor', function ()
    {
        it('should set default property values', function ()
        {
            var tl = createTimeline();

            expect(tl.elapsed).toBe(0);
            expect(tl.timeScale).toBe(1);
            expect(tl.paused).toBe(true);
            expect(tl.complete).toBe(false);
            expect(tl.totalComplete).toBe(0);
            expect(tl.loop).toBe(0);
            expect(tl.iteration).toBe(0);
            expect(Array.isArray(tl.events)).toBe(true);
            expect(tl.events.length).toBe(0);
        });

        it('should store the scene and systems references', function ()
        {
            var scene = createMockScene();
            var tl = new Timeline(scene);

            expect(tl.scene).toBe(scene);
            expect(tl.systems).toBe(scene.sys);
        });

        it('should add events when config is provided as an object', function ()
        {
            var tl = createTimeline({ at: 500, run: function () {} });

            expect(tl.events.length).toBe(1);
            expect(tl.events[0].time).toBe(500);
        });

        it('should add events when config is provided as an array', function ()
        {
            var tl = createTimeline([
                { at: 100 },
                { at: 200 },
                { at: 300 }
            ]);

            expect(tl.events.length).toBe(3);
        });

        it('should register listeners on the scene event emitter', function ()
        {
            var scene = createMockScene();
            var listenerCount = scene.sys.events.listenerCount('preupdate');

            new Timeline(scene);

            expect(scene.sys.events.listenerCount('preupdate')).toBeGreaterThan(listenerCount);
        });
    });

    describe('preUpdate', function ()
    {
        it('should increase elapsed by delta when not paused', function ()
        {
            var tl = createTimeline();
            tl.paused = false;

            tl.preUpdate(0, 16);

            expect(tl.elapsed).toBe(16);
        });

        it('should accumulate elapsed over multiple calls', function ()
        {
            var tl = createTimeline();
            tl.paused = false;

            tl.preUpdate(0, 16);
            tl.preUpdate(16, 16);
            tl.preUpdate(32, 16);

            expect(tl.elapsed).toBe(48);
        });

        it('should not increase elapsed when paused', function ()
        {
            var tl = createTimeline();
            tl.paused = true;

            tl.preUpdate(0, 16);

            expect(tl.elapsed).toBe(0);
        });

        it('should scale delta by timeScale', function ()
        {
            var tl = createTimeline();
            tl.paused = false;
            tl.timeScale = 2;

            tl.preUpdate(0, 16);

            expect(tl.elapsed).toBe(32);
        });

        it('should apply timeScale of 0.5 correctly', function ()
        {
            var tl = createTimeline();
            tl.paused = false;
            tl.timeScale = 0.5;

            tl.preUpdate(0, 100);

            expect(tl.elapsed).toBe(50);
        });

        it('should freeze time when timeScale is 0', function ()
        {
            var tl = createTimeline();
            tl.paused = false;
            tl.timeScale = 0;

            tl.preUpdate(0, 16);

            expect(tl.elapsed).toBe(0);
        });
    });

    describe('update', function ()
    {
        it('should not process events when paused', function ()
        {
            var ran = false;
            var tl = createTimeline({ at: 0, run: function () { ran = true; } });
            tl.paused = true;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ran).toBe(false);
        });

        it('should not process events when complete', function ()
        {
            var ran = false;
            var tl = createTimeline({ at: 0, run: function () { ran = true; } });
            tl.paused = false;
            tl.complete = true;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ran).toBe(false);
        });

        it('should fire an event when elapsed >= event.time', function ()
        {
            var ran = false;
            var tl = createTimeline({ at: 100, run: function () { ran = true; } });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ran).toBe(true);
        });

        it('should not fire an event when elapsed < event.time', function ()
        {
            var ran = false;
            var tl = createTimeline({ at: 200, run: function () { ran = true; } });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ran).toBe(false);
        });

        it('should increment totalComplete when an event fires', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(tl.totalComplete).toBe(1);
        });

        it('should mark the event as complete after firing', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(tl.events[0].complete).toBe(true);
        });

        it('should set complete=true when all events have fired', function ()
        {
            var tl = createTimeline([{ at: 0 }, { at: 50 }]);
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(tl.complete).toBe(true);
        });

        it('should not set complete when some events have not yet fired', function ()
        {
            var tl = createTimeline([{ at: 50 }, { at: 200 }]);
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(tl.complete).toBe(false);
        });

        it('should remove once events after they fire', function ()
        {
            var tl = createTimeline({ at: 0, once: true });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(tl.events.length).toBe(0);
        });

        it('should emit the event name when event.event is set', function ()
        {
            var tl = createTimeline({ at: 0, event: 'MY_EVENT' });
            tl.paused = false;
            tl.elapsed = 100;

            var emitted = false;
            tl.on('MY_EVENT', function () { emitted = true; });

            tl.update(0, 0);

            expect(emitted).toBe(true);
        });

        it('should call run with target as context when target is set', function ()
        {
            var target = { name: 'myTarget' };
            var ctx = null;
            var tl = createTimeline({ at: 0, run: function () { ctx = this; }, target: target });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ctx).toBe(target);
        });

        it('should apply set properties to target', function ()
        {
            var target = { x: 0, y: 0 };
            var tl = createTimeline({ at: 0, target: target, set: { x: 42, y: 99 } });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(target.x).toBe(42);
            expect(target.y).toBe(99);
        });

        it('should call stop when event.stop is true', function ()
        {
            var tl = createTimeline({ at: 0, stop: true });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(tl.paused).toBe(true);
            expect(tl.complete).toBe(true);
        });

        it('should skip event when if callback returns false', function ()
        {
            var ran = false;
            var tl = createTimeline({
                at: 0,
                if: function () { return false; },
                run: function () { ran = true; }
            });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ran).toBe(false);
        });

        it('should run event when if callback returns true', function ()
        {
            var ran = false;
            var tl = createTimeline({
                at: 0,
                if: function () { return true; },
                run: function () { ran = true; }
            });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);

            expect(ran).toBe(true);
        });

        it('should emit COMPLETE event when all events are done', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.paused = false;
            tl.elapsed = 100;

            var completed = false;
            tl.on('complete', function () { completed = true; });

            tl.update(0, 0);

            expect(completed).toBe(true);
        });

        it('should not fire an event that is already complete', function ()
        {
            var count = 0;
            var tl = createTimeline({ at: 0, run: function () { count++; } });
            tl.paused = false;
            tl.elapsed = 100;

            tl.update(0, 0);
            tl.update(0, 0);

            expect(count).toBe(1);
        });

        it('should loop the timeline when loop is set', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.paused = false;
            tl.elapsed = 100;
            tl.loop = 1;

            tl.update(0, 0);

            expect(tl.iteration).toBe(1);
            expect(tl.elapsed).toBe(0);
            expect(tl.complete).toBe(false);
        });

        it('should stop looping when iteration reaches loop count', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.paused = false;
            tl.elapsed = 100;
            tl.loop = 1;
            tl.iteration = 1;

            tl.update(0, 0);

            expect(tl.complete).toBe(true);
        });

        it('should loop indefinitely when loop is -1', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.paused = false;
            tl.elapsed = 100;
            tl.loop = -1;
            tl.iteration = 100;

            tl.update(0, 0);

            expect(tl.iteration).toBe(101);
            expect(tl.complete).toBe(false);
        });
    });

    describe('play', function ()
    {
        it('should set paused to false', function ()
        {
            var tl = createTimeline();
            tl.paused = true;

            tl.play();

            expect(tl.paused).toBe(false);
        });

        it('should set complete to false', function ()
        {
            var tl = createTimeline();
            tl.complete = true;

            tl.play();

            expect(tl.complete).toBe(false);
        });

        it('should reset totalComplete to zero', function ()
        {
            var tl = createTimeline();
            tl.totalComplete = 5;

            tl.play();

            expect(tl.totalComplete).toBe(0);
        });

        it('should reset elapsed to zero when fromStart is true', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.elapsed = 999;

            tl.play(true);

            expect(tl.elapsed).toBe(0);
        });

        it('should not reset elapsed when fromStart is false', function ()
        {
            var tl = createTimeline();
            tl.elapsed = 500;
            tl.paused = false;

            tl.play(false);

            expect(tl.elapsed).toBe(500);
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.play();

            expect(result).toBe(tl);
        });
    });

    describe('pause', function ()
    {
        it('should set paused to true', function ()
        {
            var tl = createTimeline();
            tl.paused = false;

            tl.pause();

            expect(tl.paused).toBe(true);
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.pause();

            expect(result).toBe(tl);
        });

        it('should pause any active tween instances', function ()
        {
            var tweenInstance = { paused: false, stop: vi.fn() };
            var tl = createTimeline({ at: 0, tween: {} });
            tl.events[0].tweenInstance = tweenInstance;
            tl.paused = false;

            tl.pause();

            expect(tweenInstance.paused).toBe(true);
        });
    });

    describe('repeat', function ()
    {
        it('should set loop to -1 when called with no arguments', function ()
        {
            var tl = createTimeline();
            tl.repeat();

            expect(tl.loop).toBe(-1);
        });

        it('should set loop to -1 when called with true', function ()
        {
            var tl = createTimeline();
            tl.repeat(true);

            expect(tl.loop).toBe(-1);
        });

        it('should set loop to 0 when called with false', function ()
        {
            var tl = createTimeline();
            tl.loop = -1;
            tl.repeat(false);

            expect(tl.loop).toBe(0);
        });

        it('should set loop to -1 when called with a negative number', function ()
        {
            var tl = createTimeline();
            tl.repeat(-5);

            expect(tl.loop).toBe(-5);
        });

        it('should set loop to the given positive number', function ()
        {
            var tl = createTimeline();
            tl.repeat(3);

            expect(tl.loop).toBe(3);
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.repeat();

            expect(result).toBe(tl);
        });
    });

    describe('resume', function ()
    {
        it('should set paused to false', function ()
        {
            var tl = createTimeline();
            tl.paused = true;

            tl.resume();

            expect(tl.paused).toBe(false);
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.resume();

            expect(result).toBe(tl);
        });

        it('should resume any paused tween instances', function ()
        {
            var tweenInstance = { paused: true, stop: vi.fn() };
            var tl = createTimeline({ at: 0 });
            tl.events[0].tweenInstance = tweenInstance;

            tl.resume();

            expect(tweenInstance.paused).toBe(false);
        });
    });

    describe('stop', function ()
    {
        it('should set paused to true', function ()
        {
            var tl = createTimeline();
            tl.paused = false;

            tl.stop();

            expect(tl.paused).toBe(true);
        });

        it('should set complete to true', function ()
        {
            var tl = createTimeline();
            tl.complete = false;

            tl.stop();

            expect(tl.complete).toBe(true);
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.stop();

            expect(result).toBe(tl);
        });
    });

    describe('reset', function ()
    {
        it('should reset elapsed to zero', function ()
        {
            var tl = createTimeline();
            tl.elapsed = 500;

            tl.reset();

            expect(tl.elapsed).toBe(0);
        });

        it('should reset iteration to zero when loop is false', function ()
        {
            var tl = createTimeline();
            tl.iteration = 5;

            tl.reset();

            expect(tl.iteration).toBe(0);
        });

        it('should preserve iteration when loop is true', function ()
        {
            var tl = createTimeline();
            tl.iteration = 3;

            tl.reset(true);

            expect(tl.iteration).toBe(3);
        });

        it('should mark all events as incomplete', function ()
        {
            var tl = createTimeline([{ at: 0 }, { at: 100 }]);
            tl.events[0].complete = true;
            tl.events[1].complete = true;

            tl.reset();

            expect(tl.events[0].complete).toBe(false);
            expect(tl.events[1].complete).toBe(false);
        });

        it('should reset event repeat counts when loop is false', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.events[0].repeat = 3;

            tl.reset();

            expect(tl.events[0].repeat).toBe(0);
        });

        it('should preserve event repeat counts when loop is true', function ()
        {
            var tl = createTimeline({ at: 0 });
            tl.events[0].repeat = 3;

            tl.reset(true);

            expect(tl.events[0].repeat).toBe(3);
        });

        it('should stop any active tween instances', function ()
        {
            var tweenInstance = { paused: false, stop: vi.fn() };
            var tl = createTimeline({ at: 0 });
            tl.events[0].tweenInstance = tweenInstance;

            tl.reset();

            expect(tweenInstance.stop).toHaveBeenCalled();
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.reset();

            expect(result).toBe(tl);
        });
    });

    describe('add', function ()
    {
        it('should add a single event from a config object', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 500 });

            expect(tl.events.length).toBe(1);
        });

        it('should add multiple events from an array', function ()
        {
            var tl = createTimeline();
            tl.add([{ at: 100 }, { at: 200 }, { at: 300 }]);

            expect(tl.events.length).toBe(3);
        });

        it('should set event time from the at property', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 750 });

            expect(tl.events[0].time).toBe(750);
        });

        it('should default event time to 0 when at is not specified', function ()
        {
            var tl = createTimeline();
            tl.add({});

            expect(tl.events[0].time).toBe(0);
        });

        it('should calculate time from elapsed when in is specified', function ()
        {
            var tl = createTimeline();
            tl.elapsed = 200;
            tl.add({ in: 300 });

            expect(tl.events[0].time).toBe(500);
        });

        it('should calculate time relative to previous event when from is specified', function ()
        {
            var tl = createTimeline();
            tl.add([{ at: 500 }, { from: 200 }]);

            expect(tl.events[1].time).toBe(700);
        });

        it('should set event complete to false', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 0 });

            expect(tl.events[0].complete).toBe(false);
        });

        it('should set event repeat to 0', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 0 });

            expect(tl.events[0].repeat).toBe(0);
        });

        it('should store the run callback', function ()
        {
            var fn = function () {};
            var tl = createTimeline();
            tl.add({ at: 0, run: fn });

            expect(tl.events[0].run).toBe(fn);
        });

        it('should store the event name', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 0, event: 'MY_EVENT' });

            expect(tl.events[0].event).toBe('MY_EVENT');
        });

        it('should store the target reference', function ()
        {
            var target = { id: 1 };
            var tl = createTimeline();
            tl.add({ at: 0, target: target });

            expect(tl.events[0].target).toBe(target);
        });

        it('should set once to false by default', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 0 });

            expect(tl.events[0].once).toBe(false);
        });

        it('should set once to true when specified', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 0, once: true });

            expect(tl.events[0].once).toBe(true);
        });

        it('should set stop to false by default', function ()
        {
            var tl = createTimeline();
            tl.add({ at: 0 });

            expect(tl.events[0].stop).toBe(false);
        });

        it('should set complete to false on the timeline itself', function ()
        {
            var tl = createTimeline();
            tl.complete = true;
            tl.add({ at: 0 });

            expect(tl.complete).toBe(false);
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.add({ at: 0 });

            expect(result).toBe(tl);
        });
    });

    describe('clear', function ()
    {
        it('should remove all events', function ()
        {
            var tl = createTimeline([{ at: 0 }, { at: 100 }, { at: 200 }]);

            tl.clear();

            expect(tl.events.length).toBe(0);
        });

        it('should reset elapsed to zero', function ()
        {
            var tl = createTimeline();
            tl.elapsed = 999;

            tl.clear();

            expect(tl.elapsed).toBe(0);
        });

        it('should set paused to true', function ()
        {
            var tl = createTimeline();
            tl.paused = false;

            tl.clear();

            expect(tl.paused).toBe(true);
        });

        it('should stop any active tween instances', function ()
        {
            var tweenInstance = { paused: false, stop: vi.fn() };
            var tl = createTimeline({ at: 0 });
            tl.events[0].tweenInstance = tweenInstance;

            tl.clear();

            expect(tweenInstance.stop).toHaveBeenCalled();
        });

        it('should return the Timeline instance for chaining', function ()
        {
            var tl = createTimeline();
            var result = tl.clear();

            expect(result).toBe(tl);
        });
    });

    describe('isPlaying', function ()
    {
        it('should return false when paused is true', function ()
        {
            var tl = createTimeline();
            tl.paused = true;
            tl.complete = false;

            expect(tl.isPlaying()).toBe(false);
        });

        it('should return false when complete is true', function ()
        {
            var tl = createTimeline();
            tl.paused = false;
            tl.complete = true;

            expect(tl.isPlaying()).toBe(false);
        });

        it('should return false when both paused and complete are true', function ()
        {
            var tl = createTimeline();
            tl.paused = true;
            tl.complete = true;

            expect(tl.isPlaying()).toBe(false);
        });

        it('should return true when not paused and not complete', function ()
        {
            var tl = createTimeline();
            tl.paused = false;
            tl.complete = false;

            expect(tl.isPlaying()).toBe(true);
        });
    });

    describe('getProgress', function ()
    {
        it('should return 0 when no events have completed', function ()
        {
            var tl = createTimeline([{ at: 100 }, { at: 200 }, { at: 300 }]);

            expect(tl.getProgress()).toBe(0);
        });

        it('should return 0.5 when half of events have completed', function ()
        {
            var tl = createTimeline([{ at: 100 }, { at: 200 }]);
            tl.totalComplete = 1;

            expect(tl.getProgress()).toBe(0.5);
        });

        it('should return 1 when all events have completed', function ()
        {
            var tl = createTimeline([{ at: 100 }, { at: 200 }]);
            tl.totalComplete = 2;

            expect(tl.getProgress()).toBe(1);
        });

        it('should return NaN when there are no events', function ()
        {
            var tl = createTimeline();

            expect(isNaN(tl.getProgress())).toBe(true);
        });

        it('should cap progress at 1 even if totalComplete exceeds event count', function ()
        {
            var tl = createTimeline([{ at: 100 }, { at: 200 }]);
            tl.totalComplete = 10;

            expect(tl.getProgress()).toBe(1);
        });

        it('should return a value between 0 and 1 for partial progress', function ()
        {
            var tl = createTimeline([{ at: 100 }, { at: 200 }, { at: 300 }, { at: 400 }]);
            tl.totalComplete = 1;

            expect(tl.getProgress()).toBeCloseTo(0.25);
        });
    });

    describe('destroy', function ()
    {
        it('should set scene to null', function ()
        {
            var tl = createTimeline();
            tl.destroy();

            expect(tl.scene).toBeNull();
        });

        it('should set systems to null', function ()
        {
            var tl = createTimeline();
            tl.destroy();

            expect(tl.systems).toBeNull();
        });

        it('should clear all events', function ()
        {
            var tl = createTimeline([{ at: 0 }, { at: 100 }]);
            tl.destroy();

            expect(tl.events.length).toBe(0);
        });

        it('should remove listeners from the scene event emitter', function ()
        {
            var scene = createMockScene();
            var tl = new Timeline(scene);
            var listenerCountBefore = scene.sys.events.listenerCount('preupdate');

            tl.destroy();

            expect(scene.sys.events.listenerCount('preupdate')).toBeLessThan(listenerCountBefore);
        });
    });

    describe('chaining', function ()
    {
        it('should support method chaining for play, pause, resume, stop', function ()
        {
            var tl = createTimeline();

            var result = tl.play().pause().resume().stop();

            expect(result).toBe(tl);
        });

        it('should support chaining repeat and play', function ()
        {
            var tl = createTimeline({ at: 0 });

            var result = tl.repeat().play();

            expect(result).toBe(tl);
            expect(tl.loop).toBe(-1);
            expect(tl.paused).toBe(false);
        });
    });
});
