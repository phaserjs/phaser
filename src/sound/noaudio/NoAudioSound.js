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
    }
});
module.exports = NoAudioSound;
