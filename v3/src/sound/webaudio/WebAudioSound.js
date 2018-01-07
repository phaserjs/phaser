var Class = require('../../utils/Class');
var BaseSound = require('../BaseSound');
var SoundEvent = require('../SoundEvent');
var SoundValueEvent = require('../SoundValueEvent');
/*!
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */
var WebAudioSound = new Class({
    Extends: BaseSound,
    /**
     * @class Phaser.Sound.WebAudioSound
     * @constructor
     * @param {Phaser.Sound.WebAudioSoundManager} manager - Reference to the current sound manager instance.
     * @param {string} key - Asset key for the sound.
     * @param {ISoundConfig} [config={}] - An optional config object containing default sound settings.
     */
    initialize: function WebAudioSound(manager, key, config) {
        if (config === void 0) { config = {}; }
        /**
         * Audio buffer containing decoded data of the audio asset to be played.
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
         * A reference to an audio source node used for playing back audio from
         * audio data stored in an Phaser.Sound.WebAudioSound#audioBuffer.
         *
         * @private
         * @property {AudioBufferSourceNode} source
         * @default null
         */
        this.source = null;
        /**
         * A reference to a second audio source used for gapless looped playback.
         *
         * @private
         * @property {AudioBufferSourceNode} loopSource
         * @default null
         */
        this.loopSource = null;
        /**
         * Gain node responsible for controlling this sound's muting.
         *
         * @private
         * @property {GainNode} muteNode
         */
        this.muteNode = manager.context.createGain();
        /**
         * Gain node responsible for controlling this sound's volume.
         *
         * @private
         * @property {GainNode} volumeNode
         */
        this.volumeNode = manager.context.createGain();
        /**
         * The time at which the sound should have started playback from the beginning.
         * Based on BaseAudioContext.currentTime value.
         *
         * @private
         * @property {number} playTime
         * @default 0
         */
        this.playTime = 0;
        /**
         * The time at which the sound source should have actually started playback.
         * Based on BaseAudioContext.currentTime value.
         *
         * @private
         * @property {number} startTime
         * @default 0
         */
        this.startTime = 0;
        /**
         * The time at which the sound loop source should actually start playback.
         * Based on BaseAudioContext.currentTime value.
         *
         * @private
         * @property {number} loopTime
         * @default 0
         */
        this.loopTime = 0;
        /**
         * An array where we keep track of all rate updates during playback.
         *
         * @private
         * @property {{ time: number, rate: number }[]} rateUpdates
         * @default []
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
        /**
         * Used for keeping track when sound source has looped
         * so it's state can be updated accordingly.
         *
         * @private
         * @property {boolean} hasLooped
         */
        this.hasLooped = false;
        this.muteNode.connect(this.volumeNode);
        this.volumeNode.connect(manager.destination);
        this.duration = this.audioBuffer.duration;
        this.totalDuration = this.audioBuffer.duration;
        BaseSound.call(this, manager, key, config);
    },
    play: function (markerName, config) {
        if (!BaseSound.prototype.play.call(this, markerName, config)) {
            return null;
        }
        //  \/\/\/ isPlaying = true, isPaused = false \/\/\/
        this.stopAndRemoveBufferSource();
        this.createAndStartBufferSource();
        this.events.dispatch(new SoundEvent(this, 'SOUND_PLAY'));
        return this;
    },
    pause: function () {
        if (this.manager.context.currentTime < this.startTime) {
            return false;
        }
        if (!BaseSound.prototype.pause.call(this)) {
            return false;
        }
        //  \/\/\/ isPlaying = false, isPaused = true \/\/\/
        this.currentConfig.seek = this.getCurrentTime(); // Equivalent to setting paused time
        this.stopAndRemoveBufferSource();
        this.events.dispatch(new SoundEvent(this, 'SOUND_PAUSE'));
        return true;
    },
    resume: function () {
        if (this.manager.context.currentTime < this.startTime) {
            return false;
        }
        if (!BaseSound.prototype.resume.call(this)) {
            return false;
        }
        //  \/\/\/ isPlaying = true, isPaused = false \/\/\/
        this.createAndStartBufferSource();
        this.events.dispatch(new SoundEvent(this, 'SOUND_RESUME'));
        return true;
    },
    stop: function () {
        if (!BaseSound.prototype.stop.call(this)) {
            return false;
        }
        //  \/\/\/ isPlaying = false, isPaused = false \/\/\/
        this.stopAndRemoveBufferSource();
        this.events.dispatch(new SoundEvent(this, 'SOUND_STOP'));
        return true;
    },
    /**
     * Used internally to do what the name says.
     *
     * @private
     */
    createAndStartBufferSource: function () {
        var seek = this.currentConfig.seek;
        var delay = this.currentConfig.delay;
        var when = this.manager.context.currentTime + delay;
        var offset = (this.currentMarker ? this.currentMarker.start : 0) + seek;
        var duration = this.duration - seek;
        this.playTime = when - seek;
        this.startTime = when;
        this.source = this.createBufferSource();
        this.applyConfig();
        this.source.start(Math.max(0, when), Math.max(0, offset), Math.max(0, duration));
        this.resetConfig();
    },
    /**
     * Used internally to do what the name says.
     *
     * @private
     */
    createAndStartLoopBufferSource: function () {
        var when = this.getLoopTime();
        var offset = this.currentMarker ? this.currentMarker.start : 0;
        var duration = this.duration;
        this.loopTime = when;
        this.loopSource = this.createBufferSource();
        this.loopSource.playbackRate.setValueAtTime(this.totalRate, 0);
        this.loopSource.start(Math.max(0, when), Math.max(0, offset), Math.max(0, duration));
    },
    /**
     * @private
     */
    createBufferSource: function () {
        var _this = this;
        var source = this.manager.context.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.muteNode);
        source.onended = function (ev) {
            if (ev.target === _this.source) {
                // sound ended
                if (_this.currentConfig.loop) {
                    _this.hasLooped = true;
                }
                else {
                    _this.hasEnded = true;
                }
            }
            // else was stopped
        };
        return source;
    },
    /**
     * Used internally to do what the name says.
     *
     * @private
     */
    stopAndRemoveBufferSource: function () {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }
        this.playTime = 0;
        this.startTime = 0;
        this.stopAndRemoveLoopBufferSource();
    },
    /**
     * Used internally to do what the name says.
     *
     * @private
     */
    stopAndRemoveLoopBufferSource: function () {
        if (this.loopSource) {
            this.loopSource.stop();
            this.loopSource.disconnect();
            this.loopSource = null;
        }
        this.loopTime = 0;
    },
    /**
     * @protected
     */
    applyConfig: function () {
        this.rateUpdates.length = 0;
        this.rateUpdates.push({
            time: 0,
            rate: 1
        });
        BaseSound.prototype.applyConfig.call(this);
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
            BaseSound.prototype.stop.call(this);
            this.stopAndRemoveBufferSource();
            this.events.dispatch(new SoundEvent(this, 'SOUND_ENDED'));
        }
        else if (this.hasLooped) {
            this.hasLooped = false;
            this.source = this.loopSource;
            this.loopSource = null;
            this.playTime = this.startTime = this.loopTime;
            this.rateUpdates.length = 0;
            this.rateUpdates.push({
                time: 0,
                rate: this.totalRate
            });
            this.createAndStartLoopBufferSource();
            this.events.dispatch(new SoundEvent(this, 'SOUND_LOOP'));
        }
    },
    destroy: function () {
        BaseSound.prototype.destroy.call(this);
        this.audioBuffer = null;
        this.stopAndRemoveBufferSource();
        this.muteNode.disconnect();
        this.muteNode = null;
        this.volumeNode.disconnect();
        this.volumeNode = null;
        this.rateUpdates = null;
    },
    /**
     * @private
     */
    setRate: function () {
        BaseSound.prototype.setRate.call(this);
        var now = this.manager.context.currentTime;
        if (this.source) {
            this.source.playbackRate.setValueAtTime(this.totalRate, now);
        }
        if (this.isPlaying) {
            this.rateUpdates.push({
                time: Math.max(this.startTime, now) - this.playTime,
                rate: this.totalRate
            });
            if (this.loopSource) {
                this.stopAndRemoveLoopBufferSource();
                this.createAndStartLoopBufferSource();
            }
        }
    },
    /**
     * @private
     */
    getCurrentTime: function () {
        var currentTime = 0;
        for (var i = 0; i < this.rateUpdates.length; i++) {
            var nextTime = void 0;
            if (i < this.rateUpdates.length - 1) {
                nextTime = this.rateUpdates[i + 1].time;
            }
            else {
                nextTime = this.manager.context.currentTime - this.playTime;
            }
            currentTime += (nextTime - this.rateUpdates[i].time) * this.rateUpdates[i].rate;
        }
        return currentTime;
    },
    /**
     * @private
     */
    getLoopTime: function () {
        var lastRateUpdateCurrentTime = 0;
        for (var i = 0; i < this.rateUpdates.length - 1; i++) {
            lastRateUpdateCurrentTime +=
                (this.rateUpdates[i + 1].time - this.rateUpdates[i].time) * this.rateUpdates[i].rate;
        }
        var lastRateUpdate = this.rateUpdates[this.rateUpdates.length - 1];
        return this.playTime + lastRateUpdate.time
            + (this.duration - lastRateUpdateCurrentTime) / lastRateUpdate.rate;
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
        this.events.dispatch(new SoundValueEvent(this, 'SOUND_MUTE', value));
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
        this.events.dispatch(new SoundValueEvent(this, 'SOUND_VOLUME', value));
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
        this.events.dispatch(new SoundValueEvent(this, 'SOUND_RATE', value));
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
        this.events.dispatch(new SoundValueEvent(this, 'SOUND_DETUNE', value));
    }
});
/**
 * Current position of playing sound.
 * @property {number} seek
 */
