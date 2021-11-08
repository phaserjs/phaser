/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseSoundManager = require('../BaseSoundManager');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var NoAudioSound = require('./NoAudioSound');
var NOOP = require('../../utils/NOOP');

/**
 * @classdesc
 * No-audio implementation of the Sound Manager. It is used if audio has been
 * disabled in the game config or the device doesn't support any audio.
 *
 * It represents a graceful degradation of Sound Manager logic that provides
 * minimal functionality and prevents Phaser projects that use audio from
 * breaking on devices that don't support any audio playback technologies.
 *
 * @class NoAudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberof Phaser.Sound
 * @constructor
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

        /**
         * Local reference to game.
         *
         * @name Phaser.Sound.NoAudioSoundManager#game
         * @type {Phaser.Game}
         * @readonly
         * @since 3.0.0
         */
        this.game = game;

        /**
         * An array containing all added sounds.
         *
         * Always empty for NoAudioSoundManager.
         *
         * @name Phaser.Sound.NoAudioSoundManager#sounds
         * @type {Phaser.Sound.BaseSound[]}
         * @default []
         * @private
         * @since 3.0.0
         */
        this.sounds = [];

        /**
         * Global mute setting.
         *
         * @name Phaser.Sound.NoAudioSoundManager#mute
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.mute = false;

        /**
         * Global volume setting.
         *
         * @name Phaser.Sound.NoAudioSoundManager#volume
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.volume = 1;

        /**
         * Property that actually holds the value of global playback rate.
         *
         * @name Phaser.Sound.NoAudioSoundManager#rate
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.rate = 1;

        /**
         * Property that actually holds the value of global detune.
         *
         * @name Phaser.Sound.NoAudioSoundManager#detune
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.detune = 0;

        /**
         * Flag indicating if sounds should be paused when game looses focus,
         * for instance when user switches to another tab/program/app.
         *
         * @name Phaser.Sound.NoAudioSoundManager#pauseOnBlur
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.pauseOnBlur = true;

        /**
         * Mobile devices require sounds to be triggered from an explicit user action,
         * such as a tap, before any sound can be loaded/played on a web page.
         * Set to true if the audio system is currently locked awaiting user interaction.
         *
         * @name Phaser.Sound.NoAudioSoundManager#locked
         * @type {boolean}
         * @readonly
         * @since 3.0.0
         */
        this.locked = false;
    },

    /**
     * Adds a new sound into this sound manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#add
     * @override
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {Phaser.Sound.NoAudioSound} The new sound instance.
     */
    add: function (key, config)
    {
        var sound = new NoAudioSound(this, key, config);

        this.sounds.push(sound);

        return sound;
    },

    /**
     * Adds a new audio sprite sound into the sound manager.
     * Audio Sprites are a combination of audio files and a JSON configuration.
     * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
     *
     * @method Phaser.Sound.NoAudioSoundManager#addAudioSprite
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {Phaser.Sound.NoAudioSound} The new audio sprite sound instance.
     */
    addAudioSprite: function (key, config)
    {
        var sound = this.add(key, config);

        sound.spritemap = {};

        return sound;
    },

    /**
     * Adds a new sound to the sound manager and plays it.
     *
     * The sound will be automatically removed (destroyed) once playback ends.
     * This lets you play a new sound on the fly without the need to keep a reference to it.
     *
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#play
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {(Phaser.Types.Sound.SoundConfig|Phaser.Types.Sound.SoundMarker)} [extra] - An optional additional object containing settings to be applied to the sound. It could be either config or marker object.
     *
     * @return {boolean} Always returns false.
     */
    // eslint-disable-next-line no-unused-vars
    play: function (key, extra)
    {
        return false;
    },

    /**
     * Adds a new audio sprite sound to the sound manager and plays it.
     *
     * The sprite will be automatically removed (destroyed) once playback ends.
     *
     * This lets you play a new sound on the fly without the need to keep a reference to it.
     *
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#playAudioSprite
     * @since 3.0.0
     *
     * @param {string} key - Asset key for the sound.
     * @param {string} spriteName - The name of the sound sprite to play.
     * @param {Phaser.Types.Sound.SoundConfig} [config] - An optional config object containing default sound settings.
     *
     * @return {boolean} Always returns false.
     */
    // eslint-disable-next-line no-unused-vars
    playAudioSprite: function (key, spriteName, config)
    {
        return false;
    },

    /**
     * Removes a sound from the sound manager.
     *
     * The removed sound is destroyed before removal.
     *
     * @method Phaser.Sound.NoAudioSoundManager#remove
     * @since 3.0.0
     *
     * @param {Phaser.Sound.NoAudioSound} sound - The sound object to remove.
     *
     * @return {boolean} True if the sound was removed successfully, otherwise false.
     */
    remove: function (sound)
    {
        return BaseSoundManager.prototype.remove.call(this, sound);
    },

    /**
     * Removes all sounds from the sound manager that have an asset key matching the given value.
     *
     * The removed sounds are destroyed before removal.
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

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#pauseAll
     * @since 3.0.0
     */
    pauseAll: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#resumeAll
     * @since 3.0.0
     */
    resumeAll: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#stopAll
     * @since 3.0.0
     */
    stopAll: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#update
     * @since 3.0.0
     */
    update: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setRate
     * @since 3.0.0
     */
    setRate: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setDetune
     * @since 3.0.0
     */
    setDetune: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setMute
     * @since 3.0.0
     */
    setMute: NOOP,

    /**
     * This method does nothing in the No Audio Sound Manager.
     *
     * @method Phaser.Sound.NoAudioSoundManager#setVolume
     * @since 3.0.0
     */
    setVolume: NOOP,

    /**
     * Method used internally for iterating only over active sounds and skipping sounds that are marked for removal.
     *
     * @method Phaser.Sound.NoAudioSoundManager#forEachActiveSound
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Types.Sound.EachActiveSoundCallback} callback - Callback function. (manager: Phaser.Sound.BaseSoundManager, sound: Phaser.Sound.BaseSound, index: number, sounds: Phaser.Manager.BaseSound[]) => void
     * @param {*} [scope] - Callback context.
     */
    forEachActiveSound: function (callbackfn, scope)
    {
        BaseSoundManager.prototype.forEachActiveSound.call(this, callbackfn, scope);
    },

    /**
     * Destroys all the sounds in the game and all associated events.
     *
     * @method Phaser.Sound.NoAudioSoundManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        BaseSoundManager.prototype.destroy.call(this);
    }

});

module.exports = NoAudioSoundManager;
