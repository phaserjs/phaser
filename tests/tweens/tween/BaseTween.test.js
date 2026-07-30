var BaseTween = require('../../../src/tweens/tween/BaseTween');
var TWEEN_CONST = require('../../../src/tweens/tween/const');

function createParent ()
{
    return {
        makeActive: function () {},
        remove: function () {}
    };
}

function createTween (parent)
{
    if (parent === undefined) { parent = createParent(); }

    var tween = new BaseTween(parent);

    //  dispatchEvent is defined on subclasses; stub it here so methods don't throw
    tween.dispatchEvent = function () {};

    return tween;
}

describe('BaseTween', function ()
{
    describe('constructor', function ()
    {
        it('should store the parent reference', function ()
        {
            var parent = createParent();
            var tween = createTween(parent);

            expect(tween.parent).toBe(parent);
        });

        it('should initialise data as an empty array', function ()
        {
            var tween = createTween();

            expect(Array.isArray(tween.data)).toBe(true);
            expect(tween.data.length).toBe(0);
        });

        it('should initialise totalData to zero', function ()
        {
            var tween = createTween();

            expect(tween.totalData).toBe(0);
        });

        it('should initialise startDelay to zero', function ()
        {
            var tween = createTween();

            expect(tween.startDelay).toBe(0);
        });

        it('should initialise hasStarted to false', function ()
        {
            var tween = createTween();

            expect(tween.hasStarted).toBe(false);
        });

        it('should initialise timeScale to one', function ()
        {
            var tween = createTween();

            expect(tween.timeScale).toBe(1);
        });

        it('should initialise loop to zero', function ()
        {
            var tween = createTween();

            expect(tween.loop).toBe(0);
        });

        it('should initialise loopDelay to zero', function ()
        {
            var tween = createTween();

            expect(tween.loopDelay).toBe(0);
        });

        it('should initialise loopCounter to zero', function ()
        {
            var tween = createTween();

            expect(tween.loopCounter).toBe(0);
        });

        it('should initialise completeDelay to zero', function ()
        {
            var tween = createTween();

            expect(tween.completeDelay).toBe(0);
        });

        it('should initialise countdown to zero', function ()
        {
            var tween = createTween();

            expect(tween.countdown).toBe(0);
        });

        it('should initialise state to PENDING', function ()
        {
            var tween = createTween();

            expect(tween.state).toBe(TWEEN_CONST.PENDING);
        });

        it('should initialise paused to false', function ()
        {
            var tween = createTween();

            expect(tween.paused).toBe(false);
        });

        it('should initialise persist to false', function ()
        {
            var tween = createTween();

            expect(tween.persist).toBe(false);
        });

        it('should initialise all callbacks to null', function ()
        {
            var tween = createTween();

            expect(tween.callbacks.onActive).toBeNull();
            expect(tween.callbacks.onComplete).toBeNull();
            expect(tween.callbacks.onLoop).toBeNull();
            expect(tween.callbacks.onPause).toBeNull();
            expect(tween.callbacks.onRepeat).toBeNull();
            expect(tween.callbacks.onResume).toBeNull();
            expect(tween.callbacks.onStart).toBeNull();
            expect(tween.callbacks.onStop).toBeNull();
            expect(tween.callbacks.onUpdate).toBeNull();
            expect(tween.callbacks.onYoyo).toBeNull();
        });
    });

    describe('setTimeScale', function ()
    {
        it('should set timeScale to the given value', function ()
        {
            var tween = createTween();

            tween.setTimeScale(2);

            expect(tween.timeScale).toBe(2);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.setTimeScale(1)).toBe(tween);
        });

        it('should accept zero', function ()
        {
            var tween = createTween();

            tween.setTimeScale(0);

            expect(tween.timeScale).toBe(0);
        });

        it('should accept fractional values', function ()
        {
            var tween = createTween();

            tween.setTimeScale(0.5);

            expect(tween.timeScale).toBeCloseTo(0.5);
        });

        it('should accept negative values', function ()
        {
            var tween = createTween();

            tween.setTimeScale(-1);

            expect(tween.timeScale).toBe(-1);
        });
    });

    describe('getTimeScale', function ()
    {
        it('should return the current timeScale', function ()
        {
            var tween = createTween();

            expect(tween.getTimeScale()).toBe(1);
        });

        it('should reflect a value set via setTimeScale', function ()
        {
            var tween = createTween();

            tween.setTimeScale(3);

            expect(tween.getTimeScale()).toBe(3);
        });

        it('should return zero when timeScale is zero', function ()
        {
            var tween = createTween();

            tween.setTimeScale(0);

            expect(tween.getTimeScale()).toBe(0);
        });
    });

    describe('isPlaying', function ()
    {
        it('should return false when tween is in PENDING state', function ()
        {
            var tween = createTween();

            expect(tween.isPlaying()).toBe(false);
        });

        it('should return true when tween is ACTIVE and not paused', function ()
        {
            var tween = createTween();

            tween.setActiveState();

            expect(tween.isPlaying()).toBe(true);
        });

        it('should return false when tween is ACTIVE but paused', function ()
        {
            var tween = createTween();

            tween.setActiveState();
            tween.paused = true;

            expect(tween.isPlaying()).toBe(false);
        });

        it('should return false when tween is PENDING_REMOVE', function ()
        {
            var tween = createTween();

            tween.setPendingRemoveState();

            expect(tween.isPlaying()).toBe(false);
        });
    });

    describe('isPaused', function ()
    {
        it('should return false by default', function ()
        {
            var tween = createTween();

            expect(tween.isPaused()).toBe(false);
        });

        it('should return true after pausing', function ()
        {
            var tween = createTween();

            tween.paused = true;

            expect(tween.isPaused()).toBe(true);
        });

        it('should match the paused property directly', function ()
        {
            var tween = createTween();

            tween.paused = true;

            expect(tween.isPaused()).toBe(tween.paused);
        });
    });

    describe('pause', function ()
    {
        it('should set paused to true', function ()
        {
            var tween = createTween();

            tween.pause();

            expect(tween.paused).toBe(true);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.pause()).toBe(tween);
        });

        it('should dispatch an event when pausing', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.dispatchEvent = function () { dispatched = true; };
            tween.pause();

            expect(dispatched).toBe(true);
        });

        it('should not dispatch an event if already paused', function ()
        {
            var tween = createTween();
            var callCount = 0;

            tween.paused = true;
            tween.dispatchEvent = function () { callCount++; };
            tween.pause();

            expect(callCount).toBe(0);
        });

        it('should not change paused state if already paused', function ()
        {
            var tween = createTween();

            tween.paused = true;
            tween.pause();

            expect(tween.paused).toBe(true);
        });
    });

    describe('resume', function ()
    {
        it('should set paused to false when paused', function ()
        {
            var tween = createTween();

            tween.paused = true;
            tween.resume();

            expect(tween.paused).toBe(false);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            tween.paused = true;

            expect(tween.resume()).toBe(tween);
        });

        it('should dispatch an event when resuming', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.paused = true;
            tween.dispatchEvent = function () { dispatched = true; };
            tween.resume();

            expect(dispatched).toBe(true);
        });

        it('should not dispatch an event if not paused', function ()
        {
            var tween = createTween();
            var callCount = 0;

            tween.dispatchEvent = function () { callCount++; };
            tween.resume();

            expect(callCount).toBe(0);
        });

        it('should not change paused state if already unpaused', function ()
        {
            var tween = createTween();

            tween.resume();

            expect(tween.paused).toBe(false);
        });
    });

    describe('makeActive', function ()
    {
        it('should call parent.makeActive with this tween', function ()
        {
            var parent = createParent();
            var received = null;

            parent.makeActive = function (t) { received = t; };

            var tween = createTween(parent);

            tween.makeActive();

            expect(received).toBe(tween);
        });

        it('should dispatch an event', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.dispatchEvent = function () { dispatched = true; };
            tween.makeActive();

            expect(dispatched).toBe(true);
        });
    });

    describe('onCompleteHandler', function ()
    {
        it('should set state to PENDING_REMOVE', function ()
        {
            var tween = createTween();

            tween.onCompleteHandler();

            expect(tween.state).toBe(TWEEN_CONST.PENDING_REMOVE);
        });

        it('should dispatch a complete event', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.dispatchEvent = function () { dispatched = true; };
            tween.onCompleteHandler();

            expect(dispatched).toBe(true);
        });
    });

    describe('complete', function ()
    {
        it('should call onCompleteHandler when no delay is given', function ()
        {
            var tween = createTween();
            var called = false;

            tween.onCompleteHandler = function () { called = true; };
            tween.complete();

            expect(called).toBe(true);
        });

        it('should call onCompleteHandler when delay is zero', function ()
        {
            var tween = createTween();
            var called = false;

            tween.onCompleteHandler = function () { called = true; };
            tween.complete(0);

            expect(called).toBe(true);
        });

        it('should set state to COMPLETE_DELAY when a delay is given', function ()
        {
            var tween = createTween();

            tween.complete(500);

            expect(tween.state).toBe(TWEEN_CONST.COMPLETE_DELAY);
        });

        it('should set countdown to the delay value', function ()
        {
            var tween = createTween();

            tween.complete(500);

            expect(tween.countdown).toBe(500);
        });

        it('should not call onCompleteHandler immediately when delay is given', function ()
        {
            var tween = createTween();
            var called = false;

            tween.onCompleteHandler = function () { called = true; };
            tween.complete(500);

            expect(called).toBe(false);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.complete()).toBe(tween);
        });
    });

    describe('completeAfterLoop', function ()
    {
        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.completeAfterLoop()).toBe(tween);
        });

        it('should reduce loopCounter to the given loops value when loopCounter is greater', function ()
        {
            var tween = createTween();

            tween.loopCounter = 5;
            tween.completeAfterLoop(2);

            expect(tween.loopCounter).toBe(2);
        });

        it('should not change loopCounter when it is already equal to loops', function ()
        {
            var tween = createTween();

            tween.loopCounter = 2;
            tween.completeAfterLoop(2);

            expect(tween.loopCounter).toBe(2);
        });

        it('should not change loopCounter when it is less than loops', function ()
        {
            var tween = createTween();

            tween.loopCounter = 1;
            tween.completeAfterLoop(5);

            expect(tween.loopCounter).toBe(1);
        });

        it('should default loops to zero', function ()
        {
            var tween = createTween();

            tween.loopCounter = 3;
            tween.completeAfterLoop();

            expect(tween.loopCounter).toBe(0);
        });
    });

    describe('remove', function ()
    {
        it('should call parent.remove with this tween', function ()
        {
            var parent = createParent();
            var received = null;

            parent.remove = function (t) { received = t; };

            var tween = createTween(parent);

            tween.remove();

            expect(received).toBe(tween);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.remove()).toBe(tween);
        });

        it('should not throw when parent is null', function ()
        {
            var tween = createTween();

            tween.parent = null;

            expect(function () { tween.remove(); }).not.toThrow();
        });
    });

    describe('stop', function ()
    {
        it('should set state to PENDING_REMOVE when active', function ()
        {
            var tween = createTween();

            tween.setActiveState();
            tween.stop();

            expect(tween.state).toBe(TWEEN_CONST.PENDING_REMOVE);
        });

        it('should dispatch a stop event', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.setActiveState();
            tween.dispatchEvent = function () { dispatched = true; };
            tween.stop();

            expect(dispatched).toBe(true);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.stop()).toBe(tween);
        });

        it('should not dispatch when already in REMOVED state', function ()
        {
            var tween = createTween();
            var callCount = 0;

            tween.setRemovedState();
            tween.dispatchEvent = function () { callCount++; };
            tween.stop();

            expect(callCount).toBe(0);
        });

        it('should not dispatch when already in PENDING_REMOVE state', function ()
        {
            var tween = createTween();
            var callCount = 0;

            tween.setPendingRemoveState();
            tween.dispatchEvent = function () { callCount++; };
            tween.stop();

            expect(callCount).toBe(0);
        });

        it('should not dispatch when in DESTROYED state', function ()
        {
            var tween = createTween();
            var callCount = 0;

            tween.setDestroyedState();
            tween.dispatchEvent = function () { callCount++; };
            tween.stop();

            expect(callCount).toBe(0);
        });

        it('should not throw when parent is null', function ()
        {
            var tween = createTween();

            tween.parent = null;

            expect(function () { tween.stop(); }).not.toThrow();
        });
    });

    describe('updateLoopCountdown', function ()
    {
        it('should decrease countdown by delta', function ()
        {
            var tween = createTween();

            tween.countdown = 1000;
            tween.updateLoopCountdown(100);

            expect(tween.countdown).toBeCloseTo(900);
        });

        it('should set state to ACTIVE when countdown reaches zero', function ()
        {
            var tween = createTween();

            tween.countdown = 100;
            tween.updateLoopCountdown(100);

            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should set state to ACTIVE when countdown goes below zero', function ()
        {
            var tween = createTween();

            tween.countdown = 50;
            tween.updateLoopCountdown(100);

            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should dispatch a loop event when countdown expires', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.countdown = 100;
            tween.dispatchEvent = function () { dispatched = true; };
            tween.updateLoopCountdown(100);

            expect(dispatched).toBe(true);
        });

        it('should not change state when countdown is still positive', function ()
        {
            var tween = createTween();

            tween.setLoopDelayState();
            tween.countdown = 500;
            tween.updateLoopCountdown(100);

            expect(tween.state).toBe(TWEEN_CONST.LOOP_DELAY);
        });
    });

    describe('updateStartCountdown', function ()
    {
        it('should decrease countdown by delta', function ()
        {
            var tween = createTween();

            tween.countdown = 1000;
            tween.updateStartCountdown(200);

            expect(tween.countdown).toBeCloseTo(800);
        });

        it('should return the delta unchanged when countdown is still positive', function ()
        {
            var tween = createTween();

            tween.countdown = 1000;
            var result = tween.updateStartCountdown(200);

            expect(result).toBe(200);
        });

        it('should set state to ACTIVE (via setActiveState which resets hasStarted) when countdown expires', function ()
        {
            var tween = createTween();

            tween.countdown = 100;
            tween.updateStartCountdown(100);

            //  setActiveState() is called internally and resets hasStarted to false
            expect(tween.hasStarted).toBe(false);
            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should set state to ACTIVE when countdown expires', function ()
        {
            var tween = createTween();

            tween.countdown = 100;
            tween.updateStartCountdown(100);

            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should return zero delta when countdown expires', function ()
        {
            var tween = createTween();

            tween.countdown = 100;
            var result = tween.updateStartCountdown(100);

            expect(result).toBe(0);
        });

        it('should dispatch a start event when countdown expires', function ()
        {
            var tween = createTween();
            var dispatched = false;

            tween.countdown = 100;
            tween.dispatchEvent = function () { dispatched = true; };
            tween.updateStartCountdown(100);

            expect(dispatched).toBe(true);
        });

        it('should not set hasStarted when countdown is still positive', function ()
        {
            var tween = createTween();

            tween.countdown = 500;
            tween.hasStarted = false;
            tween.updateStartCountdown(100);

            expect(tween.hasStarted).toBe(false);
        });
    });

    describe('updateCompleteDelay', function ()
    {
        it('should decrease countdown by delta', function ()
        {
            var tween = createTween();

            tween.countdown = 1000;
            tween.updateCompleteDelay(300);

            expect(tween.countdown).toBeCloseTo(700);
        });

        it('should call onCompleteHandler when countdown expires', function ()
        {
            var tween = createTween();
            var called = false;

            tween.countdown = 100;
            tween.onCompleteHandler = function () { called = true; };
            tween.updateCompleteDelay(100);

            expect(called).toBe(true);
        });

        it('should not call onCompleteHandler when countdown is still positive', function ()
        {
            var tween = createTween();
            var called = false;

            tween.countdown = 500;
            tween.onCompleteHandler = function () { called = true; };
            tween.updateCompleteDelay(100);

            expect(called).toBe(false);
        });
    });

    describe('setCallback', function ()
    {
        it('should set a valid callback type', function ()
        {
            var tween = createTween();
            var fn = function () {};

            tween.setCallback('onComplete', fn, []);

            expect(tween.callbacks.onComplete.func).toBe(fn);
        });

        it('should store params with the callback', function ()
        {
            var tween = createTween();
            var fn = function () {};
            var params = [ 1, 2, 3 ];

            tween.setCallback('onComplete', fn, params);

            expect(tween.callbacks.onComplete.params).toBe(params);
        });

        it('should default params to an empty array when not provided', function ()
        {
            var tween = createTween();
            var fn = function () {};

            tween.setCallback('onStart', fn);

            expect(Array.isArray(tween.callbacks.onStart.params)).toBe(true);
            expect(tween.callbacks.onStart.params.length).toBe(0);
        });

        it('should return the tween instance for chaining', function ()
        {
            var tween = createTween();

            expect(tween.setCallback('onStart', function () {})).toBe(tween);
        });

        it('should not set an invalid callback type', function ()
        {
            var tween = createTween();
            var fn = function () {};

            tween.setCallback('onInvalid', fn, []);

            expect(tween.callbacks.hasOwnProperty('onInvalid')).toBe(false);
        });

        it('should replace a previously set callback', function ()
        {
            var tween = createTween();
            var fn1 = function () {};
            var fn2 = function () {};

            tween.setCallback('onLoop', fn1, []);
            tween.setCallback('onLoop', fn2, []);

            expect(tween.callbacks.onLoop.func).toBe(fn2);
        });

        it('should handle all valid callback types', function ()
        {
            var tween = createTween();
            var types = BaseTween.TYPES;

            for (var i = 0; i < types.length; i++)
            {
                var fn = function () {};

                tween.setCallback(types[i], fn, []);

                expect(tween.callbacks[types[i]].func).toBe(fn);
            }
        });
    });

    describe('setPendingState', function ()
    {
        it('should set state to PENDING', function ()
        {
            var tween = createTween();

            tween.setActiveState();
            tween.setPendingState();

            expect(tween.state).toBe(TWEEN_CONST.PENDING);
        });
    });

    describe('setActiveState', function ()
    {
        it('should set state to ACTIVE', function ()
        {
            var tween = createTween();

            tween.setActiveState();

            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should reset hasStarted to false', function ()
        {
            var tween = createTween();

            tween.hasStarted = true;
            tween.setActiveState();

            expect(tween.hasStarted).toBe(false);
        });
    });

    describe('setLoopDelayState', function ()
    {
        it('should set state to LOOP_DELAY', function ()
        {
            var tween = createTween();

            tween.setLoopDelayState();

            expect(tween.state).toBe(TWEEN_CONST.LOOP_DELAY);
        });
    });

    describe('setCompleteDelayState', function ()
    {
        it('should set state to COMPLETE_DELAY', function ()
        {
            var tween = createTween();

            tween.setCompleteDelayState();

            expect(tween.state).toBe(TWEEN_CONST.COMPLETE_DELAY);
        });
    });

    describe('setStartDelayState', function ()
    {
        it('should set state to START_DELAY', function ()
        {
            var tween = createTween();

            tween.setStartDelayState();

            expect(tween.state).toBe(TWEEN_CONST.START_DELAY);
        });

        it('should set countdown to startDelay', function ()
        {
            var tween = createTween();

            tween.startDelay = 750;
            tween.setStartDelayState();

            expect(tween.countdown).toBe(750);
        });

        it('should reset hasStarted to false', function ()
        {
            var tween = createTween();

            tween.hasStarted = true;
            tween.setStartDelayState();

            expect(tween.hasStarted).toBe(false);
        });
    });

    describe('setPendingRemoveState', function ()
    {
        it('should set state to PENDING_REMOVE', function ()
        {
            var tween = createTween();

            tween.setPendingRemoveState();

            expect(tween.state).toBe(TWEEN_CONST.PENDING_REMOVE);
        });
    });

    describe('setRemovedState', function ()
    {
        it('should set state to REMOVED', function ()
        {
            var tween = createTween();

            tween.setRemovedState();

            expect(tween.state).toBe(TWEEN_CONST.REMOVED);
        });
    });

    describe('setFinishedState', function ()
    {
        it('should set state to FINISHED', function ()
        {
            var tween = createTween();

            tween.setFinishedState();

            expect(tween.state).toBe(TWEEN_CONST.FINISHED);
        });
    });

    describe('setDestroyedState', function ()
    {
        it('should set state to DESTROYED', function ()
        {
            var tween = createTween();

            tween.setDestroyedState();

            expect(tween.state).toBe(TWEEN_CONST.DESTROYED);
        });
    });

    describe('state query methods', function ()
    {
        it('isPending should return true only when state is PENDING', function ()
        {
            var tween = createTween();

            expect(tween.isPending()).toBe(true);

            tween.setActiveState();

            expect(tween.isPending()).toBe(false);
        });

        it('isActive should return true only when state is ACTIVE', function ()
        {
            var tween = createTween();

            expect(tween.isActive()).toBe(false);

            tween.setActiveState();

            expect(tween.isActive()).toBe(true);
        });

        it('isLoopDelayed should return true only when state is LOOP_DELAY', function ()
        {
            var tween = createTween();

            expect(tween.isLoopDelayed()).toBe(false);

            tween.setLoopDelayState();

            expect(tween.isLoopDelayed()).toBe(true);
        });

        it('isCompleteDelayed should return true only when state is COMPLETE_DELAY', function ()
        {
            var tween = createTween();

            expect(tween.isCompleteDelayed()).toBe(false);

            tween.setCompleteDelayState();

            expect(tween.isCompleteDelayed()).toBe(true);
        });

        it('isStartDelayed should return true only when state is START_DELAY', function ()
        {
            var tween = createTween();

            expect(tween.isStartDelayed()).toBe(false);

            tween.setStartDelayState();

            expect(tween.isStartDelayed()).toBe(true);
        });

        it('isPendingRemove should return true only when state is PENDING_REMOVE', function ()
        {
            var tween = createTween();

            expect(tween.isPendingRemove()).toBe(false);

            tween.setPendingRemoveState();

            expect(tween.isPendingRemove()).toBe(true);
        });

        it('isRemoved should return true only when state is REMOVED', function ()
        {
            var tween = createTween();

            expect(tween.isRemoved()).toBe(false);

            tween.setRemovedState();

            expect(tween.isRemoved()).toBe(true);
        });

        it('isFinished should return true only when state is FINISHED', function ()
        {
            var tween = createTween();

            expect(tween.isFinished()).toBe(false);

            tween.setFinishedState();

            expect(tween.isFinished()).toBe(true);
        });

        it('isDestroyed should return true only when state is DESTROYED', function ()
        {
            var tween = createTween();

            expect(tween.isDestroyed()).toBe(false);

            tween.setDestroyedState();

            expect(tween.isDestroyed()).toBe(true);
        });

        it('only one state query method should return true at a time', function ()
        {
            var tween = createTween();

            tween.setActiveState();

            expect(tween.isPending()).toBe(false);
            expect(tween.isActive()).toBe(true);
            expect(tween.isLoopDelayed()).toBe(false);
            expect(tween.isCompleteDelayed()).toBe(false);
            expect(tween.isStartDelayed()).toBe(false);
            expect(tween.isPendingRemove()).toBe(false);
            expect(tween.isRemoved()).toBe(false);
            expect(tween.isFinished()).toBe(false);
            expect(tween.isDestroyed()).toBe(false);
        });
    });

    describe('destroy', function ()
    {
        it('should set state to DESTROYED', function ()
        {
            var tween = createTween();

            tween.destroy();

            expect(tween.state).toBe(TWEEN_CONST.DESTROYED);
        });

        it('should null out callbacks', function ()
        {
            var tween = createTween();

            tween.destroy();

            expect(tween.callbacks).toBeNull();
        });

        it('should null out data', function ()
        {
            var tween = createTween();

            tween.destroy();

            expect(tween.data).toBeNull();
        });

        it('should null out parent', function ()
        {
            var tween = createTween();

            tween.destroy();

            expect(tween.parent).toBeNull();
        });

        it('should call destroy on each item in data', function ()
        {
            var tween = createTween();
            var destroyCalled = false;
            var fakeData = { destroy: function () { destroyCalled = true; } };

            tween.data = [ fakeData ];
            tween.destroy();

            expect(destroyCalled).toBe(true);
        });

        it('should handle an empty data array without throwing', function ()
        {
            var tween = createTween();

            tween.data = [];

            expect(function () { tween.destroy(); }).not.toThrow();
        });

        it('isDestroyed should return true after destroy', function ()
        {
            var tween = createTween();

            tween.destroy();

            expect(tween.isDestroyed()).toBe(true);
        });
    });

    describe('TYPES static property', function ()
    {
        it('should be an array', function ()
        {
            expect(Array.isArray(BaseTween.TYPES)).toBe(true);
        });

        it('should contain all expected callback type names', function ()
        {
            var expected = [
                'onActive', 'onComplete', 'onLoop', 'onPause', 'onRepeat',
                'onResume', 'onStart', 'onStop', 'onUpdate', 'onYoyo'
            ];

            for (var i = 0; i < expected.length; i++)
            {
                expect(BaseTween.TYPES).toContain(expected[i]);
            }
        });

        it('should have 10 entries', function ()
        {
            expect(BaseTween.TYPES.length).toBe(10);
        });
    });
});