Object.defineProperty(WebAudioSound.prototype, 'seek', {
    get: function () {
        if (this.isPlaying) {
            if (this.manager.context.currentTime < this.startTime) {
                return this.startTime - this.playTime;
            }
            return this.getCurrentTime();
        }
        else if (this.isPaused) {
            return this.currentConfig.seek;
        }
        else {
            return 0;
        }
    },
    set: function (value) {
        if (this.manager.context.currentTime < this.startTime) {
            return;
        }
        if (this.isPlaying || this.isPaused) {
            value = Math.min(Math.max(0, value), this.duration);
            this.currentConfig.seek = value;
            this.events.dispatch(new SoundValueEvent(this, 'SOUND_SEEK', value));
        }
        if (this.isPlaying) {
            this.stopAndRemoveBufferSource();
            this.createAndStartBufferSource();
        }
    }
});
/**
 * Property indicating whether or not
 * the sound or current sound marker will loop.
 *
 * @property {boolean} loop
 */
Object.defineProperty(WebAudioSound.prototype, 'loop', {
    get: function () {
        return this.currentConfig.loop;
    },
    set: function (value) {
        this.currentConfig.loop = value;
        if (this.isPlaying) {
            this.stopAndRemoveLoopBufferSource();
            if (value) {
                this.createAndStartLoopBufferSource();
            }
        }
    }
});
module.exports = WebAudioSound;
