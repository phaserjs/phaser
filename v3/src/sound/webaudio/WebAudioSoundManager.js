var Class = require('../../utils/Class');
var BaseSoundManager = require('../BaseSoundManager');
var WebAudioSound = require('./WebAudioSound');
var SoundValueEvent = require('../SoundValueEvent');
/*!
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */
var WebAudioSoundManager = new Class({
    Extends: BaseSoundManager,
    /**
     * Web Audio API implementation of the sound manager.
     *
     * @class Phaser.Sound.WebAudioSoundManager
     * @constructor
     * @param {Phaser.Game} game - Reference to the current game instance.
     */
    initialize: function WebAudioSoundManager(game) {
        /**
         * The AudioContext being used for playback.
         *
         * @private
         * @property {AudioContext} context
         */
        this.context = this.createAudioContext(game);
        /**
         * Gain node responsible for controlling global muting.
         *
         * @private
         * @property {GainNode} masterMuteNode
         */
        this.masterMuteNode = this.context.createGain();
        /**
         * Gain node responsible for controlling global volume.
         *
         * @private
         * @property {GainNode} masterVolumeNode
         */
        this.masterVolumeNode = this.context.createGain();
        this.masterMuteNode.connect(this.masterVolumeNode);
        this.masterVolumeNode.connect(this.context.destination);
        /**
         * Destination node for connecting individual sounds to.
         *
         * @private
         * @property {AudioNode} destination
         */
        this.destination = this.masterMuteNode;
        this.unlock();
        BaseSoundManager.call(this, game);
    },
    /**
     * Method responsible for instantiating and returning AudioContext instance.
     * If an instance of an AudioContext class was provided trough the game config,
     * that instance will be returned instead. This can come in handy if you are reloading
     * a Phaser game on a page that never properly refreshes (such as in an SPA project)
     * and you want to reuse already instantiated AudioContext.
     *
     * @private
     * @method Phaser.Sound.WebAudioSoundManager#createAudioContext
     * @param {Phaser.Game} game - Reference to the current game instance.
     * @returns {AudioContext} The AudioContext instance to be used for playback.
     */
    createAudioContext: function (game) {
        var audioConfig = game.config.audio;
        if (audioConfig && audioConfig.context) {
            return audioConfig.context;
        }
        return new (window['AudioContext'] || window['webkitAudioContext'])();
    },
    /**
     * Adds a new sound into the sound manager.
     *
     * @method Phaser.Sound.WebAudioSoundManager#add
     * @param {string} key - Asset key for the sound.
     * @param {ISoundConfig} [config] - An optional config object containing default sound settings.
     * @returns {Phaser.Sound.WebAudioSound} The new sound instance.
     */
    add: function (key, config) {
        var sound = new WebAudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    },
    /**
     * Unlocks Web Audio API on iOS devices on the initial touch event.
     * Read more about how this issue is handled here in [this article](TODO add link).
     *
     * @private
     * @method Phaser.Sound.WebAudioSoundManager#unlock
     */
    unlock: function () {
        var _this = this;
        if (this.context.state === 'suspended' && 'ontouchstart' in window) {
            var unlock_1 = function () {
                _this.context.resume().then(function () {
                    document.body.removeEventListener('touchstart', unlock_1);
                    document.body.removeEventListener('touchend', unlock_1);
                });
            };
            document.body.addEventListener('touchstart', unlock_1, false);
            document.body.addEventListener('touchend', unlock_1, false);
        }
    },
    /**
     * @protected
     * @method Phaser.Sound.WebAudioSoundManager#onBlur
     */
    onBlur: function () {
        this.context.suspend();
    },
    /**
     * @protected
     * @method Phaser.Sound.WebAudioSoundManager#onFocus
     */
    onFocus: function () {
        this.context.resume();
    }
});
/**
 * Global mute setting.
 *
 * @name Phaser.Sound.WebAudioSoundManager#mute
 * @property {boolean} mute
 */
Object.defineProperty(WebAudioSoundManager.prototype, 'mute', {
    get: function () {
        return this.masterMuteNode.gain.value === 0;
    },
    set: function (value) {
        this.masterMuteNode.gain.setValueAtTime(value ? 0 : 1, 0);
        this.events.dispatch(new SoundValueEvent(this, 'SOUND_MUTE', value));
    }
});
/**
 * Global volume setting.
 * @property {number} volume
 */
Object.defineProperty(WebAudioSoundManager.prototype, 'volume', {
    get: function () {
        return this.masterVolumeNode.gain.value;
    },
    set: function (value) {
        this.masterVolumeNode.gain.setValueAtTime(value, 0);
        this.events.dispatch(new SoundValueEvent(this, 'SOUND_VOLUME', value));
    }
});
module.exports = WebAudioSoundManager;
