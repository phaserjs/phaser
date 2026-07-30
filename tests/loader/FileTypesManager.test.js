var FileTypesManager = require('../../src/loader/FileTypesManager');

describe('FileTypesManager', function ()
{
    beforeEach(function ()
    {
        FileTypesManager.destroy();
    });

    afterEach(function ()
    {
        FileTypesManager.destroy();
    });

    describe('register', function ()
    {
        it('should register a file type function', function ()
        {
            var fn = function () {};
            FileTypesManager.register('image', fn);

            var loader = {};
            FileTypesManager.install(loader);

            expect(loader.image).toBe(fn);
        });

        it('should register multiple file types', function ()
        {
            var imageFn = function () {};
            var audioFn = function () {};
            var jsonFn = function () {};

            FileTypesManager.register('image', imageFn);
            FileTypesManager.register('audio', audioFn);
            FileTypesManager.register('json', jsonFn);

            var loader = {};
            FileTypesManager.install(loader);

            expect(loader.image).toBe(imageFn);
            expect(loader.audio).toBe(audioFn);
            expect(loader.json).toBe(jsonFn);
        });

        it('should overwrite an existing type with the same key', function ()
        {
            var fn1 = function () { return 1; };
            var fn2 = function () { return 2; };

            FileTypesManager.register('image', fn1);
            FileTypesManager.register('image', fn2);

            var loader = {};
            FileTypesManager.install(loader);

            expect(loader.image).toBe(fn2);
        });

        it('should store any function type including named functions', function ()
        {
            function myLoader() {}
            FileTypesManager.register('custom', myLoader);

            var loader = {};
            FileTypesManager.install(loader);

            expect(loader.custom).toBe(myLoader);
        });
    });

    describe('install', function ()
    {
        it('should inject registered types onto the loader object', function ()
        {
            var fn = function () {};
            FileTypesManager.register('tilemapTiledJSON', fn);

            var loader = {};
            FileTypesManager.install(loader);

            expect(loader.tilemapTiledJSON).toBe(fn);
        });

        it('should not overwrite existing loader properties that are not in types', function ()
        {
            var existingFn = function () {};
            var loader = { existingMethod: existingFn };

            FileTypesManager.install(loader);

            expect(loader.existingMethod).toBe(existingFn);
        });

        it('should install nothing when no types are registered', function ()
        {
            var loader = {};
            FileTypesManager.install(loader);

            expect(Object.keys(loader).length).toBe(0);
        });

        it('should install all types onto multiple loaders independently', function ()
        {
            var fn = function () {};
            FileTypesManager.register('image', fn);

            var loader1 = {};
            var loader2 = {};

            FileTypesManager.install(loader1);
            FileTypesManager.install(loader2);

            expect(loader1.image).toBe(fn);
            expect(loader2.image).toBe(fn);
        });

        it('should not affect previously installed loaders when new types are registered', function ()
        {
            var fn1 = function () {};
            FileTypesManager.register('image', fn1);

            var loader1 = {};
            FileTypesManager.install(loader1);

            var fn2 = function () {};
            FileTypesManager.register('audio', fn2);

            var loader2 = {};
            FileTypesManager.install(loader2);

            expect(loader1.audio).toBeUndefined();
            expect(loader2.audio).toBe(fn2);
        });
    });

    describe('destroy', function ()
    {
        it('should remove all registered types', function ()
        {
            FileTypesManager.register('image', function () {});
            FileTypesManager.register('audio', function () {});

            FileTypesManager.destroy();

            var loader = {};
            FileTypesManager.install(loader);

            expect(Object.keys(loader).length).toBe(0);
        });

        it('should allow re-registration after destroy', function ()
        {
            var fn1 = function () {};
            FileTypesManager.register('image', fn1);
            FileTypesManager.destroy();

            var fn2 = function () {};
            FileTypesManager.register('image', fn2);

            var loader = {};
            FileTypesManager.install(loader);

            expect(loader.image).toBe(fn2);
        });

        it('should be callable multiple times without error', function ()
        {
            FileTypesManager.destroy();
            FileTypesManager.destroy();

            var loader = {};
            FileTypesManager.install(loader);

            expect(Object.keys(loader).length).toBe(0);
        });
    });
});
