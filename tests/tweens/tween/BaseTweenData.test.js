var BaseTweenData = require('../../../src/tweens/tween/BaseTweenData');
var TWEEN_CONST = require('../../../src/tweens/tween/const');

function makeTween (targets, overrides)
{
    var tween = {
        targets: targets || [ { x: 0 } ],
        totalTargets: targets ? targets.length : 1,
        duration: 0,
        startDelay: 99999,
        isInfinite: false,
        dispatchEvent: function () {}
    };

    if (overrides)
    {
        for (var k in overrides)
        {
            tween[k] = overrides[k];
        }
    }

    return tween;
}

function makeData (tweenOverrides, ctorOverrides)
{
    var opts = Object.assign({
        targetIndex: 0,
        delay: function () { return 0; },
        duration: 1000,
        yoyo: false,
        hold: 0,
        repeat: 0,
        repeatDelay: 0,
        flipX: false,
        flipY: false
    }, ctorOverrides || {});

    var tween = makeTween(null, tweenOverrides);

    var data = new BaseTweenData(
        tween,
        opts.targetIndex,
        opts.delay,
        opts.duration,
        opts.yoyo,
        opts.hold,
        opts.repeat,
        opts.repeatDelay,
        opts.flipX,
        opts.flipY
    );

    data.key = 'x';

    return data;
}

