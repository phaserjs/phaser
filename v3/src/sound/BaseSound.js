var Class = require('../utils/Class');
var Extend = require('../utils/object/Extend');
var EventDispatcher = require('../events/EventDispatcher');
//  Phaser.Sound.BaseSound
var BaseSound = new Class({
    initialize: function BaseSound(manager, key, config) {
        /**
         * Local reference to sound manager.
         * @property {Phaser.Sound.BaseSoundManager} manager
         */
        this.manager = manager;
        this.key = key;
        this.config = Extend({
            mute: false,
            volume: 1,
            rate: 1,
            seek: 0,
            loop: false,
            pan: 0,
            duration: 0 // TODO set duration to correct value
        }, config);
        this.isPlaying = false;
        this.markers = {};
        this.currentMarker = '';
        this.fadeTween = null; // TODO see how to use global tween
        this.mute = false;
        this.volume = 1;
        this.rate = 1;
        this.seek = 0;
        this.loop = false;
        this.pan = 0;
        this.events = new EventDispatcher();
    },
    addMarker: function (marker) {
    },
    removeMarker: function (markerName) {
        return false;
    },
    play: function (marker, config) {
        return this;
    },
    pause: function () {
        return this;
    },
    resume: function () {
        return this;
    },
    stop: function () {
        return this;
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
