var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var NoAudioSound = require('./NoAudioSound');
var BaseSoundManager = require('../BaseSoundManager');
var NOOP = require('../../utils/NOOP');
var NoAudioSoundManager = new Class({
    Extends: EventEmitter,
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
        this.unlocked = false;
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
    update: NOOP
});
module.exports = NoAudioSoundManager;
