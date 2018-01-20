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
    }
});
module.exports = NoAudioSound;
