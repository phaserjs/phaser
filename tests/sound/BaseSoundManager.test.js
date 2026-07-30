var BaseSoundManager = require('../../src/sound/BaseSoundManager');

function createMockGame ()
{
    var gameEvents = {
        on: function () {},
        once: function () {},
        off: function () {},
        emit: function () {}
    };

    return {
        cache: {
            json: {
                get: function (key)
                {
                    return {
                        spritemap: {
                            markerA: { start: 0, end: 2 },
                            markerB: { start: 3, end: 5, loop: true }
                        }
                    };
                }
            }
        },
        events: gameEvents
    };
}

function createMockSound (key, isPlaying)
{
    return {
        key: key,
        isPlaying: isPlaying || false,
        pendingRemove: false,
        spritemap: null,
        markers: [],
        calculateRateCalled: false,
        pauseCalled: false,
        resumeCalled: false,
        stopCalled: false,
        destroyCalled: false,
        updateCalled: false,
        playArg: null,
        addMarkerCalled: false,
        onceCalled: false,
        destroy: function ()
        {
            this.destroyCalled = true;
            this.pendingRemove = true;
        },
        pause: function ()
        {
            this.pauseCalled = true;
        },
        resume: function ()
        {
            this.resumeCalled = true;
        },
        stop: function ()
        {
            this.stopCalled = true;
            return true;
        },
        play: function (arg)
        {
            this.playArg = arg;
            return true;
        },
        addMarker: function (marker)
        {
            this.addMarkerCalled = true;
            this.markers.push(marker);
        },
        update: function (time, delta)
        {
            this.updateCalled = true;
        },
        calculateRate: function ()
        {
            this.calculateRateCalled = true;
        },
        once: function (event, fn, ctx)
        {
            this.onceCalled = true;
        }
    };
}

