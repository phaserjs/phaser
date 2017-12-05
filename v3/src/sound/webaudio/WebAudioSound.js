var Class = require('../../utils/Class');
var BaseSound = require('../BaseSound');
//  Phaser.Sound.WebAudioSound
// TODO support webkitAudioContext implementation differences
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Porting_webkitAudioContext_code_to_standards_based_AudioContext
var WebAudioSound = new Class({
    Extends: BaseSound,
    initialize: function WebAudioSound(manager, key, config) {
        if (config === void 0) { config = {}; }
        /**
         * [description]
         *
         * @private
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
         * @private
         * @property {AudioBufferSourceNode} source
         */
        this.source = null;
        /**
         * [description]
         *
         * @private
         * @property {GainNode} muteNode
         */
        this.muteNode = manager.context.createGain();
        /**
         * [description]
         *
         * @private
         * @property {GainNode} volumeNode
         */
        this.volumeNode = manager.context.createGain();
        /**
         * The time the previous playback started at based on
         * BaseAudioContext.currentTime value.
         *
         * @private
         * @property {number} startTime
         */
        this.startTime = 0;
        /**
         * Relative time when sound was paused.
         * Corresponds to the seek value at the time when pause() method was called on this sound.
         *
         * @private
         * @property {number} pausedTime
         */
        this.pausedTime = 0;
        /**
         * An array where we keep track of all rate updates during playback.
         *
         * @private
         * @property {{ time: number, rate: number }[]} rateUpdates
         */
        this.rateUpdates = [];
        /**
         * Used for keeping track when sound source playback has ended
         * so it's state can be updated accordingly.
         *
         * @private
         * @property {boolean} hasEnded
         */
        this.hasEnded = false;
        this.muteNode.connect(this.volumeNode);
        this.volumeNode.connect(manager.destination);
        BaseSound.call(this, manager, key, config);
        this.duration = this.audioBuffer.duration;
        this.totalDuration = this.audioBuffer.duration;
    },
    play: function (markerName, config) {
        if (!BaseSound.prototype.play.call(this, markerName, config)) {
            return null;
        }
        this.stopAndRemoveBufferSource();
        var seek = this.currentConfig.seek;
        var offset = (this.currentMarker ? this.currentMarker.start : 0) + seek;
        var duration = this.duration - seek;
        this.createAndStartBufferSource(offset, duration);
        this.startTime = this.manager.context.currentTime - seek;
        this.pausedTime = 0;
        return this;
    },
    pause: function () {
        if (!BaseSound.prototype.pause.call(this)) {
            return false;
        }
        this.stopAndRemoveBufferSource();
        this.pausedTime = this.manager.context.currentTime - this.startTime;
        return true;
    },
    resume: function () {
        if (!BaseSound.prototype.resume.call(this)) {
            return false;
        }
        // TODO take in account playback rate
        var offset = (this.currentMarker ? this.currentMarker.start : 0) + this.pausedTime;
        var duration = this.duration - this.pausedTime;
        this.createAndStartBufferSource(offset, duration);
        this.startTime = this.manager.context.currentTime - this.pausedTime;
        this.pausedTime = 0;
        return true;
    },
    stop: function () {
        if (!BaseSound.prototype.stop.call(this)) {
            return false;
        }
        this.stopAndRemoveBufferSource();
        this.startTime = 0;
        this.pausedTime = 0;
        return true;
    },
    /**
     * Used internally to do what the name says.
     *
     * @private
     * @param {number} offset
     * @param {number} duration
     */
    // TODO add when param
    createAndStartBufferSource: function (offset, duration) {
        this.source = this.manager.context.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.muteNode);
        this.rateUpdates.length = 0;
        this.applyConfig();
        this.source.onended = function (ev) {
            if (ev.target === this.source) {
                // sound ended
                this.hasEnded = true;
            }
            // else was stopped
        }.bind(this);
        this.source.start(0, Math.max(0, offset), Math.max(0, duration));
    },
    /**
     * Used internally to do what the name says.
     *
     * @private
     */
    stopAndRemoveBufferSource: function () {
        if (this.source) {
            this.source.stop();
            this.source = null;
        }
    },
    /**
     * Update method called on every game step.
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: function (time, delta) {
        if (this.hasEnded) {
            this.hasEnded = false;
            this.stop();
        }
    },
    destroy: function () {
    },
    /**
     * @private
     */
    setRate: function () {
        BaseSound.prototype.setRate.call(this);
        if (this.source) {
            this.source.playbackRate.setValueAtTime(this.totalRate, 0);
        }
        if (this.isPlaying) {
            this.rateUpdates.push({
                time: this.manager.context.currentTime - this.startTime,
                rate: this.totalRate
            });
        }
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
        this.muteNode.gain.setValueAtTime(value ? 0 : 1, 0);
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
        this.volumeNode.gain.setValueAtTime(value, 0);
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
        this.setRate();
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
        this.setRate();
    }
});
/**
 * Current position of playing sound.
 * @property {number} seek
 */
Object.defineProperty(WebAudioSound.prototype, 'seek', {
    get: function () {
    },
    set: function (value) {
    }
});
module.exports = WebAudioSound;
