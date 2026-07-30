var Clock = require('../../src/time/Clock');
var TimerEvent = require('../../src/time/TimerEvent');

function createMockScene ()
{
    var eventEmitter = {
        once: vi.fn(),
        on: vi.fn(),
        off: vi.fn()
    };

    return {
        sys: {
            events: eventEmitter,
            game: {
                loop: {
                    time: 0
                }
            }
        }
    };
}

describe('Clock', function ()
{
    var clock;
    var mockScene;

    beforeEach(function ()
    {
        mockScene = createMockScene();
        clock = new Clock(mockScene);
    });

    describe('constructor', function ()
    {
        it('should store the scene reference', function ()
        {
            expect(clock.scene).toBe(mockScene);
        });

        it('should store the scene systems reference', function ()
        {
            expect(clock.systems).toBe(mockScene.sys);
        });

        it('should initialise now to zero', function ()
        {
            expect(clock.now).toBe(0);
        });

        it('should initialise startTime to zero', function ()
        {
            expect(clock.startTime).toBe(0);
        });

        it('should initialise timeScale to one', function ()
        {
            expect(clock.timeScale).toBe(1);
        });

        it('should initialise paused to false', function ()
        {
            expect(clock.paused).toBe(false);
        });

        it('should register BOOT listener on scene events', function ()
        {
            expect(mockScene.sys.events.once).toHaveBeenCalledWith(
                expect.any(String),
                clock.boot,
                clock
            );
        });

        it('should register START listener on scene events', function ()
        {
            expect(mockScene.sys.events.on).toHaveBeenCalledWith(
                expect.any(String),
                clock.start,
                clock
            );
        });
    });

    describe('addEvent', function ()
    {
        it('should return a TimerEvent when given a config object', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });

            expect(event).toBeInstanceOf(TimerEvent);
        });

        it('should add the event to pending insertion', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });

            expect(clock._pendingInsertion).toContain(event);
        });

        it('should accept a TimerEvent instance and return it', function ()
        {
            var event = new TimerEvent({ delay: 500, callback: vi.fn() });
            var returned = clock.addEvent(event);

            expect(returned).toBe(event);
        });

        it('should reset hasDispatched when given a TimerEvent instance', function ()
        {
            var event = new TimerEvent({ delay: 500, callback: vi.fn() });
            event.hasDispatched = true;
            clock.addEvent(event);

            expect(event.hasDispatched).toBe(false);
        });

        it('should reset elapsed to startAt when given a TimerEvent instance', function ()
        {
            var event = new TimerEvent({ delay: 500, callback: vi.fn(), startAt: 100 });
            event.elapsed = 999;
            clock.addEvent(event);

            expect(event.elapsed).toBe(100);
        });

        it('should throw when given a TimerEvent with zero delay and infinite repeat', function ()
        {
            // Create a valid event first, then mutate to the invalid state
            // (TimerEvent also validates in its constructor, so we set properties afterward)
            var event = new TimerEvent({ delay: 100, callback: vi.fn() });
            event.delay = 0;
            event.loop = true;

            expect(function ()
            {
                clock.addEvent(event);
            }).toThrow('TimerEvent infinite loop created via zero delay');
        });

        it('should not add duplicate pending insertions for a re-added TimerEvent', function ()
        {
            var event = new TimerEvent({ delay: 500, callback: vi.fn() });
            clock.addEvent(event);
            clock.addEvent(event);

            // removeEvent is called in addEvent for instances, so it should only appear once
            var count = clock._pendingInsertion.filter(function (e) { return e === event; }).length;

            expect(count).toBe(1);
        });
    });

    describe('delayedCall', function ()
    {
        it('should return a TimerEvent', function ()
        {
            var event = clock.delayedCall(1000, vi.fn());

            expect(event).toBeInstanceOf(TimerEvent);
        });

        it('should create an event with the given delay', function ()
        {
            var event = clock.delayedCall(500, vi.fn());

            expect(event.delay).toBe(500);
        });

        it('should create an event with the given callback', function ()
        {
            var cb = vi.fn();
            var event = clock.delayedCall(500, cb);

            expect(event.callback).toBe(cb);
        });

        it('should create an event with the given args', function ()
        {
            var args = [1, 2, 3];
            var event = clock.delayedCall(500, vi.fn(), args);

            expect(event.args).toBe(args);
        });

        it('should create an event with the given callbackScope', function ()
        {
            var scope = { name: 'test' };
            var event = clock.delayedCall(500, vi.fn(), [], scope);

            expect(event.callbackScope).toBe(scope);
        });

        it('should add the event to pending insertion', function ()
        {
            var event = clock.delayedCall(1000, vi.fn());

            expect(clock._pendingInsertion).toContain(event);
        });
    });

    describe('clearPendingEvents', function ()
    {
        it('should return the Clock instance', function ()
        {
            expect(clock.clearPendingEvents()).toBe(clock);
        });

        it('should empty the pending insertion list', function ()
        {
            clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.addEvent({ delay: 2000, callback: vi.fn() });

            clock.clearPendingEvents();

            expect(clock._pendingInsertion.length).toBe(0);
        });

        it('should work when the pending list is already empty', function ()
        {
            expect(function ()
            {
                clock.clearPendingEvents();
            }).not.toThrow();

            expect(clock._pendingInsertion.length).toBe(0);
        });
    });

    describe('removeEvent', function ()
    {
        it('should return the Clock instance', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });

            expect(clock.removeEvent(event)).toBe(clock);
        });

        it('should remove a pending event from pending insertion', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });

            clock.removeEvent(event);

            expect(clock._pendingInsertion).not.toContain(event);
        });

        it('should remove an active event from the active list', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.preUpdate();

            clock.removeEvent(event);

            expect(clock._active).not.toContain(event);
        });

        it('should remove an event from pending removal', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.preUpdate();
            clock._pendingRemoval.push(event);

            clock.removeEvent(event);

            expect(clock._pendingRemoval).not.toContain(event);
        });

        it('should accept an array of events and remove all of them', function ()
        {
            var event1 = clock.addEvent({ delay: 1000, callback: vi.fn() });
            var event2 = clock.addEvent({ delay: 2000, callback: vi.fn() });

            clock.removeEvent([event1, event2]);

            expect(clock._pendingInsertion).not.toContain(event1);
            expect(clock._pendingInsertion).not.toContain(event2);
        });

        it('should handle removing an event not in any list without throwing', function ()
        {
            var event = new TimerEvent({ delay: 1000, callback: vi.fn() });

            expect(function ()
            {
                clock.removeEvent(event);
            }).not.toThrow();
        });
    });

    describe('removeAllEvents', function ()
    {
        it('should return the Clock instance', function ()
        {
            expect(clock.removeAllEvents()).toBe(clock);
        });

        it('should move all active events into the pending removal list', function ()
        {
            var event1 = clock.addEvent({ delay: 1000, callback: vi.fn() });
            var event2 = clock.addEvent({ delay: 2000, callback: vi.fn() });
            clock.preUpdate();

            clock.removeAllEvents();

            expect(clock._pendingRemoval).toContain(event1);
            expect(clock._pendingRemoval).toContain(event2);
        });

        it('should not clear the active list immediately', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.preUpdate();

            clock.removeAllEvents();

            // Active is still populated until next preUpdate
            expect(clock._active).toContain(event);
        });

        it('should remove active events from active list after next preUpdate', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.preUpdate();
            clock.removeAllEvents();
            clock.preUpdate();

            expect(clock._active).not.toContain(event);
        });

        it('should work when there are no active events', function ()
        {
            expect(function ()
            {
                clock.removeAllEvents();
            }).not.toThrow();
        });
    });

    describe('preUpdate', function ()
    {
        it('should move pending insertion events into the active list', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });

            clock.preUpdate();

            expect(clock._active).toContain(event);
            expect(clock._pendingInsertion.length).toBe(0);
        });

        it('should remove events in pending removal from the active list', function ()
        {
            var event = clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.preUpdate();
            clock._pendingRemoval.push(event);

            clock.preUpdate();

            expect(clock._active).not.toContain(event);
            expect(clock._pendingRemoval.length).toBe(0);
        });

        it('should clear both pending lists after processing', function ()
        {
            clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.addEvent({ delay: 2000, callback: vi.fn() });
            clock.preUpdate();

            clock.preUpdate();

            expect(clock._pendingInsertion.length).toBe(0);
        });

        it('should do nothing when both pending lists are empty', function ()
        {
            expect(function ()
            {
                clock.preUpdate();
            }).not.toThrow();
        });

        it('should handle multiple insertions in one preUpdate', function ()
        {
            clock.addEvent({ delay: 1000, callback: vi.fn() });
            clock.addEvent({ delay: 2000, callback: vi.fn() });
            clock.addEvent({ delay: 3000, callback: vi.fn() });

            clock.preUpdate();

            expect(clock._active.length).toBe(3);
        });
    });

    describe('update', function ()
    {
        it('should update the now property to the given time', function ()
        {
            clock.update(5000, 16);

            expect(clock.now).toBe(5000);
        });

        it('should update now even when paused', function ()
        {
            clock.paused = true;
            clock.update(9999, 16);

            expect(clock.now).toBe(9999);
        });

        it('should not advance events when the clock is paused', function ()
        {
            var cb = vi.fn();
            clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();
            clock.paused = true;
            clock.update(1000, 200);

            expect(cb).not.toHaveBeenCalled();
        });

        it('should fire the callback when elapsed reaches the delay', function ()
        {
            var cb = vi.fn();
            clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();
            clock.update(200, 100);

            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('should not fire the callback before the delay has elapsed', function ()
        {
            var cb = vi.fn();
            clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();
            clock.update(50, 50);

            expect(cb).not.toHaveBeenCalled();
        });

        it('should pass args to the callback', function ()
        {
            var cb = vi.fn();
            var args = ['a', 'b'];
            clock.addEvent({ delay: 100, callback: cb, args: args });
            clock.preUpdate();
            clock.update(200, 100);

            expect(cb).toHaveBeenCalledWith('a', 'b');
        });

        it('should call the callback with the correct scope', function ()
        {
            var scope = { value: 42 };
            var capturedThis;

            var cb = function ()
            {
                capturedThis = this;
            };

            clock.addEvent({ delay: 100, callback: cb, callbackScope: scope });
            clock.preUpdate();
            clock.update(200, 100);

            expect(capturedThis).toBe(scope);
        });

        it('should apply timeScale to delta', function ()
        {
            var cb = vi.fn();
            clock.timeScale = 2;
            clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();

            // delta 25 * timeScale 2 = 50, not enough
            clock.update(25, 25);
            expect(cb).not.toHaveBeenCalled();

            // delta 25 * timeScale 2 = 50, total 100 — fires now
            clock.update(50, 25);
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('should apply event timeScale to elapsed', function ()
        {
            var cb = vi.fn();
            clock.addEvent({ delay: 100, callback: cb, timeScale: 2 });
            clock.preUpdate();

            // delta 25 * event.timeScale 2 = 50
            clock.update(25, 25);
            expect(cb).not.toHaveBeenCalled();

            // delta 25 * event.timeScale 2 = 50, total 100 — fires
            clock.update(50, 25);
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('should not fire the callback again for a non-repeating event', function ()
        {
            var cb = vi.fn();
            clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();
            clock.update(200, 100);
            clock.update(400, 200);

            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('should schedule a non-repeating event for removal after it fires', function ()
        {
            var cb = vi.fn();
            var event = clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();
            clock.update(200, 100);

            expect(clock._pendingRemoval).toContain(event);
        });

        it('should fire a repeating event multiple times', function ()
        {
            var cb = vi.fn();
            clock.addEvent({ delay: 100, callback: cb, repeat: 2 });
            clock.preUpdate();

            clock.update(100, 100);
            clock.update(200, 100);
            clock.update(300, 100);

            expect(cb.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

        it('should skip paused events', function ()
        {
            var cb = vi.fn();
            var event = clock.addEvent({ delay: 100, callback: cb });
            clock.preUpdate();
            event.paused = true;
            clock.update(200, 200);

            expect(cb).not.toHaveBeenCalled();
        });

        it('should process multiple active events in one update', function ()
        {
            var cb1 = vi.fn();
            var cb2 = vi.fn();
            clock.addEvent({ delay: 100, callback: cb1 });
            clock.addEvent({ delay: 100, callback: cb2 });
            clock.preUpdate();
            clock.update(200, 100);

            expect(cb1).toHaveBeenCalledTimes(1);
            expect(cb2).toHaveBeenCalledTimes(1);
        });
    });
});
