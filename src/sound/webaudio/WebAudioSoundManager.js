/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
var Class = require('../../utils/Class');
var BaseSoundManager = require('../BaseSoundManager');
var WebAudioSound = require('./WebAudioSound');

/**
 * @classdesc
 * Web Audio API implementation of the sound manager.
 *
 * @class WebAudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberOf Phaser.Sound
 * @constructor
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
var WebAudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function WebAudioSoundManager (game)
    {
        /**
         * The AudioContext being used for playback.
         *
         * @name Phaser.Sound.WebAudioSoundManager#context
         * @type {AudioContext}
         * @private
         * @since 3.0.0
         */
        this.context = this.createAudioContext(game);

        /**
         * Gain node responsible for controlling global muting.
         *
         * @name Phaser.Sound.WebAudioSoundManager#masterMuteNode
         * @type {GainNode}
         * @private
         * @since 3.0.0
         */
        this.masterMuteNode = this.context.createGain();

        /**
         * Gain node responsible for controlling global volume.
         *
         * @name Phaser.Sound.WebAudioSoundManager#masterVolumeNode
         * @type {GainNode}
         * @private
         * @since 3.0.0
         */
        this.masterVolumeNode = this.context.createGain();
        this.masterMuteNode.connect(this.masterVolumeNode);
        this.masterVolumeNode.connect(this.context.destination);

        /**
         * Destination node for connecting individual sounds to.
         *
         * @name Phaser.Sound.WebAudioSoundManager#destination
         * @type {AudioNode}
         * @private
         * @since 3.0.0
         */
        this.destination = this.masterMuteNode;
        this.locked = this.context.state === 'suspended' && 'ontouchstart' in window;
        BaseSoundManager.call(this, game);
    },

    /**
     * Method responsible for instantiating and returning AudioContext instance.
     * If an instance of an AudioContext class was provided trough the game config,
     * that instance will be returned instead. This can come in handy if you are reloading
     * a Phaser game on a page that never properly refreshes (such as in an SPA project)
     * and you want to reuse already instantiated AudioContext.
     *
     * @method Phaser.Sound.WebAudioSoundManager#createAudioContext
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - Reference to the current game instance.
     *
     * @return {AudioContext} The AudioContext instance to be used for playback.
     */
    createAudioContext: function (game)
    {
        var audioConfig = game.config.audio;
        if (audioConfig && audioConfig.context)
        {
            audioConfig.context.resume();
            return audioConfig.context;
        }
        return new AudioContext();
    },

    /**
     * Adds a new sound into the sound manager.
     *
     * @method Phaser.Sound.WebAudioSoundManager#add
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {Phaser.Sound.WebAudioSound} The new sound instance.
     */
    add: function (key, config)
    {
        var sound = new WebAudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    },

    /**
     * Unlocks Web Audio API on iOS devices on the initial touch event.
     *
     * Read more about how this issue is handled here in [this article](https://medium.com/@pgoloskokovic/unlocking-web-audio-the-smarter-way-8858218c0e09).
     *
     * @method Phaser.Sound.WebAudioSoundManager#unlock
     * @private
     * @since 3.0.0
     */
    unlock: function ()
    {
        var _this = this;
        var unlock = function ()
        {
            _this.context.resume().then(function ()
            {
                document.body.removeEventListener('touchstart', unlock);
                document.body.removeEventListener('touchend', unlock);
                _this.unlocked = true;
            });
        };
        document.body.addEventListener('touchstart', unlock, false);
        document.body.addEventListener('touchend', unlock, false);
    },

    /**
     * Method used internally for pausing sound manager if
     * Phaser.Sound.WebAudioSoundManager#pauseOnBlur is set to true.
     *
     * @method Phaser.Sound.WebAudioSoundManager#onBlur
     * @protected
     * @since 3.0.0
     */
    onBlur: function ()
    {
        this.context.suspend();
    },

    /**
     * Method used internally for resuming sound manager if
     * Phaser.Sound.WebAudioSoundManager#pauseOnBlur is set to true.
     *
     * @method Phaser.Sound.WebAudioSoundManager#onFocus
     * @protected
     * @since 3.0.0
     */
    onFocus: function ()
    {
        this.context.resume();
    },

    /**
     * Calls Phaser.Sound.BaseSoundManager#destroy method
     * and cleans up all Web Audio API related stuff.
     *
     * @method Phaser.Sound.WebAudioSoundManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.destination = null;
        this.masterVolumeNode.disconnect();
        this.masterVolumeNode = null;
        this.masterMuteNode.disconnect();
        this.masterMuteNode = null;
        if (this.game.config.audio && this.game.config.audio.context)
        {
            this.context.suspend();
        }
        else
        {
            this.context.close();
        }
        this.context = null;
        BaseSoundManager.prototype.destroy.call(this);
    }
});
Object.defineProperty(WebAudioSoundManager.prototype, 'mute', {
    get: function ()
    {
        return this.masterMuteNode.gain.value === 0;
    },
    set: function (value)
    {
        this.masterMuteNode.gain.setValueAtTime(value ? 0 : 1, 0);

        /**
         * @event Phaser.Sound.WebAudioSoundManager#mute
         * @param {Phaser.Sound.WebAudioSoundManager} soundManager - Reference to the sound manager that emitted event.
         * @param {boolean} value - An updated value of Phaser.Sound.WebAudioSoundManager#mute property.
         */
        this.emit('mute', this, value);
    }
});
Object.defineProperty(WebAudioSoundManager.prototype, 'volume', {
    get: function ()
    {
        return this.masterVolumeNode.gain.value;
    },
    set: function (value)
    {
        this.masterVolumeNode.gain.setValueAtTime(value, 0);

        /**
         * @event Phaser.Sound.WebAudioSoundManager#volume
         * @param {Phaser.Sound.WebAudioSoundManager} soundManager - Reference to the sound manager that emitted event.
         * @param {number} value - An updated value of Phaser.Sound.WebAudioSoundManager#volume property.
         */
        this.emit('volume', this, value);
    }
});
module.exports = WebAudioSoundManager;
