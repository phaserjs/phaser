var TilemapCSVFile = require('../../../src/loader/filetypes/TilemapCSVFile');
var CONST = require('../../../src/loader/const');
var TILEMAP_FORMATS = require('../../../src/tilemaps/Formats');

function createMockLoader ()
{
    return {
        cacheManager: {
            tilemap: {
                add: vi.fn()
            }
        },
        prefix: '',
        path: '',
        crossOrigin: undefined,
        fileProcessComplete: vi.fn()
    };
}

describe('TilemapCSVFile', function ()
{
    describe('constructor with string key', function ()
    {
        it('should set the type to tilemapCSV', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.type).toBe('tilemapCSV');
        });

        it('should set the key correctly', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.key).toBe('level1');
        });

        it('should set the cache to loader.cacheManager.tilemap', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.cache).toBe(loader.cacheManager.tilemap);
        });

        it('should set tilemapFormat to TILEMAP_FORMATS.CSV', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.tilemapFormat).toBe(TILEMAP_FORMATS.CSV);
        });

        it('should set tilemapFormat to 0', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.tilemapFormat).toBe(0);
        });

        it('should store a reference to the loader', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.loader).toBe(loader);
        });

        it('should set initial state to FILE_PENDING', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });

        it('should build the URL from path when a relative url is provided', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.url).toBe('assets/maps/level1.csv');
        });

        it('should build a default URL from key and csv extension when url is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', undefined);

            expect(file.url).toBe('level1.csv');
        });

        it('should prepend prefix to key when loader.prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'ZONE1.';
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            expect(file.key).toBe('ZONE1.level1');
        });
    });

    describe('constructor with config object', function ()
    {
        it('should accept a plain config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, { key: 'mymap', url: 'maps/mymap.csv' });

            expect(file.key).toBe('mymap');
        });

        it('should set the type to tilemapCSV when using config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, { key: 'mymap', url: 'maps/mymap.csv' });

            expect(file.type).toBe('tilemapCSV');
        });

        it('should set tilemapFormat to CSV when using config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, { key: 'mymap', url: 'maps/mymap.csv' });

            expect(file.tilemapFormat).toBe(TILEMAP_FORMATS.CSV);
        });

        it('should use custom extension from config object', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, { key: 'mymap', extension: 'txt' });

            expect(file.url).toBe('mymap.txt');
        });

        it('should default to csv extension when no extension in config', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, { key: 'mymap' });

            expect(file.url).toBe('mymap.csv');
        });
    });

    describe('onProcess', function ()
    {
        it('should set data to xhrLoader.responseText', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            file.xhrLoader = { responseText: '0,1,2\n3,4,5\n6,7,8' };
            file.onProcess();

            expect(file.data).toBe('0,1,2\n3,4,5\n6,7,8');
        });

        it('should set state to FILE_COMPLETE after processing', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            file.xhrLoader = { responseText: '0,1,2' };
            file.onProcess();

            expect(file.state).toBe(CONST.FILE_COMPLETE);
        });

        it('should call loader.fileProcessComplete', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            file.xhrLoader = { responseText: '0,1,2' };
            file.onProcess();

            expect(loader.fileProcessComplete).toHaveBeenCalledWith(file);
        });

        it('should handle empty string response text', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');

            file.xhrLoader = { responseText: '' };
            file.onProcess();

            expect(file.data).toBe('');
        });

        it('should handle multi-line CSV response text', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');
            var csv = '0,1,2,3\n4,5,6,7\n8,9,10,11';

            file.xhrLoader = { responseText: csv };
            file.onProcess();

            expect(file.data).toBe(csv);
        });
    });

    describe('addToCache', function ()
    {
        it('should call cache.add with the file key', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');
            file.data = '0,1,2\n3,4,5';

            file.addToCache();

            expect(loader.cacheManager.tilemap.add).toHaveBeenCalledWith('level1', expect.any(Object));
        });

        it('should store the correct tilemap format in cache', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');
            file.data = '0,1,2\n3,4,5';

            file.addToCache();

            var callArg = loader.cacheManager.tilemap.add.mock.calls[0][1];
            expect(callArg.format).toBe(TILEMAP_FORMATS.CSV);
        });

        it('should store the file data in cache', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');
            var csvData = '0,1,2\n3,4,5';
            file.data = csvData;

            file.addToCache();

            var callArg = loader.cacheManager.tilemap.add.mock.calls[0][1];
            expect(callArg.data).toBe(csvData);
        });

        it('should store an object with format and data properties', function ()
        {
            var loader = createMockLoader();
            var file = new TilemapCSVFile(loader, 'mymap', 'maps/mymap.csv');
            file.data = '1,2,3';

            file.addToCache();

            var callArg = loader.cacheManager.tilemap.add.mock.calls[0][1];
            expect(callArg).toEqual({ format: TILEMAP_FORMATS.CSV, data: '1,2,3' });
        });

        it('should use the prefixed key when loader has a prefix', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'ZONE.';
            var file = new TilemapCSVFile(loader, 'level1', 'maps/level1.csv');
            file.data = '0,1,2';

            file.addToCache();

            expect(loader.cacheManager.tilemap.add).toHaveBeenCalledWith('ZONE.level1', expect.any(Object));
        });
    });

    describe('tilemapCSV FileTypesManager registration', function ()
    {
        it('should register tilemapCSV on FileTypesManager', function ()
        {
            var FileTypesManager = require('../../../src/loader/FileTypesManager');

            expect(typeof FileTypesManager.install).toBe('function');
        });

        it('should expose a tilemapCSV function via FileTypesManager.register', function ()
        {
            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            var registered = {};

            FileTypesManager.install(registered);

            expect(typeof registered.tilemapCSV).toBe('function');
        });

        it('should add a single file when tilemapCSV is called with string key', function ()
        {
            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);

            loader.tilemapCSV('level1', 'maps/level1.csv');

            expect(loader.addFile).toHaveBeenCalledTimes(1);
            var addedFile = loader.addFile.mock.calls[0][0];
            expect(addedFile).toBeInstanceOf(TilemapCSVFile);
            expect(addedFile.key).toBe('level1');
        });

        it('should add multiple files when tilemapCSV is called with an array', function ()
        {
            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);

            loader.tilemapCSV([
                { key: 'map1', url: 'maps/map1.csv' },
                { key: 'map2', url: 'maps/map2.csv' }
            ]);

            expect(loader.addFile).toHaveBeenCalledTimes(2);
        });

        it('should return the loader instance from tilemapCSV', function ()
        {
            var FileTypesManager = require('../../../src/loader/FileTypesManager');
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);

            var result = loader.tilemapCSV('level1', 'maps/level1.csv');

            expect(result).toBe(loader);
        });
    });
});
