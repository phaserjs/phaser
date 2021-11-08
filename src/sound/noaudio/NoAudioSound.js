/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseSound = require('../BaseSound');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Extend = require('../../utils/object/Extend');

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
         * @private
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
         * @private
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
         * @name Phaser.Sound.BaseSound#currentConfig
         * @type {Phaser.Types.Sound.SoundConfig}
         * @private
         * @since 3.0.0
         */
        this.currentConfig = this.config;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#mute
         * @type {boolean}
         * @readonly
         * @since 3.0.0
         */
        this.mute = false;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#volume
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.volume = 1;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#rate
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.rate = 1;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#detune
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.detune = 0;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#seek
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.seek = 0;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#loop
         * @type {boolean}
         * @readonly
         * @since 3.0.0
         */
        this.loop = false;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#pan
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.pan = 0;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#markers
         * @type {Object.<string, Phaser.Types.Sound.SoundMarker>}
         * @default {}
         * @readonly
         * @since 3.0.0
         */
        this.markers = {};

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#currentMarker
         * @type {Phaser.Types.Sound.SoundMarker}
         * @default null
         * @readonly
         * @since 3.0.0
         */
        this.currentMarker = null;

        /**
         * This property is un-used in a NoAudioSound object.
         *
         * @name Phaser.Sound.NoAudioSound#pendingRemove
         * @type {boolean}
         * @readonly
         * @since 3.0.0
         */
        this.pendingRemove = false;
    },

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#addMarker
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    addMarker: returnFalse,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#updateMarker
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    updateMarker: returnFalse,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#removeMarker
     * @since 3.0.0
     *
     * @return {null} null
     */
    removeMarker: returnNull,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#play
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    play: returnFalse,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#pause
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    pause: returnFalse,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#resume
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    resume: returnFalse,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#stop
     * @since 3.0.0
     *
     * @return {boolean} false
     */
    stop: returnFalse,

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
    },

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setMute
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setMute: returnThis,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setVolume
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setVolume: returnThis,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setRate
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setRate: returnThis,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setDetune
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setDetune: returnThis,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setSeek
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setSeek: returnThis,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setLoop
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setLoop: returnThis,

    /**
     * This method is empty in a NoAudioSound object.
     *
     * @method Phaser.Sound.NoAudioSound#setPan
     * @since 3.0.0
     *
     * @return {this} This Sound instance.
     */
    setPan: returnThis

});

module.exports = NoAudioSound;
