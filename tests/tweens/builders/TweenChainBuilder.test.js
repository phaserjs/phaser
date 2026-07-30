var TweenChainBuilder = require('../../../src/tweens/builders/TweenChainBuilder');
var TweenChain = require('../../../src/tweens/tween/TweenChain');

describe('Phaser.Tweens.Builders.TweenChainBuilder', function ()
{
    var mockParent;

    beforeEach(function ()
    {
        mockParent = {
            _isMockParent: true,
            create: function (tweens)
            {
                return tweens;
            }
        };
    });

    describe('return existing TweenChain', function ()
    {
        it('should return the same TweenChain instance when config is already a TweenChain', function ()
        {
            var existing = new TweenChain(mockParent);
            var result = TweenChainBuilder(mockParent, existing);

            expect(result).toBe(existing);
        });

        it('should update the parent when config is an existing TweenChain', function ()
        {
            var otherParent = { create: function (t) { return t; } };
            var existing = new TweenChain(otherParent);
            TweenChainBuilder(mockParent, existing);

            expect(existing.parent).toBe(mockParent);
        });

        it('should not create a new TweenChain when config is already a TweenChain', function ()
        {
            var existing = new TweenChain(mockParent);
            var result = TweenChainBuilder(mockParent, existing);

            expect(result).toBeInstanceOf(TweenChain);
            expect(result).toBe(existing);
        });
    });

    describe('default values', function ()
    {
        it('should return a TweenChain instance', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result).toBeInstanceOf(TweenChain);
        });

        it('should set startDelay to 0 by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.startDelay).toBe(0);
        });

        it('should set completeDelay to 0 by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.completeDelay).toBe(0);
        });

        it('should set loop to 0 by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.loop).toBe(0);
        });

        it('should set loopDelay to 0 by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.loopDelay).toBe(0);
        });

        it('should set paused to false by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.paused).toBe(false);
        });

        it('should set persist to false by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.persist).toBe(false);
        });

        it('should set callbackScope to the chain itself by default', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.callbackScope).toBe(result);
        });

        it('should pass parent to the new TweenChain', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.parent).toBe(mockParent);
        });
    });

    describe('custom config values', function ()
    {
        it('should set startDelay from config delay property', function ()
        {
            var result = TweenChainBuilder(mockParent, { delay: 500 });

            expect(result.startDelay).toBe(500);
        });

        it('should set completeDelay from config', function ()
        {
            var result = TweenChainBuilder(mockParent, { completeDelay: 200 });

            expect(result.completeDelay).toBe(200);
        });

        it('should set loop from config', function ()
        {
            var result = TweenChainBuilder(mockParent, { loop: 3 });

            expect(result.loop).toBe(3);
        });

        it('should set loop from repeat as fallback', function ()
        {
            var result = TweenChainBuilder(mockParent, { repeat: 2 });

            expect(result.loop).toBe(2);
        });

        it('should prefer loop over repeat when both are specified', function ()
        {
            var result = TweenChainBuilder(mockParent, { loop: 5, repeat: 2 });

            expect(result.loop).toBe(5);
        });

        it('should round loop values', function ()
        {
            var result = TweenChainBuilder(mockParent, { loop: 2.7 });

            expect(result.loop).toBe(3);
        });

        it('should set loopDelay from config', function ()
        {
            var result = TweenChainBuilder(mockParent, { loopDelay: 100 });

            expect(result.loopDelay).toBe(100);
        });

        it('should set loopDelay from repeatDelay as fallback', function ()
        {
            var result = TweenChainBuilder(mockParent, { repeatDelay: 150 });

            expect(result.loopDelay).toBe(150);
        });

        it('should prefer loopDelay over repeatDelay when both are specified', function ()
        {
            var result = TweenChainBuilder(mockParent, { loopDelay: 300, repeatDelay: 100 });

            expect(result.loopDelay).toBe(300);
        });

        it('should round loopDelay values', function ()
        {
            var result = TweenChainBuilder(mockParent, { loopDelay: 99.9 });

            expect(result.loopDelay).toBe(100);
        });

        it('should set paused to true from config', function ()
        {
            var result = TweenChainBuilder(mockParent, { paused: true });

            expect(result.paused).toBe(true);
        });

        it('should set persist to true from config', function ()
        {
            var result = TweenChainBuilder(mockParent, { persist: true });

            expect(result.persist).toBe(true);
        });

        it('should set callbackScope from config', function ()
        {
            var scope = { _isScope: true };
            var result = TweenChainBuilder(mockParent, { callbackScope: scope });

            expect(result.callbackScope).toBe(scope);
        });
    });

    describe('callbacks', function ()
    {
        it('should register onStart callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onStart: cb });

            expect(result.callbacks.onStart).not.toBeNull();
            expect(result.callbacks.onStart.func).toBe(cb);
        });

        it('should register onComplete callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onComplete: cb });

            expect(result.callbacks.onComplete).not.toBeNull();
            expect(result.callbacks.onComplete.func).toBe(cb);
        });

        it('should register onLoop callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onLoop: cb });

            expect(result.callbacks.onLoop).not.toBeNull();
            expect(result.callbacks.onLoop.func).toBe(cb);
        });

        it('should register onStop callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onStop: cb });

            expect(result.callbacks.onStop).not.toBeNull();
            expect(result.callbacks.onStop.func).toBe(cb);
        });

        it('should register onPause callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onPause: cb });

            expect(result.callbacks.onPause).not.toBeNull();
            expect(result.callbacks.onPause.func).toBe(cb);
        });

        it('should register onResume callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onResume: cb });

            expect(result.callbacks.onResume).not.toBeNull();
            expect(result.callbacks.onResume.func).toBe(cb);
        });

        it('should register onActive callback when provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onActive: cb });

            expect(result.callbacks.onActive).not.toBeNull();
            expect(result.callbacks.onActive.func).toBe(cb);
        });

        it('should pass callback params to setCallback', function ()
        {
            var cb = function () {};
            var params = [ 1, 2, 3 ];
            var result = TweenChainBuilder(mockParent, { onStart: cb, onStartParams: params });

            expect(result.callbacks.onStart.params).toEqual([ 1, 2, 3 ]);
        });

        it('should use empty array as default params when none are provided', function ()
        {
            var cb = function () {};
            var result = TweenChainBuilder(mockParent, { onComplete: cb });

            expect(result.callbacks.onComplete.params).toEqual([]);
        });

        it('should leave unspecified callbacks as null', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.callbacks.onStart).toBeNull();
            expect(result.callbacks.onComplete).toBeNull();
        });

        it('should register multiple callbacks independently', function ()
        {
            var onStart = function () {};
            var onComplete = function () {};
            var result = TweenChainBuilder(mockParent, { onStart: onStart, onComplete: onComplete });

            expect(result.callbacks.onStart.func).toBe(onStart);
            expect(result.callbacks.onComplete.func).toBe(onComplete);
        });
    });

    describe('tweens array', function ()
    {
        it('should add tweens to the chain when a tweens array is provided', function ()
        {
            var tweenConfig = { targets: [ {} ] };
            var result = TweenChainBuilder(mockParent, { tweens: [ tweenConfig ] });

            expect(result.data.length).toBe(1);
            expect(result.totalData).toBe(1);
        });

        it('should add multiple tweens when multiple configs are provided', function ()
        {
            var config1 = { targets: [ {} ] };
            var config2 = { targets: [ {} ] };
            var result = TweenChainBuilder(mockParent, { tweens: [ config1, config2 ] });

            expect(result.data.length).toBe(2);
            expect(result.totalData).toBe(2);
        });

        it('should not add tweens when tweens is not in config', function ()
        {
            var result = TweenChainBuilder(mockParent, {});

            expect(result.data.length).toBe(0);
        });

        it('should not add tweens when tweens is not an array', function ()
        {
            var result = TweenChainBuilder(mockParent, { tweens: 'not-an-array' });

            expect(result.data.length).toBe(0);
        });

        it('should handle an empty tweens array without error', function ()
        {
            var result = TweenChainBuilder(mockParent, { tweens: [] });

            expect(result.data.length).toBe(0);
        });

        it('should set each added tween parent to the chain', function ()
        {
            var tweenConfig = { targets: [ {} ] };
            var result = TweenChainBuilder(mockParent, { tweens: [ tweenConfig ] });

            expect(result.data[0].parent).toBe(result);
        });
    });

    describe('top-level targets as defaults', function ()
    {
        it('should pass top-level targets to child tweens that have no targets of their own', function ()
        {
            var target = { x: 0, y: 0 };
            var tweenConfig = { alpha: { from: 1, to: 0 } };
            var result = TweenChainBuilder(mockParent, { targets: target, tweens: [ tweenConfig ] });

            expect(result.data.length).toBe(1);
        });

        it('should use tween-specific targets when both top-level and tween targets are defined', function ()
        {
            var topLevelTarget = { x: 0 };
            var tweenTarget = { y: 0 };
            var tweenConfig = { targets: tweenTarget, alpha: { from: 1, to: 0 } };
            var result = TweenChainBuilder(mockParent, { targets: topLevelTarget, tweens: [ tweenConfig ] });

            expect(result.data.length).toBe(1);
        });
    });

    describe('loop boundary values', function ()
    {
        it('should handle loop of -1 for infinite looping', function ()
        {
            var result = TweenChainBuilder(mockParent, { loop: -1 });

            expect(result.loop).toBe(-1);
        });

        it('should handle loop of 0 (no loop)', function ()
        {
            var result = TweenChainBuilder(mockParent, { loop: 0 });

            expect(result.loop).toBe(0);
        });

        it('should handle large loop values', function ()
        {
            var result = TweenChainBuilder(mockParent, { loop: 1000 });

            expect(result.loop).toBe(1000);
        });

        it('should handle zero delay', function ()
        {
            var result = TweenChainBuilder(mockParent, { delay: 0 });

            expect(result.startDelay).toBe(0);
        });

        it('should handle large delay values', function ()
        {
            var result = TweenChainBuilder(mockParent, { delay: 999999 });

            expect(result.startDelay).toBe(999999);
        });
    });
});
