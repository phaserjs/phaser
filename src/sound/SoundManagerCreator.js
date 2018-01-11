var BaseSoundManager = require('./BaseSoundManager');
var WebAudioSoundManager = require('./webaudio/WebAudioSoundManager');
var HTML5AudioSoundManager = require('./html5/HTML5AudioSoundManager');

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

        return new HTML5AudioSoundManager(game);
    }

};

module.exports = SoundManagerCreator;
