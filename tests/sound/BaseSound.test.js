var BaseSound = require('../../src/sound/BaseSound');

describe('BaseSound', function ()
{
    var mockManager;

    beforeEach(function ()
    {
        mockManager = {
            detune: 0,
            rate: 1
        };
    });

    describe('constructor', function ()
    {
        it('should set the manager reference', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.manager).toBe(mockManager);
        });

        it('should set the key', function ()
        {
            var sound = new BaseSound(mockManager, 'mySound');
            expect(sound.key).toBe('mySound');
        });

        it('should default isPlaying to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.isPlaying).toBe(false);
        });

        it('should default isPaused to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.isPaused).toBe(false);
        });

        it('should default totalRate to 1', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.totalRate).toBe(1);
        });

        it('should default duration to 0', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.duration).toBe(0);
        });

        it('should default totalDuration to 0', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.totalDuration).toBe(0);
        });

        it('should default markers to empty object', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.markers).toEqual({});
        });

        it('should default currentMarker to null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.currentMarker).toBeNull();
        });

        it('should default pendingRemove to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.pendingRemove).toBe(false);
        });

        it('should set default config values', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.config.mute).toBe(false);
            expect(sound.config.volume).toBe(1);
            expect(sound.config.rate).toBe(1);
            expect(sound.config.detune).toBe(0);
            expect(sound.config.seek).toBe(0);
            expect(sound.config.loop).toBe(false);
            expect(sound.config.delay).toBe(0);
            expect(sound.config.pan).toBe(0);
        });

        it('should merge provided config with defaults', function ()
        {
            var sound = new BaseSound(mockManager, 'test', { volume: 0.5, loop: true });
            expect(sound.config.volume).toBe(0.5);
            expect(sound.config.loop).toBe(true);
            expect(sound.config.mute).toBe(false);
            expect(sound.config.rate).toBe(1);
        });

        it('should set currentConfig to the same object as config initially', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.currentConfig).toBe(sound.config);
        });
    });

    describe('addMarker', function ()
    {
        it('should return false when marker is null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.addMarker(null)).toBe(false);
        });

        it('should return false when marker has no name', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.addMarker({ start: 0, duration: 1 })).toBe(false);
        });

        it('should return false when marker name is not a string', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.addMarker({ name: 123, start: 0 })).toBe(false);
        });

        it('should return true when a valid marker is added', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.addMarker({ name: 'intro', start: 0, duration: 2 })).toBe(true);
        });

        it('should store the marker in markers object', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            expect(sound.markers['intro']).toBeDefined();
            expect(sound.markers['intro'].name).toBe('intro');
        });

        it('should return false when adding a duplicate marker name', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            expect(sound.addMarker({ name: 'intro', start: 1, duration: 1 })).toBe(false);
        });

        it('should set default start to 0 if not provided', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', duration: 2 });
            expect(sound.markers['intro'].start).toBe(0);
        });

        it('should set default duration based on totalDuration when not provided', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.totalDuration = 10;
            sound.addMarker({ name: 'intro', start: 3 });
            expect(sound.markers['intro'].duration).toBe(7);
        });

        it('should set default config values for marker', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            var cfg = sound.markers['intro'].config;
            expect(cfg.mute).toBe(false);
            expect(cfg.volume).toBe(1);
            expect(cfg.rate).toBe(1);
            expect(cfg.detune).toBe(0);
            expect(cfg.seek).toBe(0);
            expect(cfg.loop).toBe(false);
            expect(cfg.delay).toBe(0);
            expect(cfg.pan).toBe(0);
        });

        it('should allow multiple different markers', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            sound.addMarker({ name: 'loop', start: 2, duration: 4 });
            expect(sound.markers['intro']).toBeDefined();
            expect(sound.markers['loop']).toBeDefined();
        });
    });

    describe('updateMarker', function ()
    {
        it('should return false when marker is null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.updateMarker(null)).toBe(false);
        });

        it('should return false when marker has no name', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.updateMarker({ start: 1 })).toBe(false);
        });

        it('should return false when marker name is not a string', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.updateMarker({ name: 42 })).toBe(false);
        });

        it('should return false when marker does not exist', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.updateMarker({ name: 'missing', start: 0 })).toBe(false);
        });

        it('should return true when an existing marker is updated', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            expect(sound.updateMarker({ name: 'intro', duration: 5 })).toBe(true);
        });

        it('should update the marker values', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            sound.updateMarker({ name: 'intro', start: 1, duration: 5 });
            expect(sound.markers['intro'].start).toBe(1);
            expect(sound.markers['intro'].duration).toBe(5);
        });

        it('should preserve existing marker values not included in update', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            sound.updateMarker({ name: 'intro', duration: 5 });
            expect(sound.markers['intro'].start).toBe(0);
        });
    });

    describe('removeMarker', function ()
    {
        it('should return null when marker does not exist', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.removeMarker('nonexistent')).toBeNull();
        });

        it('should return the removed marker object', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            var removed = sound.removeMarker('intro');
            expect(removed).toBeDefined();
            expect(removed.name).toBe('intro');
        });

        it('should set the marker entry to null in markers object', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            sound.removeMarker('intro');
            expect(sound.markers['intro']).toBeNull();
        });
    });

    describe('play', function ()
    {
        it('should return true when playing whole sound', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.play()).toBe(true);
        });

        it('should set isPlaying to true', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            expect(sound.isPlaying).toBe(true);
        });

        it('should set isPaused to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.isPaused = true;
            sound.play();
            expect(sound.isPaused).toBe(false);
        });

        it('should set currentMarker to null when no marker name given', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            sound.play('intro');
            sound.play();
            expect(sound.currentMarker).toBeNull();
        });

        it('should set duration to totalDuration when no marker name given', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.totalDuration = 8;
            sound.play();
            expect(sound.duration).toBe(8);
        });

        it('should return false when markerName is not a string or object', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.play(42)).toBe(false);
        });

        it('should return false when a non-existent marker name is given', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.play('missing')).toBe(false);
        });

        it('should return true when playing a valid marker', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'loop', start: 2, duration: 4 });
            expect(sound.play('loop')).toBe(true);
        });

        it('should set currentMarker when playing a valid marker', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'loop', start: 2, duration: 4 });
            sound.play('loop');
            expect(sound.currentMarker).toBe(sound.markers['loop']);
        });

        it('should set duration to marker duration when playing a marker', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'loop', start: 2, duration: 4 });
            sound.play('loop');
            expect(sound.duration).toBe(4);
        });

        it('should accept a config object as first argument', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            var result = sound.play({ loop: true });
            expect(result).toBe(true);
            expect(sound.isPlaying).toBe(true);
        });

        it('should apply config passed as second argument', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play('', { loop: true });
            expect(sound.currentConfig.loop).toBe(true);
        });

        it('should reset seek and delay before applying new config', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.config.seek = 5;
            sound.config.delay = 2;
            sound.play();
            expect(sound.currentConfig.seek).toBe(0);
            expect(sound.currentConfig.delay).toBe(0);
        });
    });

    describe('pause', function ()
    {
        it('should return false when sound is not playing', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.pause()).toBe(false);
        });

        it('should return false when sound is already paused', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.isPaused = true;
            sound.isPlaying = false;
            expect(sound.pause()).toBe(false);
        });

        it('should return true when sound is playing', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            expect(sound.pause()).toBe(true);
        });

        it('should set isPlaying to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            expect(sound.isPlaying).toBe(false);
        });

        it('should set isPaused to true', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            expect(sound.isPaused).toBe(true);
        });
    });

    describe('resume', function ()
    {
        it('should return false when sound is not paused', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.resume()).toBe(false);
        });

        it('should return false when sound is already playing', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.isPlaying = true;
            sound.isPaused = false;
            expect(sound.resume()).toBe(false);
        });

        it('should return false when both isPlaying and isPaused are true', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.isPlaying = true;
            sound.isPaused = true;
            expect(sound.resume()).toBe(false);
        });

        it('should return true when sound is paused', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            expect(sound.resume()).toBe(true);
        });

        it('should set isPlaying to true', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            sound.resume();
            expect(sound.isPlaying).toBe(true);
        });

        it('should set isPaused to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            sound.resume();
            expect(sound.isPaused).toBe(false);
        });
    });

    describe('stop', function ()
    {
        it('should return false when sound is not playing and not paused', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            expect(sound.stop()).toBe(false);
        });

        it('should return true when sound is playing', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            expect(sound.stop()).toBe(true);
        });

        it('should return true when sound is paused', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            expect(sound.stop()).toBe(true);
        });

        it('should set isPlaying to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.stop();
            expect(sound.isPlaying).toBe(false);
        });

        it('should set isPaused to false', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.pause();
            sound.stop();
            expect(sound.isPaused).toBe(false);
        });

        it('should reset seek and delay in currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            sound.currentConfig.seek = 3;
            sound.currentConfig.delay = 1;
            sound.stop();
            expect(sound.currentConfig.seek).toBe(0);
            expect(sound.currentConfig.delay).toBe(0);
        });
    });

    describe('applyConfig', function ()
    {
        it('should copy mute from currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.mute = true;
            sound.applyConfig();
            expect(sound.mute).toBe(true);
        });

        it('should copy volume from currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.volume = 0.5;
            sound.applyConfig();
            expect(sound.volume).toBe(0.5);
        });

        it('should copy rate from currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.rate = 2;
            sound.applyConfig();
            expect(sound.rate).toBe(2);
        });

        it('should copy detune from currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.detune = 100;
            sound.applyConfig();
            expect(sound.detune).toBe(100);
        });

        it('should copy loop from currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.loop = true;
            sound.applyConfig();
            expect(sound.loop).toBe(true);
        });

        it('should copy pan from currentConfig', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.pan = -0.5;
            sound.applyConfig();
            expect(sound.pan).toBe(-0.5);
        });
    });

    describe('resetConfig', function ()
    {
        it('should set seek to 0', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.seek = 5;
            sound.resetConfig();
            expect(sound.currentConfig.seek).toBe(0);
        });

        it('should set delay to 0', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.delay = 3;
            sound.resetConfig();
            expect(sound.currentConfig.delay).toBe(0);
        });

        it('should not change other config values', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.currentConfig.volume = 0.7;
            sound.currentConfig.loop = true;
            sound.resetConfig();
            expect(sound.currentConfig.volume).toBe(0.7);
            expect(sound.currentConfig.loop).toBe(true);
        });
    });

    describe('calculateRate', function ()
    {
        it('should set totalRate to 1 with default values', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.calculateRate();
            expect(sound.totalRate).toBeCloseTo(1, 5);
        });

        it('should multiply rate by manager rate', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            mockManager.rate = 2;
            sound.currentConfig.rate = 1;
            sound.currentConfig.detune = 0;
            mockManager.detune = 0;
            sound.calculateRate();
            expect(sound.totalRate).toBeCloseTo(2, 5);
        });

        it('should factor in sound rate with manager rate', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            mockManager.rate = 2;
            sound.currentConfig.rate = 3;
            sound.currentConfig.detune = 0;
            mockManager.detune = 0;
            sound.calculateRate();
            expect(sound.totalRate).toBeCloseTo(6, 5);
        });

        it('should factor in detune from currentConfig and manager', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            mockManager.rate = 1;
            sound.currentConfig.rate = 1;
            mockManager.detune = 0;
            sound.currentConfig.detune = 1200;
            sound.calculateRate();
            // 1200 cents = 1 octave = rate * 2
            expect(sound.totalRate).toBeCloseTo(2, 2);
        });

        it('should combine detune from both sound and manager', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            mockManager.rate = 1;
            sound.currentConfig.rate = 1;
            mockManager.detune = 600;
            sound.currentConfig.detune = 600;
            sound.calculateRate();
            // 1200 cents total = 2x rate
            expect(sound.totalRate).toBeCloseTo(2, 2);
        });

        it('should handle negative detune', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            mockManager.rate = 1;
            sound.currentConfig.rate = 1;
            mockManager.detune = 0;
            sound.currentConfig.detune = -1200;
            sound.calculateRate();
            // -1200 cents = half rate
            expect(sound.totalRate).toBeCloseTo(0.5, 2);
        });
    });

    describe('destroy', function ()
    {
        it('should set pendingRemove to true', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.destroy();
            expect(sound.pendingRemove).toBe(true);
        });

        it('should set manager to null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.destroy();
            expect(sound.manager).toBeNull();
        });

        it('should set config to null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.destroy();
            expect(sound.config).toBeNull();
        });

        it('should set currentConfig to null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.destroy();
            expect(sound.currentConfig).toBeNull();
        });

        it('should set markers to null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.destroy();
            expect(sound.markers).toBeNull();
        });

        it('should set currentMarker to null', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.addMarker({ name: 'intro', start: 0, duration: 2 });
            sound.play('intro');
            sound.destroy();
            expect(sound.currentMarker).toBeNull();
        });

        it('should emit DESTROY event with the sound instance', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            var emitted = null;
            sound.on('destroy', function (s)
            {
                emitted = s;
            });
            sound.destroy();
            expect(emitted).toBe(sound);
        });

        it('should stop playback before destroying', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.play();
            expect(sound.isPlaying).toBe(true);
            sound.destroy();
            // After destroy config is null so we verify pendingRemove instead
            expect(sound.pendingRemove).toBe(true);
        });

        it('should do nothing if already destroyed (pendingRemove is true)', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            sound.destroy();
            // Calling again should not throw
            expect(function ()
            {
                sound.destroy();
            }).not.toThrow();
            expect(sound.pendingRemove).toBe(true);
        });

        it('should remove all event listeners', function ()
        {
            var sound = new BaseSound(mockManager, 'test');
            var callCount = 0;
            sound.on('destroy', function ()
            {
                callCount++;
            });
            sound.destroy();
            // After removeAllListeners, re-emitting should not trigger handlers
            sound.pendingRemove = false;
            sound.manager = mockManager;
            sound.config = {};
            sound.currentConfig = {};
            sound.markers = {};
            // Manually emit after listeners removed
            sound.emit('destroy', sound);
            expect(callCount).toBe(1); // Only fired once during actual destroy
        });
    });
});
