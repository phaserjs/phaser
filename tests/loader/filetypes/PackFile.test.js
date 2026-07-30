var CONST = require('../../../src/loader/const');
var PackFile = require('../../../src/loader/filetypes/PackFile');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        cacheManager: {
            json: {}
        },
        addPack: vi.fn()
    };
}

describe('PackFile', function ()
{
    describe('constructor', function ()
    {
        it('should set type to packfile', function ()
        {
            var loader = createMockLoader();
            var file = new PackFile(loader, 'testpack', 'test.json');

            expect(file.type).toBe('packfile');
        });

        it('should store a reference to the loader', function ()
        {
            var loader = createMockLoader();
            var file = new PackFile(loader, 'testpack', 'test.json');

            expect(file.loader).toBe(loader);
        });

        it('should set the key correctly', function ()
        {
            var loader = createMockLoader();
            var file = new PackFile(loader, 'mypack', 'test.json');

            expect(file.key).toBe('mypack');
        });

        it('should apply loader prefix to the key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new PackFile(loader, 'mypack', 'test.json');

            expect(file.key).toBe('LEVEL1.mypack');
        });

        it('should accept a config object as the key argument', function ()
        {
            var loader = createMockLoader();
            var file = new PackFile(loader, { key: 'configpack', url: 'data/pack.json' });

            expect(file.key).toBe('configpack');
            expect(file.type).toBe('packfile');
        });

        it('should set state to FILE_POPULATED when a plain object is passed as url', function ()
        {
            var loader = createMockLoader();
            var jsonData = { files: [] };
            var file = new PackFile(loader, 'mypack', jsonData);

            expect(file.state).toBe(CONST.FILE_POPULATED);
        });

        it('should set state to FILE_PENDING when a url string is provided', function ()
        {
            var loader = createMockLoader();
            var file = new PackFile(loader, 'mypack', 'data/pack.json');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });

        it('should store a pre-populated JSON object as data', function ()
        {
            var loader = createMockLoader();
            var jsonData = { test1: { files: [] } };
            var file = new PackFile(loader, 'mypack', jsonData);

            expect(file.data).toBe(jsonData);
        });

        it('should store only the dataKey portion when a dataKey and plain object url are provided', function ()
        {
            var loader = createMockLoader();
            var jsonData = { section1: { files: [] }, section2: { files: [] } };
            var file = new PackFile(loader, 'mypack', jsonData, undefined, 'section1');

            expect(file.data).toEqual({ files: [] });
        });
    });

    describe('onProcess', function ()
    {
        it('should parse responseText and store as data when state is not FILE_POPULATED', function ()
        {
            var file = Object.create(PackFile.prototype);
            var parsedData = { test1: { files: [] } };

            file.state = CONST.FILE_PENDING;
            file.xhrLoader = { responseText: JSON.stringify(parsedData) };
            file.config = null;
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toEqual(parsedData);
        });

        it('should set state to FILE_PROCESSING when not FILE_POPULATED', function ()
        {
            var file = Object.create(PackFile.prototype);
            var parsedData = { test1: { files: [] } };

            file.state = CONST.FILE_PENDING;
            file.xhrLoader = { responseText: JSON.stringify(parsedData) };
            file.config = null;
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.state).toBe(CONST.FILE_PROCESSING);
        });

        it('should skip parsing when state is FILE_POPULATED', function ()
        {
            var file = Object.create(PackFile.prototype);
            var existingData = { test1: { files: [] } };

            file.state = CONST.FILE_POPULATED;
            file.data = existingData;
            file.config = null;
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toBe(existingData);
        });

        it('should wrap data in a config-keyed object when data has files property and config is set', function ()
        {
            var file = Object.create(PackFile.prototype);
            var packData = { files: [{ type: 'image', key: 'bg', url: 'bg.png' }] };

            file.state = CONST.FILE_POPULATED;
            file.data = packData;
            file.config = 'mySection';
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toEqual({ mySection: packData });
        });

        it('should not wrap data when data has files property but config is falsy', function ()
        {
            var file = Object.create(PackFile.prototype);
            var packData = { files: [{ type: 'image', key: 'bg', url: 'bg.png' }] };

            file.state = CONST.FILE_POPULATED;
            file.data = packData;
            file.config = null;
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toBe(packData);
        });

        it('should not wrap data when config is set but data has no files property', function ()
        {
            var file = Object.create(PackFile.prototype);
            var packData = { images: [] };

            file.state = CONST.FILE_POPULATED;
            file.data = packData;
            file.config = 'mySection';
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toBe(packData);
        });

        it('should call loader.addPack with the processed data and config', function ()
        {
            var file = Object.create(PackFile.prototype);
            var packData = { test1: { files: [] } };
            var addPackMock = vi.fn();

            file.state = CONST.FILE_POPULATED;
            file.data = packData;
            file.config = 'test1';
            file.loader = { addPack: addPackMock };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(addPackMock).toHaveBeenCalledOnce();
        });

        it('should call loader.addPack passing the data and config arguments', function ()
        {
            var file = Object.create(PackFile.prototype);
            var packData = { files: [] };

            file.state = CONST.FILE_POPULATED;
            file.data = packData;
            file.config = null;
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.loader.addPack).toHaveBeenCalledWith(packData, null);
        });

        it('should call onProcessComplete', function ()
        {
            var file = Object.create(PackFile.prototype);
            var onProcessCompleteMock = vi.fn();

            file.state = CONST.FILE_POPULATED;
            file.data = { test1: { files: [] } };
            file.config = null;
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = onProcessCompleteMock;

            file.onProcess();

            expect(onProcessCompleteMock).toHaveBeenCalledOnce();
        });

        it('should parse json from xhrLoader and then wrap with config key when data has files property', function ()
        {
            var file = Object.create(PackFile.prototype);
            var packData = { files: [{ type: 'image', key: 'hero' }] };

            file.state = CONST.FILE_PENDING;
            file.xhrLoader = { responseText: JSON.stringify(packData) };
            file.config = 'mySection';
            file.loader = { addPack: vi.fn() };
            file.onProcessComplete = vi.fn();

            file.onProcess();

            expect(file.data).toEqual({ mySection: packData });
            expect(file.loader.addPack).toHaveBeenCalledWith({ mySection: packData }, 'mySection');
        });
    });
});
