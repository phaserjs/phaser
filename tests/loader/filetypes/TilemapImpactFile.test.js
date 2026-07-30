var TilemapImpactFile = require('../../../src/loader/filetypes/TilemapImpactFile');
var FileTypesManager = require('../../../src/loader/FileTypesManager');
var TILEMAP_FORMATS = require('../../../src/tilemaps/Formats');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        addFile: vi.fn(),
        cacheManager: {
            json: {},
            tilemap: {
                add: vi.fn()
            }
        }
    };
}

describe('TilemapImpactFile', function ()
{
    describe('constructor', function ()
    {
        it('should set type to tilemapJSON', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'testKey', 'test.json');

            expect(file.type).toBe('tilemapJSON');
        });

        it('should set cache to loader.cacheManager.tilemap', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'testKey', 'test.json');

            expect(file.cache).toBe(loader.cacheManager.tilemap);
        });

        it('should set key from string argument', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'level1', 'maps/level1.json');

            expect(file.key).toBe('level1');
        });

        it('should prepend prefix to key when loader has a prefix', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new TilemapImpactFile(loader, 'story', 'maps/story.json');

            expect(file.key).toBe('LEVEL1.story');
        });

        it('should set key from config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, { key: 'mapKey', url: 'maps/map.json' });

            expect(file.key).toBe('mapKey');
        });

        it('should set url from config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, { key: 'mapKey', url: 'maps/map.json' });

            expect(file.url).toBe('maps/map.json');
        });

        it('should default url to key.json when url is not provided', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'level1');

            expect(file.url).toBe('level1.json');
        });
    });

    describe('addToCache', function ()
    {
        it('should call cache.add once', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'level1', 'maps/level1.json');
            file.data = { layers: [], entities: [] };

            file.addToCache();

            expect(loader.cacheManager.tilemap.add).toHaveBeenCalledOnce();
        });

        it('should call cache.add with the file key', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'level1', 'maps/level1.json');
            file.data = {};

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[0]).toBe('level1');
        });

        it('should store the WELTMEISTER format value (3) in tiledata', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'map', 'map.json');
            file.data = {};

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[1].format).toBe(TILEMAP_FORMATS.WELTMEISTER);
            expect(callArgs[1].format).toBe(3);
        });

        it('should store the file data in tiledata.data', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'map', 'map.json');
            var testData = { layers: [{ name: 'layer1' }], entities: [] };
            file.data = testData;

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[1].data).toBe(testData);
        });

        it('should call cache.add with the prefixed key when loader prefix was set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'GAME.';
            var file = new TilemapImpactFile(loader, 'map', 'map.json');
            file.data = {};

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[0]).toBe('GAME.map');
        });

        it('should call cache.add with null data when file data is null', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapImpactFile(loader, 'map', 'map.json');
            file.data = null;

            file.addToCache();

            var callArgs = loader.cacheManager.tilemap.add.mock.calls[0];
            expect(callArgs[1].data).toBeNull();
        });
    });

    describe('tilemapImpact (FileTypesManager registration)', function ()
    {
        it('should register tilemapImpact with FileTypesManager', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            expect(typeof loader.tilemapImpact).toBe('function');
        });

        it('should call addFile when invoked with a key and url', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            loader.tilemapImpact.call(loader, 'level1', 'maps/level1.json');

            expect(loader.addFile).toHaveBeenCalledOnce();
        });

        it('should pass a TilemapImpactFile instance to addFile', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            loader.tilemapImpact.call(loader, 'level1', 'maps/level1.json');

            var addedFile = loader.addFile.mock.calls[0][0];
            expect(addedFile).toBeInstanceOf(TilemapImpactFile);
        });

        it('should return the loader instance', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            var result = loader.tilemapImpact.call(loader, 'level1', 'maps/level1.json');

            expect(result).toBe(loader);
        });

        it('should call addFile once per entry when passed an array', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            loader.tilemapImpact.call(loader, [
                { key: 'map1', url: 'maps/map1.json' },
                { key: 'map2', url: 'maps/map2.json' },
                { key: 'map3', url: 'maps/map3.json' }
            ]);

            expect(loader.addFile).toHaveBeenCalledTimes(3);
        });

        it('should add TilemapImpactFile instances when array is passed', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            loader.tilemapImpact.call(loader, [
                { key: 'map1', url: 'maps/map1.json' }
            ]);

            var addedFile = loader.addFile.mock.calls[0][0];
            expect(addedFile).toBeInstanceOf(TilemapImpactFile);
        });

        it('should handle a config object with key and url', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);

            loader.tilemapImpact.call(loader, { key: 'level1', url: 'maps/level1.json' });

            expect(loader.addFile).toHaveBeenCalledOnce();
            var addedFile = loader.addFile.mock.calls[0][0];
            expect(addedFile.key).toBe('level1');
        });
    });
});
