var SoundManagerCreator = require('../../src/sound/SoundManagerCreator');
var HTML5AudioSoundManager = require('../../src/sound/html5/HTML5AudioSoundManager');
var NoAudioSoundManager = require('../../src/sound/noaudio/NoAudioSoundManager');
var WebAudioSoundManager = require('../../src/sound/webaudio/WebAudioSoundManager');

describe('SoundManagerCreator', function ()
{
    var mockGame;
    var mockAudioContext;

    function makeGainNode ()
    {
        return {
            gain: { value: 1, setValueAtTime: vi.fn() },
            connect: vi.fn()
        };
    }

    beforeEach(function ()
    {
        // Provide a minimal window for HTML5AudioSoundManager ('ontouchstart' in window)
        vi.stubGlobal('window', {});

        // Mock AudioContext passed via game.config.audio.context so WebAudioSoundManager
        // never tries to access window.AudioContext or window.webkitAudioContext
        mockAudioContext = {
            state: 'running',
            resume: vi.fn(),
            createGain: vi.fn(makeGainNode),
            destination: {}
        };

        mockGame = {
            config: {
                audio: {
                    noAudio: false,
                    disableWebAudio: false,
                    context: mockAudioContext
                }
            },
            device: {
                audio: {
                    webAudio: true,
                    audioData: true
                }
            },
            cache: {
                json: {}
            },
            events: {
                on: vi.fn(),
                once: vi.fn()
            },
            isBooted: true
        };
    });

    afterEach(function ()
    {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    describe('create', function ()
    {
        // -----------------------------------------------------------------
        //  NoAudioSoundManager
        // -----------------------------------------------------------------

        it('should return a NoAudioSoundManager when noAudio config flag is true', function ()
        {
            mockGame.config.audio.noAudio = true;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(NoAudioSoundManager);
        });

        it('should return a NoAudioSoundManager when neither webAudio nor audioData is supported', function ()
        {
            mockGame.config.audio.noAudio = false;
            mockGame.device.audio.webAudio = false;
            mockGame.device.audio.audioData = false;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(NoAudioSoundManager);
        });

        it('should return a NoAudioSoundManager when noAudio is true even if webAudio is available', function ()
        {
            mockGame.config.audio.noAudio = true;
            mockGame.device.audio.webAudio = true;
            mockGame.device.audio.audioData = true;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(NoAudioSoundManager);
        });

        it('should return a NoAudioSoundManager when noAudio is true and no audio support exists', function ()
        {
            mockGame.config.audio.noAudio = true;
            mockGame.device.audio.webAudio = false;
            mockGame.device.audio.audioData = false;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(NoAudioSoundManager);
        });

        it('should pass the game reference to NoAudioSoundManager', function ()
        {
            mockGame.config.audio.noAudio = true;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager.game).toBe(mockGame);
        });

        // -----------------------------------------------------------------
        //  WebAudioSoundManager
        // -----------------------------------------------------------------

        it('should return a WebAudioSoundManager when webAudio is supported and not disabled', function ()
        {
            mockGame.config.audio.noAudio = false;
            mockGame.config.audio.disableWebAudio = false;
            mockGame.device.audio.webAudio = true;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(WebAudioSoundManager);
        });

        it('should return a WebAudioSoundManager when webAudio is supported and disableWebAudio is not set', function ()
        {
            mockGame.config.audio.noAudio = false;
            delete mockGame.config.audio.disableWebAudio;
            mockGame.device.audio.webAudio = true;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(WebAudioSoundManager);
        });

        it('should pass the game reference to WebAudioSoundManager', function ()
        {
            mockGame.config.audio.noAudio = false;
            mockGame.config.audio.disableWebAudio = false;
            mockGame.device.audio.webAudio = true;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager.game).toBe(mockGame);
        });

        // -----------------------------------------------------------------
        //  HTML5AudioSoundManager
        // -----------------------------------------------------------------

        it('should return an HTML5AudioSoundManager when webAudio is supported but disabled via config', function ()
        {
            mockGame.config.audio.noAudio = false;
            mockGame.config.audio.disableWebAudio = true;
            mockGame.device.audio.webAudio = true;
            mockGame.device.audio.audioData = true;
            // Remove pre-supplied context so HTML5 path is taken
            delete mockGame.config.audio.context;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(HTML5AudioSoundManager);
        });

        it('should return an HTML5AudioSoundManager when only audioData is available and webAudio is absent', function ()
        {
            mockGame.config.audio.noAudio = false;
            mockGame.config.audio.disableWebAudio = false;
            mockGame.device.audio.webAudio = false;
            mockGame.device.audio.audioData = true;
            delete mockGame.config.audio.context;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager).toBeInstanceOf(HTML5AudioSoundManager);
        });

        it('should pass the game reference to HTML5AudioSoundManager', function ()
        {
            mockGame.config.audio.noAudio = false;
            mockGame.config.audio.disableWebAudio = true;
            mockGame.device.audio.webAudio = true;
            mockGame.device.audio.audioData = true;
            delete mockGame.config.audio.context;

            var manager = SoundManagerCreator.create(mockGame);

            expect(manager.game).toBe(mockGame);
        });
    });
});
