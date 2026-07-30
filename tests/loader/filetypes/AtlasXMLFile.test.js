var AtlasXMLFile = require('../../../src/loader/filetypes/AtlasXMLFile');
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
            addAtlasXML: function () {}
        },
        cacheManager: {
            json: {}
        }
    };
}

describe('AtlasXMLFile', function ()
{
    describe('constructor', function ()
    {
        it('should be importable', function ()
        {
            expect(AtlasXMLFile).toBeDefined();
        });

        it('should create an instance with string key arguments', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file).toBeDefined();
            expect(file.key).toBe('atlas');
            expect(file.type).toBe('atlasxml');
        });

        it('should set files array with image and xml entries', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(Array.isArray(file.files)).toBe(true);
            expect(file.files.length).toBe(2);
        });

        it('should set image file as files[0] with type image', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.files[0].type).toBe('image');
        });

        it('should set xml file as files[1] with type xml', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.files[1].type).toBe('xml');
        });

        it('should start with complete set to false', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.complete).toBe(false);
        });

        it('should start with pending equal to number of files', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.pending).toBe(2);
        });

        it('should store reference to the loader', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.loader).toBe(loader);
        });

        it('should set multiFile reference on each child file', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.files[0].multiFile).toBe(file);
            expect(file.files[1].multiFile).toBe(file);
        });

        it('should apply loader prefix to key when prefix is set', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'GAME.';
            var file = new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(file.key).toBe('GAME.atlas');
        });

        it('should increment loader multiKeyIndex', function ()
        {
            var loader = createMockLoader();
            expect(loader.multiKeyIndex).toBe(0);

            new AtlasXMLFile(loader, 'atlas', 'atlas.png', 'atlas.xml');

            expect(loader.multiKeyIndex).toBe(1);
        });

        it('should accept a plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, {
                key: 'mainmenu',
                textureURL: 'images/MainMenu.png',
                atlasURL: 'images/MainMenu.xml'
            });

            expect(file.key).toBe('mainmenu');
            expect(file.type).toBe('atlasxml');
        });

        it('should create two child files from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, {
                key: 'mainmenu',
                textureURL: 'images/MainMenu.png',
                atlasURL: 'images/MainMenu.xml'
            });

            expect(file.files.length).toBe(2);
        });

        it('should use png extension for texture from plain object config by default', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, {
                key: 'mainmenu',
                textureURL: 'images/MainMenu.png',
                atlasURL: 'images/MainMenu.xml'
            });

            expect(file.files[0].url).toContain('MainMenu.png');
        });

        it('should use xml extension for atlas from plain object config by default', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, {
                key: 'mainmenu',
                textureURL: 'images/MainMenu.png',
                atlasURL: 'images/MainMenu.xml'
            });

            expect(file.files[1].url).toContain('MainMenu.xml');
        });

        it('should use custom textureExtension from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, {
                key: 'mainmenu',
                textureURL: 'images/MainMenu.jpg',
                textureExtension: 'jpg',
                atlasURL: 'images/MainMenu.xml'
            });

            expect(file.files[0].url).toContain('MainMenu.jpg');
        });

        it('should use custom atlasExtension from plain object config', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, {
                key: 'mainmenu',
                textureURL: 'images/MainMenu.png',
                atlasURL: 'images/MainMenu.xml',
                atlasExtension: 'xml'
            });

            expect(file.files[1].url).toContain('MainMenu.xml');
        });

        it('should store null texture url when textureURL is not provided', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'alien', null, 'alien.xml');

            expect(file.files[0].url).toBeNull();
        });

        it('should store null atlas url when atlasURL is not provided', function ()
        {
            var loader = createMockLoader();
            var file = new AtlasXMLFile(loader, 'alien', 'alien.png', null);

            expect(file.files[1].url).toBeNull();
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

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(mockFile.complete).toBe(false);
        });

        it('should not call addAtlasXML when isReadyToProcess returns false', function ()
        {
            var addAtlasXMLCalled = false;

            var mockFile = {
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { key: 'atlas', data: {} }
                ],
                isReadyToProcess: function () { return false; },
                loader: {
                    textureManager: {
                        addAtlasXML: function () { addAtlasXMLCalled = true; }
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(addAtlasXMLCalled).toBe(false);
        });

        it('should call textureManager.addAtlasXML with correct arguments when ready', function ()
        {
            var capturedArgs = null;
            var imageData = { width: 100, height: 100 };
            var xmlData = { documentElement: {} };

            var mockFile = {
                files: [
                    { key: 'atlas', data: imageData },
                    { key: 'atlas', data: xmlData }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlasXML: function (key, img, xml, normalMap)
                        {
                            capturedArgs = { key: key, img: img, xml: xml, normalMap: normalMap };
                        }
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(capturedArgs).not.toBeNull();
            expect(capturedArgs.key).toBe('atlas');
            expect(capturedArgs.img).toBe(imageData);
            expect(capturedArgs.xml).toBe(xmlData);
        });

        it('should pass null as normalMap when files[2] does not exist', function ()
        {
            var capturedNormalMap = 'unset';

            var mockFile = {
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { key: 'atlas', data: {} }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlasXML: function (key, img, xml, normalMap)
                        {
                            capturedNormalMap = normalMap;
                        }
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(capturedNormalMap).toBeNull();
        });

        it('should pass normalMap data from files[2].data when files[2] exists', function ()
        {
            var capturedNormalMap = null;
            var normalMapData = { width: 100, height: 100 };

            var mockFile = {
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { key: 'atlas', data: {} },
                    { data: normalMapData }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlasXML: function (key, img, xml, normalMap)
                        {
                            capturedNormalMap = normalMap;
                        }
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(capturedNormalMap).toBe(normalMapData);
        });

        it('should set complete to true after successful cache', function ()
        {
            var mockFile = {
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { key: 'atlas', data: {} }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlasXML: function () {}
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(mockFile.complete).toBe(true);
        });

        it('should not call addAtlasXML a second time if already complete', function ()
        {
            var addAtlasXMLCallCount = 0;

            var mockFile = {
                files: [
                    { key: 'atlas', data: 'imgData' },
                    { key: 'atlas', data: {} }
                ],
                isReadyToProcess: function () { return !this.complete; },
                loader: {
                    textureManager: {
                        addAtlasXML: function () { addAtlasXMLCallCount++; }
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);
            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(addAtlasXMLCallCount).toBe(1);
        });

        it('should use image key (files[0].key) not xml key for the atlas registration', function ()
        {
            var capturedKey = null;

            var mockFile = {
                files: [
                    { key: 'imageKey', data: 'imgData' },
                    { key: 'xmlKey', data: {} }
                ],
                isReadyToProcess: function () { return true; },
                loader: {
                    textureManager: {
                        addAtlasXML: function (key)
                        {
                            capturedKey = key;
                        }
                    }
                },
                complete: false
            };

            AtlasXMLFile.prototype.addToCache.call(mockFile);

            expect(capturedKey).toBe('imageKey');
        });
    });

    describe('atlasXML FileTypesManager registration', function ()
    {
        it('should register the atlasXML method on a loader via FileTypesManager.install', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            FileTypesManager.install(loader);

            expect(typeof loader.atlasXML).toBe('function');
        });

        it('should call addFile when atlasXML is invoked with a string key', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (files) { addedFiles = addedFiles.concat(files); };

            FileTypesManager.install(loader);
            loader.atlasXML('atlas', 'atlas.png', 'atlas.xml');

            expect(addedFiles.length).toBeGreaterThan(0);
        });

        it('should call addFile for each entry when key is an array', function ()
        {
            var loader = createMockLoader();
            var addFileCalls = 0;
            loader.addFile = function () { addFileCalls++; };

            FileTypesManager.install(loader);
            loader.atlasXML([
                { key: 'atlas1', textureURL: 'atlas1.png', atlasURL: 'atlas1.xml' },
                { key: 'atlas2', textureURL: 'atlas2.png', atlasURL: 'atlas2.xml' }
            ]);

            expect(addFileCalls).toBe(2);
        });

        it('should return the loader instance for chaining', function ()
        {
            var loader = createMockLoader();
            loader.addFile = function () {};

            FileTypesManager.install(loader);
            var result = loader.atlasXML('atlas', 'atlas.png', 'atlas.xml');

            expect(result).toBe(loader);
        });

        it('should add two files (image and xml) for a single key', function ()
        {
            var loader = createMockLoader();
            var addedFiles = [];
            loader.addFile = function (files) { addedFiles = addedFiles.concat(files); };

            FileTypesManager.install(loader);
            loader.atlasXML('atlas', 'atlas.png', 'atlas.xml');

            expect(addedFiles.length).toBe(2);
        });
    });
});
