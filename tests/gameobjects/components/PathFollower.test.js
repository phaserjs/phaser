var PathFollower = require('../../../src/gameobjects/components/PathFollower');
var TWEEN_CONST = require('../../../src/tweens/tween/const');
var Vector2 = require('../../../src/math/Vector2');

function createMockTween (playing, paused)
{
    return {
        isPlaying: function () { return playing || false; },
        isPaused: function () { return paused || false; },
        stop: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        data: null,
        getValue: function () { return 0; }
    };
}

function createMockPath (startX, startY)
{
    startX = startX || 0;
    startY = startY || 0;

    return {
        getStartPoint: function (vec)
        {
            vec.x = startX;
            vec.y = startY;
            return vec;
        },
        getPoint: function (t, vec)
        {
            if (vec)
            {
                vec.x = t * 100;
                vec.y = t * 50;
                return vec;
            }
            return { x: t * 100, y: t * 50 };
        }
    };
}

function createFollower ()
{
    var addCounterResult = createMockTween(true, false);

    var follower = Object.assign({}, PathFollower);

    follower.x = 0;
    follower.y = 0;
    follower.rotation = 0;
    follower.path = null;
    follower.pathTween = null;
    follower.pathOffset = null;
    follower.pathVector = null;
    follower.pathDelta = null;
    follower.pathConfig = null;
    follower.rotateToPath = false;
    follower.pathRotationOffset = 0;
    follower._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

    follower.setPosition = vi.fn(function (x, y)
    {
        follower.x = x;
        follower.y = y;
    });

    follower.scene = {
        sys: {
            tweens: {
                addCounter: vi.fn(function () { return addCounterResult; })
            }
        }
    };

    follower._addCounterResult = addCounterResult;

    return follower;
}

