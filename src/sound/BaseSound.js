var Class = require('../utils/Class');
var Extend = require('../utils/object/Extend');
var EventEmitter = require('eventemitter3');
var NOOP = require('../utils/NOOP');
/*!
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */
var BaseSound = new Class({
    Extends: EventEmitter,
    /**
     * @class Phaser.Sound.BaseSound
     * @constructor
     * @param {ISoundManager} manager - Reference to the current sound manager instance.
     * @param {string} key - Asset key for the sound.
     * @param {ISoundConfig} [config] - An optional config object containing default sound settings.
     */
    initialize: function BaseSound(manager, key, config) {
        EventEmitter.call(this);
        /**
         * Local reference to the sound manager.
         *
         * @private
         * @property {Phaser.Sound.BaseSoundManager} manager
         */
        this.manager = manager;
        /**
         * Asset key for the sound.
         *
         * @readonly
         * @property {string} key
         */
        this.key = key;
        /**
         * Flag indicating if sound is currently playing.
         *
         * @readonly
         * @property {boolean} isPlaying
         * @default false
         */
        this.isPlaying = false;
        /**
         * Flag indicating if sound is currently paused.
         *
         * @readonly
         * @property {boolean} isPaused
         * @default false
         */
        this.isPaused = false;
        /**
         * A property that holds the value of sound's actual playback rate,
         * after its rate and detune values has been combined with global
         * rate and detune values.
         *
         * @readonly
         * @property {number} totalRate
         * @default 1
         */
        this.totalRate = 1;
        /**
         * A value representing the duration, in seconds.
         * It could be total sound duration or a marker duration.
         *
         * @readonly
         * @property {number} duration
         */
        this.duration = this.duration || 0;
        /**
         * The total duration of the sound in seconds.
         *
         * @readonly
         * @property {number}
         */
        this.totalDuration = this.totalDuration || 0;
        /**
         * A config object used to store default sound settings' values.
         * Default values will be set by properties' setters.
         *
         * @private
         * @property {ISoundConfig} config
         */
        this.config = {
            /**
             * Initializing delay config setting
             */
            delay: 0
        };
        /**
         * Reference to the currently used config.
         * It could be default config or marker config.
         *
         * @private
         * @property {ISoundConfig} currentConfig
         */
        this.currentConfig = this.config;
        /**
         * Boolean indicating whether the sound is muted or not.
         * Gets or sets the muted state of this sound.
         *
         * @property {boolean} mute
         * @default false
         */
        this.mute = false;
        /**
         * Gets or sets the volume of this sound,
         * a value between 0 (silence) and 1 (full volume).
         *
         * @property {number} volume
         * @default 1
         */
        this.volume = 1;
        /**
         * Defines the speed at which the audio asset will be played.
         * Value of 1.0 plays the audio at full speed, 0.5 plays the audio
         * at half speed and 2.0 doubles the audio's playback speed.
         * This value gets multiplied by global rate to have the final playback speed.
         *
         * @property {number} rate
         * @default 1
         */
        this.rate = 1;
        /**
         * Represents detuning of sound in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
         * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
         *
         * @property {number} detune
         * @default 0
         */
        this.detune = 0;
        /**
         * Property representing the position of playback for this sound, in seconds.
         * Setting it to a specific value moves current playback to that position.
         * The value given is clamped to the range 0 to current marker duration.
         * Setting seek of a stopped sound has no effect.
         *
         * @property {number} seek
         * @default 0
         */
        this.seek = 0;
        /**
         * Flag indicating whether or not the sound or current sound marker will loop.
         *
         * @property {boolean} loop
         * @default false
         */
        this.loop = false;
        this.config = Extend(this.config, config);
        /**
         * Object containing markers definitions.
         *
         * @readonly
         * @property {Object.<string, ISoundMarker>} markers
         * @default {}
         */
        this.markers = {};
        /**
         * Currently playing marker.
         * 'null' if whole sound is playing.
         *
         * @readonly
         * @property {ISoundMarker} currentMarker
         * @default null
         */
        this.currentMarker = null;
        /**
         * Flag indicating if destroy method was called on this sound.
         *
         * @private
         * @property {boolean} pendingRemove
         * @default false
         */
        this.pendingRemove = false;
    },
    /**
     * Adds a marker into the current sound. A marker is represented by name, start time, duration, and optionally config object.
     * This allows you to bundle multiple sounds together into a single audio file and use markers to jump between them for playback.
     *
     * @method Phaser.Sound.BaseSound#addMarker
     * @param {ISoundMarker} marker - Marker object
     * @returns {boolean} Whether the marker was added successfully
     */
    addMarker: function (marker) {
        if (!marker) {
            console.error('addMarker - Marker object has to be provided!');
            return false;
        }
        if (!marker.name || typeof marker.name !== 'string') {
            console.error('addMarker - Marker has to have a valid name!');
            return false;
        }
        if (this.markers[marker.name]) {
            console.error('addMarker - Marker with name \'' + marker.name + '\' already exists for sound \'' + this.key + '\'!');
            return false;
        }
        marker = Extend(true, {
            name: '',
            start: 0,
            duration: this.totalDuration,
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
     * @param {ISoundMarker} marker - Marker object with updated values.
     * @returns {boolean} Whether the marker was updated successfully.
     */
    updateMarker: function (marker) {
        if (!marker) {
            console.error('updateMarker - Marker object has to be provided!');
            return false;
        }
        if (!marker.name || typeof marker.name !== 'string') {
            console.error('updateMarker - Marker has to have a valid name!');
            return false;
        }
        if (!this.markers[marker.name]) {
            console.error('updateMarker - Marker with name \'' + marker.name + '\' does not exist for sound \'' + this.key + '\'!');
            return false;
        }
        this.markers[marker.name] = Extend(true, this.markers[marker.name], marker);
        return true;
    },
    /**
     * Removes a marker from the sound.
     *
     * @method Phaser.Sound.BaseSound#removeMarker
     * @param {string} markerName - The name of the marker to remove.
     * @returns {ISoundMarker | null} Removed marker object or 'null' if there was no marker with provided name.
     */
    removeMarker: function (markerName) {
        var marker = this.markers[markerName];
        if (!marker) {
            console.error('removeMarker - Marker with name \'' + marker.name + '\' does not exist for sound \'' + this.key + '\'!');
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
     * @param {string} [markerName=''] - If you want to play a marker then provide the marker name here, otherwise omit it to play the full sound.
     * @param {ISoundConfig} [config] - Optional sound config object to be applied to this marker or entire sound if no marker name is provided. It gets memorized for future plays of current section of the sound.
     * @returns {boolean} Whether the sound started playing successfully.
     */
    play: function (markerName, config) {
        if (markerName === void 0) { markerName = ''; }
        if (typeof markerName === 'object') {
            config = markerName;
            markerName = '';
        }
        if (typeof markerName !== 'string') {
            console.error('Sound marker name has to be a string!');
            return false;
        }
        if (!markerName) {
            this.currentMarker = null;
            this.currentConfig = this.config;
            this.duration = this.totalDuration;
        }
        else {
            if (!this.markers[markerName]) {
                console.error('No marker with name \'' + markerName + '\' found for sound \'' + this.key + '\'!');
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
     * @returns {boolean} Whether the sound was paused successfully.
     */
    pause: function () {
        if (this.isPaused || !this.isPlaying) {
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
     * @returns {boolean} Whether the sound was resumed successfully.
     */
    resume: function () {
        if (!this.isPaused || this.isPlaying) {
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
     * @returns {boolean} Whether the sound was stopped successfully.
     */
    stop: function () {
        if (!this.isPaused && !this.isPlaying) {
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
     * @protected
     * @method Phaser.Sound.BaseSound#applyConfig
     */
    applyConfig: function () {
        this.mute = this.currentConfig.mute;
        this.volume = this.currentConfig.volume;
        this.rate = this.currentConfig.rate;
        this.detune = this.currentConfig.detune;
        this.loop = this.currentConfig.loop;
    },
    /**
     * Method used internally for resetting values of some of the config properties.
     *
     * @protected
     * @method Phaser.Sound.BaseSound#resetConfig
     */
    resetConfig: function () {
        this.currentConfig.seek = 0;
        this.currentConfig.delay = 0;
    },
    /**
     * Update method called automatically by sound manager on every game step.
     *
     * @override
     * @protected
     * @method Phaser.Sound.BaseSound#update
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: NOOP,
    /**
     * Destroys this sound and all associated events and marks it for removal from the sound manager.
     *
     * @method Phaser.Sound.BaseSound#destroy
     */
    destroy: function () {
        if (this.pendingRemove) {
            return;
        }
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
    },
    /**
     * Method used internally to calculate total playback rate of the sound.
     *
     * @protected
     * @method Phaser.Sound.BaseSound#setRate
     */
    setRate: function () {
        var cent = 1.0005777895065548; // Math.pow(2, 1/1200);
        var totalDetune = this.currentConfig.detune + this.manager.detune;
        var detuneRate = Math.pow(cent, totalDetune);
        this.totalRate = this.currentConfig.rate * this.manager.rate * detuneRate;
    }
});
/**
 * Playback rate.
 *
 * @name Phaser.Sound.BaseSound#rate
 * @property {number} rate
 */
Object.defineProperty(BaseSound.prototype, 'rate', {
    get: function () {
        return this.currentConfig.rate;
    },
    set: function (value) {
        this.currentConfig.rate = value;
        this.setRate();
        /**
         * @event Phaser.Sound.BaseSound#rate
         * @param {Phaser.Sound.BaseSound} sound - Reference to the sound that emitted event.
         * @param {number} value - An updated value of Phaser.Sound.BaseSound#rate property.
         */
        this.emit('rate', this, value);
    }
});
/**
 * Detuning of sound.
 *
 * @name Phaser.Sound.BaseSound#detune
 * @property {number} detune
 */
Object.defineProperty(BaseSound.prototype, 'detune', {
    get: function () {
        return this.currentConfig.detune;
    },
    set: function (value) {
        this.currentConfig.detune = value;
        this.setRate();
        this.emit('detune', this, value);
    }
});
module.exports = BaseSound;
