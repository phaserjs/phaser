var Class = require('../utils/Class');
var WebAudioSoundManager = require('./WebAudioSoundManager');

//  Phaser.Loader.SoundManager

var SoundManager = new Class({

    // TODO define sound manager interface

});

SoundManager.create = function (game)
{
    if ((game.config.audio && game.config.audio.noAudio)
        || (!game.device.Audio.webAudio && !game.device.Audio.audioData))
    {
        return new SoundManager(game);
    }

    if(game.device.Audio.webAudio
        && !(game.config.audio && game.config.audio.disableWebAudio))
    {
        return new WebAudioSoundManager(game);
    }

    // TODO return HTML5 Audio sound manager
    return new SoundManager(game);
};

module.exports = SoundManager;
