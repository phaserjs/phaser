var WebAudioSound = require('../../../src/sound/webaudio/WebAudioSound');

// ---------------------------------------------------------------------------
// Mock factory helpers
// ---------------------------------------------------------------------------

function createMockGainNode ()
{
    var gainObj = { value: 1 };
    gainObj.setValueAtTime = function (value)
    {
        gainObj.value = value;
    };

    return {
        gain: gainObj,
        connect: vi.fn(),
        disconnect: vi.fn()
    };
}

function createMockPannerNode ()
{
    return {
        connect: vi.fn(),
        disconnect: vi.fn(),
        positionX: { value: 0 },
        positionY: { value: 0 },
        positionZ: { value: 0 },
        orientationX: { value: 0 },
        orientationY: { value: 0 },
        orientationZ: { value: -1 },
        panningModel: 'equalpower',
        distanceModel: 'inverse',
        refDistance: 1,
        maxDistance: 10000,
        rolloffFactor: 1,
        coneInnerAngle: 360,
        coneOuterAngle: 0,
        coneOuterGain: 0
    };
}

function createMockStereoPannerNode ()
{
    var panObj = { value: 0 };
    panObj.setValueAtTime = function (value)
    {
        panObj.value = value;
    };

    return {
        pan: panObj,
        connect: vi.fn(),
        disconnect: vi.fn()
    };
}

function createMockBufferSourceNode ()
{
    return {
        buffer: null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        playbackRate: { value: 1, setValueAtTime: vi.fn() },
        onended: null
    };
}

