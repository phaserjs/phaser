var NoAudioSound = require('../../../src/sound/noaudio/NoAudioSound');

describe('NoAudioSound', function ()
{
    var manager;
    var sound;

    beforeEach(function ()
    {
        manager = {
            remove: function () {}
        };
        sound = new NoAudioSound(manager, 'test-sound');
    });

    describe('constructor', function ()
    {
        it('should set the manager reference', function ()
        {
            expect(sound.manager).toBe(manager);
        });

        it('should set the key', function ()
        {
            expect(sound.key).toBe('test-sound');
        });

        it('should default isPlaying to false', function ()
        {
            expect(sound.isPlaying).toBe(false);
        });

        it('should default isPaused to false', function ()
        {
            expect(sound.isPaused).toBe(false);
        });

        it('should default totalRate to 1', function ()
        {
            expect(sound.totalRate).toBe(1);
        });

        it('should default duration to 0', function ()
        {
            expect(sound.duration).toBe(0);
        });

        it('should default totalDuration to 0', function ()
        {
            expect(sound.totalDuration).toBe(0);
        });

        it('should default mute to false', function ()
        {
            expect(sound.mute).toBe(false);
        });

        it('should default volume to 1', function ()
        {
            expect(sound.volume).toBe(1);
        });

        it('should default rate to 1', function ()
        {
            expect(sound.rate).toBe(1);
        });

        it('should default detune to 0', function ()
        {
            expect(sound.detune).toBe(0);
        });

        it('should default seek to 0', function ()
        {
            expect(sound.seek).toBe(0);
        });

        it('should default loop to false', function ()
        {
            expect(sound.loop).toBe(false);
        });

        it('should default pan to 0', function ()
        {
            expect(sound.pan).toBe(0);
        });

        it('should default markers to an empty object', function ()
        {
            expect(sound.markers).toEqual({});
        });

        it('should default currentMarker to null', function ()
        {
            expect(sound.currentMarker).toBeNull();
        });

        it('should default pendingRemove to false', function ()
        {
            expect(sound.pendingRemove).toBe(false);
        });

        it('should create config with default values', function ()
        {
            expect(sound.config.mute).toBe(false);
            expect(sound.config.volume).toBe(1);
            expect(sound.config.rate).toBe(1);
            expect(sound.config.detune).toBe(0);
            expect(sound.config.seek).toBe(0);
            expect(sound.config.loop).toBe(false);
            expect(sound.config.delay).toBe(0);
            expect(sound.config.pan).toBe(0);
        });

        it('should set currentConfig to the same object as config', function ()
        {
            expect(sound.currentConfig).toBe(sound.config);
        });

        it('should merge provided config values over defaults', function ()
        {
            var custom = new NoAudioSound(manager, 'custom', { volume: 0.5, loop: true, pan: -0.5 });

            expect(custom.config.volume).toBe(0.5);
            expect(custom.config.loop).toBe(true);
            expect(custom.config.pan).toBeCloseTo(-0.5);
        });

        it('should preserve default config values not overridden by custom config', function ()
        {
            var custom = new NoAudioSound(manager, 'custom', { volume: 0.5 });

            expect(custom.config.rate).toBe(1);
            expect(custom.config.detune).toBe(0);
            expect(custom.config.seek).toBe(0);
            expect(custom.config.delay).toBe(0);
        });

        it('should use empty config when none is provided', function ()
        {
            var s = new NoAudioSound(manager, 'no-config');

            expect(s.config.mute).toBe(false);
            expect(s.config.volume).toBe(1);
        });
    });

    describe('addMarker', function ()
    {
        it('should return false', function ()
        {
            expect(sound.addMarker({ name: 'intro', start: 0, duration: 5 })).toBe(false);
        });

        it('should return false when called with no arguments', function ()
        {
            expect(sound.addMarker()).toBe(false);
        });
    });

    describe('updateMarker', function ()
    {
        it('should return false', function ()
        {
            expect(sound.updateMarker({ name: 'intro', start: 1, duration: 4 })).toBe(false);
        });

        it('should return false when called with no arguments', function ()
        {
            expect(sound.updateMarker()).toBe(false);
        });
    });

    describe('removeMarker', function ()
    {
        it('should return null', function ()
        {
            expect(sound.removeMarker('intro')).toBeNull();
        });

        it('should return null when called with no arguments', function ()
        {
            expect(sound.removeMarker()).toBeNull();
        });
    });

    describe('play', function ()
    {
        it('should return false with no arguments', function ()
        {
            expect(sound.play()).toBe(false);
        });

        it('should return false with a marker name', function ()
        {
            expect(sound.play('intro')).toBe(false);
        });

        it('should return false with a config object', function ()
        {
            expect(sound.play({ volume: 0.5 })).toBe(false);
        });

        it('should return false with a marker name and config', function ()
        {
            expect(sound.play('intro', { volume: 0.5 })).toBe(false);
        });
    });

    describe('pause', function ()
    {
        it('should return false', function ()
        {
            expect(sound.pause()).toBe(false);
        });
    });

    describe('resume', function ()
    {
        it('should return false', function ()
        {
            expect(sound.resume()).toBe(false);
        });
    });

    describe('stop', function ()
    {
        it('should return false', function ()
        {
            expect(sound.stop()).toBe(false);
        });
    });

    describe('setMute', function ()
    {
        it('should return the sound instance when muting', function ()
        {
            expect(sound.setMute(true)).toBe(sound);
        });

        it('should return the sound instance when unmuting', function ()
        {
            expect(sound.setMute(false)).toBe(sound);
        });
    });

    describe('setVolume', function ()
    {
        it('should return the sound instance', function ()
        {
            expect(sound.setVolume(0.5)).toBe(sound);
        });

        it('should return the sound instance for zero volume', function ()
        {
            expect(sound.setVolume(0)).toBe(sound);
        });

        it('should return the sound instance for full volume', function ()
        {
            expect(sound.setVolume(1)).toBe(sound);
        });
    });

    describe('setRate', function ()
    {
        it('should return the sound instance', function ()
        {
            expect(sound.setRate(2.0)).toBe(sound);
        });

        it('should return the sound instance for half speed', function ()
        {
            expect(sound.setRate(0.5)).toBe(sound);
        });
    });

    describe('setDetune', function ()
    {
        it('should return the sound instance for positive detune', function ()
        {
            expect(sound.setDetune(100)).toBe(sound);
        });

        it('should return the sound instance for negative detune', function ()
        {
            expect(sound.setDetune(-100)).toBe(sound);
        });

        it('should return the sound instance for zero detune', function ()
        {
            expect(sound.setDetune(0)).toBe(sound);
        });
    });

    describe('setSeek', function ()
    {
        it('should return the sound instance', function ()
        {
            expect(sound.setSeek(5)).toBe(sound);
        });

        it('should return the sound instance for zero seek', function ()
        {
            expect(sound.setSeek(0)).toBe(sound);
        });
    });

    describe('setLoop', function ()
    {
        it('should return the sound instance when enabling loop', function ()
        {
            expect(sound.setLoop(true)).toBe(sound);
        });

        it('should return the sound instance when disabling loop', function ()
        {
            expect(sound.setLoop(false)).toBe(sound);
        });
    });

    describe('setPan', function ()
    {
        it('should return the sound instance for center pan', function ()
        {
            expect(sound.setPan(0)).toBe(sound);
        });

        it('should return the sound instance for full right pan', function ()
        {
            expect(sound.setPan(1)).toBe(sound);
        });

        it('should return the sound instance for full left pan', function ()
        {
            expect(sound.setPan(-1)).toBe(sound);
        });

        it('should return the sound instance for fractional pan value', function ()
        {
            expect(sound.setPan(0.5)).toBe(sound);
        });
    });

    describe('applyConfig', function ()
    {
        it('should return null', function ()
        {
            expect(sound.applyConfig()).toBeNull();
        });
    });

    describe('resetConfig', function ()
    {
        it('should return null', function ()
        {
            expect(sound.resetConfig()).toBeNull();
        });
    });

    describe('update', function ()
    {
        it('should return undefined', function ()
        {
            expect(sound.update(1000, 16)).toBeUndefined();
        });

        it('should return undefined when called with no arguments', function ()
        {
            expect(sound.update()).toBeUndefined();
        });
    });

    describe('calculateRate', function ()
    {
        it('should return null', function ()
        {
            expect(sound.calculateRate()).toBeNull();
        });
    });

    describe('destroy', function ()
    {
        it('should set pendingRemove to true', function ()
        {
            sound.destroy();

            expect(sound.pendingRemove).toBe(true);
        });

        it('should remove all event listeners', function ()
        {
            sound.on('test-event', function () {});

            expect(sound.listenerCount('test-event')).toBe(1);

            sound.destroy();

            expect(sound.listenerCount('test-event')).toBe(0);
        });

        it('should remove multiple event listeners of different types', function ()
        {
            sound.on('play', function () {});
            sound.on('stop', function () {});
            sound.on('destroy', function () {});

            sound.destroy();

            expect(sound.listenerCount('play')).toBe(0);
            expect(sound.listenerCount('stop')).toBe(0);
        });
    });
});
