var Class = require('../utils/Class');
var BaseSoundManager = require('./BaseSoundManager');

//  Phaser.Loader.WebAudioSoundManager

var WebAudioSoundManager = new Class({

    Extends: BaseSoundManager,

    initialize:

    function WebAudioSoundManager (game)
    {
        BaseSoundManager.call(this, game);

        /**
         * @property {AudioContext} context - The AudioContext being used for playback.
         * @default
         */
        this.context = this.createAudioContext();
    },

    createAudioContext: function ()
    {
        var audioConfig = this.game.config.audio;

        if (audioConfig && audioConfig.context)
        {
            return audioConfig.context;
        }

        return new (window['AudioContext'] || window['webkitAudioContext'])();
    }

});

module.exports = WebAudioSoundManager;
