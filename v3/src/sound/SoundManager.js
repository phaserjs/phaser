var Class = require('../utils/Class');

//  Phaser.Loader.SoundManager

var SoundManager = new Class({

    initialize:

    function SoundManager (game)
    {

    }

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
        // TODO create Web Audio sound manager
        return new SoundManager(game);
    }

    // TODO return HTML5 Audio sound manager
    return new SoundManager(game);
};

module.exports = SoundManager;
