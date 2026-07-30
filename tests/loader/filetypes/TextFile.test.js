var CONST = require('../../../src/loader/const');
var FileTypesManager = require('../../../src/loader/FileTypesManager');
var TextFile = require('../../../src/loader/filetypes/TextFile');

// Retrieve the text loader plugin function registered by TextFile
var mockInstallTarget = {};
FileTypesManager.install(mockInstallTarget);
var textLoaderFn = mockInstallTarget.text;

function createMockLoader ()
{
    return {
        path: '',
        prefix: '',
        cacheManager: { text: {} },
        fileProcessComplete: vi.fn()
    };
}

describe('TextFile', function ()
{
    describe('constructor', function ()
    {
        it('should create an instance with string key and string url', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.key).toBe('story');
            expect(file.url).toBe('files/story.txt');
            expect(file.type).toBe('text');
        });

        it('should use the text cache from the loader cacheManager', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.cache).toBe(loader.cacheManager.text);
        });

        it('should build a default url from key and txt extension when url is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story');

            expect(file.url).toBe('story.txt');
        });

        it('should prepend loader path to a relative url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.url).toBe('assets/files/story.txt');
        });

        it('should prepend loader prefix to the key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.key).toBe('LEVEL1.story');
        });

        it('should accept a plain object config as the key argument', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, { key: 'story', url: 'files/story.txt' });

            expect(file.key).toBe('story');
            expect(file.url).toBe('files/story.txt');
            expect(file.type).toBe('text');
        });

        it('should use a custom extension from the plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, { key: 'shader', url: 'shaders/main.glsl', extension: 'glsl' });

            // extension is used when url is built from key; here url is explicit, so test via key-only
            var file2 = new TextFile(loader, { key: 'shader', extension: 'glsl' });

            expect(file2.url).toBe('shader.glsl');
        });

        it('should use a custom type from the plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, { key: 'shader', url: 'shaders/main.glsl', type: 'glsl' });

            expect(file.type).toBe('glsl');
        });

        it('should use a custom cache from the plain object config', function ()
        {
            var loader = createMockLoader();
            var customCache = { id: 'custom' };
            var file = new TextFile(loader, { key: 'story', url: 'files/story.txt', cache: customCache });

            expect(file.cache).toBe(customCache);
        });

        it('should default the cache to cacheManager.text when not specified in config', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, { key: 'story', url: 'files/story.txt' });

            expect(file.cache).toBe(loader.cacheManager.text);
        });

        it('should set state to FILE_PENDING for a string url', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });

        it('should have data as undefined before processing', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.data).toBeUndefined();
        });

        it('should store a reference to the loader', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            expect(file.loader).toBe(loader);
        });
    });

    describe('onProcess', function ()
    {
        it('should assign xhrLoader.responseText to this.data', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            file.xhrLoader = { responseText: 'Once upon a time...' };
            file.onProcess();

            expect(file.data).toBe('Once upon a time...');
        });

        it('should call loader.fileProcessComplete after processing', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            file.xhrLoader = { responseText: 'hello world' };
            file.onProcess();

            expect(loader.fileProcessComplete).toHaveBeenCalledOnce();
        });

        it('should set state to FILE_COMPLETE after processing', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            file.xhrLoader = { responseText: 'hello world' };
            file.onProcess();

            expect(file.state).toBe(CONST.FILE_COMPLETE);
        });

        it('should set state to FILE_PROCESSING when reading responseText', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');
            var stateWhenReading;

            file.xhrLoader = {
                get responseText ()
                {
                    stateWhenReading = file.state;

                    return 'hello world';
                }
            };
            file.onProcess();

            expect(stateWhenReading).toBe(CONST.FILE_PROCESSING);
        });

        it('should handle empty responseText', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            file.xhrLoader = { responseText: '' };
            file.onProcess();

            expect(file.data).toBe('');
        });

        it('should handle multi-line responseText', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');
            var multiline = 'line one\nline two\nline three';

            file.xhrLoader = { responseText: multiline };
            file.onProcess();

            expect(file.data).toBe(multiline);
        });

        it('should pass itself to fileProcessComplete', function ()
        {
            var loader = createMockLoader();
            var file = new TextFile(loader, 'story', 'files/story.txt');

            file.xhrLoader = { responseText: 'content' };
            file.onProcess();

            expect(loader.fileProcessComplete).toHaveBeenCalledWith(file);
        });
    });

    describe('text loader plugin', function ()
    {
        it('should have registered a text function with FileTypesManager', function ()
        {
            expect(typeof textLoaderFn).toBe('function');
        });

        it('should call addFile with a TextFile instance for a single key', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (file) { addedFiles.push(file); };

            textLoaderFn.call(loader, 'story', 'files/story.txt');

            expect(addedFiles.length).toBe(1);
            expect(addedFiles[0] instanceof TextFile).toBe(true);
            expect(addedFiles[0].key).toBe('story');
        });

        it('should call addFile for each item when key is an array', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (file) { addedFiles.push(file); };

            textLoaderFn.call(loader, [
                { key: 'intro', url: 'files/intro.txt' },
                { key: 'outro', url: 'files/outro.txt' }
            ]);

            expect(addedFiles.length).toBe(2);
            expect(addedFiles[0].key).toBe('intro');
            expect(addedFiles[1].key).toBe('outro');
        });

        it('should return the loader instance', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            var result = textLoaderFn.call(loader, 'story', 'files/story.txt');

            expect(result).toBe(loader);
        });
    });
});