describe('BaseTweenData', function ()
{
    describe('constructor', function ()
    {
        it('should store the tween reference', function ()
        {
            var data = makeData();
            expect(data.tween).toBeDefined();
        });

        it('should store the targetIndex', function ()
        {
            var data = makeData(null, { targetIndex: 2 });
            expect(data.targetIndex).toBe(2);
        });

        it('should store duration when positive', function ()
        {
            var data = makeData(null, { duration: 500 });
            expect(data.duration).toBe(500);
        });

        it('should clamp duration to 0.01 when zero is given', function ()
        {
            var data = makeData(null, { duration: 0 });
            expect(data.duration).toBe(0.01);
        });

        it('should clamp duration to 0.01 when negative is given', function ()
        {
            var data = makeData(null, { duration: -100 });
            expect(data.duration).toBe(0.01);
        });

        it('should initialise totalDuration to 0', function ()
        {
            var data = makeData();
            expect(data.totalDuration).toBe(0);
        });

        it('should initialise delay to 0', function ()
        {
            var data = makeData();
            expect(data.delay).toBe(0);
        });

        it('should store the getDelay function', function ()
        {
            var fn = function () { return 200; };
            var data = makeData(null, { delay: fn });
            expect(data.getDelay).toBe(fn);
        });

        it('should store yoyo', function ()
        {
            var data = makeData(null, { yoyo: true });
            expect(data.yoyo).toBe(true);
        });

        it('should store hold', function ()
        {
            var data = makeData(null, { hold: 300 });
            expect(data.hold).toBe(300);
        });

        it('should store repeat', function ()
        {
            var data = makeData(null, { repeat: 3 });
            expect(data.repeat).toBe(3);
        });

        it('should store repeatDelay', function ()
        {
            var data = makeData(null, { repeatDelay: 250 });
            expect(data.repeatDelay).toBe(250);
        });

        it('should initialise repeatCounter to 0', function ()
        {
            var data = makeData();
            expect(data.repeatCounter).toBe(0);
        });

        it('should store flipX', function ()
        {
            var data = makeData(null, { flipX: true });
            expect(data.flipX).toBe(true);
        });

        it('should store flipY', function ()
        {
            var data = makeData(null, { flipY: true });
            expect(data.flipY).toBe(true);
        });

        it('should initialise progress to 0', function ()
        {
            var data = makeData();
            expect(data.progress).toBe(0);
        });

        it('should initialise elapsed to 0', function ()
        {
            var data = makeData();
            expect(data.elapsed).toBe(0);
        });

        it('should initialise state to 0 (CREATED)', function ()
        {
            var data = makeData();
            expect(data.state).toBe(0);
        });

        it('should initialise isCountdown to false', function ()
        {
            var data = makeData();
            expect(data.isCountdown).toBe(false);
        });
    });

    describe('getTarget', function ()
    {
        it('should return the correct target from the tween targets array', function ()
        {
            var target = { x: 10 };
            var tween = makeTween([ target ]);
            var data = new BaseTweenData(tween, 0, function () { return 0; }, 1000, false, 0, 0, 0, false, false);
            data.key = 'x';
            expect(data.getTarget()).toBe(target);
        });

        it('should return the target at the correct index', function ()
        {
            var t0 = { x: 0 };
            var t1 = { x: 1 };
            var tween = makeTween([ t0, t1 ]);
            var data = new BaseTweenData(tween, 1, function () { return 0; }, 1000, false, 0, 0, 0, false, false);
            data.key = 'x';
            expect(data.getTarget()).toBe(t1);
        });
    });

    describe('setTargetValue', function ()
    {
        it('should set the target property to the given value', function ()
        {
            var target = { x: 0 };
            var tween = makeTween([ target ]);
            var data = new BaseTweenData(tween, 0, function () { return 0; }, 1000, false, 0, 0, 0, false, false);
            data.key = 'x';
            data.setTargetValue(42);
            expect(target.x).toBe(42);
        });

        it('should use the current property when no value is given', function ()
        {
            var target = { x: 0 };
            var tween = makeTween([ target ]);
            var data = new BaseTweenData(tween, 0, function () { return 0; }, 1000, false, 0, 0, 0, false, false);
            data.key = 'x';
            data.current = 99;
            data.setTargetValue();
            expect(target.x).toBe(99);
        });
    });

    describe('setCreatedState', function ()
    {
        it('should set state to CREATED', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.state).toBe(TWEEN_CONST.CREATED);
        });

        it('should set isCountdown to false', function ()
        {
            var data = makeData();
            data.isCountdown = true;
            data.setCreatedState();
            expect(data.isCountdown).toBe(false);
        });
    });

    describe('setDelayState', function ()
    {
        it('should set state to DELAY', function ()
        {
            var data = makeData();
            data.setDelayState();
            expect(data.state).toBe(TWEEN_CONST.DELAY);
        });

        it('should set isCountdown to true', function ()
        {
            var data = makeData();
            data.setDelayState();
            expect(data.isCountdown).toBe(true);
        });
    });

    describe('setPendingRenderState', function ()
    {
        it('should set state to PENDING_RENDER', function ()
        {
            var data = makeData();
            data.setPendingRenderState();
            expect(data.state).toBe(TWEEN_CONST.PENDING_RENDER);
        });

        it('should set isCountdown to false', function ()
        {
            var data = makeData();
            data.isCountdown = true;
            data.setPendingRenderState();
            expect(data.isCountdown).toBe(false);
        });
    });

    describe('setPlayingForwardState', function ()
    {
        it('should set state to PLAYING_FORWARD', function ()
        {
            var data = makeData();
            data.setPlayingForwardState();
            expect(data.state).toBe(TWEEN_CONST.PLAYING_FORWARD);
        });

        it('should set isCountdown to false', function ()
        {
            var data = makeData();
            data.isCountdown = true;
            data.setPlayingForwardState();
            expect(data.isCountdown).toBe(false);
        });
    });

    describe('setPlayingBackwardState', function ()
    {
        it('should set state to PLAYING_BACKWARD', function ()
        {
            var data = makeData();
            data.setPlayingBackwardState();
            expect(data.state).toBe(TWEEN_CONST.PLAYING_BACKWARD);
        });

        it('should set isCountdown to false', function ()
        {
            var data = makeData();
            data.isCountdown = true;
            data.setPlayingBackwardState();
            expect(data.isCountdown).toBe(false);
        });
    });

    describe('setHoldState', function ()
    {
        it('should set state to HOLD_DELAY', function ()
        {
            var data = makeData();
            data.setHoldState();
            expect(data.state).toBe(TWEEN_CONST.HOLD_DELAY);
        });

        it('should set isCountdown to true', function ()
        {
            var data = makeData();
            data.setHoldState();
            expect(data.isCountdown).toBe(true);
        });
    });

    describe('setRepeatState', function ()
    {
        it('should set state to REPEAT_DELAY', function ()
        {
            var data = makeData();
            data.setRepeatState();
            expect(data.state).toBe(TWEEN_CONST.REPEAT_DELAY);
        });

        it('should set isCountdown to true', function ()
        {
            var data = makeData();
            data.setRepeatState();
            expect(data.isCountdown).toBe(true);
        });
    });

    describe('setCompleteState', function ()
    {
        it('should set state to COMPLETE', function ()
        {
            var data = makeData();
            data.setCompleteState();
            expect(data.state).toBe(TWEEN_CONST.COMPLETE);
        });

        it('should set isCountdown to false', function ()
        {
            var data = makeData();
            data.isCountdown = true;
            data.setCompleteState();
            expect(data.isCountdown).toBe(false);
        });
    });

    describe('isCreated', function ()
    {
        it('should return true when state is CREATED', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isCreated()).toBe(true);
        });

        it('should return false when state is not CREATED', function ()
        {
            var data = makeData();
            data.setDelayState();
            expect(data.isCreated()).toBe(false);
        });
    });

    describe('isDelayed', function ()
    {
        it('should return true when state is DELAY', function ()
        {
            var data = makeData();
            data.setDelayState();
            expect(data.isDelayed()).toBe(true);
        });

        it('should return false when state is not DELAY', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isDelayed()).toBe(false);
        });
    });

    describe('isPendingRender', function ()
    {
        it('should return true when state is PENDING_RENDER', function ()
        {
            var data = makeData();
            data.setPendingRenderState();
            expect(data.isPendingRender()).toBe(true);
        });

        it('should return false when state is not PENDING_RENDER', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isPendingRender()).toBe(false);
        });
    });

    describe('isPlayingForward', function ()
    {
        it('should return true when state is PLAYING_FORWARD', function ()
        {
            var data = makeData();
            data.setPlayingForwardState();
            expect(data.isPlayingForward()).toBe(true);
        });

        it('should return false when state is not PLAYING_FORWARD', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isPlayingForward()).toBe(false);
        });
    });

    describe('isPlayingBackward', function ()
    {
        it('should return true when state is PLAYING_BACKWARD', function ()
        {
            var data = makeData();
            data.setPlayingBackwardState();
            expect(data.isPlayingBackward()).toBe(true);
        });

        it('should return false when state is not PLAYING_BACKWARD', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isPlayingBackward()).toBe(false);
        });
    });

    describe('isHolding', function ()
    {
        it('should return true when state is HOLD_DELAY', function ()
        {
            var data = makeData();
            data.setHoldState();
            expect(data.isHolding()).toBe(true);
        });

        it('should return false when state is not HOLD_DELAY', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isHolding()).toBe(false);
        });
    });

    describe('isRepeating', function ()
    {
        it('should return true when state is REPEAT_DELAY', function ()
        {
            var data = makeData();
            data.setRepeatState();
            expect(data.isRepeating()).toBe(true);
        });

        it('should return false when state is not REPEAT_DELAY', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isRepeating()).toBe(false);
        });
    });

    describe('isComplete', function ()
    {
        it('should return true when state is COMPLETE', function ()
        {
            var data = makeData();
            data.setCompleteState();
            expect(data.isComplete()).toBe(true);
        });

        it('should return false when state is not COMPLETE', function ()
        {
            var data = makeData();
            data.setCreatedState();
            expect(data.isComplete()).toBe(false);
        });
    });

    describe('setStateFromEnd', function ()
    {
        it('should call setCompleteState when no yoyo and no repeatCounter', function ()
        {
            var data = makeData();
            data.repeatCounter = 0;
            data.yoyo = false;
            data.setStateFromEnd(0);
            expect(data.isComplete()).toBe(true);
        });

        it('should call onRepeat with isYoyo=true when yoyo is set', function ()
        {
            var data = makeData();
            data.yoyo = true;
            data.repeatCounter = 0;
            var called = false;
            var calledIsYoyo = false;
            data.onRepeat = function (diff, setStart, isYoyo)
            {
                called = true;
                calledIsYoyo = isYoyo;
            };
            data.setStateFromEnd(5);
            expect(called).toBe(true);
            expect(calledIsYoyo).toBe(true);
        });

        it('should call onRepeat with isYoyo=false when repeatCounter > 0 and no yoyo', function ()
        {
            var data = makeData();
            data.yoyo = false;
            data.repeatCounter = 2;
            var called = false;
            var calledIsYoyo = null;
            data.onRepeat = function (diff, setStart, isYoyo)
            {
                called = true;
                calledIsYoyo = isYoyo;
            };
            data.setStateFromEnd(3);
            expect(called).toBe(true);
            expect(calledIsYoyo).toBe(false);
        });

        it('should pass diff to onRepeat', function ()
        {
            var data = makeData();
            data.yoyo = true;
            data.repeatCounter = 0;
            var receivedDiff = null;
            data.onRepeat = function (diff) { receivedDiff = diff; };
            data.setStateFromEnd(12);
            expect(receivedDiff).toBe(12);
        });
    });

    describe('setStateFromStart', function ()
    {
        it('should call setCompleteState when repeatCounter is 0', function ()
        {
            var data = makeData();
            data.repeatCounter = 0;
            data.setStateFromStart(0);
            expect(data.isComplete()).toBe(true);
        });

        it('should call onRepeat when repeatCounter > 0', function ()
        {
            var data = makeData();
            data.repeatCounter = 1;
            var called = false;
            data.onRepeat = function () { called = true; };
            data.setStateFromStart(0);
            expect(called).toBe(true);
        });

        it('should pass diff to onRepeat', function ()
        {
            var data = makeData();
            data.repeatCounter = 1;
            var receivedDiff = null;
            data.onRepeat = function (diff) { receivedDiff = diff; };
            data.setStateFromStart(7);
            expect(receivedDiff).toBe(7);
        });
    });

    describe('reset', function ()
    {
        it('should reset progress to 0', function ()
        {
            var data = makeData();
            data.progress = 0.8;
            data.reset();
            expect(data.progress).toBe(0);
        });

        it('should reset elapsed to 0 when there is no delay', function ()
        {
            var data = makeData();
            data.elapsed = 500;
            data.reset();
            expect(data.elapsed).toBe(0);
        });

        it('should set state to PENDING_RENDER when delay is 0', function ()
        {
            var data = makeData();
            data.reset();
            expect(data.isPendingRender()).toBe(true);
        });

        it('should set repeatCounter to repeat value', function ()
        {
            var data = makeData(null, { repeat: 3 });
            data.reset();
            expect(data.repeatCounter).toBe(3);
        });

        it('should set repeatCounter to MAX when repeat is -1', function ()
        {
            var data = makeData(null, { repeat: -1 });
            data.reset();
            expect(data.repeatCounter).toBe(TWEEN_CONST.MAX);
        });

        it('should set state to DELAY and elapsed to delay amount when delay > 0', function ()
        {
            var data = makeData(null, { delay: function () { return 500; } });
            data.reset();
            expect(data.isDelayed()).toBe(true);
            expect(data.elapsed).toBe(500);
        });

        it('should update tween.duration when totalDuration exceeds it', function ()
        {
            var data = makeData(null, { duration: 2000 });
            data.tween.duration = 0;
            data.reset();
            expect(data.tween.duration).toBeGreaterThan(0);
        });

        it('should update tween.startDelay when delay is less than existing startDelay', function ()
        {
            var data = makeData(null, { delay: function () { return 100; } });
            data.tween.startDelay = 99999;
            data.reset();
            expect(data.tween.startDelay).toBe(100);
        });

        it('should compute totalDuration including duration and hold', function ()
        {
            var data = makeData(null, { duration: 400, hold: 100, yoyo: false, repeat: 0, repeatDelay: 0 });
            data.reset();
            // totalDuration = delay(0) + t1(duration + hold) = 0 + 500 = 500
            expect(data.totalDuration).toBe(500);
        });

        it('should add extra duration for yoyo in totalDuration', function ()
        {
            var data = makeData(null, { duration: 400, hold: 0, yoyo: true, repeat: 0, repeatDelay: 0 });
            data.reset();
            // t1 = duration + hold + duration = 800; totalDuration = 0 + 800 = 800
            expect(data.totalDuration).toBe(800);
        });

        it('should set tween.isInfinite when repeat is -1', function ()
        {
            var data = makeData(null, { repeat: -1 });
            data.reset();
            expect(data.tween.isInfinite).toBe(true);
        });
    });

    describe('onRepeat', function ()
    {
        function makeRepeatData (overrides)
        {
            var target = { x: 0, toggleFlipX: vi.fn(), toggleFlipY: vi.fn() };
            var tween = makeTween([ target ]);
            var opts = Object.assign({
                duration: 1000,
                yoyo: false,
                hold: 0,
                repeat: 2,
                repeatDelay: 0,
                flipX: false,
                flipY: false
            }, overrides || {});

            var data = new BaseTweenData(
                tween,
                0,
                function () { return 0; },
                opts.duration,
                opts.yoyo,
                opts.hold,
                opts.repeat,
                opts.repeatDelay,
                opts.flipX,
                opts.flipY
            );

            data.key = 'x';
            data.repeatCounter = opts.repeat;
            data.start = 0;
            data.current = 0;
            data.end = 100;
            data.getStartValue = function () { return 0; };
            data.getEndValue = function () { return 100; };
            data.dispatchEvent = vi.fn();

            return { data: data, target: target };
        }

        it('should set elapsed to diff', function ()
        {
            var r = makeRepeatData();
            r.data.onRepeat(15, false, false);
            expect(r.data.elapsed).toBe(15);
        });

        it('should set progress to diff / duration', function ()
        {
            var r = makeRepeatData({ duration: 1000 });
            r.data.onRepeat(100, false, false);
            expect(r.data.progress).toBeCloseTo(0.1);
        });

        it('should decrement repeatCounter', function ()
        {
            var r = makeRepeatData({ repeat: 3 });
            r.data.repeatCounter = 3;
            r.data.onRepeat(0, false, false);
            expect(r.data.repeatCounter).toBe(2);
        });

        it('should set state to PLAYING_FORWARD when repeatDelay is 0 and not yoyo', function ()
        {
            var r = makeRepeatData();
            r.data.onRepeat(0, false, false);
            expect(r.data.isPlayingForward()).toBe(true);
        });

        it('should set state to REPEAT_DELAY when repeatDelay > 0', function ()
        {
            var r = makeRepeatData({ repeatDelay: 200 });
            r.data.onRepeat(0, false, false);
            expect(r.data.isRepeating()).toBe(true);
        });

        it('should set state to PLAYING_BACKWARD when isYoyo is true', function ()
        {
            var r = makeRepeatData();
            r.data.onRepeat(0, true, true);
            expect(r.data.isPlayingBackward()).toBe(true);
        });

        it('should call toggleFlipX on target when flipX is true', function ()
        {
            var r = makeRepeatData({ flipX: true });
            r.data.onRepeat(0, false, false);
            expect(r.target.toggleFlipX).toHaveBeenCalled();
        });

        it('should not call toggleFlipX on target when flipX is false', function ()
        {
            var r = makeRepeatData({ flipX: false });
            r.data.onRepeat(0, false, false);
            expect(r.target.toggleFlipX).not.toHaveBeenCalled();
        });

        it('should call toggleFlipY on target when flipY is true', function ()
        {
            var r = makeRepeatData({ flipY: true });
            r.data.onRepeat(0, false, false);
            expect(r.target.toggleFlipY).toHaveBeenCalled();
        });

        it('should not call toggleFlipY on target when flipY is false', function ()
        {
            var r = makeRepeatData({ flipY: false });
            r.data.onRepeat(0, false, false);
            expect(r.target.toggleFlipY).not.toHaveBeenCalled();
        });

        it('should dispatch TWEEN_YOYO event when isYoyo is true', function ()
        {
            var r = makeRepeatData();
            r.data.onRepeat(0, true, true);
            expect(r.data.dispatchEvent).toHaveBeenCalled();
        });

        it('should dispatch TWEEN_REPEAT event when not yoyo and no repeatDelay', function ()
        {
            var r = makeRepeatData();
            r.data.onRepeat(0, false, false);
            expect(r.data.dispatchEvent).toHaveBeenCalled();
        });
    });

    describe('destroy', function ()
    {
        it('should null the tween reference', function ()
        {
            var data = makeData();
            data.destroy();
            expect(data.tween).toBeNull();
        });

        it('should null the getDelay function', function ()
        {
            var data = makeData();
            data.destroy();
            expect(data.getDelay).toBeNull();
        });

        it('should set state to COMPLETE', function ()
        {
            var data = makeData();
            data.destroy();
            expect(data.state).toBe(TWEEN_CONST.COMPLETE);
        });
    });
});
