/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Base64ToArrayBuffer = require('../../utils/base64/Base64ToArrayBuffer');
var BaseSoundManager = require('../BaseSoundManager');
var Class = require('../../utils/Class');
var Events = require('../events');
var WebAudioSound = require('./WebAudioSound');

/**
 * @classdesc
 * Web Audio API implementation of the sound manager.
 *
 * @class WebAudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
var WebAudioSoundManager = new Class({

    Extends: BaseSoundManager,

    initialize:

    function WebAudioSoundManager (game)
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

        this.locked = this.context.state === 'suspended' && ('ontouchstart' in window || 'onclick' in window);

        BaseSoundManager.call(this, game);

        if (this.locked)
        {
            this.unlock();
        }
    },

    /**
     * Method responsible for instantiating and returning AudioContext instance.
     * If an instance of an AudioContext class was provided through the game config,
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
     * This method takes a new AudioContext reference and then sets
     * this Sound Manager to use that context for all playback.
     * 
     * As part of this call it also disconnects the master mute and volume
     * nodes and then re-creates them on the new given context.
     *
     * @method Phaser.Sound.WebAudioSoundManager#setAudioContext
     * @since 3.21.0
     *
     * @param {AudioContext} context - Reference to an already created AudioContext instance.
     *
     * @return {this} The WebAudioSoundManager instance.
     */
    setAudioContext: function (context)
    {
        if (this.context)
        {
            this.context.close();
        }

        if (this.masterMuteNode)
        {
            this.masterMuteNode.disconnect();
        }

        if (this.masterVolumeNode)
        {
            this.masterVolumeNode.disconnect();
        }

        this.context = context;

        this.masterMuteNode = context.createGain();
        this.masterVolumeNode = context.createGain();

        this.masterMuteNode.connect(this.masterVolumeNode);
        this.masterVolumeNode.connect(context.destination);

        this.destination = this.masterMuteNode;

        return this;
    },

    /**
     * Adds a new sound into the sound manager.
     *
     * @method Phaser.Sound.WebAudioSoundManager#add
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
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
     * Decode audio data into a format ready for playback via Web Audio.
     * 
     * The audio data can be a base64 encoded string, an audio media-type data uri, or an ArrayBuffer instance.
     * 
     * The `audioKey` is the key that will be used to save the decoded audio to the audio cache.
     * 
     * Instead of passing a single entry you can instead pass an array of `Phaser.Types.Sound.DecodeAudioConfig`
     * objects as the first and only argument.
     * 
     * Decoding is an async process, so be sure to listen for the events to know when decoding has completed.
     * 
     * Once the audio has decoded it can be added to the Sound Manager or played via its key.
     *
     * @method Phaser.Sound.WebAudioSoundManager#decodeAudio
     * @fires Phaser.Sound.Events#DECODED
     * @fires Phaser.Sound.Events#DECODED_ALL
     * @since 3.18.0
     *
     * @param {(Phaser.Types.Sound.DecodeAudioConfig[]|string)} [audioKey] - The string-based key to be used to reference the decoded audio in the audio cache, or an array of audio config objects.
     * @param {(ArrayBuffer|string)} [audioData] - The audio data, either a base64 encoded string, an audio media-type data uri, or an ArrayBuffer instance.
     */
    decodeAudio: function (audioKey, audioData)
    {
        var audioFiles;

        if (!Array.isArray(audioKey))
        {
            audioFiles = [ { key: audioKey, data: audioData } ];
        }
        else
        {
            audioFiles = audioKey;
        }

        var cache = this.game.cache.audio;
        var remaining = audioFiles.length;

        for (var i = 0; i < audioFiles.length; i++)
        {
            var entry = audioFiles[i];

            var key = entry.key;
            var data = entry.data;

            if (typeof data === 'string')
            {
                data = Base64ToArrayBuffer(data);
            }

            var success = function (key, audioBuffer)
            {
                cache.add(key, audioBuffer);
    
                this.emit(Events.DECODED, key);

                remaining--;

                if (remaining === 0)
                {
                    this.emit(Events.DECODED_ALL);
                }
            }.bind(this, key);
    
            var failure = function (key, error)
            {
                //  eslint-disable-next-line no-console
                console.error('Error decoding audio: ' + key + ' - ', error ? error.message : '');

                remaining--;

                if (remaining === 0)
                {
                    this.emit(Events.DECODED_ALL);
                }
            }.bind(this, key);

            this.context.decodeAudioData(data, success, failure);
        }
    },

    /**
     * Unlocks Web Audio API on the initial input event.
     *
     * Read more about how this issue is handled here in [this article](https://medium.com/@pgoloskokovic/unlocking-web-audio-the-smarter-way-8858218c0e09).
     *
     * @method Phaser.Sound.WebAudioSoundManager#unlock
     * @since 3.0.0
     */
    unlock: function ()
    {
        var _this = this;

        var body = document.body;

        var unlockHandler = function unlockHandler ()
        {
            if (_this.context)
            {
                _this.context.resume().then(function ()
                {
                    body.removeEventListener('touchstart', unlockHandler);
                    body.removeEventListener('touchend', unlockHandler);
                    body.removeEventListener('click', unlockHandler);
                    body.removeEventListener('keydown', unlockHandler);
    
                    _this.unlocked = true;
                }, function ()
                {
                    body.removeEventListener('touchstart', unlockHandler);
                    body.removeEventListener('touchend', unlockHandler);
                    body.removeEventListener('click', unlockHandler);
                    body.removeEventListener('keydown', unlockHandler);
                });
            }
        };

        if (body)
        {
            body.addEventListener('touchstart', unlockHandler, false);
            body.addEventListener('touchend', unlockHandler, false);
            body.addEventListener('click', unlockHandler, false);
            body.addEventListener('keydown', unlockHandler, false);
        }
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
        if (!this.locked)
        {
            this.context.suspend();
        }
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
        if (!this.locked)
        {
            this.context.resume();
        }
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
            var _this = this;

            this.context.close().then(function ()
            {
                _this.context = null;
            });
        }

        BaseSoundManager.prototype.destroy.call(this);
    },

    /**
     * Sets the muted state of all this Sound Manager.
     *
     * @method Phaser.Sound.WebAudioSoundManager#setMute
     * @fires Phaser.Sound.Events#GLOBAL_MUTE
     * @since 3.3.0
     *
     * @param {boolean} value - `true` to mute all sounds, `false` to unmute them.
     *
     * @return {Phaser.Sound.WebAudioSoundManager} This Sound Manager.
     */
    setMute: function (value)
    {
        this.mute = value;

        return this;
    },

    /**
     * @name Phaser.Sound.WebAudioSoundManager#mute
     * @type {boolean}
     * @fires Phaser.Sound.Events#GLOBAL_MUTE
     * @since 3.0.0
     */
    mute: {

        get: function ()
        {
            return (this.masterMuteNode.gain.value === 0);
        },

        set: function (value)
        {
            this.masterMuteNode.gain.setValueAtTime(value ? 0 : 1, 0);

            this.emit(Events.GLOBAL_MUTE, this, value);
        }

    },

    /**
     * Sets the volume of this Sound Manager.
     *
     * @method Phaser.Sound.WebAudioSoundManager#setVolume
     * @fires Phaser.Sound.Events#GLOBAL_VOLUME
     * @since 3.3.0
     *
     * @param {number} value - The global volume of this Sound Manager.
     *
     * @return {Phaser.Sound.WebAudioSoundManager} This Sound Manager.
     */
    setVolume: function (value)
    {
        this.volume = value;

        return this;
    },

    /**
     * @name Phaser.Sound.WebAudioSoundManager#volume
     * @type {number}
     * @fires Phaser.Sound.Events#GLOBAL_VOLUME
     * @since 3.0.0
     */
    volume: {

        get: function ()
        {
            return this.masterVolumeNode.gain.value;
        },

        set: function (value)
        {
            this.masterVolumeNode.gain.setValueAtTime(value, 0);

            this.emit(Events.GLOBAL_VOLUME, this, value);
        }

    }

});

module.exports = WebAudioSoundManager;
