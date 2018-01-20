var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Extend = require('../utils/object/Extend');
var NoAudioSound = new Class({
    Extends: EventEmitter,
    initialize: function NoAudioSound(manager, key, config) {
        EventEmitter.call(this);
        this.manager = manager;
        this.key = key;
        this.isPlaying = false;
        this.isPaused = false;
        this.totalRate = 1;
        this.duration = 0;
        this.totalDuration = 0;
        this.config = Extend({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }, config);
        this.currentConfig = this.config;
        this.mute = false;
        this.volume = 1;
        this.rate = 1;
        this.detune = 0;
        this.seek = 0;
        this.loop = false;
        this.markers = {};
        this.currentMarker = null;
        this.pendingRemove = false;
    },
    addMarker: function (marker) {
        return false;
    },
    updateMarker: function (marker) {
        return false;
    },
    removeMarker: function (markerName) {
        return null;
    },
    play: function (markerName, config) {
        return false;
    }
});
module.exports = NoAudioSound;
