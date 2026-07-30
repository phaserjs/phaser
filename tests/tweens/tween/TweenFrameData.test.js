var TweenFrameData = require('../../../src/tweens/tween/TweenFrameData');
var Events = require('../../../src/tweens/events');

function createMockTarget (textureKey, frameName)
{
    return {
        texture: { key: textureKey || 'startTexture' },
        frame: { name: frameName || 'startFrame' },
        setTexture: vi.fn(),
        toggleFlipX: vi.fn(),
        toggleFlipY: vi.fn()
    };
}

function createMockTween (target, options)
{
    options = options || {};
    var t = target || createMockTarget();
    return {
        targets: [ t ],
        totalTargets: 1,
        duration: 0,
        startDelay: 9999,
        isInfinite: false,
        isSeeking: false,
        emit: vi.fn(),
        callbacks: {},
        callbackScope: null
    };
}

function zeroDelay ()
{
    return 0;
}

function createFrameData (overrides)
{
    overrides = overrides || {};
    var target = overrides.target || createMockTarget();
    var tween = overrides.tween || createMockTween(target);
    var targetIndex = overrides.targetIndex !== undefined ? overrides.targetIndex : 0;
    var texture = overrides.texture !== undefined ? overrides.texture : 'endTexture';
    var frame = overrides.frame !== undefined ? overrides.frame : 'endFrame';
    var delay = overrides.delay !== undefined ? overrides.delay : zeroDelay;
    var duration = overrides.duration !== undefined ? overrides.duration : 500;
    var hold = overrides.hold !== undefined ? overrides.hold : 0;
    var repeat = overrides.repeat !== undefined ? overrides.repeat : 0;
    var repeatDelay = overrides.repeatDelay !== undefined ? overrides.repeatDelay : 0;
    var flipX = overrides.flipX !== undefined ? overrides.flipX : false;
    var flipY = overrides.flipY !== undefined ? overrides.flipY : false;

    return new TweenFrameData(tween, targetIndex, texture, frame, delay, duration, hold, repeat, repeatDelay, flipX, flipY);
}

