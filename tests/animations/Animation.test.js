var Animation = require('../../src/animations/Animation');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockTextureManager ()
{
    return {
        exists: function () { return false; },
        get: function () { return null; },
        getFrame: function () { return null; }
    };
}

function createMockManager ()
{
    return {
        textureManager: createMockTextureManager(),
        on: vi.fn(),
        off: vi.fn(),
        remove: vi.fn()
    };
}

function createAnimation (config)
{
    var manager = createMockManager();
    return new Animation(manager, 'test-anim', config || {});
}

function createMockFrame (props)
{
    var frame = {
        isFirst: false,
        isLast: false,
        nextFrame: null,
        prevFrame: null,
        progress: 0,
        duration: 0,
        index: 1,
        toJSON: function ()
        {
            return { key: 'test', frame: 0, duration: 0 };
        },
        destroy: vi.fn()
    };

    if (props)
    {
        for (var key in props)
        {
            frame[key] = props[key];
        }
    }

    return frame;
}

/**
 * Build `count` linked mock frames (isFirst, isLast, prevFrame, nextFrame, progress
 * all set correctly so they behave like a real animation frame sequence).
 */
function createLinkedFrames (count)
{
    var frames = [];
    var i;

    for (i = 0; i < count; i++)
    {
        frames.push(createMockFrame({ index: i + 1 }));
    }

    for (i = 0; i < frames.length; i++)
    {
        frames[i].isFirst = (i === 0);
        frames[i].isLast = (i === frames.length - 1);
        frames[i].progress = (count > 1) ? i / (count - 1) : 0;
        frames[i].prevFrame = frames[(i - 1 + frames.length) % frames.length];
        frames[i].nextFrame = frames[(i + 1) % frames.length];
    }

    return frames;
}

/**
 * Build a minimal AnimationState mock that references the supplied animation.
 */
