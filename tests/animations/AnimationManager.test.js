var AnimationManager = require('../../src/animations/AnimationManager');

function createMockGame ()
{
    return {
        events: {
            once: function () {},
            on: function () {},
            off: function () {},
            emit: function () {}
        },
        textures: {
            exists: function () { return false; },
            get: function () { return null; }
        },
        cache: {
            json: { get: function () { return null; } }
        }
    };
}

function createMockAnim (key)
{
    return {
        key: key,
        frames: [],
        toJSON: function ()
        {
            return { key: key, type: 'frame', frames: [], frameRate: 24, duration: 0, repeat: 0 };
        }
    };
}

describe('AnimationManager', function ()
{
    var manager;

    beforeEach(function ()
    {
        manager = new AnimationManager(createMockGame());
    });

    afterEach(function ()
    {
        manager.anims.clear();
        manager.mixes.clear();
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should set globalTimeScale to 1 by default', function ()
        {
            expect(manager.globalTimeScale).toBe(1);
        });

        it('should set paused to false by default', function ()
        {
            expect(manager.paused).toBe(false);
        });

        it('should have the name AnimationManager', function ()
        {
            expect(manager.name).toBe('AnimationManager');
        });

        it('should initialise with an empty anims map', function ()
        {
            expect(manager.anims.size).toBe(0);
        });

        it('should initialise with an empty mixes map', function ()
        {
            expect(manager.mixes.size).toBe(0);
        });

        it('should store a reference to the game', function ()
        {
            var game = createMockGame();
            var mgr = new AnimationManager(game);
            expect(mgr.game).toBe(game);
        });
    });

    // -------------------------------------------------------------------------
    // boot
    // -------------------------------------------------------------------------

    describe('boot', function ()
    {
        it('should assign textureManager from game.textures', function ()
        {
            var game = createMockGame();
            var mgr = new AnimationManager(game);
            mgr.boot();
            expect(mgr.textureManager).toBe(game.textures);
        });
    });

    // -------------------------------------------------------------------------
    // exists
    // -------------------------------------------------------------------------

    describe('exists', function ()
    {
        it('should return false when key does not exist', function ()
        {
            expect(manager.exists('missing')).toBe(false);
        });

        it('should return true when key exists', function ()
        {
            manager.anims.set('walk', createMockAnim('walk'));
            expect(manager.exists('walk')).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // add
    // -------------------------------------------------------------------------

    describe('add', function ()
    {
        it('should add an animation under the given key', function ()
        {
            var anim = createMockAnim('run');
            manager.add('run', anim);
            expect(manager.anims.has('run')).toBe(true);
        });

        it('should set the key on the animation object', function ()
        {
            var anim = { key: '' };
            manager.add('jump', anim);
            expect(anim.key).toBe('jump');
        });

        it('should emit ADD_ANIMATION', function ()
        {
            var fired = false;
            manager.on('add', function () { fired = true; });
            manager.add('idle', createMockAnim('idle'));
            expect(fired).toBe(true);
        });

        it('should return this for chaining', function ()
        {
            var result = manager.add('walk', createMockAnim('walk'));
            expect(result).toBe(manager);
        });

        it('should not overwrite an existing key', function ()
        {
            var first = createMockAnim('run');
            var second = createMockAnim('run');
            manager.add('run', first);
            manager.add('run', second);
            expect(manager.anims.get('run')).toBe(first);
        });
    });

    // -------------------------------------------------------------------------
    // get
    // -------------------------------------------------------------------------

    describe('get', function ()
    {
        it('should return undefined for a key that does not exist', function ()
        {
            expect(manager.get('ghost')).toBeUndefined();
        });

        it('should return the animation for an existing key', function ()
        {
            var anim = createMockAnim('fly');
            manager.anims.set('fly', anim);
            expect(manager.get('fly')).toBe(anim);
        });
    });

    // -------------------------------------------------------------------------
    // addMix / getMix / removeMix
    // -------------------------------------------------------------------------

    describe('addMix', function ()
    {
        it('should return this for chaining', function ()
        {
            var result = manager.addMix('a', 'b', 500);
            expect(result).toBe(manager);
        });

        it('should not add a mix when animations do not exist in the manager', function ()
        {
            manager.addMix('a', 'b', 500);
            expect(manager.getMix('a', 'b')).toBe(0);
        });

        it('should add a mix when both animations exist', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            manager.addMix('idle', 'run', 200);
            expect(manager.getMix('idle', 'run')).toBe(200);
        });

        it('should accept Animation instances as well as string keys', function ()
        {
            var animA = createMockAnim('idle');
            var animB = createMockAnim('run');
            manager.anims.set('idle', animA);
            manager.anims.set('run', animB);
            manager.addMix(animA, animB, 300);
            expect(manager.getMix('idle', 'run')).toBe(300);
        });

        it('should update an existing mix when called again', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            manager.addMix('idle', 'run', 100);
            manager.addMix('idle', 'run', 999);
            expect(manager.getMix('idle', 'run')).toBe(999);
        });
    });

    describe('getMix', function ()
    {
        it('should return 0 when no mix exists', function ()
        {
            expect(manager.getMix('x', 'y')).toBe(0);
        });

        it('should return the correct delay for an existing mix', function ()
        {
            manager.anims.set('a', createMockAnim('a'));
            manager.anims.set('b', createMockAnim('b'));
            manager.addMix('a', 'b', 750);
            expect(manager.getMix('a', 'b')).toBe(750);
        });

        it('should return 0 for the reverse direction if only one way mix exists', function ()
        {
            manager.anims.set('a', createMockAnim('a'));
            manager.anims.set('b', createMockAnim('b'));
            manager.addMix('a', 'b', 750);
            expect(manager.getMix('b', 'a')).toBe(0);
        });
    });

    describe('removeMix', function ()
    {
        it('should return this for chaining', function ()
        {
            var result = manager.removeMix('a', 'b');
            expect(result).toBe(manager);
        });

        it('should remove a specific pairing when animB is provided', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            manager.addMix('idle', 'run', 200);
            manager.removeMix('idle', 'run');
            expect(manager.getMix('idle', 'run')).toBe(0);
        });

        it('should remove all mixes for animA when animB is not provided', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            manager.anims.set('walk', createMockAnim('walk'));
            manager.addMix('idle', 'run', 200);
            manager.addMix('idle', 'walk', 300);
            manager.removeMix('idle');
            expect(manager.getMix('idle', 'run')).toBe(0);
            expect(manager.getMix('idle', 'walk')).toBe(0);
        });

        it('should not throw when removing a mix that does not exist', function ()
        {
            expect(function () { manager.removeMix('nonexistent', 'also-nonexistent'); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // pauseAll / resumeAll
    // -------------------------------------------------------------------------

    describe('pauseAll', function ()
    {
        it('should set paused to true', function ()
        {
            manager.pauseAll();
            expect(manager.paused).toBe(true);
        });

        it('should emit PAUSE_ALL event', function ()
        {
            var fired = false;
            manager.on('pauseall', function () { fired = true; });
            manager.pauseAll();
            expect(fired).toBe(true);
        });

        it('should not emit a second time if already paused', function ()
        {
            var count = 0;
            manager.on('pauseall', function () { count++; });
            manager.pauseAll();
            manager.pauseAll();
            expect(count).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            expect(manager.pauseAll()).toBe(manager);
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

        it('should emit RESUME_ALL event', function ()
        {
            var fired = false;
            manager.paused = true;
            manager.on('resumeall', function () { fired = true; });
            manager.resumeAll();
            expect(fired).toBe(true);
        });

        it('should not emit if not currently paused', function ()
        {
            var count = 0;
            manager.on('resumeall', function () { count++; });
            manager.resumeAll();
            expect(count).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            expect(manager.resumeAll()).toBe(manager);
        });
    });

    // -------------------------------------------------------------------------
    // remove
    // -------------------------------------------------------------------------

    describe('remove', function ()
    {
        it('should return the animation that was removed', function ()
        {
            var anim = createMockAnim('run');
            manager.anims.set('run', anim);
            var result = manager.remove('run');
            expect(result).toBe(anim);
        });

        it('should delete the animation from the map', function ()
        {
            manager.anims.set('run', createMockAnim('run'));
            manager.remove('run');
            expect(manager.anims.has('run')).toBe(false);
        });

        it('should emit REMOVE_ANIMATION', function ()
        {
            var fired = false;
            manager.anims.set('run', createMockAnim('run'));
            manager.on('remove', function () { fired = true; });
            manager.remove('run');
            expect(fired).toBe(true);
        });

        it('should return undefined when key does not exist', function ()
        {
            expect(manager.remove('ghost')).toBeUndefined();
        });

        it('should also remove any mixes for the animation', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            manager.addMix('idle', 'run', 200);
            manager.remove('idle');
            expect(manager.getMix('idle', 'run')).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // toJSON
    // -------------------------------------------------------------------------

    describe('toJSON', function ()
    {
        it('should return an object with anims array and globalTimeScale', function ()
        {
            var result = manager.toJSON();
            expect(Array.isArray(result.anims)).toBe(true);
            expect(typeof result.globalTimeScale).toBe('number');
        });

        it('should include globalTimeScale in output', function ()
        {
            manager.globalTimeScale = 2;
            var result = manager.toJSON();
            expect(result.globalTimeScale).toBe(2);
        });

        it('should return all animations when no key is provided', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            var result = manager.toJSON();
            expect(result.anims.length).toBe(2);
        });

        it('should return only the specified animation when a key is provided', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.anims.set('run', createMockAnim('run'));
            var result = manager.toJSON('idle');
            expect(result.anims.length).toBe(1);
            expect(result.anims[0].key).toBe('idle');
        });
    });

    // -------------------------------------------------------------------------
    // fromJSON
    // -------------------------------------------------------------------------

    describe('fromJSON', function ()
    {
        it('should accept a JSON string', function ()
        {
            var json = JSON.stringify({ anims: [], globalTimeScale: 1 });
            expect(function () { manager.fromJSON(json); }).not.toThrow();
        });

        it('should return an empty array when given an empty anims array', function ()
        {
            var result = manager.fromJSON({ anims: [] });
            expect(result).toEqual([]);
        });

        it('should set globalTimeScale from JSON object', function ()
        {
            manager.fromJSON({ anims: [], globalTimeScale: 3 });
            expect(manager.globalTimeScale).toBe(3);
        });

        it('should clear existing animations when clearCurrentAnimations is true', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.fromJSON({ anims: [] }, true);
            expect(manager.anims.size).toBe(0);
        });

        it('should not clear existing animations when clearCurrentAnimations is false', function ()
        {
            manager.anims.set('idle', createMockAnim('idle'));
            manager.fromJSON({ anims: [] }, false);
            expect(manager.anims.size).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // play
    // -------------------------------------------------------------------------

    describe('play', function ()
    {
        it('should call anims.play on each child', function ()
        {
            var called = [];
            var child = { anims: { play: function (k) { called.push(k); } } };
            manager.play('run', [child]);
            expect(called).toEqual(['run']);
        });

        it('should wrap a single child in an array', function ()
        {
            var called = 0;
            var child = { anims: { play: function () { called++; } } };
            manager.play('run', child);
            expect(called).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            expect(manager.play('x', [])).toBe(manager);
        });
    });

    // -------------------------------------------------------------------------
    // staggerPlay
    // -------------------------------------------------------------------------

    describe('staggerPlay', function ()
    {
        it('should call playAfterDelay with increasing offsets', function ()
        {
            var delays = [];
            function makeChild ()
            {
                return { anims: { playAfterDelay: function (k, d) { delays.push(d); } } };
            }
            var children = [ makeChild(), makeChild(), makeChild() ];
            manager.staggerPlay('run', children, 100);
            expect(delays[0]).toBe(0);
            expect(delays[1]).toBe(100);
            expect(delays[2]).toBe(200);
        });

        it('should offset first child when staggerFirst is true (default)', function ()
        {
            var delays = [];
            function makeChild ()
            {
                return { anims: { playAfterDelay: function (k, d) { delays.push(d); } } };
            }
            var children = [ makeChild(), makeChild() ];
            manager.staggerPlay('run', children, 500, true);
            expect(delays[0]).toBe(0);
            expect(delays[1]).toBe(500);
        });

        it('should handle negative stagger in reverse order', function ()
        {
            var delays = [];
            function makeChild ()
            {
                return { anims: { playAfterDelay: function (k, d) { delays.push(d); } } };
            }
            var children = [ makeChild(), makeChild(), makeChild() ];
            manager.staggerPlay('run', children, -1000);
            // len = 3, delays: abs(-1000) * (3-i) => 3000, 2000, 1000
            expect(delays[0]).toBe(3000);
            expect(delays[1]).toBe(2000);
            expect(delays[2]).toBe(1000);
        });

        it('should return this for chaining', function ()
        {
            expect(manager.staggerPlay('x', [], 0)).toBe(manager);
        });
    });

    // -------------------------------------------------------------------------
    // destroy
    // -------------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should clear the anims map', function ()
        {
            manager.anims.set('run', createMockAnim('run'));
            manager.destroy();
            expect(manager.anims.size).toBe(0);
        });

        it('should clear the mixes map', function ()
        {
            manager.mixes.set('run', {});
            manager.destroy();
            expect(manager.mixes.size).toBe(0);
        });

        it('should null out textureManager', function ()
        {
            manager.textureManager = {};
            manager.destroy();
            expect(manager.textureManager).toBeNull();
        });

        it('should null out game reference', function ()
        {
            manager.destroy();
            expect(manager.game).toBeNull();
        });
    });
});
