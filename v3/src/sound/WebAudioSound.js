var Class = require('../utils/Class');
var BaseSound = require('./BaseSound');
var Extend = require('../utils/object/Extend');
//  Phaser.Sound.WebAudioSound
var WebAudioSound = new Class({
    Extends: BaseSound,
    initialize: function WebAudioSound(manager, key, config) {
        /**
         * [description]
         *
         * @property {AudioBuffer} audioBuffer
         */
        this.audioBuffer = manager.game.cache.audio.get(key);
        if (!this.audioBuffer) {
            console.error('No audio loaded in cache with key: \'' + key + '\'!');
            return;
        }
        if (config === void 0) {
            config = {};
        }
        config.duration = this.audioBuffer.duration;
        BaseSound.call(this, manager, key, config);
    },
    play: function (marker, config) {
        if (marker === void 0) { marker = ''; }
        if (typeof marker !== 'string') {
            console.error('Sound marker has to be a string!');
            return;
        }
        if (config) {
            if (!marker) {
                this.config = Extend(this.config, config);
            }
            else {
                this.markers[marker].config = Extend(this.markers[marker].config, config);
            }
        }
        var source = this.manager.context.createBufferSource();
        // TODO assign config values to buffer source
        source.buffer = this.audioBuffer;
        source.connect(this.manager.context.destination);
        source.start();
        return this;
    }
});
module.exports = WebAudioSound;
