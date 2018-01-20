var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var NoAudioSound = new Class({
    Extends: EventEmitter,
    initialize: function NoAudioSound(manager, key, config) {
        EventEmitter.call(this);
    }
});
module.exports = NoAudioSound;
