var BinaryFile = require('../../../src/loader/filetypes/BinaryFile');
var CONST = require('../../../src/loader/const');

function createMockLoader ()
{
    return {
        prefix: '',
        path: '',
        cacheManager: {
            binary: {}
        }
    };
}

describe('BinaryFile', function ()
{
    describe('Constructor with string key', function ()
    {
        it('should set the file type to binary', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.type).toBe('binary');
        });

        it('should set the key', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.key).toBe('myBinary');
        });

        it('should default extension to bin', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            // url is prepended with loader.path (empty string), so it equals the given url
            expect(file.url).toBe('files/data.bin');
        });

        it('should set the cache to loader.cacheManager.binary', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.cache).toBe(loader.cacheManager.binary);
        });

        it('should set responseType to arraybuffer via xhrSettings', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.xhrSettings.responseType).toBe('arraybuffer');
        });

        it('should store dataType in config when provided', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin', undefined, Uint8Array);

            expect(file.config.dataType).toBe(Uint8Array);
        });

        it('should store undefined dataType in config when not provided', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.config.dataType).toBeUndefined();
        });

        it('should auto-generate url from key when url is undefined', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary');

            expect(file.url).toBe('myBinary.bin');
        });

        it('should prepend loader.path to relative url', function ()
        {
            var loader = createMockLoader();
            loader.path = 'assets/';
            var file = new BinaryFile(loader, 'myBinary', 'data.bin');

            expect(file.url).toBe('assets/data.bin');
        });

        it('should apply loader prefix to key', function ()
        {
            var loader = createMockLoader();
            loader.prefix = 'LEVEL1.';
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.key).toBe('LEVEL1.myBinary');
        });

        it('should start in FILE_PENDING state', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            expect(file.state).toBe(CONST.FILE_PENDING);
        });
    });

    describe('Constructor with config object', function ()
    {
        it('should accept a plain object as the key argument', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, { key: 'myBinary', url: 'files/data.bin' });

            expect(file.key).toBe('myBinary');
        });

        it('should read url from config object', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, { key: 'myBinary', url: 'files/data.bin' });

            expect(file.url).toBe('files/data.bin');
        });

        it('should read dataType from config object', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, { key: 'myBinary', url: 'files/data.bin', dataType: Uint16Array });

            expect(file.config.dataType).toBe(Uint16Array);
        });

        it('should read custom extension from config object', function ()
        {
            var loader = createMockLoader();
            // Provide a url so the auto-generated url isn't used
            var file = new BinaryFile(loader, { key: 'myBinary', url: 'files/data.wad', extension: 'wad' });

            expect(file.url).toBe('files/data.wad');
        });

        it('should use default bin extension when not specified in config', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, { key: 'myBinary' });

            // auto-url should be key + .bin
            expect(file.url).toBe('myBinary.bin');
        });

        it('should set file type to binary from config object', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, { key: 'myBinary', url: 'files/data.bin' });

            expect(file.type).toBe('binary');
        });
    });

    describe('onProcess', function ()
    {
        it('should set state to FILE_PROCESSING', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: new ArrayBuffer(8) };

            file.onProcess();

            expect(file.state).toBe(CONST.FILE_PROCESSING);
        });

        it('should store raw ArrayBuffer as data when no dataType is set', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');
            var buffer = new ArrayBuffer(16);

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: buffer };

            file.onProcess();

            expect(file.data).toBe(buffer);
        });

        it('should wrap response in dataType constructor when dataType is set', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin', undefined, Uint8Array);
            var buffer = new ArrayBuffer(8);

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: buffer };

            file.onProcess();

            expect(file.data).toBeInstanceOf(Uint8Array);
        });

        it('should wrap response using the correct typed array length', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin', undefined, Uint8Array);
            var buffer = new ArrayBuffer(4);

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: buffer };

            file.onProcess();

            expect(file.data.length).toBe(4);
        });

        it('should wrap response in Uint16Array when that dataType is set', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin', undefined, Uint16Array);
            var buffer = new ArrayBuffer(8);

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: buffer };

            file.onProcess();

            expect(file.data).toBeInstanceOf(Uint16Array);
            expect(file.data.length).toBe(4); // 8 bytes / 2 bytes per Uint16
        });

        it('should call onProcessComplete after processing', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');
            var spy = vi.fn();

            file.onProcessComplete = spy;
            file.xhrLoader = { response: new ArrayBuffer(8) };

            file.onProcess();

            expect(spy).toHaveBeenCalledOnce();
        });

        it('should handle empty ArrayBuffer', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin');
            var buffer = new ArrayBuffer(0);

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: buffer };

            file.onProcess();

            expect(file.data).toBe(buffer);
        });

        it('should handle empty ArrayBuffer with Uint8Array dataType', function ()
        {
            var loader = createMockLoader();
            var file = new BinaryFile(loader, 'myBinary', 'files/data.bin', undefined, Uint8Array);
            var buffer = new ArrayBuffer(0);

            file.onProcessComplete = vi.fn();
            file.xhrLoader = { response: buffer };

            file.onProcess();

            expect(file.data).toBeInstanceOf(Uint8Array);
            expect(file.data.length).toBe(0);
        });
    });
});
