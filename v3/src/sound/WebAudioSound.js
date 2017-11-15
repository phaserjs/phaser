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
        /**
         * [description]
         *
         * @property {GainNode} volumeNode
         */
        this.volumeNode = manager.context.createGain();
        /**
         * [description]
         *
         * @property {GainNode} muteNode
         */
        this.muteNode = manager.context.createGain();
        this.volumeNode.connect(this.muteNode);
        this.muteNode.connect(manager.destination);
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
        source.connect(this.volumeNode);
        source.start();
        return this;
    }
});
/**
 * Global volume setting.
 * @property {number} volume
 */
Object.defineProperty(WebAudioSound.prototype, 'volume', {
    get: function () {
        return this.volumeNode.gain.value;
    },
    set: function (value) {
        this.volumeNode.gain.value = value;
    }
});
module.exports = WebAudioSound;
