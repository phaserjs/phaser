/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BaseSound = require('../BaseSound');
var Class = require('../../utils/Class');
var EventEmitter = require('eventemitter3');
var Extend = require('../../utils/object/Extend');

/**
 * @classdesc
 * No audio implementation of the sound. It is used if audio has been
 * disabled in the game config or the device doesn't support any audio.
 *
 * It represents a graceful degradation of sound logic that provides
 * minimal functionality and prevents Phaser projects that use audio from
 * breaking on devices that don't support any audio playback technologies.
 *
 * @class NoAudioSound
 * @extends Phaser.Sound.BaseSound
 * @memberof Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Sound.NoAudioSoundManager} manager - Reference to the current sound manager instance.
 * @param {string} key - Asset key for the sound.
 * @param {Phaser.Types.Sound.SoundConfig} [config={}] - An optional config object containing default sound settings.
 */
var NoAudioSound = new Class({

    Extends: EventEmitter,

    initialize:

    function NoAudioSound (manager, key, config)
    {
        if (config === void 0) { config = {}; }

        EventEmitter.call(this);

        this.manager = manager;
        this.key = key;
        this.isPlaying = false;
        this.isPaused = false;
        this.totalRate = 1;
        this.duration = 0;
        this.totalDuration = 0;

        this.config = Extend({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }, config);

        this.currentConfig = this.config;
        this.mute = false;
        this.volume = 1;
        this.rate = 1;
        this.detune = 0;
        this.seek = 0;
        this.loop = false;
        this.markers = {};
        this.currentMarker = null;
        this.pendingRemove = false;
    },

    // eslint-disable-next-line no-unused-vars
    addMarker: function (marker)
    {
        return false;
    },

    // eslint-disable-next-line no-unused-vars
    updateMarker: function (marker)
    {
        return false;
    },

    // eslint-disable-next-line no-unused-vars
    removeMarker: function (markerName)
    {
        return null;
    },

    // eslint-disable-next-line no-unused-vars
    play: function (markerName, config)
    {
        return false;
    },

    pause: function ()
    {
        return false;
    },

    resume: function ()
    {
        return false;
    },

    stop: function ()
    {
        return false;
    },

    destroy: function ()
    {
        this.manager.remove(this);

        BaseSound.prototype.destroy.call(this);
    }
});

module.exports = NoAudioSound;
