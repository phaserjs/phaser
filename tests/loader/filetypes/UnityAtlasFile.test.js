var UnityAtlasFile = require('../../../src/loader/filetypes/UnityAtlasFile');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        baseURL: '',
        multiKeyIndex: 0,
        textureManager: {
            addUnityAtlas: vi.fn()
        },
        cacheManager: {
            text: {}
        },
        addFile: function () {}
    };
}

describe('UnityAtlasFile', function ()
{
    describe('constructor (plain arguments)', function ()
    {
        it('should create a UnityAtlasFile with the correct type', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.type).toBe('unityatlas');
        });

        it('should store the key', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'myAtlas', 'myAtlas.png', 'myAtlas.txt');

            expect(file.key).toBe('myAtlas');
        });

        it('should create two child files when no normal map is provided', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.files).toHaveLength(2);
        });

        it('should set the image file as the first child', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.files[0].type).toBe('image');
        });

        it('should set the text file as the second child', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.files[1].type).toBe('text');
        });

        it('should default complete to false', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.complete).toBe(false);
        });

        it('should set pending equal to the number of child files', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.pending).toBe(2);
        });

        it('should link child files back to the multiFile', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.files[0].multiFile).toBe(file);
            expect(file.files[1].multiFile).toBe(file);
        });

        it('should use the loader prefix when set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'MENU.';
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.key).toBe('MENU.atlas');
        });

        it('should build the image URL from path when no baseURL prefix present', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.files[0].url).toBe('assets/atlas.png');
        });

        it('should build the text URL from path when no baseURL prefix present', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new UnityAtlasFile(loader, 'atlas', 'atlas.png', 'atlas.txt');

            expect(file.files[1].url).toBe('assets/atlas.txt');
        });
    });

    describe('constructor (normal map)', function ()
    {
        it('should create three child files when a normal map URL is provided', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', [ 'atlas.png', 'atlas-n.png' ], 'atlas.txt');

            expect(file.files).toHaveLength(3);
        });

        it('should set pending to 3 when a normal map is present', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, 'atlas', [ 'atlas.png', 'atlas-n.png' ], 'atlas.txt');

            expect(file.pending).toBe(3);
        });
    });

    describe('constructor (config object)', function ()
    {
        it('should accept a plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, {
                key: 'atlas',
                textureURL: 'atlas.png',
                atlasURL: 'atlas.txt'
            });

            expect(file.key).toBe('atlas');
            expect(file.type).toBe('unityatlas');
        });

        it('should default image extension to png when not specified in config', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, {
                key: 'atlas',
                atlasURL: 'atlas.txt'
            });

            expect(file.files[0].url).toContain('.png');
        });

        it('should default atlas extension to txt when not specified in config', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, {
                key: 'atlas',
                textureURL: 'atlas.png'
            });

            expect(file.files[1].url).toContain('.txt');
        });

        it('should use custom extension when specified in config', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, {
                key: 'atlas',
                textureURL: 'atlas.webp',
                textureExtension: 'webp',
                atlasURL: 'atlas.meta',
                atlasExtension: 'meta'
            });

            expect(file.files[0].url).toContain('atlas.webp');
            expect(file.files[1].url).toContain('atlas.meta');
        });

        it('should create three child files when normalMap is specified in config', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, {
                key: 'atlas',
                textureURL: 'atlas.png',
                normalMap: 'atlas-n.png',
                atlasURL: 'atlas.txt'
            });

            expect(file.files).toHaveLength(3);
        });

        it('should create two child files when no normalMap in config', function ()
        {
            var loader = createMockLoader();
            var file = new UnityAtlasFile(loader, {
                key: 'atlas',
                textureURL: 'atlas.png',
                atlasURL: 'atlas.txt'
            });

            expect(file.files).toHaveLength(2);
        });
    });

    describe('addToCache', function ()
    {
        it('should call textureManager.addUnityAtlas when ready to process', function ()
        {
            var addUnityAtlas = vi.fn();
            var mockContext = {
                isReadyToProcess: function () { return true; },
                files: [
                    { key: 'atlas', data: 'imageData' },
                    { data: 'textData' }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: addUnityAtlas
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(addUnityAtlas).toHaveBeenCalledOnce();
        });

        it('should pass image key, image data, text data, and null normalMap to addUnityAtlas', function ()
        {
            var addUnityAtlas = vi.fn();
            var mockContext = {
                isReadyToProcess: function () { return true; },
                files: [
                    { key: 'myAtlas', data: 'imgData' },
                    { data: 'atlasText' }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: addUnityAtlas
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(addUnityAtlas).toHaveBeenCalledWith('myAtlas', 'imgData', 'atlasText', null);
        });

        it('should pass normal map data as the fourth argument when a third file exists', function ()
        {
            var addUnityAtlas = vi.fn();
            var mockContext = {
                isReadyToProcess: function () { return true; },
                files: [
                    { key: 'myAtlas', data: 'imgData' },
                    { data: 'atlasText' },
                    { data: 'normalMapData' }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: addUnityAtlas
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(addUnityAtlas).toHaveBeenCalledWith('myAtlas', 'imgData', 'atlasText', 'normalMapData');
        });

        it('should set complete to true after processing', function ()
        {
            var mockContext = {
                isReadyToProcess: function () { return true; },
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { data: 'atlasText' }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: vi.fn()
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(mockContext.complete).toBe(true);
        });

        it('should not call addUnityAtlas when not ready to process', function ()
        {
            var addUnityAtlas = vi.fn();
            var mockContext = {
                isReadyToProcess: function () { return false; },
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { data: 'atlasText' }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: addUnityAtlas
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(addUnityAtlas).not.toHaveBeenCalled();
        });

        it('should not set complete to true when not ready to process', function ()
        {
            var mockContext = {
                isReadyToProcess: function () { return false; },
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { data: 'atlasText' }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: vi.fn()
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(mockContext.complete).toBe(false);
        });

        it('should pass null as normalMap when third file has no data', function ()
        {
            var addUnityAtlas = vi.fn();
            var mockContext = {
                isReadyToProcess: function () { return true; },
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { data: 'atlasText' },
                    { data: null }
                ],
                loader: {
                    textureManager: {
                        addUnityAtlas: addUnityAtlas
                    }
                },
                complete: false
            };

            UnityAtlasFile.prototype.addToCache.call(mockContext);

            expect(addUnityAtlas).toHaveBeenCalledWith('atlas', 'imgData', 'atlasText', null);
        });
    });
});
