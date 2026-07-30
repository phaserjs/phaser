var CONST = require('../../../src/loader/const');
var FileTypesManager = require('../../../src/loader/FileTypesManager');
var JSONFile = require('../../../src/loader/filetypes/JSONFile');

// Retrieve the json loader plugin function registered by JSONFile
var mockInstallTarget = {};
FileTypesManager.install(mockInstallTarget);
var jsonLoaderFn = mockInstallTarget.json;

function createMockLoader ()
{
    return {
        path: '',
        prefix: '',
        cacheManager: { json: {} },
        fileProcessComplete: vi.fn()
    };
}

describe('JSONFile', function ()
{
    describe('constructor', function ()
    {
        it('should create an instance with string key and string url', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            expect(file.key).toBe('mydata');
            expect(file.url).toBe('data/mydata.json');
            expect(file.type).toBe('json');
        });

        it('should set config to dataKey when provided', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json', null, 'level1');

            expect(file.config).toBe('level1');
        });

        it('should set config to empty object when no dataKey provided', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            expect(file.config).toEqual({});
        });

        it('should accept a plain object config as the key argument', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, { key: 'mydata', url: 'data/mydata.json' });

            expect(file.key).toBe('mydata');
            expect(file.url).toBe('data/mydata.json');
            expect(file.type).toBe('json');
        });

        it('should read dataKey from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, { key: 'mydata', url: 'data/mydata.json', dataKey: 'level1' });

            expect(file.config).toBe('level1');
        });

        it('should use custom extension from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, { key: 'mydata', url: 'data/mydata.json5', extension: 'json5' });

            expect(file.type).toBe('json');
        });

        it('should set state to FILE_POPULATED when url is a plain object', function ()
        {
            var loader = createMockLoader();
            var urlObj = { score: 100, lives: 3 };
            var file = new JSONFile(loader, 'mydata', urlObj);

            expect(file.state).toBe(CONST.FILE_POPULATED);
        });

        it('should set data to the url object when url is plain object without dataKey', function ()
        {
            var loader = createMockLoader();
            var urlObj = { score: 100, lives: 3 };
            var file = new JSONFile(loader, 'mydata', urlObj);

            expect(file.data).toBe(urlObj);
        });

        it('should extract dataKey value when url is plain object with dataKey', function ()
        {
            var loader = createMockLoader();
            var urlObj = { level1: { score: 100 }, level2: { score: 200 } };
            var file = new JSONFile(loader, 'mydata', urlObj, null, 'level1');

            expect(file.data).toEqual({ score: 100 });
            expect(file.state).toBe(CONST.FILE_POPULATED);
        });

        it('should extract deeply nested dataKey from url object using dot notation', function ()
        {
            var loader = createMockLoader();
            var urlObj = { level1: { baddies: { boss: { hp: 500 } } } };
            var file = new JSONFile(loader, 'mydata', urlObj, null, 'level1.baddies.boss');

            expect(file.data).toEqual({ hp: 500 });
            expect(file.state).toBe(CONST.FILE_POPULATED);
        });

        it('should not set state to FILE_POPULATED when url is a string', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            expect(file.state).not.toBe(CONST.FILE_POPULATED);
        });

        it('should prepend loader path to string url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            expect(file.url).toBe('assets/data/mydata.json');
        });

        it('should prepend loader prefix to key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            expect(file.key).toBe('LEVEL1.mydata');
        });
    });

    describe('onProcess', function ()
    {
        it('should parse JSON from xhrLoader.responseText and store in data', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{"name":"phaser","version":4}' };

            file.onProcess();

            expect(file.data).toEqual({ name: 'phaser', version: 4 });
        });

        it('should call loader.fileProcessComplete after parsing', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{"a":1}' };

            file.onProcess();

            expect(loader.fileProcessComplete).toHaveBeenCalledOnce();
        });

        it('should set state to FILE_COMPLETE after processing', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{"a":1}' };

            file.onProcess();

            expect(file.state).toBe(CONST.FILE_COMPLETE);
        });

        it('should set state to FILE_PROCESSING before parsing', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');
            var stateWhenParsing;

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = {
                get responseText ()
                {
                    stateWhenParsing = file.state;
                    return '{"a":1}';
                }
            };

            file.onProcess();

            expect(stateWhenParsing).toBe(CONST.FILE_PROCESSING);
        });

        it('should extract nested value using dot-notation dataKey config', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json', null, 'level1.baddies');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{"level1":{"baddies":{"count":10}}}' };

            file.onProcess();

            expect(file.data).toEqual({ count: 10 });
        });

        it('should extract top-level value using string dataKey config', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json', null, 'settings');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{"settings":{"volume":0.8},"other":"stuff"}' };

            file.onProcess();

            expect(file.data).toEqual({ volume: 0.8 });
        });

        it('should fall back to full json when dataKey config does not match any property', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json', null, 'nonexistent');

            file.state = CONST.FILE_LOADED;
            var parsed = { a: 1, b: 2 };
            file.xhrLoader = { responseText: JSON.stringify(parsed) };

            file.onProcess();

            expect(file.data).toEqual(parsed);
        });

        it('should skip parsing and call onProcessComplete when state is FILE_POPULATED', function ()
        {
            var loader = createMockLoader();
            var urlObj = { preloaded: true };
            var file = new JSONFile(loader, 'mydata', urlObj);

            file.onProcess();

            expect(loader.fileProcessComplete).toHaveBeenCalledOnce();
            expect(file.data).toBe(urlObj);
        });

        it('should not overwrite existing data when state is FILE_POPULATED', function ()
        {
            var loader = createMockLoader();
            var urlObj = { preloaded: true };
            var file = new JSONFile(loader, 'mydata', urlObj);

            file.onProcess();

            expect(file.data).toBe(urlObj);
        });

        it('should set state to FILE_ERRORED and rethrow when JSON is invalid', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: 'not valid json {{{{' };

            expect(function ()
            {
                file.onProcess();
            }).toThrow();

            expect(file.state).toBe(CONST.FILE_ERRORED);
        });

        it('should call loader.fileProcessComplete even on error', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{invalid json}' };

            try
            {
                file.onProcess();
            }
            catch (e)
            {
                // expected
            }

            expect(loader.fileProcessComplete).toHaveBeenCalledOnce();
        });

        it('should parse JSON arrays correctly', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '[1,2,3]' };

            file.onProcess();

            expect(file.data).toEqual([ 1, 2, 3 ]);
        });

        it('should parse JSON with numeric and boolean values', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{"count":42,"active":true,"ratio":1.5}' };

            file.onProcess();

            expect(file.data.count).toBe(42);
            expect(file.data.active).toBe(true);
            expect(file.data.ratio).toBeCloseTo(1.5);
        });

        it('should parse an empty JSON object', function ()
        {
            var loader = createMockLoader();
            var file = new JSONFile(loader, 'mydata', 'data/mydata.json');

            file.state = CONST.FILE_LOADED;
            file.xhrLoader = { responseText: '{}' };

            file.onProcess();

            expect(file.data).toEqual({});
        });
    });

    describe('json loader plugin', function ()
    {
        it('should have registered a json function with FileTypesManager', function ()
        {
            expect(typeof jsonLoaderFn).toBe('function');
        });

        it('should call addFile with a JSONFile instance for a single key', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (file) { addedFiles.push(file); };

            jsonLoaderFn.call(loader, 'mydata', 'data/mydata.json', null, null);

            expect(addedFiles.length).toBe(1);
            expect(addedFiles[0] instanceof JSONFile).toBe(true);
            expect(addedFiles[0].key).toBe('mydata');
        });

        it('should call addFile for each item when key is an array', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (file) { addedFiles.push(file); };

            jsonLoaderFn.call(loader, [
                { key: 'data1', url: 'data/data1.json' },
                { key: 'data2', url: 'data/data2.json' }
            ]);

            expect(addedFiles.length).toBe(2);
            expect(addedFiles[0].key).toBe('data1');
            expect(addedFiles[1].key).toBe('data2');
        });

        it('should return the loader instance', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            var result = jsonLoaderFn.call(loader, 'mydata', 'data/mydata.json', null, null);

            expect(result).toBe(loader);
        });

        it('should pass dataKey as config when provided', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (file) { addedFiles.push(file); };

            jsonLoaderFn.call(loader, 'mydata', 'data/mydata.json', 'level1', null);

            expect(addedFiles[0].config).toBe('level1');
        });

        it('should use object url directly when passed as url argument', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (file) { addedFiles.push(file); };
            var urlObj = { wave: 1, enemies: 5 };

            jsonLoaderFn.call(loader, 'mydata', urlObj, null, null);

            expect(addedFiles[0].data).toBe(urlObj);
            expect(addedFiles[0].state).toBe(CONST.FILE_POPULATED);
        });
    });
});
