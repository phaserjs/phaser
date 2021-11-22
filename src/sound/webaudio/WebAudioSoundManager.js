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
var GetFastValue = require('../../utils/object/GetFastValue');
var Map = require('../../structs/Map');
var WebAudioSound = require('./WebAudioSound');

/**
 * @classdesc
 * Web Audio API implementation of the Sound Manager.
 *
 * Not all browsers can play all audio formats.
 *
 * There is a good guide to what's supported: [Cross-browser audio basics: Audio codec support](https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Cross-browser_audio_basics#Audio_Codec_Support).
 *
 * Audio cannot be played without a user-gesture in the browser: https://developer.chrome.com/blog/autoplay/
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
        this.config = game.config.audio;

        /**
         * The AudioContext being used for playback.
         *
         * @name Phaser.Sound.WebAudioSoundManager#context
         * @type {AudioContext}
         * @since 3.0.0
         */
        this.context;

        /**
         * Gain node responsible for controlling global muting.
         *
         * @name Phaser.Sound.WebAudioSoundManager#masterMuteNode
         * @type {GainNode}
         * @since 3.0.0
         */
        this.masterMuteNode;

        /**
         * Gain node responsible for controlling global volume.
         *
         * @name Phaser.Sound.WebAudioSoundManager#masterVolumeNode
         * @type {GainNode}
         * @since 3.0.0
         */
        this.masterVolumeNode;

        /**
         * Destination node for connecting individual sounds to.
         *
         * @name Phaser.Sound.WebAudioSoundManager#destination
         * @type {AudioNode}
         * @since 3.0.0
         */
        this.destination;

        /**
         * Audio files pending decoding.
         *
         * @name Phaser.Sound.WebAudioSoundManager#decodeQueue
         * @type {Phaser.Structs.Map.<string, Phaser.Types.Sound.WebAudioDecodeEntry>}
         * @since 3.60.0
         */
        this.decodeQueue = new Map();

        /**
         * Will audio files be decoded on-demand (i.e. as they are played),
         * or as they are loaded? They can only be decoded on load if the
         * audio context has been unlocked, otherwise they are stacked in
         * the 'decodeQueue' awaiting a user gesture, which once received
         * will decode them all at once.
         *
         * You can also choose to decode any, or all, queued audio by calling
         * the `processQueue` function directly. Again, this can only be done
         * after the context has been unlocked.
         *
         * @name Phaser.Sound.WebAudioSoundManager#decodeOnDemand
         * @type {boolean}
         * @since 3.60.0
         */
        this.decodeOnDemand = GetFastValue(this.config, 'decodeOnDemand', true);

        /**
         * The Audio cache, where decoded audio data is stored.
         *
         * @name Phaser.Sound.WebAudioSoundManager#cache
         * @type {Phaser.Cache.BaseCache}
         * @since 3.60.0
         */
        this.cache = game.cache.audio;

        BaseSoundManager.call(this, game);
    },

    /**
     * Handles additional processing when this Audio Manager is unlocked.
     *
     * @method Phaser.Sound.WebAudioSoundManager#unlockHandler
     * @since 3.60.0
     */
    unlockHandler: function ()
    {
        this.createAudioContext();
    },

    /**
     * Method responsible for instantiating and returning AudioContext instance.
     * If an instance of an AudioContext class was provided through the game config,
     * that instance will be returned instead. This can come in handy if you are reloading
     * a Phaser game on a page that never properly refreshes (such as in an SPA project)
     * and you want to reuse an already instantiated AudioContext.
     *
     * @method Phaser.Sound.WebAudioSoundManager#createAudioContext
     * @since 3.0.0
     *
     * @return {AudioContext} The AudioContext instance to be used for playback.
     */
    createAudioContext: function ()
    {
        var context;
        var audioConfig = this.config;

        if (audioConfig.context)
        {
            audioConfig.context.resume();

            context = audioConfig.context;
        }

        if (window.hasOwnProperty('AudioContext'))
        {
            context = new AudioContext({ latencyHint: 'interactive' });
        }
        else if (window.hasOwnProperty('webkitAudioContext'))
        {
            context = new window.webkitAudioContext({ latencyHint: 'interactive' });
        }

        this.setAudioContext(context);

        if (this.locked)
        {
            this.unlocked = true;
            this.locked = false;

            this.emit(Events.UNLOCKED, this);
        }

        return context;
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
     * This will process either the entire queue of audio awaiting decoding, or,
     * if an array of keys are given, just those audio files.
     *
     * Decoding only starts of the Audio Context has been unlocked via a user
     * gesture. If it hasn't, this method will return `false` and no decoding
     * will take place.
     *
     * This will call `AudioContext.decodeAudioData` on the sounds. If they successfully decode, they will
     * be added to the audio cache and can be played via the `play` method by passing their key.
     *
     * If they fail, it will throw an error.
     *
     * Decoding time varies, based on the audio file format, the encoder used, the browser
     * and the device / CPU it is running on. This decoding time is outside of the control of Phaser.
     *
     * If you need to know when something has decoded, please use the relevant audio events.
     *
     * @method Phaser.Sound.WebAudioSoundManager#decodeAudioQueue
     * @fires Phaser.Sound.Events#DECODED
     * @fires Phaser.Sound.Events#DECODED_KEY
     * @fires Phaser.Sound.Events#DECODED_ALL
     * @since 3.60.0
     *
     * @param {(string|string[])} [key] - The key, or an array of keys, of the sound to be decoded. If not given, all sounds are decoded.
     *
     * @return {boolean} `true` if the audio started to decode, otherwise `false`.
     */
    decodeAudioQueue: function (key)
    {
        var context = this.context;
        var queue = this.decodeQueue;

        if (key && !Array.isArray(key))
        {
            key = [ key ];
        }

        var isDecoding = false;

        if (context)
        {
            for (var i = 0; i < key.length; i++)
            {
                var entry = queue.get(key[i]);

                if (entry && !entry.decoding)
                {
                    entry.decoding = true;

                    context.decodeAudioData(entry.data, entry.success, entry.failure);

                    isDecoding = true;
                }
            }
        }

        return isDecoding;
    },

    /**
     * Decode audio data into a format ready for playback via Web Audio.
     *
     * The audio data can be a base64 encoded string, an audio media-type data uri, or an ArrayBuffer instance.
     *
     * The `audioKey` is the key that will be used to save the decoded audio to the audio cache and it
     * must be unique within the cache.
     *
     * Instead of passing a single entry you can pass an array of `Phaser.Types.Sound.DecodeAudioConfig`
     * objects as the first and only argument.
     *
     * Decoding is an async process, so be sure to listen for the events to know when decoding has completed.
     *
     * Not all browsers can decode all audio formats, so if you're calling this method with your own audio
     * data please ensure you pass only data suitable for the browser, or it will throw an error.
     *
     * Once the audio has decoded it can be played via its key.
     *
     * @method Phaser.Sound.WebAudioSoundManager#decodeAudio
     * @fires Phaser.Sound.Events#DECODED
     * @fires Phaser.Sound.Events#DECODED_KEY
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
            audioFiles = [ { key: audioKey, data: audioData, decoding: false } ];
        }
        else
        {
            audioFiles = audioKey;
        }

        var cache = this.game.cache.audio;
        var remaining = audioFiles.length;
        var context = this.context;
        var queue = this.decodeQueue;

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

                this.emit(Events.DECODED, key, audioBuffer);
                this.emit(Events.DECODED_KEY + key, audioBuffer);

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

            if (!context || this.decodeOnDemand)
            {
                queue.set(key, { data: data, success: success, failure: failure, decoding: false });
            }
            else
            {
                entry.decoding = true;

                context.decodeAudioData(data, success, failure);
            }
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
        if (!this.locked && this.context)
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
        var context = this.context;

        if (context && (context.state === 'suspended' || context.state === 'interrupted') && !this.locked)
        {
            context.resume();
        }
    },

    /**
     * Update method called on every game step.
     * Removes destroyed sounds and updates every active sound in the game.
     *
     * @method Phaser.Sound.WebAudioSoundManager#update
     * @protected
     * @fires Phaser.Sound.Events#UNLOCKED
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: function (time, delta)
    {
        BaseSoundManager.prototype.update.call(this, time, delta);

        var context = this.context;

        //  Resume interrupted audio on iOS
        if (context && context.state === 'interrupted')
        {
            context.resume();
        }
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
     * @name Phaser.Sound.WebAudioSoundManager#mute
     * @type {boolean}
     * @fires Phaser.Sound.Events#GLOBAL_MUTE
     * @since 3.0.0
     */
    mute: {

        get: function ()
        {
            return (this.masterMuteNode && this.masterMuteNode.gain.value === 0);
        },

        set: function (value)
        {
            if (this.masterMuteNode)
            {
                this.masterMuteNode.gain.setValueAtTime(value ? 0 : 1, 0);

                this.emit(Events.GLOBAL_MUTE, this, value);
            }
        }

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
            if (this.masterVolumeNode)
            {
                return this.masterVolumeNode.gain.value;
            }
            else
            {
                return 0;
            }
        },

        set: function (value)
        {
            if (this.masterVolumeNode)
            {
                this.masterVolumeNode.gain.setValueAtTime(value, 0);

                this.emit(Events.GLOBAL_VOLUME, this, value);
            }
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
        if (this.masterVolumeNode)
        {
            this.masterVolumeNode.disconnect();
        }

        if (this.masterMuteNode)
        {
            this.masterMuteNode.disconnect();
        }

        this.decodeQueue.clear();

        this.destination = null;
        this.masterVolumeNode = null;
        this.masterMuteNode = null;
        this.decodeQueue = null;

        if (this.context)
        {
            if (this.config.context)
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
        }

        BaseSoundManager.prototype.destroy.call(this);
    }

});

module.exports = WebAudioSoundManager;
