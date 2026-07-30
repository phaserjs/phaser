var PCTAtlasFile = require('../../../src/loader/filetypes/PCTAtlasFile');

function createMockLoader ()
{
    var loader = {
        prefix: '',
        path: '',
        baseURL: '',
        multiKeyIndex: 0,
        imageLoadType: 'XHR',
        textureManager: {
            addAtlasPCT: vi.fn()
        },
        cacheManager: {
            atlas: {
                add: vi.fn()
            }
        },
        addFile: vi.fn(),
        setBaseURL: vi.fn(function (url) { loader.baseURL = url; }),
        setPath: vi.fn(function (path) { loader.path = path; }),
        setPrefix: vi.fn(function (prefix) { loader.prefix = prefix; })
    };

    return loader;
}

//  A minimal decoded PCT structure with two pages, used by several addToCache tests.
function makeTwoPageDecoded ()
{
    return {
        pages: [
            { filename: 'atlas_0.png', format: 'RGBA8888', width: 512, height: 512, padding: 0 },
            { filename: 'atlas_1.png', format: 'RGBA8888', width: 256, height: 256, padding: 0 }
        ],
        folders: [],
        frames: {
            a: { key: 'a', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 },
            b: { key: 'b', page: 1, x: 0, y: 0, w: 20, h: 20, trimmed: false, rotated: false, sourceW: 20, sourceH: 20, trimX: 0, trimY: 0 }
        }
    };
}

