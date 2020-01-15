/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseSound = require('../BaseSound');
var Class = require('../../utils/Class');
var Events = require('../events');

/**
 * @classdesc
 * Web Audio API implementation of the sound.
 *
 * @class WebAudioSound
 * @extends Phaser.Sound.BaseSound
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Sound.WebAudioSoundManager} manager - Reference to the current sound manager instance.
 * @param {string} key - Asset key for the sound.
 * @param {Phaser.Types.Sound.SoundConfig} [config={}] - An optional config object containing default sound settings.
 */
var WebAudioSound = new Class({

    Extends: BaseSound,

    initialize:

    function WebAudioSound (manager, key, config)
    {
        if (config === undefined) { config = {}; }

        /**
         * Audio buffer containing decoded data of the audio asset to be played.
         *
         * @name Phaser.Sound.WebAudioSound#audioBuffer
         * @type {AudioBuffer}
         * @private
         * @since 3.0.0
         */
        this.audioBuffer = manager.game.cache.audio.get(key);

        if (!this.audioBuffer)
        {
            throw new Error('There is no audio asset with key "' + key + '" in the audio cache');
        }

        /**
         * A reference to an audio source node used for playing back audio from
         * audio data stored in Phaser.Sound.WebAudioSound#audioBuffer.
         *
         * @name Phaser.Sound.WebAudioSound#source
         * @type {AudioBufferSourceNode}
         * @private
         * @default null
         * @since 3.0.0
         */
        this.source = null;

        /**
         * A reference to a second audio source used for gapless looped playback.
         *
         * @name Phaser.Sound.WebAudioSound#loopSource
         * @type {AudioBufferSourceNode}
         * @private
         * @default null
         * @since 3.0.0
         */
        this.loopSource = null;

        /**
         * Gain node responsible for controlling this sound's muting.
         *
         * @name Phaser.Sound.WebAudioSound#muteNode
         * @type {GainNode}
         * @private
         * @since 3.0.0
         */
        this.muteNode = manager.context.createGain();

        /**
         * Gain node responsible for controlling this sound's volume.
         *
         * @name Phaser.Sound.WebAudioSound#volumeNode
         * @type {GainNode}
         * @private
         * @since 3.0.0
         */
        this.volumeNode = manager.context.createGain();

        /**
         * The time at which the sound should have started playback from the beginning.
         * Based on BaseAudioContext.currentTime value.
         *
         * @name Phaser.Sound.WebAudioSound#playTime
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.playTime = 0;

        /**
         * The time at which the sound source should have actually started playback.
         * Based on BaseAudioContext.currentTime value.
         *
         * @name Phaser.Sound.WebAudioSound#startTime
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.startTime = 0;

        /**
         * The time at which the sound loop source should actually start playback.
         * Based on BaseAudioContext.currentTime value.
         *
         * @name Phaser.Sound.WebAudioSound#loopTime
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this.loopTime = 0;

        /**
         * An array where we keep track of all rate updates during playback.
         * Array of object types: { time: number, rate: number }
         *
         * @name Phaser.Sound.WebAudioSound#rateUpdates
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this.rateUpdates = [];

        /**
         * Used for keeping track when sound source playback has ended
         * so its state can be updated accordingly.
         *
         * @name Phaser.Sound.WebAudioSound#hasEnded
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this.hasEnded = false;

        /**
         * Used for keeping track when sound source has looped
         * so its state can be updated accordingly.
         *
         * @name Phaser.Sound.WebAudioSound#hasLooped
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this.hasLooped = false;

        this.muteNode.connect(this.volumeNode);

        this.volumeNode.connect(manager.destination);

        this.duration = this.audioBuffer.duration;

        this.totalDuration = this.audioBuffer.duration;

        BaseSound.call(this, manager, key, config);
    },

    /**
     * Play this sound, or a marked section of it.
     * 
     * It always plays the sound from the start. If you want to start playback from a specific time
     * you can set 'seek' setting of the config object, provided to this call, to that value.
     *
     * @method Phaser.Sound.WebAudioSound#play
     * @fires Phaser.Sound.Events#PLAY
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Sound.SoundConfig)} [markerName=''] - If you want to play a marker then provide the marker name here. Alternatively, this parameter can be a SoundConfig object.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - Optional sound config object to be applied to this marker or entire sound if no marker name is provided. It gets memorized for future plays of current section of the sound.
     *
     * @return {boolean} Whether the sound started playing successfully.
     */
    play: function (markerName, config)
    {
        if (!BaseSound.prototype.play.call(this, markerName, config))
        {
            return false;
        }

        //  \/\/\/ isPlaying = true, isPaused = false \/\/\/
        this.stopAndRemoveBufferSource();
        this.createAndStartBufferSource();

        this.emit(Events.PLAY, this);

        return true;
    },

    /**
     * Pauses the sound.
     *
     * @method Phaser.Sound.WebAudioSound#pause
     * @fires Phaser.Sound.Events#PAUSE
     * @since 3.0.0
     *
     * @return {boolean} Whether the sound was paused successfully.
     */
    pause: function ()
    {
        if (this.manager.context.currentTime < this.startTime)
        {
            return false;
        }

        if (!BaseSound.prototype.pause.call(this))
        {
            return false;
        }

        //  \/\/\/ isPlaying = false, isPaused = true \/\/\/
        this.currentConfig.seek = this.getCurrentTime(); // Equivalent to setting paused time
        this.stopAndRemoveBufferSource();

        this.emit(Events.PAUSE, this);

        return true;
    },

    /**
     * Resumes the sound.
     *
     * @method Phaser.Sound.WebAudioSound#resume
     * @fires Phaser.Sound.Events#RESUME
     * @since 3.0.0
     *
     * @return {boolean} Whether the sound was resumed successfully.
     */
    resume: function ()
    {
        if (this.manager.context.currentTime < this.startTime)
        {
            return false;
        }

        if (!BaseSound.prototype.resume.call(this))
        {
            return false;
        }

        //  \/\/\/ isPlaying = true, isPaused = false \/\/\/
        this.createAndStartBufferSource();

        this.emit(Events.RESUME, this);

        return true;
    },

    /**
     * Stop playing this sound.
     *
     * @method Phaser.Sound.WebAudioSound#stop
     * @fires Phaser.Sound.Events#STOP
     * @since 3.0.0
     *
     * @return {boolean} Whether the sound was stopped successfully.
     */
    stop: function ()
    {
        if (!BaseSound.prototype.stop.call(this))
        {
            return false;
        }

        //  \/\/\/ isPlaying = false, isPaused = false \/\/\/
        this.stopAndRemoveBufferSource();

        this.emit(Events.STOP, this);

        return true;
    },

    /**
     * Used internally.
     *
     * @method Phaser.Sound.WebAudioSound#createAndStartBufferSource
     * @private
     * @since 3.0.0
     */
    createAndStartBufferSource: function ()
    {
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
     * Used internally.
     *
     * @method Phaser.Sound.WebAudioSound#createAndStartLoopBufferSource
     * @private
     * @since 3.0.0
     */
    createAndStartLoopBufferSource: function ()
    {
        var when = this.getLoopTime();
        var offset = this.currentMarker ? this.currentMarker.start : 0;
        var duration = this.duration;

        this.loopTime = when;
        this.loopSource = this.createBufferSource();
        this.loopSource.playbackRate.setValueAtTime(this.totalRate, 0);
        this.loopSource.start(Math.max(0, when), Math.max(0, offset), Math.max(0, duration));
    },

    /**
     * Used internally.
     *
     * @method Phaser.Sound.WebAudioSound#createBufferSource
     * @private
     * @since 3.0.0
     *
     * @return {AudioBufferSourceNode}
     */
    createBufferSource: function ()
    {
        var _this = this;
        var source = this.manager.context.createBufferSource();

        source.buffer = this.audioBuffer;

        source.connect(this.muteNode);

        source.onended = function (ev)
        {
            if (ev.target === _this.source)
            {
                // sound ended
                if (_this.currentConfig.loop)
                {
                    _this.hasLooped = true;
                }
                else
                {
                    _this.hasEnded = true;
                }
            }

            // else was stopped
        };

        return source;
    },

    /**
     * Used internally.
     *
     * @method Phaser.Sound.WebAudioSound#stopAndRemoveBufferSource
     * @private
     * @since 3.0.0
     */
    stopAndRemoveBufferSource: function ()
    {
        if (this.source)
        {
            this.source.stop();
            this.source.disconnect();
            this.source = null;
        }

        this.playTime = 0;
        this.startTime = 0;

        this.stopAndRemoveLoopBufferSource();
    },

    /**
     * Used internally.
     *
     * @method Phaser.Sound.WebAudioSound#stopAndRemoveLoopBufferSource
     * @private
     * @since 3.0.0
     */
    stopAndRemoveLoopBufferSource: function ()
    {
        if (this.loopSource)
        {
            this.loopSource.stop();
            this.loopSource.disconnect();
            this.loopSource = null;
        }

        this.loopTime = 0;
    },

    /**
     * Method used internally for applying config values to some of the sound properties.
     *
     * @method Phaser.Sound.WebAudioSound#applyConfig
     * @protected
     * @since 3.0.0
     */
    applyConfig: function ()
    {
        this.rateUpdates.length = 0;

        this.rateUpdates.push({
            time: 0,
            rate: 1
        });

        BaseSound.prototype.applyConfig.call(this);
    },

    /**
     * Update method called automatically by sound manager on every game step.
     *
     * @method Phaser.Sound.WebAudioSound#update
     * @fires Phaser.Sound.Events#COMPLETE
     * @fires Phaser.Sound.Events#LOOPED
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    // eslint-disable-next-line no-unused-vars
    update: function (time, delta)
    {
        if (this.hasEnded)
        {
            this.hasEnded = false;

            BaseSound.prototype.stop.call(this);

            this.stopAndRemoveBufferSource();

            this.emit(Events.COMPLETE, this);
        }
        else if (this.hasLooped)
        {
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

            this.emit(Events.LOOPED, this);
        }
    },

    /**
     * Calls Phaser.Sound.BaseSound#destroy method
     * and cleans up all Web Audio API related stuff.
     *
     * @method Phaser.Sound.WebAudioSound#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        BaseSound.prototype.destroy.call(this);

        this.audioBuffer = null;
        this.stopAndRemoveBufferSource();
        this.muteNode.disconnect();
        this.muteNode = null;
        this.volumeNode.disconnect();
        this.volumeNode = null;
        this.rateUpdates.length = 0;
        this.rateUpdates = null;
    },

    /**
     * Method used internally to calculate total playback rate of the sound.
     *
     * @method Phaser.Sound.WebAudioSound#calculateRate
     * @protected
     * @since 3.0.0
     */
    calculateRate: function ()
    {
        BaseSound.prototype.calculateRate.call(this);

        var now = this.manager.context.currentTime;

        if (this.source && typeof this.totalRate === 'number')
        {
            this.source.playbackRate.setValueAtTime(this.totalRate, now);
        }

        if (this.isPlaying)
        {
            this.rateUpdates.push({
                time: Math.max(this.startTime, now) - this.playTime,
                rate: this.totalRate
            });

            if (this.loopSource)
            {
                this.stopAndRemoveLoopBufferSource();
                this.createAndStartLoopBufferSource();
            }
        }
    },

    /**
     * Method used internally for calculating current playback time of a playing sound.
     *
     * @method Phaser.Sound.WebAudioSound#getCurrentTime
     * @private
     * @since 3.0.0
     */
    getCurrentTime: function ()
    {
        var currentTime = 0;

        for (var i = 0; i < this.rateUpdates.length; i++)
        {
            var nextTime = 0;

            if (i < this.rateUpdates.length - 1)
            {
                nextTime = this.rateUpdates[i + 1].time;
            }
            else
            {
                nextTime = this.manager.context.currentTime - this.playTime;
            }

            currentTime += (nextTime - this.rateUpdates[i].time) * this.rateUpdates[i].rate;
        }

        return currentTime;
    },

    /**
     * Method used internally for calculating the time
     * at witch the loop source should start playing.
     *
     * @method Phaser.Sound.WebAudioSound#getLoopTime
     * @private
     * @since 3.0.0
     */
    getLoopTime: function ()
    {
        var lastRateUpdateCurrentTime = 0;

        for (var i = 0; i < this.rateUpdates.length - 1; i++)
        {
            lastRateUpdateCurrentTime += (this.rateUpdates[i + 1].time - this.rateUpdates[i].time) * this.rateUpdates[i].rate;
        }

        var lastRateUpdate = this.rateUpdates[this.rateUpdates.length - 1];

        return this.playTime + lastRateUpdate.time + (this.duration - lastRateUpdateCurrentTime) / lastRateUpdate.rate;
    },

    /**
     * Rate at which this Sound will be played.
     * Value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
     * and 2.0 doubles the audios playback speed.
     *
     * @name Phaser.Sound.WebAudioSound#rate
     * @type {number}
     * @default 1
     * @fires Phaser.Sound.Events#RATE
     * @since 3.0.0
     */
    rate: {

        get: function ()
        {
            return this.currentConfig.rate;
        },

        set: function (value)
        {
            this.currentConfig.rate = value;

            this.calculateRate();

            this.emit(Events.RATE, this, value);
        }

    },

    /**
     * Sets the playback rate of this Sound.
     * 
     * For example, a value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
     * and 2.0 doubles the audios playback speed.
     *
     * @method Phaser.Sound.WebAudioSound#setRate
     * @fires Phaser.Sound.Events#RATE
     * @since 3.3.0
     *
     * @param {number} value - The playback rate at of this Sound.
     *
     * @return {Phaser.Sound.WebAudioSound} This Sound.
     */
    setRate: function (value)
    {
        this.rate = value;

        return this;
    },

    /**
     * The detune value of this Sound, given in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
     * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @name Phaser.Sound.WebAudioSound#detune
     * @type {number}
     * @default 0
     * @fires Phaser.Sound.Events#DETUNE
     * @since 3.0.0
     */
    detune: {

        get: function ()
        {
            return this.currentConfig.detune;
        },

        set: function (value)
        {
            this.currentConfig.detune = value;

            this.calculateRate();

            this.emit(Events.DETUNE, this, value);
        }

    },

    /**
     * Sets the detune value of this Sound, given in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
     * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @method Phaser.Sound.WebAudioSound#setDetune
     * @fires Phaser.Sound.Events#DETUNE
     * @since 3.3.0
     *
     * @param {number} value - The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @return {Phaser.Sound.WebAudioSound} This Sound.
     */
    setDetune: function (value)
    {
        this.detune = value;

        return this;
    },

    /**
     * Boolean indicating whether the sound is muted or not.
     * Gets or sets the muted state of this sound.
     * 
     * @name Phaser.Sound.WebAudioSound#mute
     * @type {boolean}
     * @default false
     * @fires Phaser.Sound.Events#MUTE
     * @since 3.0.0
     */
    mute: {

        get: function ()
        {
            return (this.muteNode.gain.value === 0);
        },

        set: function (value)
        {
            this.currentConfig.mute = value;
            this.muteNode.gain.setValueAtTime(value ? 0 : 1, 0);

            this.emit(Events.MUTE, this, value);
        }

    },

    /**
     * Sets the muted state of this Sound.
     *
     * @method Phaser.Sound.WebAudioSound#setMute
     * @fires Phaser.Sound.Events#MUTE
     * @since 3.4.0
     *
     * @param {boolean} value - `true` to mute this sound, `false` to unmute it.
     *
     * @return {Phaser.Sound.WebAudioSound} This Sound instance.
     */
    setMute: function (value)
    {
        this.mute = value;

        return this;
    },

    /**
     * Gets or sets the volume of this sound, a value between 0 (silence) and 1 (full volume).
     * 
     * @name Phaser.Sound.WebAudioSound#volume
     * @type {number}
     * @default 1
     * @fires Phaser.Sound.Events#VOLUME
     * @since 3.0.0
     */
    volume: {

        get: function ()
        {
            return this.volumeNode.gain.value;
        },

        set: function (value)
        {
            this.currentConfig.volume = value;
            this.volumeNode.gain.setValueAtTime(value, 0);

            this.emit(Events.VOLUME, this, value);
        }
    },

    /**
     * Sets the volume of this Sound.
     *
     * @method Phaser.Sound.WebAudioSound#setVolume
     * @fires Phaser.Sound.Events#VOLUME
     * @since 3.4.0
     *
     * @param {number} value - The volume of the sound.
     *
     * @return {Phaser.Sound.WebAudioSound} This Sound instance.
     */
    setVolume: function (value)
    {
        this.volume = value;

        return this;
    },

    /**
     * Property representing the position of playback for this sound, in seconds.
     * Setting it to a specific value moves current playback to that position.
     * The value given is clamped to the range 0 to current marker duration.
     * Setting seek of a stopped sound has no effect.
     * 
     * @name Phaser.Sound.WebAudioSound#seek
     * @type {number}
     * @fires Phaser.Sound.Events#SEEK
     * @since 3.0.0
     */
    seek: {

        get: function ()
        {
            if (this.isPlaying)
            {
                if (this.manager.context.currentTime < this.startTime)
                {
                    return this.startTime - this.playTime;
                }

                return this.getCurrentTime();
            }
            else if (this.isPaused)
            {
                return this.currentConfig.seek;
            }
            else
            {
                return 0;
            }
        },

        set: function (value)
        {
            if (this.manager.context.currentTime < this.startTime)
            {
                return;
            }

            if (this.isPlaying || this.isPaused)
            {
                value = Math.min(Math.max(0, value), this.duration);

                this.currentConfig.seek = value;

                if (this.isPlaying)
                {
                    this.stopAndRemoveBufferSource();
                    this.createAndStartBufferSource();
                }

                this.emit(Events.SEEK, this, value);
            }
        }
    },

    /**
     * Seeks to a specific point in this sound.
     *
     * @method Phaser.Sound.WebAudioSound#setSeek
     * @fires Phaser.Sound.Events#SEEK
     * @since 3.4.0
     *
     * @param {number} value - The point in the sound to seek to.
     *
     * @return {Phaser.Sound.WebAudioSound} This Sound instance.
     */
    setSeek: function (value)
    {
        this.seek = value;

        return this;
    },

    /**
     * Flag indicating whether or not the sound or current sound marker will loop.
     * 
     * @name Phaser.Sound.WebAudioSound#loop
     * @type {boolean}
     * @default false
     * @fires Phaser.Sound.Events#LOOP
     * @since 3.0.0
     */
    loop: {

        get: function ()
        {
            return this.currentConfig.loop;
        },

        set: function (value)
        {
            this.currentConfig.loop = value;

            if (this.isPlaying)
            {
                this.stopAndRemoveLoopBufferSource();

                if (value)
                {
                    this.createAndStartLoopBufferSource();
                }
            }

            this.emit(Events.LOOP, this, value);
        }
    },

    /**
     * Sets the loop state of this Sound.
     *
     * @method Phaser.Sound.WebAudioSound#setLoop
     * @fires Phaser.Sound.Events#LOOP
     * @since 3.4.0
     *
     * @param {boolean} value - `true` to loop this sound, `false` to not loop it.
     *
     * @return {Phaser.Sound.WebAudioSound} This Sound instance.
     */
    setLoop: function (value)
    {
        this.loop = value;

        return this;
    }

});

module.exports = WebAudioSound;
