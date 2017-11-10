var BaseSoundManager = require('./BaseSoundManager');
var WebAudioSoundManager = require('./WebAudioSoundManager');

var SoundManagerCreator = {

    create: function (game)
    {
        var audioConfig = game.config.audio;
        var deviceAudio = game.device.Audio;

        if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
        {
            // TODO add no audio implementation of BaseSoundManager
            return new BaseSoundManager(game);
        }

        if(deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
        {
            return new WebAudioSoundManager(game);
        }

        // TODO return HTML5 Audio sound manager
        return new BaseSoundManager(game);
    }

};

module.exports = SoundManagerCreator;