function createMockManager (duration)
{
    var audioDuration = (duration !== undefined) ? duration : 2.0;
    var audioBuffer = { duration: audioDuration };

    return {
        game: {
            cache: {
                audio: {
                    get: function (key)
                    {
                        return (key === 'test-sound') ? audioBuffer : null;
                    }
                }
            }
        },
        context: {
            currentTime: 0,
            createGain: function () { return createMockGainNode(); },
            createPanner: function () { return createMockPannerNode(); },
            createStereoPanner: function () { return createMockStereoPannerNode(); },
            createBufferSource: function () { return createMockBufferSourceNode(); }
        },
        destination: {},
        sounds: [],
        rate: 1,
        detune: 0
    };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('WebAudioSound', function ()
{
    var manager;
    var sound;

    beforeEach(function ()
    {
        manager = createMockManager();
        sound = new WebAudioSound(manager, 'test-sound');
    });

    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should throw when audio key is not found in cache', function ()
        {
            expect(function ()
            {
                new WebAudioSound(manager, 'missing-key');
            }).toThrow('Audio key "missing-key" not found in cache');
        });

        it('should set audioBuffer from cache', function ()
        {
            expect(sound.audioBuffer).not.toBeNull();
            expect(sound.audioBuffer.duration).toBe(2.0);
        });

        it('should initialise source and loopSource to null', function ()
        {
            expect(sound.source).toBeNull();
            expect(sound.loopSource).toBeNull();
        });

        it('should initialise playTime, startTime and loopTime to zero', function ()
        {
            expect(sound.playTime).toBe(0);
            expect(sound.startTime).toBe(0);
            expect(sound.loopTime).toBe(0);
        });

        it('should initialise rateUpdates as an empty array', function ()
        {
            expect(Array.isArray(sound.rateUpdates)).toBe(true);
            expect(sound.rateUpdates.length).toBe(0);
        });

        it('should initialise hasEnded and hasLooped to false', function ()
        {
            expect(sound.hasEnded).toBe(false);
            expect(sound.hasLooped).toBe(false);
        });

        it('should set duration and totalDuration from the audio buffer', function ()
        {
            expect(sound.duration).toBe(2.0);
            expect(sound.totalDuration).toBe(2.0);
        });

        it('should create muteNode and volumeNode gain nodes', function ()
        {
            expect(sound.muteNode).not.toBeNull();
            expect(sound.volumeNode).not.toBeNull();
        });

        it('should create spatialNode when context supports createPanner', function ()
        {
            expect(sound.spatialNode).not.toBeNull();
        });

        it('should create pannerNode when context supports createStereoPanner', function ()
        {
            expect(sound.pannerNode).not.toBeNull();
        });

        it('should initialise with isPlaying false and isPaused false', function ()
        {
            expect(sound.isPlaying).toBe(false);
            expect(sound.isPaused).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // stopAndRemoveBufferSource
    // -----------------------------------------------------------------------

    describe('stopAndRemoveBufferSource', function ()
    {
        it('should reset playTime and startTime to zero', function ()
        {
            sound.playTime = 5;
            sound.startTime = 5;
            sound.stopAndRemoveBufferSource();

            expect(sound.playTime).toBe(0);
            expect(sound.startTime).toBe(0);
        });

        it('should set hasEnded to false', function ()
        {
            sound.hasEnded = true;
            sound.stopAndRemoveBufferSource();

            expect(sound.hasEnded).toBe(false);
        });

        it('should stop and disconnect an existing source node', function ()
        {
            var mockSource = createMockBufferSourceNode();
            sound.source = mockSource;
            sound.stopAndRemoveBufferSource();

            expect(mockSource.stop).toHaveBeenCalled();
            expect(mockSource.disconnect).toHaveBeenCalled();
            expect(sound.source).toBeNull();
        });

        it('should also reset loopTime via stopAndRemoveLoopBufferSource', function ()
        {
            sound.loopTime = 3;
            sound.stopAndRemoveBufferSource();

            expect(sound.loopTime).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    // stopAndRemoveLoopBufferSource
    // -----------------------------------------------------------------------

    describe('stopAndRemoveLoopBufferSource', function ()
    {
        it('should reset loopTime to zero', function ()
        {
            sound.loopTime = 4;
            sound.stopAndRemoveLoopBufferSource();

            expect(sound.loopTime).toBe(0);
        });

        it('should stop, disconnect and null out an existing loopSource', function ()
        {
            var mockLoopSource = createMockBufferSourceNode();
            sound.loopSource = mockLoopSource;
            sound.stopAndRemoveLoopBufferSource();

            expect(mockLoopSource.stop).toHaveBeenCalled();
            expect(mockLoopSource.disconnect).toHaveBeenCalled();
            expect(sound.loopSource).toBeNull();
        });
    });

    // -----------------------------------------------------------------------
    // getCurrentTime
    // -----------------------------------------------------------------------

    describe('getCurrentTime', function ()
    {
        it('should return zero when rateUpdates is empty', function ()
        {
            sound.rateUpdates = [];
            sound.playTime = 0;
            manager.context.currentTime = 0;

            expect(sound.getCurrentTime()).toBe(0);
        });

        it('should calculate elapsed time with a single rate update at rate 1', function ()
        {
            sound.rateUpdates = [ { time: 0, rate: 1 } ];
            sound.playTime = 0;
            manager.context.currentTime = 3;

            // elapsed = (3 - 0) * 1 = 3
            expect(sound.getCurrentTime()).toBeCloseTo(3, 5);
        });

        it('should calculate elapsed time with a single rate update at rate 2', function ()
        {
            sound.rateUpdates = [ { time: 0, rate: 2 } ];
            sound.playTime = 0;
            manager.context.currentTime = 2;

            // elapsed = (2 - 0) * 2 = 4
            expect(sound.getCurrentTime()).toBeCloseTo(4, 5);
        });

        it('should accumulate across multiple rate update segments', function ()
        {
            // Segment 0 → 1 at rate 1  (contributes 1)
            // Segment 1 → now(3) at rate 2  (contributes (3-1)*2 = 4)
            sound.rateUpdates = [
                { time: 0, rate: 1 },
                { time: 1, rate: 2 }
            ];
            sound.playTime = 0;
            manager.context.currentTime = 3;

            expect(sound.getCurrentTime()).toBeCloseTo(5, 5);
        });
    });

    // -----------------------------------------------------------------------
    // getLoopTime
    // -----------------------------------------------------------------------

    describe('getLoopTime', function ()
    {
        it('should return playTime + duration when a single rate update at rate 1', function ()
        {
            sound.rateUpdates = [ { time: 0, rate: 1 } ];
            sound.playTime = 0;
            // duration = 2.0 (from audioBuffer mock)

            // loopTime = playTime + lastUpdate.time + (duration - 0) / rate
            //          = 0 + 0 + 2 / 1 = 2
            expect(sound.getLoopTime()).toBeCloseTo(2, 5);
        });

        it('should account for playback rate when calculating loop time', function ()
        {
            sound.rateUpdates = [ { time: 0, rate: 2 } ];
            sound.playTime = 0;

            // loopTime = 0 + 0 + (2 / 2) = 1
            expect(sound.getLoopTime()).toBeCloseTo(1, 5);
        });

        it('should account for a non-zero playTime', function ()
        {
            sound.rateUpdates = [ { time: 0, rate: 1 } ];
            sound.playTime = 5;

            // loopTime = 5 + 0 + (2 / 1) = 7
            expect(sound.getLoopTime()).toBeCloseTo(7, 5);
        });
    });

    // -----------------------------------------------------------------------
    // stop / pause / resume return values
    // -----------------------------------------------------------------------

    describe('stop', function ()
    {
        it('should return false when sound is not playing or paused', function ()
        {
            expect(sound.stop()).toBe(false);
        });
    });

    describe('pause', function ()
    {
        it('should return false when sound is not playing', function ()
        {
            expect(sound.pause()).toBe(false);
        });
    });

    describe('resume', function ()
    {
        it('should return false when sound is not paused', function ()
        {
            expect(sound.resume()).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // mute property / setMute
    // -----------------------------------------------------------------------

    describe('mute / setMute', function ()
    {
        it('should return false (unmuted) after construction', function ()
        {
            expect(sound.mute).toBe(false);
        });

        it('should update the muteNode gain when set to true', function ()
        {
            sound.mute = true;

            expect(sound.muteNode.gain.value).toBe(0);
            expect(sound.mute).toBe(true);
        });

        it('should update the muteNode gain back to 1 when set to false', function ()
        {
            sound.mute = true;
            sound.mute = false;

            expect(sound.muteNode.gain.value).toBe(1);
            expect(sound.mute).toBe(false);
        });

        it('setMute should return the sound instance', function ()
        {
            expect(sound.setMute(true)).toBe(sound);
        });
    });

    // -----------------------------------------------------------------------
    // volume property / setVolume
    // -----------------------------------------------------------------------

    describe('volume / setVolume', function ()
    {
        it('should return 1 after construction', function ()
        {
            expect(sound.volume).toBe(1);
        });

        it('should update volumeNode gain value', function ()
        {
            sound.volume = 0.5;

            expect(sound.volumeNode.gain.value).toBeCloseTo(0.5, 5);
            expect(sound.volume).toBeCloseTo(0.5, 5);
        });

        it('setVolume should return the sound instance', function ()
        {
            expect(sound.setVolume(0.5)).toBe(sound);
        });
    });

    // -----------------------------------------------------------------------
    // pan property / setPan
    // -----------------------------------------------------------------------

    describe('pan / setPan', function ()
    {
        it('should return 0 after construction', function ()
        {
            expect(sound.pan).toBe(0);
        });

        it('should return 0 when no pannerNode is present', function ()
        {
            sound.pannerNode = null;

            expect(sound.pan).toBe(0);
        });

        it('setPan should return the sound instance', function ()
        {
            expect(sound.setPan(0.5)).toBe(sound);
        });
    });

    // -----------------------------------------------------------------------
    // rate / setRate
    // -----------------------------------------------------------------------

    describe('rate / setRate', function ()
    {
        it('should return 1 after construction', function ()
        {
            expect(sound.rate).toBe(1);
        });

        it('should update currentConfig.rate', function ()
        {
            sound.rate = 2;

            expect(sound.currentConfig.rate).toBe(2);
            expect(sound.rate).toBe(2);
        });

        it('setRate should return the sound instance', function ()
        {
            expect(sound.setRate(0.5)).toBe(sound);
        });
    });

    // -----------------------------------------------------------------------
    // detune / setDetune
    // -----------------------------------------------------------------------

    describe('detune / setDetune', function ()
    {
        it('should return 0 after construction', function ()
        {
            expect(sound.detune).toBe(0);
        });

        it('should update currentConfig.detune', function ()
        {
            sound.detune = 100;

            expect(sound.currentConfig.detune).toBe(100);
            expect(sound.detune).toBe(100);
        });

        it('setDetune should return the sound instance', function ()
        {
            expect(sound.setDetune(50)).toBe(sound);
        });
    });

    // -----------------------------------------------------------------------
    // loop / setLoop
    // -----------------------------------------------------------------------

    describe('loop / setLoop', function ()
    {
        it('should return false after construction', function ()
        {
            expect(sound.loop).toBe(false);
        });

        it('should update currentConfig.loop', function ()
        {
            sound.loop = true;

            expect(sound.currentConfig.loop).toBe(true);
            expect(sound.loop).toBe(true);
        });

        it('setLoop should return the sound instance', function ()
        {
            expect(sound.setLoop(true)).toBe(sound);
        });
    });

    // -----------------------------------------------------------------------
    // setSeek
    // -----------------------------------------------------------------------

    describe('setSeek', function ()
    {
        it('should return the sound instance', function ()
        {
            expect(sound.setSeek(0)).toBe(sound);
        });

        it('should have no effect when sound is stopped', function ()
        {
            // Neither isPlaying nor isPaused — setter exits early
            sound.setSeek(1.0);

            expect(sound.currentConfig.seek).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    // applyConfig
    // -----------------------------------------------------------------------

    describe('applyConfig', function ()
    {
        it('should reset rateUpdates to a single entry with rate 1', function ()
        {
            sound.rateUpdates.push({ time: 1, rate: 2 });
            sound.rateUpdates.push({ time: 2, rate: 3 });

            sound.applyConfig();

            expect(sound.rateUpdates.length).toBe(1);
            expect(sound.rateUpdates[0].time).toBe(0);
            expect(sound.rateUpdates[0].rate).toBe(1);
        });
    });

    // -----------------------------------------------------------------------
    // update
    // -----------------------------------------------------------------------

    describe('update', function ()
    {
        it('should emit COMPLETE and reset state when hasEnded is true', function ()
        {
            var completeFired = false;
            sound.on('complete', function ()
            {
                completeFired = true;
            });

            // Simulate a sound that was playing and has now ended naturally
            sound.isPlaying = true;
            sound.isPaused = false;
            sound.hasEnded = true;

            sound.update();

            expect(completeFired).toBe(true);
            expect(sound.isPlaying).toBe(false);
        });

        it('should emit LOOPED and swap sources when hasLooped is true', function ()
        {
            var loopedFired = false;
            sound.on('looped', function ()
            {
                loopedFired = true;
            });

            var mockLoopSource = createMockBufferSourceNode();
            sound.isPlaying = true;
            sound.hasLooped = true;
            sound.loopSource = mockLoopSource;
            sound.loopTime = 5;
            sound.totalRate = 1;
            sound.rateUpdates = [ { time: 0, rate: 1 } ];

            sound.update();

            expect(loopedFired).toBe(true);
            expect(sound.hasLooped).toBe(false);
            expect(sound.source).toBe(mockLoopSource);
        });
    });

    // -----------------------------------------------------------------------
    // destroy
    // -----------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should null out audioBuffer, muteNode, volumeNode after destroy', function ()
        {
            sound.destroy();

            expect(sound.audioBuffer).toBeNull();
            expect(sound.muteNode).toBeNull();
            expect(sound.volumeNode).toBeNull();
        });

        it('should null out pannerNode and spatialNode after destroy', function ()
        {
            sound.destroy();

            expect(sound.pannerNode).toBeNull();
            expect(sound.spatialNode).toBeNull();
        });

        it('should set pendingRemove to true', function ()
        {
            sound.destroy();

            expect(sound.pendingRemove).toBe(true);
        });

        it('should be a no-op when called a second time', function ()
        {
            sound.destroy();

            // Second call should not throw
            expect(function ()
            {
                sound.destroy();
            }).not.toThrow();
        });
    });
});
