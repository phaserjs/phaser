var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
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
    }
});
module.exports = NoAudioSound;
