/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BaseSoundManager = require('../BaseSoundManager');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var NoAudioSound = require('./NoAudioSound');
var NOOP = require('../../utils/NOOP');

/**
 * @classdesc
 * No audio implementation of the sound manager. It is used if audio has been
 * disabled in the game config or the device doesn't support any audio.
 *
 * It represents a graceful degradation of sound manager logic that provides
 * minimal functionality and prevents Phaser projects that use audio from
 * breaking on devices that don't support any audio playback technologies.
 *
 * @class NoAudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberOf Phaser.Sound
 * @constructor
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
var NoAudioSoundManager = new Class({

    Extends: EventEmitter,

    initialize:

    function NoAudioSoundManager (game)
    {
        EventEmitter.call(this);
        this.game = game;
        this.sounds = [];

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSoundManager#mute
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.mute = false;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSoundManager#volume
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.volume = 1;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSoundManager#rate
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.rate = 1;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSoundManager#detune
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.detune = 0;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSoundManager#pauseOnBlur
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.pauseOnBlur = true;

        /**
         * [description]
         *
         * @name Phaser.Sound.NoAudioSoundManager#locked
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.locked = false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#add
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {ISoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {ISound} The new sound instance.
     */
    add: function (key, config)
    {
        var sound = new NoAudioSound(this, key, config);

        this.sounds.push(sound);

        return sound;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#addAudioSprite
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {ISoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {IAudioSpriteSound} The new audio sprite sound instance.
     */
    addAudioSprite: function (key, config)
    {
        var sound = this.add(key, config);
        sound.spritemap = {};
        return sound;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#play
     * @since 3.0.0
     *
     * @return {boolean} No Audio methods always return `false`.
     */
    play: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#playAudioSprite
     * @since 3.0.0
     *
     * @return {boolean} No Audio methods always return `false`.
     */
    playAudioSprite: function ()
    {
        return false;
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#remove
     * @since 3.0.0
     *
     * @param {ISound} sound - The sound object to remove.
     *
     * @return {boolean} True if the sound was removed successfully, otherwise false.
     */
    remove: function (sound)
    {
        return BaseSoundManager.prototype.remove.call(this, sound);
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#removeByKey
     * @since 3.0.0
     *
     * @param {string} key - The key to match when removing sound objects.
     *
     * @return {number} The number of matching sound objects that were removed.
     */
    removeByKey: function (key)
    {
        return BaseSoundManager.prototype.removeByKey.call(this, key);
    },

    pauseAll: NOOP,

    resumeAll: NOOP,

    stopAll: NOOP,

    update: NOOP,

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        BaseSoundManager.prototype.destroy.call(this);
    },

    /**
     * [description]
     *
     * @method Phaser.Sound.NoAudioSoundManager#forEachActiveSound
     * @since 3.0.0
     *
     * @param {function} callbackfn - Callback function. (sound: ISound, index: number, array: ISound[]) => void
     * @param [scope] - Callback context.
     */
    forEachActiveSound: function (callbackfn, scope)
    {
        BaseSoundManager.prototype.forEachActiveSound.call(this, callbackfn, scope);
    }

});

module.exports = NoAudioSoundManager;