describe('TweenFrameData', function ()
{
    describe('constructor', function ()
    {
        it('should set key to texture', function ()
        {
            var data = createFrameData();
            expect(data.key).toBe('texture');
        });

        it('should set startTexture to null', function ()
        {
            var data = createFrameData();
            expect(data.startTexture).toBeNull();
        });

        it('should set endTexture to the given texture key', function ()
        {
            var data = createFrameData({ texture: 'myAtlas' });
            expect(data.endTexture).toBe('myAtlas');
        });

        it('should set startFrame to null', function ()
        {
            var data = createFrameData();
            expect(data.startFrame).toBeNull();
        });

        it('should set endFrame to the given frame', function ()
        {
            var data = createFrameData({ frame: 42 });
            expect(data.endFrame).toBe(42);
        });

        it('should set endFrame to a string frame name', function ()
        {
            var data = createFrameData({ frame: 'walk_01' });
            expect(data.endFrame).toBe('walk_01');
        });

        it('should set yoyo to true when repeat is non-zero', function ()
        {
            var data = createFrameData({ repeat: 1 });
            expect(data.yoyo).toBe(true);
        });

        it('should set yoyo to true when repeat is -1', function ()
        {
            var data = createFrameData({ repeat: -1 });
            expect(data.yoyo).toBe(true);
        });

        it('should set yoyo to false when repeat is 0', function ()
        {
            var data = createFrameData({ repeat: 0 });
            expect(data.yoyo).toBe(false);
        });

        it('should inherit duration from BaseTweenData', function ()
        {
            var data = createFrameData({ duration: 1000 });
            expect(data.duration).toBe(1000);
        });

        it('should inherit hold from BaseTweenData', function ()
        {
            var data = createFrameData({ hold: 200 });
            expect(data.hold).toBe(200);
        });

        it('should inherit flipX from BaseTweenData', function ()
        {
            var data = createFrameData({ flipX: true });
            expect(data.flipX).toBe(true);
        });

        it('should inherit flipY from BaseTweenData', function ()
        {
            var data = createFrameData({ flipY: true });
            expect(data.flipY).toBe(true);
        });

        it('should set targetIndex correctly', function ()
        {
            var data = createFrameData({ targetIndex: 0 });
            expect(data.targetIndex).toBe(0);
        });

        it('should start with elapsed of 0', function ()
        {
            var data = createFrameData();
            expect(data.elapsed).toBe(0);
        });

        it('should start with progress of 0', function ()
        {
            var data = createFrameData();
            expect(data.progress).toBe(0);
        });
    });

    describe('reset', function ()
    {
        it('should capture startTexture from the target when startTexture is null', function ()
        {
            var target = createMockTarget('atlas1', 'frame1');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(false);

            expect(data.startTexture).toBe('atlas1');
        });

        it('should capture startFrame from the target when startTexture is null', function ()
        {
            var target = createMockTarget('atlas1', 'frame1');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(false);

            expect(data.startFrame).toBe('frame1');
        });

        it('should not overwrite startTexture if already set', function ()
        {
            var target = createMockTarget('atlas1', 'frame1');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(false);
            expect(data.startTexture).toBe('atlas1');

            target.texture.key = 'atlas2';
            target.frame.name = 'frame2';

            data.reset(false);

            expect(data.startTexture).toBe('atlas1');
            expect(data.startFrame).toBe('frame1');
        });

        it('should call target.setTexture with startTexture and startFrame when isSeeking is true', function ()
        {
            var target = createMockTarget('atlas1', 'frame1');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(true);

            expect(target.setTexture).toHaveBeenCalledWith('atlas1', 'frame1');
        });

        it('should not call target.setTexture when isSeeking is false', function ()
        {
            var target = createMockTarget('atlas1', 'frame1');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(false);

            expect(target.setTexture).not.toHaveBeenCalled();
        });

        it('should reset progress to 0', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.progress = 0.5;
            data.reset(false);

            expect(data.progress).toBe(0);
        });

        it('should reset elapsed to 0 when there is no delay', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, delay: zeroDelay });

            data.reset(false);

            expect(data.elapsed).toBe(0);
        });
    });

    describe('update', function ()
    {
        it('should return false and set complete state when target is missing', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            tween.targets = [];

            var result = data.update(16);

            expect(result).toBe(false);
            expect(data.isComplete()).toBe(true);
        });

        it('should transition from PENDING_RENDER to PLAYING_FORWARD and return true', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500 });

            data.reset(false);
            expect(data.isPendingRender()).toBe(true);

            var result = data.update(16);

            expect(result).toBe(true);
            expect(data.isPlayingForward()).toBe(true);
        });

        it('should call setTexture with startTexture when transitioning from PENDING_RENDER', function ()
        {
            var target = createMockTarget('myAtlas', 'myFrame');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500 });

            data.reset(false);
            data.update(16);

            expect(target.setTexture).toHaveBeenCalledWith('myAtlas', 'myFrame');
        });

        it('should update elapsed and progress while playing forward', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500 });

            data.reset(false);
            data.update(16);
            data.update(250);

            expect(data.elapsed).toBe(250);
            expect(data.progress).toBeCloseTo(0.5, 5);
        });

        it('should return true when not yet complete', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500 });

            data.reset(false);
            data.update(16);

            var result = data.update(200);

            expect(result).toBe(true);
        });

        it('should call setTexture with endTexture and endFrame when forward play completes', function ()
        {
            var target = createMockTarget('startAtlas', 'startFrame');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500, texture: 'endAtlas', frame: 'endFrame' });

            data.reset(false);
            data.update(16);
            data.update(600);

            expect(target.setTexture).toHaveBeenCalledWith('endAtlas', 'endFrame');
        });

        it('should return false when forward play completes with no repeat and no yoyo', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500, repeat: 0 });

            data.reset(false);
            data.update(16);
            var result = data.update(600);

            expect(result).toBe(false);
            expect(data.isComplete()).toBe(true);
        });

        it('should set progress to 1 when duration is fully elapsed', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500, repeat: 0 });

            data.reset(false);
            data.update(16);
            data.update(500);

            expect(data.progress).toBeCloseTo(1, 5);
        });

        it('should enter hold state after completing forward play when hold > 0', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500, hold: 200, repeat: 0 });

            data.reset(false);
            data.update(16);
            data.update(600);

            expect(data.isHolding()).toBe(true);
        });

        it('should emit TWEEN_UPDATE event during forward play', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500 });

            data.reset(false);
            data.update(16);
            data.update(100);

            expect(tween.emit).toHaveBeenCalledWith(Events.TWEEN_UPDATE, tween, 'texture', target);
        });

        it('should call setTexture with startTexture when backward play completes', function ()
        {
            var target = createMockTarget('startAtlas', 'startFrame');
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween, duration: 500, repeat: 1, texture: 'endAtlas', frame: 'endFrame' });

            data.reset(false);

            data.update(16);
            data.update(600);

            expect(data.isPlayingBackward()).toBe(true);

            target.setTexture.mockClear();

            data.update(600);

            expect(target.setTexture).toHaveBeenCalledWith('startAtlas', 'startFrame');
        });
    });

    describe('dispatchEvent', function ()
    {
        it('should emit the event on the tween when not seeking', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            tween.isSeeking = false;
            var data = createFrameData({ target: target, tween: tween });

            data.dispatchEvent(Events.TWEEN_UPDATE, null);

            expect(tween.emit).toHaveBeenCalledWith(Events.TWEEN_UPDATE, tween, 'texture', target);
        });

        it('should not emit when tween.isSeeking is true', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            tween.isSeeking = true;
            var data = createFrameData({ target: target, tween: tween });

            data.dispatchEvent(Events.TWEEN_UPDATE, null);

            expect(tween.emit).not.toHaveBeenCalled();
        });

        it('should invoke the callback handler when provided and not seeking', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            tween.isSeeking = false;
            var handlerFn = vi.fn();
            tween.callbacks = {
                onUpdate: {
                    func: handlerFn,
                    params: [ 'extra' ]
                }
            };
            tween.callbackScope = null;
            var data = createFrameData({ target: target, tween: tween });

            data.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');

            expect(handlerFn).toHaveBeenCalled();
        });

        it('should pass tween, target, and key as first three args to the callback', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            tween.isSeeking = false;
            var callArgs = null;
            tween.callbacks = {
                onUpdate: {
                    func: function ()
                    {
                        callArgs = Array.prototype.slice.call(arguments);
                    },
                    params: []
                }
            };
            var data = createFrameData({ target: target, tween: tween });

            data.dispatchEvent(Events.TWEEN_UPDATE, 'onUpdate');

            expect(callArgs[0]).toBe(tween);
            expect(callArgs[1]).toBe(target);
            expect(callArgs[2]).toBe('texture');
        });

        it('should not invoke callback when callback name is null', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            tween.isSeeking = false;
            var handlerFn = vi.fn();
            tween.callbacks = {
                onUpdate: {
                    func: handlerFn,
                    params: []
                }
            };
            var data = createFrameData({ target: target, tween: tween });

            data.dispatchEvent(Events.TWEEN_UPDATE, null);

            expect(handlerFn).not.toHaveBeenCalled();
        });

        it('should append extra params from the handler to the callback args', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            tween.isSeeking = false;
            var callArgs = null;
            tween.callbacks = {
                onRepeat: {
                    func: function ()
                    {
                        callArgs = Array.prototype.slice.call(arguments);
                    },
                    params: [ 'param1', 'param2' ]
                }
            };
            var data = createFrameData({ target: target, tween: tween });

            data.dispatchEvent(Events.TWEEN_REPEAT, 'onRepeat');

            expect(callArgs[3]).toBe('param1');
            expect(callArgs[4]).toBe('param2');
        });
    });

    describe('destroy', function ()
    {
        it('should null startTexture', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(false);
            data.destroy();

            expect(data.startTexture).toBeNull();
        });

        it('should null endTexture', function ()
        {
            var data = createFrameData({ texture: 'myAtlas' });
            data.destroy();
            expect(data.endTexture).toBeNull();
        });

        it('should null startFrame', function ()
        {
            var target = createMockTarget();
            var tween = createMockTween(target);
            var data = createFrameData({ target: target, tween: tween });

            data.reset(false);
            data.destroy();

            expect(data.startFrame).toBeNull();
        });

        it('should null endFrame', function ()
        {
            var data = createFrameData({ frame: 'walk_01' });
            data.destroy();
            expect(data.endFrame).toBeNull();
        });

        it('should null the tween reference via BaseTweenData.destroy', function ()
        {
            var data = createFrameData();
            data.destroy();
            expect(data.tween).toBeNull();
        });

        it('should null getDelay via BaseTweenData.destroy', function ()
        {
            var data = createFrameData();
            data.destroy();
            expect(data.getDelay).toBeNull();
        });

        it('should set state to COMPLETE via BaseTweenData.destroy', function ()
        {
            var data = createFrameData();
            data.destroy();
            expect(data.isComplete()).toBe(true);
        });
    });
});
