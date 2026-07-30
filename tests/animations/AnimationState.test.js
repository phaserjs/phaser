var AnimationState = require('../../src/animations/AnimationState');
var CustomMap = require('../../src/structs/Map');

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function createMockAnimationFrame (textureFrame, progress)
{
    return {
        textureFrame: textureFrame || 'frame0',
        progress: progress !== undefined ? progress : 0,
        setAlpha: false,
        alpha: 1,
        frame: {
            texture: {},
            customPivot: false,
            pivotX: 0,
            pivotY: 0,
            updateCropUVs: function () {}
        }
    };
}

function createMockAnimation (key, frameCount)
{
    var frames = [];

    for (var i = 0; i < (frameCount || 3); i++)
    {
        frames.push(createMockAnimationFrame('frame' + i, i / Math.max(1, (frameCount || 3) - 1)));
    }

    return {
        key: key || 'testAnim',
        frameRate: 24,
        duration: 1000,
        delay: 0,
        repeat: 0,
        repeatDelay: 0,
        yoyo: false,
        showBeforeDelay: false,
        showOnStart: false,
        hideOnComplete: false,
        skipMissedFrames: true,
        randomFrame: false,
        paused: false,
        frames: frames,
        getTotalFrames: function () { return this.frames.length; },
        calculateDuration: function () {},
        getFirstTick: function () {},
        getLastFrame: function () { return this.frames[this.frames.length - 1]; },
        getFrameByProgress: function () { return this.frames[0]; },
        nextFrame: function () {},
        previousFrame: function () {}
    };
}

function createMockAnimationManager ()
{
    return {
        textureManager: {},
        globalTimeScale: 1,
        on: function () {},
        off: function () {},
        get: function () { return null; },
        getMix: function () { return 0; },
        generateFrameNames: function () { return []; },
        generateFrameNumbers: function () { return []; },
        createFromAseprite: function () { return []; }
    };
}

function createMockParent (animManager)
{
    return {
        scene: {
            sys: {
                anims: animManager
            }
        },
        texture: null,
        frame: null,
        isCropped: false,
        _originComponent: false,
        flipX: false,
        flipY: false,
        alpha: 1,
        visible: true,
        setVisible: function (v) { this.visible = v; },
        setSizeToFrame: function () {},
        updateDisplayOrigin: function () {},
        setOrigin: function () {},
        emit: function () {}
    };
}

function createAnimationState ()
{
    var manager = createMockAnimationManager();
    var parent = createMockParent(manager);
    var state = new AnimationState(parent);

    return state;
}