describe('Phaser.Loader.FileTypes.PCTAtlasFile', function ()
{
    // -------------------------------------------------------------------------
    // Constructor (string key)
    // -------------------------------------------------------------------------

    describe('constructor (string key)', function ()
    {
        it('should set type to pctatlas', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct');

            expect(file.type).toBe('pctatlas');
        });

        it('should set key from the string key argument', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'myatlas', 'atlas.pct');

            expect(file.key).toBe('myatlas');
        });

        it('should create exactly one child file (the PCT data file)', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct');

            expect(file.files.length).toBe(1);
        });

        it('should set the child file type to pct', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct');

            expect(file.files[0].type).toBe('pct');
        });

        it('should target the atlas cache for the child file', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct');

            expect(file.files[0].cache).toBe(loader.cacheManager.atlas);
        });

        it('should use the supplied URL for the child file', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'custom/path.pct');

            expect(file.files[0].url).toBe('custom/path.pct');
        });

        it('should default the extension to pct when no URL is given', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1');

            //  File base class auto-generates url from key + extension when url undefined
            expect(file.files[0].url).toBe('atlas1.pct');
        });

        it('should set config.path when provided', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct', 'textures/');

            expect(file.config.path).toBe('textures/');
        });

        it('should set config.baseURL when provided', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct', null, 'http://cdn.example.com/');

            expect(file.config.baseURL).toBe('http://cdn.example.com/');
        });

        it('should set config.textureXhrSettings when provided', function ()
        {
            var loader = createMockLoader();
            var xhr = { timeout: 5000 };
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct', null, null, null, xhr);

            expect(file.config.textureXhrSettings).toBe(xhr);
        });

        it('should start with pending=1 and complete=false', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas1', 'atlas.pct');

            expect(file.pending).toBe(1);
            expect(file.complete).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // Constructor (plain object config)
    // -------------------------------------------------------------------------

    describe('constructor (plain object config)', function ()
    {
        it('should read key from the config object', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, { key: 'atlas2', atlasURL: 'atlas2.pct' });

            expect(file.key).toBe('atlas2');
        });

        it('should read atlasURL from config when url is not present', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, { key: 'atlas2', atlasURL: 'level2.pct' });

            expect(file.files[0].url).toBe('level2.pct');
        });

        it('should prefer url over atlasURL in config', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, {
                key: 'atlas3',
                url: 'preferred.pct',
                atlasURL: 'fallback.pct'
            });

            expect(file.files[0].url).toBe('preferred.pct');
        });

        it('should read path, baseURL and textureXhrSettings from config', function ()
        {
            var loader = createMockLoader();
            var xhr = { timeout: 3000 };
            var file = new PCTAtlasFile(loader, {
                key: 'atlas4',
                atlasURL: 'atlas4.pct',
                path: 'images/',
                baseURL: 'http://cdn.test.com/',
                textureXhrSettings: xhr
            });

            expect(file.config.path).toBe('images/');
            expect(file.config.baseURL).toBe('http://cdn.test.com/');
            expect(file.config.textureXhrSettings).toBe(xhr);
        });

        it('should pass the config xhrSettings to the PCT data file', function ()
        {
            var loader = createMockLoader();
            var xhr = { async: true };
            var file = new PCTAtlasFile(loader, {
                key: 'atlas5',
                atlasURL: 'atlas5.pct',
                xhrSettings: xhr
            });

            expect(file.files[0].xhrSettings).toMatchObject(xhr);
        });
    });

    // -------------------------------------------------------------------------
    // PCT data file onProcess (decodes text into structured data)
    // -------------------------------------------------------------------------

    describe('PCT data file onProcess', function ()
    {
        it('should decode valid PCT text and store it on this.data', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            //  Mock XHR response with a minimal valid PCT payload
            dataFile.xhrLoader = {
                responseText:
                    'PCT:1.0\n' +
                    'P:atlas_0.png,RGBA8888,256,256,0\n' +
                    'logo|0|0,0,32,32\n'
            };

            //  onProcessComplete is inherited from File; stub it so we don't need a real loader
            dataFile.onProcessComplete = vi.fn();
            dataFile.onProcessError = vi.fn();

            dataFile.onProcess();

            expect(dataFile.data).toBeDefined();
            expect(Array.isArray(dataFile.data.pages)).toBe(true);
            expect(dataFile.data.pages[0].filename).toBe('atlas_0.png');
            expect(dataFile.data.frames.logo).toBeDefined();
            expect(dataFile.onProcessComplete).toHaveBeenCalled();
            expect(dataFile.onProcessError).not.toHaveBeenCalled();
        });

        it('should call onProcessError when the text fails to decode', function ()
        {
            //  Silence the console.warn from the decoder
            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.xhrLoader = { responseText: 'not a pct file' };
            dataFile.onProcessComplete = vi.fn();
            dataFile.onProcessError = vi.fn();

            dataFile.onProcess();

            expect(dataFile.onProcessError).toHaveBeenCalled();
            expect(dataFile.onProcessComplete).not.toHaveBeenCalled();

            warnSpy.mockRestore();
        });
    });

    // -------------------------------------------------------------------------
    // onFileComplete — queues ImageFiles based on decoded pages
    // -------------------------------------------------------------------------

    describe('onFileComplete', function ()
    {
        it('should decrement pending when a known file completes', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = { pages: [] };

            expect(file.pending).toBe(1);
            file.onFileComplete(dataFile);
            expect(file.pending).toBe(0);
        });

        it('should not decrement pending for an unknown file', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');

            var unknown = { type: 'pct', data: { pages: [] } };

            expect(file.pending).toBe(1);
            file.onFileComplete(unknown);
            expect(file.pending).toBe(1);
        });

        it('should create an ImageFile for each page declared in the decoded data', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = {
                pages: [
                    { filename: 'atlas_0.png' },
                    { filename: 'atlas_1.png' }
                ]
            };

            file.onFileComplete(dataFile);

            //  files[0] = pct data file, files[1] and [2] = queued ImageFiles
            expect(file.files.length).toBe(3);
            expect(file.files[1].type).toBe('image');
            expect(file.files[2].type).toBe('image');
        });

        it('should call loader.addFile for each queued ImageFile', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = {
                pages: [
                    { filename: 'atlas_0.png' },
                    { filename: 'atlas_1.png' }
                ]
            };

            file.onFileComplete(dataFile);

            expect(loader.addFile).toHaveBeenCalledTimes(2);
        });

        it('should generate image keys using multiKeyIndex and the page filename', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];
            var expectedIndex = file.multiKeyIndex;

            dataFile.data = { pages: [ { filename: 'sheet-0.png' } ] };

            file.onFileComplete(dataFile);

            expect(file.files[1].key).toBe('PCT' + expectedIndex + '_sheet-0.png');
        });

        it('should not queue any files when pages array is empty', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = { pages: [] };

            file.onFileComplete(dataFile);

            expect(file.files.length).toBe(1);
            expect(loader.addFile).not.toHaveBeenCalled();
        });

        it('should not process when the completed file is not type pct', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            //  Override type so the onFileComplete condition fails
            dataFile.type = 'image';
            dataFile.data = { pages: [ { filename: 'atlas_0.png' } ] };

            file.onFileComplete(dataFile);

            expect(file.files.length).toBe(1);
            expect(loader.addFile).not.toHaveBeenCalled();
        });

        it('should not process when data has no pages array', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = { frames: {} };

            file.onFileComplete(dataFile);

            expect(file.files.length).toBe(1);
            expect(loader.addFile).not.toHaveBeenCalled();
        });

        // ---- baseURL / path / prefix override + restore ----------------------

        it('should call loader.setBaseURL with the config baseURL during processing', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct', null, 'http://cdn.example.com/');
            var dataFile = file.files[0];

            dataFile.data = { pages: [ { filename: 'atlas_0.png' } ] };

            file.onFileComplete(dataFile);

            expect(loader.setBaseURL).toHaveBeenCalledWith('http://cdn.example.com/');
        });

        it('should call loader.setPath with the config path during processing', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct', 'custom/textures/');
            var dataFile = file.files[0];

            dataFile.data = { pages: [ { filename: 'atlas_0.png' } ] };

            file.onFileComplete(dataFile);

            expect(loader.setPath).toHaveBeenCalledWith('custom/textures/');
        });

        it('should restore the original loader baseURL after processing', function ()
        {
            var loader = createMockLoader();
            loader.baseURL = 'http://original.com/';

            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct', null, 'http://cdn.override.com/');
            var dataFile = file.files[0];

            dataFile.data = { pages: [ { filename: 'atlas_0.png' } ] };

            file.onFileComplete(dataFile);

            var calls = loader.setBaseURL.mock.calls;
            expect(calls[calls.length - 1][0]).toBe('http://original.com/');
        });

        it('should restore the original loader path after processing', function ()
        {
            var loader = createMockLoader();
            loader.path = 'original/path/';

            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct', 'override/path/');
            var dataFile = file.files[0];

            dataFile.data = { pages: [ { filename: 'atlas_0.png' } ] };

            file.onFileComplete(dataFile);

            var calls = loader.setPath.mock.calls;
            expect(calls[calls.length - 1][0]).toBe('original/path/');
        });

        it('should restore the original loader prefix after processing', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'ORIGINAL.';

            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = { pages: [ { filename: 'atlas_0.png' } ] };

            file.onFileComplete(dataFile);

            var calls = loader.setPrefix.mock.calls;
            expect(calls[calls.length - 1][0]).toBe('ORIGINAL.');
        });
    });

    // -------------------------------------------------------------------------
    // addToCache — writes to the atlas cache and the Texture Manager
    // -------------------------------------------------------------------------

    describe('addToCache', function ()
    {
        it('should not call addAtlasPCT when pending > 0', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');

            //  Don't drop pending to 0 — isReadyToProcess returns false
            file.addToCache();

            expect(loader.textureManager.addAtlasPCT).not.toHaveBeenCalled();
        });

        it('should not write to the atlas cache when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');

            file.addToCache();

            expect(loader.cacheManager.atlas.add).not.toHaveBeenCalled();
        });

        it('should not set complete when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');

            file.addToCache();

            expect(file.complete).toBe(false);
        });

        it('should call addAtlasPCT when ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = makeTwoPageDecoded();

            file.files.push({ type: 'image', key: 'PCT0_atlas_0.png', data: {} });
            file.files.push({ type: 'image', key: 'PCT0_atlas_1.png', data: {} });

            file.pending = 0;
            file.addToCache();

            expect(loader.textureManager.addAtlasPCT).toHaveBeenCalledTimes(1);
        });

        it('should write the decoded data to the atlas cache under the file key', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'myatlas', 'atlas.pct');
            var dataFile = file.files[0];
            var decoded = makeTwoPageDecoded();

            dataFile.data = decoded;

            file.files.push({ type: 'image', key: 'PCT0_atlas_0.png', data: {} });
            file.files.push({ type: 'image', key: 'PCT0_atlas_1.png', data: {} });

            file.pending = 0;
            file.addToCache();

            expect(loader.cacheManager.atlas.add).toHaveBeenCalledWith('myatlas', decoded);
        });

        it('should set complete to true after caching', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = makeTwoPageDecoded();

            file.files.push({ type: 'image', key: 'PCT0_atlas_0.png', data: {} });
            file.files.push({ type: 'image', key: 'PCT0_atlas_1.png', data: {} });

            file.pending = 0;
            file.addToCache();

            expect(file.complete).toBe(true);
        });

        it('should pass the atlas key as the first argument to addAtlasPCT', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'level1', 'atlas.pct');
            var dataFile = file.files[0];

            dataFile.data = makeTwoPageDecoded();

            file.files.push({ type: 'image', key: 'PCT0_atlas_0.png', data: {} });
            file.files.push({ type: 'image', key: 'PCT0_atlas_1.png', data: {} });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasPCT.mock.calls[0];
            expect(args[0]).toBe('level1');
        });

        it('should pass the images array in page order as the second argument', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];

            var img0 = { tag: 'image-zero' };
            var img1 = { tag: 'image-one' };

            dataFile.data = makeTwoPageDecoded();

            //  Deliberately push the images out of order to verify that
            //  addToCache looks them up by filename, not by list position.
            file.files.push({ type: 'image', key: 'PCT0_atlas_1.png', data: img1 });
            file.files.push({ type: 'image', key: 'PCT0_atlas_0.png', data: img0 });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasPCT.mock.calls[0];
            expect(args[1]).toEqual([ img0, img1 ]);
        });

        it('should pass the decoded data as the third argument', function ()
        {
            var loader = createMockLoader();
            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];
            var decoded = makeTwoPageDecoded();

            dataFile.data = decoded;

            file.files.push({ type: 'image', key: 'PCT0_atlas_0.png', data: {} });
            file.files.push({ type: 'image', key: 'PCT0_atlas_1.png', data: {} });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasPCT.mock.calls[0];
            expect(args[2]).toBe(decoded);
        });

        it('should strip the PCT{idx}_ marker when matching file keys to filenames', function ()
        {
            var loader = createMockLoader();
            //  Force a non-zero multiKeyIndex so the marker is PCT5_, not PCT0_
            loader.multiKeyIndex = 5;

            var file = new PCTAtlasFile(loader, 'atlas', 'atlas.pct');
            var dataFile = file.files[0];
            var imgData = { width: 512, height: 512 };

            dataFile.data = {
                pages: [ { filename: 'spritesheet-big.png' } ],
                folders: [],
                frames: {}
            };

            file.files.push({
                type: 'image',
                key: 'PCT5_spritesheet-big.png',
                data: imgData
            });

            file.pending = 0;
            file.addToCache();

            var args = loader.textureManager.addAtlasPCT.mock.calls[0];
            expect(args[1]).toEqual([ imgData ]);
        });
    });
});
