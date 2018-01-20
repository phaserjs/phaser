var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var NoAudioSound = new Class({
    Extends: EventEmitter,
    initialize: function NoAudioSound(manager, key, config) {
        EventEmitter.call(this);
        this.manager = manager;
    }
});
module.exports = NoAudioSound;
