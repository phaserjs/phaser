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
         * @since 3.0.0
         */
        this.audioBuffer;

        /**
         * A reference to an audio source node used for playing back audio from
         * audio data stored in Phaser.Sound.WebAudioSound#audioBuffer.
         *
         * @name Phaser.Sound.WebAudioSound#source
         * @type {AudioBufferSourceNode}
         * @default null
         * @since 3.0.0
         */
        this.source = null;

        /**
         * A reference to a second audio source used for gapless looped playback.
         *
         * @name Phaser.Sound.WebAudioSound#loopSource
         * @type {AudioBufferSourceNode}
         * @default null
         * @since 3.0.0
         */
        this.loopSource = null;

        /**
         * Gain node responsible for controlling this sound's muting.
         *
         * @name Phaser.Sound.WebAudioSound#muteNode
         * @type {GainNode}
         * @since 3.0.0
         */
        this.muteNode;

        /**
         * Gain node responsible for controlling this sound's volume.
         *
         * @name Phaser.Sound.WebAudioSound#volumeNode
         * @type {GainNode}
         * @since 3.0.0
         */
        this.volumeNode;

        /**
         * Panner node responsible for controlling this sound's pan.
         *
         * Doesn't work on iOS / Safari.
         *
         * @name Phaser.Sound.WebAudioSound#pannerNode
         * @type {StereoPannerNode}
         * @since 3.50.0
         */
        this.pannerNode = null;

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
         * @readonly
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
         * @readonly
         * @default false
         * @since 3.0.0
         */
        this.hasLooped = false;

        this.pendingPlay = false;

        BaseSound.call(this, manager, key, config);

        if (manager.unlocked)
        {
            this.init();
        }
        else
        {
            manager.once(Events.UNLOCKED, this.init, this);
        }
    },

    /**
     * This internal method handles the creation of the mute, volume and panner nodes
     * as well as the setting of the audio buffer, or requesting the decode of the audio
     * if it's not already decoded.
     *
     * You should not call this method directly. If you do, you should make sure you only
     * call it once the SoundManager context has been unlocked.
     *
     * @method Phaser.Sound.WebAudioSound#init
     * @since 3.60.0
     */
    init: function ()
    {
        var manager = this.manager;

        var context = manager.context;

        this.muteNode = context.createGain();
        this.volumeNode = context.createGain();

        this.muteNode.connect(this.volumeNode);

        if (context.createStereoPanner)
        {
            this.pannerNode = context.createStereoPanner();

            this.volumeNode.connect(this.pannerNode);

            this.pannerNode.connect(manager.destination);
        }
        else
        {
            this.volumeNode.connect(manager.destination);
        }

        //  AudioBuffer
        var key = this.key;

        var buffer = manager.cache.get(key);

        if (buffer)
        {
            this.audioBuffer = buffer;
            this.duration = buffer.duration;
            this.totalDuration = buffer.duration;
        }
        else if (manager.decodeQueue.has(key))
        {
            manager.once(Events.DECODED_KEY + key, this.setAudioBuffer, this);

            manager.decodeAudioQueue(key);
        }
        else
        {
            throw new Error('Missing Audio: "' + key + '"');
        }
    },

    /**
     * Sets the AudioBuffer that this Sound instance will use for playback.
     *
     * Calling this also sets the `duration` and `totalDuration` properties.
     *
     * @method Phaser.Sound.WebAudioSound#setAudioBuffer
     * @since 3.60.0
     *
     * @param {AudioBuffer} audioBuffer - The fully decoded AudioBuffer this Sound instance will use.
     */
    setAudioBuffer: function (audioBuffer)
    {
        this.audioBuffer = audioBuffer;
        this.duration = audioBuffer.duration;
        this.totalDuration = audioBuffer.duration;

        var pending = this.pendingPlay;

        if (pending)
        {
            this.pendingPlay = null;

            this.play(pending.markerName, pending.config);
        }
    },

    /**
     * Play this sound, or a marked section of it.
     *
     * It always plays the sound from the start. If you want to start playback from a specific time
     * you can set 'seek' setting of the config object, provided to this call, to that value.
     *
     * If the audio has not yet been decoded it will first be passed to the Web Audio context and playback
     * will not start until the decoding is complete. This may introduce a brief moment of silence, the
     * duration of which will vary based on how long it takes the browser to decode the audio.
     *
     * If you need immediate playback with no decoding time, please ensure you call the method
     * `WebAudioSoundManager.processQueue` to ensure the audio has decoded already. Note, this will
     * *always* require a user-gesture before it can happen (either a click, touch or key press) and there
     * is no way to circumvent this.
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
        if (!this.audioBuffer)
        {
            this.pendingPlay = { markerName: markerName, config: config };

            if (this.manager.unlocked)
            {
                this.init();
            }

            return true;
        }

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
        if (!this.manager.context || this.manager.context.currentTime < this.startTime)
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
        if (!this.manager.context || this.manager.context.currentTime < this.startTime)
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
     */
    update: function ()
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
     * @return {this} This Sound instance.
     */
    setRate: function (value)
    {
        this.rate = value;

        return this;
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
     * @return {this} This Sound instance.
     */
    setDetune: function (value)
    {
        this.detune = value;

        return this;
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
     * @return {this} This Sound instance.
     */
    setMute: function (value)
    {
        this.mute = value;

        return this;
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
     * @return {this} This Sound instance.
     */
    setVolume: function (value)
    {
        this.volume = value;

        return this;
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
     * @return {this} This Sound instance.
     */
    setSeek: function (value)
    {
        this.seek = value;

        return this;
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
     * @return {this} This Sound instance.
     */
    setLoop: function (value)
    {
        this.loop = value;

        return this;
    },

    /**
     * Sets the pan of this sound, a value between -1 (full left pan) and 1 (full right pan).
     *
     * Note: iOS / Safari doesn't support the stereo panner node.
     *
     * @method Phaser.Sound.WebAudioSound#setPan
     * @fires Phaser.Sound.Events#PAN
     * @since 3.50.0
     *
     * @param {number} value - The pan of the sound. A value between -1 (full left pan) and 1 (full right pan).
     *
     * @return {this} This Sound instance.
     */
    setPan: function (value)
    {
        this.pan = value;

        return this;
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
            return (this.muteNode && this.muteNode.gain.value === 0);
        },

        set: function (value)
        {
            if (this.muteNode)
            {
                this.currentConfig.mute = value;
                this.muteNode.gain.setValueAtTime(value ? 0 : 1, 0);

                this.emit(Events.MUTE, this, value);
            }
        }

    },

    /**
     * Gets or sets the volume of this sound, a value between 0 (silence) and 1 (full volume).
     *
     * If this returns -1 it means this sound has no volume node.
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
            if (this.volumeNode)
            {
                return this.volumeNode.gain.value;
            }
            else
            {
                return -1;
            }
        },

        set: function (value)
        {
            if (this.volumeNode)
            {
                this.currentConfig.volume = value;

                this.volumeNode.gain.setValueAtTime(value, 0);

                this.emit(Events.VOLUME, this, value);
            }
        }
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
            if (!this.manager.context || this.manager.context.currentTime < this.startTime)
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
     * Gets or sets the pan of this sound, a value between -1 (full left pan) and 1 (full right pan).
     *
     * Always returns zero on iOS / Safari as it doesn't support the stereo panner node.
     *
     * @name Phaser.Sound.WebAudioSound#pan
     * @type {number}
     * @default 0
     * @fires Phaser.Sound.Events#PAN
     * @since 3.50.0
     */
    pan: {

        get: function ()
        {
            if (this.pannerNode)
            {
                return this.pannerNode.pan.value;
            }
            else
            {
                return 0;
            }
        },

        set: function (value)
        {
            this.currentConfig.pan = value;

            if (this.pannerNode)
            {
                this.pannerNode.pan.setValueAtTime(value, this.manager.context.currentTime);
            }

            this.emit(Events.PAN, this, value);
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

        if (this.muteNode)
        {
            this.muteNode.disconnect();
            this.muteNode = null;
        }

        if (this.volumeNode)
        {
            this.volumeNode.disconnect();
            this.volumeNode = null;
        }

        if (this.pannerNode)
        {
            this.pannerNode.disconnect();
            this.pannerNode = null;
        }

        this.rateUpdates.length = 0;
        this.rateUpdates = null;
    }

});

module.exports = WebAudioSound;
