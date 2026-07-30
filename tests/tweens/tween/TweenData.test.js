var TweenData = require('../../../src/tweens/tween/TweenData');
var Events = require('../../../src/tweens/events');

function createMockTween (target)
{
    return {
        targets: [ target !== undefined ? target : { x: 0 } ],
        totalTargets: 1,
        duration: 0,
        startDelay: 999,
        isInfinite: false,
        isSeeking: false,
        isNumberTween: false,
        callbacks: {},
        callbackScope: null,
        emit: vi.fn()
    };
}

function createTweenData (tweenOverride, options)
{
    var opts = options || {};
    var tween = tweenOverride || createMockTween();
    var getEnd = opts.getEnd || function (t, k, v) { return 100; };
    var getStart = opts.getStart || function (t, k, v) { return 0; };
    var getActive = opts.getActive !== undefined ? opts.getActive : null;
    var ease = opts.ease || function (v) { return v; };
    var delay = opts.delay || function () { return 0; };
    var duration = opts.duration !== undefined ? opts.duration : 1000;
    var yoyo = opts.yoyo !== undefined ? opts.yoyo : false;
    var hold = opts.hold !== undefined ? opts.hold : 0;
    var repeat = opts.repeat !== undefined ? opts.repeat : 0;
    var repeatDelay = opts.repeatDelay !== undefined ? opts.repeatDelay : 0;
    var flipX = opts.flipX !== undefined ? opts.flipX : false;
    var flipY = opts.flipY !== undefined ? opts.flipY : false;
    var interpolation = opts.interpolation !== undefined ? opts.interpolation : null;
    var interpolationData = opts.interpolationData !== undefined ? opts.interpolationData : null;

    return new TweenData(
        tween,
        0,
        opts.key !== undefined ? opts.key : 'x',
        getEnd,
        getStart,
        getActive,
        ease,
        delay,
        duration,
        yoyo,
        hold,
        repeat,
        repeatDelay,
        flipX,
        flipY,
        interpolation,
        interpolationData
    );
}

