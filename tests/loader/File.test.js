var File = require('../../src/loader/File');
var CONST = require('../../src/loader/const');
var Events = require('../../src/loader/events');

describe('File', function ()
{
    var mockLoader;
    var baseConfig;

    beforeEach(function ()
    {
        mockLoader = {
            prefix: '',
            path: '',
            baseURL: '',
            maxRetries: 2,
            xhr: {},
            localSchemes: [ 'file://' ],
            nextFile: vi.fn(),
            emit: vi.fn(),
            fileProcessComplete: vi.fn(),
            flagForRemoval: vi.fn()
        };

        baseConfig = {
            type: 'image',
            key: 'testKey',
            url: 'test.png'
        };
    });

    function makeFile (configOverrides)
    {
        var config = Object.assign({}, baseConfig, configOverrides || {});
        return new File(mockLoader, config);
    }

    function makeLoader (overrides)
    {
        return Object.assign(
            {
                prefix: '',
                path: '',
                baseURL: '',
                maxRetries: 2,
                xhr: {},
                localSchemes: [ 'file://' ],
                nextFile: vi.fn(),
                emit: vi.fn(),
                fileProcessComplete: vi.fn(),
                flagForRemoval: vi.fn()
            },
            overrides || {}
        );
    }

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should store a reference to the loader', function ()
        {
            var file = makeFile();
            expect(file.loader).toBe(mockLoader);
        });

        it('should set type from fileConfig', function ()
        {
            var file = makeFile({ type: 'json' });
            expect(file.type).toBe('json');
        });

        it('should set key from fileConfig', function ()
        {
            var file = makeFile({ key: 'myAsset' });
            expect(file.key).toBe('myAsset');
        });

        it('should throw when type is missing', function ()
        {
            expect(function ()
            {
                makeFile({ type: false });
            }).toThrow('Invalid File type');
        });

        it('should throw when key is missing', function ()
        {
            expect(function ()
            {
                makeFile({ key: false });
            }).toThrow('Invalid File key');
        });

        it('should prepend loader prefix to key', function ()
        {
            mockLoader.prefix = 'level1.';
            var file = makeFile({ key: 'hero' });
            expect(file.key).toBe('level1.hero');
        });

        it('should not modify key when loader prefix is empty', function ()
        {
            mockLoader.prefix = '';
            var file = makeFile({ key: 'hero' });
            expect(file.key).toBe('hero');
        });

        it('should prepend loader path to a relative url', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: 'hero.png' });
            expect(file.url).toBe('assets/hero.png');
        });

        it('should not prepend path to an http url', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: 'http://example.com/hero.png' });
            expect(file.url).toBe('http://example.com/hero.png');
        });

        it('should not prepend path to an https url', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: 'https://cdn.example.com/hero.png' });
            expect(file.url).toBe('https://cdn.example.com/hero.png');
        });

        it('should not prepend path to a protocol-relative url', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: '//cdn.example.com/hero.png' });
            expect(file.url).toBe('//cdn.example.com/hero.png');
        });

        it('should not prepend path to a data uri', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: 'data:image/png;base64,abc123' });
            expect(file.url).toBe('data:image/png;base64,abc123');
        });

        it('should not prepend path to a blob url', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: 'blob:http://example.com/uuid' });
            expect(file.url).toBe('blob:http://example.com/uuid');
        });

        it('should build url from path + key + extension when url is undefined', function ()
        {
            mockLoader.path = 'assets/';
            var file = makeFile({ url: undefined, key: 'hero', extension: 'png' });
            expect(file.url).toBe('assets/hero.png');
        });

        it('should set state to FILE_PENDING for a string url', function ()
        {
            var file = makeFile({ url: 'test.png' });
            expect(file.state).toBe(CONST.FILE_PENDING);
        });

        it('should set state to FILE_POPULATED when url is a function', function ()
        {
            var file = makeFile({ url: function () {} });
            expect(file.state).toBe(CONST.FILE_POPULATED);
        });

        it('should set base64 to true for data uris', function ()
        {
            var file = makeFile({ url: 'data:image/png;base64,abc123' });
            expect(file.base64).toBe(true);
        });

        it('should set base64 to false for regular urls', function ()
        {
            var file = makeFile({ url: 'hero.png' });
            expect(file.base64).toBe(false);
        });

        it('should initialise src to an empty string', function ()
        {
            var file = makeFile();
            expect(file.src).toBe('');
        });

        it('should initialise xhrLoader to null', function ()
        {
            var file = makeFile();
            expect(file.xhrLoader).toBeNull();
        });

        it('should initialise bytesTotal to 0', function ()
        {
            var file = makeFile();
            expect(file.bytesTotal).toBe(0);
        });

        it('should initialise bytesLoaded to -1', function ()
        {
            var file = makeFile();
            expect(file.bytesLoaded).toBe(-1);
        });

        it('should initialise percentComplete to -1', function ()
        {
            var file = makeFile();
            expect(file.percentComplete).toBe(-1);
        });

        it('should initialise crossOrigin to undefined', function ()
        {
            var file = makeFile();
            expect(file.crossOrigin).toBeUndefined();
        });

        it('should initialise data to undefined', function ()
        {
            var file = makeFile();
            expect(file.data).toBeUndefined();
        });

        it('should use loader.maxRetries for retryAttempts when not in config', function ()
        {
            mockLoader.maxRetries = 5;
            var file = makeFile();
            expect(file.retryAttempts).toBe(5);
        });

        it('should use config maxRetries when provided', function ()
        {
            var file = makeFile({ maxRetries: 7 });
            expect(file.retryAttempts).toBe(7);
        });

        it('should store cache reference from fileConfig', function ()
        {
            var mockCache = { exists: vi.fn(), add: vi.fn() };
            var file = makeFile({ cache: mockCache });
            expect(file.cache).toBe(mockCache);
        });

        it('should store config object from fileConfig', function ()
        {
            var file = makeFile({ config: { frameWidth: 32 } });
            expect(file.config).toEqual({ frameWidth: 32 });
        });

        it('should default config to an empty object', function ()
        {
            var file = makeFile();
            expect(file.config).toEqual({});
        });
    });

    // -------------------------------------------------------------------------
    // setLink
    // -------------------------------------------------------------------------

    describe('setLink', function ()
    {
        it('should assign linkFile on both files', function ()
        {
            var fileA = makeFile({ key: 'fileA' });
            var fileB = makeFile({ key: 'fileB' });

            fileA.setLink(fileB);

            expect(fileA.linkFile).toBe(fileB);
            expect(fileB.linkFile).toBe(fileA);
        });

        it('should overwrite any previous link on fileB', function ()
        {
            var fileA = makeFile({ key: 'fileA' });
            var fileB = makeFile({ key: 'fileB' });
            var fileC = makeFile({ key: 'fileC' });

            fileA.setLink(fileB);
            fileC.setLink(fileB);

            expect(fileB.linkFile).toBe(fileC);
        });
    });

    // -------------------------------------------------------------------------
    // resetXHR
    // -------------------------------------------------------------------------

    describe('resetXHR', function ()
    {
        it('should set onload, onerror and onprogress to undefined when xhrLoader exists', function ()
        {
            var file = makeFile();
            file.xhrLoader = {
                onload: function () {},
                onerror: function () {},
                onprogress: function () {}
            };

            file.resetXHR();

            expect(file.xhrLoader.onload).toBeUndefined();
            expect(file.xhrLoader.onerror).toBeUndefined();
            expect(file.xhrLoader.onprogress).toBeUndefined();
        });

        it('should not throw when xhrLoader is null', function ()
        {
            var file = makeFile();
            file.xhrLoader = null;

            expect(function () { file.resetXHR(); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // load
    // -------------------------------------------------------------------------

    describe('load', function ()
    {
        it('should call loader.nextFile with true when state is FILE_POPULATED', function ()
        {
            var file = makeFile({ url: function () {} });
            expect(file.state).toBe(CONST.FILE_POPULATED);

            file.load();

            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, true);
        });

        it('should not call loader.nextFile more than once for a populated file', function ()
        {
            var file = makeFile({ url: function () {} });
            file.load();

            expect(mockLoader.nextFile).toHaveBeenCalledTimes(1);
        });
    });

    // -------------------------------------------------------------------------
    // onLoad
    // -------------------------------------------------------------------------

    describe('onLoad', function ()
    {
        it('should set state to FILE_LOADED', function ()
        {
            var file = makeFile();
            var xhr = { responseURL: '', readyState: 4, status: 200 };
            var event = { target: { status: 200 } };

            file.onLoad(xhr, event);

            expect(file.state).toBe(CONST.FILE_LOADED);
        });

        it('should call loader.nextFile with true on a 200 response', function ()
        {
            var file = makeFile();
            var xhr = { responseURL: '', readyState: 4, status: 200 };
            var event = { target: { status: 200 } };

            file.onLoad(xhr, event);

            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, true);
        });

        it('should call loader.nextFile with false on a 404 response', function ()
        {
            var file = makeFile();
            var xhr = { responseURL: '', readyState: 4, status: 404 };
            var event = { target: { status: 404 } };

            file.onLoad(xhr, event);

            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, false);
        });

        it('should call loader.nextFile with false on a 500 response', function ()
        {
            var file = makeFile();
            var xhr = { responseURL: '', readyState: 4, status: 500 };
            var event = { target: { status: 500 } };

            file.onLoad(xhr, event);

            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, false);
        });

        it('should call loader.nextFile with false on a 599 response', function ()
        {
            var file = makeFile();
            var xhr = { responseURL: '', readyState: 4, status: 599 };
            var event = { target: { status: 599 } };

            file.onLoad(xhr, event);

            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, false);
        });

        it('should treat a local file with status 0 as successful', function ()
        {
            var loader = makeLoader({ localSchemes: [ 'file://' ] });
            var file = new File(loader, baseConfig);
            var xhr = { responseURL: 'file:///local/test.png', readyState: 4, status: 0 };
            var event = { target: { status: 0 } };

            file.onLoad(xhr, event);

            expect(loader.nextFile).toHaveBeenCalledWith(file, true);
        });

        it('should reset xhrLoader event handlers', function ()
        {
            var file = makeFile();
            file.xhrLoader = {
                onload: function () {},
                onerror: function () {},
                onprogress: function () {}
            };

            var xhr = { responseURL: '', readyState: 4, status: 200 };
            var event = { target: { status: 200 } };

            file.onLoad(xhr, event);

            expect(file.xhrLoader.onload).toBeUndefined();
        });
    });

    // -------------------------------------------------------------------------
    // onBase64Load
    // -------------------------------------------------------------------------

    describe('onBase64Load', function ()
    {
        it('should assign the xhr object to xhrLoader', function ()
        {
            var file = makeFile();
            var fakeXhr = { result: 'data:image/png;base64,abc' };

            file.onBase64Load(fakeXhr);

            expect(file.xhrLoader).toBe(fakeXhr);
        });

        it('should set state to FILE_LOADED', function ()
        {
            var file = makeFile();
            file.onBase64Load({});
            expect(file.state).toBe(CONST.FILE_LOADED);
        });

        it('should set percentComplete to 1', function ()
        {
            var file = makeFile();
            file.onBase64Load({});
            expect(file.percentComplete).toBe(1);
        });

        it('should emit FILE_PROGRESS with percentComplete of 1', function ()
        {
            var file = makeFile();
            file.onBase64Load({});
            expect(mockLoader.emit).toHaveBeenCalledWith(Events.FILE_PROGRESS, file, 1);
        });

        it('should call loader.nextFile with true', function ()
        {
            var file = makeFile();
            file.onBase64Load({});
            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, true);
        });
    });

    // -------------------------------------------------------------------------
    // onError
    // -------------------------------------------------------------------------

    describe('onError', function ()
    {
        it('should decrement retryAttempts when attempts remain', function ()
        {
            var file = makeFile();
            file.retryAttempts = 3;
            file.load = vi.fn();

            file.onError();

            expect(file.retryAttempts).toBe(2);
        });

        it('should call load() when retry attempts remain', function ()
        {
            var file = makeFile();
            file.retryAttempts = 1;
            file.load = vi.fn();

            file.onError();

            expect(file.load).toHaveBeenCalled();
        });

        it('should not call loader.nextFile when retrying', function ()
        {
            var file = makeFile();
            file.retryAttempts = 1;
            file.load = vi.fn();

            file.onError();

            expect(mockLoader.nextFile).not.toHaveBeenCalled();
        });

        it('should call loader.nextFile with false when no retry attempts remain', function ()
        {
            var file = makeFile();
            file.retryAttempts = 0;

            file.onError();

            expect(mockLoader.nextFile).toHaveBeenCalledWith(file, false);
        });

        it('should not call load() when no retry attempts remain', function ()
        {
            var file = makeFile();
            file.retryAttempts = 0;
            file.load = vi.fn();

            file.onError();

            expect(file.load).not.toHaveBeenCalled();
        });

        it('should reset xhrLoader event handlers before retrying', function ()
        {
            var file = makeFile();
            file.retryAttempts = 1;
            file.load = vi.fn();
            file.xhrLoader = {
                onload: function () {},
                onerror: function () {},
                onprogress: function () {}
            };

            file.onError();

            expect(file.xhrLoader.onload).toBeUndefined();
        });
    });

    // -------------------------------------------------------------------------
    // onProgress
    // -------------------------------------------------------------------------

    describe('onProgress', function ()
    {
        it('should update bytesLoaded when lengthComputable is true', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: true, loaded: 40, total: 100 });
            expect(file.bytesLoaded).toBe(40);
        });

        it('should update bytesTotal when lengthComputable is true', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: true, loaded: 40, total: 100 });
            expect(file.bytesTotal).toBe(100);
        });

        it('should set percentComplete correctly', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: true, loaded: 50, total: 100 });
            expect(file.percentComplete).toBeCloseTo(0.5);
        });

        it('should cap percentComplete at 1', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: true, loaded: 150, total: 100 });
            expect(file.percentComplete).toBe(1);
        });

        it('should emit FILE_PROGRESS event', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: true, loaded: 25, total: 100 });
            expect(mockLoader.emit).toHaveBeenCalledWith(Events.FILE_PROGRESS, file, file.percentComplete);
        });

        it('should not update any values when lengthComputable is false', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: false, loaded: 50, total: 100 });
            expect(file.bytesLoaded).toBe(-1);
            expect(file.bytesTotal).toBe(0);
            expect(file.percentComplete).toBe(-1);
        });

        it('should not emit any event when lengthComputable is false', function ()
        {
            var file = makeFile();
            file.onProgress({ lengthComputable: false });
            expect(mockLoader.emit).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // onProcess
    // -------------------------------------------------------------------------

    describe('onProcess', function ()
    {
        it('should ultimately set state to FILE_COMPLETE', function ()
        {
            var file = makeFile();
            file.onProcess();
            expect(file.state).toBe(CONST.FILE_COMPLETE);
        });

        it('should call loader.fileProcessComplete', function ()
        {
            var file = makeFile();
            file.onProcess();
            expect(mockLoader.fileProcessComplete).toHaveBeenCalledWith(file);
        });
    });

    // -------------------------------------------------------------------------
    // onProcessComplete
    // -------------------------------------------------------------------------

    describe('onProcessComplete', function ()
    {
        it('should set state to FILE_COMPLETE', function ()
        {
            var file = makeFile();
            file.onProcessComplete();
            expect(file.state).toBe(CONST.FILE_COMPLETE);
        });

        it('should call loader.fileProcessComplete', function ()
        {
            var file = makeFile();
            file.onProcessComplete();
            expect(mockLoader.fileProcessComplete).toHaveBeenCalledWith(file);
        });

        it('should call multiFile.onFileComplete when multiFile is set', function ()
        {
            var file = makeFile();
            file.multiFile = { onFileComplete: vi.fn() };
            file.onProcessComplete();
            expect(file.multiFile.onFileComplete).toHaveBeenCalledWith(file);
        });

        it('should not throw when multiFile is not set', function ()
        {
            var file = makeFile();
            expect(function () { file.onProcessComplete(); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // onProcessError
    // -------------------------------------------------------------------------

    describe('onProcessError', function ()
    {
        it('should set state to FILE_ERRORED', function ()
        {
            var file = makeFile();
            file.onProcessError();
            expect(file.state).toBe(CONST.FILE_ERRORED);
        });

        it('should call loader.fileProcessComplete', function ()
        {
            var file = makeFile();
            file.onProcessError();
            expect(mockLoader.fileProcessComplete).toHaveBeenCalledWith(file);
        });

        it('should call multiFile.onFileFailed when multiFile is set', function ()
        {
            var file = makeFile();
            file.multiFile = { onFileFailed: vi.fn() };
            file.onProcessError();
            expect(file.multiFile.onFileFailed).toHaveBeenCalledWith(file);
        });

        it('should not throw when multiFile is not set', function ()
        {
            var file = makeFile();
            expect(function () { file.onProcessError(); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // hasCacheConflict
    // -------------------------------------------------------------------------

    describe('hasCacheConflict', function ()
    {
        it('should return false when cache is falsy', function ()
        {
            var file = makeFile({ cache: false });
            expect(file.hasCacheConflict()).toBe(false);
        });

        it('should return true when cache.exists returns true', function ()
        {
            var mockCache = { exists: vi.fn().mockReturnValue(true) };
            var file = makeFile({ cache: mockCache });
            expect(file.hasCacheConflict()).toBe(true);
        });

        it('should return false when cache.exists returns false', function ()
        {
            var mockCache = { exists: vi.fn().mockReturnValue(false) };
            var file = makeFile({ cache: mockCache });
            expect(file.hasCacheConflict()).toBe(false);
        });

        it('should pass the file key to cache.exists', function ()
        {
            var mockCache = { exists: vi.fn().mockReturnValue(false) };
            var file = makeFile({ cache: mockCache, key: 'myKey' });
            file.hasCacheConflict();
            expect(mockCache.exists).toHaveBeenCalledWith('myKey');
        });
    });

    // -------------------------------------------------------------------------
    // addToCache
    // -------------------------------------------------------------------------

    describe('addToCache', function ()
    {
        it('should call cache.add with key and data when both exist', function ()
        {
            var mockCache = { add: vi.fn() };
            var file = makeFile({ cache: mockCache });
            file.data = { pixels: true };
            file.addToCache();
            expect(mockCache.add).toHaveBeenCalledWith(file.key, file.data);
        });

        it('should not call cache.add when cache is falsy', function ()
        {
            var file = makeFile({ cache: false });
            file.data = { pixels: true };
            file.addToCache();
            // no error thrown and no side effect to verify beyond not throwing
            expect(true).toBe(true);
        });

        it('should not call cache.add when data is undefined', function ()
        {
            var mockCache = { add: vi.fn() };
            var file = makeFile({ cache: mockCache });
            file.data = undefined;
            file.addToCache();
            expect(mockCache.add).not.toHaveBeenCalled();
        });

        it('should not call cache.add when data is null', function ()
        {
            var mockCache = { add: vi.fn() };
            var file = makeFile({ cache: mockCache });
            file.data = null;
            file.addToCache();
            expect(mockCache.add).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // pendingDestroy
    // -------------------------------------------------------------------------

    describe('pendingDestroy', function ()
    {
        it('should emit FILE_COMPLETE with key, type, and data', function ()
        {
            var file = makeFile({ type: 'image', key: 'hero' });
            file.data = { pixels: true };
            file.pendingDestroy();
            expect(mockLoader.emit).toHaveBeenCalledWith(
                Events.FILE_COMPLETE, 'hero', 'image', file.data
            );
        });

        it('should emit FILE_KEY_COMPLETE with type-key suffix', function ()
        {
            var file = makeFile({ type: 'image', key: 'hero' });
            file.pendingDestroy();
            var expectedEvent = Events.FILE_KEY_COMPLETE + 'image-hero';
            expect(mockLoader.emit).toHaveBeenCalledWith(
                expectedEvent, 'hero', 'image', file.data
            );
        });

        it('should call loader.flagForRemoval', function ()
        {
            var file = makeFile();
            file.pendingDestroy();
            expect(mockLoader.flagForRemoval).toHaveBeenCalledWith(file);
        });

        it('should set state to FILE_PENDING_DESTROY', function ()
        {
            var file = makeFile();
            file.pendingDestroy();
            expect(file.state).toBe(CONST.FILE_PENDING_DESTROY);
        });

        it('should do nothing when already in FILE_PENDING_DESTROY state', function ()
        {
            var file = makeFile();
            file.state = CONST.FILE_PENDING_DESTROY;
            file.pendingDestroy();
            expect(mockLoader.emit).not.toHaveBeenCalled();
            expect(mockLoader.flagForRemoval).not.toHaveBeenCalled();
        });

        it('should use the data argument instead of this.data when provided', function ()
        {
            var file = makeFile({ type: 'image', key: 'hero' });
            file.data = { original: true };
            var override = { override: true };
            file.pendingDestroy(override);
            expect(mockLoader.emit).toHaveBeenCalledWith(
                Events.FILE_COMPLETE, 'hero', 'image', override
            );
        });

        it('should fall back to this.data when data argument is undefined', function ()
        {
            var file = makeFile({ type: 'image', key: 'hero' });
            file.data = { myData: 42 };
            file.pendingDestroy(undefined);
            expect(mockLoader.emit).toHaveBeenCalledWith(
                Events.FILE_COMPLETE, 'hero', 'image', file.data
            );
        });
    });

    // -------------------------------------------------------------------------
    // destroy
    // -------------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should set loader to null', function ()
        {
            var file = makeFile();
            file.destroy();
            expect(file.loader).toBeNull();
        });

        it('should set cache to null', function ()
        {
            var mockCache = { exists: vi.fn(), add: vi.fn() };
            var file = makeFile({ cache: mockCache });
            file.destroy();
            expect(file.cache).toBeNull();
        });

        it('should set xhrSettings to null', function ()
        {
            var file = makeFile();
            file.destroy();
            expect(file.xhrSettings).toBeNull();
        });

        it('should set multiFile to null', function ()
        {
            var file = makeFile();
            file.multiFile = { onFileComplete: vi.fn() };
            file.destroy();
            expect(file.multiFile).toBeNull();
        });

        it('should set linkFile to null', function ()
        {
            var fileA = makeFile({ key: 'fileA' });
            var fileB = makeFile({ key: 'fileB' });
            fileA.setLink(fileB);
            fileA.destroy();
            expect(fileA.linkFile).toBeNull();
        });

        it('should set data to null', function ()
        {
            var file = makeFile();
            file.data = { pixels: true };
            file.destroy();
            expect(file.data).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // Phaser.Loader.File.createObjectURL (static)
    // -------------------------------------------------------------------------

    describe('Phaser.Loader.File.createObjectURL', function ()
    {
        it('should set image.src via URL.createObjectURL when URL is a function', function ()
        {
            var originalURL = global.URL;
            var mockObjectURL = 'blob:http://localhost/fake-uuid';

            global.URL = function () {};
            global.URL.createObjectURL = vi.fn().mockReturnValue(mockObjectURL);
            global.URL.revokeObjectURL = vi.fn();

            var mockImage = {};
            var mockBlob = { type: 'image/png' };

            File.createObjectURL(mockImage, mockBlob, 'image/png');

            expect(mockImage.src).toBe(mockObjectURL);
            expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);

            global.URL = originalURL;
        });

        it('should pass the blob to URL.createObjectURL', function ()
        {
            var originalURL = global.URL;

            global.URL = function () {};
            global.URL.createObjectURL = vi.fn().mockReturnValue('blob:fake');
            global.URL.revokeObjectURL = vi.fn();

            var mockImage = {};
            var mockBlob = { type: 'image/jpeg' };

            File.createObjectURL(mockImage, mockBlob, 'image/png');

            expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);

            global.URL = originalURL;
        });
    });

    // -------------------------------------------------------------------------
    // Phaser.Loader.File.revokeObjectURL (static)
    // -------------------------------------------------------------------------

    describe('Phaser.Loader.File.revokeObjectURL', function ()
    {
        it('should call URL.revokeObjectURL with image.src when URL is a function', function ()
        {
            var originalURL = global.URL;

            global.URL = function () {};
            global.URL.revokeObjectURL = vi.fn();

            var mockImage = { src: 'blob:http://localhost/fake-uuid' };

            File.revokeObjectURL(mockImage);

            expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockImage.src);

            global.URL = originalURL;
        });

        it('should not throw when URL is undefined', function ()
        {
            var originalURL = global.URL;
            global.URL = undefined;

            var mockImage = { src: 'blob:http://localhost/fake-uuid' };

            expect(function () { File.revokeObjectURL(mockImage); }).not.toThrow();

            global.URL = originalURL;
        });

        it('should not throw when URL is not a function', function ()
        {
            var originalURL = global.URL;
            global.URL = {};

            var mockImage = { src: 'blob:http://localhost/fake-uuid' };

            expect(function () { File.revokeObjectURL(mockImage); }).not.toThrow();

            global.URL = originalURL;
        });
    });
});
