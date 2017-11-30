var Class = require('../../utils/Class');
var WebAudioSound = require('./WebAudioSound');
var WebAudioSpriteSound = new Class({
    Extends: WebAudioSound,
    initialize: function WebAudioSpriteSound(manager, key, config) {
        if (config === void 0) { config = {}; }
        WebAudioSound.call(this, manager, key, config);
    }
});
module.exports = WebAudioSpriteSound;
