var Class = require('../../utils/Class');
var BaseSoundManager = require('../BaseSoundManager');
var WebAudioSound = require('./WebAudioSound');
//  Phaser.Loader.WebAudioSoundManager
var WebAudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function WebAudioSoundManager(game) {
        /**
         * Flag indicating if Web Audio implementation is webkit or standards based.
         * There are certain cases where they have to be handled differently.
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Porting_webkitAudioContext_code_to_standards_based_AudioContext
         *
         * @property {boolean} webkit
         */
        this.webkit = !!window['webkitAudioContext'] && !window['AudioContext'];
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
        this.unlock();
        BaseSoundManager.call(this, game);
    },
    /**
     * @private
     * @param game
     * @returns {AudioContext}
     */
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
    },
    /**
     * @private
     */
    unlock: function () {
        var _this = this;
        if (this.context.state === 'suspended') {
            var unlock_1 = function () {
                document.body.removeEventListener('touchstart', unlock_1);
                _this.context.resume();
            };
            document.body.addEventListener('touchstart', unlock_1, false);
        }
    },
    onBlur: function () {
        this.context.suspend();
    },
    onFocus: function () {
        this.context.resume();
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
        this.masterMuteNode.gain.setValueAtTime(value ? 0 : 1, 0);
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
        this.masterVolumeNode.gain.setValueAtTime(value, 0);
    }
});
/**
 * Global detune.
 * @property {number} detune
 */
Object.defineProperty(WebAudioSoundManager.prototype, 'detune', {
    get: function () {
        return this._detune;
    },
    set: function (value) {
        this._detune = value;
        this.sounds.forEach(function (sound) {
            sound.setRate();
        }, this);
    }
});
module.exports = WebAudioSoundManager;
