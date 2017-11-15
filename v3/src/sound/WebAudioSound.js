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
         * @property {AudioBufferSourceNode} source
         */
        this.source = null;
        /**
         * [description]
         *
         * @property {GainNode} muteNode
         */
        this.muteNode = manager.context.createGain();
        /**
         * [description]
         *
         * @property {GainNode} volumeNode
         */
        this.volumeNode = manager.context.createGain();
        this.muteNode.connect(this.volumeNode);
        this.volumeNode.connect(manager.destination);
        if (config === void 0) {
            config = {};
        }
        config.duration = this.audioBuffer.duration;
        BaseSound.call(this, manager, key, config);
    },
    play: function (marker, config) {
        if (marker === void 0) { marker = ''; }
        if (typeof marker !== 'string') {
            console.error('Sound marker name has to be a string!');
            return;
        }
        if (!marker) {
            this.currentConfig = this.config;
        }
        else {
            if (!this.markers[marker]) {
                console.error('No marker with name \'' + marker + '\' found for sound \'' + this.key + '\'!');
                return;
            }
            this.currentMarker = marker;
            this.currentConfig = this.markers[marker].config;
        }
        this.currentConfig = Extend(this.currentConfig, config);
        this.source = this.manager.context.createBufferSource();
        // TODO assign config values to buffer source
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.muteNode);
        this.source.start();
        return this;
    }
});
/**
 * Mute setting.
 * @property {boolean} mute
 */
Object.defineProperty(WebAudioSound.prototype, 'mute', {
    get: function () {
        return this.muteNode.gain.value === 0;
    },
    set: function (value) {
        this.muteNode.gain.value = value ? 0 : 1;
    }
});
/**
 * Volume setting.
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
