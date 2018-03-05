/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BaseSoundManager = require('../BaseSoundManager');
var Class = require('../../utils/Class');
var HTML5AudioSound = require('./HTML5AudioSound');

/**
 * HTML5 Audio implementation of the sound manager.
 *
 * @class HTML5AudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberOf Phaser.Sound
 * @constructor
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
var HTML5AudioSoundManager = new Class({

    Extends: BaseSoundManager,

    initialize:

    function HTML5AudioSoundManager (game)
    {
        /**
         * Flag indicating whether if there are no idle instances of HTML5 Audio tag,
         * for any particular sound, if one of the used tags should be hijacked and used
         * for succeeding playback or if succeeding Phaser.Sound.HTML5AudioSound#play
         * call should be ignored.
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#override
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.override = true;

        /**
         * Value representing time difference, in seconds, between calling
         * play method on an audio tag and when it actually starts playing.
         * It is used to achieve more accurate delayed sound playback.
         *
         * You might need to tweak this value to get the desired results
         * since audio play delay varies depending on the browser/platform.
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#audioPlayDelay
         * @type {number}
         * @default 0.1
         * @since 3.0.0
         */
        this.audioPlayDelay = 0.1;

        /**
         * A value by which we should offset the loop end marker of the
         * looping sound to compensate for lag, caused by changing audio
         * tag playback position, in order to achieve gapless looping.
         *
         * You might need to tweak this value to get the desired results
         * since loop lag varies depending on the browser/platform.
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#loopEndOffset
         * @type {number}
         * @default 0.05
         * @since 3.0.0
         */
        this.loopEndOffset = 0.05;

        /**
         * An array for keeping track of all the sounds
         * that were paused when game lost focus.
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#onBlurPausedSounds
         * @type {Phaser.Sound.HTML5AudioSound[]}
         * @private
         * @default []
         * @since 3.0.0
         */
        this.onBlurPausedSounds = [];

        this.locked = 'ontouchstart' in window;

        /**
         * A queue of all actions performed on sound objects while audio was locked.
         * Once the audio gets unlocked, after an explicit user interaction,
         * all actions will be performed in chronological order.
         * Array of object types: { sound: Phaser.Sound.HTML5AudioSound, name: string, value?: * }
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#lockedActionsQueue
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this.lockedActionsQueue = this.locked ? [] : null;

        /**
         * Property that actually holds the value of global mute
         * for HTML5 Audio sound manager implementation.
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#_mute
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._mute = false;

        /**
         * Property that actually holds the value of global volume
         * for HTML5 Audio sound manager implementation.
         *
         * @name Phaser.Sound.HTML5AudioSoundManager#_volume
         * @type {boolean}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._volume = 1;

        BaseSoundManager.call(this, game);
    },

    /**
     * Adds a new sound into the sound manager.
     *
     * @method Phaser.Sound.HTML5AudioSoundManager#add
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {Phaser.Sound.HTML5AudioSound} The new sound instance.
     */
    add: function (key, config)
    {
        var sound = new HTML5AudioSound(this, key, config);

        this.sounds.push(sound);

        return sound;
    },

    /**
     * Unlocks HTML5 Audio loading and playback on mobile
     * devices on the initial explicit user interaction.
     *
     * @method Phaser.Sound.HTML5AudioSoundManager#unlock
     * @private
     * @since 3.0.0
     */
    unlock: function ()
    {
        var _this = this;

        var moved = false;

        var detectMove = function ()
        {
            moved = true;
        };

        var unlock = function ()
        {
            if (!_this.game.cache.audio.entries.size)
            {
                return;
            }

            if (moved)
            {
                moved = false;
                return;
            }

            document.body.removeEventListener('touchmove', detectMove);
            document.body.removeEventListener('touchend', unlock);

            var allTags = [];

            _this.game.cache.audio.entries.each(function (key, tags)
            {
                for (var i = 0; i < tags.length; i++)
                {
                    allTags.push(tags[i]);
                }
                return true;
            });

            var lastTag = allTags[allTags.length - 1];

            lastTag.oncanplaythrough = function ()
            {
                lastTag.oncanplaythrough = null;
                _this.unlocked = true;
            };

            allTags.forEach(function (tag)
            {
                tag.load();
            });
        };

        this.once('unlocked', function ()
        {
            this.forEachActiveSound(function (sound)
            {
                sound.duration = sound.tags[0].duration;
                sound.totalDuration = sound.tags[0].duration;
            });

            this.lockedActionsQueue.forEach(function (lockedAction)
            {
                if (lockedAction.sound[lockedAction.prop].apply)
                {
                    lockedAction.sound[lockedAction.prop].apply(lockedAction.sound, lockedAction.value || []);
                }
                else
                {
                    lockedAction.sound[lockedAction.prop] = lockedAction.value;
                }
            });

            this.lockedActionsQueue.length = 0;
            this.lockedActionsQueue = null;
        }, this);

        document.body.addEventListener('touchmove', detectMove, false);
        document.body.addEventListener('touchend', unlock, false);
    },

    /**
     * Method used internally for pausing sound manager if
     * Phaser.Sound.HTML5AudioSoundManager#pauseOnBlur is set to true.
     *
     * @method Phaser.Sound.HTML5AudioSoundManager#onBlur
     * @protected
     * @since 3.0.0
     */
    onBlur: function ()
    {
        this.forEachActiveSound(function (sound)
        {
            if (sound.isPlaying)
            {
                this.onBlurPausedSounds.push(sound);
                sound.onBlur();
            }
        });
    },

    /**
     * Method used internally for resuming sound manager if
     * Phaser.Sound.HTML5AudioSoundManager#pauseOnBlur is set to true.
     *
     * @method Phaser.Sound.HTML5AudioSoundManager#onFocus
     * @protected
     * @since 3.0.0
     */
    onFocus: function ()
    {
        this.onBlurPausedSounds.forEach(function (sound)
        {
            sound.onFocus();
        });

        this.onBlurPausedSounds.length = 0;
    },

    /**
     * Calls Phaser.Sound.BaseSoundManager#destroy method
     * and cleans up all HTML5 Audio related stuff.
     *
     * @method Phaser.Sound.HTML5AudioSoundManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        BaseSoundManager.prototype.destroy.call(this);

        this.onBlurPausedSounds.length = 0;
        this.onBlurPausedSounds = null;
    },

    /**
     * Method used internally by Phaser.Sound.HTML5AudioSound class methods and property setters
     * to check if sound manager is locked and then either perform action immediately or queue it
     * to be performed once the sound manager gets unlocked.
     *
     * @method Phaser.Sound.HTML5AudioSoundManager#isLocked
     * @protected
     * @since 3.0.0
     *
     * @param {Phaser.Sound.HTML5AudioSound} sound - Sound object on which to perform queued action.
     * @param {string} prop - Name of the method to be called or property to be assigned a value to.
     * @param {*} [value] - An optional parameter that either holds an array of arguments to be passed to the method call or value to be set to the property.
     *
     * @return {boolean} Whether the sound manager is locked.
     */
    isLocked: function (sound, prop, value)
    {
        if (this.locked)
        {
            this.lockedActionsQueue.push({
                sound: sound,
                prop: prop,
                value: value
            });

            return true;
        }

        return false;
    },

    /**
     * @event Phaser.Sound.HTML5AudioSoundManager#MuteEvent
     * @param {Phaser.Sound.HTML5AudioSoundManager} soundManager - Reference to the sound manager that emitted event.
     * @param {boolean} value - An updated value of Phaser.Sound.HTML5AudioSoundManager#mute property.
     */

    /**
     * @name Phaser.Sound.HTML5AudioSoundManager#mute
     * @type {boolean}
     * @fires Phaser.Sound.HTML5AudioSoundManager#MuteEvent
     * @since 3.0.0
     */
    mute: {

        get: function ()
        {
            return this._mute;
        },

        set: function (value)
        {
            this._mute = value;

            this.forEachActiveSound(function (sound)
            {
                sound.setMute();
            });

            this.emit('mute', this, value);
        }

    },

    /**
     * @event Phaser.Sound.HTML5AudioSoundManager#VolumeEvent
     * @param {Phaser.Sound.HTML5AudioSoundManager} soundManager - Reference to the sound manager that emitted event.
     * @param {number} value - An updated value of Phaser.Sound.HTML5AudioSoundManager#volume property.
     */

    /**
     * @name Phaser.Sound.HTML5AudioSoundManager#volume
     * @type {number}
     * @fires Phaser.Sound.HTML5AudioSoundManager#VolumeEvent
     * @since 3.0.0
     */
    volume: {

        get: function ()
        {
            return this._volume;
        },

        set: function (value)
        {
            this._volume = value;

            this.forEachActiveSound(function (sound)
            {
                sound.setVolume();
            });

            this.emit('volume', this, value);
        }

    }

});

module.exports = HTML5AudioSoundManager;
