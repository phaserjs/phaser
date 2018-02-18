/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BaseSound = require('../BaseSound');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Extend = require('../../utils/object/Extend');

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
 * @extends Phaser.Sound.BaseSound
 * @memberOf Phaser.Sound
 * @constructor
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @since  3.0.0
 *
 * @param {Phaser.Sound.NoAudioSoundManager} manager - Reference to the current sound manager instance.
 * @param {string} key - Asset key for the sound.
 * @param {SoundConfig} [config={}] - An optional config object containing default sound settings.
 */
var NoAudioSound = new Class({

    Extends: EventEmitter,

    initialize:

    function NoAudioSound (manager, key, config)
    {
        if (config === void 0) { config = {}; }
        EventEmitter.call(this);
        this.manager = manager;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#key
         * @type {string}
         * @since 3.0.0
         */
        this.key = key;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#isPlaying
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#isPaused
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isPaused = false;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#totalRate
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.totalRate = 1;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#totalDuration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.totalDuration = 0;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = Extend({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }, config);

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#currentConfig
         * @type {[type]}
         * @since 3.0.0
         */
        this.currentConfig = this.config;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#mute
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.mute = false;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#volume
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.volume = 1;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#rate
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.rate = 1;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#detune
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.detune = 0;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#seek
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.seek = 0;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#loop
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.loop = false;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#markers
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.markers = {};

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#currentMarker
         * @type {?[type]}
         * @default null
         * @since 3.0.0
         */
        this.currentMarker = null;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSound#pendingRemove
         * @type {boolean}
         * @default null
         * @since 3.0.0
         */
        this.pendingRemove = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#addMarker
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    addMarker: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#updateMarker
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    updateMarker: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#removeMarker
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    removeMarker: function ()
    {
        return null;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#play
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    play: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#pause
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    pause: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#resume
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    resume: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#stop
     * @since 3.0.0
     *
     * @return {boolean} False
     */
    stop: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSound#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.manager.remove(this);

        BaseSound.prototype.destroy.call(this);
    }

});

module.exports = NoAudioSound;