// Attach a mock animation directly onto an AnimationState (bypasses load)
function attachMockAnimation (state, anim)
{
    state.currentAnim = anim;
    state.currentFrame = anim.frames[0];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AnimationState', function ()
{
    describe('constructor', function ()
    {
        it('should set default values', function ()
        {
            var state = createAnimationState();

            expect(state.isPlaying).toBe(false);
            expect(state.hasStarted).toBe(false);
            expect(state.currentAnim).toBeNull();
            expect(state.currentFrame).toBeNull();
            expect(state.nextAnim).toBeNull();
            expect(state.nextAnimsQueue).toEqual([]);
            expect(state.timeScale).toBe(1);
            expect(state.frameRate).toBe(0);
            expect(state.duration).toBe(0);
            expect(state.msPerFrame).toBe(0);
            expect(state.skipMissedFrames).toBe(true);
            expect(state.randomFrame).toBe(false);
            expect(state.delay).toBe(0);
            expect(state.repeat).toBe(0);
            expect(state.repeatDelay).toBe(0);
            expect(state.yoyo).toBe(false);
            expect(state.showBeforeDelay).toBe(false);
            expect(state.showOnStart).toBe(false);
            expect(state.hideOnComplete).toBe(false);
            expect(state.forward).toBe(true);
            expect(state.inReverse).toBe(false);
            expect(state.accumulator).toBe(0);
            expect(state.nextTick).toBe(0);
            expect(state.delayCounter).toBe(0);
            expect(state.repeatCounter).toBe(0);
            expect(state.pendingRepeat).toBe(false);
            expect(state.anims).toBeNull();
        });

        it('should store the parent reference', function ()
        {
            var manager = createMockAnimationManager();
            var parent = createMockParent(manager);
            var state = new AnimationState(parent);

            expect(state.parent).toBe(parent);
        });

        it('should store the animationManager reference', function ()
        {
            var manager = createMockAnimationManager();
            var parent = createMockParent(manager);
            var state = new AnimationState(parent);

            expect(state.animationManager).toBe(manager);
        });

        it('should register globalRemove listener on the animation manager', function ()
        {
            var manager = createMockAnimationManager();
            var calledWith = null;

            manager.on = function (event, cb, ctx)
            {
                calledWith = { event: event, cb: cb, ctx: ctx };
            };

            var parent = createMockParent(manager);
            var state = new AnimationState(parent);

            expect(calledWith).not.toBeNull();
            expect(calledWith.cb).toBe(state.globalRemove);
            expect(calledWith.ctx).toBe(state);
        });
    });

    // -----------------------------------------------------------------------

    describe('chain', function ()
    {
        it('should set nextAnim when no animation is queued', function ()
        {
            var state = createAnimationState();

            state.chain('walk');

            expect(state.nextAnim).toBe('walk');
            expect(state.nextAnimsQueue.length).toBe(0);
        });

        it('should push additional animations into the queue', function ()
        {
            var state = createAnimationState();

            state.chain('walk');
            state.chain('run');
            state.chain('idle');

            expect(state.nextAnim).toBe('walk');
            expect(state.nextAnimsQueue).toEqual([ 'run', 'idle' ]);
        });

        it('should accept an array of keys', function ()
        {
            var state = createAnimationState();

            state.chain([ 'walk', 'run', 'idle' ]);

            expect(state.nextAnim).toBe('walk');
            expect(state.nextAnimsQueue).toEqual([ 'run', 'idle' ]);
        });

        it('should clear nextAnim and the queue when called with no arguments', function ()
        {
            var state = createAnimationState();

            state.chain('walk');
            state.chain('run');
            state.chain();

            expect(state.nextAnim).toBeNull();
            expect(state.nextAnimsQueue.length).toBe(0);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.chain('walk');

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('getName', function ()
    {
        it('should return an empty string when no animation is loaded', function ()
        {
            var state = createAnimationState();

            expect(state.getName()).toBe('');
        });

        it('should return the key of the current animation', function ()
        {
            var state = createAnimationState();

            state.currentAnim = { key: 'run' };

            expect(state.getName()).toBe('run');
        });
    });

    // -----------------------------------------------------------------------

    describe('getFrameName', function ()
    {
        it('should return an empty string when no frame is loaded', function ()
        {
            var state = createAnimationState();

            expect(state.getFrameName()).toBe('');
        });

        it('should return the textureFrame of the current frame', function ()
        {
            var state = createAnimationState();

            state.currentFrame = { textureFrame: 'sprite_0001' };

            expect(state.getFrameName()).toBe('sprite_0001');
        });
    });

    // -----------------------------------------------------------------------

    describe('pause', function ()
    {
        it('should set _paused to true', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.pause();

            expect(state._paused).toBe(true);
        });

        it('should store the previous isPlaying state in _wasPlaying', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.pause();

            expect(state._wasPlaying).toBe(true);
        });

        it('should set isPlaying to false', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.pause();

            expect(state.isPlaying).toBe(false);
        });

        it('should not change _wasPlaying if already paused', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.pause();        // _wasPlaying = true
            state.isPlaying = false;
            state.pause();        // should NOT overwrite _wasPlaying

            expect(state._wasPlaying).toBe(true);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.pause();

            expect(result).toBe(state.parent);
        });

        it('should call setCurrentFrame with the provided frame', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('f0');
            var called = false;

            state.setCurrentFrame = function (f)
            {
                called = true;
                expect(f).toBe(frame);

                return state.parent;
            };

            state.pause(frame);

            expect(called).toBe(true);
        });
    });

    // -----------------------------------------------------------------------

    describe('resume', function ()
    {
        it('should clear _paused and restore isPlaying from _wasPlaying', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.pause();

            expect(state._paused).toBe(true);
            expect(state.isPlaying).toBe(false);

            state.resume();

            expect(state._paused).toBe(false);
            expect(state.isPlaying).toBe(true);
        });

        it('should not change isPlaying if not paused', function ()
        {
            var state = createAnimationState();

            state.isPlaying = false;
            state._paused = false;
            state.resume();

            expect(state.isPlaying).toBe(false);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.resume();

            expect(result).toBe(state.parent);
        });

        it('should call setCurrentFrame with the provided frame', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('f0');
            var called = false;

            state._paused = true;
            state.setCurrentFrame = function (f)
            {
                called = true;
                expect(f).toBe(frame);

                return state.parent;
            };

            state.resume(frame);

            expect(called).toBe(true);
        });
    });

    // -----------------------------------------------------------------------

    describe('isPaused (getter)', function ()
    {
        it('should reflect _paused state', function ()
        {
            var state = createAnimationState();

            expect(state.isPaused).toBe(false);

            state._paused = true;

            expect(state.isPaused).toBe(true);
        });
    });

    // -----------------------------------------------------------------------

    describe('reverse', function ()
    {
        it('should toggle inReverse and forward when playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.inReverse = false;
            state.forward = true;

            state.reverse();

            expect(state.inReverse).toBe(true);
            expect(state.forward).toBe(false);
        });

        it('should toggle back on second call', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.inReverse = false;
            state.forward = true;

            state.reverse();
            state.reverse();

            expect(state.inReverse).toBe(false);
            expect(state.forward).toBe(true);
        });

        it('should not toggle when not playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = false;
            state.inReverse = false;
            state.forward = true;

            state.reverse();

            expect(state.inReverse).toBe(false);
            expect(state.forward).toBe(true);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.reverse();

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('getProgress', function ()
    {
        it('should return 0 when no current frame', function ()
        {
            var state = createAnimationState();

            state.currentFrame = null;

            expect(state.getProgress()).toBe(0);
        });

        it('should return frame progress when playing forward', function ()
        {
            var state = createAnimationState();

            state.currentFrame = { progress: 0.5 };
            state.inReverse = false;

            expect(state.getProgress()).toBe(0.5);
        });

        it('should return negative progress when in reverse', function ()
        {
            var state = createAnimationState();

            state.currentFrame = { progress: 0.5 };
            state.inReverse = true;

            expect(state.getProgress()).toBe(-0.5);
        });

        it('should return 0 progress when at start frame', function ()
        {
            var state = createAnimationState();

            state.currentFrame = { progress: 0 };
            state.inReverse = false;

            expect(state.getProgress()).toBe(0);
        });

        it('should return 1 progress when at last frame', function ()
        {
            var state = createAnimationState();

            state.currentFrame = { progress: 1 };
            state.inReverse = false;

            expect(state.getProgress()).toBe(1);
        });
    });

    // -----------------------------------------------------------------------

    describe('setRepeat', function ()
    {
        it('should set repeatCounter to the given value', function ()
        {
            var state = createAnimationState();

            state.setRepeat(5);

            expect(state.repeatCounter).toBe(5);
        });

        it('should set repeatCounter to Number.MAX_VALUE when value is -1', function ()
        {
            var state = createAnimationState();

            state.setRepeat(-1);

            expect(state.repeatCounter).toBe(Number.MAX_VALUE);
        });

        it('should set repeatCounter to 0', function ()
        {
            var state = createAnimationState();

            state.repeatCounter = 5;
            state.setRepeat(0);

            expect(state.repeatCounter).toBe(0);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.setRepeat(3);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('getTotalFrames', function ()
    {
        it('should return 0 when no animation is loaded', function ()
        {
            var state = createAnimationState();

            expect(state.getTotalFrames()).toBe(0);
        });

        it('should return the frame count from the current animation', function ()
        {
            var state = createAnimationState();

            state.currentAnim = { getTotalFrames: function () { return 8; } };

            expect(state.getTotalFrames()).toBe(8);
        });
    });

    // -----------------------------------------------------------------------

    describe('stopAfterDelay', function ()
    {
        it('should set _pendingStop to 1', function ()
        {
            var state = createAnimationState();

            state.stopAfterDelay(500);

            expect(state._pendingStop).toBe(1);
        });

        it('should store the delay in _pendingStopValue', function ()
        {
            var state = createAnimationState();

            state.stopAfterDelay(500);

            expect(state._pendingStopValue).toBe(500);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.stopAfterDelay(500);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('stopAfterRepeat', function ()
    {
        it('should set _pendingStop to 2', function ()
        {
            var state = createAnimationState();

            state.stopAfterRepeat(2);

            expect(state._pendingStop).toBe(2);
        });

        it('should store the repeat count in _pendingStopValue', function ()
        {
            var state = createAnimationState();

            state.repeatCounter = -1;

            state.stopAfterRepeat(3);

            expect(state._pendingStopValue).toBe(3);
        });

        it('should default repeatCount to 1', function ()
        {
            var state = createAnimationState();

            state.repeatCounter = -1;

            state.stopAfterRepeat();

            expect(state._pendingStopValue).toBe(1);
        });

        it('should clamp repeatCount to repeatCounter when repeatCounter is not -1', function ()
        {
            var state = createAnimationState();

            state.repeatCounter = 2;
            state.stopAfterRepeat(10);

            expect(state._pendingStopValue).toBe(2);
        });

        it('should not clamp when repeatCounter is -1', function ()
        {
            var state = createAnimationState();

            state.repeatCounter = -1;
            state.stopAfterRepeat(10);

            expect(state._pendingStopValue).toBe(10);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.stopAfterRepeat(1);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('stopOnFrame', function ()
    {
        it('should set _pendingStop to 3', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame();

            state.stopOnFrame(frame);

            expect(state._pendingStop).toBe(3);
        });

        it('should store the frame in _pendingStopValue', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('myFrame');

            state.stopOnFrame(frame);

            expect(state._pendingStopValue).toBe(frame);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.stopOnFrame(createMockAnimationFrame());

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('get', function ()
    {
        it('should return null when anims map is null', function ()
        {
            var state = createAnimationState();

            expect(state.get('walk')).toBeNull();
        });

        it('should return the animation by key', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            expect(state.get('walk')).toBe(anim);
        });

        it('should return undefined for a missing key in an existing map', function ()
        {
            var state = createAnimationState();

            state.anims = new CustomMap();

            expect(state.get('missing')).toBeUndefined();
        });
    });

    // -----------------------------------------------------------------------

    describe('exists', function ()
    {
        it('should return false when anims map is null', function ()
        {
            var state = createAnimationState();

            expect(state.exists('walk')).toBe(false);
        });

        it('should return true when the animation key exists', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            expect(state.exists('walk')).toBe(true);
        });

        it('should return false when the animation key does not exist', function ()
        {
            var state = createAnimationState();

            state.anims = new CustomMap();

            expect(state.exists('walk')).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('create', function ()
    {
        it('should return false when config has no key', function ()
        {
            var state = createAnimationState();
            var result = state.create({ frames: [] });

            expect(result).toBe(false);
        });

        it('should return existing animation when key already exists', function ()
        {
            var state = createAnimationState();
            var existing = createMockAnimation('walk');

            state.anims = new CustomMap();
            state.anims.set('walk', existing);

            var result = state.create({ key: 'walk' });

            expect(result).toBe(existing);
        });

        it('should create an anims map if one does not exist', function ()
        {
            var state = createAnimationState();

            expect(state.anims).toBeNull();

            state.create({ key: 'walk', frames: [], frameRate: 10 });

            expect(state.anims).not.toBeNull();
        });

        it('should return an animation object when created successfully', function ()
        {
            var state = createAnimationState();
            var result = state.create({ key: 'walk', frames: [], frameRate: 10 });

            expect(result).not.toBe(false);
            expect(typeof result).toBe('object');
        });

        it('should make the animation retrievable via get() after creation', function ()
        {
            var state = createAnimationState();

            state.create({ key: 'walk', frames: [], frameRate: 10 });

            expect(state.exists('walk')).toBe(true);
            expect(state.get('walk')).not.toBeNull();
        });
    });

    // -----------------------------------------------------------------------

    describe('remove', function ()
    {
        it('should return undefined when the key does not exist', function ()
        {
            var state = createAnimationState();

            state.anims = new CustomMap();

            var result = state.remove('ghost');

            expect(result).toBeUndefined();
        });

        it('should remove the animation from the local map', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            state.remove('walk');

            expect(state.exists('walk')).toBe(false);
        });

        it('should return the removed animation', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            var result = state.remove('walk');

            expect(result).toBe(anim);
        });

        it('should call stop if the removed animation is the current one', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');
            var stopCalled = false;

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.currentAnim = anim;
            state.stop = function () { stopCalled = true; return state.parent; };

            state.remove('walk');

            expect(stopCalled).toBe(true);
        });

        it('should not call stop if the removed animation is not the current one', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');
            var otherAnim = createMockAnimation('run');
            var stopCalled = false;

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.currentAnim = otherAnim;
            state.stop = function () { stopCalled = true; return state.parent; };

            state.remove('walk');

            expect(stopCalled).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('globalRemove', function ()
    {
        it('should stop the animation if it is currently playing', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');
            var stopCalled = false;

            state.isPlaying = true;
            state.currentAnim = anim;
            state.stop = function () { stopCalled = true; return state.parent; };
            state.setCurrentFrame = function () { return state.parent; };

            state.globalRemove('walk', anim);

            expect(stopCalled).toBe(true);
        });

        it('should not stop if a different animation is removed', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');
            var otherAnim = createMockAnimation('run');
            var stopCalled = false;

            state.isPlaying = true;
            state.currentAnim = anim;
            state.stop = function () { stopCalled = true; return state.parent; };

            state.globalRemove('run', otherAnim);

            expect(stopCalled).toBe(false);
        });

        it('should not stop if not currently playing', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk');
            var stopCalled = false;

            state.isPlaying = false;
            state.currentAnim = anim;
            state.stop = function () { stopCalled = true; return state.parent; };

            state.globalRemove('walk', anim);

            expect(stopCalled).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('load', function ()
    {
        it('should return the parent when the animation key does not exist', function ()
        {
            var state = createAnimationState();
            var result = state.load('nonexistent');

            expect(result).toBe(state.parent);
        });

        it('should set currentAnim when loading a local animation', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 4);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            state.load('walk');

            expect(state.currentAnim).toBe(anim);
        });

        it('should set currentFrame to the first frame', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            state.load('walk');

            expect(state.currentFrame).toBe(anim.frames[0]);
        });

        it('should set currentFrame to the last frame when playing in reverse', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.forward = false;

            state.load('walk');

            expect(state.currentFrame).toBe(anim.frames[anim.frames.length - 1]);
        });

        it('should stop a playing animation before loading a new one', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var stopCalled = false;

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.isPlaying = true;
            state.stop = function () { stopCalled = true; state.isPlaying = false; return state.parent; };

            state.load('walk');

            expect(stopCalled).toBe(true);
        });

        it('should apply delay, repeat, yoyo from the animation config', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            anim.delay = 200;
            anim.repeat = 3;
            anim.yoyo = true;

            state.anims = new CustomMap();
            state.anims.set('walk', anim);

            state.load('walk');

            expect(state.delay).toBe(200);
            expect(state.repeat).toBe(3);
            expect(state.yoyo).toBe(true);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.load('missingKey');

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('startAnimation', function ()
    {
        it('should set isPlaying to true when animation is found', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.startAnimation('walk');

            expect(state.isPlaying).toBe(true);
        });

        it('should set hasStarted to true when no delay', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.startAnimation('walk');

            expect(state.hasStarted).toBe(true);
        });

        it('should set pendingRepeat to false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };
            state.pendingRepeat = true;

            state.startAnimation('walk');

            expect(state.pendingRepeat).toBe(false);
        });

        it('should set repeatCounter to repeat value', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            anim.repeat = 5;
            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.startAnimation('walk');

            expect(state.repeatCounter).toBe(5);
        });

        it('should set repeatCounter to MAX_VALUE when repeat is -1', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            anim.repeat = -1;
            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.startAnimation('walk');

            expect(state.repeatCounter).toBe(Number.MAX_VALUE);
        });

        it('should return parent without starting if animation not found', function ()
        {
            var state = createAnimationState();
            var result = state.startAnimation('missing');

            expect(result).toBe(state.parent);
            expect(state.isPlaying).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('play', function ()
    {
        it('should set forward to true and inReverse to false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };
            state.forward = false;
            state.inReverse = true;

            state.play('walk');

            expect(state.forward).toBe(true);
            expect(state.inReverse).toBe(false);
        });

        it('should return parent immediately if ignoreIfPlaying and same animation', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.currentAnim = { key: 'walk' };

            var result = state.play('walk', true);

            expect(result).toBe(state.parent);
        });

        it('should not ignore if a different animation is playing', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('run', 3);

            state.anims = new CustomMap();
            state.anims.set('run', anim);
            state.isPlaying = true;
            state.currentAnim = { key: 'walk' };
            state.currentFrame = createMockAnimationFrame();
            state.setCurrentFrame = function () { return state.parent; };
            state.animationManager.getMix = function () { return 0; };

            state.play('run', true);

            expect(state.currentAnim).toBe(anim);
        });

        it('should call playAfterDelay when mix time is > 0', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('run', 3);
            var mixCalledWith = null;

            state.anims = new CustomMap();
            state.anims.set('run', anim);
            state.isPlaying = true;
            state.currentAnim = { key: 'walk' };
            state.animationManager.getMix = function () { return 500; };
            state.playAfterDelay = function (key, mix)
            {
                mixCalledWith = { key: key, mix: mix };

                return state.parent;
            };

            state.play('run');

            expect(mixCalledWith).not.toBeNull();
            expect(mixCalledWith.mix).toBe(500);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            var result = state.play('walk');

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('playReverse', function ()
    {
        it('should set forward to false and inReverse to true', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.playReverse('walk');

            expect(state.forward).toBe(false);
            expect(state.inReverse).toBe(true);
        });

        it('should return parent immediately if ignoreIfPlaying and same animation', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.currentAnim = { key: 'walk' };

            var result = state.playReverse('walk', true);

            expect(result).toBe(state.parent);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            state.anims = new CustomMap();
            state.anims.set('walk', anim);
            state.setCurrentFrame = function () { return state.parent; };

            var result = state.playReverse('walk');

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('playAfterDelay', function ()
    {
        it('should call play with the key when not already playing', function ()
        {
            var state = createAnimationState();
            var playCalled = false;

            state.isPlaying = false;
            state.play = function () { playCalled = true; return state.parent; };

            state.playAfterDelay('walk', 300);

            expect(playCalled).toBe(true);
        });

        it('should set delayCounter when not already playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = false;
            state.play = function () { return state.parent; };

            state.playAfterDelay('walk', 300);

            expect(state.delayCounter).toBe(300);
        });

        it('should queue the key as nextAnim when already playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.nextAnim = null;

            state.playAfterDelay('walk', 300);

            expect(state.nextAnim).toBe('walk');
        });

        it('should push existing nextAnim to the front of the queue when already playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.nextAnim = 'idle';

            state.playAfterDelay('walk', 300);

            expect(state.nextAnim).toBe('walk');
            expect(state.nextAnimsQueue[0]).toBe('idle');
        });

        it('should set _pendingStop to 1 when already playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;

            state.playAfterDelay('walk', 300);

            expect(state._pendingStop).toBe(1);
            expect(state._pendingStopValue).toBe(300);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();

            state.isPlaying = false;
            state.play = function () { return state.parent; };

            var result = state.playAfterDelay('walk', 300);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('playAfterRepeat', function ()
    {
        it('should call play when not already playing', function ()
        {
            var state = createAnimationState();
            var playCalled = false;

            state.isPlaying = false;
            state.play = function () { playCalled = true; return state.parent; };

            state.playAfterRepeat('walk', 2);

            expect(playCalled).toBe(true);
        });

        it('should default repeatCount to 1', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.repeatCounter = 5;

            state.playAfterRepeat('walk');

            expect(state._pendingStopValue).toBe(1);
        });

        it('should set _pendingStop to 2 when already playing', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.repeatCounter = 5;

            state.playAfterRepeat('walk', 2);

            expect(state._pendingStop).toBe(2);
        });

        it('should clamp repeatCount to repeatCounter when less', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.repeatCounter = 3;

            state.playAfterRepeat('walk', 10);

            expect(state._pendingStopValue).toBe(3);
        });

        it('should push existing nextAnim to front of queue', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.repeatCounter = 5;
            state.nextAnim = 'idle';

            state.playAfterRepeat('walk', 2);

            expect(state.nextAnim).toBe('walk');
            expect(state.nextAnimsQueue[0]).toBe('idle');
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();

            state.isPlaying = false;
            state.play = function () { return state.parent; };

            var result = state.playAfterRepeat('walk', 2);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('restart', function ()
    {
        it('should return parent without action when no animation is loaded', function ()
        {
            var state = createAnimationState();
            var result = state.restart();

            expect(result).toBe(state.parent);
            expect(state.isPlaying).toBe(false);
        });

        it('should set isPlaying to true', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.restart();

            expect(state.isPlaying).toBe(true);
        });

        it('should set pendingRepeat to false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };
            state.pendingRepeat = true;

            state.restart();

            expect(state.pendingRepeat).toBe(false);
        });

        it('should reset repeatCounter when resetRepeats is true', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.repeat = 4;
            state.repeatCounter = 0;
            state.setCurrentFrame = function () { return state.parent; };

            state.restart(false, true);

            expect(state.repeatCounter).toBe(4);
        });

        it('should set hasStarted to true when includeDelay is false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.restart(false);

            expect(state.hasStarted).toBe(true);
        });

        it('should set hasStarted to false when includeDelay is true', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };

            state.restart(true);

            expect(state.hasStarted).toBe(false);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };

            var result = state.restart();

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('stop', function ()
    {
        it('should set isPlaying to false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.isPlaying = true;
            state.parent.emit = function () {};

            state.stop();

            expect(state.isPlaying).toBe(false);
        });

        it('should reset _pendingStop to 0', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state._pendingStop = 2;
            state.parent.emit = function () {};

            state.stop();

            expect(state._pendingStop).toBe(0);
        });

        it('should reset delayCounter to 0', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.delayCounter = 500;
            state.parent.emit = function () {};

            state.stop();

            expect(state.delayCounter).toBe(0);
        });

        it('should play nextAnim if one is queued', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var playCalled = null;

            attachMockAnimation(state, anim);
            state.parent.emit = function () {};
            state.nextAnim = 'run';
            state.play = function (key) { playCalled = key; return state.parent; };

            state.stop();

            expect(playCalled).toBe('run');
        });

        it('should shift the queue into nextAnim when playing the queued animation', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.parent.emit = function () {};
            state.nextAnim = 'run';
            state.nextAnimsQueue = [ 'idle' ];
            state.play = function () { return state.parent; };

            state.stop();

            expect(state.nextAnim).toBe('idle');
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.stop();

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('complete', function ()
    {
        it('should set isPlaying to false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.isPlaying = true;
            state.parent.emit = function () {};

            state.complete();

            expect(state.isPlaying).toBe(false);
        });

        it('should reset _pendingStop to 0', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state._pendingStop = 1;
            state.parent.emit = function () {};

            state.complete();

            expect(state._pendingStop).toBe(0);
        });

        it('should play nextAnim when one is queued', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var playCalled = null;

            attachMockAnimation(state, anim);
            state.parent.emit = function () {};
            state.nextAnim = 'run';
            state.play = function (key) { playCalled = key; return state.parent; };

            state.complete();

            expect(playCalled).toBe('run');
        });

        it('should shift the queue into nextAnim when playing the queued animation', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.parent.emit = function () {};
            state.nextAnim = 'run';
            state.nextAnimsQueue = [ 'idle', 'jump' ];
            state.play = function () { return state.parent; };

            state.complete();

            expect(state.nextAnim).toBe('idle');
            expect(state.nextAnimsQueue).toEqual([ 'jump' ]);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.complete();

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('setProgress', function ()
    {
        it('should call getFrameByProgress with the value when playing forward', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var calledWith = null;

            anim.getFrameByProgress = function (v) { calledWith = v; return anim.frames[0]; };
            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };
            state.forward = true;

            state.setProgress(0.5);

            expect(calledWith).toBeCloseTo(0.5);
        });

        it('should invert value when playing in reverse', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var calledWith = null;

            anim.getFrameByProgress = function (v) { calledWith = v; return anim.frames[0]; };
            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };
            state.forward = false;

            state.setProgress(0.25);

            expect(calledWith).toBeCloseTo(0.75);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            anim.getFrameByProgress = function () { return anim.frames[0]; };
            attachMockAnimation(state, anim);
            state.setCurrentFrame = function () { return state.parent; };

            var result = state.setProgress(0.5);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('nextFrame', function ()
    {
        it('should call nextFrame on currentAnim when one is set', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var called = false;

            anim.nextFrame = function () { called = true; };
            attachMockAnimation(state, anim);

            state.nextFrame();

            expect(called).toBe(true);
        });

        it('should not throw when no currentAnim is set', function ()
        {
            var state = createAnimationState();

            expect(function () { state.nextFrame(); }).not.toThrow();
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.nextFrame();

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('previousFrame', function ()
    {
        it('should call previousFrame on currentAnim when one is set', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var called = false;

            anim.previousFrame = function () { called = true; };
            attachMockAnimation(state, anim);

            state.previousFrame();

            expect(called).toBe(true);
        });

        it('should not throw when no currentAnim is set', function ()
        {
            var state = createAnimationState();

            expect(function () { state.previousFrame(); }).not.toThrow();
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var result = state.previousFrame();

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('update', function ()
    {
        it('should do nothing when isPlaying is false', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.isPlaying = false;
            state.accumulator = 0;

            state.update(0, 16);

            expect(state.accumulator).toBe(0);
        });

        it('should do nothing when no currentAnim', function ()
        {
            var state = createAnimationState();

            state.isPlaying = true;
            state.accumulator = 0;

            state.update(0, 16);

            expect(state.accumulator).toBe(0);
        });

        it('should do nothing when animation is paused', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            anim.paused = true;
            state.isPlaying = true;
            state.accumulator = 0;

            state.update(0, 16);

            expect(state.accumulator).toBe(0);
        });

        it('should add delta to accumulator respecting timeScale', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.isPlaying = true;
            state.hasStarted = true;
            state.timeScale = 2;
            state.animationManager.globalTimeScale = 1;
            state.accumulator = 0;
            state.nextTick = 9999; // prevent frame advance

            state.update(0, 16);

            expect(state.accumulator).toBeCloseTo(32);
        });

        it('should decrement _pendingStopValue when _pendingStop is 1', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);

            attachMockAnimation(state, anim);
            state.isPlaying = true;
            state.hasStarted = true;
            state._pendingStop = 1;
            state._pendingStopValue = 100;
            state.accumulator = 0;
            state.nextTick = 9999;

            state.update(0, 16);

            expect(state._pendingStopValue).toBeCloseTo(84);
        });

        it('should call stop when _pendingStopValue reaches zero', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var stopCalled = false;

            attachMockAnimation(state, anim);
            state.isPlaying = true;
            state.hasStarted = true;
            state._pendingStop = 1;
            state._pendingStopValue = 5;
            state.accumulator = 0;
            state.stop = function () { stopCalled = true; return state.parent; };

            state.update(0, 16);

            expect(stopCalled).toBe(true);
        });
    });

    // -----------------------------------------------------------------------

    describe('setCurrentFrame', function ()
    {
        it('should set currentFrame to the given animation frame', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('sprite_0');

            state.setCurrentFrame(frame);

            expect(state.currentFrame).toBe(frame);
        });

        it('should assign the frame texture and frame to the parent', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('sprite_0');
            var texture = { key: 'mytexture' };

            frame.frame.texture = texture;
            state.setCurrentFrame(frame);

            expect(state.parent.texture).toBe(texture);
            expect(state.parent.frame).toBe(frame.frame);
        });

        it('should set alpha on parent when frame.setAlpha is true', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('sprite_0');

            frame.setAlpha = true;
            frame.alpha = 0.5;
            state.setCurrentFrame(frame);

            expect(state.parent.alpha).toBe(0.5);
        });

        it('should not change alpha when frame.setAlpha is false', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('sprite_0');

            state.parent.alpha = 1;
            frame.setAlpha = false;
            frame.alpha = 0;
            state.setCurrentFrame(frame);

            expect(state.parent.alpha).toBe(1);
        });

        it('should call setSizeToFrame on the parent', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame('sprite_0');
            var called = false;

            state.parent.setSizeToFrame = function () { called = true; };
            state.setCurrentFrame(frame);

            expect(called).toBe(true);
        });

        it('should call stop if _pendingStop is 3 and the frame matches', function ()
        {
            var state = createAnimationState();
            var anim = createMockAnimation('walk', 3);
            var frame = createMockAnimationFrame('sprite_0');
            var stopCalled = false;

            attachMockAnimation(state, anim);
            state.isPlaying = true;
            state.hasStarted = true;
            state._pendingStop = 3;
            state._pendingStopValue = frame;
            state.parent.emit = function () {};
            state.stop = function () { stopCalled = true; return state.parent; };

            state.setCurrentFrame(frame);

            expect(stopCalled).toBe(true);
        });

        it('should return the parent game object', function ()
        {
            var state = createAnimationState();
            var frame = createMockAnimationFrame();
            var result = state.setCurrentFrame(frame);

            expect(result).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('generateFrameNames', function ()
    {
        it('should delegate to animationManager.generateFrameNames', function ()
        {
            var state = createAnimationState();
            var calledWith = null;

            state.animationManager.generateFrameNames = function (key, config)
            {
                calledWith = { key: key, config: config };

                return [ 'a', 'b' ];
            };

            var result = state.generateFrameNames('atlas', { prefix: 'sprite_' });

            expect(calledWith.key).toBe('atlas');
            expect(result).toEqual([ 'a', 'b' ]);
        });
    });

    // -----------------------------------------------------------------------

    describe('generateFrameNumbers', function ()
    {
        it('should delegate to animationManager.generateFrameNumbers', function ()
        {
            var state = createAnimationState();
            var calledWith = null;

            state.animationManager.generateFrameNumbers = function (key, config)
            {
                calledWith = { key: key, config: config };

                return [ 1, 2, 3 ];
            };

            var result = state.generateFrameNumbers('sheet', { start: 0, end: 2 });

            expect(calledWith.key).toBe('sheet');
            expect(result).toEqual([ 1, 2, 3 ]);
        });
    });

    // -----------------------------------------------------------------------

    describe('createFromAseprite', function ()
    {
        it('should delegate to animationManager.createFromAseprite', function ()
        {
            var state = createAnimationState();
            var calledWith = null;

            state.animationManager.createFromAseprite = function (key, tags, parent)
            {
                calledWith = { key: key, tags: tags, parent: parent };

                return [];
            };

            state.createFromAseprite('paladin', [ 'walk', 'run' ]);

            expect(calledWith.key).toBe('paladin');
            expect(calledWith.tags).toEqual([ 'walk', 'run' ]);
            expect(calledWith.parent).toBe(state.parent);
        });
    });

    // -----------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should null out animationManager', function ()
        {
            var state = createAnimationState();

            state.destroy();

            expect(state.animationManager).toBeNull();
        });

        it('should null out parent', function ()
        {
            var state = createAnimationState();

            state.destroy();

            expect(state.parent).toBeNull();
        });

        it('should null out nextAnim', function ()
        {
            var state = createAnimationState();

            state.nextAnim = 'run';
            state.destroy();

            expect(state.nextAnim).toBeNull();
        });

        it('should null out currentAnim', function ()
        {
            var state = createAnimationState();

            state.currentAnim = createMockAnimation('walk');
            state.destroy();

            expect(state.currentAnim).toBeNull();
        });

        it('should null out currentFrame', function ()
        {
            var state = createAnimationState();

            state.currentFrame = createMockAnimationFrame();
            state.destroy();

            expect(state.currentFrame).toBeNull();
        });

        it('should empty nextAnimsQueue', function ()
        {
            var state = createAnimationState();

            state.nextAnimsQueue = [ 'run', 'idle' ];
            state.destroy();

            expect(state.nextAnimsQueue.length).toBe(0);
        });

        it('should clear the local anims map if it exists', function ()
        {
            var state = createAnimationState();
            var clearCalled = false;

            state.anims = new CustomMap();
            state.anims.set('walk', createMockAnimation('walk'));
            state.anims.clear = function () { clearCalled = true; };

            state.destroy();

            expect(clearCalled).toBe(true);
        });

        it('should unregister the globalRemove listener', function ()
        {
            var manager = createMockAnimationManager();
            var parent = createMockParent(manager);
            var offCalledWith = null;

            manager.off = function (event, cb, ctx)
            {
                offCalledWith = { event: event, cb: cb, ctx: ctx };
            };

            var state = new AnimationState(parent);

            state.destroy();

            expect(offCalledWith).not.toBeNull();
        });
    });

});
