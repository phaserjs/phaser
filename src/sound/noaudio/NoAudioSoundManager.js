var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var NoAudioSound = require('./NoAudioSound');
var BaseSoundManager = require('../BaseSoundManager');
var NOOP = require('../../utils/NOOP');
/*!
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */
var NoAudioSoundManager = new Class({
    Extends: EventEmitter,
    /**
     * No audio implementation of the sound manager. It is used if audio has been
     * disabled in the game config or the device doesn't support any audio.
     *
     * It represents a graceful degradation of sound manager logic that provides
     * minimal functionality and prevents Phaser projects that use audio from
     * breaking on devices that don't support any audio playback technologies.
     *
     * @class Phaser.Sound.NoAudioSoundManager
     * @constructor
     * @param {Phaser.Game} game - Reference to the current game instance.
     */
    initialize: function NoAudioSoundManager(game) {
        EventEmitter.call(this);
        this.game = game;
        this.sounds = [];
        this.mute = false;
        this.volume = 1;
        this.rate = 1;
        this.detune = 0;
        this.pauseOnBlur = true;
        this.locked = false;
    },
    add: function (key, config) {
        var sound = new NoAudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    },
    addAudioSprite: function (key, config) {
        var sound = this.add(key, config);
        sound.spritemap = {};
        return sound;
    },
    play: function (key, extra) {
        return false;
    },
    playAudioSprite: function (key, spriteName, config) {
        return false;
    },
    remove: function (sound) {
        return BaseSoundManager.prototype.remove.call(this, sound);
    },
    removeByKey: function (key) {
        return BaseSoundManager.prototype.removeByKey.call(this, key);
    },
    pauseAll: NOOP,
    resumeAll: NOOP,
    stopAll: NOOP,
    update: NOOP,
    destroy: function () {
        BaseSoundManager.prototype.destroy.call(this);
    },
    forEachActiveSound: function (callbackfn, thisArg) {
        BaseSoundManager.prototype.forEachActiveSound.call(this, callbackfn, thisArg);
    }
});
module.exports = NoAudioSoundManager;
