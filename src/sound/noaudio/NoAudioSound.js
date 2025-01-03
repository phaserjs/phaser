/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseSound = require('../BaseSound');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Extend = require('../../utils/object/Extend');
var NOOP = require('../../utils/NOOP');

var returnFalse = function ()
{
    return false;
};

var returnNull = function ()
{
    return null;
};

var returnThis = function ()
{
    return this;
};

/**
 * @classdesc
 * No audio implementation of the sound. It is used if audio has been
 * disabled in the game config or the device doesn't support any audio.
 *
 * It represents a graceful degradation of sound logic that provides
 * minimal functionality and prevents Phaser projects that use audio from
 * breaking on devices that don't support any audio playback technologies.
 *
 * @class NoAudioSound
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Sound.NoAudioSoundManager} manager - Reference to the current sound manager instance.
 * @param {string} key - Asset key for the sound.
 * @param {Phaser.Types.Sound.SoundConfig} [config={}] - An optional config object containing default sound settings.
 */
var NoAudioSound = new Class({

    Extends: EventEmitter,

    initialize:

    function NoAudioSound (manager, key, config)
    {
        if (config === void 0) { config = {}; }

        EventEmitter.call(this);

        /**
         * Local reference to the sound manager.
         *
         * @name Phaser.Sound.NoAudioSound#manager
         * @type {Phaser.Sound.BaseSoundManager}
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * Asset key for the sound.
         *
         * @name Phaser.Sound.NoAudioSound#key
         * @type {string}
         * @readonly
         * @since 3.0.0
         */
        this.key = key;

        /**
         * Flag indicating if sound is currently playing.
         *
         * @name Phaser.Sound.NoAudioSound#isPlaying
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * Flag indicating if sound is currently paused.
         *
         * @name Phaser.Sound.NoAudioSound#isPaused
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isPaused = false;

        /**
         * A property that holds the value of sound's actual playback rate,
         * after its rate and detune values has been combined with global
         * rate and detune values.
         *
         * @name Phaser.Sound.NoAudioSound#totalRate
         * @type {number}
         * @default 1
         * @readonly
         * @since 3.0.0
         */
        this.totalRate = 1;

        /**
         * A value representing the duration, in seconds.
         * It could be total sound duration or a marker duration.
         *
         * @name Phaser.Sound.NoAudioSound#duration
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * The total duration of the sound in seconds.
         *
         * @name Phaser.Sound.NoAudioSound#totalDuration
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.totalDuration = 0;

        /**
         * A config object used to store default sound settings' values.
         * Default values will be set by properties' setters.
         *
         * @name Phaser.Sound.NoAudioSound#config
         * @type {Phaser.Types.Sound.SoundConfig}
         * @since 3.0.0
         */
        this.config = Extend({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0,
            pan: 0
        }, config);

        /**
         * Reference to the currently used config.
         * It could be default config or marker config.
         *
         * @name Phaser.Sound.NoAudioSound#currentConfig
         * @type {Phaser.Types.Sound.SoundConfig}
         * @since 3.0.0
         */
        this.currentConfig = this.config;

        /**
         * Boolean indicating whether the sound is muted or not.
         * Gets or sets the muted state of this sound.
         *
         * @name Phaser.Sound.NoAudioSound#mute
         * @type {boolean}
         * @default false
         * @fires Phaser.Sound.Events#MUTE
         * @since 3.0.0
         */
        this.mute = false;

        /**
         * Gets or sets the volume of this sound, a value between 0 (silence) and 1 (full volume).
         *
         * @name Phaser.Sound.NoAudioSound#volume
         * @type {number}
         * @default 1
         * @fires Phaser.Sound.Events#VOLUME
         * @since 3.0.0
         */
        this.volume = 1;

        /**
         * Rate at which this Sound will be played.
         * Value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
         * and 2.0 doubles the audios playback speed.
         *
         * @name Phaser.Sound.NoAudioSound#rate
         * @type {number}
         * @default 1
         * @fires Phaser.Sound.Events#RATE
         * @since 3.0.0
         */
        this.rate = 1;

        /**
         * The detune value of this Sound, given in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
         * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
         *
         * @name Phaser.Sound.NoAudioSound#detune
         * @type {number}
         * @default 0
         * @fires Phaser.Sound.Events#DETUNE
         * @since 3.0.0
         */
        this.detune = 0;

        /**
         * Property representing the position of playback for this sound, in seconds.
         * Setting it to a specific value moves current playback to that position.
         * The value given is clamped to the range 0 to current marker duration.
         * Setting seek of a stopped sound has no effect.
         *
         * @name Phaser.Sound.NoAudioSound#seek
         * @type {number}
         * @fires Phaser.Sound.Events#SEEK
         * @since 3.0.0
         */
        this.seek = 0;

        /**
         * Flag indicating whether or not the sound or current sound marker will loop.
         *
         * @name Phaser.Sound.NoAudioSound#loop
         * @type {boolean}
         * @default false
         * @fires Phaser.Sound.Events#LOOP
         * @since 3.0.0
         */
        this.loop = false;

        /**
         * Gets or sets the pan of this sound, a value between -1 (full left pan) and 1 (full right pan).
         *
         * Always returns zero on iOS / Safari as it doesn't support the stereo panner node.
         *
         * @name Phaser.Sound.NoAudioSound#pan
         * @type {number}
         * @default 0
         * @fires Phaser.Sound.Events#PAN
         * @since 3.50.0
         */
        this.pan = 0;

        /**
         * Object containing markers definitions.
         *
         * @name Phaser.Sound.NoAudioSound#markers
         * @type {Object.<string, Phaser.Types.Sound.SoundMarker>}
         * @default {}
         * @readonly
         * @since 3.0.0
         */
        this.markers = {};

        /**
         * Currently playing marker.
         * 'null' if whole sound is playing.
         *
         * @name Phaser.Sound.NoAudioSound#currentMarker
         * @type {Phaser.Types.Sound.SoundMarker}
         * @default null
         * @readonly
         * @since 3.0.0
         */
        this.currentMarker = null;

        /**
         * Flag indicating if destroy method was called on this sound.
         *
         * @name Phaser.Sound.NoAudioSound#pendingRemove
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.pendingRemove = false;
    },

    /**
     * @method Phaser.Sound.NoAudioSound#addMarker
     * @since 3.0.0
     *
     * @param {Phaser.Types.Sound.SoundMarker} marker - Marker object.
     *
     * @return {boolean} false
     */
    addMarker: returnFalse,

    /**
     * @method Phaser.Sound.NoAudioSound#updateMarker
     * @since 3.0.0
     *
     * @param {Phaser.Types.Sound.SoundMarker} marker - Marker object with updated values.
     *
     * @return {boolean} false
     */
    updateMarker: returnFalse,

    /**
     * @method Phaser.Sound.NoAudioSound#removeMarker
     * @since 3.0.0
     *
     * @param {string} markerName - The name of the marker to remove.
     *
     * @return {null} null
     */
    removeMarker: returnNull,

    /**
     * @method Phaser.Sound.NoAudioSound#play
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Sound.SoundConfig)} [markerName=''] - If you want to play a marker then provide the marker name here. Alternatively, this parameter can be a SoundConfig object.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - Optional sound config object to be applied to this marker or entire sound if no marker name is provided. It gets memorized for future plays of current section of the sound.
     *
     * @return {boolean} false
     */
    play: returnFalse,

    /**
     * @method Phaser.Sound.NoAudioSound#pause
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    pause: returnFalse,

    /**
     * Resumes the sound.
     *
     * @method Phaser.Sound.NoAudioSound#resume
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    resume: returnFalse,

    /**
     * Stop playing this sound.
     *
     * @method Phaser.Sound.NoAudioSound#stop
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    stop: returnFalse,

    /**
     * Sets the muted state of this Sound.
     *
     * @method Phaser.Sound.NoAudioSound#setMute
     * @since 3.4.0
     *
     * @param {boolean} value - `true` to mute this sound, `false` to unmute it.
     *
     * @return {this} This Sound instance.
     */
    setMute: returnThis,

    /**
     * Sets the volume of this Sound.
     *
     * @method Phaser.Sound.NoAudioSound#setVolume
     * @since 3.4.0
     *
     * @param {number} value - The volume of the sound.
     *
     * @return {this} This Sound instance.
     */
    setVolume: returnThis,

    /**
     * Sets the playback rate of this Sound.
     *
     * For example, a value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
     * and 2.0 doubles the audios playback speed.
     *
     * @method Phaser.Sound.NoAudioSound#setRate
     * @since 3.3.0
     *
     * @param {number} value - The playback rate at of this Sound.
     *
     * @return {this} This Sound instance.
     */
    setRate: returnThis,

    /**
     * Sets the detune value of this Sound, given in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
     * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @method Phaser.Sound.NoAudioSound#setDetune
     * @since 3.3.0
     *
     * @param {number} value - The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @return {this} This Sound instance.
     */
    setDetune: returnThis,

    /**
     * Seeks to a specific point in this sound.
     *
     * @method Phaser.Sound.NoAudioSound#setSeek
     * @since 3.4.0
     *
     * @param {number} value - The point in the sound to seek to.
     *
     * @return {this} This Sound instance.
     */
    setSeek: returnThis,

    /**
     * Sets the loop state of this Sound.
     *
     * @method Phaser.Sound.NoAudioSound#setLoop
     * @since 3.4.0
     *
     * @param {boolean} value - `true` to loop this sound, `false` to not loop it.
     *
     * @return {this} This Sound instance.
     */
    setLoop: returnThis,

    /**
     * Sets the pan of this sound, a value between -1 (full left pan) and 1 (full right pan).
     *
     * Note: iOS / Safari doesn't support the stereo panner node.
     *
     * @method Phaser.Sound.NoAudioSound#setPan
     * @since 3.50.0
     *
     * @param {number} value - The pan of the sound. A value between -1 (full left pan) and 1 (full right pan).
     *
     * @return {this} This Sound instance.
     */
    setPan: returnThis,

    /**
     * Method used internally for applying config values to some of the sound properties.
     *
     * @method Phaser.Sound.NoAudioSound#applyConfig
     * @since 3.0.0
     */
    applyConfig: returnNull,

    /**
     * Method used internally for resetting values of some of the config properties.
     *
     * @method Phaser.Sound.NoAudioSound#resetConfig
     * @since 3.0.0
     */
    resetConfig: returnNull,

    /**
     * Update method called automatically by sound manager on every game step.
     *
     * @method Phaser.Sound.NoAudioSound#update
     * @override
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: NOOP,

    /**
     * Method used internally to calculate total playback rate of the sound.
     *
     * @method Phaser.Sound.NoAudioSound#calculateRate
     * @since 3.0.0
     */
    calculateRate: returnNull,

    /**
     * Destroys this sound and all associated events and marks it for removal from the sound manager.
     *
     * @method Phaser.Sound.NoAudioSound#destroy
     * @fires Phaser.Sound.Events#DESTROY
     * @since 3.0.0
     */
    destroy: function ()
    {
        BaseSound.prototype.destroy.call(this);
    }

});

module.exports = NoAudioSound;
