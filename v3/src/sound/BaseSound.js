var Class = require('../utils/Class');
var Extend = require('../utils/object/Extend');
var EventDispatcher = require('../events/EventDispatcher');
var NOOP = require('../utils/NOOP');
/*!
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */
var BaseSound = new Class({
    /**
     * @class Phaser.Sound.BaseSound
     * @constructor
     * @param {ISoundManager} manager - Reference to the current sound manager instance.
     * @param {string} key - Asset key for the sound.
     * @param {ISoundConfig} [config] - An optional config object containing default sound settings.
     */
    initialize: function BaseSound(manager, key, config) {
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
         * Event dispatcher used to handle all sound instance relevant events.
         *
         * @readonly
         * @property {Phaser.Events.EventDispatcher}
         */
        this.events = new EventDispatcher();
        /**
         * Flag indicating if sound is currently playing.
         *
         * @readonly
         * @property {boolean} isPlaying
         */
        this.isPlaying = false;
        /**
         * Flag indicating if sound is currently paused.
         *
         * @readonly
         * @property {boolean} isPaused
         */
        this.isPaused = false;
        /**
         * A property that holds the value of sound's actual playback rate,
         * after its rate and detune values has been combined with global
         * rate and detune values.
         *
         * @readonly
         * @property {number} totalRate
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
         */
        this.mute = false;
        /**
         * Gets or sets the volume of this sound,
         * a value between 0 (silence) and 1 (full volume).
         *
         * @property {number} volume
         */
        this.volume = 1;
        /**
         * Defines the speed at which the audio asset will be played.
         * Value of 1.0 plays the audio at full speed, 0.5 plays the audio
         * at half speed and 2.0 doubles the audio's playback speed.
         * This value gets multiplied by global rate to have the final playback speed.
         *
         * @property {number} rate
         */
        this.rate = 1;
        /**
         * Represents detuning of sound in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
         * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
         *
         * @property {number} detune
         */
        this.detune = 0;
        /**
         * Property representing the position of playback for this sound, in seconds.
         * Setting it to a specific value moves current playback to that position.
         * The value given is clamped to the range 0 to current marker duration.
         * Setting seek of a stopped sound has no effect.
         *
         * @property {number} seek
         */
        this.seek = 0;
        /**
         * Flag indicating whether or not the sound or current sound marker will loop.
         *
         * @property {boolean} loop
         */
        this.loop = false;
        this.config = Extend(this.config, config);
        /**
         * Object containing markers definitions.
         *
         * @readonly
         * @property {{}} markers
         */
        this.markers = {};
        /**
         * Currently playing marker.
         * 'null' if whole sound is playing.
         *
         * @readonly
         * @property {ISoundMarker} currentMarker
         */
        this.currentMarker = null;
        /**
         * Flag indicating if destroy method was called on this sound.
         *
         * @private
         * @property {boolean} pendingRemove
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
     * @returns {ISoundMarker|null} Removed marker object or 'null' if there was no marker with provided name.
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
     * @returns {ISound} This sound instance.
     */
    play: function (markerName, config) {
        if (markerName === void 0) { markerName = ''; }
        if (typeof markerName === 'object') {
            config = markerName;
            markerName = '';
        }
        if (typeof markerName !== 'string') {
            console.error('Sound marker name has to be a string!');
            return null;
        }
        if (!markerName) {
            this.currentMarker = null;
            this.currentConfig = this.config;
            this.duration = this.totalDuration;
        }
        else {
            if (!this.markers[markerName]) {
                console.error('No marker with name \'' + markerName + '\' found for sound \'' + this.key + '\'!');
                return null;
            }
            this.currentMarker = this.markers[markerName];
            this.currentConfig = this.currentMarker.config;
            this.duration = this.currentMarker.duration;
        }
        this.resetConfig();
        this.currentConfig = Extend(this.currentConfig, config);
        this.isPlaying = true;
        this.isPaused = false;
        return this;
    },
    pause: function () {
        if (this.isPaused || !this.isPlaying) {
            return false;
        }
        this.isPlaying = false;
        this.isPaused = true;
        return true;
    },
    resume: function () {
        if (!this.isPaused || this.isPlaying) {
            return false;
        }
        this.isPlaying = true;
        this.isPaused = false;
        return true;
    },
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
     * @protected
     */
    applyConfig: function () {
        this.mute = this.currentConfig.mute;
        this.volume = this.currentConfig.volume;
        this.rate = this.currentConfig.rate;
        this.detune = this.currentConfig.detune;
        this.loop = this.currentConfig.loop;
    },
    /**
     * @protected
     */
    resetConfig: function () {
        this.currentConfig.seek = 0;
        this.currentConfig.delay = 0;
    },
    /**
     * @protected
     */
    update: NOOP,
    destroy: function () {
        if (this.pendingRemove) {
            return;
        }
        this.pendingRemove = true;
        this.manager = null;
        this.key = '';
        this.events.destroy();
        this.events = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.config = null;
        this.currentConfig = null;
        this.markers = null;
        this.currentMarker = null;
    },
    /**
     * @protected
     */
    setRate: function () {
        var cent = 1.0005777895065548; // Math.pow(2, 1/1200);
        var totalDetune = this.currentConfig.detune + this.manager.detune;
        var detuneRate = Math.pow(cent, totalDetune);
        this.totalRate = this.currentConfig.rate * this.manager.rate * detuneRate;
    }
});
module.exports = BaseSound;
