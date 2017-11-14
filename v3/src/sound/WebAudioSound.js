var Class = require('../utils/Class');
var BaseSound = require('./BaseSound');
//  Phaser.Sound.WebAudioSound
var WebAudioSound = new Class({
    Extends: BaseSound,
    initialize: function WebAudioSound(manager, key, config) {
        // TODO update config duration
        BaseSound.call(this, manager, key, config);
    }
});
module.exports = WebAudioSound;
