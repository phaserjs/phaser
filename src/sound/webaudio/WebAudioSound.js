/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseSound = require('../BaseSound');
var Class = require('../../utils/Class');
var Events = require('../events');
var GetFastValue = require('../../utils/object/GetFastValue');

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
 * @param {Phaser.Sound.WebAudioSoundManager} manager - Reference to the WebAudio Sound Manager that owns this Sound instance.
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
        this.audioBuffer = manager.game.cache.audio.get(key);

        if (!this.audioBuffer)
        {
            throw new Error('Audio key "' + key + '" not found in cache');
        }

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
        this.muteNode = manager.context.createGain();

        /**
         * Gain node responsible for controlling this sound's volume.
         *
         * @name Phaser.Sound.WebAudioSound#volumeNode
         * @type {GainNode}
         * @since 3.0.0
         */
        this.volumeNode = manager.context.createGain();

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
         * The Stereo Spatial Panner node.
         *
         * @name Phaser.Sound.WebAudioSound#spatialNode
         * @type {PannerNode}
         * @since 3.60.0
         */
        this.spatialNode = null;

        /**
         * If the Spatial Panner node has been set to track a vector or
         * Game Object, this retains a reference to it.
         *
         * @name Phaser.Sound.WebAudioSound#spatialSource
         * @type {Phaser.Types.Math.Vector2Like}
         * @since 3.60.0
         */
        this.spatialSource = null;

        /**
         * The time at which the sound should have started playback from the beginning.
         *
         * Treat this property as read-only.
         *
         * Based on `BaseAudioContext.currentTime` value.
         *
         * @name Phaser.Sound.WebAudioSound#playTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.playTime = 0;

        /**
         * The time at which the sound source should have actually started playback.
         *
         * Treat this property as read-only.
         *
         * Based on `BaseAudioContext.currentTime` value.
         *
         * @name Phaser.Sound.WebAudioSound#startTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.startTime = 0;

        /**
         * The time at which the sound loop source should actually start playback.
         *
         * Based on `BaseAudioContext.currentTime` value.
         *
         * @name Phaser.Sound.WebAudioSound#loopTime
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.loopTime = 0;

        /**
         * An array where we keep track of all rate updates during playback.
         *
         * Treat this property as read-only.
         *
         * Array of object types: `{ time: number, rate: number }`
         *
         * @name Phaser.Sound.WebAudioSound#rateUpdates
         * @type {array}
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

        this.muteNode.connect(this.volumeNode);

        if (manager.context.createPanner)
        {
            this.spatialNode = manager.context.createPanner();

            this.volumeNode.connect(this.spatialNode);
        }

        if (manager.context.createStereoPanner)
        {
            this.pannerNode = manager.context.createStereoPanner();

            if (manager.context.createPanner)
            {
                this.spatialNode.connect(this.pannerNode);
            }
            else
            {
                this.volumeNode.connect(this.pannerNode);
            }

            this.pannerNode.connect(manager.destination);
        }
        else if (manager.context.createPanner)
        {
            this.spatialNode.connect(manager.destination);
        }
        else
        {
            this.volumeNode.connect(manager.destination);
        }

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
     * If you want to play the same sound simultaneously, then you need to create another instance
     * of it and play that Sound.
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
     * This method is only used internally and it creates a looping buffer source.
     *
     * @method Phaser.Sound.WebAudioSound#createAndStartLoopBufferSource
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
     * This method is only used internally and it creates a buffer source.
     *
     * @method Phaser.Sound.WebAudioSound#createBufferSource
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
            var target = ev.target;

            if (target === _this.source || target === _this.loopSource)
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
     * This method is only used internally and it stops and removes a buffer source.
     *
     * @method Phaser.Sound.WebAudioSound#stopAndRemoveBufferSource
     * @since 3.0.0
     */
    stopAndRemoveBufferSource: function ()
    {
        if (this.source)
        {
            var tempSource = this.source;

            this.source = null;

            tempSource.stop();
            tempSource.disconnect();
        }

        this.playTime = 0;
        this.startTime = 0;
        this.hasEnded = false;

        this.stopAndRemoveLoopBufferSource();
    },

    /**
     * This method is only used internally and it stops and removes a looping buffer source.
     *
     * @method Phaser.Sound.WebAudioSound#stopAndRemoveLoopBufferSource
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
     * @since 3.0.0
     */
    applyConfig: function ()
    {
        this.rateUpdates.length = 0;

        this.rateUpdates.push({
            time: 0,
            rate: 1
        });

        var source = this.currentConfig.source;

        if (source && this.manager.context.createPanner)
        {
            var node = this.spatialNode;

            node.panningModel = GetFastValue(source, 'panningModel', 'equalpower');
            node.distanceModel = GetFastValue(source, 'distanceModel', 'inverse');
            node.orientationX.value = GetFastValue(source, 'orientationX', 0);
            node.orientationY.value = GetFastValue(source, 'orientationY', 0);
            node.orientationZ.value = GetFastValue(source, 'orientationZ', -1);
            node.refDistance = GetFastValue(source, 'refDistance', 1);
            node.maxDistance = GetFastValue(source, 'maxDistance', 10000);
            node.rolloffFactor = GetFastValue(source, 'rolloffFactor', 1);
            node.coneInnerAngle = GetFastValue(source, 'coneInnerAngle', 360);
            node.coneOuterAngle = GetFastValue(source, 'coneOuterAngle', 0);
            node.coneOuterGain = GetFastValue(source, 'coneOuterGain', 0);

            this.spatialSource = GetFastValue(source, 'follow', null);

            if (!this.spatialSource)
            {
                node.positionX.value = GetFastValue(source, 'x', 0);
                node.positionY.value = GetFastValue(source, 'y', 0);
                node.positionZ.value = GetFastValue(source, 'z', 0);
            }
        }

        BaseSound.prototype.applyConfig.call(this);
    },

    /**
     * Sets the x position of this Sound in Spatial Audio space.
     *
     * This only has any effect if the sound was created with a SpatialSoundConfig object.
     *
     * Also see the `WebAudioSoundManager.setListenerPosition` method.
     *
     * If you find that the sound becomes too quiet, too quickly, as it moves away from
     * the listener, then try different `refDistance` property values when configuring
     * the spatial sound.
     *
     * @name Phaser.Sound.WebAudioSound#x
     * @type {number}
     * @since 3.60.0
     */
    x: {

        get: function ()
        {
            if (this.spatialNode)
            {
                return this.spatialNode.positionX;
            }
            else
            {
                return 0;
            }
        },

        set: function (value)
        {
            if (this.spatialNode)
            {
                this.spatialNode.positionX.value = value;
            }
        }
    },

    /**
     * Sets the y position of this Sound in Spatial Audio space.
     *
     * This only has any effect if the sound was created with a SpatialSoundConfig object.
     *
     * Also see the `WebAudioSoundManager.setListenerPosition` method.
     *
     * If you find that the sound becomes too quiet, too quickly, as it moves away from
     * the listener, then try different `refDistance` property values when configuring
     * the spatial sound.
     *
     * @name Phaser.Sound.WebAudioSound#y
     * @type {number}
     * @since 3.60.0
     */
    y: {

        get: function ()
        {
            if (this.spatialNode)
            {
                return this.spatialNode.positionY;
            }
            else
            {
                return 0;
            }
        },

        set: function (value)
        {
            if (this.spatialNode)
            {
                this.spatialNode.positionY.value = value;
            }
        }
    },

    /**
     * Update method called automatically by sound manager on every game step.
     *
     * @method Phaser.Sound.WebAudioSound#update
     * @fires Phaser.Sound.Events#COMPLETE
     * @fires Phaser.Sound.Events#LOOPED
     * @since 3.0.0
     */
    update: function ()
    {
        if (this.isPlaying && this.spatialSource)
        {
            var x = GetFastValue(this.spatialSource, 'x', null);
            var y = GetFastValue(this.spatialSource, 'y', null);

            if (x && x !== this._spatialx)
            {
                this._spatialx = this.spatialNode.positionX.value = x;
            }
            if (y && y !== this._spatialy)
            {
                this._spatialy = this.spatialNode.positionY.value = y;
            }
        }

        if (this.hasEnded)
        {
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
        if (this.pendingRemove)
        {
            return;
        }

        BaseSound.prototype.destroy.call(this);

        this.audioBuffer = null;
        this.stopAndRemoveBufferSource();
        this.muteNode.disconnect();
        this.muteNode = null;
        this.volumeNode.disconnect();
        this.volumeNode = null;

        if (this.pannerNode)
        {
            this.pannerNode.disconnect();
            this.pannerNode = null;
        }

        if (this.spatialNode)
        {
            this.spatialNode.disconnect();
            this.spatialNode = null;
            this.spatialSource = null;
        }

        this.rateUpdates.length = 0;
        this.rateUpdates = null;
    },

    /**
     * Method used internally to calculate total playback rate of the sound.
     *
     * @method Phaser.Sound.WebAudioSound#calculateRate
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
     * @return {this} This Sound instance.
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
     * @return {this} This Sound instance.
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
     * @return {this} This Sound instance.
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
     * @return {this} This Sound instance.
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
     * @return {this} This Sound instance.
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
     * @return {this} This Sound instance.
     */
    setLoop: function (value)
    {
        this.loop = value;

        return this;
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
    }

});

module.exports = WebAudioSound;
