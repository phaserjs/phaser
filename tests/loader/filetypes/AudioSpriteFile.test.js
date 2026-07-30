var FileTypesManager = require('../../../src/loader/FileTypesManager');

//  Requiring the module registers the audioSprite function with FileTypesManager
require('../../../src/loader/filetypes/AudioSpriteFile');

function getAudioSpriteMethod ()
{
    var methods = {};
    FileTypesManager.install(methods);
    return methods.audioSprite;
}

function makeMockLoader (overrides)
{
    overrides = overrides || {};

    var defaults = {
        systems: {
            game: {
                config: { audio: null },
                device: { audio: { webAudio: true, audioData: true } }
            }
        },
        addFile: vi.fn()
    };

    if (overrides.systems)
    {
        defaults.systems = overrides.systems;
    }

    if (overrides.addFile)
    {
        defaults.addFile = overrides.addFile;
    }

    return defaults;
}

describe('AudioSpriteFile', function ()
{
    describe('audioSprite (FileTypesManager registration)', function ()
    {
        it('should be importable without errors', function ()
        {
            expect(FileTypesManager).toBeDefined();
        });

        it('should register an audioSprite method with FileTypesManager', function ()
        {
            var audioSprite = getAudioSpriteMethod();
            expect(typeof audioSprite).toBe('function');
        });

        it('should return the loader when noAudio is true in game config', function ()
        {
            var audioSprite = getAudioSpriteMethod();
            var loader = makeMockLoader({
                systems: {
                    game: {
                        config: { audio: { noAudio: true } },
                        device: { audio: { webAudio: true, audioData: true } }
                    }
                }
            });

            var result = audioSprite.call(loader, 'sfx', 'sfx.json');

            expect(result).toBe(loader);
        });

        it('should return the loader when device has no webAudio and no audioData', function ()
        {
            var audioSprite = getAudioSpriteMethod();
            var loader = makeMockLoader({
                systems: {
                    game: {
                        config: { audio: null },
                        device: { audio: { webAudio: false, audioData: false } }
                    }
                }
            });

            var result = audioSprite.call(loader, 'sfx', 'sfx.json');

            expect(result).toBe(loader);
        });

        it('should not call addFile when noAudio is true', function ()
        {
            var audioSprite = getAudioSpriteMethod();
            var addFile = vi.fn();
            var loader = {
                systems: {
                    game: {
                        config: { audio: { noAudio: true } },
                        device: { audio: { webAudio: true, audioData: true } }
                    }
                },
                addFile: addFile
            };

            audioSprite.call(loader, 'sfx', 'sfx.json');

            expect(addFile).not.toHaveBeenCalled();
        });

        it('should not call addFile when device supports neither webAudio nor audioData', function ()
        {
            var audioSprite = getAudioSpriteMethod();
            var addFile = vi.fn();
            var loader = {
                systems: {
                    game: {
                        config: { audio: null },
                        device: { audio: { webAudio: false, audioData: false } }
                    }
                },
                addFile: addFile
            };

            audioSprite.call(loader, 'sfx', 'sfx.json');

            expect(addFile).not.toHaveBeenCalled();
        });

    });
});
