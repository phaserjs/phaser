var Class = require('../utils/Class');
var WebAudioSoundManager = require('./WebAudioSoundManager');

//  Phaser.Loader.BaseSoundManager

var BaseSoundManager = new Class({

    // TODO define sound manager interface

});

BaseSoundManager.create = function (game)
{
    if ((game.config.audio && game.config.audio.noAudio)
        || (!game.device.Audio.webAudio && !game.device.Audio.audioData))
    {
        return new BaseSoundManager(game);
    }

    if(game.device.Audio.webAudio
        && !(game.config.audio && game.config.audio.disableWebAudio))
    {
        return new WebAudioSoundManager(game);
    }

    // TODO return HTML5 Audio sound manager
    return new BaseSoundManager(game);
};

module.exports = BaseSoundManager;
