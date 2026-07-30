var TilemapJSONFile = require('../../../src/loader/filetypes/TilemapJSONFile');
var TILEMAP_FORMATS = require('../../../src/tilemaps/Formats');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        baseURL: '',
        cacheManager: {
            json: { add: vi.fn(), get: vi.fn() },
            tilemap: { add: vi.fn(), get: vi.fn() }
        }
    };
}

describe('TilemapJSONFile', function ()
{
    describe('constructor', function ()
    {
        it('should set type to tilemapJSON', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1', 'maps/level1.json');

            expect(file.type).toBe('tilemapJSON');
        });

        it('should set cache to loader.cacheManager.tilemap', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1', 'maps/level1.json');

            expect(file.cache).toBe(loader.cacheManager.tilemap);
        });

        it('should set the key from the string argument', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1', 'maps/level1.json');

            expect(file.key).toBe('level1');
        });

        it('should set the key from a config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, { key: 'mapData', url: 'maps/map.json' });

            expect(file.key).toBe('mapData');
        });

        it('should prepend loader prefix to the key when prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new TilemapJSONFile(loader, 'story', 'maps/story.json');

            expect(file.key).toBe('LEVEL1.story');
        });

        it('should construct url from key and path when no url provided', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1');

            expect(file.url).toBe('level1.json');
        });

        it('should prepend loader path to relative url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/maps/';
            var file = new TilemapJSONFile(loader, 'level1', 'level1.json');

            expect(file.url).toBe('assets/maps/level1.json');
        });

        it('should use inline JSON object as data directly', function ()
        {
            var loader = createMockLoader();
            var jsonData = { width: 20, height: 15, tilesets: [] };
            var file = new TilemapJSONFile(loader, 'level1', jsonData);

            expect(file.data).toBe(jsonData);
        });
    });

    describe('addToCache', function ()
    {
        it('should call cache.add with the file key', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1', 'maps/level1.json');
            file.data = { width: 20, height: 15 };

            file.addToCache();

            expect(loader.cacheManager.tilemap.add).toHaveBeenCalledOnce();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[0]).toBe('level1');
        });

        it('should cache the data with TILED_JSON format', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1', 'maps/level1.json');
            var mapData = { width: 20, height: 15, tilesets: [] };
            file.data = mapData;

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            var tiledata = callArgs[1];

            expect(tiledata.format).toBe(TILEMAP_FORMATS.TILED_JSON);
            expect(tiledata.format).toBe(1);
        });

        it('should cache the file data object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'level1', 'maps/level1.json');
            var mapData = { width: 20, height: 15, layers: [] };
            file.data = mapData;

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            var tiledata = callArgs[1];

            expect(tiledata.data).toBe(mapData);
        });

        it('should use the prefixed key when caching', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new TilemapJSONFile(loader, 'story', 'maps/story.json');
            file.data = { width: 10, height: 10 };

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[0]).toBe('LEVEL1.story');
        });

        it('should store tiledata object with format and data properties', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'mymap', 'maps/mymap.json');
            var mapData = { version: '1.6', tilewidth: 32 };
            file.data = mapData;

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            var tiledata = callArgs[1];

            expect(Object.keys(tiledata)).toContain('format');
            expect(Object.keys(tiledata)).toContain('data');
        });

        it('should handle null data gracefully', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapJSONFile(loader, 'emptymap', 'maps/empty.json');
            file.data = null;

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            var tiledata = callArgs[1];

            expect(tiledata.data).toBeNull();
            expect(tiledata.format).toBe(TILEMAP_FORMATS.TILED_JSON);
        });
    });

    describe('tilemapTiledJSON loader registration', function ()
    {
        it('should register tilemapTiledJSON with the FileTypesManager', function ()
        {
            var FileTypesManager = require('../../../src/loader/FileTypesManager');

            expect(typeof FileTypesManager.install).toBe('function');
        });

        it('should add a single file when given a string key', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];

            loader.addFile = function (file)
            {
                addedFiles.push(file);
            };

            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            FileTypesManager.install(loader);

            loader.tilemapTiledJSON('level1', 'maps/level1.json');

            expect(addedFiles.length).toBe(1);
            expect(addedFiles[0].type).toBe('tilemapJSON');
        });

        it('should add multiple files when given an array of config objects', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];

            loader.addFile = function (file)
            {
                addedFiles.push(file);
            };

            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            FileTypesManager.install(loader);

            loader.tilemapTiledJSON([
                { key: 'level1', url: 'maps/level1.json' },
                { key: 'level2', url: 'maps/level2.json' }
            ]);

            expect(addedFiles.length).toBe(2);
            expect(addedFiles[0].type).toBe('tilemapJSON');
            expect(addedFiles[1].type).toBe('tilemapJSON');
        });

        it('should return the loader instance for chaining', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            FileTypesManager.install(loader);

            var result = loader.tilemapTiledJSON('level1', 'maps/level1.json');

            expect(result).toBe(loader);
        });
    });
});
