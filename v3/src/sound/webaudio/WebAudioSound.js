var Class = require('../../utils/Class');
var BaseSound = require('../BaseSound');
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
        /**
         * The time the previous playback started at based on
         * BaseAudioContext.currentTime value.
         *
         * @property {number} startTime
         */
        this.startTime = 0;
        /**
         * Relative time when sound was paused.
         * Corresponds to the seek value at the time when pause() method was called on this sound.
         *
         * @property {number} pausedTime
         */
        this.pausedTime = 0;
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
        if (this.source) {
            this.source.stop();
        }
        this.source = this.manager.context.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.muteNode);
        this.applyConfig();
        this.source.start();
        this.startTime = this.manager.context.currentTime;
        this.pausedTime = 0;
        return this;
    },
    pause: function () {
        BaseSound.prototype.pause.call(this);
        this.pausedTime = this.manager.context.currentTime - this.startTime;
        return this;
    },
    resume: function () {
        BaseSound.prototype.resume.call(this);
        this.startTime = this.manager.context.currentTime - this.pausedTime;
        this.pausedTime = 0;
        return this;
    },
    stop: function () {
        BaseSound.prototype.stop.call(this);
        this.source.stop();
        this.source = null;
        this.startTime = 0;
        this.pausedTime = 0;
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
/**
 * Detuning of sound.
 * @property {number} detune
 */
Object.defineProperty(WebAudioSound.prototype, 'detune', {
    get: function () {
        return this.currentConfig.detune;
    },
    set: function (value) {
        this.currentConfig.detune = value;
        if (this.source) {
            this.source.detune.value =
                Math.max(-1200, Math.min(value + this.manager.detune, 1200));
        }
    }
});
module.exports = WebAudioSound;
