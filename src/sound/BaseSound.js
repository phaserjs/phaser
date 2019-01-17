/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var Extend = require('../utils/object/Extend');
var NOOP = require('../utils/NOOP');

/**
 * @classdesc
 * Class containing all the shared state and behavior of a sound object, independent of the implementation.
 *
 * @class BaseSound
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Sound.BaseSoundManager} manager - Reference to the current sound manager instance.
 * @param {string} key - Asset key for the sound.
 * @param {SoundConfig} [config] - An optional config object containing default sound settings.
 */
var BaseSound = new Class({

    Extends: EventEmitter,

    initialize:

    function BaseSound (manager, key, config)
    {
        EventEmitter.call(this);

        /**
         * Local reference to the sound manager.
         *
         * @name Phaser.Sound.BaseSound#manager
         * @type {Phaser.Sound.BaseSoundManager}
         * @private
         * @since 3.0.0
         */
        this.manager = manager;

        /**
         * Asset key for the sound.
         *
         * @name Phaser.Sound.BaseSound#key
         * @type {string}
         * @readonly
         * @since 3.0.0
         */
        this.key = key;

        /**
         * Flag indicating if sound is currently playing.
         *
         * @name Phaser.Sound.BaseSound#isPlaying
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isPlaying = false;

        /**
         * Flag indicating if sound is currently paused.
         *
         * @name Phaser.Sound.BaseSound#isPaused
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
         * @name Phaser.Sound.BaseSound#totalRate
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
         * @name Phaser.Sound.BaseSound#duration
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.duration = this.duration || 0;

        /**
         * The total duration of the sound in seconds.
         *
         * @name Phaser.Sound.BaseSound#totalDuration
         * @type {number}
         * @readonly
         * @since 3.0.0
         */
        this.totalDuration = this.totalDuration || 0;

        /**
         * A config object used to store default sound settings' values.
         * Default values will be set by properties' setters.
         *
         * @name Phaser.Sound.BaseSound#config
         * @type {SoundConfig}
         * @private
         * @since 3.0.0
         */
        this.config = {

            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0

        };

        /**
         * Reference to the currently used config.
         * It could be default config or marker config.
         *
         * @name Phaser.Sound.BaseSound#currentConfig
         * @type {SoundConfig}
         * @private
         * @since 3.0.0
         */
        this.currentConfig = this.config;

        this.config = Extend(this.config, config);

        /**
         * Object containing markers definitions.
         *
         * @name Phaser.Sound.BaseSound#markers
         * @type {Object.<string, SoundMarker>}
         * @default {}
         * @readonly
         * @since 3.0.0
         */
        this.markers = {};

        /**
         * Currently playing marker.
         * 'null' if whole sound is playing.
         *
         * @name Phaser.Sound.BaseSound#currentMarker
         * @type {SoundMarker}
         * @default null
         * @readonly
         * @since 3.0.0
         */
        this.currentMarker = null;

        /**
         * Flag indicating if destroy method was called on this sound.
         *
         * @name Phaser.Sound.BaseSound#pendingRemove
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this.pendingRemove = false;
    },

    /**
     * Adds a marker into the current sound. A marker is represented by name, start time, duration, and optionally config object.
     * This allows you to bundle multiple sounds together into a single audio file and use markers to jump between them for playback.
     *
     * @method Phaser.Sound.BaseSound#addMarker
     * @since 3.0.0
     *
     * @param {SoundMarker} marker - Marker object.
     *
     * @return {boolean} Whether the marker was added successfully.
     */
    addMarker: function (marker)
    {
        if (!marker || !marker.name || typeof marker.name !== 'string')
        {
            return false;
        }

        if (this.markers[marker.name])
        {
            // eslint-disable-next-line no-console
            console.error('addMarker ' + marker.name + ' already exists in Sound');

            return false;
        }

        marker = Extend(true, {
            name: '',
            start: 0,
            duration: this.totalDuration - (marker.start || 0),
            config: {
                mute: false,
                volume: 1,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0
            }
        }, marker);

        this.markers[marker.name] = marker;

        return true;
    },

    /**
     * Updates previously added marker.
     *
     * @method Phaser.Sound.BaseSound#updateMarker
     * @since 3.0.0
     *
     * @param {SoundMarker} marker - Marker object with updated values.
     *
     * @return {boolean} Whether the marker was updated successfully.
     */
    updateMarker: function (marker)
    {
        if (!marker || !marker.name || typeof marker.name !== 'string')
        {
            return false;
        }

        if (!this.markers[marker.name])
        {
            // eslint-disable-next-line no-console
            console.warn('Audio Marker: ' + marker.name + ' missing in Sound: ' + this.key);

            return false;
        }

        this.markers[marker.name] = Extend(true, this.markers[marker.name], marker);

        return true;
    },

    /**
     * Removes a marker from the sound.
     *
     * @method Phaser.Sound.BaseSound#removeMarker
     * @since 3.0.0
     *
     * @param {string} markerName - The name of the marker to remove.
     *
     * @return {?SoundMarker} Removed marker object or 'null' if there was no marker with provided name.
     */
    removeMarker: function (markerName)
    {
        var marker = this.markers[markerName];

        if (!marker)
        {
            return null;
        }

        this.markers[markerName] = null;

        return marker;
    },

    /**
     * Play this sound, or a marked section of it.
     * It always plays the sound from the start. If you want to start playback from a specific time
     * you can set 'seek' setting of the config object, provided to this call, to that value.
     *
     * @method Phaser.Sound.BaseSound#play
     * @since 3.0.0
     *
     * @param {string} [markerName=''] - If you want to play a marker then provide the marker name here, otherwise omit it to play the full sound.
     * @param {SoundConfig} [config] - Optional sound config object to be applied to this marker or entire sound if no marker name is provided. It gets memorized for future plays of current section of the sound.
     *
     * @return {boolean} Whether the sound started playing successfully.
     */
    play: function (markerName, config)
    {
        if (markerName === undefined) { markerName = ''; }

        if (typeof markerName === 'object')
        {
            config = markerName;
            markerName = '';
        }

        if (typeof markerName !== 'string')
        {
            return false;
        }

        if (!markerName)
        {
            this.currentMarker = null;
            this.currentConfig = this.config;
            this.duration = this.totalDuration;
        }
        else
        {
            if (!this.markers[markerName])
            {
                // eslint-disable-next-line no-console
                console.warn('Marker: ' + markerName + ' missing in Sound: ' + this.key);

                return false;
            }

            this.currentMarker = this.markers[markerName];
            this.currentConfig = this.currentMarker.config;
            this.duration = this.currentMarker.duration;
        }

        this.resetConfig();

        this.currentConfig = Extend(this.currentConfig, config);

        this.isPlaying = true;
        this.isPaused = false;

        return true;
    },

    /**
     * Pauses the sound.
     *
     * @method Phaser.Sound.BaseSound#pause
     * @since 3.0.0
     *
     * @return {boolean} Whether the sound was paused successfully.
     */
    pause: function ()
    {
        if (this.isPaused || !this.isPlaying)
        {
            return false;
        }

        this.isPlaying = false;
        this.isPaused = true;

        return true;
    },

    /**
     * Resumes the sound.
     *
     * @method Phaser.Sound.BaseSound#resume
     * @since 3.0.0
     *
     * @return {boolean} Whether the sound was resumed successfully.
     */
    resume: function ()
    {
        if (!this.isPaused || this.isPlaying)
        {
            return false;
        }

        this.isPlaying = true;
        this.isPaused = false;

        return true;
    },

    /**
     * Stop playing this sound.
     *
     * @method Phaser.Sound.BaseSound#stop
     * @since 3.0.0
     *
     * @return {boolean} Whether the sound was stopped successfully.
     */
    stop: function ()
    {
        if (!this.isPaused && !this.isPlaying)
        {
            return false;
        }

        this.isPlaying = false;
        this.isPaused = false;

        this.resetConfig();

        return true;
    },

    /**
     * Method used internally for applying config values to some of the sound properties.
     *
     * @method Phaser.Sound.BaseSound#applyConfig
     * @protected
     * @since 3.0.0
     */
    applyConfig: function ()
    {
        this.mute = this.currentConfig.mute;
        this.volume = this.currentConfig.volume;
        this.rate = this.currentConfig.rate;
        this.detune = this.currentConfig.detune;
        this.loop = this.currentConfig.loop;
    },

    /**
     * Method used internally for resetting values of some of the config properties.
     *
     * @method Phaser.Sound.BaseSound#resetConfig
     * @protected
     * @since 3.0.0
     */
    resetConfig: function ()
    {
        this.currentConfig.seek = 0;
        this.currentConfig.delay = 0;
    },

    /**
     * Update method called automatically by sound manager on every game step.
     *
     * @method Phaser.Sound.BaseSound#update
     * @override
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: NOOP,

    /**
     * Method used internally to calculate total playback rate of the sound.
     *
     * @method Phaser.Sound.BaseSound#calculateRate
     * @protected
     * @since 3.0.0
     */
    calculateRate: function ()
    {
        var cent = 1.0005777895065548; // Math.pow(2, 1/1200);
        var totalDetune = this.currentConfig.detune + this.manager.detune;
        var detuneRate = Math.pow(cent, totalDetune);

        this.totalRate = this.currentConfig.rate * this.manager.rate * detuneRate;
    },

    /**
     * Destroys this sound and all associated events and marks it for removal from the sound manager.
     *
     * @method Phaser.Sound.BaseSound#destroy
     * @fires Phaser.Sound.Events#DESTROY
     * @since 3.0.0
     */
    destroy: function ()
    {
        if (this.pendingRemove)
        {
            return;
        }

        this.emit(Events.DESTROY, this);
        this.pendingRemove = true;
        this.manager = null;
        this.key = '';
        this.removeAllListeners();
        this.isPlaying = false;
        this.isPaused = false;
        this.config = null;
        this.currentConfig = null;
        this.markers = null;
        this.currentMarker = null;
    }

});

module.exports = BaseSound;
