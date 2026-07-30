var AsepriteFile = require('../../../src/loader/filetypes/AsepriteFile');
var FileTypesManager = require('../../../src/loader/FileTypesManager');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        baseURL: '',
        crossOrigin: undefined,
        multiKeyIndex: 0,
        textureManager: {
            addAtlas: function () {}
        },
        cacheManager: {
            json: {}
        }
    };
}

describe('AsepriteFile', function ()
{
    describe('constructor', function ()
    {
        it('should be importable', function ()
        {
            expect(AsepriteFile).toBeDefined();
        });

        it('should create an instance with string key arguments', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file).toBeDefined();
            expect(file.key).toBe('hero');
            expect(file.type).toBe('atlasjson');
        });

        it('should set files array with image and json entries', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(Array.isArray(file.files)).toBe(true);
            expect(file.files.length).toBe(2);
        });

        it('should set image file as files[0] with type image', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.files[0].type).toBe('image');
        });

        it('should set json file as files[1] with type json', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.files[1].type).toBe('json');
        });

        it('should start with complete set to false', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.complete).toBe(false);
        });

        it('should start with pending equal to number of files', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.pending).toBe(2);
        });

        it('should accept a plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, {
                key: 'gladiator',
                textureURL: 'gladiator.png',
                atlasURL: 'gladiator.json'
            });

            expect(file.key).toBe('gladiator');
            expect(file.type).toBe('atlasjson');
        });

        it('should create two child files from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, {
                key: 'gladiator',
                textureURL: 'gladiator.png',
                atlasURL: 'gladiator.json'
            });

            expect(file.files.length).toBe(2);
        });

        it('should use default png extension from plain object config when textureExtension not set', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, {
                key: 'gladiator',
                textureURL: 'gladiator.png',
                atlasURL: 'gladiator.json'
            });

            expect(file.files[0].url).toContain('gladiator.png');
        });

        it('should use default json extension from plain object config when atlasExtension not set', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, {
                key: 'gladiator',
                textureURL: 'gladiator.png',
                atlasURL: 'gladiator.json'
            });

            expect(file.files[1].url).toContain('gladiator.json');
        });

        it('should set multiFile reference on each child file', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.files[0].multiFile).toBe(file);
            expect(file.files[1].multiFile).toBe(file);
        });

        it('should apply loader prefix to key when prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'GAME.';
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.key).toBe('GAME.hero');
        });

        it('should store reference to the loader', function ()
        {
            var loader = createMockLoader();
            var file = new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(file.loader).toBe(loader);
        });

        it('should increment loader multiKeyIndex', function ()
        {
            var loader = createMockLoader();
            expect(loader.multiKeyIndex).toBe(0);

            new AsepriteFile(loader, 'hero', 'hero.png', 'hero.json');

            expect(loader.multiKeyIndex).toBe(1);
        });

        it('should handle inline JSON object as atlasURL', function ()
        {
            var loader = createMockLoader();
            var jsonData = { frames: [], meta: {} };
            var file = new AsepriteFile(loader, 'hero', 'hero.png', jsonData);

            expect(file.files[1].data).toBe(jsonData);
        });
    });

    describe('addToCache', function ()
    {
        it('should not set complete when isReadyToProcess returns false', function ()
        {
            var mockFile = {
                files: [],
                isReadyToProcess: function () { return false; },
                loader: {},
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(mockFile.complete).toBe(false);
        });

        it('should not call addAtlas when isReadyToProcess returns false', function ()
        {
            var addAtlasCalled = false;

            var mockFile = {
                files: [
                    { key: 'hero', data: 'imgData' },
                    { key: 'hero', data: {}, addToCache: function () {} }
                ],
                isReadyToProcess: function () { return false; },
                loader: {
                    textureManager: {
                        addAtlas: function () { addAtlasCalled = true; }
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(addAtlasCalled).toBe(false);
        });

        it('should call textureManager.addAtlas with correct arguments when ready', function ()
        {
            var capturedArgs = null;
            var imageData = { width: 100, height: 100 };
            var jsonData = { frames: [] };

            var mockFile = {
                files: [
                    { key: 'hero', data: imageData },
                    { key: 'hero', data: jsonData, addToCache: function () {} }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlas: function (key, img, json, normalMap)
                        {
                            capturedArgs = { key: key, img: img, json: json, normalMap: normalMap };
                        }
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(capturedArgs).not.toBeNull();
            expect(capturedArgs.key).toBe('hero');
            expect(capturedArgs.img).toBe(imageData);
            expect(capturedArgs.json).toBe(jsonData);
        });

        it('should pass null normalMap when files[2] does not exist', function ()
        {
            var capturedNormalMap = 'unset';

            var mockFile = {
                files: [
                    { key: 'hero', data: 'imgData' },
                    { key: 'hero', data: {}, addToCache: function () {} }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlas: function (key, img, json, normalMap)
                        {
                            capturedNormalMap = normalMap;
                        }
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(capturedNormalMap).toBeNull();
        });

        it('should pass normalMap data from files[2] when it exists', function ()
        {
            var capturedNormalMap = null;
            var normalMapData = { width: 100, height: 100 };

            var mockFile = {
                files: [
                    { key: 'hero', data: 'imgData' },
                    { key: 'hero', data: {}, addToCache: function () {} },
                    { data: normalMapData }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlas: function (key, img, json, normalMap)
                        {
                            capturedNormalMap = normalMap;
                        }
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(capturedNormalMap).toBe(normalMapData);
        });

        it('should call json.addToCache when ready to process', function ()
        {
            var jsonAddToCacheCalled = false;

            var mockFile = {
                files: [
                    { key: 'hero', data: 'imgData' },
                    {
                        key: 'hero',
                        data: {},
                        addToCache: function () { jsonAddToCacheCalled = true; }
                    }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlas: function () {}
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(jsonAddToCacheCalled).toBe(true);
        });

        it('should set complete to true when ready to process', function ()
        {
            var mockFile = {
                files: [
                    { key: 'hero', data: 'imgData' },
                    { key: 'hero', data: {}, addToCache: function () {} }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlas: function () {}
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(mockFile.complete).toBe(true);
        });

        it('should not call addToCache twice if already complete', function ()
        {
            var addAtlasCallCount = 0;

            var mockFile = {
                files: [
                    { key: 'hero', data: 'imgData' },
                    { key: 'hero', data: {}, addToCache: function () {} }
                ],
                isReadyToProcess: function () { return !this.complete; },
                loader: {
                    textureManager: {
                        addAtlas: function () { addAtlasCallCount++; }
                    }
                },
                complete: false
            };

            AsepriteFile.prototype.addToCache.call(mockFile);
            AsepriteFile.prototype.addToCache.call(mockFile);

            expect(addAtlasCallCount).toBe(1);
        });
    });

    describe('aseprite FileTypesManager registration', function ()
    {
        it('should register the aseprite method on a loader via FileTypesManager.install', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            FileTypesManager.install(loader);

            expect(typeof loader.aseprite).toBe('function');
        });

        it('should call addFile when aseprite is invoked with a string key', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (files) { addedFiles = addedFiles.concat(files); };

            FileTypesManager.install(loader);
            loader.aseprite('hero', 'hero.png', 'hero.json');

            expect(addedFiles.length).toBeGreaterThan(0);
        });

        it('should call addFile for each entry when key is an array', function ()
        {
            var loader = createMockLoader();
            var addFileCalls = 0;
            loader.addFile = function () { addFileCalls++; };

            FileTypesManager.install(loader);
            loader.aseprite([
                { key: 'hero', textureURL: 'hero.png', atlasURL: 'hero.json' },
                { key: 'villain', textureURL: 'villain.png', atlasURL: 'villain.json' }
            ]);

            expect(addFileCalls).toBe(2);
        });

        it('should return the loader instance (this) for chaining', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            FileTypesManager.install(loader);
            var result = loader.aseprite('hero', 'hero.png', 'hero.json');

            expect(result).toBe(loader);
        });
    });
});