describe('TweenData', function ()
{
    describe('constructor', function ()
    {
        it('should store the key property', function ()
        {
            var td = createTweenData(null, { key: 'alpha' });
            expect(td.key).toBe('alpha');
        });

        it('should store the ease function', function ()
        {
            var ease = function (v) { return v * v; };
            var td = createTweenData(null, { ease: ease });
            expect(td.ease).toBe(ease);
        });

        it('should store getEndValue callback', function ()
        {
            var getEnd = function () { return 200; };
            var td = createTweenData(null, { getEnd: getEnd });
            expect(td.getEndValue).toBe(getEnd);
        });

        it('should store getStartValue callback', function ()
        {
            var getStart = function () { return 50; };
            var td = createTweenData(null, { getStart: getStart });
            expect(td.getStartValue).toBe(getStart);
        });

        it('should store getActiveValue callback when provided', function ()
        {
            var getActive = function () { return 10; };
            var td = createTweenData(null, { getActive: getActive });
            expect(td.getActiveValue).toBe(getActive);
        });

        it('should set getActiveValue to null when not provided', function ()
        {
            var td = createTweenData(null, { getActive: null });
            expect(td.getActiveValue).toBeNull();
        });

        it('should initialise start, previous, current and end to zero', function ()
        {
            var td = createTweenData();
            expect(td.start).toBe(0);
            expect(td.previous).toBe(0);
            expect(td.current).toBe(0);
            expect(td.end).toBe(0);
        });

        it('should store interpolation function', function ()
        {
            var interp = function (data, v) { return v; };
            var td = createTweenData(null, { interpolation: interp });
            expect(td.interpolation).toBe(interp);
        });

        it('should store interpolationData array', function ()
        {
            var data = [ 0, 50, 100 ];
            var td = createTweenData(null, { interpolationData: data });
            expect(td.interpolationData).toBe(data);
        });

        it('should default interpolation and interpolationData to null', function ()
        {
            var td = createTweenData();
            expect(td.interpolation).toBeNull();
            expect(td.interpolationData).toBeNull();
        });

        it('should inherit tween and targetIndex from BaseTweenData', function ()
        {
            var tween = createMockTween();
            var td = createTweenData(tween);
            expect(td.tween).toBe(tween);
            expect(td.targetIndex).toBe(0);
        });

        it('should inherit yoyo, hold, repeat and repeatDelay from BaseTweenData', function ()
        {
            var td = createTweenData(null, { yoyo: true, hold: 200, repeat: 3, repeatDelay: 100 });
            expect(td.yoyo).toBe(true);
            expect(td.hold).toBe(200);
            expect(td.repeat).toBe(3);
            expect(td.repeatDelay).toBe(100);
        });

        it('should inherit flipX and flipY from BaseTweenData', function ()
        {
            var td = createTweenData(null, { flipX: true, flipY: true });
            expect(td.flipX).toBe(true);
            expect(td.flipY).toBe(true);
        });

        it('should set a minimum duration of 0.01 when duration is zero', function ()
        {
            var td = createTweenData(null, { duration: 0 });
            expect(td.duration).toBe(0.01);
        });

        it('should store the provided duration when positive', function ()
        {
            var td = createTweenData(null, { duration: 500 });
            expect(td.duration).toBe(500);
        });
    });

    describe('reset', function ()
    {
        it('should reset start, previous, current and end to zero', function ()
        {
            var td = createTweenData();
            td.start = 50;
            td.previous = 25;
            td.current = 75;
            td.end = 100;

            td.reset();

            expect(td.start).toBe(0);
            expect(td.previous).toBe(0);
            expect(td.current).toBe(0);
            expect(td.end).toBe(0);
        });

        it('should reset progress and elapsed to zero', function ()
        {
            var td = createTweenData();
            td.progress = 0.8;
            td.elapsed = 800;

            td.reset();

            expect(td.progress).toBe(0);
            expect(td.elapsed).toBe(0);
        });

        it('should set state to PENDING_RENDER when there is no delay', function ()
        {
            var td = createTweenData(null, { delay: function () { return 0; } });
            td.reset();
            expect(td.isPendingRender()).toBe(true);
        });

        it('should set state to DELAY when delay is greater than zero', function ()
        {
            var td = createTweenData(null, { delay: function () { return 500; } });
            td.reset();
            expect(td.isDelayed()).toBe(true);
        });

        it('should assign target[key] to this.start when isSeeking is true', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x' });
            td.start = 42;

            td.reset(true);

            expect(target.x).toBe(42);
        });

        it('should not assign target[key] to this.start when isSeeking is false', function ()
        {
            var target = { x: 99 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x' });
            td.start = 42;

            td.reset(false);

            // After reset, start is zeroed — isSeeking=false path does not write to target
            expect(td.start).toBe(0);
        });

        it('should call getActiveValue and apply it to target[key] when getActiveValue is set', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var getActive = vi.fn(function () { return 77; });
            var td = createTweenData(tween, { key: 'x', getActive: getActive });

            td.reset();

            expect(getActive).toHaveBeenCalled();
            expect(target.x).toBe(77);
        });

        it('should not call getActiveValue when it is null', function ()
        {
            var td = createTweenData(null, { getActive: null });
            // Should not throw
            expect(function () { td.reset(); }).not.toThrow();
        });
    });

    describe('update', function ()
    {
        it('should return false and set complete state when target is null', function ()
        {
            var tween = createMockTween(null);
            tween.targets = [ null ];
            var td = createTweenData(tween);

            td.setPlayingForwardState();
            var result = td.update(16);

            expect(result).toBe(false);
            expect(td.isComplete()).toBe(true);
        });

        it('should return false and set complete state when target isDestroyed', function ()
        {
            var target = { x: 0, isDestroyed: true };
            var tween = createMockTween(target);
            var td = createTweenData(tween);

            td.setPlayingForwardState();
            var result = td.update(16);

            expect(result).toBe(false);
            expect(td.isComplete()).toBe(true);
        });

        it('should initialise start, end and current during PENDING_RENDER and return true', function ()
        {
            var target = { x: 5 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, {
                key: 'x',
                getStart: function () { return 10; },
                getEnd: function () { return 200; }
            });

            td.setPendingRenderState();
            var result = td.update(0);

            expect(result).toBe(true);
            expect(td.start).toBe(10);
            expect(td.end).toBe(200);
            expect(td.current).toBe(10);
            expect(target.x).toBe(10);
            expect(td.isPlayingForward()).toBe(true);
        });

        it('should advance elapsed and progress when playing forward', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);   // PENDING_RENDER -> PLAYING_FORWARD

            td.update(500);

            expect(td.elapsed).toBe(500);
            expect(td.progress).toBeCloseTo(0.5);
        });

        it('should update target[key] to interpolated value when playing forward', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, {
                key: 'x',
                duration: 1000,
                ease: function (v) { return v; },
                getStart: function () { return 0; },
                getEnd: function () { return 100; }
            });

            td.setPendingRenderState();
            td.update(0);   // PENDING_RENDER -> PLAYING_FORWARD, start=0, end=100

            td.update(500);

            expect(td.current).toBeCloseTo(50);
            expect(target.x).toBeCloseTo(50);
        });

        it('should return true while still playing forward', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);

            var result = td.update(500);

            expect(result).toBe(true);
        });

        it('should return false when playback is complete (no repeat/yoyo)', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);
            td.update(1000);

            var result = td.update(0);

            expect(result).toBe(false);
        });

        it('should set state to COMPLETE when playback finishes with no yoyo or repeat', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);
            td.update(1000);

            expect(td.isComplete()).toBe(true);
        });

        it('should use interpolation function when set', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var interpData = [ 0, 50, 100 ];
            var interp = vi.fn(function (data, v) { return data[1]; });
            var td = createTweenData(tween, {
                key: 'x',
                duration: 1000,
                interpolation: interp,
                interpolationData: interpData
            });

            td.setPendingRenderState();
            td.update(0);
            td.update(500);

            expect(interp).toHaveBeenCalledWith(interpData, expect.any(Number));
            expect(target.x).toBe(50);
        });

        it('should clamp progress to 1 when elapsed exceeds duration', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);
            td.update(2000);

            expect(td.progress).toBeLessThanOrEqual(1);
        });

        it('should track previous value from the prior step', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);
            td.update(400);

            var afterFirst = td.current;

            td.update(200);

            expect(td.previous).toBe(afterFirst);
        });

        it('should dispatch TWEEN_UPDATE event while playing forward', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 1000 });

            td.setPendingRenderState();
            td.update(0);
            tween.emit.mockClear();
            td.update(500);

            expect(tween.emit).toHaveBeenCalledWith(
                Events.TWEEN_UPDATE,
                tween,
                'x',
                target,
                expect.any(Number),
                expect.any(Number)
            );
        });

        it('should set hold state when hold > 0 and forward playback completes', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            var td = createTweenData(tween, { key: 'x', duration: 500, hold: 200 });

            td.setPendingRenderState();
            td.update(0);
            td.update(500);

            expect(td.isHolding()).toBe(true);
        });
    });

    describe('dispatchEvent', function ()
    {
        it('should emit event on tween when not seeking', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            tween.isSeeking = false;
            var td = createTweenData(tween, { key: 'x' });
            td.current = 75;
            td.previous = 50;

            td.dispatchEvent(Events.TWEEN_UPDATE, null);

            expect(tween.emit).toHaveBeenCalledWith(
                Events.TWEEN_UPDATE,
                tween,
                'x',
                target,
                75,
                50
            );
        });

        it('should not emit event when isSeeking is true', function ()
        {
            var tween = createMockTween();
            tween.isSeeking = true;
            var td = createTweenData(tween);

            td.dispatchEvent(Events.TWEEN_UPDATE, null);

            expect(tween.emit).not.toHaveBeenCalled();
        });

        it('should invoke the named callback handler when it exists', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            tween.isSeeking = false;
            tween.callbackScope = {};
            var handlerFunc = vi.fn();
            tween.callbacks = {
                onUpdate: { func: handlerFunc, params: [] }
            };
            var td = createTweenData(tween);

            td.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');

            expect(handlerFunc).toHaveBeenCalled();
        });

        it('should not throw when callback name is null', function ()
        {
            var tween = createMockTween();
            tween.isSeeking = false;
            tween.callbacks = {};
            var td = createTweenData(tween);

            expect(function () { td.dispatchEvent(Events.TWEEN_UPDATE, null); }).not.toThrow();
        });

        it('should not throw when callback name refers to missing handler', function ()
        {
            var tween = createMockTween();
            tween.isSeeking = false;
            tween.callbacks = {};
            var td = createTweenData(tween);

            expect(function () { td.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate'); }).not.toThrow();
        });

        it('should pass extra handler params when provided', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween(target);
            tween.isSeeking = false;
            tween.callbackScope = {};
            var handlerFunc = vi.fn();
            tween.callbacks = {
                onUpdate: { func: handlerFunc, params: [ 'extra1', 'extra2' ] }
            };
            var td = createTweenData(tween);
            td.current = 10;
            td.previous = 5;

            td.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');

            var args = handlerFunc.mock.calls[0];
            expect(args).toContain('extra1');
            expect(args).toContain('extra2');
        });
    });

    describe('destroy', function ()
    {
        it('should null out getActiveValue', function ()
        {
            var td = createTweenData(null, { getActive: function () { return 0; } });
            td.destroy();
            expect(td.getActiveValue).toBeNull();
        });

        it('should null out getEndValue', function ()
        {
            var td = createTweenData();
            td.destroy();
            expect(td.getEndValue).toBeNull();
        });

        it('should null out getStartValue', function ()
        {
            var td = createTweenData();
            td.destroy();
            expect(td.getStartValue).toBeNull();
        });

        it('should null out ease', function ()
        {
            var td = createTweenData();
            td.destroy();
            expect(td.ease).toBeNull();
        });

        it('should null out tween reference via BaseTweenData destroy', function ()
        {
            var td = createTweenData();
            td.destroy();
            expect(td.tween).toBeNull();
        });

        it('should set state to COMPLETE via BaseTweenData destroy', function ()
        {
            var td = createTweenData();
            td.destroy();
            expect(td.isComplete()).toBe(true);
        });
    });
});
