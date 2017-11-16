var Class = require('../utils/Class');
var BaseSound = require('./BaseSound');
//  Phaser.Sound.WebAudioSound
var WebAudioSound = new Class({
    Extends: BaseSound,
    initialize: function WebAudioSound(manager, key, config) {
        /**
         * [description]
         *
         * @property {AudioBuffer} audioBuffer
         */
        this.audioBuffer = manager.game.cache.audio.get(key);
        if (!this.audioBuffer) {
            console.error('No audio loaded in cache with key: \'' + key + '\'!');
            return;
        }
        /**
         * [description]
         *
         * @property {AudioBufferSourceNode} source
         */
        this.source = null;
        /**
         * [description]
         *
         * @property {GainNode} muteNode
         */
        this.muteNode = manager.context.createGain();
        /**
         * [description]
         *
         * @property {GainNode} volumeNode
         */
        this.volumeNode = manager.context.createGain();
        this.muteNode.connect(this.volumeNode);
        this.volumeNode.connect(manager.destination);
        if (config === void 0) {
            config = {};
        }
        config.duration = this.audioBuffer.duration;
        BaseSound.call(this, manager, key, config);
    },
    play: function (marker, config) {
        if (!BaseSound.prototype.play.call(this, marker, config)) {
            return null;
        }
        this.source = this.manager.context.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.muteNode);
        this.applyConfig();
        this.source.start();
        return this;
    },
    pause: function () {
        return this;
    },
    resume: function () {
        return this;
    },
    stop: function () {
        return this;
    },
    update: function () {
    },
    destroy: function () {
    }
});
/**
 * Mute setting.
 * @property {boolean} mute
 */
Object.defineProperty(WebAudioSound.prototype, 'mute', {
    get: function () {
        return this.muteNode.gain.value === 0;
    },
    set: function (value) {
        this.currentConfig.mute = value;
        this.muteNode.gain.value = value ? 0 : 1;
    }
});
/**
 * Volume setting.
 * @property {number} volume
 */
Object.defineProperty(WebAudioSound.prototype, 'volume', {
    get: function () {
        return this.volumeNode.gain.value;
    },
    set: function (value) {
        this.currentConfig.volume = value;
        this.volumeNode.gain.value = value;
    }
});
/**
 * Playback rate.
 * @property {number} rate
 */
Object.defineProperty(WebAudioSound.prototype, 'rate', {
    get: function () {
        return this.currentConfig.rate;
    },
    set: function (value) {
        this.currentConfig.rate = value;
        if (this.source) {
            this.source.playbackRate.value = value * this.manager.rate;
        }
    }
});
module.exports = WebAudioSound;
