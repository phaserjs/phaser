var Class = require('../utils/Class');
var SoundManager = require('./SoundManager');

var WebAudioSoundManager = new Class({

    Extends: SoundManager,

    initialize:

    function WebAudioSoundManager (game)
    {
        /**
         * @property {Phaser.Game} game - Local reference to game.
         */
        this.game = game;

        /**
         * @property {AudioContext} context - The AudioContext being used for playback.
         * @default
         */
        this.context = this.createAudioContext();
    },

    createAudioContext: function ()
    {
        if (this.game.config.audio.context)
        {
            return this.game.config.audio.context;
        }

        return new (window['AudioContext'] || window['webkitAudioContext'])();
    }

});

module.exports = WebAudioSoundManager;
