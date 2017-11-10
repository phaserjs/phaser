var Class = require('../utils/Class');
var BaseSoundManager = require('./BaseSoundManager');

//  Phaser.Loader.WebAudioSoundManager

var WebAudioSoundManager = new Class({

    Extends: BaseSoundManager,

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
