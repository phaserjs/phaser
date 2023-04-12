/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Base64ToArrayBuffer = require('../../utils/base64/Base64ToArrayBuffer');
var BaseSoundManager = require('../BaseSoundManager');
var Class = require('../../utils/Class');
var Events = require('../events');
var GameEvents = require('../../core/events');
var WebAudioSound = require('./WebAudioSound');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @classdesc
 * Web Audio API implementation of the Sound Manager.
 *
 * Not all browsers can play all audio formats.
 *
 * There is a good guide to what's supported: [Cross-browser audio basics: Audio codec support](https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Cross-browser_audio_basics#Audio_Codec_Support).
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
         * @since 3.0.0
         */
        this.context = this.createAudioContext(game);

        /**
         * Gain node responsible for controlling global muting.
         *
         * @name Phaser.Sound.WebAudioSoundManager#masterMuteNode
         * @type {GainNode}
         * @since 3.0.0
         */
        this.masterMuteNode = this.context.createGain();

        /**
         * Gain node responsible for controlling global volume.
         *
         * @name Phaser.Sound.WebAudioSoundManager#masterVolumeNode
         * @type {GainNode}
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
         * @since 3.0.0
         */
        this.destination = this.masterMuteNode;

        this.locked = this.context.state === 'suspended' && ('ontouchstart' in window || 'onclick' in window);

        BaseSoundManager.call(this, game);

        if (this.locked && game.isBooted)
        {
            this.unlock();
        }
        else
        {
            game.events.once(GameEvents.BOOT, this.unlock, this);
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
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - Reference to the current game instance.
     *
     * @return {AudioContext} The AudioContext instance to be used for playback.
     */
    createAudioContext: function (game)
    {
        var audioConfig = game.config.audio;

        if (audioConfig.context)
        {
            audioConfig.context.resume();

            return audioConfig.context;
        }

        if (window.hasOwnProperty('AudioContext'))
        {
            return new AudioContext();
        }
        else if (window.hasOwnProperty('webkitAudioContext'))
        {
            return new window.webkitAudioContext();
        }
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
     * Sets the X and Y position of the Spatial Audio listener on this Web Audios context.
     *
     * If you call this method with no parameters it will default to the center-point of
     * the game canvas. Depending on the type of game you're making, you may need to call
     * this method constantly to reset the listener position as the camera scrolls.
     *
     * Calling this method does nothing on HTML5Audio.
     *
     * @method Phaser.Sound.WebAudioSoundManager#setListenerPosition
     * @since 3.60.0
     *
     * @param {number} [x] - The x position of the Spatial Audio listener.
     * @param {number} [y] - The y position of the Spatial Audio listener.
     */
    setListenerPosition: function (x, y)
    {
        if (x === undefined) { x = this.game.scale.width / 2; }
        if (y === undefined) { y = this.game.scale.height / 2; }

        this.listenerPosition.set(x, y);

        return this;
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
            if (_this.context && body)
            {
                var bodyRemove = body.removeEventListener;

                _this.context.resume().then(function ()
                {
                    bodyRemove('touchstart', unlockHandler);
                    bodyRemove('touchend', unlockHandler);
                    bodyRemove('click', unlockHandler);
                    bodyRemove('keydown', unlockHandler);

                    _this.unlocked = true;
                }, function ()
                {
                    bodyRemove('touchstart', unlockHandler);
                    bodyRemove('touchend', unlockHandler);
                    bodyRemove('click', unlockHandler);
                    bodyRemove('keydown', unlockHandler);
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
        var context = this.context;

        if (context && !this.locked && (context.state === 'suspended' || context.state === 'interrupted'))
        {
            context.resume();
        }
    },

    /**
     * Update method called on every game step.
     *
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
        var listener = this.context.listener;

        if (listener && listener.positionX !== undefined)
        {
            var x = GetFastValue(this.listenerPosition, 'x', null);
            var y = GetFastValue(this.listenerPosition, 'y', null);

            if (x && x !== this._spatialx)
            {
                this._spatialx = listener.positionX.value = x;
            }
            if (y && y !== this._spatialy)
            {
                this._spatialy = listener.positionY.value = y;
            }
        }

        BaseSoundManager.prototype.update.call(this, time, delta);

        //  Resume interrupted audio on iOS only if the game has focus
        if (!this.gameLostFocus)
        {
            this.onFocus();
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

        if (this.game.config.audio.context)
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
