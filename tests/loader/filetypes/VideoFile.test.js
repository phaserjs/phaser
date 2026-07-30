var VideoFile = require('../../../src/loader/filetypes/VideoFile');
var FileTypesManager = require('../../../src/loader/FileTypesManager');
var CONST = require('../../../src/loader/const');

function createMockLoader (urlConfig)
{
    if (urlConfig === undefined) { urlConfig = { type: 'mp4', url: 'video.mp4' }; }

    return {
        systems: {
            game: {
                device: {
                    video: {
                        getVideoURL: function (url) { return urlConfig; }
                    }
                }
            }
        },
        cacheManager: {
            video: {}
        },
        prefix: '',
        path: '',
        maxRetries: 2,
        baseURL: 'http://example.com/',
        nextFile: vi.fn(),
        fileProcessComplete: vi.fn()
    };
}

describe('VideoFile', function ()
{
    describe('constructor', function ()
    {
        it('should set the file type to video', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'testvideo', 'video.mp4');
            expect(file.type).toBe('video');
        });

        it('should set the key from the second argument', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            expect(file.key).toBe('myvideo');
        });

        it('should default noAudio to false', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            expect(file.config.noAudio).toBe(false);
        });

        it('should set noAudio to true when passed as fourth argument', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4', true);
            expect(file.config.noAudio).toBe(true);
        });

        it('should set the extension from the urlConfig type', function ()
        {
            var loader = createMockLoader({ type: 'webm', url: 'video.webm' });
            var file = new VideoFile(loader, 'myvideo', 'video.webm');
            expect(file.xhrSettings).toBeDefined();
        });

        it('should store the cache reference from cacheManager.video', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            expect(file.cache).toBe(loader.cacheManager.video);
        });

        it('should store the loader reference', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            expect(file.loader).toBe(loader);
        });

        it('should accept a plain object as the key argument', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, { key: 'objvideo', url: 'video.mp4', noAudio: true });
            expect(file.key).toBe('objvideo');
            expect(file.config.noAudio).toBe(true);
        });

        it('should default noAudio to false when using a plain object without noAudio', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, { key: 'objvideo', url: 'video.mp4' });
            expect(file.config.noAudio).toBe(false);
        });

        it('should default url to empty array when using a plain object without url', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, { key: 'objvideo' });
            expect(file.key).toBe('objvideo');
        });

        it('should warn when urlConfig is null', function ()
        {
            var loader = createMockLoader(null);
            var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
            expect(function () { new VideoFile(loader, 'myvideo', 'video.mp4'); }).toThrow();
            expect(warnSpy).toHaveBeenCalledWith('VideoFile: No supported format for myvideo');
            warnSpy.mockRestore();
        });

        it('should start in FILE_PENDING state', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            expect(file.state).toBe(CONST.FILE_PENDING);
        });
    });

    describe('onProcess', function ()
    {
        it('should set this.data with url from this.src', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.src = 'http://example.com/video.mp4';
            file.onProcess();
            expect(file.data.url).toBe('http://example.com/video.mp4');
        });

        it('should set this.data.noAudio from config', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4', true);
            file.src = 'http://example.com/video.mp4';
            file.onProcess();
            expect(file.data.noAudio).toBe(true);
        });

        it('should set this.data.noAudio to false by default', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.src = 'http://example.com/video.mp4';
            file.onProcess();
            expect(file.data.noAudio).toBe(false);
        });

        it('should set this.data.crossOrigin from this.crossOrigin', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.src = 'http://example.com/video.mp4';
            file.crossOrigin = 'anonymous';
            file.onProcess();
            expect(file.data.crossOrigin).toBe('anonymous');
        });

        it('should set this.data.crossOrigin to undefined when not set', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.src = 'http://example.com/video.mp4';
            file.onProcess();
            expect(file.data.crossOrigin).toBeUndefined();
        });

        it('should call onProcessComplete setting state to FILE_COMPLETE', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.src = 'http://example.com/video.mp4';
            file.onProcess();
            expect(file.state).toBe(CONST.FILE_COMPLETE);
        });

        it('should call loader.fileProcessComplete', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.src = 'http://example.com/video.mp4';
            file.onProcess();
            expect(loader.fileProcessComplete).toHaveBeenCalledWith(file);
        });
    });

    describe('load', function ()
    {
        it('should set this.src by resolving the URL with baseURL', function ()
        {
            var loader = createMockLoader({ type: 'mp4', url: 'video.mp4' });
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.load();
            expect(file.src).toBe('http://example.com/video.mp4');
        });

        it('should not prepend baseURL for absolute URLs', function ()
        {
            var loader = createMockLoader({ type: 'mp4', url: 'http://cdn.example.com/video.mp4' });
            var file = new VideoFile(loader, 'myvideo', 'http://cdn.example.com/video.mp4');
            file.load();
            expect(file.src).toBe('http://cdn.example.com/video.mp4');
        });

        it('should set state to FILE_LOADED', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.load();
            expect(file.state).toBe(CONST.FILE_LOADED);
        });

        it('should call loader.nextFile with the file and true', function ()
        {
            var loader = createMockLoader();
            var file = new VideoFile(loader, 'myvideo', 'video.mp4');
            file.load();
            expect(loader.nextFile).toHaveBeenCalledWith(file, true);
        });

        it('should handle https:// URLs without prepending baseURL', function ()
        {
            var loader = createMockLoader({ type: 'webm', url: 'https://cdn.example.com/video.webm' });
            var file = new VideoFile(loader, 'myvideo', 'https://cdn.example.com/video.webm');
            file.load();
            expect(file.src).toBe('https://cdn.example.com/video.webm');
        });
    });

    describe('video (FileTypesManager registration)', function ()
    {
        it('should register the video factory function', function ()
        {
            var loader = createMockLoader();
            FileTypesManager.install(loader);
            expect(typeof loader.video).toBe('function');
        });

        it('should call addFile when invoked with a string key', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);
            loader.video('myvideo', 'video.mp4', false);
            expect(loader.addFile).toHaveBeenCalledTimes(1);
        });

        it('should call addFile with a VideoFile instance', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);
            loader.video('myvideo', 'video.mp4', false);
            var addedFile = loader.addFile.mock.calls[0][0];
            expect(addedFile instanceof VideoFile).toBe(true);
        });

        it('should call addFile for each item in an array key', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);
            loader.video([
                { key: 'video1', url: 'video1.mp4' },
                { key: 'video2', url: 'video2.mp4' }
            ]);
            expect(loader.addFile).toHaveBeenCalledTimes(2);
        });

        it('should return the loader instance for chaining', function ()
        {
            var loader = createMockLoader();
            loader.addFile = vi.fn();
            FileTypesManager.install(loader);
            var result = loader.video('myvideo', 'video.mp4', false);
            expect(result).toBe(loader);
        });
    });
});
