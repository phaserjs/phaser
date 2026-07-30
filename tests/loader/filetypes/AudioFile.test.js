var AudioFile = require('../../../src/loader/filetypes/AudioFile');
var CONST = require('../../../src/loader/const');

describe('AudioFile', function ()
{
    describe('module', function ()
    {
        it('should be importable', function ()
        {
            expect(AudioFile).toBeDefined();
        });

        it('should be a constructor function', function ()
        {
            expect(typeof AudioFile).toBe('function');
        });

        it('should expose onProcess on its prototype', function ()
        {
            expect(typeof AudioFile.prototype.onProcess).toBe('function');
        });

        it('should expose getAudioURL as a static method', function ()
        {
            expect(typeof AudioFile.getAudioURL).toBe('function');
        });

        it('should expose create as a static method', function ()
        {
            expect(typeof AudioFile.create).toBe('function');
        });
    });

    describe('getAudioURL', function ()
    {
        var mockGame;

        beforeEach(function ()
        {
            mockGame = {
                device: {
                    audio: {
                        ogg: true,
                        mp3: false,
                        m4a: false,
                        wav: false,
                        webm: false,
                        aac: false
                    }
                }
            };
        });

        it('should return null when urls array is empty', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, []);

            expect(result).toBeNull();
        });

        it('should return null when no url matches a supported format', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.mp3' ]);

            expect(result).toBeNull();
        });

        it('should return a url config object for a supported format', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.ogg' ]);

            expect(result).not.toBeNull();
            expect(result.url).toBe('audio/music.ogg');
            expect(result.type).toBe('ogg');
        });

        it('should wrap a single string url in an array before processing', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, 'audio/music.ogg');

            expect(result).not.toBeNull();
            expect(result.url).toBe('audio/music.ogg');
        });

        it('should return the first supported url when multiple urls are given', function ()
        {
            mockGame.device.audio.mp3 = true;

            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.ogg', 'audio/music.mp3' ]);

            expect(result.url).toBe('audio/music.ogg');
        });

        it('should skip unsupported formats and return the first supported one', function ()
        {
            mockGame.device.audio.mp3 = true;

            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.wav', 'audio/music.mp3' ]);

            expect(result.url).toBe('audio/music.mp3');
            expect(result.type).toBe('mp3');
        });

        it('should return null when none of multiple urls are supported', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.mp3', 'audio/music.m4a' ]);

            expect(result).toBeNull();
        });

        it('should accept url config objects with a url property', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ { url: 'audio/music.ogg' } ]);

            expect(result).not.toBeNull();
            expect(result.url).toBe('audio/music.ogg');
            expect(result.type).toBe('ogg');
        });

        it('should use the explicit type property on a url config object', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ { url: 'audio/music.ogg', type: 'ogg' } ]);

            expect(result.type).toBe('ogg');
        });

        it('should use an explicit type override when provided in url config', function ()
        {
            mockGame.device.audio.mp3 = true;

            var result = AudioFile.getAudioURL(mockGame, [ { url: 'audio/music-file', type: 'mp3' } ]);

            expect(result).not.toBeNull();
            expect(result.url).toBe('audio/music-file');
            expect(result.type).toBe('mp3');
        });

        it('should handle type checking as case-insensitive', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.OGG' ]);

            expect(result).not.toBeNull();
            expect(result.type).toBe('ogg');
        });

        it('should accept a blob URI regardless of audio support', function ()
        {
            mockGame.device.audio.ogg = false;

            var blobUrl = 'blob:http://example.com/some-uuid';
            var result = AudioFile.getAudioURL(mockGame, [ blobUrl ]);

            expect(result).not.toBeNull();
            expect(result.url).toBe(blobUrl);
            expect(result.type).toBe('');
        });

        it('should accept a data URI regardless of audio support', function ()
        {
            mockGame.device.audio.ogg = false;

            var dataUrl = 'data:audio/ogg;base64,abc123';
            var result = AudioFile.getAudioURL(mockGame, [ dataUrl ]);

            expect(result).not.toBeNull();
            expect(result.url).toBe(dataUrl);
            expect(result.type).toBe('');
        });

        it('should return the blob URI before checking other urls', function ()
        {
            var blobUrl = 'blob:http://example.com/some-uuid';
            var result = AudioFile.getAudioURL(mockGame, [ blobUrl, 'audio/music.ogg' ]);

            expect(result.url).toBe(blobUrl);
        });

        it('should handle a url with a query string when extracting the extension', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.ogg?v=2' ]);

            expect(result).not.toBeNull();
            expect(result.type).toBe('ogg');
        });

        it('should return an object with url and type properties', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music.ogg' ]);

            expect(result).toHaveProperty('url');
            expect(result).toHaveProperty('type');
        });

        it('should return null when a single unsupported string url is given', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, 'audio/music.mp3');

            expect(result).toBeNull();
        });

        it('should handle urls without a recognisable extension', function ()
        {
            var result = AudioFile.getAudioURL(mockGame, [ 'audio/music' ]);

            expect(result).toBeNull();
        });
    });

    describe('onProcess', function ()
    {
        it('should set state to FILE_PROCESSING', function ()
        {
            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: {
                        decodeAudioData: vi.fn()
                    }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(mockFile.state).toBe(CONST.FILE_PROCESSING);
        });

        it('should call decodeAudioData on the audio context with the xhr response', function ()
        {
            var fakeResponse = new ArrayBuffer(8);
            var decodeAudioData = vi.fn();

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: fakeResponse },
                onProcessComplete: vi.fn(),
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(decodeAudioData).toHaveBeenCalledTimes(1);
            expect(decodeAudioData.mock.calls[0][0]).toBe(fakeResponse);
        });

        it('should pass a success callback as the second argument to decodeAudioData', function ()
        {
            var decodeAudioData = vi.fn();

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(typeof decodeAudioData.mock.calls[0][1]).toBe('function');
        });

        it('should pass an error callback as the third argument to decodeAudioData', function ()
        {
            var decodeAudioData = vi.fn();

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(typeof decodeAudioData.mock.calls[0][2]).toBe('function');
        });

        it('should set data to the decoded audio buffer on success', function ()
        {
            var fakeBuffer = { duration: 2.5, numberOfChannels: 2 };
            var decodeAudioData = vi.fn(function (response, successCb)
            {
                successCb(fakeBuffer);
            });

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(mockFile.data).toBe(fakeBuffer);
        });

        it('should call onProcessComplete on success', function ()
        {
            var onProcessComplete = vi.fn();
            var decodeAudioData = vi.fn(function (response, successCb)
            {
                successCb({});
            });

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: onProcessComplete,
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(onProcessComplete).toHaveBeenCalledTimes(1);
        });

        it('should call onProcessError on decode failure', function ()
        {
            var onProcessError = vi.fn();
            var decodeAudioData = vi.fn(function (response, successCb, errorCb)
            {
                errorCb(new Error('decode failed'));
            });

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: onProcessError
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(onProcessError).toHaveBeenCalledTimes(1);
        });

        it('should not call onProcessComplete on decode failure', function ()
        {
            var onProcessComplete = vi.fn();
            var decodeAudioData = vi.fn(function (response, successCb, errorCb)
            {
                errorCb(new Error('decode failed'));
            });

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: onProcessComplete,
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(onProcessComplete).not.toHaveBeenCalled();
        });

        it('should set config.context to null after calling decodeAudioData', function ()
        {
            var decodeAudioData = vi.fn();

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: vi.fn()
            };

            AudioFile.prototype.onProcess.call(mockFile);

            expect(mockFile.config.context).toBeNull();
        });

        it('should handle a null error object in the error callback', function ()
        {
            var onProcessError = vi.fn();
            var decodeAudioData = vi.fn(function (response, successCb, errorCb)
            {
                errorCb(null);
            });

            var mockFile = {
                state: 0,
                key: 'testAudio',
                config: {
                    context: { decodeAudioData: decodeAudioData }
                },
                xhrLoader: { response: new ArrayBuffer(8) },
                onProcessComplete: vi.fn(),
                onProcessError: onProcessError
            };

            expect(function ()
            {
                AudioFile.prototype.onProcess.call(mockFile);
            }).not.toThrow();

            expect(onProcessError).toHaveBeenCalledTimes(1);
        });
    });
});
