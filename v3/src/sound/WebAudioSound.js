var Class = require('../utils/Class');
var BaseSound = require('./BaseSound');
//  Phaser.Sound.WebAudioSound
var WebAudioSound = new Class({
    Extends: BaseSound,
    initialize: function WebAudioSound(manager, key, config) {
        /**
         * [description]
         *
         * @property {AudioBuffer} audioBuffer
         */
        this.audioBuffer = this.manager.game.cache.audio.get(key);
        if (!this.audioBuffer) {
            console.error('No audio loaded in cache with key: \'' + key + '\'!');
            return;
        }
        config.duration = this.audioBuffer.duration;
        BaseSound.call(this, manager, key, config);
    }
});
module.exports = WebAudioSound;
