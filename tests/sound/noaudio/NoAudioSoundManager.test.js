var NoAudioSoundManager = require('../../../src/sound/noaudio/NoAudioSoundManager');
var NoAudioSound = require('../../../src/sound/noaudio/NoAudioSound');

function createMockGame ()
{
    return {
        events: {
            off: vi.fn(),
            on: vi.fn(),
            once: vi.fn()
        }
    };
}

describe('NoAudioSoundManager', function ()
{
    var manager;
    var mockGame;

    beforeEach(function ()
    {
        mockGame = createMockGame();
        manager = new NoAudioSoundManager(mockGame);
    });

    describe('constructor', function ()
    {
        it('should store the game reference', function ()
        {
            expect(manager.game).toBe(mockGame);
        });

        it('should initialise sounds as an empty array', function ()
        {
            expect(Array.isArray(manager.sounds)).toBe(true);
            expect(manager.sounds.length).toBe(0);
        });

        it('should set mute to false', function ()
        {
            expect(manager.mute).toBe(false);
        });

        it('should set volume to 1', function ()
        {
            expect(manager.volume).toBe(1);
        });

        it('should set rate to 1', function ()
        {
            expect(manager.rate).toBe(1);
        });

        it('should set detune to 0', function ()
        {
            expect(manager.detune).toBe(0);
        });

        it('should set pauseOnBlur to true', function ()
        {
            expect(manager.pauseOnBlur).toBe(true);
        });

        it('should set locked to false', function ()
        {
            expect(manager.locked).toBe(false);
        });
    });

    describe('add', function ()
    {
        it('should return a NoAudioSound instance', function ()
        {
            var sound = manager.add('testKey');

            expect(sound).toBeInstanceOf(NoAudioSound);
        });

        it('should store the key on the returned sound', function ()
        {
            var sound = manager.add('mySound');

            expect(sound.key).toBe('mySound');
        });

        it('should push the sound into the sounds array', function ()
        {
            manager.add('testKey');

            expect(manager.sounds.length).toBe(1);
        });

        it('should add multiple sounds to the sounds array', function ()
        {
            manager.add('soundA');
            manager.add('soundB');
            manager.add('soundC');

            expect(manager.sounds.length).toBe(3);
        });

        it('should accept an optional config object', function ()
        {
            var sound = manager.add('testKey', { volume: 0.5, loop: true });

            expect(sound).toBeInstanceOf(NoAudioSound);
            expect(sound.key).toBe('testKey');
        });

        it('should set the manager reference on the sound', function ()
        {
            var sound = manager.add('testKey');

            expect(sound.manager).toBe(manager);
        });
    });

    describe('addAudioSprite', function ()
    {
        it('should return a NoAudioSound instance', function ()
        {
            var sound = manager.addAudioSprite('spriteKey');

            expect(sound).toBeInstanceOf(NoAudioSound);
        });

        it('should set spritemap to an empty object on the returned sound', function ()
        {
            var sound = manager.addAudioSprite('spriteKey');

            expect(sound.spritemap).toBeDefined();
            expect(typeof sound.spritemap).toBe('object');
        });

        it('should push the sound into the sounds array', function ()
        {
            manager.addAudioSprite('spriteKey');

            expect(manager.sounds.length).toBe(1);
        });

        it('should store the key on the returned sound', function ()
        {
            var sound = manager.addAudioSprite('spriteKey');

            expect(sound.key).toBe('spriteKey');
        });
    });

    describe('get', function ()
    {
        it('should return null when no sounds have been added', function ()
        {
            expect(manager.get('missing')).toBeNull();
        });

        it('should return null when no sound with the given key exists', function ()
        {
            manager.add('otherKey');

            expect(manager.get('missing')).toBeNull();
        });

        it('should return the first sound matching the given key', function ()
        {
            var sound = manager.add('myKey');

            expect(manager.get('myKey')).toBe(sound);
        });

        it('should return only the first match when multiple sounds share the same key', function ()
        {
            var first = manager.add('sharedKey');
            manager.add('sharedKey');

            expect(manager.get('sharedKey')).toBe(first);
        });

        it('should not return a sound with a different key', function ()
        {
            manager.add('keyA');

            expect(manager.get('keyB')).toBeNull();
        });
    });

    describe('getAll', function ()
    {
        it('should return an empty array when no sounds have been added', function ()
        {
            var result = manager.getAll('anything');

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return all sounds matching the given key', function ()
        {
            var a = manager.add('myKey');
            var b = manager.add('myKey');
            manager.add('otherKey');

            var result = manager.getAll('myKey');

            expect(result.length).toBe(2);
            expect(result).toContain(a);
            expect(result).toContain(b);
        });

        it('should return an empty array when no sounds match the key', function ()
        {
            manager.add('keyA');

            expect(manager.getAll('keyB').length).toBe(0);
        });

        it('should return all sounds when called without a key', function ()
        {
            manager.add('keyA');
            manager.add('keyB');

            var result = manager.getAll();

            expect(result.length).toBe(2);
        });
    });

    describe('play', function ()
    {
        it('should always return false', function ()
        {
            expect(manager.play('anyKey')).toBe(false);
        });

        it('should return false when called with extra config', function ()
        {
            expect(manager.play('anyKey', { volume: 0.5 })).toBe(false);
        });

        it('should return false when called with no arguments', function ()
        {
            expect(manager.play()).toBe(false);
        });
    });

    describe('playAudioSprite', function ()
    {
        it('should always return false', function ()
        {
            expect(manager.playAudioSprite('key', 'spriteName')).toBe(false);
        });

        it('should return false with config argument', function ()
        {
            expect(manager.playAudioSprite('key', 'spriteName', { volume: 1 })).toBe(false);
        });

        it('should return false when called with no arguments', function ()
        {
            expect(manager.playAudioSprite()).toBe(false);
        });
    });

    describe('remove', function ()
    {
        it('should return true when a sound is successfully removed', function ()
        {
            var sound = manager.add('testKey');

            expect(manager.remove(sound)).toBe(true);
        });

        it('should remove the sound from the sounds array', function ()
        {
            var sound = manager.add('testKey');
            manager.remove(sound);

            expect(manager.sounds.length).toBe(0);
        });

        it('should return false when the sound is not in the manager', function ()
        {
            var sound = new NoAudioSound(manager, 'testKey');

            expect(manager.remove(sound)).toBe(false);
        });

        it('should only remove the specified sound', function ()
        {
            var a = manager.add('keyA');
            var b = manager.add('keyB');
            manager.remove(a);

            expect(manager.sounds.length).toBe(1);
            expect(manager.sounds[0]).toBe(b);
        });
    });

    describe('removeAll', function ()
    {
        it('should remove all sounds from the sounds array', function ()
        {
            manager.add('keyA');
            manager.add('keyB');
            manager.add('keyC');
            manager.removeAll();

            expect(manager.sounds.length).toBe(0);
        });

        it('should work when there are no sounds', function ()
        {
            expect(function () { manager.removeAll(); }).not.toThrow();
            expect(manager.sounds.length).toBe(0);
        });
    });

    describe('removeByKey', function ()
    {
        it('should return the number of removed sounds', function ()
        {
            manager.add('targetKey');
            manager.add('targetKey');
            manager.add('otherKey');

            expect(manager.removeByKey('targetKey')).toBe(2);
        });

        it('should remove only sounds with the matching key', function ()
        {
            manager.add('targetKey');
            manager.add('targetKey');
            var kept = manager.add('otherKey');
            manager.removeByKey('targetKey');

            expect(manager.sounds.length).toBe(1);
            expect(manager.sounds[0]).toBe(kept);
        });

        it('should return zero when no sounds match the key', function ()
        {
            manager.add('differentKey');

            expect(manager.removeByKey('missing')).toBe(0);
        });

        it('should return zero when the sounds array is empty', function ()
        {
            expect(manager.removeByKey('anyKey')).toBe(0);
        });
    });

    describe('stopByKey', function ()
    {
        it('should return zero because NoAudioSound.stop always returns false', function ()
        {
            manager.add('myKey');
            manager.add('myKey');

            expect(manager.stopByKey('myKey')).toBe(0);
        });

        it('should return zero when no sounds match the key', function ()
        {
            manager.add('otherKey');

            expect(manager.stopByKey('missing')).toBe(0);
        });

        it('should return zero when the sounds array is empty', function ()
        {
            expect(manager.stopByKey('anyKey')).toBe(0);
        });
    });

    describe('NOOP methods', function ()
    {
        it('should call onBlur without throwing', function ()
        {
            expect(function () { manager.onBlur(); }).not.toThrow();
        });

        it('should call onFocus without throwing', function ()
        {
            expect(function () { manager.onFocus(); }).not.toThrow();
        });

        it('should call onGameBlur without throwing', function ()
        {
            expect(function () { manager.onGameBlur(); }).not.toThrow();
        });

        it('should call onGameFocus without throwing', function ()
        {
            expect(function () { manager.onGameFocus(); }).not.toThrow();
        });

        it('should call pauseAll without throwing', function ()
        {
            expect(function () { manager.pauseAll(); }).not.toThrow();
        });

        it('should call resumeAll without throwing', function ()
        {
            expect(function () { manager.resumeAll(); }).not.toThrow();
        });

        it('should call stopAll without throwing', function ()
        {
            expect(function () { manager.stopAll(); }).not.toThrow();
        });

        it('should call update without throwing', function ()
        {
            expect(function () { manager.update(1000, 16); }).not.toThrow();
        });

        it('should call setRate without throwing', function ()
        {
            expect(function () { manager.setRate(2); }).not.toThrow();
        });

        it('should call setDetune without throwing', function ()
        {
            expect(function () { manager.setDetune(100); }).not.toThrow();
        });

        it('should call setMute without throwing', function ()
        {
            expect(function () { manager.setMute(true); }).not.toThrow();
        });

        it('should call setVolume without throwing', function ()
        {
            expect(function () { manager.setVolume(0.5); }).not.toThrow();
        });

        it('should call unlock without throwing', function ()
        {
            expect(function () { manager.unlock(); }).not.toThrow();
        });
    });

    describe('destroy', function ()
    {
        it('should call game.events.off to remove event listeners', function ()
        {
            manager.destroy();

            expect(mockGame.events.off).toHaveBeenCalled();
        });

        it('should set game to null after destroy', function ()
        {
            manager.destroy();

            expect(manager.game).toBeNull();
        });

        it('should set sounds to null after destroy', function ()
        {
            manager.add('testKey');
            manager.destroy();

            expect(manager.sounds).toBeNull();
        });

        it('should work when sounds array is empty', function ()
        {
            expect(function () { manager.destroy(); }).not.toThrow();
        });

        it('should destroy all sounds before nulling the array', function ()
        {
            var sound = manager.add('testKey');
            manager.destroy();

            expect(sound.pendingRemove).toBe(true);
        });
    });
});