describe('PathFollower', function ()
{
    describe('module', function ()
    {
        it('should be importable', function ()
        {
            expect(PathFollower).toBeDefined();
        });

        it('should export an object', function ()
        {
            expect(typeof PathFollower).toBe('object');
        });

        it('should have default property values', function ()
        {
            expect(PathFollower.path).toBeNull();
            expect(PathFollower.rotateToPath).toBe(false);
            expect(PathFollower.pathRotationOffset).toBe(0);
            expect(PathFollower.pathOffset).toBeNull();
            expect(PathFollower.pathVector).toBeNull();
            expect(PathFollower.pathDelta).toBeNull();
            expect(PathFollower.pathTween).toBeNull();
            expect(PathFollower.pathConfig).toBeNull();
            expect(PathFollower._prevDirection).toBe(TWEEN_CONST.PLAYING_FORWARD);
        });
    });

    describe('setPath', function ()
    {
        it('should set the path property', function ()
        {
            var follower = createFollower();
            var path = createMockPath();

            follower.setPath(path);

            expect(follower.path).toBe(path);
        });

        it('should return this', function ()
        {
            var follower = createFollower();
            var path = createMockPath();

            var result = follower.setPath(path);

            expect(result).toBe(follower);
        });

        it('should stop an existing playing tween', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(true, false);
            follower.pathTween = tween;

            var path = createMockPath();
            follower.setPath(path);

            expect(tween.stop).toHaveBeenCalledOnce();
        });

        it('should not stop a tween that is not playing', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(false, false);
            follower.pathTween = tween;

            var path = createMockPath();
            follower.setPath(path);

            expect(tween.stop).not.toHaveBeenCalled();
        });

        it('should not stop tween when pathTween is null', function ()
        {
            var follower = createFollower();
            follower.pathTween = null;

            var path = createMockPath();

            expect(function () { follower.setPath(path); }).not.toThrow();
        });

        it('should call startFollow when config is provided', function ()
        {
            var follower = createFollower();
            var path = createMockPath();

            follower.setPath(path, { duration: 1000 });

            expect(follower.scene.sys.tweens.addCounter).toHaveBeenCalledOnce();
        });

        it('should not call startFollow when no config is provided and pathConfig is null', function ()
        {
            var follower = createFollower();
            follower.pathConfig = null;

            var path = createMockPath();
            follower.setPath(path);

            expect(follower.scene.sys.tweens.addCounter).not.toHaveBeenCalled();
        });

        it('should use existing pathConfig if no config is passed', function ()
        {
            var follower = createFollower();
            var path = createMockPath();
            follower.pathConfig = { duration: 500 };

            follower.setPath(path);

            expect(follower.scene.sys.tweens.addCounter).toHaveBeenCalledOnce();
        });
    });

    describe('setRotateToPath', function ()
    {
        it('should set rotateToPath to true', function ()
        {
            var follower = createFollower();

            follower.setRotateToPath(true);

            expect(follower.rotateToPath).toBe(true);
        });

        it('should set rotateToPath to false', function ()
        {
            var follower = createFollower();
            follower.rotateToPath = true;

            follower.setRotateToPath(false);

            expect(follower.rotateToPath).toBe(false);
        });

        it('should default pathRotationOffset to 0 when offset is not provided', function ()
        {
            var follower = createFollower();

            follower.setRotateToPath(true);

            expect(follower.pathRotationOffset).toBe(0);
        });

        it('should set pathRotationOffset to the provided value', function ()
        {
            var follower = createFollower();

            follower.setRotateToPath(true, 90);

            expect(follower.pathRotationOffset).toBe(90);
        });

        it('should set negative rotation offset', function ()
        {
            var follower = createFollower();

            follower.setRotateToPath(true, -45);

            expect(follower.pathRotationOffset).toBe(-45);
        });

        it('should return this', function ()
        {
            var follower = createFollower();

            var result = follower.setRotateToPath(true, 0);

            expect(result).toBe(follower);
        });
    });

    describe('isFollowing', function ()
    {
        it('should return false when pathTween is null', function ()
        {
            var follower = createFollower();
            follower.pathTween = null;

            expect(follower.isFollowing()).toBeFalsy();
        });

        it('should return false when tween is not playing', function ()
        {
            var follower = createFollower();
            follower.pathTween = createMockTween(false, false);

            expect(follower.isFollowing()).toBe(false);
        });

        it('should return true when tween is playing', function ()
        {
            var follower = createFollower();
            follower.pathTween = createMockTween(true, false);

            expect(follower.isFollowing()).toBe(true);
        });

        it('should return false when tween is paused', function ()
        {
            var follower = createFollower();
            follower.pathTween = createMockTween(false, true);

            expect(follower.isFollowing()).toBe(false);
        });
    });

    describe('pauseFollow', function ()
    {
        it('should call tween.pause when tween is playing', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(true, false);
            follower.pathTween = tween;

            follower.pauseFollow();

            expect(tween.pause).toHaveBeenCalledOnce();
        });

        it('should not call tween.pause when tween is not playing', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(false, false);
            follower.pathTween = tween;

            follower.pauseFollow();

            expect(tween.pause).not.toHaveBeenCalled();
        });

        it('should not throw when pathTween is null', function ()
        {
            var follower = createFollower();
            follower.pathTween = null;

            expect(function () { follower.pauseFollow(); }).not.toThrow();
        });

        it('should return this', function ()
        {
            var follower = createFollower();

            var result = follower.pauseFollow();

            expect(result).toBe(follower);
        });
    });

    describe('resumeFollow', function ()
    {
        it('should call tween.resume when tween is paused', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(false, true);
            follower.pathTween = tween;

            follower.resumeFollow();

            expect(tween.resume).toHaveBeenCalledOnce();
        });

        it('should not call tween.resume when tween is not paused', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(true, false);
            follower.pathTween = tween;

            follower.resumeFollow();

            expect(tween.resume).not.toHaveBeenCalled();
        });

        it('should not throw when pathTween is null', function ()
        {
            var follower = createFollower();
            follower.pathTween = null;

            expect(function () { follower.resumeFollow(); }).not.toThrow();
        });

        it('should return this', function ()
        {
            var follower = createFollower();

            var result = follower.resumeFollow();

            expect(result).toBe(follower);
        });
    });

    describe('stopFollow', function ()
    {
        it('should call tween.stop when tween is playing', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(true, false);
            follower.pathTween = tween;

            follower.stopFollow();

            expect(tween.stop).toHaveBeenCalledOnce();
        });

        it('should not call tween.stop when tween is not playing', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(false, false);
            follower.pathTween = tween;

            follower.stopFollow();

            expect(tween.stop).not.toHaveBeenCalled();
        });

        it('should not throw when pathTween is null', function ()
        {
            var follower = createFollower();
            follower.pathTween = null;

            expect(function () { follower.stopFollow(); }).not.toThrow();
        });

        it('should return this', function ()
        {
            var follower = createFollower();

            var result = follower.stopFollow();

            expect(result).toBe(follower);
        });
    });

    describe('startFollow', function ()
    {
        it('should return this', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            var result = follower.startFollow({});

            expect(result).toBe(follower);
        });

        it('should call scene.sys.tweens.addCounter', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            expect(follower.scene.sys.tweens.addCounter).toHaveBeenCalledOnce();
        });

        it('should accept a number config and convert to duration object', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow(2000);

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(callArg.duration).toBe(2000);
        });

        it('should stop an existing playing tween before starting', function ()
        {
            var follower = createFollower();
            var oldTween = createMockTween(true, false);
            follower.pathTween = oldTween;
            follower.path = createMockPath();

            follower.startFollow({});

            expect(oldTween.stop).toHaveBeenCalledOnce();
        });

        it('should not stop an existing tween that is not playing', function ()
        {
            var follower = createFollower();
            var oldTween = createMockTween(false, false);
            follower.pathTween = oldTween;
            follower.path = createMockPath();

            follower.startFollow({});

            expect(oldTween.stop).not.toHaveBeenCalled();
        });

        it('should set rotateToPath from config', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({ rotateToPath: true });

            expect(follower.rotateToPath).toBe(true);
        });

        it('should default rotateToPath to false', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            expect(follower.rotateToPath).toBe(false);
        });

        it('should set pathRotationOffset from config rotationOffset', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({ rotationOffset: 45 });

            expect(follower.pathRotationOffset).toBe(45);
        });

        it('should default pathRotationOffset to 0', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            expect(follower.pathRotationOffset).toBe(0);
        });

        it('should initialize pathOffset as a Vector2', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            expect(follower.pathOffset).toBeDefined();
            expect(typeof follower.pathOffset.x).toBe('number');
            expect(typeof follower.pathOffset.y).toBe('number');
        });

        it('should initialize pathVector as a Vector2', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            expect(follower.pathVector).toBeDefined();
            expect(typeof follower.pathVector.x).toBe('number');
            expect(typeof follower.pathVector.y).toBe('number');
        });

        it('should initialize pathDelta as a Vector2', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            expect(follower.pathDelta).toBeDefined();
            expect(typeof follower.pathDelta.x).toBe('number');
            expect(typeof follower.pathDelta.y).toBe('number');
        });

        it('should set pathConfig to the resolved config object', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({ duration: 3000 });

            expect(follower.pathConfig).toBeDefined();
            expect(follower.pathConfig.duration).toBe(3000);
        });

        it('should set _prevDirection to PLAYING_FORWARD', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            follower._prevDirection = TWEEN_CONST.PLAYING_BACKWARD;

            follower.startFollow({});

            expect(follower._prevDirection).toBe(TWEEN_CONST.PLAYING_FORWARD);
        });

        it('should set config.from to 0 by default', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(callArg.from).toBe(0);
        });

        it('should set config.to to 1 by default', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(callArg.to).toBe(1);
        });

        it('should set persist to true on config', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(callArg.persist).toBe(true);
        });

        it('should set position on path when positionOnPath is true', function ()
        {
            var follower = createFollower();
            follower.x = 50;
            follower.y = 50;
            follower.path = createMockPath(10, 20);

            follower.startFollow({ positionOnPath: true });

            expect(follower.x).toBe(10);
            expect(follower.y).toBe(20);
        });

        it('should compute pathOffset relative to start position when positionOnPath is false', function ()
        {
            var follower = createFollower();
            follower.x = 30;
            follower.y = 40;
            follower.path = createMockPath(10, 20);

            follower.startFollow({ positionOnPath: false });

            // pathOffset.x = follower.x - pathStart.x = 30 - 10 = 20
            // pathOffset.y = follower.y - pathStart.y = 40 - 20 = 20
            expect(follower.pathOffset.x).toBe(20);
            expect(follower.pathOffset.y).toBe(20);
        });

        it('should reuse existing pathOffset if already set', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            var existingOffset = new Vector2(5, 5);
            follower.pathOffset = existingOffset;

            follower.startFollow({});

            expect(follower.pathOffset).toBe(existingOffset);
        });

        it('should set rotation when rotateToPath is enabled', function ()
        {
            var follower = createFollower();
            follower.x = 0;
            follower.y = 0;
            follower.path = createMockPath();

            follower.startFollow({ rotateToPath: true });

            expect(typeof follower.rotation).toBe('number');
        });

        it('should add onStart to config when startAt is provided', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({ startAt: 0.5 });

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(typeof callArg.onStart).toBe('function');
        });

        it('should not add onStart to config when startAt is 0', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({});

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(callArg.onStart).toBeUndefined();
        });

        it('should use startAt parameter when provided as second argument', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();

            follower.startFollow({}, 0.5);

            var callArg = follower.scene.sys.tweens.addCounter.mock.calls[0][0];
            expect(typeof callArg.onStart).toBe('function');
        });
    });

    describe('pathUpdate', function ()
    {
        it('should not throw when pathTween is null', function ()
        {
            var follower = createFollower();
            follower.pathTween = null;
            follower.path = createMockPath();

            expect(function () { follower.pathUpdate(); }).not.toThrow();
        });

        it('should not throw when pathTween has no data', function ()
        {
            var follower = createFollower();
            var tween = createMockTween(true, false);
            tween.data = null;
            follower.pathTween = tween;

            expect(function () { follower.pathUpdate(); }).not.toThrow();
        });

        it('should update position when tween is playing forward', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            follower.x = 0;
            follower.y = 0;
            follower.pathOffset = new Vector2(0, 0);
            follower.pathVector = new Vector2(0, 0);
            follower.pathDelta = new Vector2(0, 0);

            var tween = createMockTween(true, false);
            tween.getValue = function () { return 0.5; };
            tween.data = [
                {
                    state: TWEEN_CONST.PLAYING_FORWARD,
                    end: 1
                }
            ];
            follower.pathTween = tween;
            follower._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

            follower.pathUpdate();

            expect(follower.setPosition).toHaveBeenCalled();
        });

        it('should update position when tween state is COMPLETE', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            follower.x = 0;
            follower.y = 0;
            follower.pathOffset = new Vector2(0, 0);
            follower.pathVector = new Vector2(0, 0);
            follower.pathDelta = new Vector2(0, 0);

            var tween = createMockTween(false, false);
            tween.data = [
                {
                    state: TWEEN_CONST.COMPLETE,
                    end: 1
                }
            ];
            follower.pathTween = tween;

            follower.pathUpdate();

            expect(follower.setPosition).toHaveBeenCalled();
        });

        it('should bail out early when state is DELAY', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            follower.pathOffset = new Vector2(0, 0);
            follower.pathVector = new Vector2(0, 0);
            follower.pathDelta = new Vector2(0, 0);

            var tween = createMockTween(false, false);
            tween.data = [
                {
                    state: TWEEN_CONST.DELAY,
                    end: 1
                }
            ];
            follower.pathTween = tween;

            follower.pathUpdate();

            expect(follower.setPosition).not.toHaveBeenCalled();
        });

        it('should update rotation when rotateToPath is true and moving', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            follower.x = 0;
            follower.y = 0;
            follower.rotateToPath = true;
            follower.pathRotationOffset = 0;
            follower.rotation = 0;
            follower.pathOffset = new Vector2(0, 0);
            follower.pathVector = new Vector2(0, 0);
            follower.pathDelta = new Vector2(0, 0);

            var tween = createMockTween(true, false);
            tween.getValue = function () { return 0.5; };
            tween.data = [
                {
                    state: TWEEN_CONST.PLAYING_FORWARD,
                    end: 1
                }
            ];
            follower.pathTween = tween;
            follower._prevDirection = TWEEN_CONST.PLAYING_FORWARD;

            // setPosition will move follower so speedX/speedY will be non-zero
            follower.setPosition = vi.fn(function (x, y)
            {
                follower.x = x + 10;
                follower.y = y + 5;
            });

            var initialRotation = follower.rotation;

            follower.pathUpdate();

            // rotation should have been updated
            expect(follower.rotation).not.toBe(initialRotation);
        });

        it('should not update rotation when direction changes', function ()
        {
            var follower = createFollower();
            follower.path = createMockPath();
            follower.x = 0;
            follower.y = 0;
            follower.rotateToPath = true;
            follower.pathRotationOffset = 0;
            follower.rotation = 0;
            follower.pathOffset = new Vector2(0, 0);
            follower.pathVector = new Vector2(0, 0);
            follower.pathDelta = new Vector2(0, 0);

            // Set _prevDirection to BACKWARD so the state (FORWARD) differs
            follower._prevDirection = TWEEN_CONST.PLAYING_BACKWARD;

            var tween = createMockTween(true, false);
            tween.getValue = function () { return 0.5; };
            tween.data = [
                {
                    state: TWEEN_CONST.PLAYING_FORWARD,
                    end: 1
                }
            ];
            follower.pathTween = tween;

            follower.setPosition = vi.fn(function (x, y)
            {
                follower.x = x + 10;
                follower.y = y + 5;
            });

            var initialRotation = follower.rotation;

            follower.pathUpdate();

            expect(follower.rotation).toBe(initialRotation);
            // _prevDirection should be updated to match new state
            expect(follower._prevDirection).toBe(TWEEN_CONST.PLAYING_FORWARD);
        });
    });
});
