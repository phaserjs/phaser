var AtlasJSONFile = require('../../../src/loader/filetypes/AtlasJSONFile');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        baseURL: '',
        multiKeyIndex: 0,
        imageLoadType: 'XHR',
        textureManager: {
            addAtlas: vi.fn()
        },
        cacheManager: {
            json: {}
        },
        addFile: vi.fn()
    };
}

describe('AtlasJSONFile', function ()
{
    describe('constructor (string key)', function ()
    {
        it('should set type to atlasjson', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.type).toBe('atlasjson');
        });

        it('should set key correctly', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'myatlas', 'atlas.png', 'atlas.json');

            expect(file.key).toBe('myatlas');
        });

        it('should create two child files (image and json)', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.files.length).toBe(2);
        });

        it('should set image file as first child', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.files[0].type).toBe('image');
        });

        it('should set json file as second child', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.files[1].type).toBe('json');
        });

        it('should default image URL to key.png when textureURL is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'myatlas');

            expect(file.files[0].url).toBe('myatlas.png');
        });

        it('should default json URL to key.json when atlasURL is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'myatlas');

            expect(file.files[1].url).toBe('myatlas.json');
        });

        it('should set pending count to number of child files', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.pending).toBe(2);
        });

        it('should set complete to false initially', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.complete).toBe(false);
        });

        it('should link each child file back to the multifile', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.files[0].multiFile).toBe(file);
            expect(file.files[1].multiFile).toBe(file);
        });

        it('should apply loader prefix to key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'SCENE.';
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            expect(file.key).toBe('SCENE.atlas1');
        });

        it('should create three child files when textureURL is an array (normal map)', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', [ 'atlas.png', 'atlas-n.png' ], 'atlas.json');

            expect(file.files.length).toBe(3);
        });

        it('should include the normal map as the third child when textureURL is an array', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', [ 'atlas.png', 'atlas-n.png' ], 'atlas.json');

            expect(file.files[2].type).toBe('normalMap');
        });
    });

    describe('constructor (config object)', function ()
    {
        it('should set type to atlasjson when given a config object', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'atlas1',
                textureURL: 'atlas.png',
                atlasURL: 'atlas.json'
            });

            expect(file.type).toBe('atlasjson');
        });

        it('should set key from config object', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'myatlas',
                textureURL: 'atlas.png',
                atlasURL: 'atlas.json'
            });

            expect(file.key).toBe('myatlas');
        });

        it('should create two child files from config object', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'atlas1',
                textureURL: 'atlas.png',
                atlasURL: 'atlas.json'
            });

            expect(file.files.length).toBe(2);
        });

        it('should default image extension to png from config object', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'myatlas'
            });

            expect(file.files[0].url).toBe('myatlas.png');
        });

        it('should use custom textureExtension from config object', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'myatlas',
                textureExtension: 'jpg'
            });

            expect(file.files[0].url).toBe('myatlas.jpg');
        });

        it('should default atlas extension to json from config object', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'myatlas'
            });

            expect(file.files[1].url).toBe('myatlas.json');
        });

        it('should create three child files when normalMap is set in config', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'atlas1',
                textureURL: 'atlas.png',
                normalMap: 'atlas-n.png',
                atlasURL: 'atlas.json'
            });

            expect(file.files.length).toBe(3);
        });

        it('should have three pending files when normalMap is provided', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, {
                key: 'atlas1',
                textureURL: 'atlas.png',
                normalMap: 'atlas-n.png',
                atlasURL: 'atlas.json'
            });

            expect(file.pending).toBe(3);
        });
    });

    describe('addToCache', function ()
    {
        it('should not call addAtlas when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            // pending is 2, so isReadyToProcess returns false
            file.addToCache();

            expect(loader.textureManager.addAtlas).not.toHaveBeenCalled();
        });

        it('should not set complete when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            file.addToCache();

            expect(file.complete).toBe(false);
        });

        it('should call addAtlas with correct arguments when ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');
            var imageData = { width: 256, height: 256 };
            var jsonData = { frames: [] };

            file.files[0].data = imageData;
            file.files[1].data = jsonData;
            file.pending = 0;

            file.addToCache();

            expect(loader.textureManager.addAtlas).toHaveBeenCalledWith(
                file.files[0].key,
                imageData,
                jsonData,
                null
            );
        });

        it('should set complete to true after caching', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            file.files[0].data = {};
            file.files[1].data = {};
            file.pending = 0;

            file.addToCache();

            expect(file.complete).toBe(true);
        });

        it('should pass null as normalMap when no third file exists', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            file.files[0].data = {};
            file.files[1].data = {};
            file.pending = 0;

            file.addToCache();

            var callArgs = loader.textureManager.addAtlas.mock.calls[0];

            expect(callArgs[3]).toBeNull();
        });

        it('should pass normalMap data as fourth argument when third file exists', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', [ 'atlas.png', 'atlas-n.png' ], 'atlas.json');
            var normalData = { width: 256, height: 256 };

            file.files[0].data = {};
            file.files[1].data = {};
            file.files[2].data = normalData;
            file.pending = 0;

            file.addToCache();

            var callArgs = loader.textureManager.addAtlas.mock.calls[0];

            expect(callArgs[3]).toBe(normalData);
        });

        it('should not call addAtlas a second time once complete is true', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            file.files[0].data = {};
            file.files[1].data = {};
            file.pending = 0;

            file.addToCache();
            file.addToCache();

            expect(loader.textureManager.addAtlas).toHaveBeenCalledTimes(1);
        });

        it('should not process if failed count is greater than zero', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasJSONFile(loader, 'atlas1', 'atlas.png', 'atlas.json');

            file.pending = 0;
            file.failed = 1;

            file.addToCache();

            expect(loader.textureManager.addAtlas).not.toHaveBeenCalled();
        });
    });
});
