var ImageFile = require('../../../src/loader/filetypes/ImageFile');
var CONST = require('../../../src/loader/const');
var File = require('../../../src/loader/File');

function createMockLoader ()
{
    return {
        textureManager: {
            addImage: vi.fn()
        },
        imageLoadType: 'XHR',
        addFile: vi.fn(),
        baseURL: 'http://localhost/',
        path: '',
        prefix: '',
        crossOrigin: undefined,
        maxRetries: 2,
        nextFile: vi.fn()
    };
}

function createMockImage ()
{
    var img = {
        crossOrigin: undefined,
        src: '',
        onload: null,
        onerror: null
    };

    return img;
}

describe('ImageFile', function ()
{
    var MockImageConstructor;
    var createdImages;

    beforeEach(function ()
    {
        createdImages = [];

        MockImageConstructor = vi.fn(function ()
        {
            this.crossOrigin = undefined;
            this.src = '';
            this.onload = null;
            this.onerror = null;
            createdImages.push(this);
        });

        vi.stubGlobal('Image', MockImageConstructor);
    });

    afterEach(function ()
    {
        vi.unstubAllGlobals();
    });

    describe('constructor', function ()
    {
        it('should create an ImageFile with string key and url', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'testImage', 'images/test.png');

            expect(file.type).toBe('image');
            expect(file.key).toBe('testImage');
        });

        it('should set type to image', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'myImage', 'images/my.png');

            expect(file.type).toBe('image');
        });

        it('should set cache to loader.textureManager', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'myImage', 'images/my.png');

            expect(file.cache).toBe(loader.textureManager);
        });

        it('should accept a plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, {
                key: 'configImage',
                url: 'images/config.png'
            });

            expect(file.key).toBe('configImage');
            expect(file.type).toBe('image');
        });

        it('should read extension from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, {
                key: 'jpegImage',
                url: 'images/photo.jpg',
                extension: 'jpg'
            });

            expect(file.key).toBe('jpegImage');
        });

        it('should handle array url and treat second element as normalMapURL', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'normImage', [ 'images/base.png', 'images/normal.png' ]);

            expect(file.key).toBe('normImage');
            expect(loader.addFile).toHaveBeenCalledOnce();

            var normalMapFile = loader.addFile.mock.calls[0][0];

            expect(normalMapFile.type).toBe('normalMap');
        });

        it('should create a linked normal map file when normalMap is in config object', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, {
                key: 'normImage',
                url: 'images/base.png',
                normalMap: 'images/normal.png'
            });

            expect(loader.addFile).toHaveBeenCalledOnce();

            var normalMapFile = loader.addFile.mock.calls[0][0];

            expect(normalMapFile.type).toBe('normalMap');
        });

        it('should set linkFile when a normal map is provided', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'linked', [ 'images/base.png', 'images/normal.png' ]);

            expect(file.linkFile).toBeDefined();
            expect(file.linkFile.type).toBe('normalMap');
        });

        it('should have no linkFile when no normal map is provided', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'noNorm', 'images/base.png');

            expect(file.linkFile).toBeUndefined();
        });

        it('should set useImageElementLoad to false when imageLoadType is XHR', function ()
        {
            var loader = createMockLoader();

            loader.imageLoadType = 'XHR';

            var file = new ImageFile(loader, 'xhrImg', 'images/test.png');

            expect(file.useImageElementLoad).toBe(false);
        });

        it('should set useImageElementLoad to true when imageLoadType is HTMLImageElement', function ()
        {
            var loader = createMockLoader();

            loader.imageLoadType = 'HTMLImageElement';

            var file = new ImageFile(loader, 'imgEl', 'images/test.png');

            expect(file.useImageElementLoad).toBe(true);
        });

        it('should override onProcess with onProcessImage when using HTMLImageElement load type', function ()
        {
            var loader = createMockLoader();

            loader.imageLoadType = 'HTMLImageElement';

            var file = new ImageFile(loader, 'imgEl', 'images/test.png');

            expect(file.onProcess).toBe(file.onProcessImage);
        });

        it('should use loader prefix in key when prefix is set', function ()
        {
            var loader = createMockLoader();

            loader.prefix = 'MENU.';

            var file = new ImageFile(loader, 'Background', 'images/bg.png');

            expect(file.key).toBe('MENU.Background');
        });

        it('should set state to FILE_PENDING for a normal url', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'pending', 'images/test.png');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });
    });

    describe('onProcess', function ()
    {
        it('should set state to FILE_PROCESSING', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'procImg', 'images/test.png');

            file.crossOrigin = undefined;
            file.xhrLoader = { response: new Blob() };
            file.onProcessComplete = vi.fn();
            file.onProcessError = vi.fn();

            vi.spyOn(File, 'createObjectURL').mockImplementation(function () {});
            vi.spyOn(File, 'revokeObjectURL').mockImplementation(function () {});

            file.onProcess();

            expect(file.state).toBe(CONST.FILE_PROCESSING);

            vi.restoreAllMocks();
        });

        it('should create a new Image element', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'procImg', 'images/test.png');

            file.xhrLoader = { response: new Blob() };
            file.onProcessComplete = vi.fn();
            file.onProcessError = vi.fn();

            vi.spyOn(File, 'createObjectURL').mockImplementation(function () {});
            vi.spyOn(File, 'revokeObjectURL').mockImplementation(function () {});

            MockImageConstructor.mockClear();

            file.onProcess();

            expect(MockImageConstructor).toHaveBeenCalledOnce();

            vi.restoreAllMocks();
        });

        it('should call onProcessComplete when image onload fires', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'procImg', 'images/test.png');

            file.xhrLoader = { response: new Blob() };
            file.onProcessComplete = vi.fn();
            file.onProcessError = vi.fn();

            vi.spyOn(File, 'createObjectURL').mockImplementation(function () {});
            vi.spyOn(File, 'revokeObjectURL').mockImplementation(function () {});

            MockImageConstructor.mockClear();
            createdImages = [];

            file.onProcess();

            var createdImg = createdImages[0];

            createdImg.onload();

            expect(file.onProcessComplete).toHaveBeenCalledOnce();

            vi.restoreAllMocks();
        });

        it('should call onProcessError when image onerror fires', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'procImg', 'images/test.png');

            file.xhrLoader = { response: new Blob() };
            file.onProcessComplete = vi.fn();
            file.onProcessError = vi.fn();

            vi.spyOn(File, 'createObjectURL').mockImplementation(function () {});
            vi.spyOn(File, 'revokeObjectURL').mockImplementation(function () {});

            MockImageConstructor.mockClear();
            createdImages = [];

            file.onProcess();

            var createdImg = createdImages[0];

            createdImg.onerror();

            expect(file.onProcessError).toHaveBeenCalledOnce();

            vi.restoreAllMocks();
        });

        it('should call File.createObjectURL with the xhr response', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'procImg', 'images/test.png');

            var fakeResponse = new Blob();

            file.xhrLoader = { response: fakeResponse };
            file.onProcessComplete = vi.fn();
            file.onProcessError = vi.fn();

            var createObjectURL = vi.spyOn(File, 'createObjectURL').mockImplementation(function () {});

            vi.spyOn(File, 'revokeObjectURL').mockImplementation(function () {});

            MockImageConstructor.mockClear();
            createdImages = [];

            file.onProcess();

            var createdImg = createdImages[0];

            expect(createObjectURL).toHaveBeenCalledWith(createdImg, fakeResponse, 'image/png');

            vi.restoreAllMocks();
        });
    });

    describe('addToCache', function ()
    {
        it('should call cache.addImage with key and data when no linkFile', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'cacheImg', 'images/test.png');

            var fakeImageData = { width: 100, height: 100 };

            file.data = fakeImageData;
            file.linkFile = undefined;

            file.addToCache();

            expect(loader.textureManager.addImage).toHaveBeenCalledWith('cacheImg', fakeImageData);
        });

        it('should call cache.addImage with key, image data and normal map data when type is normalMap and linkFile is complete', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'normImg', 'images/test.png');

            var fakeImageData = { width: 100, height: 100 };
            var fakeNormalData = { width: 100, height: 100 };
            var mockLinkFile = {
                state: CONST.FILE_COMPLETE,
                type: 'image',
                data: fakeImageData,
                addToCache: vi.fn()
            };

            file.data = fakeNormalData;
            file.type = 'normalMap';
            file.linkFile = mockLinkFile;
            file.cache = loader.textureManager;

            file.addToCache();

            expect(loader.textureManager.addImage).toHaveBeenCalledWith('normImg', fakeImageData, fakeNormalData);
        });

        it('should call cache.addImage with key, image data and normal map data when type is image and linkFile is normalMap and complete', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'baseImg', 'images/test.png');

            var fakeImageData = { width: 100, height: 100 };
            var fakeNormalData = { width: 100, height: 100 };
            var mockLinkFile = {
                state: CONST.FILE_COMPLETE,
                type: 'normalMap',
                data: fakeNormalData,
                addToCache: vi.fn()
            };

            file.data = fakeImageData;
            file.linkFile = mockLinkFile;
            file.cache = loader.textureManager;

            file.addToCache();

            expect(loader.textureManager.addImage).toHaveBeenCalledWith('baseImg', fakeImageData, fakeNormalData);
        });

        it('should not call cache.addImage when linkFile exists but has not completed loading', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'waitImg', 'images/test.png');

            var mockLinkFile = {
                state: CONST.FILE_LOADING,
                type: 'normalMap',
                data: null,
                addToCache: vi.fn()
            };

            file.data = {};
            file.linkFile = mockLinkFile;
            file.cache = loader.textureManager;

            file.addToCache();

            expect(loader.textureManager.addImage).not.toHaveBeenCalled();
        });

        it('should call linkFile.addToCache when linkFile type is spritesheet and complete', function ()
        {
            var loader = createMockLoader();
            var file = new ImageFile(loader, 'spriteImg', 'images/test.png');

            var mockLinkFile = {
                state: CONST.FILE_COMPLETE,
                type: 'spritesheet',
                data: {},
                addToCache: vi.fn()
            };

            file.data = {};
            file.linkFile = mockLinkFile;
            file.cache = loader.textureManager;

            file.addToCache();

            expect(mockLinkFile.addToCache).toHaveBeenCalledOnce();
            expect(loader.textureManager.addImage).not.toHaveBeenCalled();
        });
    });

    describe('image plugin registration', function ()
    {
        it('should be importable as a module', function ()
        {
            expect(ImageFile).toBeDefined();
        });

        it('should be a constructor function', function ()
        {
            expect(typeof ImageFile).toBe('function');
        });
    });
});
