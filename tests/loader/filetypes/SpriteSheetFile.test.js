var SpriteSheetFile = require('../../../src/loader/filetypes/SpriteSheetFile');
var CONST = require('../../../src/loader/const');

describe('SpriteSheetFile', function ()
{
    function makeMockLoader ()
    {
        return {
            prefix: '',
            path: '',
            baseURL: '',
            textureManager: {}
        };
    }

    describe('constructor', function ()
    {
        it('should set type to spritesheet', function ()
        {
            var loader = makeMockLoader();
            var file = new SpriteSheetFile(loader, 'player', 'player.png');

            expect(file.type).toBe('spritesheet');
        });

        it('should set the key from a string argument', function ()
        {
            var loader = makeMockLoader();
            var file = new SpriteSheetFile(loader, 'player', 'player.png');

            expect(file.key).toBe('player');
        });

        it('should set the url from argument', function ()
        {
            var loader = makeMockLoader();
            var file = new SpriteSheetFile(loader, 'player', 'player.png');

            expect(file.url).toBe('player.png');
        });

        it('should default the url to key.png when url is not given', function ()
        {
            var loader = makeMockLoader();
            var file = new SpriteSheetFile(loader, 'enemy');

            expect(file.url).toBe('enemy.png');
        });

        it('should store frameConfig in config', function ()
        {
            var loader = makeMockLoader();
            var frameConfig = { frameWidth: 32, frameHeight: 48 };
            var file = new SpriteSheetFile(loader, 'tiles', 'tiles.png', frameConfig);

            expect(file.config).toEqual(frameConfig);
        });

        it('should accept a config object as the key argument', function ()
        {
            var loader = makeMockLoader();
            var file = new SpriteSheetFile(loader, {
                key: 'atlas',
                url: 'atlas.png',
                frameConfig: { frameWidth: 64, frameHeight: 64 }
            });

            expect(file.key).toBe('atlas');
            expect(file.type).toBe('spritesheet');
        });

        it('should prepend loader.prefix to key when prefix is set', function ()
        {
            var loader = makeMockLoader();
            loader.prefix = 'GAME.';
            var file = new SpriteSheetFile(loader, 'player', 'player.png');

            expect(file.key).toBe('GAME.player');
        });

        it('should set cache to loader.textureManager', function ()
        {
            var loader = makeMockLoader();
            var file = new SpriteSheetFile(loader, 'player', 'player.png');

            expect(file.cache).toBe(loader.textureManager);
        });
    });

    describe('addToCache', function ()
    {
        function makeMockFile (overrides)
        {
            var base = {
                key: 'player',
                type: 'spritesheet',
                data: { width: 128, height: 64 },
                config: { frameWidth: 32, frameHeight: 32 },
                linkFile: null,
                cache: {
                    addSpriteSheet: vi.fn()
                }
            };

            if (overrides)
            {
                for (var k in overrides)
                {
                    base[k] = overrides[k];
                }
            }

            return base;
        }

        it('should call cache.addSpriteSheet with key, data and config when no linkFile', function ()
        {
            var mockFile = makeMockFile();

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledOnce();
            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledWith(
                mockFile.key,
                mockFile.data,
                mockFile.config
            );
        });

        it('should not include a normalMap argument when no linkFile', function ()
        {
            var mockFile = makeMockFile();

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            var args = mockFile.cache.addSpriteSheet.mock.calls[0];
            expect(args.length).toBe(3);
        });

        it('should not call cache.addSpriteSheet when linkFile exists but has not completed', function ()
        {
            var mockFile = makeMockFile({
                linkFile: { state: CONST.FILE_LOADING, data: {} }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).not.toHaveBeenCalled();
        });

        it('should not call cache.addSpriteSheet when linkFile state is below FILE_COMPLETE', function ()
        {
            var mockFile = makeMockFile({
                linkFile: { state: CONST.FILE_COMPLETE - 1, data: {} }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).not.toHaveBeenCalled();
        });

        it('should call addSpriteSheet with normalMap when linkFile is complete and type is spritesheet', function ()
        {
            var normalMapData = { normalMap: true };
            var mockFile = makeMockFile({
                type: 'spritesheet',
                linkFile: { state: CONST.FILE_COMPLETE, data: normalMapData }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledOnce();
            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledWith(
                mockFile.key,
                mockFile.data,
                mockFile.config,
                normalMapData
            );
        });

        it('should pass this.data as image and linkFile.data as normalMap when not normalMap type', function ()
        {
            var imageData = { image: true };
            var normalMapData = { normalMap: true };
            var mockFile = makeMockFile({
                type: 'spritesheet',
                data: imageData,
                linkFile: { state: CONST.FILE_COMPLETE, data: normalMapData }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            var args = mockFile.cache.addSpriteSheet.mock.calls[0];
            expect(args[1]).toBe(imageData);
            expect(args[3]).toBe(normalMapData);
        });

        it('should pass linkFile.data as image and this.data as normalMap when type is normalMap', function ()
        {
            var imageData = { image: true };
            var normalMapData = { normalMap: true };
            var mockFile = makeMockFile({
                type: 'normalMap',
                data: normalMapData,
                linkFile: { state: CONST.FILE_COMPLETE, data: imageData }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledOnce();
            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledWith(
                mockFile.key,
                imageData,
                mockFile.config,
                normalMapData
            );
        });

        it('should call addSpriteSheet when linkFile state equals FILE_COMPLETE exactly', function ()
        {
            var mockFile = makeMockFile({
                linkFile: { state: CONST.FILE_COMPLETE, data: {} }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledOnce();
        });

        it('should call addSpriteSheet when linkFile state is greater than FILE_COMPLETE', function ()
        {
            var mockFile = makeMockFile({
                linkFile: { state: CONST.FILE_COMPLETE + 1, data: {} }
            });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet).toHaveBeenCalledOnce();
        });

        it('should pass the correct key to addSpriteSheet', function ()
        {
            var mockFile = makeMockFile({ key: 'mySheet' });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet.mock.calls[0][0]).toBe('mySheet');
        });

        it('should pass the correct config to addSpriteSheet', function ()
        {
            var frameConfig = { frameWidth: 16, frameHeight: 16 };
            var mockFile = makeMockFile({ config: frameConfig });

            SpriteSheetFile.prototype.addToCache.call(mockFile);

            expect(mockFile.cache.addSpriteSheet.mock.calls[0][2]).toBe(frameConfig);
        });
    });
});