function createMockState (anim, frameOverrides)
{
    var frames = createLinkedFrames(3);
    var currentFrame = frames[0];

    if (frameOverrides)
    {
        for (var k in frameOverrides)
        {
            currentFrame[k] = frameOverrides[k];
        }
    }

    return {
        currentAnim: anim,
        currentFrame: currentFrame,
        frameRate: anim.frameRate,
        msPerFrame: anim.msPerFrame,
        accumulator: 0,
        nextTick: 0,
        yoyo: false,
        repeatCounter: 0,
        repeatDelay: 0,
        pendingRepeat: false,
        inReverse: false,
        forward: true,
        isPlaying: true,
        _pendingStop: 0,
        _pendingStopValue: 0,
        complete: vi.fn(),
        stop: vi.fn(),
        setCurrentFrame: vi.fn(),
        handleRepeat: vi.fn()
    };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Animation', function ()
{
    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should set the key from the second argument', function ()
        {
            var manager = createMockManager();
            var anim = new Animation(manager, 'walk', {});

            expect(anim.key).toBe('walk');
        });

        it('should store a reference to the manager', function ()
        {
            var manager = createMockManager();
            var anim = new Animation(manager, 'walk', {});

            expect(anim.manager).toBe(manager);
        });

        it('should default type to "frame"', function ()
        {
            var anim = createAnimation();

            expect(anim.type).toBe('frame');
        });

        it('should default frameRate to 24 when neither frameRate nor duration is provided', function ()
        {
            var anim = createAnimation();

            expect(anim.frameRate).toBe(24);
        });

        it('should default paused to false', function ()
        {
            var anim = createAnimation();

            expect(anim.paused).toBe(false);
        });

        it('should default delay to 0', function ()
        {
            var anim = createAnimation({ delay: 0 });

            expect(anim.delay).toBe(0);
        });

        it('should accept a custom delay', function ()
        {
            var anim = createAnimation({ delay: 500 });

            expect(anim.delay).toBe(500);
        });

        it('should default repeat to 0', function ()
        {
            var anim = createAnimation();

            expect(anim.repeat).toBe(0);
        });

        it('should accept a custom repeat value', function ()
        {
            var anim = createAnimation({ repeat: -1 });

            expect(anim.repeat).toBe(-1);
        });

        it('should default repeatDelay to 0', function ()
        {
            var anim = createAnimation();

            expect(anim.repeatDelay).toBe(0);
        });

        it('should default yoyo to false', function ()
        {
            var anim = createAnimation();

            expect(anim.yoyo).toBe(false);
        });

        it('should accept yoyo: true', function ()
        {
            var anim = createAnimation({ yoyo: true });

            expect(anim.yoyo).toBe(true);
        });

        it('should default showBeforeDelay to false', function ()
        {
            var anim = createAnimation();

            expect(anim.showBeforeDelay).toBe(false);
        });

        it('should default showOnStart to false', function ()
        {
            var anim = createAnimation();

            expect(anim.showOnStart).toBe(false);
        });

        it('should default hideOnComplete to false', function ()
        {
            var anim = createAnimation();

            expect(anim.hideOnComplete).toBe(false);
        });

        it('should default randomFrame to false', function ()
        {
            var anim = createAnimation();

            expect(anim.randomFrame).toBe(false);
        });

        it('should default skipMissedFrames to true', function ()
        {
            var anim = createAnimation();

            expect(anim.skipMissedFrames).toBe(true);
        });

        it('should default frames to an empty array when no frames config is provided', function ()
        {
            var anim = createAnimation();

            expect(Array.isArray(anim.frames)).toBe(true);
            expect(anim.frames.length).toBe(0);
        });

        it('should register PAUSE_ALL and RESUME_ALL listeners on the manager', function ()
        {
            var manager = createMockManager();
            new Animation(manager, 'walk', {});

            expect(manager.on).toHaveBeenCalledTimes(2);
        });

        it('should not throw when manager has no on() method', function ()
        {
            var manager = createMockManager();
            delete manager.on;

            expect(function () { new Animation(manager, 'walk', {}); }).not.toThrow();
        });
    });

    // -----------------------------------------------------------------------
    // getTotalFrames
    // -----------------------------------------------------------------------

    describe('getTotalFrames', function ()
    {
        it('should return 0 when there are no frames', function ()
        {
            var anim = createAnimation();

            expect(anim.getTotalFrames()).toBe(0);
        });

        it('should return the correct count after frames are added manually', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(5);

            expect(anim.getTotalFrames()).toBe(5);
        });
    });

    // -----------------------------------------------------------------------
    // calculateDuration
    // -----------------------------------------------------------------------

    describe('calculateDuration', function ()
    {
        it('should use 24 fps default when both duration and frameRate are null', function ()
        {
            var anim = createAnimation();
            var target = {};

            anim.calculateDuration(target, 12, null, null);

            expect(target.frameRate).toBe(24);
        });

        it('should derive duration from default 24 fps when both are null', function ()
        {
            var anim = createAnimation();
            var target = {};

            anim.calculateDuration(target, 12, null, null);

            // 24 / 12 * 1000 = 2000
            expect(target.duration).toBeCloseTo(2000);
        });

        it('should set duration and derive frameRate when only duration is provided', function ()
        {
            var anim = createAnimation();
            var target = {};

            // 12 frames over 4000 ms → 3 fps
            anim.calculateDuration(target, 12, 4000, null);

            expect(target.duration).toBe(4000);
            expect(target.frameRate).toBeCloseTo(3);
        });

        it('should set frameRate and derive duration when only frameRate is provided', function ()
        {
            var anim = createAnimation();
            var target = {};

            // 15 frames at 30 fps → 500 ms
            anim.calculateDuration(target, 15, null, 30);

            expect(target.frameRate).toBe(30);
            expect(target.duration).toBeCloseTo(500);
        });

        it('should prefer frameRate over duration when both are provided', function ()
        {
            var anim = createAnimation();
            var target = {};

            // frameRate wins → 10 frames at 5 fps = 2000 ms
            anim.calculateDuration(target, 10, 9999, 5);

            expect(target.frameRate).toBe(5);
            expect(target.duration).toBeCloseTo(2000);
        });

        it('should calculate msPerFrame correctly', function ()
        {
            var anim = createAnimation();
            var target = {};

            anim.calculateDuration(target, 10, null, 10);

            expect(target.msPerFrame).toBeCloseTo(100);
        });

        it('should handle a single frame with default fps', function ()
        {
            var anim = createAnimation();
            var target = {};

            anim.calculateDuration(target, 1, null, null);

            expect(target.frameRate).toBe(24);
            // 24 / 1 * 1000 = 24000
            expect(target.duration).toBeCloseTo(24000);
        });
    });

    // -----------------------------------------------------------------------
    // checkFrame
    // -----------------------------------------------------------------------

    describe('checkFrame', function ()
    {
        var anim;

        beforeEach(function ()
        {
            anim = createAnimation();
            anim.frames = createLinkedFrames(5);
        });

        it('should return true for index 0', function ()
        {
            expect(anim.checkFrame(0)).toBe(true);
        });

        it('should return true for the last valid index', function ()
        {
            expect(anim.checkFrame(4)).toBe(true);
        });

        it('should return false for a negative index', function ()
        {
            expect(anim.checkFrame(-1)).toBe(false);
        });

        it('should return false for an index equal to frames.length', function ()
        {
            expect(anim.checkFrame(5)).toBe(false);
        });

        it('should return false for an index beyond frames.length', function ()
        {
            expect(anim.checkFrame(100)).toBe(false);
        });

        it('should return false when there are no frames', function ()
        {
            anim.frames = [];

            expect(anim.checkFrame(0)).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // getFirstTick
    // -----------------------------------------------------------------------

    describe('getFirstTick', function ()
    {
        it('should set accumulator to 0', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.accumulator = 999;

            anim.getFirstTick(state);

            expect(state.accumulator).toBe(0);
        });

        it('should set nextTick to msPerFrame when frameRates match and frame duration is 0', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            // frame duration is 0 (falsy) → fall back to msPerFrame
            state.currentFrame.duration = 0;

            anim.getFirstTick(state);

            expect(state.nextTick).toBeCloseTo(anim.msPerFrame);
        });

        it('should use frame.duration when it is set and frameRates match', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.duration = 200;

            anim.getFirstTick(state);

            expect(state.nextTick).toBe(200);
        });

        it('should use state.msPerFrame when state frameRate differs from animation frameRate', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.frameRate = anim.frameRate + 10; // deliberate mismatch
            state.msPerFrame = 50;

            anim.getFirstTick(state);

            expect(state.nextTick).toBe(50);
        });
    });

    // -----------------------------------------------------------------------
    // getFrameAt
    // -----------------------------------------------------------------------

    describe('getFrameAt', function ()
    {
        it('should return the frame at the given index', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(3);
            anim.frames = frames;

            expect(anim.getFrameAt(0)).toBe(frames[0]);
            expect(anim.getFrameAt(1)).toBe(frames[1]);
            expect(anim.getFrameAt(2)).toBe(frames[2]);
        });

        it('should return undefined for an out-of-range index', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(2);

            expect(anim.getFrameAt(99)).toBeUndefined();
        });
    });

    // -----------------------------------------------------------------------
    // getFrames
    // -----------------------------------------------------------------------

    describe('getFrames', function ()
    {
        it('should return an empty array when frames is an empty array', function ()
        {
            var anim = createAnimation();
            var result = anim.getFrames(createMockTextureManager(), []);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return an empty array when frames is not an array', function ()
        {
            var anim = createAnimation();
            var result = anim.getFrames(createMockTextureManager(), null);

            expect(result.length).toBe(0);
        });

        it('should skip frames whose texture is not found', function ()
        {
            var anim = createAnimation();
            var tm = createMockTextureManager();
            // getFrame returns null → frame skipped
            tm.getFrame = function () { return null; };

            var result = anim.getFrames(tm, [{ key: 'missing', frame: 0 }]);

            expect(result.length).toBe(0);
        });

        it('should skip frames with no key and no defaultTextureKey', function ()
        {
            var anim = createAnimation();
            var tm = createMockTextureManager();

            var result = anim.getFrames(tm, [{ frame: 0 }], null);

            expect(result.length).toBe(0);
        });

        it('should return an empty array for a string texture key that does not exist', function ()
        {
            var anim = createAnimation();
            var tm = createMockTextureManager();
            // exists returns false
            var result = anim.getFrames(tm, 'nonexistent-texture');

            expect(result.length).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    // getNextTick
    // -----------------------------------------------------------------------

    describe('getNextTick', function ()
    {
        it('should subtract nextTick from accumulator', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.accumulator = 100;
            state.nextTick = 40;
            state.currentFrame.duration = 0;

            anim.getNextTick(state);

            expect(state.accumulator).toBeCloseTo(60);
        });

        it('should set nextTick to msPerFrame when frame duration is 0 and frameRates match', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.duration = 0;
            state.nextTick = 0;

            anim.getNextTick(state);

            expect(state.nextTick).toBeCloseTo(anim.msPerFrame);
        });

        it('should set nextTick to frame.duration when it is non-zero and frameRates match', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.duration = 250;

            anim.getNextTick(state);

            expect(state.nextTick).toBe(250);
        });
    });

    // -----------------------------------------------------------------------
    // getFrameByProgress
    // -----------------------------------------------------------------------

    describe('getFrameByProgress', function ()
    {
        var anim;

        beforeEach(function ()
        {
            anim = createAnimation();
            anim.frames = createLinkedFrames(3);
            // progress values: 0, 0.5, 1
        });

        it('should return the first frame for progress 0', function ()
        {
            expect(anim.getFrameByProgress(0)).toBe(anim.frames[0]);
        });

        it('should return the last frame for progress 1', function ()
        {
            expect(anim.getFrameByProgress(1)).toBe(anim.frames[2]);
        });

        it('should clamp values below 0 to the first frame', function ()
        {
            expect(anim.getFrameByProgress(-5)).toBe(anim.frames[0]);
        });

        it('should clamp values above 1 to the last frame', function ()
        {
            expect(anim.getFrameByProgress(99)).toBe(anim.frames[2]);
        });

        it('should return the closest frame for a mid-range progress value', function ()
        {
            var result = anim.getFrameByProgress(0.5);

            expect(result).toBe(anim.frames[1]);
        });
    });

    // -----------------------------------------------------------------------
    // getLastFrame
    // -----------------------------------------------------------------------

    describe('getLastFrame', function ()
    {
        it('should return the last frame in the frames array', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(4);
            anim.frames = frames;

            expect(anim.getLastFrame()).toBe(frames[3]);
        });

        it('should return the only frame when there is exactly one', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(1);
            anim.frames = frames;

            expect(anim.getLastFrame()).toBe(frames[0]);
        });
    });

    // -----------------------------------------------------------------------
    // nextFrame
    // -----------------------------------------------------------------------

    describe('nextFrame', function ()
    {
        it('should call state.complete() when on the last frame with no repeat or yoyo', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.isLast = true;
            state.yoyo = false;
            state.repeatCounter = 0;

            anim.nextFrame(state);

            expect(state.complete).toHaveBeenCalledTimes(1);
        });

        it('should advance to nextFrame when not on the last frame', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.isLast = false;

            anim.nextFrame(state);

            expect(state.setCurrentFrame).toHaveBeenCalledWith(state.currentFrame.nextFrame);
        });

        it('should call repeatAnimation when on last frame with repeatCounter > 0 and no yoyo', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.isLast = true;
            state.yoyo = false;
            state.repeatCounter = 3;
            state.inReverse = false;
            state.forward = true;

            var repeatSpy = vi.spyOn(anim, 'repeatAnimation');

            anim.nextFrame(state);

            expect(repeatSpy).toHaveBeenCalledWith(state);
        });
    });

    // -----------------------------------------------------------------------
    // previousFrame
    // -----------------------------------------------------------------------

    describe('previousFrame', function ()
    {
        it('should call state.complete() when on the first frame with no repeat or yoyo', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.isFirst = true;
            state.yoyo = false;
            state.repeatCounter = 0;

            anim.previousFrame(state);

            expect(state.complete).toHaveBeenCalledTimes(1);
        });

        it('should step back to prevFrame when not on the first frame', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.isFirst = false;

            anim.previousFrame(state);

            expect(state.setCurrentFrame).toHaveBeenCalledWith(state.currentFrame.prevFrame);
        });

        it('should call repeatAnimation when on first frame with repeatCounter > 0', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.currentFrame.isFirst = true;
            state.yoyo = false;
            state.repeatCounter = 2;
            state.inReverse = true;
            state.forward = false;

            var repeatSpy = vi.spyOn(anim, 'repeatAnimation');

            anim.previousFrame(state);

            expect(repeatSpy).toHaveBeenCalledWith(state);
        });
    });

    // -----------------------------------------------------------------------
    // addFrame
    // -----------------------------------------------------------------------

    describe('addFrame', function ()
    {
        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();
            vi.spyOn(anim, 'getFrames').mockReturnValue([]);

            expect(anim.addFrame([])).toBe(anim);
        });

        it('should append frames to the end of the frames array', function ()
        {
            var anim = createAnimation();
            var existing = createLinkedFrames(2);
            anim.frames = existing.slice();

            var newFrame = createMockFrame({ index: 3 });
            vi.spyOn(anim, 'getFrames').mockReturnValue([ newFrame ]);

            anim.addFrame([]);

            expect(anim.frames.length).toBe(3);
            expect(anim.frames[2]).toBe(newFrame);
        });
    });

    // -----------------------------------------------------------------------
    // addFrameAt
    // -----------------------------------------------------------------------

    describe('addFrameAt', function ()
    {
        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();
            vi.spyOn(anim, 'getFrames').mockReturnValue([]);

            expect(anim.addFrameAt(0, [])).toBe(anim);
        });

        it('should prepend frames when index is 0', function ()
        {
            var anim = createAnimation();
            var existing = createLinkedFrames(2);
            anim.frames = existing.slice();

            var newFrames = [ createMockFrame({ index: 99 }) ];
            vi.spyOn(anim, 'getFrames').mockReturnValue(newFrames);

            anim.addFrameAt(0, []);

            expect(anim.frames[0]).toBe(newFrames[0]);
            expect(anim.frames.length).toBe(3);
        });

        it('should append frames when index equals frames.length', function ()
        {
            var anim = createAnimation();
            var existing = createLinkedFrames(2);
            anim.frames = existing.slice();

            var newFrames = [ createMockFrame({ index: 99 }) ];
            vi.spyOn(anim, 'getFrames').mockReturnValue(newFrames);

            anim.addFrameAt(2, []);

            expect(anim.frames[2]).toBe(newFrames[0]);
            expect(anim.frames.length).toBe(3);
        });

        it('should insert frames in the middle at the specified index', function ()
        {
            var anim = createAnimation();
            var existing = createLinkedFrames(4);
            anim.frames = existing.slice();

            var newFrame = createMockFrame({ index: 99 });
            vi.spyOn(anim, 'getFrames').mockReturnValue([ newFrame ]);

            anim.addFrameAt(2, []);

            expect(anim.frames.length).toBe(5);
            expect(anim.frames[2]).toBe(newFrame);
            expect(anim.frames[0]).toBe(existing[0]);
            expect(anim.frames[1]).toBe(existing[1]);
            expect(anim.frames[3]).toBe(existing[2]);
        });

        it('should not modify frames when getFrames returns an empty array', function ()
        {
            var anim = createAnimation();
            var existing = createLinkedFrames(3);
            anim.frames = existing.slice();

            vi.spyOn(anim, 'getFrames').mockReturnValue([]);

            anim.addFrameAt(1, []);

            expect(anim.frames.length).toBe(3);
        });
    });

    // -----------------------------------------------------------------------
    // removeFrame
    // -----------------------------------------------------------------------

    describe('removeFrame', function ()
    {
        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();

            expect(anim.removeFrame({})).toBe(anim);
        });

        it('should remove the specified frame object', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(3);
            anim.frames = frames.slice();

            anim.removeFrame(frames[1]);

            expect(anim.frames.length).toBe(2);
            expect(anim.frames.indexOf(frames[1])).toBe(-1);
        });

        it('should do nothing when the frame is not in the array', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(3);
            anim.frames = frames.slice();

            anim.removeFrame(createMockFrame());

            expect(anim.frames.length).toBe(3);
        });
    });

    // -----------------------------------------------------------------------
    // removeFrameAt
    // -----------------------------------------------------------------------

    describe('removeFrameAt', function ()
    {
        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(2);

            expect(anim.removeFrameAt(0)).toBe(anim);
        });

        it('should remove the frame at the given index', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(3);
            anim.frames = frames.slice();

            anim.removeFrameAt(1);

            expect(anim.frames.length).toBe(2);
            expect(anim.frames.indexOf(frames[1])).toBe(-1);
        });

        it('should update the frame sequence after removal', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.removeFrameAt(0);

            // After removal and updateFrameSequence, the new first frame should be isFirst
            expect(anim.frames[0].isFirst).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // repeatAnimation
    // -----------------------------------------------------------------------

    describe('repeatAnimation', function ()
    {
        it('should call state.stop() when _pendingStop is 2 and _pendingStopValue is 0', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state._pendingStop = 2;
            state._pendingStopValue = 0;

            anim.repeatAnimation(state);

            expect(state.stop).toHaveBeenCalledTimes(1);
        });

        it('should decrement _pendingStopValue when _pendingStop is 2 and value > 0', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state._pendingStop = 2;
            state._pendingStopValue = 3;
            state.repeatDelay = 0;
            state.pendingRepeat = false;
            state.repeatCounter = 1;
            state.forward = true;

            anim.repeatAnimation(state);

            expect(state._pendingStopValue).toBe(2);
        });

        it('should set pendingRepeat and adjust nextTick when repeatDelay > 0', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.repeatDelay = 1000;
            state.pendingRepeat = false;
            state.accumulator = 50;
            state.nextTick = 40;

            anim.repeatAnimation(state);

            expect(state.pendingRepeat).toBe(true);
            // accumulator -= nextTick (50-40=10), nextTick += repeatDelay (40+1000=1040)
            expect(state.nextTick).toBeCloseTo(1040);
        });

        it('should decrement repeatCounter and call setCurrentFrame when no delay', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.repeatDelay = 0;
            state.repeatCounter = 3;
            state.forward = true;

            anim.repeatAnimation(state);

            expect(state.repeatCounter).toBe(2);
            expect(state.setCurrentFrame).toHaveBeenCalled();
        });

        it('should call handleRepeat when isPlaying is true and no delay', function ()
        {
            var anim = createAnimation();
            var state = createMockState(anim);
            state.repeatDelay = 0;
            state.repeatCounter = 2;
            state.forward = true;
            state.isPlaying = true;

            anim.repeatAnimation(state);

            expect(state.handleRepeat).toHaveBeenCalledTimes(1);
        });
    });

    // -----------------------------------------------------------------------
    // toJSON
    // -----------------------------------------------------------------------

    describe('toJSON', function ()
    {
        it('should return an object with the animation key', function ()
        {
            var manager = createMockManager();
            var anim = new Animation(manager, 'run', {});
            var json = anim.toJSON();

            expect(json.key).toBe('run');
        });

        it('should include all expected top-level properties', function ()
        {
            var anim = createAnimation();
            var json = anim.toJSON();

            expect(json).toHaveProperty('key');
            expect(json).toHaveProperty('type');
            expect(json).toHaveProperty('frames');
            expect(json).toHaveProperty('frameRate');
            expect(json).toHaveProperty('duration');
            expect(json).toHaveProperty('skipMissedFrames');
            expect(json).toHaveProperty('delay');
            expect(json).toHaveProperty('repeat');
            expect(json).toHaveProperty('repeatDelay');
            expect(json).toHaveProperty('yoyo');
            expect(json).toHaveProperty('showBeforeDelay');
            expect(json).toHaveProperty('showOnStart');
            expect(json).toHaveProperty('hideOnComplete');
            expect(json).toHaveProperty('randomFrame');
        });

        it('should return frames as an array', function ()
        {
            var anim = createAnimation();
            var json = anim.toJSON();

            expect(Array.isArray(json.frames)).toBe(true);
        });

        it('should call toJSON on each frame', function ()
        {
            var anim = createAnimation();
            var frame1 = createMockFrame();
            var frame2 = createMockFrame();
            anim.frames = [ frame1, frame2 ];

            vi.spyOn(frame1, 'toJSON').mockReturnValue({ key: 'a' });
            vi.spyOn(frame2, 'toJSON').mockReturnValue({ key: 'b' });

            var json = anim.toJSON();

            expect(json.frames.length).toBe(2);
            expect(frame1.toJSON).toHaveBeenCalledTimes(1);
            expect(frame2.toJSON).toHaveBeenCalledTimes(1);
        });

        it('should reflect config values in output', function ()
        {
            var anim = createAnimation({
                delay: 200,
                repeat: -1,
                yoyo: true,
                skipMissedFrames: false,
                hideOnComplete: true
            });

            var json = anim.toJSON();

            expect(json.delay).toBe(200);
            expect(json.repeat).toBe(-1);
            expect(json.yoyo).toBe(true);
            expect(json.skipMissedFrames).toBe(false);
            expect(json.hideOnComplete).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // updateFrameSequence
    // -----------------------------------------------------------------------

    describe('updateFrameSequence', function ()
    {
        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            expect(anim.updateFrameSequence()).toBe(anim);
        });

        it('should mark the first frame as isFirst', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[0].isFirst).toBe(true);
        });

        it('should mark the last frame as isLast', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[2].isLast).toBe(true);
        });

        it('should set progress to 0 for the first frame', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[0].progress).toBe(0);
        });

        it('should set progress to 1 for the last frame', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[2].progress).toBeCloseTo(1);
        });

        it('should set progress to 0.5 for the middle frame of three', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[1].progress).toBeCloseTo(0.5);
        });

        it('should reassign index values starting at 1', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[0].index).toBe(1);
            expect(anim.frames[1].index).toBe(2);
            expect(anim.frames[2].index).toBe(3);
        });

        it('should link last frame nextFrame to first frame', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[2].nextFrame).toBe(anim.frames[0]);
        });

        it('should link first frame prevFrame to last frame', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.updateFrameSequence();

            expect(anim.frames[0].prevFrame).toBe(anim.frames[2]);
        });

        it('should set isFirst and isLast to true for a single-frame sequence', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(1);

            anim.updateFrameSequence();

            expect(anim.frames[0].isFirst).toBe(true);
            expect(anim.frames[0].isLast).toBe(true);
        });

        it('should make a single frame point to itself for nextFrame and prevFrame', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(1);

            anim.updateFrameSequence();

            expect(anim.frames[0].nextFrame).toBe(anim.frames[0]);
            expect(anim.frames[0].prevFrame).toBe(anim.frames[0]);
        });
    });

    // -----------------------------------------------------------------------
    // pause
    // -----------------------------------------------------------------------

    describe('pause', function ()
    {
        it('should set paused to true', function ()
        {
            var anim = createAnimation();

            anim.pause();

            expect(anim.paused).toBe(true);
        });

        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();

            expect(anim.pause()).toBe(anim);
        });
    });

    // -----------------------------------------------------------------------
    // resume
    // -----------------------------------------------------------------------

    describe('resume', function ()
    {
        it('should set paused to false', function ()
        {
            var anim = createAnimation();
            anim.paused = true;

            anim.resume();

            expect(anim.paused).toBe(false);
        });

        it('should return the animation instance (chaining)', function ()
        {
            var anim = createAnimation();

            expect(anim.resume()).toBe(anim);
        });
    });

    // -----------------------------------------------------------------------
    // destroy
    // -----------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should set manager to null', function ()
        {
            var anim = createAnimation();

            anim.destroy();

            expect(anim.manager).toBeNull();
        });

        it('should empty the frames array', function ()
        {
            var anim = createAnimation();
            anim.frames = createLinkedFrames(3);

            anim.destroy();

            expect(anim.frames.length).toBe(0);
        });

        it('should call destroy() on each frame', function ()
        {
            var anim = createAnimation();
            var frames = createLinkedFrames(3);
            anim.frames = frames.slice();

            anim.destroy();

            expect(frames[0].destroy).toHaveBeenCalledTimes(1);
            expect(frames[1].destroy).toHaveBeenCalledTimes(1);
            expect(frames[2].destroy).toHaveBeenCalledTimes(1);
        });

        it('should call manager.remove() with the animation key', function ()
        {
            var manager = createMockManager();
            var anim = new Animation(manager, 'walk', {});

            anim.destroy();

            expect(manager.remove).toHaveBeenCalledWith('walk');
        });

        it('should call manager.off() to remove event listeners', function ()
        {
            var manager = createMockManager();
            var anim = new Animation(manager, 'walk', {});

            anim.destroy();

            expect(manager.off).toHaveBeenCalledTimes(2);
        });

        it('should not throw when manager has no off() method', function ()
        {
            var manager = createMockManager();
            delete manager.off;
            var anim = new Animation(manager, 'walk', {});

            expect(function () { anim.destroy(); }).not.toThrow();
        });
    });
});