describe('BaseSoundManager', function ()
{
    var game;
    var manager;

    beforeEach(function ()
    {
        game = createMockGame();
        manager = new BaseSoundManager(game);
    });

    afterEach(function ()
    {
        // Only destroy if not already destroyed
        if (manager.game !== null)
        {
            manager.game.events.off = function () {};
            manager.destroy();
        }
    });

    describe('Constructor', function ()
    {
        it('should set game reference', function ()
        {
            expect(manager.game).toBe(game);
        });

        it('should set jsonCache reference', function ()
        {
            expect(manager.jsonCache).toBe(game.cache.json);
        });

        it('should initialise sounds as empty array', function ()
        {
            expect(Array.isArray(manager.sounds)).toBe(true);
            expect(manager.sounds.length).toBe(0);
        });

        it('should default mute to false', function ()
        {
            expect(manager.mute).toBe(false);
        });

        it('should default volume to 1', function ()
        {
            expect(manager.volume).toBe(1);
        });

        it('should default pauseOnBlur to true', function ()
        {
            expect(manager.pauseOnBlur).toBe(true);
        });

        it('should default _rate to 1', function ()
        {
            expect(manager._rate).toBe(1);
        });

        it('should default _detune to 0', function ()
        {
            expect(manager._detune).toBe(0);
        });

        it('should default locked to false', function ()
        {
            expect(manager.locked).toBe(false);
        });

        it('should default unlocked to false', function ()
        {
            expect(manager.unlocked).toBe(false);
        });

        it('should default gameLostFocus to false', function ()
        {
            expect(manager.gameLostFocus).toBe(false);
        });

        it('should initialise listenerPosition as a Vector2 at origin', function ()
        {
            expect(manager.listenerPosition).not.toBeNull();
            expect(manager.listenerPosition.x).toBe(0);
            expect(manager.listenerPosition.y).toBe(0);
        });

        it('should register event listeners on game events', function ()
        {
            var registered = [];
            game = createMockGame();
            game.events.on = function (event)
            {
                registered.push(event);
            };
            game.events.once = function (event)
            {
                registered.push(event);
            };

            var m = new BaseSoundManager(game);

            expect(registered).toContain('blur');
            expect(registered).toContain('focus');
            expect(registered).toContain('prestep');
            expect(registered).toContain('destroy');

            m.game = null;
        });
    });

    describe('get', function ()
    {
        it('should return null when sounds array is empty', function ()
        {
            expect(manager.get('music')).toBeNull();
        });

        it('should return the first sound matching the key', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('music');
            manager.sounds.push(s1, s2);

            expect(manager.get('music')).toBe(s1);
        });

        it('should return null when no sound matches the key', function ()
        {
            manager.sounds.push(createMockSound('sfx'));

            expect(manager.get('music')).toBeNull();
        });
    });

    describe('getAll', function ()
    {
        it('should return empty array when sounds array is empty', function ()
        {
            expect(manager.getAll()).toEqual([]);
        });

        it('should return all sounds when no key is given', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);

            var result = manager.getAll();

            expect(result.length).toBe(2);
        });

        it('should return only sounds matching the given key', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            var s3 = createMockSound('music');
            manager.sounds.push(s1, s2, s3);

            var result = manager.getAll('music');

            expect(result.length).toBe(2);
            expect(result[0]).toBe(s1);
            expect(result[1]).toBe(s3);
        });

        it('should return empty array when no sounds match the key', function ()
        {
            manager.sounds.push(createMockSound('sfx'));

            expect(manager.getAll('music')).toEqual([]);
        });
    });

    describe('getAllPlaying', function ()
    {
        it('should return empty array when no sounds are playing', function ()
        {
            manager.sounds.push(createMockSound('music', false));
            manager.sounds.push(createMockSound('sfx', false));

            expect(manager.getAllPlaying()).toEqual([]);
        });

        it('should return only playing sounds', function ()
        {
            var s1 = createMockSound('music', true);
            var s2 = createMockSound('sfx', false);
            var s3 = createMockSound('ambient', true);
            manager.sounds.push(s1, s2, s3);

            var result = manager.getAllPlaying();

            expect(result.length).toBe(2);
            expect(result).toContain(s1);
            expect(result).toContain(s3);
        });

        it('should return empty array when sounds array is empty', function ()
        {
            expect(manager.getAllPlaying()).toEqual([]);
        });
    });

    describe('remove', function ()
    {
        it('should return false when sound is not in the manager', function ()
        {
            var sound = createMockSound('music');
            expect(manager.remove(sound)).toBe(false);
        });

        it('should return true and remove sound from the array', function ()
        {
            var sound = createMockSound('music');
            manager.sounds.push(sound);

            var result = manager.remove(sound);

            expect(result).toBe(true);
            expect(manager.sounds.length).toBe(0);
        });

        it('should call destroy on the removed sound', function ()
        {
            var sound = createMockSound('music');
            manager.sounds.push(sound);
            manager.remove(sound);

            expect(sound.destroyCalled).toBe(true);
        });

        it('should only remove the specified sound, leaving others intact', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.remove(s1);

            expect(manager.sounds.length).toBe(1);
            expect(manager.sounds[0]).toBe(s2);
        });
    });

    describe('removeAll', function ()
    {
        it('should destroy all sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.removeAll();

            expect(s1.destroyCalled).toBe(true);
            expect(s2.destroyCalled).toBe(true);
        });

        it('should empty the sounds array', function ()
        {
            manager.sounds.push(createMockSound('music'), createMockSound('sfx'));
            manager.removeAll();

            expect(manager.sounds.length).toBe(0);
        });

        it('should work when sounds array is already empty', function ()
        {
            expect(function () { manager.removeAll(); }).not.toThrow();
        });
    });

    describe('removeByKey', function ()
    {
        it('should return 0 when no sounds match the key', function ()
        {
            manager.sounds.push(createMockSound('sfx'));

            expect(manager.removeByKey('music')).toBe(0);
        });

        it('should return the number of removed sounds', function ()
        {
            manager.sounds.push(createMockSound('music'));
            manager.sounds.push(createMockSound('music'));
            manager.sounds.push(createMockSound('sfx'));

            expect(manager.removeByKey('music')).toBe(2);
        });

        it('should destroy removed sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.removeByKey('music');

            expect(s1.destroyCalled).toBe(true);
            expect(s2.destroyCalled).toBe(false);
        });

        it('should only remove sounds matching the key', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            var s3 = createMockSound('music');
            manager.sounds.push(s1, s2, s3);
            manager.removeByKey('music');

            expect(manager.sounds.length).toBe(1);
            expect(manager.sounds[0]).toBe(s2);
        });

        it('should return 0 when sounds array is empty', function ()
        {
            expect(manager.removeByKey('music')).toBe(0);
        });
    });

    describe('pauseAll', function ()
    {
        it('should call pause on all active sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.pauseAll();

            expect(s1.pauseCalled).toBe(true);
            expect(s2.pauseCalled).toBe(true);
        });

        it('should not pause sounds marked for removal', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            s2.pendingRemove = true;
            manager.sounds.push(s1, s2);
            manager.pauseAll();

            expect(s1.pauseCalled).toBe(true);
            expect(s2.pauseCalled).toBe(false);
        });

        it('should emit PAUSE_ALL event', function ()
        {
            var emitted = false;
            manager.on('pauseall', function () { emitted = true; });
            manager.pauseAll();

            expect(emitted).toBe(true);
        });
    });

    describe('resumeAll', function ()
    {
        it('should call resume on all active sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.resumeAll();

            expect(s1.resumeCalled).toBe(true);
            expect(s2.resumeCalled).toBe(true);
        });

        it('should not resume sounds marked for removal', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            s2.pendingRemove = true;
            manager.sounds.push(s1, s2);
            manager.resumeAll();

            expect(s1.resumeCalled).toBe(true);
            expect(s2.resumeCalled).toBe(false);
        });

        it('should emit RESUME_ALL event', function ()
        {
            var emitted = false;
            manager.on('resumeall', function () { emitted = true; });
            manager.resumeAll();

            expect(emitted).toBe(true);
        });
    });

    describe('stopAll', function ()
    {
        it('should call stop on all active sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.stopAll();

            expect(s1.stopCalled).toBe(true);
            expect(s2.stopCalled).toBe(true);
        });

        it('should not stop sounds marked for removal', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            s2.pendingRemove = true;
            manager.sounds.push(s1, s2);
            manager.stopAll();

            expect(s1.stopCalled).toBe(true);
            expect(s2.stopCalled).toBe(false);
        });

        it('should emit STOP_ALL event', function ()
        {
            var emitted = false;
            manager.on('stopall', function () { emitted = true; });
            manager.stopAll();

            expect(emitted).toBe(true);
        });
    });

    describe('stopByKey', function ()
    {
        it('should return 0 when no sounds match the key', function ()
        {
            manager.sounds.push(createMockSound('sfx'));

            expect(manager.stopByKey('music')).toBe(0);
        });

        it('should stop sounds matching the key and return count', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('music');
            var s3 = createMockSound('sfx');
            manager.sounds.push(s1, s2, s3);

            expect(manager.stopByKey('music')).toBe(2);
            expect(s1.stopCalled).toBe(true);
            expect(s2.stopCalled).toBe(true);
            expect(s3.stopCalled).toBe(false);
        });

        it('should return 0 when sounds array is empty', function ()
        {
            expect(manager.stopByKey('music')).toBe(0);
        });
    });

    describe('isPlaying', function ()
    {
        it('should return false when no sounds are playing and no key given', function ()
        {
            manager.sounds.push(createMockSound('music', false));
            expect(manager.isPlaying(undefined)).toBe(false);
        });

        it('should return true when any sound is playing and no key given', function ()
        {
            manager.sounds.push(createMockSound('music', false));
            manager.sounds.push(createMockSound('sfx', true));
            expect(manager.isPlaying(undefined)).toBe(true);
        });

        it('should return false when sounds array is empty and no key given', function ()
        {
            expect(manager.isPlaying(undefined)).toBe(false);
        });

        it('should return false when no sound with given key is playing', function ()
        {
            manager.sounds.push(createMockSound('music', false));
            expect(manager.isPlaying('music')).toBe(false);
        });

        it('should return true when a sound with given key is playing', function ()
        {
            manager.sounds.push(createMockSound('sfx', false));
            manager.sounds.push(createMockSound('music', true));
            expect(manager.isPlaying('music')).toBe(true);
        });

        it('should return false when key does not match any sound', function ()
        {
            manager.sounds.push(createMockSound('sfx', true));
            expect(manager.isPlaying('music')).toBe(false);
        });

        it('should return false when sounds array is empty and key given', function ()
        {
            expect(manager.isPlaying('music')).toBe(false);
        });
    });

    describe('update', function ()
    {
        it('should call update on all sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.update(100, 16);

            expect(s1.updateCalled).toBe(true);
            expect(s2.updateCalled).toBe(true);
        });

        it('should remove sounds with pendingRemove set', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            s1.pendingRemove = true;
            manager.sounds.push(s1, s2);
            manager.update(100, 16);

            expect(manager.sounds.length).toBe(1);
            expect(manager.sounds[0]).toBe(s2);
        });

        it('should emit UNLOCKED event and clear flags when unlocked is true', function ()
        {
            var emitted = false;
            manager.on('unlocked', function () { emitted = true; });
            manager.unlocked = true;
            manager.locked = true;
            manager.update(100, 16);

            expect(emitted).toBe(true);
            expect(manager.unlocked).toBe(false);
            expect(manager.locked).toBe(false);
        });

        it('should not emit UNLOCKED event when unlocked is false', function ()
        {
            var emitted = false;
            manager.on('unlocked', function () { emitted = true; });
            manager.unlocked = false;
            manager.update(100, 16);

            expect(emitted).toBe(false);
        });
    });

    describe('destroy', function ()
    {
        it('should destroy all sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);

            game.events.off = function () {};
            manager.destroy();

            expect(s1.destroyCalled).toBe(true);
            expect(s2.destroyCalled).toBe(true);
        });

        it('should set sounds to null', function ()
        {
            game.events.off = function () {};
            manager.destroy();

            expect(manager.sounds).toBeNull();
        });

        it('should set listenerPosition to null', function ()
        {
            game.events.off = function () {};
            manager.destroy();

            expect(manager.listenerPosition).toBeNull();
        });

        it('should set game to null', function ()
        {
            game.events.off = function () {};
            manager.destroy();

            expect(manager.game).toBeNull();
        });

        it('should deregister game event listeners', function ()
        {
            var removedEvents = [];
            game.events.off = function (event)
            {
                removedEvents.push(event);
            };
            manager.destroy();

            expect(removedEvents).toContain('blur');
            expect(removedEvents).toContain('focus');
            expect(removedEvents).toContain('prestep');
        });
    });

    describe('setRate', function ()
    {
        it('should set the rate property', function ()
        {
            manager.setRate(2);

            expect(manager.rate).toBe(2);
        });

        it('should return the manager for chaining', function ()
        {
            var result = manager.setRate(1.5);

            expect(result).toBe(manager);
        });

        it('should call calculateRate on all active sounds', function ()
        {
            var s1 = createMockSound('music');
            var s2 = createMockSound('sfx');
            manager.sounds.push(s1, s2);
            manager.setRate(0.5);

            expect(s1.calculateRateCalled).toBe(true);
            expect(s2.calculateRateCalled).toBe(true);
        });

        it('should emit GLOBAL_RATE event with the manager and value', function ()
        {
            var emittedManager = null;
            var emittedValue = null;
            manager.on('rate', function (mgr, val)
            {
                emittedManager = mgr;
                emittedValue = val;
            });
            manager.setRate(2);

            expect(emittedManager).toBe(manager);
            expect(emittedValue).toBe(2);
        });
    });

    describe('rate getter/setter', function ()
    {
        it('should default to 1', function ()
        {
            expect(manager.rate).toBe(1);
        });

        it('should update _rate when set', function ()
        {
            manager.rate = 0.5;

            expect(manager._rate).toBeCloseTo(0.5);
        });

        it('should return _rate via getter', function ()
        {
            manager._rate = 1.5;

            expect(manager.rate).toBeCloseTo(1.5);
        });

        it('should not call calculateRate on sounds with pendingRemove', function ()
        {
            var s1 = createMockSound('music');
            s1.pendingRemove = true;
            manager.sounds.push(s1);
            manager.rate = 2;

            expect(s1.calculateRateCalled).toBe(false);
        });
    });

    describe('setDetune', function ()
    {
        it('should set the detune property', function ()
        {
            manager.setDetune(100);

            expect(manager.detune).toBe(100);
        });

        it('should return the manager for chaining', function ()
        {
            var result = manager.setDetune(50);

            expect(result).toBe(manager);
        });

        it('should call calculateRate on all active sounds', function ()
        {
            var s1 = createMockSound('music');
            manager.sounds.push(s1);
            manager.setDetune(200);

            expect(s1.calculateRateCalled).toBe(true);
        });

        it('should emit GLOBAL_DETUNE event with manager and value', function ()
        {
            var emittedManager = null;
            var emittedValue = null;
            manager.on('detune', function (mgr, val)
            {
                emittedManager = mgr;
                emittedValue = val;
            });
            manager.setDetune(-400);

            expect(emittedManager).toBe(manager);
            expect(emittedValue).toBe(-400);
        });
    });

    describe('detune getter/setter', function ()
    {
        it('should default to 0', function ()
        {
            expect(manager.detune).toBe(0);
        });

        it('should update _detune when set', function ()
        {
            manager.detune = 300;

            expect(manager._detune).toBe(300);
        });

        it('should return _detune via getter', function ()
        {
            manager._detune = -100;

            expect(manager.detune).toBe(-100);
        });

        it('should accept negative values', function ()
        {
            manager.setDetune(-1200);

            expect(manager.detune).toBe(-1200);
        });

        it('should accept positive values', function ()
        {
            manager.setDetune(1200);

            expect(manager.detune).toBe(1200);
        });
    });

    describe('onBlur / onFocus (NOOP stubs)', function ()
    {
        it('should expose onBlur as a callable method', function ()
        {
            expect(typeof manager.onBlur).toBe('function');
            expect(function () { manager.onBlur(); }).not.toThrow();
        });

        it('should expose onFocus as a callable method', function ()
        {
            expect(typeof manager.onFocus).toBe('function');
            expect(function () { manager.onFocus(); }).not.toThrow();
        });
    });

    describe('unlock (NOOP stub)', function ()
    {
        it('should expose unlock as a callable method', function ()
        {
            expect(typeof manager.unlock).toBe('function');
            expect(function () { manager.unlock(); }).not.toThrow();
        });
    });

    describe('setListenerPosition (NOOP stub)', function ()
    {
        it('should expose setListenerPosition as a callable method', function ()
        {
            expect(typeof manager.setListenerPosition).toBe('function');
            expect(function () { manager.setListenerPosition(100, 200); }).not.toThrow();
        });
    });

    describe('play', function ()
    {
        it('should call add and play the returned sound', function ()
        {
            var mockSound = createMockSound('music');
            manager.add = function (key)
            {
                return mockSound;
            };

            var result = manager.play('music');

            expect(result).toBe(true);
            expect(mockSound.onceCalled).toBe(true);
        });

        it('should play with extra config when no name is provided', function ()
        {
            var mockSound = createMockSound('music');
            var extraConfig = { volume: 0.5 };
            manager.add = function (key)
            {
                return mockSound;
            };

            manager.play('music', extraConfig);

            expect(mockSound.playArg).toBe(extraConfig);
        });

        it('should addMarker and play by name when extra has a name property', function ()
        {
            var mockSound = createMockSound('music');
            var extra = { name: 'intro', start: 0, duration: 2 };
            manager.add = function (key)
            {
                return mockSound;
            };

            manager.play('music', extra);

            expect(mockSound.addMarkerCalled).toBe(true);
            expect(mockSound.playArg).toBe('intro');
        });
    });

    describe('playAudioSprite', function ()
    {
        it('should call addAudioSprite, register complete listener, and play the sprite name', function ()
        {
            var mockSound = createMockSound('sfx');
            manager.addAudioSprite = function (key)
            {
                return mockSound;
            };

            var result = manager.playAudioSprite('sfx', 'explosion');

            expect(result).toBe(true);
            expect(mockSound.onceCalled).toBe(true);
            expect(mockSound.playArg).toBe('explosion');
        });
    });

    describe('addAudioSprite', function ()
    {
        it('should call add and attach spritemap from jsonCache', function ()
        {
            var mockSound = createMockSound('sfx');
            mockSound.spritemap = null;
            manager.add = function (key, config)
            {
                return mockSound;
            };

            manager.addAudioSprite('sfx');

            expect(mockSound.spritemap).not.toBeNull();
            expect(typeof mockSound.spritemap).toBe('object');
        });

        it('should call addMarker for each spritemap entry', function ()
        {
            var mockSound = createMockSound('sfx');
            manager.add = function (key, config)
            {
                return mockSound;
            };

            manager.addAudioSprite('sfx');

            // jsonCache returns markerA and markerB
            expect(mockSound.markers.length).toBe(2);
        });

        it('should set loop from spritemap marker when loop property exists', function ()
        {
            var mockSound = createMockSound('sfx');
            manager.add = function (key, config)
            {
                return mockSound;
            };

            manager.addAudioSprite('sfx');

            var markerB = mockSound.markers.find(function (m) { return m.name === 'markerB'; });
            expect(markerB.config.loop).toBe(true);
        });

        it('should default loop to false when marker has no loop property', function ()
        {
            var mockSound = createMockSound('sfx');
            manager.add = function (key, config)
            {
                return mockSound;
            };

            manager.addAudioSprite('sfx');

            var markerA = mockSound.markers.find(function (m) { return m.name === 'markerA'; });
            expect(markerA.config.loop).toBe(false);
        });

        it('should return the sound instance', function ()
        {
            var mockSound = createMockSound('sfx');
            manager.add = function (key, config)
            {
                return mockSound;
            };

            var result = manager.addAudioSprite('sfx');

            expect(result).toBe(mockSound);
        });
    });
});
