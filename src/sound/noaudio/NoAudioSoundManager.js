/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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

        this.game = game;
        this.sounds = [];
        this.mute = false;
        this.volume = 1;
        this.rate = 1;
        this.detune = 0;
        this.pauseOnBlur = true;
        this.locked = false;
    },

    add: function (key, config)
    {
        var sound = new NoAudioSound(this, key, config);

        this.sounds.push(sound);

        return sound;
    },

    addAudioSprite: function (key, config)
    {
        var sound = this.add(key, config);

        sound.spritemap = {};

        return sound;
    },

    // eslint-disable-next-line no-unused-vars
    play: function (key, extra)
    {
        return false;
    },

    // eslint-disable-next-line no-unused-vars
    playAudioSprite: function (key, spriteName, config)
    {
        return false;
    },

    remove: function (sound)
    {
        return BaseSoundManager.prototype.remove.call(this, sound);
    },

    removeByKey: function (key)
    {
        return BaseSoundManager.prototype.removeByKey.call(this, key);
    },

    pauseAll: NOOP,
    resumeAll: NOOP,
    stopAll: NOOP,
    update: NOOP,
    setRate: NOOP,
    setDetune: NOOP,
    setMute: NOOP,
    setVolume: NOOP,

    forEachActiveSound: function (callbackfn, scope)
    {
        BaseSoundManager.prototype.forEachActiveSound.call(this, callbackfn, scope);
    },

    destroy: function ()
    {
        BaseSoundManager.prototype.destroy.call(this);
    }

});

module.exports = NoAudioSoundManager;
