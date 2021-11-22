/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Clone = require('../utils/object/Clone');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GameEvents = require('../core/events');
var NOOP = require('../utils/NOOP');
var GetAll = require('../utils/array/GetAll');
var GetFirst = require('../utils/array/GetFirst');

/**
 * @classdesc
 * Base class for other Sound Manager classes.
 *
 * @class BaseSoundManager
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 *
 * @see Phaser.Sound.HTML5AudioSoundManager
 * @see Phaser.Sound.NoAudioSoundManager
 * @see Phaser.Sound.WebAudioSoundManager
 */
var BaseSoundManager = new Class({

    Extends: EventEmitter,

    initialize:

    function BaseSoundManager (game)
    {
        EventEmitter.call(this);

        /**
         * Local reference to game.
         *
         * @name Phaser.Sound.BaseSoundManager#game
         * @type {Phaser.Game}
         * @readonly
         * @since 3.0.0
         */
        this.game = game;

        /**
         * Local reference to the JSON Cache, as used by Audio Sprites.
         *
         * @name Phaser.Sound.BaseSoundManager#jsonCache
         * @type {Phaser.Cache.BaseCache}
         * @readonly
         * @since 3.7.0
         */
        this.jsonCache = game.cache.json;

        /**
         * An array containing all added sounds.
         *
         * @name Phaser.Sound.BaseSoundManager#sounds
         * @type {Phaser.Sound.BaseSound[]}
         * @default []
         * @private
         * @since 3.0.0
         */
        this.sounds = [];

        /**
         * Global mute setting.
         *
         * @name Phaser.Sound.BaseSoundManager#mute
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.mute = false;

        /**
         * Global volume setting.
         *
         * @name Phaser.Sound.BaseSoundManager#volume
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.volume = 1;

        /**
         * Flag indicating if sounds should be paused when game looses focus,
         * for instance when user switches to another tab/program/app.
         *
         * @name Phaser.Sound.BaseSoundManager#pauseOnBlur
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.pauseOnBlur = true;

        /**
         * Property that actually holds the value of global playback rate.
         *
         * @name Phaser.Sound.BaseSoundManager#_rate
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._rate = 1;

        /**
         * Property that actually holds the value of global detune.
         *
         * @name Phaser.Sound.BaseSoundManager#_detune
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._detune = 0;

        /**
         * All browsers require sounds to be triggered from an explicit user action,
         * such as a tap, before any sound can be loaded / played on a web page.
         *
         * https://developer.chrome.com/blog/autoplay/
         *
         * Set to true if the audio system is currently locked awaiting user interaction.
         *
         * @name Phaser.Sound.BaseSoundManager#locked
         * @type {boolean}
         * @readonly
         * @since 3.0.0
         */
        this.locked = true;

        /**
         * Flag used internally for handling when the audio system
         * has been unlocked.
         *
         * @name Phaser.Sound.BaseSoundManager#unlocked
         * @type {boolean}
         * @default false
         * @private
         * @since 3.0.0
         */
        this.unlocked = false;


        /**
         *
         *
         * @name Phaser.Sound.BaseSoundManager#pendingUnlock
         * @type {boolean}
         * @since 3.60.0
         */
        this.pendingUnlock = false;

        game.events.on(GameEvents.BLUR, this.onGameBlur, this);
        game.events.on(GameEvents.FOCUS, this.onGameFocus, this);
        game.events.on(GameEvents.PRE_STEP, this.update, this);
        game.events.once(GameEvents.DESTROY, this.destroy, this);

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
     * Unlocks the Audio API on the initial input event.
     *
     * @method Phaser.Sound.BaseSoundManager#unlock
     * @since 3.60.0
     */
    unlock: function ()
    {
        if (this.pendingUnlock)
        {
            return;
        }

        console.log('BaseSoundManager.unlock');

        var _this = this;

        var body = document.body;
        var bodyAdd = body.addEventListener;
        var bodyRemove = body.removeEventListener;

        var unlockHandler = function unlockHandler ()
        {
            if (!_this.pendingUnlock)
            {
                return;
            }

            _this.unlockHandler();

            bodyRemove('touchstart', unlockHandler);
            bodyRemove('touchend', unlockHandler);
            bodyRemove('click', unlockHandler);
            bodyRemove('keydown', unlockHandler);
        };

        if (body)
        {
            bodyAdd('touchstart', unlockHandler, false);
            bodyAdd('touchend', unlockHandler, false);
            bodyAdd('click', unlockHandler, false);
            bodyAdd('keydown', unlockHandler, false);

            this.pendingUnlock = true;
        }
    },

    /**
     * Adds a new sound into the sound manager.
     *
     * @method Phaser.Sound.BaseSoundManager#add
     * @override
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {(Phaser.Sound.BaseSound|Phaser.Sound.NoAudioSound|Phaser.Sound.HTML5AudioSound|Phaser.Sound.WebAudioSound)} The new sound instance.
     */
    add: NOOP,

    /**
     * Adds a new audio sprite sound into the sound manager.
     * Audio Sprites are a combination of audio files and a JSON configuration.
     * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
     *
     * @method Phaser.Sound.BaseSoundManager#addAudioSprite
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {(Phaser.Sound.BaseSound|Phaser.Sound.NoAudioSound|Phaser.Sound.HTML5AudioSound|Phaser.Sound.WebAudioSound)} The new audio sprite sound instance.
     */
    addAudioSprite: function (key, config)
    {
        if (config === undefined) { config = {}; }

        var sound = this.add(key, config);

        sound.spritemap = this.jsonCache.get(key).spritemap;

        for (var markerName in sound.spritemap)
        {
            if (!sound.spritemap.hasOwnProperty(markerName))
            {
                continue;
            }

            var markerConfig = Clone(config);

            var marker = sound.spritemap[markerName];

            markerConfig.loop = (marker.hasOwnProperty('loop')) ? marker.loop : false;

            sound.addMarker({
                name: markerName,
                start: marker.start,
                duration: marker.end - marker.start,
                config: markerConfig
            });
        }

        return sound;
    },

    /**
     * Gets the first sound in the manager matching the given key, if any.
     *
     * @method Phaser.Sound.BaseSoundManager#get
     * @since 3.23.0
     *
     * @param {string} key - Sound asset key.
     *
     * @return {?(Phaser.Sound.BaseSound|Phaser.Sound.NoAudioSound|Phaser.Sound.HTML5AudioSound|Phaser.Sound.WebAudioSound)} - The sound, or null.
     */
    get: function (key)
    {
        return GetFirst(this.sounds, 'key', key);
    },

    /**
     * Gets any sounds in the manager matching the given key.
     *
     * @method Phaser.Sound.BaseSoundManager#getAll
     * @since 3.23.0
     *
     * @param {string} key - Sound asset key.
     *
     * @return {(Phaser.Sound.BaseSound[]|Phaser.Sound.NoAudioSound[]|Phaser.Sound.HTML5AudioSound[]|Phaser.Sound.WebAudioSound[])} - The sounds, or an empty array.
     */
    getAll: function (key)
    {
        return GetAll(this.sounds, 'key', key);
    },

    /**
     * Adds a new sound to the sound manager and plays it.
     * The sound will be automatically removed (destroyed) once playback ends.
     * This lets you play a new sound on the fly without the need to keep a reference to it.
     *
     * @method Phaser.Sound.BaseSoundManager#play
     * @listens Phaser.Sound.Events#COMPLETE
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {(Phaser.Types.Sound.SoundConfig|Phaser.Types.Sound.SoundMarker)} [extra] - An optional additional object containing settings to be applied to the sound. It could be either config or marker object.
     *
     * @return {boolean} Whether the sound started playing successfully.
     */
    play: function (key, extra)
    {
        var sound = this.add(key);

        sound.once(Events.COMPLETE, sound.destroy, sound);

        if (extra)
        {
            if (extra.name)
            {
                sound.addMarker(extra);

                return sound.play(extra.name);
            }
            else
            {
                return sound.play(extra);
            }
        }
        else
        {
            return sound.play();
        }
    },

    /**
     * Adds a new audio sprite sound to the sound manager and plays it.
     * The sprite will be automatically removed (destroyed) once playback ends.
     * This lets you play a new sound on the fly without the need to keep a reference to it.
     *
     * @method Phaser.Sound.BaseSoundManager#playAudioSprite
     * @listens Phaser.Sound.Events#COMPLETE
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {string} spriteName - The name of the sound sprite to play.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {boolean} Whether the audio sprite sound started playing successfully.
     */
    playAudioSprite: function (key, spriteName, config)
    {
        var sound = this.addAudioSprite(key);

        sound.once(Events.COMPLETE, sound.destroy, sound);

        return sound.play(spriteName, config);
    },

    /**
     * Removes a sound from the sound manager.
     * The removed sound is destroyed before removal.
     *
     * @method Phaser.Sound.BaseSoundManager#remove
     * @since 3.0.0
     *
     * @param {Phaser.Sound.BaseSound} sound - The sound object to remove.
     *
     * @return {boolean} True if the sound was removed successfully, otherwise false.
     */
    remove: function (sound)
    {
        var index = this.sounds.indexOf(sound);

        if (index !== -1)
        {
            sound.destroy();

            this.sounds.splice(index, 1);

            return true;
        }

        return false;
    },


    /**
     * Removes all sounds from the manager, destroying the sounds.
     *
     * @method Phaser.Sound.BaseSoundManager#removeAll
     * @since 3.23.0
     */
    removeAll: function ()
    {
        this.sounds.forEach(function (sound)
        {
            sound.destroy();
        });

        this.sounds.length = 0;
    },

    /**
     * Removes all sounds from the sound manager that have an asset key matching the given value.
     * The removed sounds are destroyed before removal.
     *
     * @method Phaser.Sound.BaseSoundManager#removeByKey
     * @since 3.0.0
     *
     * @param {string} key - The key to match when removing sound objects.
     *
     * @return {number} The number of matching sound objects that were removed.
     */
    removeByKey: function (key)
    {
        var removed = 0;

        for (var i = this.sounds.length - 1; i >= 0; i--)
        {
            var sound = this.sounds[i];

            if (sound.key === key)
            {
                sound.destroy();

                this.sounds.splice(i, 1);

                removed++;
            }
        }

        return removed;
    },

    /**
     * Pauses all the sounds in the game.
     *
     * @method Phaser.Sound.BaseSoundManager#pauseAll
     * @fires Phaser.Sound.Events#PAUSE_ALL
     * @since 3.0.0
     */
    pauseAll: function ()
    {
        this.forEachActiveSound(function (sound)
        {
            sound.pause();
        });

        this.emit(Events.PAUSE_ALL, this);
    },

    /**
     * Resumes all the sounds in the game.
     *
     * @method Phaser.Sound.BaseSoundManager#resumeAll
     * @fires Phaser.Sound.Events#RESUME_ALL
     * @since 3.0.0
     */
    resumeAll: function ()
    {
        this.forEachActiveSound(function (sound)
        {
            sound.resume();
        });

        this.emit(Events.RESUME_ALL, this);
    },

    /**
     * Stops all the sounds in the game.
     *
     * @method Phaser.Sound.BaseSoundManager#stopAll
     * @fires Phaser.Sound.Events#STOP_ALL
     * @since 3.0.0
     */
    stopAll: function ()
    {
        this.forEachActiveSound(function (sound)
        {
            sound.stop();
        });

        this.emit(Events.STOP_ALL, this);
    },

    /**
     * Stops any sounds matching the given key.
     *
     * @method Phaser.Sound.BaseSoundManager#stopByKey
     * @since 3.23.0
     *
     * @param {string} key - Sound asset key.
     *
     * @return {number} - How many sounds were stopped.
     */
    stopByKey: function (key)
    {
        var stopped = 0;

        this.getAll(key).forEach(function (sound)
        {
            if (sound.stop()) { stopped++; }
        });

        return stopped;
    },

    /**
     * Method used internally for pausing sound manager if
     * Phaser.Sound.BaseSoundManager#pauseOnBlur is set to true.
     *
     * @method Phaser.Sound.BaseSoundManager#onBlur
     * @override
     * @protected
     * @since 3.0.0
     */
    onBlur: NOOP,

    /**
     * Method used internally for resuming sound manager if
     * Phaser.Sound.BaseSoundManager#pauseOnBlur is set to true.
     *
     * @method Phaser.Sound.BaseSoundManager#onFocus
     * @override
     * @protected
     * @since 3.0.0
     */
    onFocus: NOOP,

    /**
     * Internal handler for Phaser.Core.Events#BLUR.
     *
     * @method Phaser.Sound.BaseSoundManager#onGameBlur
     * @private
     * @since 3.23.0
     */
    onGameBlur: function ()
    {
        if (this.pauseOnBlur)
        {
            this.onBlur();
        }
    },

    /**
     * Internal handler for Phaser.Core.Events#FOCUS.
     *
     * @method Phaser.Sound.BaseSoundManager#onGameFocus
     * @private
     * @since 3.23.0
     */
    onGameFocus: function ()
    {
        if (this.pauseOnBlur)
        {
            this.onFocus();
        }
    },

    /**
     * Update method called on every game step.
     * Removes destroyed sounds and updates every active sound in the game.
     *
     * @method Phaser.Sound.BaseSoundManager#update
     * @protected
     * @fires Phaser.Sound.Events#UNLOCKED
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: function (time, delta)
    {
        var i;
        var sounds = this.sounds;

        for (i = sounds.length - 1; i >= 0; i--)
        {
            if (sounds[i].pendingRemove)
            {
                sounds.splice(i, 1);
            }
        }

        for (i = 0; i < sounds.length; i++)
        {
            sounds[i].update(time, delta);
        }
    },

    /**
     * Method used internally for iterating only over active sounds and skipping sounds that are marked for removal.
     *
     * @method Phaser.Sound.BaseSoundManager#forEachActiveSound
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Types.Sound.EachActiveSoundCallback} callback - Callback function. (manager: Phaser.Sound.BaseSoundManager, sound: Phaser.Sound.BaseSound, index: number, sounds: Phaser.Manager.BaseSound[]) => void
     * @param {*} [scope] - Callback context.
     */
    forEachActiveSound: function (callback, scope)
    {
        // eslint-disable-next-line consistent-this
        if (scope === undefined) { scope = this; }

        var sounds = this.sounds;

        for (var i = 0; i < sounds.length; i++)
        {
            var sound = sounds[i];

            if (sound && !sound.pendingRemove)
            {
                callback.call(scope, sound, i, sounds);
            }
        }
    },

    /**
     * Sets the global playback rate at which all the sounds will be played.
     *
     * For example, a value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
     * and 2.0 doubles the audios playback speed.
     *
     * @method Phaser.Sound.BaseSoundManager#setRate
     * @fires Phaser.Sound.Events#GLOBAL_RATE
     * @since 3.3.0
     *
     * @param {number} value - Global playback rate at which all the sounds will be played.
     *
     * @return {Phaser.Sound.BaseSoundManager} This Sound Manager.
     */
    setRate: function (value)
    {
        this.rate = value;

        return this;
    },

    /**
     * Global playback rate at which all the sounds will be played.
     * Value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
     * and 2.0 doubles the audio's playback speed.
     *
     * @name Phaser.Sound.BaseSoundManager#rate
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    rate: {

        get: function ()
        {
            return this._rate;
        },

        set: function (value)
        {
            this._rate = value;

            this.forEachActiveSound(function (sound)
            {
                sound.calculateRate();
            });

            this.emit(Events.GLOBAL_RATE, this, value);
        }

    },

    /**
     * Sets the global detuning of all sounds in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
     * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @method Phaser.Sound.BaseSoundManager#setDetune
     * @fires Phaser.Sound.Events#GLOBAL_DETUNE
     * @since 3.3.0
     *
     * @param {number} value - The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @return {Phaser.Sound.BaseSoundManager} This Sound Manager.
     */
    setDetune: function (value)
    {
        this.detune = value;

        return this;
    },

    /**
     * Global detuning of all sounds in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
     * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
     *
     * @name Phaser.Sound.BaseSoundManager#detune
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    detune: {

        get: function ()
        {
            return this._detune;
        },

        set: function (value)
        {
            this._detune = value;

            this.forEachActiveSound(function (sound)
            {
                sound.calculateRate();
            });

            this.emit(Events.GLOBAL_DETUNE, this, value);
        }

    },

    /**
     * Destroys all the sounds in the game and all associated events.
     *
     * @method Phaser.Sound.BaseSoundManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        var events = this.game.events;

        events.off(GameEvents.BLUR, this.onGameBlur, this);
        events.off(GameEvents.FOCUS, this.onGameFocus, this);
        events.off(GameEvents.PRE_STEP, this.update, this);
        events.off(GameEvents.BOOT, this.unlock, this);

        this.removeAllListeners();

        this.removeAll();

        this.sounds.length = 0;
        this.sounds = null;

        this.game = null;
    }

});

module.exports = BaseSoundManager;
