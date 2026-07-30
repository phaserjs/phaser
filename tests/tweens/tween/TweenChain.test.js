var TweenChain = require('../../../src/tweens/tween/TweenChain');
var TWEEN_CONST = require('../../../src/tweens/tween/const');

function createMockTween (overrides)
{
    var tween = {
        parent: null,
        state: TWEEN_CONST.PENDING,
        reset: function () { return tween; },
        setActiveState: function () { tween.state = TWEEN_CONST.ACTIVE; },
        setRemovedState: function () { tween.state = TWEEN_CONST.REMOVED; },
        seek: function () {},
        hasTarget: function () { return false; },
        update: function () { return false; },
        destroy: function () {}
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

function createMockParent (tweens)
{
    return {
        timeScale: 1,
        makeActive: function () {},
        create: function (cfg)
        {
            if (tweens)
            {
                return tweens;
            }

            return createMockTween();
        }
    };
}

function createChainWithTweens (tweenList)
{
    var parent = createMockParent(tweenList);
    var chain = new TweenChain(parent);

    // Directly populate data so we don't depend on `add`
    for (var i = 0; i < tweenList.length; i++)
    {
        tweenList[i].parent = chain;
        chain.data.push(tweenList[i]);
    }

    chain.totalData = chain.data.length;

    return chain;
}

describe('TweenChain', function ()
{
    describe('constructor', function ()
    {
        it('should set currentTween to null by default', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(chain.currentTween).toBeNull();
        });

        it('should set currentIndex to 0 by default', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(chain.currentIndex).toBe(0);
        });

        it('should initialise data as empty array', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(Array.isArray(chain.data)).toBe(true);
            expect(chain.data.length).toBe(0);
        });

        it('should set parent reference', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(chain.parent).toBe(parent);
        });

        it('should start in PENDING state', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(chain.state).toBe(TWEEN_CONST.PENDING);
        });

        it('should have loop set to 0', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(chain.loop).toBe(0);
        });
    });

    describe('init', function ()
    {
        it('should return the TweenChain instance', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);

            var result = chain.init();

            expect(result).toBe(chain);
        });

        it('should set loopCounter to loop value when loop >= 0', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.loop = 3;

            chain.init();

            expect(chain.loopCounter).toBe(3);
        });

        it('should set loopCounter to MAX when loop is -1', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.loop = -1;

            chain.init();

            expect(chain.loopCounter).toBe(TWEEN_CONST.MAX);
        });

        it('should set current tween to index 0', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);

            chain.init();

            expect(chain.currentTween).toBe(tween);
            expect(chain.currentIndex).toBe(0);
        });

        it('should set state to ACTIVE when no startDelay', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.startDelay = 0;

            chain.init();

            expect(chain.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should set state to START_DELAY when startDelay is positive', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.startDelay = 500;

            chain.init();

            expect(chain.state).toBe(TWEEN_CONST.START_DELAY);
        });
    });

    describe('hasTarget', function ()
    {
        it('should return false when no tweens are in the chain', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(chain.hasTarget({})).toBe(false);
        });

        it('should return false when no tween has the target', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ hasTarget: function () { return false; } });
            var chain = createChainWithTweens([ tween ]);

            expect(chain.hasTarget(target)).toBe(false);
        });

        it('should return true when a tween has the target', function ()
        {
            var target = { x: 0 };
            var tween = createMockTween({ hasTarget: function (t) { return t === target; } });
            var chain = createChainWithTweens([ tween ]);

            expect(chain.hasTarget(target)).toBe(true);
        });

        it('should return true when any tween in the chain has the target', function ()
        {
            var target = { x: 0 };
            var tweenA = createMockTween({ hasTarget: function () { return false; } });
            var tweenB = createMockTween({ hasTarget: function (t) { return t === target; } });
            var tweenC = createMockTween({ hasTarget: function () { return false; } });
            var chain = createChainWithTweens([ tweenA, tweenB, tweenC ]);

            expect(chain.hasTarget(target)).toBe(true);
        });
    });

    describe('reset', function ()
    {
        it('should return the TweenChain instance', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var tween = createMockTween();

            var result = chain.reset(tween);

            expect(result).toBe(chain);
        });

        it('should call seek on the tween', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var seekCalled = false;
            var tween = createMockTween({ seek: function () { seekCalled = true; } });

            chain.reset(tween);

            expect(seekCalled).toBe(true);
        });

        it('should set the tween to active state', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var tween = createMockTween();
            tween.state = TWEEN_CONST.PENDING;

            chain.reset(tween);

            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });
    });

    describe('makeActive', function ()
    {
        it('should return the TweenChain instance', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var tween = createMockTween();

            var result = chain.makeActive(tween);

            expect(result).toBe(chain);
        });

        it('should call reset on the tween', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var resetCalled = false;
            var tween = createMockTween({ reset: function () { resetCalled = true; return tween; } });

            chain.makeActive(tween);

            expect(resetCalled).toBe(true);
        });

        it('should set tween to active state after reset', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var tween = createMockTween();
            tween.state = TWEEN_CONST.PENDING;

            chain.makeActive(tween);

            expect(tween.state).toBe(TWEEN_CONST.ACTIVE);
        });
    });

    describe('resetTweens', function ()
    {
        it('should reset all tweens in the chain', function ()
        {
            var resetCounts = [ 0, 0, 0 ];
            var tweens = [
                createMockTween({ reset: function () { resetCounts[0]++; } }),
                createMockTween({ reset: function () { resetCounts[1]++; } }),
                createMockTween({ reset: function () { resetCounts[2]++; } })
            ];
            var chain = createChainWithTweens(tweens);

            chain.resetTweens();

            expect(resetCounts[0]).toBe(1);
            expect(resetCounts[1]).toBe(1);
            expect(resetCounts[2]).toBe(1);
        });

        it('should set current index to 0', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.currentIndex = 1;

            chain.resetTweens();

            expect(chain.currentIndex).toBe(0);
        });

        it('should set currentTween to data[0]', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);

            chain.resetTweens();

            expect(chain.currentTween).toBe(tweens[0]);
        });
    });

    describe('nextTween', function ()
    {
        it('should increment currentIndex', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.currentIndex = 0;

            chain.nextTween();

            expect(chain.currentIndex).toBe(1);
        });

        it('should return false when there are more tweens to play', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.currentIndex = 0;

            var result = chain.nextTween();

            expect(result).toBe(false);
        });

        it('should return true when all tweens have been played', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.currentIndex = 0;

            var result = chain.nextTween();

            expect(result).toBe(true);
        });

        it('should update currentTween when not at the end', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.currentIndex = 0;

            chain.nextTween();

            expect(chain.currentTween).toBe(tweens[1]);
        });
    });

    describe('setCurrentTween', function ()
    {
        it('should set currentIndex to given index', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);

            chain.setCurrentTween(1);

            expect(chain.currentIndex).toBe(1);
        });

        it('should set currentTween to data at given index', function ()
        {
            var tweens = [ createMockTween(), createMockTween() ];
            var chain = createChainWithTweens(tweens);

            chain.setCurrentTween(1);

            expect(chain.currentTween).toBe(tweens[1]);
        });

        it('should call setActiveState on the tween at given index', function ()
        {
            var activated = false;
            var tweens = [
                createMockTween(),
                createMockTween({ setActiveState: function () { activated = true; } })
            ];
            var chain = createChainWithTweens(tweens);

            chain.setCurrentTween(1);

            expect(activated).toBe(true);
        });
    });

    describe('remove', function ()
    {
        it('should return the TweenChain instance', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween, createMockTween() ]);
            chain.currentIndex = 1;
            chain.currentTween = chain.data[1];

            var result = chain.remove(tween);

            expect(result).toBe(chain);
        });

        it('should remove the tween from the data array', function ()
        {
            var tweenA = createMockTween();
            var tweenB = createMockTween();
            var chain = createChainWithTweens([ tweenA, tweenB ]);
            chain.currentTween = tweenB;
            chain.currentIndex = 1;

            chain.remove(tweenA);

            expect(chain.data.indexOf(tweenA)).toBe(-1);
        });

        it('should call setRemovedState on the removed tween', function ()
        {
            var removedStateCalled = false;
            var tweenA = createMockTween({ setRemovedState: function () { removedStateCalled = true; } });
            var tweenB = createMockTween();
            var chain = createChainWithTweens([ tweenA, tweenB ]);
            chain.currentTween = tweenB;
            chain.currentIndex = 1;

            chain.remove(tweenA);

            expect(removedStateCalled).toBe(true);
        });

        it('should update totalData after removal', function ()
        {
            var tweenA = createMockTween();
            var tweenB = createMockTween();
            var chain = createChainWithTweens([ tweenA, tweenB ]);
            chain.currentTween = tweenB;
            chain.currentIndex = 1;

            chain.remove(tweenA);

            expect(chain.totalData).toBe(1);
        });
    });

    describe('nextState', function ()
    {
        it('should return true and call onCompleteHandler when loopCounter is 0 and no completeDelay', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.loopCounter = 0;
            chain.completeDelay = 0;

            // onCompleteHandler sets state to PENDING_REMOVE
            var result = chain.nextState();

            expect(result).toBe(true);
            expect(chain.isPendingRemove()).toBe(true);
        });

        it('should decrement loopCounter when it is greater than 0', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.loopCounter = 3;
            chain.loopDelay = 0;

            chain.nextState();

            expect(chain.loopCounter).toBe(2);
        });

        it('should return false when loopCounter is greater than 0', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.loopCounter = 2;
            chain.loopDelay = 0;

            var result = chain.nextState();

            expect(result).toBe(false);
        });

        it('should set state to LOOP_DELAY when loopDelay is positive', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.loopCounter = 1;
            chain.loopDelay = 500;

            chain.nextState();

            expect(chain.state).toBe(TWEEN_CONST.LOOP_DELAY);
            expect(chain.countdown).toBe(500);
        });

        it('should set state to COMPLETE_DELAY when completeDelay is positive and loopCounter is 0', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.loopCounter = 0;
            chain.completeDelay = 200;

            chain.nextState();

            expect(chain.state).toBe(TWEEN_CONST.COMPLETE_DELAY);
            expect(chain.countdown).toBe(200);
        });

        it('should return false when entering complete delay', function ()
        {
            var tweens = [ createMockTween() ];
            var chain = createChainWithTweens(tweens);
            chain.loopCounter = 0;
            chain.completeDelay = 200;

            var result = chain.nextState();

            expect(result).toBe(false);
        });
    });

    describe('play', function ()
    {
        it('should return the TweenChain instance', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);

            var result = chain.play();

            expect(result).toBe(chain);
        });

        it('should set paused to false', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.paused = true;

            chain.play();

            expect(chain.paused).toBe(false);
        });

        it('should set state to ACTIVE when no startDelay', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.startDelay = 0;

            chain.play();

            expect(chain.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should set state to START_DELAY when startDelay is positive', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.startDelay = 300;

            chain.play();

            expect(chain.state).toBe(TWEEN_CONST.START_DELAY);
        });

        it('should warn and return early when chain is destroyed', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.setDestroyedState();

            var result = chain.play();

            expect(result).toBe(chain);
            expect(chain.state).toBe(TWEEN_CONST.DESTROYED);
        });
    });

    describe('dispatchEvent', function ()
    {
        it('should emit the given event', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var emitted = false;
            chain.on('test-event', function () { emitted = true; });

            chain.dispatchEvent('test-event', null);

            expect(emitted).toBe(true);
        });

        it('should pass the TweenChain instance as the event argument', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var receivedArg = null;
            chain.on('test-event', function (arg) { receivedArg = arg; });

            chain.dispatchEvent('test-event', null);

            expect(receivedArg).toBe(chain);
        });

        it('should invoke the named callback when it exists', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var callbackInvoked = false;
            chain.callbacks.onStart = {
                func: function () { callbackInvoked = true; },
                params: []
            };

            chain.dispatchEvent('test-event', 'onStart');

            expect(callbackInvoked).toBe(true);
        });

        it('should pass TweenChain as first argument to the callback', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            var received = null;
            chain.callbacks.onStart = {
                func: function (c) { received = c; },
                params: []
            };

            chain.dispatchEvent('test-event', 'onStart');

            expect(received).toBe(chain);
        });

        it('should not throw when callback name is null', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(function ()
            {
                chain.dispatchEvent('test-event', null);
            }).not.toThrow();
        });

        it('should not throw when callback name does not exist', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);

            expect(function ()
            {
                chain.dispatchEvent('test-event', 'nonExistentCallback');
            }).not.toThrow();
        });
    });

    describe('destroy', function ()
    {
        it('should set currentTween to null', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.currentTween = tween;

            chain.destroy();

            expect(chain.currentTween).toBeNull();
        });

        it('should set state to DESTROYED', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);

            chain.destroy();

            expect(chain.state).toBe(TWEEN_CONST.DESTROYED);
        });
    });

    describe('update', function ()
    {
        it('should return true when state is PENDING_REMOVE and persist is false', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.setPendingRemoveState();
            chain.persist = false;

            var result = chain.update(16);

            expect(result).toBe(true);
        });

        it('should return false and set FINISHED state when PENDING_REMOVE and persist is true', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.setPendingRemoveState();
            chain.persist = true;

            var result = chain.update(16);

            expect(result).toBe(false);
            expect(chain.state).toBe(TWEEN_CONST.FINISHED);
        });

        it('should return false when chain is paused', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.setActiveState();
            chain.paused = true;

            var result = chain.update(16);

            expect(result).toBe(false);
        });

        it('should return false when chain is in FINISHED state', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.setFinishedState();

            var result = chain.update(16);

            expect(result).toBe(false);
        });

        it('should call update on currentTween when active', function ()
        {
            var updateCalled = false;
            var tween = createMockTween({ update: function () { updateCalled = true; return false; } });
            var chain = createChainWithTweens([ tween ]);
            chain.setActiveState();
            chain.currentTween = tween;
            chain.hasStarted = true;

            chain.update(16);

            expect(updateCalled).toBe(true);
        });

        it('should advance to next tween when currentTween update returns true', function ()
        {
            var tweenA = createMockTween({ update: function () { return true; } });
            var tweenB = createMockTween({ update: function () { return false; } });
            var chain = createChainWithTweens([ tweenA, tweenB ]);
            chain.setActiveState();
            chain.currentTween = tweenA;
            chain.hasStarted = true;

            chain.update(16);

            expect(chain.currentTween).toBe(tweenB);
        });
    });

    describe('restart', function ()
    {
        it('should return the TweenChain instance', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);

            var result = chain.restart();

            expect(result).toBe(chain);
        });

        it('should set paused to false', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);
            chain.paused = true;

            chain.restart();

            expect(chain.paused).toBe(false);
        });

        it('should re-initialise the chain', function ()
        {
            var tween = createMockTween();
            var chain = createChainWithTweens([ tween ]);

            chain.restart();

            expect(chain.currentTween).toBe(tween);
            expect(chain.state).toBe(TWEEN_CONST.ACTIVE);
        });

        it('should warn and return early when chain is destroyed', function ()
        {
            var parent = createMockParent();
            var chain = new TweenChain(parent);
            chain.setDestroyedState();

            var result = chain.restart();

            expect(result).toBe(chain);
            expect(chain.state).toBe(TWEEN_CONST.DESTROYED);
        });

        it('should call makeActive on parent when chain is in REMOVED state', function ()
        {
            var makeActiveCalled = false;
            var parent = createMockParent();
            parent.makeActive = function () { makeActiveCalled = true; };
            var tween = createMockTween();
            var chain = new TweenChain(parent);
            chain.data.push(tween);
            chain.totalData = 1;
            chain.setRemovedState();

            chain.restart();

            expect(makeActiveCalled).toBe(true);
        });
    });
});
