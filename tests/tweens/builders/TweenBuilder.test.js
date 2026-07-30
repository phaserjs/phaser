var TweenBuilder = require('../../../src/tweens/builders/TweenBuilder');
var Tween = require('../../../src/tweens/tween/Tween');

describe('Phaser.Tweens.Builders.TweenBuilder', function ()
{
    var mockParent;

    beforeEach(function ()
    {
        mockParent = {};
    });

    // -------------------------------------------------------------------------
    // Tween passthrough
    // -------------------------------------------------------------------------

    it('should return the same Tween instance when config is already a Tween', function ()
    {
        var target = { x: 0 };
        var existing = new Tween(mockParent, [ target ]);
        var result = TweenBuilder(mockParent, existing, undefined);

        expect(result).toBe(existing);
    });

    it('should update the parent when config is an existing Tween instance', function ()
    {
        var target = { x: 0 };
        var newParent = { id: 'newParent' };
        var existing = new Tween(mockParent, [ target ]);

        TweenBuilder(newParent, existing, undefined);

        expect(existing.parent).toBe(newParent);
    });

    // -------------------------------------------------------------------------
    // Return type
    // -------------------------------------------------------------------------

    it('should return a Tween instance', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result).toBeInstanceOf(Tween);
    });

    it('should store the correct parent reference on the returned Tween', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.parent).toBe(mockParent);
    });

    // -------------------------------------------------------------------------
    // Target handling
    // -------------------------------------------------------------------------

    it('should wrap a single target object in an array', function ()
    {
        var target = { x: 0 };
        var config = { targets: target, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.targets.length).toBe(1);
        expect(result.targets[0]).toBe(target);
    });

    it('should accept an array of targets', function ()
    {
        var t1 = { x: 0 };
        var t2 = { x: 0 };
        var config = { targets: [ t1, t2 ], x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.targets.length).toBe(2);
    });

    it('should fall back to defaults.targets when config has no targets', function ()
    {
        var target = { x: 0 };
        var config = { x: 100 };
        var defaults = { targets: [ target ] };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.targets.length).toBe(1);
        expect(result.targets[0]).toBe(target);
    });

    it('should skip null entries in the targets array', function ()
    {
        var target = { x: 0 };
        var config = { targets: [ null, target ], x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        // Both entries stay in targets array, but only the non-null one produces TweenData
        expect(result.targets.length).toBe(2);
        // One TweenData for the valid target
        expect(result.totalData).toBe(1);
    });

    it('should skip undefined entries in the targets array', function ()
    {
        var target = { x: 0 };
        var config = { targets: [ undefined, target ], x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    // -------------------------------------------------------------------------
    // TweenData creation per target / property
    // -------------------------------------------------------------------------

    it('should create one TweenData per target per property', function ()
    {
        var t1 = { x: 0, y: 0 };
        var t2 = { x: 0, y: 0 };
        var config = { targets: [ t1, t2 ], x: 100, y: 200 };
        var result = TweenBuilder(mockParent, config, undefined);

        // 2 targets × 2 properties = 4 TweenData entries
        expect(result.totalData).toBe(4);
    });

    it('should create one TweenData when one target and one property', function ()
    {
        var config = { targets: { alpha: 1 }, alpha: 0 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    // -------------------------------------------------------------------------
    // props shorthand
    // -------------------------------------------------------------------------

    it('should read properties from a props sub-object', function ()
    {
        var config = {
            targets: { x: 0, y: 0 },
            props: {
                x: 100,
                y: 200
            }
        };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(2);
    });

    it('should ignore property keys starting with underscore in props', function ()
    {
        var config = {
            targets: { x: 0 },
            props: {
                x: 100,
                _hidden: 999
            }
        };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    // -------------------------------------------------------------------------
    // Scale shortcut
    // -------------------------------------------------------------------------

    it('should expand scale to scaleX and scaleY when target lacks a native scale property', function ()
    {
        var target = { scaleX: 1, scaleY: 1 };
        var config = { targets: target, scale: 2 };
        var result = TweenBuilder(mockParent, config, undefined);

        // scale expands to scaleX + scaleY = 2 TweenData entries
        expect(result.totalData).toBe(2);
        expect(result.data[0].key).toBe('scaleX');
        expect(result.data[1].key).toBe('scaleY');
    });

    it('should NOT expand scale when the target has its own scale property', function ()
    {
        var target = { scale: 1 };
        var config = { targets: target, scale: 2 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
        expect(result.data[0].key).toBe('scale');
    });

    it('should expand scale for each target that lacks a native scale property', function ()
    {
        var t1 = { scaleX: 1, scaleY: 1 };
        var t2 = { scaleX: 1, scaleY: 1 };
        var config = { targets: [ t1, t2 ], scale: 3 };
        var result = TweenBuilder(mockParent, config, undefined);

        // 2 targets × 2 (scaleX + scaleY) = 4
        expect(result.totalData).toBe(4);
    });

    // -------------------------------------------------------------------------
    // Texture (frame) tweening
    // -------------------------------------------------------------------------

    it('should create a TweenFrameData entry for the texture key', function ()
    {
        var target = { texture: null };
        var config = { targets: target, texture: 'player' };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    it('should handle texture value as an array [texture, frame]', function ()
    {
        var target = { texture: null };
        var config = { targets: target, texture: [ 'atlas', 'frame01' ] };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    it('should handle texture value as an object with value property', function ()
    {
        var target = { texture: null };
        var config = { targets: target, texture: { value: 'player' } };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    it('should handle texture value as an object with value as [texture, frame] array', function ()
    {
        var target = { texture: null };
        var config = { targets: target, texture: { value: [ 'atlas', 'run' ] } };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.totalData).toBe(1);
    });

    // -------------------------------------------------------------------------
    // Top-level tween properties
    // -------------------------------------------------------------------------

    it('should set completeDelay from config', function ()
    {
        var config = { targets: { x: 0 }, x: 100, completeDelay: 500 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.completeDelay).toBe(500);
    });

    it('should default completeDelay to 0', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.completeDelay).toBe(0);
    });

    it('should set loop from config', function ()
    {
        var config = { targets: { x: 0 }, x: 100, loop: 3 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loop).toBe(3);
    });

    it('should round the loop value', function ()
    {
        var config = { targets: { x: 0 }, x: 100, loop: 2.7 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loop).toBe(3);
    });

    it('should default loop to 0', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loop).toBe(0);
    });

    it('should support loop: -1 for infinite looping', function ()
    {
        var config = { targets: { x: 0 }, x: 100, loop: -1 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loop).toBe(-1);
    });

    it('should set loopDelay from config', function ()
    {
        var config = { targets: { x: 0 }, x: 100, loopDelay: 200 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loopDelay).toBe(200);
    });

    it('should round the loopDelay value', function ()
    {
        var config = { targets: { x: 0 }, x: 100, loopDelay: 150.9 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loopDelay).toBe(151);
    });

    it('should default loopDelay to 0', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.loopDelay).toBe(0);
    });

    it('should set paused to true from config', function ()
    {
        var config = { targets: { x: 0 }, x: 100, paused: true };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.paused).toBe(true);
    });

    it('should set paused to false by default', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.paused).toBe(false);
    });

    it('should set persist to true from config', function ()
    {
        var config = { targets: { x: 0 }, x: 100, persist: true };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.persist).toBe(true);
    });

    it('should set persist to false by default', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.persist).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Callbacks
    // -------------------------------------------------------------------------

    it('should register an onStart callback', function ()
    {
        var called = false;
        var cb = function () { called = true; };
        var config = { targets: { x: 0 }, x: 100, onStart: cb };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbacks.onStart).not.toBeNull();
        expect(result.callbacks.onStart.func).toBe(cb);
    });

    it('should register an onComplete callback', function ()
    {
        var cb = function () {};
        var config = { targets: { x: 0 }, x: 100, onComplete: cb };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbacks.onComplete).not.toBeNull();
        expect(result.callbacks.onComplete.func).toBe(cb);
    });

    it('should register an onUpdate callback', function ()
    {
        var cb = function () {};
        var config = { targets: { x: 0 }, x: 100, onUpdate: cb };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbacks.onUpdate).not.toBeNull();
        expect(result.callbacks.onUpdate.func).toBe(cb);
    });

    it('should register an onLoop callback', function ()
    {
        var cb = function () {};
        var config = { targets: { x: 0 }, x: 100, onLoop: cb };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbacks.onLoop).not.toBeNull();
        expect(result.callbacks.onLoop.func).toBe(cb);
    });

    it('should pass callback params when registering a callback', function ()
    {
        var cb = function () {};
        var params = [ 1, 2, 3 ];
        var config = { targets: { x: 0 }, x: 100, onStart: cb, onStartParams: params };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbacks.onStart.params).toEqual(params);
    });

    it('should set callbackScope from config', function ()
    {
        var scope = { id: 'myScope' };
        var config = { targets: { x: 0 }, x: 100, callbackScope: scope };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbackScope).toBe(scope);
    });

    it('should default callbackScope to the tween itself', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.callbackScope).toBe(result);
    });

    // -------------------------------------------------------------------------
    // Custom defaults
    // -------------------------------------------------------------------------

    it('should apply custom default duration when not overridden in config', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var defaults = { duration: 2000 };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.data[0].duration).toBe(2000);
    });

    it('should override default duration with config duration', function ()
    {
        var config = { targets: { x: 0 }, x: 100, duration: 500 };
        var defaults = { duration: 2000 };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.data[0].duration).toBe(500);
    });

    it('should apply custom default yoyo when not overridden in config', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var defaults = { yoyo: true };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.data[0].yoyo).toBe(true);
    });

    it('should apply custom default repeat when not overridden in config', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var defaults = { repeat: 5 };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.data[0].repeat).toBe(5);
    });

    it('should apply custom default flipX when not overridden in config', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var defaults = { flipX: true };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.data[0].flipX).toBe(true);
    });

    it('should apply custom default flipY when not overridden in config', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var defaults = { flipY: true };
        var result = TweenBuilder(mockParent, config, defaults);

        expect(result.data[0].flipY).toBe(true);
    });

    // -------------------------------------------------------------------------
    // TweenData key values
    // -------------------------------------------------------------------------

    it('should assign the correct key to each TweenData entry', function ()
    {
        var config = { targets: { x: 0 }, x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.data[0].key).toBe('x');
    });

    it('should assign the correct targetIndex to each TweenData entry', function ()
    {
        var t1 = { x: 0 };
        var t2 = { x: 0 };
        var config = { targets: [ t1, t2 ], x: 100 };
        var result = TweenBuilder(mockParent, config, undefined);

        expect(result.data[0].targetIndex).toBe(0);
        expect(result.data[1].targetIndex).toBe(1);
    });
});
