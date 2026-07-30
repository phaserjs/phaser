var Tween = require('../../../src/tweens/tween/Tween');
var TWEEN_CONST = require('../../../src/tweens/tween/const');

function createParent ()
{
    return {
        timeScale: 1,
        makeActive: function () {},
        remove: function () {},
        reset: function () {}
    };
}

function createTween (targets, parent)
{
    if (targets === undefined) { targets = [ { x: 0, y: 0 } ]; }
    if (parent === undefined) { parent = createParent(); }

    return new Tween(parent, targets);
}

function createTweenData (key, current, start, end, isForward)
{
    return {
        key: key,
        current: current,
        start: start,
        end: end,
        isPlayingForward: function () { return isForward === true; },
        isPlayingBackward: function () { return isForward === false; },
        reset: function () {}
    };
}

describe('Tween', function ()
{
    describe('constructor', function ()
    {
        it('should store the given targets', function ()
        {
            var targets = [ { x: 0 }, { y: 0 } ];
            var tween = createTween(targets);

            expect(tween.targets).toBe(targets);
        });

        it('should set totalTargets to targets.length', function ()
        {
            var targets = [ {}, {}, {} ];
            var tween = createTween(targets);

            expect(tween.totalTargets).toBe(3);
        });

        it('should initialise isSeeking to false', function ()
        {
            var tween = createTween();

            expect(tween.isSeeking).toBe(false);
        });

        it('should initialise isInfinite to false', function ()
        {
            var tween = createTween();

            expect(tween.isInfinite).toBe(false);
        });

        it('should initialise elapsed to zero', function ()
        {
            var tween = createTween();

            expect(tween.elapsed).toBe(0);
        });

        it('should initialise totalElapsed to zero', function ()
        {
            var tween = createTween();

            expect(tween.totalElapsed).toBe(0);
        });

        it('should initialise duration to zero', function ()
        {
            var tween = createTween();

            expect(tween.duration).toBe(0);
        });

        it('should initialise progress to zero', function ()
        {
            var tween = createTween();

            expect(tween.progress).toBe(0);
        });

        it('should initialise totalDuration to zero', function ()
        {
            var tween = createTween();

            expect(tween.totalDuration).toBe(0);
        });

        it('should initialise totalProgress to zero', function ()
        {
            var tween = createTween();

            expect(tween.totalProgress).toBe(0);
        });

        it('should initialise isNumberTween to false', function ()
        {
            var tween = createTween();

            expect(tween.isNumberTween).toBe(false);
        });

        it('should store the parent reference', function ()
        {
            var parent = createParent();
            var tween = createTween([ {} ], parent);

            expect(tween.parent).toBe(parent);
        });

        it('should work with an empty targets array', function ()
        {
            var tween = createTween([]);

            expect(tween.targets).toEqual([]);
            expect(tween.totalTargets).toBe(0);
        });
    });

    describe('add', function ()
    {
        it('should return a TweenData instance', function ()
        {
            var tween = createTween();

            var getEnd = function () { return 100; };
            var getStart = function () { return 0; };
            var ease = function (v) { return v; };
            var delay = function () { return 0; };

            var tweenData = tween.add(0, 'x', getEnd, getStart, null, ease, delay, 1000, false, 0, 0, 0, false, false, null, null);

            expect(tweenData).not.toBeNull();
            expect(typeof tweenData).toBe('object');
        });

        it('should push the TweenData into the data array', function ()
        {
            var tween = createTween();

            var getEnd = function () { return 100; };
            var getStart = function () { return 0; };
            var ease = function (v) { return v; };
            var delay = function () { return 0; };

            expect(tween.data.length).toBe(0);

            tween.add(0, 'x', getEnd, getStart, null, ease, delay, 1000, false, 0, 0, 0, false, false, null, null);

            expect(tween.data.length).toBe(1);
        });

        it('should update totalData after adding', function ()
        {
            var tween = createTween();

            var getEnd = function () { return 100; };
            var getStart = function () { return 0; };
            var ease = function (v) { return v; };
            var delay = function () { return 0; };

            tween.add(0, 'x', getEnd, getStart, null, ease, delay, 1000, false, 0, 0, 0, false, false, null, null);

            expect(tween.totalData).toBe(1);
        });

        it('should accumulate multiple TweenData entries', function ()
        {
            var tween = createTween([ { x: 0, y: 0 } ]);

            var getEnd = function () { return 100; };
            var getStart = function () { return 0; };
            var ease = function (v) { return v; };
            var delay = function () { return 0; };

            tween.add(0, 'x', getEnd, getStart, null, ease, delay, 1000, false, 0, 0, 0, false, false, null, null);
            tween.add(0, 'y', getEnd, getStart, null, ease, delay, 1000, false, 0, 0, 0, false, false, null, null);

            expect(tween.data.length).toBe(2);
            expect(tween.totalData).toBe(2);
        });
    });

    describe('addFrame', function ()
    {
        it('should return a TweenFrameData instance', function ()
        {
            var tween = createTween();

            var delay = function () { return 0; };

            var tweenData = tween.addFrame(0, 'texture', 'frame01', delay, 1000, 0, 0, 0, false, false);

            expect(tweenData).not.toBeNull();
            expect(typeof tweenData).toBe('object');
        });

        it('should push the TweenFrameData into the data array', function ()
        {
            var tween = createTween();

            var delay = function () { return 0; };

            tween.addFrame(0, 'texture', 'frame01', delay, 1000, 0, 0, 0, false, false);

            expect(tween.data.length).toBe(1);
        });

        it('should update totalData after adding', function ()
        {
            var tween = createTween();

            var delay = function () { return 0; };

            tween.addFrame(0, 'texture', 'frame01', delay, 1000, 0, 0, 0, false, false);

            expect(tween.totalData).toBe(1);
        });

        it('should accumulate alongside TweenData entries', function ()
        {
            var tween = createTween();

            var delay = function () { return 0; };
            var ease = function (v) { return v; };
            var getEnd = function () { return 100; };
            var getStart = function () { return 0; };

            tween.add(0, 'x', getEnd, getStart, null, ease, delay, 1000, false, 0, 0, 0, false, false, null, null);
            tween.addFrame(0, 'texture', 'frame01', delay, 1000, 0, 0, 0, false, false);

            expect(tween.totalData).toBe(2);
        });
    });

    describe('getValue', function ()
    {
        it('should return null when data is null (destroyed tween)', function ()
        {
            var tween = createTween();

            tween.data = null;

            expect(tween.getValue()).toBeNull();
        });

        it('should return the current value of the first tween data by default', function ()
        {
            var tween = createTween();

            tween.data = [ createTweenData('x', 42, 0, 100, true) ];

            expect(tween.getValue()).toBe(42);
        });

        it('should return the current value at the specified index', function ()
        {
            var tween = createTween();

            tween.data = [
                createTweenData('x', 10, 0, 100, true),
                createTweenData('y', 50, 0, 100, true)
            ];

            expect(tween.getValue(0)).toBe(10);
            expect(tween.getValue(1)).toBe(50);
        });

        it('should default index to 0 when not provided', function ()
        {
            var tween = createTween();

            tween.data = [
                createTweenData('x', 77, 0, 100, true),
                createTweenData('y', 33, 0, 100, true)
            ];

            expect(tween.getValue()).toBe(77);
        });

        it('should return a floating point value', function ()
        {
            var tween = createTween();

            tween.data = [ createTweenData('x', 3.14, 0, 10, true) ];

            expect(tween.getValue()).toBeCloseTo(3.14);
        });
    });

    describe('hasTarget', function ()
    {
        it('should return true when the target is in the targets array', function ()
        {
            var target = { x: 0 };
            var tween = createTween([ target ]);

            expect(tween.hasTarget(target)).toBe(true);
        });

        it('should return false when the target is not in the targets array', function ()
        {
            var target = { x: 0 };
            var other = { x: 1 };
            var tween = createTween([ target ]);

            expect(tween.hasTarget(other)).toBe(false);
        });

        it('should return falsy when targets is null', function ()
        {
            var tween = createTween();

            tween.targets = null;

            expect(tween.hasTarget({})).toBeFalsy();
        });

        it('should return false for an empty targets array', function ()
        {
            var tween = createTween([]);

            expect(tween.hasTarget({ x: 0 })).toBe(false);
        });

        it('should find the correct target among multiple targets', function ()
        {
            var t1 = { id: 1 };
            var t2 = { id: 2 };
            var t3 = { id: 3 };
            var tween = createTween([ t1, t2, t3 ]);

            expect(tween.hasTarget(t1)).toBe(true);
            expect(tween.hasTarget(t2)).toBe(true);
            expect(tween.hasTarget(t3)).toBe(true);
            expect(tween.hasTarget({ id: 4 })).toBe(false);
        });
    });

    describe('updateTo', function ()
    {
        it('should return this for method chaining', function ()
        {
            var tween = createTween();

            tween.data = [];
            tween.totalData = 0;

            expect(tween.updateTo('x', 100)).toBe(tween);
        });

        it('should update end value for matching forward-playing tween data', function ()
        {
            var tween = createTween();
            var td = createTweenData('x', 50, 0, 100, true);

            tween.data = [ td ];
            tween.totalData = 1;

            tween.updateTo('x', 200);

            expect(td.end).toBe(200);
        });

        it('should update end value for matching backward-playing tween data', function ()
        {
            var tween = createTween();
            var td = createTweenData('x', 50, 0, 100, false);

            tween.data = [ td ];
            tween.totalData = 1;

            tween.updateTo('x', 300);

            expect(td.end).toBe(300);
        });

        it('should not update end when tween data is not playing', function ()
        {
            var tween = createTween();
            var td = {
                key: 'x',
                current: 50,
                start: 0,
                end: 100,
                isPlayingForward: function () { return false; },
                isPlayingBackward: function () { return false; }
            };

            tween.data = [ td ];
            tween.totalData = 1;

            tween.updateTo('x', 999);

            expect(td.end).toBe(100);
        });

        it('should not update any data when key is texture', function ()
        {
            var tween = createTween();
            var td = createTweenData('texture', 0, 0, 1, true);

            tween.data = [ td ];
            tween.totalData = 1;

            tween.updateTo('texture', 999);

            expect(td.end).toBe(1);
        });

        it('should set start to current when startToCurrent is true', function ()
        {
            var tween = createTween();
            var td = createTweenData('x', 75, 0, 100, true);

            tween.data = [ td ];
            tween.totalData = 1;

            tween.updateTo('x', 200, true);

            expect(td.end).toBe(200);
            expect(td.start).toBe(75);
        });

        it('should not modify start when startToCurrent is false', function ()
        {
            var tween = createTween();
            var td = createTweenData('x', 75, 0, 100, true);

            tween.data = [ td ];
            tween.totalData = 1;

            tween.updateTo('x', 200, false);

            expect(td.start).toBe(0);
        });

        it('should only update tween data with matching key', function ()
        {
            var tween = createTween();
            var tdX = createTweenData('x', 50, 0, 100, true);
            var tdY = createTweenData('y', 50, 0, 100, true);

            tween.data = [ tdX, tdY ];
            tween.totalData = 2;

            tween.updateTo('x', 999);

            expect(tdX.end).toBe(999);
            expect(tdY.end).toBe(100);
        });
    });

    describe('onCompleteHandler', function ()
    {
        it('should set progress to 1', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.emit = function () {};
            tween.setDestroyedState = function () {};
            tween.setFinishedState = function () {};
            tween.setPendingRemoveState = function () {};
            tween.chain = null;
            tween.persist = false;

            tween.onCompleteHandler();

            expect(tween.progress).toBe(1);
        });

        it('should set totalProgress to 1', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.emit = function () {};
            tween.setDestroyedState = function () {};
            tween.setFinishedState = function () {};
            tween.setPendingRemoveState = function () {};
            tween.chain = null;
            tween.persist = false;

            tween.onCompleteHandler();

            expect(tween.totalProgress).toBe(1);
        });
    });

    describe('dispatchEvent', function ()
    {
        it('should emit the event when not seeking', function ()
        {
            var tween = createTween();
            var emitted = [];

            tween.emit = function (event)
            {
                emitted.push(event);
            };

            tween.callbacks = null;
            tween.isSeeking = false;

            tween.dispatchEvent('test-event', null);

            expect(emitted.length).toBe(1);
            expect(emitted[0]).toBe('test-event');
        });

        it('should not emit when seeking', function ()
        {
            var tween = createTween();
            var emitted = [];

            tween.emit = function (event)
            {
                emitted.push(event);
            };

            tween.callbacks = null;
            tween.isSeeking = true;

            tween.dispatchEvent('test-event', null);

            expect(emitted.length).toBe(0);
        });

        it('should invoke the callback handler when present and not seeking', function ()
        {
            var tween = createTween();
            var called = false;

            tween.emit = function () {};
            tween.isSeeking = false;
            tween.callbackScope = null;
            tween.callbacks = {
                onComplete: {
                    func: function () { called = true; },
                    params: []
                }
            };

            tween.dispatchEvent('some-event', 'onComplete');

            expect(called).toBe(true);
        });

        it('should not invoke callback when isSeeking is true', function ()
        {
            var tween = createTween();
            var called = false;

            tween.emit = function () {};
            tween.isSeeking = true;
            tween.callbackScope = null;
            tween.callbacks = {
                onComplete: {
                    func: function () { called = true; },
                    params: []
                }
            };

            tween.dispatchEvent('some-event', 'onComplete');

            expect(called).toBe(false);
        });

        it('should not throw when callbacks is null', function ()
        {
            var tween = createTween();

            tween.emit = function () {};
            tween.isSeeking = false;
            tween.callbacks = null;

            expect(function ()
            {
                tween.dispatchEvent('some-event', 'onComplete');
            }).not.toThrow();
        });

        it('should pass tween and targets to the callback', function ()
        {
            var target = { x: 0 };
            var tween = createTween([ target ]);
            var received = null;

            tween.emit = function () {};
            tween.isSeeking = false;
            tween.callbackScope = null;
            tween.callbacks = {
                onStart: {
                    func: function (tw, targets)
                    {
                        received = { tw: tw, targets: targets };
                    },
                    params: []
                }
            };

            tween.dispatchEvent('tween-start', 'onStart');

            expect(received).not.toBeNull();
            expect(received.tw).toBe(tween);
            expect(received.targets).toBe(tween.targets);
        });
    });

    describe('forward', function ()
    {
        it('should return this for method chaining', function ()
        {
            var tween = createTween();

            tween.update = function () { return false; };

            expect(tween.forward(100)).toBe(tween);
        });

        it('should call update with the given ms value', function ()
        {
            var tween = createTween();
            var updateCalledWith = null;

            tween.update = function (delta)
            {
                updateCalledWith = delta;
                return false;
            };

            tween.forward(250);

            expect(updateCalledWith).toBe(250);
        });
    });

    describe('rewind', function ()
    {
        it('should return this for method chaining', function ()
        {
            var tween = createTween();

            tween.update = function () { return false; };

            expect(tween.rewind(100)).toBe(tween);
        });

        it('should call update with the negated ms value', function ()
        {
            var tween = createTween();
            var updateCalledWith = null;

            tween.update = function (delta)
            {
                updateCalledWith = delta;
                return false;
            };

            tween.rewind(250);

            expect(updateCalledWith).toBe(-250);
        });

        it('should negate zero correctly', function ()
        {
            var tween = createTween();
            var updateCalledWith = null;

            tween.update = function (delta)
            {
                updateCalledWith = delta;
                return false;
            };

            tween.rewind(0);

            expect(updateCalledWith).toBe(-0);
        });
    });

    describe('reset', function ()
    {
        it('should return this for method chaining', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};

            expect(tween.reset()).toBe(tween);
        });

        it('should reset elapsed to zero', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.elapsed = 999;

            tween.reset();

            expect(tween.elapsed).toBe(0);
        });

        it('should reset totalElapsed to zero', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.totalElapsed = 999;

            tween.reset();

            expect(tween.totalElapsed).toBe(0);
        });

        it('should reset progress to zero', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.progress = 0.75;

            tween.reset();

            expect(tween.progress).toBe(0);
        });

        it('should reset totalProgress to zero', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.totalProgress = 0.5;

            tween.reset();

            expect(tween.totalProgress).toBe(0);
        });

        it('should set loopCounter to loop value', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.loop = 3;

            tween.reset();

            expect(tween.loopCounter).toBe(3);
        });

        it('should set isInfinite to true when loop is -1', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.loop = -1;

            tween.reset();

            expect(tween.isInfinite).toBe(true);
        });

        it('should set loopCounter to TWEEN_CONST.MAX when loop is -1', function ()
        {
            var tween = createTween();

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () {};
            tween.setActiveState = function () {};
            tween.loop = -1;

            tween.reset();

            expect(tween.loopCounter).toBe(TWEEN_CONST.MAX);
        });

        it('should not call initTweenData when skipInit is true', function ()
        {
            var tween = createTween();
            var initCalled = false;

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () { initCalled = true; };
            tween.setActiveState = function () {};

            tween.reset(true);

            expect(initCalled).toBe(false);
        });

        it('should call initTweenData when skipInit is false', function ()
        {
            var tween = createTween();
            var initCalled = false;

            tween.dispatchEvent = function () {};
            tween.initTweenData = function () { initCalled = true; };
            tween.setActiveState = function () {};

            tween.reset(false);

            expect(initCalled).toBe(true);
        });
    });

    describe('initTweenData', function ()
    {
        it('should clamp duration to at least 0.01', function ()
        {
            var tween = createTween();

            //  No data, so duration stays 0 — gets clamped to 0.01
            tween.data = [];
            tween.totalData = 0;
            tween.completeDelay = 0;
            tween.loopCounter = 0;
            tween.loopDelay = 0;

            tween.initTweenData();

            expect(tween.duration).toBeCloseTo(0.01);
        });

        it('should compute totalDuration without loops', function ()
        {
            var tween = createTween();
            var resetCount = 0;

            tween.data = [
                {
                    reset: function ()
                    {
                        resetCount++;
                        tween.duration = 1000;
                        tween.startDelay = 0;
                    }
                }
            ];
            tween.totalData = 1;
            tween.completeDelay = 200;
            tween.loopCounter = 0;
            tween.loopDelay = 0;

            tween.initTweenData();

            //  duration (1000) + completeDelay (200) = 1200
            expect(tween.totalDuration).toBe(1200);
        });

        it('should compute totalDuration with loops', function ()
        {
            var tween = createTween();

            tween.data = [
                {
                    reset: function ()
                    {
                        tween.duration = 1000;
                        tween.startDelay = 0;
                    }
                }
            ];
            tween.totalData = 1;
            tween.completeDelay = 0;
            tween.loopCounter = 2;
            tween.loopDelay = 100;

            tween.initTweenData();

            //  duration + ((duration + loopDelay) * loopCounter)
            //  1000 + ((1000 + 100) * 2) = 1000 + 2200 = 3200
            expect(tween.totalDuration).toBe(3200);
        });

        it('should call reset on each tween data entry', function ()
        {
            var tween = createTween();
            var resets = [];

            tween.data = [
                {
                    reset: function (seeking)
                    {
                        resets.push(seeking);
                        tween.duration = 500;
                        tween.startDelay = 0;
                    }
                },
                {
                    reset: function (seeking)
                    {
                        resets.push(seeking);
                    }
                }
            ];
            tween.totalData = 2;
            tween.completeDelay = 0;
            tween.loopCounter = 0;
            tween.loopDelay = 0;

            tween.initTweenData(false);

            expect(resets.length).toBe(2);
            expect(resets[0]).toBe(false);
            expect(resets[1]).toBe(false);
        });

        it('should pass isSeeking=true to tween data reset when seeking', function ()
        {
            var tween = createTween();
            var seekingArg = null;

            tween.data = [
                {
                    reset: function (seeking)
                    {
                        seekingArg = seeking;
                        tween.duration = 500;
                        tween.startDelay = 0;
                    }
                }
            ];
            tween.totalData = 1;
            tween.completeDelay = 0;
            tween.loopCounter = 0;
            tween.loopDelay = 0;

            tween.initTweenData(true);

            expect(seekingArg).toBe(true);
        });
    });

    describe('destroy', function ()
    {
        it('should set targets to null', function ()
        {
            var tween = createTween([ { x: 0 } ]);

            //  Stub BaseTween.destroy dependencies
            tween.emit = function () {};
            tween.removeAllListeners = function () {};
            tween.setDestroyedState = function () {};
            tween.data = [];

            tween.destroy();

            expect(tween.targets).toBeNull();
        });
    });

    describe('hasTarget after destroy', function ()
    {
        it('should return falsy after targets set to null', function ()
        {
            var target = { x: 0 };
            var tween = createTween([ target ]);

            tween.targets = null;

            expect(tween.hasTarget(target)).toBeFalsy();
        });
    });
});
