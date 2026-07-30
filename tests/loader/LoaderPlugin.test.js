vi.mock('../../src/loader/FileTypesManager', function ()
{
    return { install: vi.fn() };
});

var LoaderPlugin = require('../../src/loader/LoaderPlugin');
var CONST = require('../../src/loader/const');

function createMockEvents ()
{
    return {
        once: vi.fn(),
        on: vi.fn(),
        off: vi.fn()
    };
}

function createMockScene (overrides)
{
    var gameConfig = {
        loaderBaseURL: '',
        loaderPath: '',
        loaderPrefix: '',
        loaderMaxParallelDownloads: 32,
        loaderResponseType: '',
        loaderAsync: true,
        loaderUser: '',
        loaderPassword: '',
        loaderTimeout: 0,
        loaderWithCredentials: false,
        loaderCrossOrigin: undefined,
        loaderImageLoadType: 'XHR',
        loaderLocalScheme: [ 'file://', 'capacitor://' ],
        loaderMaxRetries: 2
    };

    var scene = {
        sys: {
            game: {
                config: gameConfig,
                scene: {}
            },
            settings: {
                loader: {}
            },
            cache: {},
            textures: {},
            events: createMockEvents()
        }
    };

    if (overrides && overrides.gameConfig)
    {
        Object.assign(scene.sys.game.config, overrides.gameConfig);
    }

    if (overrides && overrides.sceneConfig)
    {
        scene.sys.settings.loader = overrides.sceneConfig;
    }

    return scene;
}

function createMockFile (key, type)
{
    return {
        key: key || 'testKey',
        type: type || 'image',
        state: CONST.FILE_PENDING,
        crossOrigin: null,
        hasCacheConflict: function () { return false; },
        load: vi.fn(),
        onProcess: vi.fn(),
        addToCache: vi.fn(),
        pendingDestroy: vi.fn(),
        destroy: vi.fn()
    };
}

