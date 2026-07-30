var MultiAtlasFile = require('../../../src/loader/filetypes/MultiAtlasFile');

function createMockLoader ()
{
    var loader = {
        prefix: '',
        path: '',
        baseURL: '',
        multiKeyIndex: 0,
        imageLoadType: 'XHR',
        textureManager: {
            addAtlasJSONArray: vi.fn()
        },
        cacheManager: {
            json: {}
        },
        addFile: vi.fn(),
        setBaseURL: vi.fn(function (url) { loader.baseURL = url; }),
        setPath: vi.fn(function (path) { loader.path = path; }),
        setPrefix: vi.fn(function (prefix) { loader.prefix = prefix; })
    };

    return loader;
}

describe('MultiAtlasFile', function ()
{
    describe('constructor (string key)', function ()
    {
        it('should set type to multiatlas', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json');

            expect(file.type).toBe('multiatlas');
        });

        it('should set key correctly', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'myatlas', 'atlas.json');

            expect(file.key).toBe('myatlas');
        });

        it('should create one child file (the JSON file)', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json');

            expect(file.files.length).toBe(1);
        });

        it('should set the child file as json type', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json');

            expect(file.files[0].type).toBe('json');
        });

        it('should set the json child file url correctly', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json');

            expect(file.files[0].url).toBe('atlas.json');
        });

        it('should set config.path when path is provided', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json', 'textures/');

            expect(file.config.path).toBe('textures/');
        });

        it('should set config.baseURL when baseURL is provided', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json', null, 'http://cdn.example.com/');

            expect(file.config.baseURL).toBe('http://cdn.example.com/');
        });

        it('should set config.textureXhrSettings when provided', function ()
        {
            var loader = createMockLoader();
            var xhrSettings = { timeout: 5000 };
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json', null, null, null, xhrSettings);

            expect(file.config.textureXhrSettings).toBe(xhrSettings);
        });

        it('should set pending to 1 initially', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json');

            expect(file.pending).toBe(1);
        });

        it('should set complete to false initially', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas1', 'atlas.json');

            expect(file.complete).toBe(false);
        });
    });

    describe('constructor (plain object config)', function ()
    {
        it('should read key from config object', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, { key: 'atlas2', atlasURL: 'atlas2.json' });

            expect(file.key).toBe('atlas2');
        });

        it('should use atlasURL from config when url is not present', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, { key: 'atlas2', atlasURL: 'level2.json' });

            expect(file.files[0].url).toBe('level2.json');
        });

        it('should prefer url over atlasURL in config', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, { key: 'atlas3', url: 'preferred.json', atlasURL: 'fallback.json' });

            expect(file.files[0].url).toBe('preferred.json');
        });

        it('should read path from config', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, { key: 'atlas4', atlasURL: 'atlas4.json', path: 'images/' });

            expect(file.config.path).toBe('images/');
        });

        it('should read baseURL from config', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, { key: 'atlas5', atlasURL: 'atlas5.json', baseURL: 'http://cdn.test.com/' });

            expect(file.config.baseURL).toBe('http://cdn.test.com/');
        });

        it('should read textureXhrSettings from config', function ()
        {
            var loader = createMockLoader();
            var xhrSettings = { timeout: 3000 };
            var file = new MultiAtlasFile(loader, { key: 'atlas6', atlasURL: 'atlas6.json', textureXhrSettings: xhrSettings });

            expect(file.config.textureXhrSettings).toBe(xhrSettings);
        });

        it('should read xhrSettings from config for the JSON file', function ()
        {
            var loader = createMockLoader();
            var xhrSettings = { async: true };
            var file = new MultiAtlasFile(loader, { key: 'atlas7', atlasURL: 'atlas7.json', xhrSettings: xhrSettings });

            expect(file.files[0].xhrSettings).toMatchObject(xhrSettings);
        });
    });

    describe('onFileComplete', function ()
    {
        it('should decrement pending when a known file completes', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [] };

            expect(file.pending).toBe(1);
            file.onFileComplete(jsonFile);
            expect(file.pending).toBe(0);
        });

        it('should not decrement pending for an unknown file', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');

            var unknownFile = { type: 'json', data: { textures: [] } };

            expect(file.pending).toBe(1);
            file.onFileComplete(unknownFile);
            expect(file.pending).toBe(1);
        });

        it('should create an ImageFile for each texture entry', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [
                    { image: 'texture-0.png' },
                    { image: 'texture-1.png' }
                ]
            };

            file.onFileComplete(jsonFile);

            // files[0] = json, files[1] and [2] = new image files
            expect(file.files.length).toBe(3);
            expect(file.files[1].type).toBe('image');
            expect(file.files[2].type).toBe('image');
        });

        it('should call loader.addFile for each texture image', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [
                    { image: 'texture-0.png' },
                    { image: 'texture-1.png' }
                ]
            };

            file.onFileComplete(jsonFile);

            expect(loader.addFile).toHaveBeenCalledTimes(2);
        });

        it('should generate image keys using multiKeyIndex and texture filename', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];
            var expectedIndex = file.multiKeyIndex;

            jsonFile.data = {
                textures: [
                    { image: 'sheet-0.png' }
                ]
            };

            file.onFileComplete(jsonFile);

            expect(file.files[1].key).toBe('MA' + expectedIndex + '_sheet-0.png');
        });

        it('should create a normalMap ImageFile when normalMap is defined in texture entry', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [
                    { image: 'texture-0.png', normalMap: 'texture-0_n.png' }
                ]
            };

            file.onFileComplete(jsonFile);

            // files: [json, imageFile, normalMapFile]
            expect(file.files.length).toBe(3);
            expect(file.files[2].type).toBe('normalMap');
        });

        it('should link normalMap to its parent image file', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [
                    { image: 'texture-0.png', normalMap: 'texture-0_n.png' }
                ]
            };

            file.onFileComplete(jsonFile);

            var imageFile = file.files[1];
            expect(imageFile.linkFile).not.toBeNull();
            expect(imageFile.linkFile.type).toBe('normalMap');
        });

        it('should call loader.addFile for both image and normalMap files', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [
                    { image: 'texture-0.png', normalMap: 'texture-0_n.png' }
                ]
            };

            file.onFileComplete(jsonFile);

            expect(loader.addFile).toHaveBeenCalledTimes(2);
        });

        it('should call loader.setBaseURL with the config baseURL during processing', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json', null, 'http://cdn.example.com/');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [{ image: 'texture-0.png' }] };

            file.onFileComplete(jsonFile);

            expect(loader.setBaseURL).toHaveBeenCalledWith('http://cdn.example.com/');
        });

        it('should call loader.setPath with the config path during processing', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json', 'custom/textures/');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [{ image: 'texture-0.png' }] };

            file.onFileComplete(jsonFile);

            expect(loader.setPath).toHaveBeenCalledWith('custom/textures/');
        });

        it('should restore original loader baseURL after processing', function ()
        {
            var loader = createMockLoader();
            loader.baseURL = 'http://original.com/';

            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json', null, 'http://cdn.override.com/');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [{ image: 'texture-0.png' }] };

            file.onFileComplete(jsonFile);

            var calls = loader.setBaseURL.mock.calls;
            expect(calls[calls.length - 1][0]).toBe('http://original.com/');
        });

        it('should restore original loader path after processing', function ()
        {
            var loader = createMockLoader();
            loader.path = 'original/path/';

            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json', 'override/path/');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [{ image: 'texture-0.png' }] };

            file.onFileComplete(jsonFile);

            var calls = loader.setPath.mock.calls;
            expect(calls[calls.length - 1][0]).toBe('original/path/');
        });

        it('should restore original loader prefix after processing', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'ORIGINAL.';

            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [{ image: 'texture-0.png' }] };

            file.onFileComplete(jsonFile);

            var calls = loader.setPrefix.mock.calls;
            expect(calls[calls.length - 1][0]).toBe('ORIGINAL.');
        });

        it('should not add any image files when textures array is empty', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = { textures: [] };

            file.onFileComplete(jsonFile);

            expect(file.files.length).toBe(1);
            expect(loader.addFile).not.toHaveBeenCalled();
        });

        it('should not process when file is not json type', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            // Override type so condition fails
            jsonFile.type = 'image';
            jsonFile.data = { textures: [{ image: 'texture-0.png' }] };

            file.onFileComplete(jsonFile);

            expect(file.files.length).toBe(1);
        });

        it('should not process when data has no textures property', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = { frames: [] };

            file.onFileComplete(jsonFile);

            expect(file.files.length).toBe(1);
        });
    });

    describe('addToCache', function ()
    {
        it('should not call addAtlasJSONArray when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');

            // pending is 1, so isReadyToProcess returns false
            file.addToCache();

            expect(loader.textureManager.addAtlasJSONArray).not.toHaveBeenCalled();
        });

        it('should not set complete to true when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');

            file.addToCache();

            expect(file.complete).toBe(false);
        });

        it('should call addAtlasJSONArray when ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            expect(loader.textureManager.addAtlasJSONArray).toHaveBeenCalledTimes(1);
        });

        it('should set complete to true after caching', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            expect(file.complete).toBe(true);
        });

        it('should pass the atlas key as the first argument to addAtlasJSONArray', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'myatlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(args[0]).toBe('myatlas');
        });

        it('should pass images array as second argument to addAtlasJSONArray', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];
            var imageData = { width: 512, height: 512 };

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: imageData,
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(args[1]).toEqual([imageData]);
        });

        it('should pass atlas data array as third argument to addAtlasJSONArray', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];
            var textureItem = { image: 'texture-0.png', frames: [] };

            jsonFile.data = {
                textures: [textureItem]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(args[2]).toEqual([textureItem]);
        });

        it('should pass undefined as normalMaps when none are present', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(args[3]).toBeUndefined();
        });

        it('should collect normalMap data when linkFile is present', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];
            var normalMapData = { width: 512, height: 512, isNormal: true };

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: { data: normalMapData }
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(Array.isArray(args[3])).toBe(true);
            expect(args[3][0]).toBe(normalMapData);
        });

        it('should skip files with type normalMap when building image list', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [{ image: 'texture-0.png', frames: [] }]
            };

            var normalMapFile = {
                type: 'normalMap',
                key: 'MA0_texture-0_n.png',
                data: {}
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: normalMapFile
            });

            file.files.push(normalMapFile);

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            // Only one image should be in the images array (normalMap file skipped)
            expect(args[1].length).toBe(1);
        });

        it('should handle multiple textures correctly', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];

            jsonFile.data = {
                textures: [
                    { image: 'texture-0.png', frames: [] },
                    { image: 'texture-1.png', frames: [] }
                ]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_texture-0.png',
                data: {},
                linkFile: null
            });

            file.files.push({
                type: 'image',
                key: 'MA0_texture-1.png',
                data: {},
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(args[1].length).toBe(2);
            expect(args[2].length).toBe(2);
        });

        it('should correctly extract texture key by stripping the MA prefix', function ()
        {
            var loader = createMockLoader();
            var file = new MultiAtlasFile(loader, 'atlas', 'atlas.json');
            var jsonFile = file.files[0];
            var imageData = {};

            jsonFile.data = {
                textures: [{ image: 'spritesheet-big.png', frames: [] }]
            };

            file.files.push({
                type: 'image',
                key: 'MA0_spritesheet-big.png',
                data: imageData,
                linkFile: null
            });

            file.pending = 0;
            file.addToCache();

            // Should match 'spritesheet-big.png' after stripping 'MA0_' prefix
            var args = loader.textureManager.addAtlasJSONArray.mock.calls[0];
            expect(args[1][0]).toBe(imageData);
        });
    });
});
