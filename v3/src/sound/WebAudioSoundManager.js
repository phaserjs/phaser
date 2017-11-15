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
         * @property {GainNode} masterVolumeNode
         */
        this.masterVolumeNode = this.context.createGain();
        /**
         * Destination node for connecting individual sounds to.
         *
         * @property {AudioNode} destination
         */
        this.destination = this.masterVolumeNode;
        /**
         * [description]
         *
         * @property {GainNode} masterMuteNode
         */
        this.masterMuteNode = this.context.createGain();
        this.masterVolumeNode.connect(this.masterMuteNode);
        this.masterMuteNode.connect(this.context.destination);
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
module.exports = WebAudioSoundManager;