describe('Phaser.Loader.LoaderPlugin', function ()
{
    describe('constructor', function ()
    {
        it('should initialise with default state values', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.state).toBe(CONST.LOADER_IDLE);
            expect(loader.progress).toBe(0);
            expect(loader.totalToLoad).toBe(0);
            expect(loader.totalFailed).toBe(0);
            expect(loader.totalComplete).toBe(0);
        });

        it('should initialise with empty string prefix, path and baseURL', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.prefix).toBe('');
            expect(loader.path).toBe('');
            expect(loader.baseURL).toBe('');
        });

        it('should initialise list, inflight and queue as Sets', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.list).toBeInstanceOf(Set);
            expect(loader.inflight).toBeInstanceOf(Set);
            expect(loader.queue).toBeInstanceOf(Set);
            expect(loader.list.size).toBe(0);
            expect(loader.inflight.size).toBe(0);
            expect(loader.queue.size).toBe(0);
        });

        it('should read maxParallelDownloads from game config', function ()
        {
            var scene = createMockScene({ gameConfig: { loaderMaxParallelDownloads: 8 } });
            var loader = new LoaderPlugin(scene);

            expect(loader.maxParallelDownloads).toBe(8);
        });

        it('should read maxRetries from game config', function ()
        {
            var scene = createMockScene({ gameConfig: { loaderMaxRetries: 5 } });
            var loader = new LoaderPlugin(scene);

            expect(loader.maxRetries).toBe(5);
        });

        it('should read baseURL and path from scene config, overriding game config', function ()
        {
            var scene = createMockScene({
                gameConfig: { loaderBaseURL: 'http://game.com/', loaderPath: 'assets/' },
                sceneConfig: { baseURL: 'http://scene.com/', path: 'scene-assets/' }
            });
            var loader = new LoaderPlugin(scene);

            expect(loader.baseURL).toBe('http://scene.com/');
            expect(loader.path).toBe('scene-assets/');
        });

        it('should store scene and systems references', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.scene).toBe(scene);
            expect(loader.systems).toBe(scene.sys);
        });
    });

    describe('setBaseURL', function ()
    {
        it('should set the baseURL', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setBaseURL('http://example.com/');

            expect(loader.baseURL).toBe('http://example.com/');
        });

        it('should append a trailing slash if missing', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setBaseURL('http://example.com');

            expect(loader.baseURL).toBe('http://example.com/');
        });

        it('should reset to empty string when called with no argument', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setBaseURL('http://example.com/');
            loader.setBaseURL();

            expect(loader.baseURL).toBe('');
        });

        it('should return the loader instance for chaining', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.setBaseURL('http://example.com/')).toBe(loader);
        });
    });

    describe('setPath', function ()
    {
        it('should set the path', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setPath('assets/images/');

            expect(loader.path).toBe('assets/images/');
        });

        it('should append a trailing slash if missing', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setPath('assets/images');

            expect(loader.path).toBe('assets/images/');
        });

        it('should reset to empty string when called with no argument', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setPath('assets/images/');
            loader.setPath();

            expect(loader.path).toBe('');
        });

        it('should return the loader instance for chaining', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.setPath('assets/')).toBe(loader);
        });
    });

    describe('setPrefix', function ()
    {
        it('should set the prefix', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setPrefix('MENU.');

            expect(loader.prefix).toBe('MENU.');
        });

        it('should reset to empty string when called with no argument', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setPrefix('MENU.');
            loader.setPrefix();

            expect(loader.prefix).toBe('');
        });

        it('should return the loader instance for chaining', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.setPrefix('UI.')).toBe(loader);
        });
    });

    describe('setCORS', function ()
    {
        it('should set crossOrigin', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setCORS('anonymous');

            expect(loader.crossOrigin).toBe('anonymous');
        });

        it('should return the loader instance for chaining', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.setCORS('anonymous')).toBe(loader);
        });
    });

    describe('isLoading', function ()
    {
        it('should return false when state is LOADER_IDLE', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_IDLE;

            expect(loader.isLoading()).toBe(false);
        });

        it('should return true when state is LOADER_LOADING', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_LOADING;

            expect(loader.isLoading()).toBe(true);
        });

        it('should return true when state is LOADER_PROCESSING', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_PROCESSING;

            expect(loader.isLoading()).toBe(true);
        });

        it('should return false when state is LOADER_COMPLETE', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_COMPLETE;

            expect(loader.isLoading()).toBe(false);
        });
    });

    describe('isReady', function ()
    {
        it('should return true when state is LOADER_IDLE', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            expect(loader.isReady()).toBe(true);
        });

        it('should return true when state is LOADER_COMPLETE', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_COMPLETE;

            expect(loader.isReady()).toBe(true);
        });

        it('should return false when state is LOADER_LOADING', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_LOADING;

            expect(loader.isReady()).toBe(false);
        });
    });

    describe('addFile', function ()
    {
        it('should add a single file to the list', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('background', 'image');

            loader.addFile(file);

            expect(loader.list.size).toBe(1);
            expect(loader.list.has(file)).toBe(true);
        });

        it('should add an array of files to the list', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file1 = createMockFile('bg', 'image');
            var file2 = createMockFile('music', 'audio');

            loader.addFile([ file1, file2 ]);

            expect(loader.list.size).toBe(2);
        });

        it('should not add a file if keyExists returns a conflict', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('bg', 'image');
            file.hasCacheConflict = function () { return true; };

            loader.addFile(file);

            expect(loader.list.size).toBe(0);
        });

        it('should not add a duplicate file already in the list', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file1 = createMockFile('bg', 'image');
            var file2 = createMockFile('bg', 'image');

            loader.addFile(file1);
            loader.addFile(file2);

            expect(loader.list.size).toBe(1);
        });

        it('should emit the ADD event when a file is added', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('sprite', 'image');
            var emitted = false;

            loader.on('addfile', function ()
            {
                emitted = true;
            });

            loader.addFile(file);

            expect(emitted).toBe(true);
        });
    });

    describe('keyExists', function ()
    {
        it('should return true if hasCacheConflict returns true', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('bg', 'image');
            file.hasCacheConflict = function () { return true; };

            expect(loader.keyExists(file)).toBe(true);
        });

        it('should return false for a new file with no conflicts', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('unique', 'image');

            expect(loader.keyExists(file)).toBe(false);
        });

        it('should return true if the same key and type already exists in list', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file1 = createMockFile('bg', 'image');
            var file2 = createMockFile('bg', 'image');

            loader.list.add(file1);

            expect(loader.keyExists(file2)).toBe(true);
        });

        it('should return false if same key but different type is in list', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file1 = createMockFile('bg', 'image');
            var file2 = createMockFile('bg', 'audio');

            loader.list.add(file1);

            expect(loader.keyExists(file2)).toBe(false);
        });
    });

    describe('updateProgress', function ()
    {
        it('should set progress to 1 when all files are loaded', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.totalToLoad = 4;

            loader.updateProgress();

            expect(loader.progress).toBe(1);
        });

        it('should set progress to 0.5 when half the files remain', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.totalToLoad = 4;
            loader.list.add(createMockFile('a', 'image'));
            loader.list.add(createMockFile('b', 'image'));

            loader.updateProgress();

            expect(loader.progress).toBeCloseTo(0.5);
        });

        it('should emit the PROGRESS event', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var progressValue = -1;

            loader.totalToLoad = 2;
            loader.on('progress', function (value)
            {
                progressValue = value;
            });

            loader.updateProgress();

            expect(progressValue).toBe(1);
        });
    });

    describe('flagForRemoval', function ()
    {
        it('should add a file to the _deleteQueue', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('old', 'image');

            loader.flagForRemoval(file);

            expect(loader._deleteQueue.has(file)).toBe(true);
        });
    });

    describe('start', function ()
    {
        it('should not start if the loader is not ready', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_LOADING;
            loader.start();

            expect(loader.state).toBe(CONST.LOADER_LOADING);
        });

        it('should reset totals when starting', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.totalFailed = 5;
            loader.totalComplete = 10;

            loader.start();

            expect(loader.totalFailed).toBe(0);
            expect(loader.totalComplete).toBe(0);
        });

        it('should emit the START event', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var started = false;

            loader.on('start', function ()
            {
                started = true;
            });

            loader.start();

            expect(started).toBe(true);
        });

        it('should call loadComplete immediately if the list is empty', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var completed = false;

            loader.on('complete', function ()
            {
                completed = true;
            });

            loader.start();

            expect(completed).toBe(true);
            expect(loader.state).toBe(CONST.LOADER_COMPLETE);
            expect(loader.progress).toBe(1);
        });
    });

    describe('loadComplete', function ()
    {
        it('should set progress to 1 and state to LOADER_COMPLETE', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.loadComplete();

            expect(loader.progress).toBe(1);
            expect(loader.state).toBe(CONST.LOADER_COMPLETE);
        });

        it('should clear list, inflight and queue Sets', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.list.add(createMockFile('a', 'image'));
            loader.inflight.add(createMockFile('b', 'image'));
            loader.queue.add(createMockFile('c', 'image'));

            loader.loadComplete();

            expect(loader.list.size).toBe(0);
            expect(loader.inflight.size).toBe(0);
            expect(loader.queue.size).toBe(0);
        });

        it('should call destroy on files in the _deleteQueue', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);
            var file = createMockFile('old', 'image');

            loader._deleteQueue.add(file);
            loader.loadComplete();

            expect(file.destroy).toHaveBeenCalled();
            expect(loader._deleteQueue.size).toBe(0);
        });

        it('should emit the COMPLETE event with totals', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.totalComplete = 3;
            loader.totalFailed = 1;

            var emittedComplete = 0;
            var emittedFailed = 0;

            loader.on('complete', function (l, complete, failed)
            {
                emittedComplete = complete;
                emittedFailed = failed;
            });

            loader.loadComplete();

            expect(emittedComplete).toBe(3);
            expect(emittedFailed).toBe(1);
        });
    });

    describe('reset', function ()
    {
        it('should clear list, inflight and queue', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.list.add(createMockFile('a', 'image'));
            loader.inflight.add(createMockFile('b', 'image'));
            loader.queue.add(createMockFile('c', 'image'));

            loader.reset();

            expect(loader.list.size).toBe(0);
            expect(loader.inflight.size).toBe(0);
            expect(loader.queue.size).toBe(0);
        });

        it('should set state back to LOADER_IDLE', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.state = CONST.LOADER_COMPLETE;
            loader.reset();

            expect(loader.state).toBe(CONST.LOADER_IDLE);
        });

        it('should reset baseURL, path and prefix from config', function ()
        {
            var scene = createMockScene({ gameConfig: { loaderBaseURL: 'http://cdn.com/', loaderPath: 'assets/', loaderPrefix: 'UI.' } });
            var loader = new LoaderPlugin(scene);

            loader.setBaseURL('http://other.com/');
            loader.setPath('other/');
            loader.setPrefix('OTHER.');

            loader.reset();

            expect(loader.baseURL).toBe('http://cdn.com/');
            expect(loader.path).toBe('assets/');
            expect(loader.prefix).toBe('UI.');
        });
    });

    describe('addPack', function ()
    {
        it('should return false if pack has no files array', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            var result = loader.addPack({ section: {} });

            expect(result).toBe(false);
        });

        it('should restore baseURL, path and prefix after processing', function ()
        {
            var scene = createMockScene();
            var loader = new LoaderPlugin(scene);

            loader.setBaseURL('http://original.com/');
            loader.setPath('original/');
            loader.setPrefix('ORIG.');

            var pack = {
                section: {
                    baseURL: 'http://pack.com/',
                    path: 'pack/',
                    prefix: 'PACK.',
                    files: []
                }
            };

            loader.addPack(pack);

            expect(loader.baseURL).toBe('http://original.com/');
            expect(loader.path).toBe('original/');
            expect(loader.prefix).toBe('ORIG.');
        });
    });
});
