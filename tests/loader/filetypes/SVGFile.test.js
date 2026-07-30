var SVGFile = require('../../../src/loader/filetypes/SVGFile');

describe('SVGFile', function ()
{
    var mockLoader;
    var mockTextureManager;

    beforeEach(function ()
    {
        mockTextureManager = {
            addImage: vi.fn()
        };

        mockLoader = {
            textureManager: mockTextureManager,
            prefix: '',
            path: ''
        };
    });

    describe('constructor with string key', function ()
    {
        it('should set the type to svg', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg');

            expect(file.type).toBe('svg');
        });

        it('should set the cache to the loader textureManager', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg');

            expect(file.cache).toBe(mockTextureManager);
        });

        it('should set the key', function ()
        {
            var file = new SVGFile(mockLoader, 'mysvg', 'mysvg.svg');

            expect(file.key).toBe('mysvg');
        });

        it('should set default config width to undefined when no svgConfig given', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg');

            expect(file.config.width).toBeUndefined();
        });

        it('should set default config height to undefined when no svgConfig given', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg');

            expect(file.config.height).toBeUndefined();
        });

        it('should set default config scale to undefined when no svgConfig given', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg');

            expect(file.config.scale).toBeUndefined();
        });

        it('should store width from svgConfig', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg', { width: 300 });

            expect(file.config.width).toBe(300);
        });

        it('should store height from svgConfig', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg', { height: 600 });

            expect(file.config.height).toBe(600);
        });

        it('should store scale from svgConfig', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg', { scale: 2.5 });

            expect(file.config.scale).toBe(2.5);
        });

        it('should store width and height together from svgConfig', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg', { width: 100, height: 200 });

            expect(file.config.width).toBe(100);
            expect(file.config.height).toBe(200);
        });
    });

    describe('constructor with plain object config', function ()
    {
        it('should read key from config object', function ()
        {
            var file = new SVGFile(mockLoader, { key: 'objKey', url: 'obj.svg' });

            expect(file.key).toBe('objKey');
        });

        it('should read svgConfig width from config object', function ()
        {
            var file = new SVGFile(mockLoader, { key: 'objKey', url: 'obj.svg', svgConfig: { width: 400 } });

            expect(file.config.width).toBe(400);
        });

        it('should read svgConfig height from config object', function ()
        {
            var file = new SVGFile(mockLoader, { key: 'objKey', url: 'obj.svg', svgConfig: { height: 800 } });

            expect(file.config.height).toBe(800);
        });

        it('should read svgConfig scale from config object', function ()
        {
            var file = new SVGFile(mockLoader, { key: 'objKey', url: 'obj.svg', svgConfig: { scale: 1.5 } });

            expect(file.config.scale).toBe(1.5);
        });

        it('should default svgConfig to empty object when not provided', function ()
        {
            var file = new SVGFile(mockLoader, { key: 'objKey', url: 'obj.svg' });

            expect(file.config.width).toBeUndefined();
            expect(file.config.height).toBeUndefined();
            expect(file.config.scale).toBeUndefined();
        });

        it('should use default svg extension when not specified in config', function ()
        {
            var file = new SVGFile(mockLoader, { key: 'objKey', url: 'obj.svg' });

            expect(file.type).toBe('svg');
        });
    });

    describe('addToCache', function ()
    {
        it('should call cache.addImage with the file key and data', function ()
        {
            var file = new SVGFile(mockLoader, 'testKey', 'test.svg');
            var mockImage = { src: 'test.svg' };
            file.data = mockImage;

            file.addToCache();

            expect(mockTextureManager.addImage).toHaveBeenCalledWith('testKey', mockImage);
        });

        it('should call cache.addImage with the correct key when using prefix', function ()
        {
            mockLoader.prefix = 'MENU.';
            var file = new SVGFile(mockLoader, 'background', 'bg.svg');
            var mockImage = {};
            file.data = mockImage;

            file.addToCache();

            expect(mockTextureManager.addImage).toHaveBeenCalledWith('MENU.background', mockImage);
        });
    });
});
