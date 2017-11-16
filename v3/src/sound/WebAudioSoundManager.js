var Class = require('../utils/Class');
var BaseSoundManager = require('./BaseSoundManager');
var WebAudioSound = require('./WebAudioSound');
//  Phaser.Loader.WebAudioSoundManager
var WebAudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function WebAudioSoundManager(game) {
        /**
         * The AudioContext being used for playback.
         *
         * @property {AudioContext} context
         */
        this.context = this.createAudioContext(game);
        /**
         * [description]
         *
         * @property {GainNode} masterMuteNode
         */
        this.masterMuteNode = this.context.createGain();
        /**
         * [description]
         *
         * @property {GainNode} masterVolumeNode
         */
        this.masterVolumeNode = this.context.createGain();
        this.masterMuteNode.connect(this.masterVolumeNode);
        this.masterVolumeNode.connect(this.context.destination);
        /**
         * Destination node for connecting individual sounds to.
         *
         * @property {AudioNode} destination
         */
        this.destination = this.masterMuteNode;
        /**
         * Property that actually holds the value of global playback rate.
         *
         * @property {number} _rate
         * @private
         */
        this._rate = 1;
        /**
         * Property that actually holds the value of global detune.
         *
         * @property {number} _detune
         * @private
         */
        this._detune = 0;
        BaseSoundManager.call(this, game);
    },
    createAudioContext: function (game) {
        var audioConfig = game.config.audio;
        if (audioConfig && audioConfig.context) {
            return audioConfig.context;
        }
        return new (window['AudioContext'] || window['webkitAudioContext'])();
    },
    add: function (key, config) {
        var sound = new WebAudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    }
});
/**
 * Global mute setting.
 * @property {boolean} mute
 */
Object.defineProperty(WebAudioSoundManager.prototype, 'mute', {
    get: function () {
        return this.masterMuteNode.gain.value === 0;
    },
    set: function (value) {
        this.masterMuteNode.gain.value = value ? 0 : 1;
    }
});
/**
 * Global volume setting.
 * @property {number} volume
 */
Object.defineProperty(WebAudioSoundManager.prototype, 'volume', {
    get: function () {
        return this.masterVolumeNode.gain.value;
    },
    set: function (value) {
        this.masterVolumeNode.gain.value = value;
    }
});
/**
 * Global playback rate.
 * @property {number} rate
 */
Object.defineProperty(WebAudioSoundManager.prototype, 'rate', {
    get: function () {
        return this._rate;
    },
    set: function (value) {
        this._rate = value;
        this.sounds.forEach(function (sound) {
            // invoke sound's rate setter method to update
            // value based on new global rate value
            sound.rate = sound.rate;
        }, this);
    }
});
module.exports = WebAudioSoundManager;
