var BitmapFontFile = require('../../../src/loader/filetypes/BitmapFontFile');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        baseURL: '',
        multiKeyIndex: 0,
        imageLoadType: 'XHR',
        textureManager: {},
        cacheManager: {
            xml: {},
            bitmapFont: {
                add: vi.fn()
            }
        },
        addFile: vi.fn()
    };
}

function createMockFrame ()
{
    return {
        cutX: 0,
        cutY: 0,
        source: { width: 256, height: 256 },
        sourceIndex: 0,
        trimmed: false,
        data: { cut: { x: 0, y: 0 } }
    };
}

function createMockXml ()
{
    return {
        getElementsByTagName: function (tag)
        {
            if (tag === 'info')
            {
                return [ {
                    getAttribute: function (attr)
                    {
                        if (attr === 'face') { return 'testFont'; }
                        if (attr === 'size') { return '16'; }
                        return '0';
                    }
                } ];
            }
            if (tag === 'common')
            {
                return [ {
                    getAttribute: function (attr)
                    {
                        if (attr === 'lineHeight') { return '20'; }
                        return '0';
                    }
                } ];
            }
            return [];
        }
    };
}

describe('BitmapFontFile', function ()
{
    describe('constructor (string key)', function ()
    {
        it('should create a BitmapFontFile with the correct type', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.type).toBe('bitmapfont');
        });

        it('should set the key from a string argument', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.key).toBe('testFont');
        });

        it('should contain two child files (image and xml)', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.files.length).toBe(2);
        });

        it('should set image file as the first child', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.files[0].type).toBe('image');
        });

        it('should set xml file as the second child', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.files[1].type).toBe('xml');
        });

        it('should start with complete set to false', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.complete).toBe(false);
        });

        it('should set pending count to match the number of child files', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.pending).toBe(2);
        });

        it('should set failed to zero initially', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.failed).toBe(0);
        });

        it('should link each child file back to this MultiFile', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.files[0].multiFile).toBe(file);
            expect(file.files[1].multiFile).toBe(file);
        });

        it('should apply loader prefix to the key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'UI.';
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            expect(file.key).toBe('UI.testFont');
        });

        it('should default image url to key.png when textureURL is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'alien');

            expect(file.files[0].url).toBe('alien.png');
        });

        it('should default xml url to key.xml when fontDataURL is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'alien');

            expect(file.files[1].url).toBe('alien.xml');
        });
    });

    describe('constructor (config object)', function ()
    {
        it('should create a BitmapFontFile from a config object', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'testFont',
                textureURL: 'font.png',
                fontDataURL: 'font.xml'
            });

            expect(file.type).toBe('bitmapfont');
            expect(file.key).toBe('testFont');
        });

        it('should contain two child files from a config object', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'testFont',
                textureURL: 'font.png',
                fontDataURL: 'font.xml'
            });

            expect(file.files.length).toBe(2);
        });

        it('should set image url from config textureURL', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'testFont',
                textureURL: 'images/font.png',
                fontDataURL: 'data/font.xml'
            });

            expect(file.files[0].url).toBe('images/font.png');
        });

        it('should set xml url from config fontDataURL', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'testFont',
                textureURL: 'images/font.png',
                fontDataURL: 'data/font.xml'
            });

            expect(file.files[1].url).toBe('data/font.xml');
        });

        it('should default image url to key.png when textureURL is omitted from config', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'myFont'
            });

            expect(file.files[0].url).toBe('myFont.png');
        });

        it('should default xml url to key.xml when fontDataURL is omitted from config', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'myFont'
            });

            expect(file.files[1].url).toBe('myFont.xml');
        });

        it('should use custom textureExtension from config', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'myFont',
                textureExtension: 'jpg'
            });

            expect(file.files[0].url).toBe('myFont.jpg');
        });

        it('should use custom fontDataExtension from config', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'myFont',
                fontDataExtension: 'fnt'
            });

            expect(file.files[1].url).toBe('myFont.fnt');
        });
    });

    describe('constructor (normal map)', function ()
    {
        it('should contain three child files when a normal map URL array is provided', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', [ 'font.png', 'font-n.png' ], 'font.xml');

            expect(file.files.length).toBe(3);
        });

        it('should set pending count to 3 when a normal map is included', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', [ 'font.png', 'font-n.png' ], 'font.xml');

            expect(file.pending).toBe(3);
        });

        it('should set the third child type to normalMap', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', [ 'font.png', 'font-n.png' ], 'font.xml');

            expect(file.files[2].type).toBe('normalMap');
        });

        it('should contain three child files when normalMap is set in config', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, {
                key: 'testFont',
                textureURL: 'font.png',
                normalMap: 'font-n.png',
                fontDataURL: 'font.xml'
            });

            expect(file.files.length).toBe(3);
        });
    });

    describe('addToCache', function ()
    {
        it('should not set complete when isReadyToProcess returns false', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            // pending is 2 by default, so isReadyToProcess() returns false
            file.addToCache();

            expect(file.complete).toBe(false);
        });

        it('should not call cacheManager.bitmapFont.add when not ready to process', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            file.addToCache();

            expect(loader.cacheManager.bitmapFont.add).not.toHaveBeenCalled();
        });

        it('should not process if failed count is greater than zero', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            file.pending = 0;
            file.failed = 1;

            file.addToCache();

            expect(loader.cacheManager.bitmapFont.add).not.toHaveBeenCalled();
        });

        it('should set complete to true when all files are ready', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            var mockCache = {
                get: vi.fn().mockReturnValue({}),
                getFrame: vi.fn().mockReturnValue(createMockFrame())
            };

            file.files[0].addToCache = vi.fn();
            file.files[0].cache = mockCache;
            file.files[0].key = 'testFont';
            file.files[1].data = createMockXml();

            file.pending = 0;
            file.failed = 0;

            file.addToCache();

            expect(file.complete).toBe(true);
        });

        it('should call cacheManager.bitmapFont.add with the image key', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            var mockCache = {
                get: vi.fn().mockReturnValue({}),
                getFrame: vi.fn().mockReturnValue(createMockFrame())
            };

            file.files[0].addToCache = vi.fn();
            file.files[0].cache = mockCache;
            file.files[0].key = 'testFont';
            file.files[1].data = createMockXml();

            file.pending = 0;
            file.failed = 0;

            file.addToCache();

            expect(loader.cacheManager.bitmapFont.add).toHaveBeenCalledWith(
                'testFont',
                expect.objectContaining({ texture: 'testFont', frame: null })
            );
        });

        it('should call image.addToCache when ready', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            var imageAddToCache = vi.fn();
            var mockCache = {
                get: vi.fn().mockReturnValue({}),
                getFrame: vi.fn().mockReturnValue(createMockFrame())
            };

            file.files[0].addToCache = imageAddToCache;
            file.files[0].cache = mockCache;
            file.files[0].key = 'testFont';
            file.files[1].data = createMockXml();

            file.pending = 0;
            file.failed = 0;

            file.addToCache();

            expect(imageAddToCache).toHaveBeenCalledTimes(1);
        });

        it('should not call addToCache a second time once complete is true', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            var mockCache = {
                get: vi.fn().mockReturnValue({}),
                getFrame: vi.fn().mockReturnValue(createMockFrame())
            };

            file.files[0].addToCache = vi.fn();
            file.files[0].cache = mockCache;
            file.files[0].key = 'testFont';
            file.files[1].data = createMockXml();

            file.pending = 0;
            file.failed = 0;

            file.addToCache();
            file.addToCache();

            expect(loader.cacheManager.bitmapFont.add).toHaveBeenCalledTimes(1);
        });

        it('should store parsed font data in the cache entry', function ()
        {
            var loader = createMockLoader();
            var file = new BitmapFontFile(loader, 'testFont', 'font.png', 'font.xml');

            var mockCache = {
                get: vi.fn().mockReturnValue({}),
                getFrame: vi.fn().mockReturnValue(createMockFrame())
            };

            file.files[0].addToCache = vi.fn();
            file.files[0].cache = mockCache;
            file.files[0].key = 'testFont';
            file.files[1].data = createMockXml();

            file.pending = 0;
            file.failed = 0;

            file.addToCache();

            var callArgs = loader.cacheManager.bitmapFont.add.mock.calls[0];
            var cacheEntry = callArgs[1];

            expect(cacheEntry).toHaveProperty('data');
            expect(cacheEntry.data).toBeTypeOf('object');
        });
    });
});
