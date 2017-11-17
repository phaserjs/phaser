var Class = require('../utils/Class');
var Extend = require('../utils/object/Extend');
var EventDispatcher = require('../events/EventDispatcher');
//  Phaser.Sound.BaseSound
var BaseSound = new Class({
    initialize: function BaseSound(manager, key, config) {
        /**
         * Local reference to the sound manager.
         *
         * @property {Phaser.Sound.BaseSoundManager} manager
         */
        this.manager = manager;
        /**
         * [description]
         *
         * @property {string} key
         */
        this.key = key;
        /**
         * [description]
         *
         * Duration set explicitly, rest of default values
         * will be set by other properties setters.
         *
         * @property {ISoundConfig} config
         */
        this.config = {
            /**
             * A value representing the duration, in seconds.
             * It could be total sound duration or a marker duration.
             *
             * @type {number}
             */
            duration: 0
        };
        /**
         * Reference to the currently used config.
         * It could be default config or marker config.
         *
         * @property {ISoundConfig} currentConfig
         */
        this.currentConfig = this.config;
        /**
         * [description]
         *
         * @property {boolean} mute
         */
        this.mute = false;
        /**
         * [description]
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
         * [description]
         *
         * @property {number} seek
         */
        this.seek = 0;
        /**
         * [description]
         *
         * @property {boolean} loop
         */
        this.loop = false;
        /**
         * [description]
         *
         * @property {number} pan
         */
        this.pan = 0;
        this.config = Extend(this.config, config);
        /**
         * Flag indicating if sound is currently playing.
         *
         * @property {boolean} isPlaying
         */
        this.isPlaying = false;
        /**
         * Flag indicating if sound is currently paused.
         *
         * @property {boolean} isPaused
         */
        this.isPaused = false;
        /**
         * Object containing markers definitions.
         *
         * @property {{}} markers
         */
        this.markers = {};
        /**
         * Name of the currently played marker.
         * If no marker is played, but instead the whole sound
         * the value is an empty string - ''.
         *
         * @property {string} currentMarker
         */
        this.currentMarker = '';
        /**
         * [description]
         *
         * @property {Phaser.Tween}
         */
        this.fadeTween = null; // TODO see how to use global tween
        /**
         * Event dispatches used to handle all sound instance
         * relevant events.
         *
         * @property {Phaser.Events.EventDispatcher}
         */
        this.events = new EventDispatcher();
    },
    // TODO set default methods to NOOP if not used
    addMarker: function (marker) {
        return false;
    },
    removeMarker: function (markerName) {
        return false;
    },
    play: function (marker, config) {
        if (marker === void 0) { marker = ''; }
        if (typeof marker === 'object') {
            config = marker;
            marker = '';
        }
        if (typeof marker !== 'string') {
            console.error('Sound marker name has to be a string!');
            return null;
        }
        if (!marker) {
            this.currentConfig = this.config;
        }
        else {
            if (!this.markers[marker]) {
                console.error('No marker with name \'' + marker + '\' found for sound \'' + this.key + '\'!');
                return null;
            }
            this.currentMarker = marker;
            this.currentConfig = this.markers[marker].config;
        }
        this.currentConfig = Extend(this.currentConfig, config);
        this.isPlaying = true;
        this.isPaused = false;
        return this;
    },
    pause: function () {
        if (this.isPaused) {
            return false;
        }
        this.isPlaying = false;
        this.isPaused = true;
        return true;
    },
    resume: function () {
        if (!this.isPaused) {
            return false;
        }
        this.isPlaying = true;
        this.isPaused = false;
        return true;
    },
    stop: function () {
        if (!this.isPlaying) {
            return false;
        }
        this.isPlaying = false;
        this.isPaused = false;
        return true;
    },
    applyConfig: function () {
        this.mute = this.currentConfig.mute;
        this.volume = this.currentConfig.volume;
        this.rate = this.currentConfig.rate;
        this.detune = this.currentConfig.detune;
        // TODO assign other config values to buffer source
    },
    fadeTo: function (volume, duration) {
        return null;
    },
    update: function () {
    },
    destroy: function () {
    }
});
module.exports = BaseSound;
