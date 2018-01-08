var Class = require('../../utils/Class');
var BaseSoundManager = require('../BaseSoundManager');
var HTML5AudioSound = require('./HTML5AudioSound');
var HTML5AudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function HTML5AudioSoundManager(game) {
        this.onBlurPausedSounds = [];
        this._mute = false;
        this._volume = 1;
        BaseSoundManager.call(this, game);
    },
    add: function (key, config) {
        var sound = new HTML5AudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    },
    onBlur: function () {
        this.forEachActiveSound(function (sound) {
            if (sound.isPlaying) {
                this.onBlurPausedSounds.push(sound);
                sound.pause();
            }
        });
    },
    onFocus: function () {
        this.onBlurPausedSounds.forEach(function (sound) {
            sound.resume();
        });
        this.onBlurPausedSounds.length = 0;
    },
    destroy: function () {
        BaseSoundManager.prototype.destroy.call(this);
        this.onBlurPausedSounds.length = 0;
        this.onBlurPausedSounds = null;
    }
});
Object.defineProperty(HTML5AudioSoundManager.prototype, 'mute', {
    get: function () {
        return this._mute;
    },
    set: function (value) {
        this._mute = value;
        this.forEachActiveSound(function (sound) {
            sound.setMute();
        });
    }
});
Object.defineProperty(HTML5AudioSoundManager.prototype, 'volume', {
    get: function () {
    },
    set: function (value) {
    }
});
module.exports = HTML5AudioSoundManager;
