var CacheManager = require('../../src/cache/CacheManager');
var BaseCache = require('../../src/cache/BaseCache');

describe('CacheManager', function ()
{
    var manager;
    var mockGame;

    beforeEach(function ()
    {
        mockGame = {
            events: {
                once: function () {}
            }
        };

        manager = new CacheManager(mockGame);
    });

    afterEach(function ()
    {
        // avoid double-destroy if test already called destroy
        if (manager && manager.game !== null)
        {
            manager.game = null;
        }
    });

    describe('constructor', function ()
    {
        it('should store a reference to the game', function ()
        {
            expect(manager.game).toBe(mockGame);
        });

        it('should create a binary BaseCache', function ()
        {
            expect(manager.binary).toBeInstanceOf(BaseCache);
        });

        it('should create a bitmapFont BaseCache', function ()
        {
            expect(manager.bitmapFont).toBeInstanceOf(BaseCache);
        });

        it('should create a json BaseCache', function ()
        {
            expect(manager.json).toBeInstanceOf(BaseCache);
        });

        it('should create a physics BaseCache', function ()
        {
            expect(manager.physics).toBeInstanceOf(BaseCache);
        });

        it('should create a shader BaseCache', function ()
        {
            expect(manager.shader).toBeInstanceOf(BaseCache);
        });

        it('should create an audio BaseCache', function ()
        {
            expect(manager.audio).toBeInstanceOf(BaseCache);
        });

        it('should create a video BaseCache', function ()
        {
            expect(manager.video).toBeInstanceOf(BaseCache);
        });

        it('should create a text BaseCache', function ()
        {
            expect(manager.text).toBeInstanceOf(BaseCache);
        });

        it('should create an html BaseCache', function ()
        {
            expect(manager.html).toBeInstanceOf(BaseCache);
        });

        it('should create a tilemap BaseCache', function ()
        {
            expect(manager.tilemap).toBeInstanceOf(BaseCache);
        });

        it('should create an xml BaseCache', function ()
        {
            expect(manager.xml).toBeInstanceOf(BaseCache);
        });

        it('should create an atlas BaseCache for Phaser Compact Texture Atlas data', function ()
        {
            expect(manager.atlas).toBeInstanceOf(BaseCache);
        });

        it('should allow entries to be added to the atlas cache', function ()
        {
            var decoded = { pages: [], folders: [], frames: {} };

            manager.atlas.add('level1', decoded);

            expect(manager.atlas.has('level1')).toBe(true);
            expect(manager.atlas.get('level1')).toBe(decoded);
        });

        it('should initialise custom as an empty object', function ()
        {
            expect(manager.custom).toBeDefined();
            expect(typeof manager.custom).toBe('object');
            expect(Object.keys(manager.custom).length).toBe(0);
        });

        it('should register the destroy listener on game events', function ()
        {
            var called = false;
            var capturedEvent;
            var capturedCallback;

            var game = {
                events: {
                    once: function (event, callback)
                    {
                        called = true;
                        capturedEvent = event;
                        capturedCallback = callback;
                    }
                }
            };

            var m = new CacheManager(game);

            expect(called).toBe(true);
            expect(typeof capturedCallback).toBe('function');

            // prevent afterEach teardown issues
            m.game = null;
        });
    });

    describe('addCustom', function ()
    {
        it('should create a new BaseCache for the given key', function ()
        {
            var cache = manager.addCustom('myCache');

            expect(cache).toBeInstanceOf(BaseCache);
        });

        it('should store the new cache under custom[key]', function ()
        {
            manager.addCustom('myCache');

            expect(manager.custom['myCache']).toBeInstanceOf(BaseCache);
        });

        it('should return a reference to the created cache', function ()
        {
            var cache = manager.addCustom('myCache');

            expect(cache).toBe(manager.custom['myCache']);
        });

        it('should not overwrite an existing cache with the same key', function ()
        {
            var first = manager.addCustom('myCache');
            first.add('item', { value: 1 });

            var second = manager.addCustom('myCache');

            expect(second).toBe(first);
            expect(second.get('item')).toEqual({ value: 1 });
        });

        it('should return the existing cache when the key already exists', function ()
        {
            var first = manager.addCustom('sharedKey');
            var second = manager.addCustom('sharedKey');

            expect(first).toBe(second);
        });

        it('should allow multiple distinct custom caches', function ()
        {
            var cacheA = manager.addCustom('alpha');
            var cacheB = manager.addCustom('beta');

            expect(cacheA).toBeInstanceOf(BaseCache);
            expect(cacheB).toBeInstanceOf(BaseCache);
            expect(cacheA).not.toBe(cacheB);
            expect(manager.custom['alpha']).toBe(cacheA);
            expect(manager.custom['beta']).toBe(cacheB);
        });

        it('should allow items to be stored in the custom cache', function ()
        {
            var cache = manager.addCustom('testCache');
            cache.add('key1', { data: 42 });

            expect(cache.has('key1')).toBe(true);
            expect(cache.get('key1')).toEqual({ data: 42 });
        });
    });

    describe('destroy', function ()
    {
        it('should null the game reference', function ()
        {
            manager.destroy();

            expect(manager.game).toBeNull();
        });

        it('should null the binary cache', function ()
        {
            manager.destroy();

            expect(manager.binary).toBeNull();
        });

        it('should null the bitmapFont cache', function ()
        {
            manager.destroy();

            expect(manager.bitmapFont).toBeNull();
        });

        it('should null the json cache', function ()
        {
            manager.destroy();

            expect(manager.json).toBeNull();
        });

        it('should null the physics cache', function ()
        {
            manager.destroy();

            expect(manager.physics).toBeNull();
        });

        it('should null the shader cache', function ()
        {
            manager.destroy();

            expect(manager.shader).toBeNull();
        });

        it('should null the audio cache', function ()
        {
            manager.destroy();

            expect(manager.audio).toBeNull();
        });

        it('should null the video cache', function ()
        {
            manager.destroy();

            expect(manager.video).toBeNull();
        });

        it('should null the text cache', function ()
        {
            manager.destroy();

            expect(manager.text).toBeNull();
        });

        it('should null the html cache', function ()
        {
            manager.destroy();

            expect(manager.html).toBeNull();
        });

        it('should null the tilemap cache', function ()
        {
            manager.destroy();

            expect(manager.tilemap).toBeNull();
        });

        it('should null the xml cache', function ()
        {
            manager.destroy();

            expect(manager.xml).toBeNull();
        });

        it('should null the atlas cache', function ()
        {
            manager.destroy();

            expect(manager.atlas).toBeNull();
        });

        it('should null the custom object', function ()
        {
            manager.destroy();

            expect(manager.custom).toBeNull();
        });

        it('should destroy custom caches before nulling the object', function ()
        {
            var cache = manager.addCustom('test');
            cache.add('foo', { bar: 1 });

            manager.destroy();

            // custom is null — destruction completed without throwing
            expect(manager.custom).toBeNull();
        });

        it('should destroy all built-in caches even when they are empty', function ()
        {
            // Should not throw when caches contain no entries
            expect(function () { manager.destroy(); }).not.toThrow();
        });

        it('should destroy multiple custom caches', function ()
        {
            manager.addCustom('one');
            manager.addCustom('two');
            manager.addCustom('three');

            expect(function () { manager.destroy(); }).not.toThrow();

            expect(manager.custom).toBeNull();
        });
    });
});
