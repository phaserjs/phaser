var TweenManager = require('../../src/tweens/TweenManager');

function createMockEvents ()
{
    return {
        once: function () {},
        on: function () {},
        off: function () {},
        emit: function () {}
    };
}

function createMockScene ()
{
    return {
        sys: {
            events: createMockEvents()
        }
    };
}

function createMockTween (overrides)
{
    var tween = {
        _state: 'active',
        _playing: false,
        _target: null,
        isPlaying: function () { return this._playing; },
        hasTarget: function (t) { return this._target === t; },
        isDestroyed: function () { return this._state === 'destroyed'; },
        isPendingRemove: function () { return this._state === 'pendingRemove'; },
        setRemovedState: function () { this._state = 'removed'; },
        setPendingRemoveState: function () { this._state = 'pendingRemove'; },
        setActiveState: function () { this._state = 'active'; },
        reset: function () { return this; },
        seek: function () {},
        destroy: function () { this._state = 'destroyed'; },
        update: function () { return false; },
        getChainedTweens: function () { return []; }
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            tween[key] = overrides[key];
        }
    }

    return tween;
}

describe('TweenManager', function ()
{
    var scene;
    var manager;

    beforeEach(function ()
    {
        scene = createMockScene();
        manager = new TweenManager(scene);
    });

    describe('constructor', function ()
    {
        it('should set scene reference', function ()
        {
            expect(manager.scene).toBe(scene);
        });

        it('should set events reference from scene.sys.events', function ()
        {
            expect(manager.events).toBe(scene.sys.events);
        });

        it('should default timeScale to 1', function ()
        {
            expect(manager.timeScale).toBe(1);
        });

        it('should default paused to false', function ()
        {
            expect(manager.paused).toBe(false);
        });

        it('should default processing to false', function ()
        {
            expect(manager.processing).toBe(false);
        });

        it('should initialise tweens as an empty array', function ()
        {
            expect(Array.isArray(manager.tweens)).toBe(true);
            expect(manager.tweens.length).toBe(0);
        });

        it('should default maxLag to 500', function ()
        {
            expect(manager.maxLag).toBe(500);
        });

        it('should default lagSkip to 33', function ()
        {
            expect(manager.lagSkip).toBe(33);
        });

        it('should set gap to 1000/240', function ()
        {
            expect(manager.gap).toBeCloseTo(1000 / 240);
        });
    });

    describe('has', function ()
    {
        it('should return false when tweens array is empty', function ()
        {
            var tween = createMockTween();
            expect(manager.has(tween)).toBe(false);
        });

        it('should return true when tween exists in the list', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            expect(manager.has(tween)).toBe(true);
        });

        it('should return false when a different tween is checked', function ()
        {
            var tweenA = createMockTween();
            var tweenB = createMockTween();
            manager.tweens.push(tweenA);
            expect(manager.has(tweenB)).toBe(false);
        });
    });

    describe('existing', function ()
    {
        it('should add a tween that is not already present', function ()
        {
            var tween = createMockTween();
            manager.existing(tween);
            expect(manager.tweens.length).toBe(1);
            expect(manager.tweens[0]).toBe(tween);
        });

        it('should not add a tween that is already present', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.existing(tween);
            expect(manager.tweens.length).toBe(1);
        });

        it('should return the TweenManager instance', function ()
        {
            var tween = createMockTween();
            var result = manager.existing(tween);
            expect(result).toBe(manager);
        });
    });

    describe('getTweens', function ()
    {
        it('should return an empty array when no tweens exist', function ()
        {
            var result = manager.getTweens();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return a copy of the tweens array', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            var result = manager.getTweens();
            expect(result.length).toBe(1);
            expect(result[0]).toBe(tween);
            expect(result).not.toBe(manager.tweens);
        });

        it('should reflect all current tweens', function ()
        {
            var tweenA = createMockTween();
            var tweenB = createMockTween();
            manager.tweens.push(tweenA, tweenB);
            var result = manager.getTweens();
            expect(result.length).toBe(2);
        });
    });

    describe('getTweensOf', function ()
    {
        it('should return empty array when no tweens match', function ()
        {
            var target = { x: 0 };
            var result = manager.getTweensOf(target);
            expect(result.length).toBe(0);
        });

        it('should return matching tween for a given target', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ _target: target });
            manager.tweens.push(tween);
            var result = manager.getTweensOf(target);
            expect(result.length).toBe(1);
            expect(result[0]).toBe(tween);
        });

        it('should not return destroyed tweens', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ _target: target });
            tween._state = 'destroyed';
            manager.tweens.push(tween);
            var result = manager.getTweensOf(target);
            expect(result.length).toBe(0);
        });

        it('should accept an array of targets', function ()
        {
            var targetA = { x: 0 };
            var targetB = { y: 0 };
            var tweenA = createMockTween({ _target: targetA });
            var tweenB = createMockTween({ _target: targetB });
            manager.tweens.push(tweenA, tweenB);
            var result = manager.getTweensOf([ targetA, targetB ]);
            expect(result.length).toBe(2);
        });
    });

    describe('getGlobalTimeScale', function ()
    {
        it('should return the current timeScale', function ()
        {
            expect(manager.getGlobalTimeScale()).toBe(1);
        });

        it('should return updated timeScale after setGlobalTimeScale', function ()
        {
            manager.setGlobalTimeScale(2);
            expect(manager.getGlobalTimeScale()).toBe(2);
        });
    });

    describe('setGlobalTimeScale', function ()
    {
        it('should set the timeScale property', function ()
        {
            manager.setGlobalTimeScale(0.5);
            expect(manager.timeScale).toBe(0.5);
        });

        it('should accept zero', function ()
        {
            manager.setGlobalTimeScale(0);
            expect(manager.timeScale).toBe(0);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.setGlobalTimeScale(2);
            expect(result).toBe(manager);
        });
    });

    describe('pauseAll', function ()
    {
        it('should set paused to true', function ()
        {
            manager.pauseAll();
            expect(manager.paused).toBe(true);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.pauseAll();
            expect(result).toBe(manager);
        });
    });

    describe('resumeAll', function ()
    {
        it('should set paused to false', function ()
        {
            manager.paused = true;
            manager.resumeAll();
            expect(manager.paused).toBe(false);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.resumeAll();
            expect(result).toBe(manager);
        });
    });

    describe('setLagSmooth', function ()
    {
        it('should set maxLag and lagSkip', function ()
        {
            manager.setLagSmooth(1000, 50);
            expect(manager.maxLag).toBe(1000);
            expect(manager.lagSkip).toBe(50);
        });

        it('should clamp lagSkip to maxLag if skip exceeds limit', function ()
        {
            manager.setLagSmooth(100, 200);
            expect(manager.lagSkip).toBe(100);
        });

        it('should disable smoothing when called with no arguments', function ()
        {
            manager.setLagSmooth();
            expect(manager.lagSkip).toBe(0);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.setLagSmooth(500, 33);
            expect(result).toBe(manager);
        });
    });

    describe('setFps', function ()
    {
        it('should set gap to 1000/fps', function ()
        {
            manager.setFps(60);
            expect(manager.gap).toBeCloseTo(1000 / 60);
        });

        it('should default to 240fps when no argument given', function ()
        {
            manager.setFps();
            expect(manager.gap).toBeCloseTo(1000 / 240);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.setFps(60);
            expect(result).toBe(manager);
        });
    });

    describe('isTweening', function ()
    {
        it('should return false when no tweens are present', function ()
        {
            expect(manager.isTweening({})).toBe(false);
        });

        it('should return true when a playing tween targets the object', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ _playing: true, _target: target });
            manager.tweens.push(tween);
            expect(manager.isTweening(target)).toBe(true);
        });

        it('should return false when tween is not playing', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ _playing: false, _target: target });
            manager.tweens.push(tween);
            expect(manager.isTweening(target)).toBe(false);
        });

        it('should return false when playing tween targets a different object', function ()
        {
            var targetA = { x: 0 };
            var targetB = { x: 0 };
            var tween = createMockTween({ _playing: true, _target: targetA });
            manager.tweens.push(tween);
            expect(manager.isTweening(targetB)).toBe(false);
        });
    });

    describe('remove', function ()
    {
        it('should remove a tween from the list when not processing', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.remove(tween);
            expect(manager.tweens.length).toBe(0);
        });

        it('should flag tween as removed when not processing', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.remove(tween);
            expect(tween._state).toBe('removed');
        });

        it('should set pending remove state when processing', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.processing = true;
            manager.remove(tween);
            expect(tween._state).toBe('pendingRemove');
            expect(manager.tweens.length).toBe(1);
        });

        it('should return the TweenManager instance', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            var result = manager.remove(tween);
            expect(result).toBe(manager);
        });
    });

    describe('makeActive', function ()
    {
        it('should add tween to list if not present', function ()
        {
            var tween = createMockTween();
            manager.makeActive(tween);
            expect(manager.tweens.length).toBe(1);
        });

        it('should set the tween state to active', function ()
        {
            var tween = createMockTween();
            tween._state = 'idle';
            manager.makeActive(tween);
            expect(tween._state).toBe('active');
        });

        it('should return the TweenManager instance', function ()
        {
            var tween = createMockTween();
            var result = manager.makeActive(tween);
            expect(result).toBe(manager);
        });
    });

    describe('each', function ()
    {
        it('should call callback for each tween', function ()
        {
            var tweenA = createMockTween();
            var tweenB = createMockTween();
            manager.tweens.push(tweenA, tweenB);

            var visited = [];
            manager.each(function (tween)
            {
                visited.push(tween);
            });

            expect(visited.length).toBe(2);
            expect(visited[0]).toBe(tweenA);
            expect(visited[1]).toBe(tweenB);
        });

        it('should call callback with provided scope', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);

            var scope = { value: 42 };
            var capturedThis;

            manager.each(function ()
            {
                capturedThis = this;
            }, scope);

            expect(capturedThis).toBe(scope);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.each(function () {});
            expect(result).toBe(manager);
        });
    });

    describe('killAll', function ()
    {
        it('should destroy all tweens', function ()
        {
            var tweenA = createMockTween();
            var tweenB = createMockTween();
            manager.tweens.push(tweenA, tweenB);
            manager.killAll();
            expect(tweenA._state).toBe('destroyed');
            expect(tweenB._state).toBe('destroyed');
        });

        it('should empty the tweens array when not processing', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.killAll();
            expect(manager.tweens.length).toBe(0);
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.killAll();
            expect(result).toBe(manager);
        });
    });

    describe('killTweensOf', function ()
    {
        it('should destroy tweens that target the given object', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ _target: target });
            manager.tweens.push(tween);
            manager.killTweensOf(target);
            expect(tween._state).toBe('destroyed');
        });

        it('should not destroy tweens targeting other objects', function ()
        {
            var targetA = { x: 0 };
            var targetB = { x: 0 };
            var tween = createMockTween({ _target: targetA });
            manager.tweens.push(tween);
            manager.killTweensOf(targetB);
            expect(tween._state).not.toBe('destroyed');
        });

        it('should return the TweenManager instance', function ()
        {
            var result = manager.killTweensOf({});
            expect(result).toBe(manager);
        });
    });

    describe('shutdown', function ()
    {
        it('should clear the tweens array', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.shutdown();
            expect(manager.tweens.length).toBe(0);
        });

        it('should destroy tweens during shutdown', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.shutdown();
            expect(tween._state).toBe('destroyed');
        });
    });

    describe('destroy', function ()
    {
        it('should null out the scene reference', function ()
        {
            manager.destroy();
            expect(manager.scene).toBeNull();
        });

        it('should null out the events reference', function ()
        {
            manager.destroy();
            expect(manager.events).toBeNull();
        });

        it('should clear tweens before destroying', function ()
        {
            var tween = createMockTween();
            manager.tweens.push(tween);
            manager.destroy();
            expect(manager.tweens.length).toBe(0);
        });
    });

    describe('getChainedTweens', function ()
    {
        it('should delegate to tween.getChainedTweens', function ()
        {
            var chainResult = [ createMockTween() ];
            var tween = createMockTween({
                getChainedTweens: function () { return chainResult; }
            });
            var result = manager.getChainedTweens(tween);
            expect(result).toBe(chainResult);
        });

        it('should return empty array when no chained tweens', function ()
        {
            var tween = createMockTween();
            var result = manager.getChainedTweens(tween);
            expect(result.length).toBe(0);
        });
    });
});
