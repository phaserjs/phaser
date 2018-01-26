var WebAudioSoundManager = require('./webaudio/WebAudioSoundManager');
var HTML5AudioSoundManager = require('./html5/HTML5AudioSoundManager');
var NoAudioSoundManager = require('./noaudio/NoAudioSoundManager');

var SoundManagerCreator = {

    create: function (game)
    {
        var audioConfig = game.config.audio;
        var deviceAudio = game.device.audio;

        if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
        {
            return new NoAudioSoundManager(game);
        }

        if(deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
        {
            return new WebAudioSoundManager(game);
        }

        return new HTML5AudioSoundManager(game);
    }

};

module.exports = SoundManagerCreator;
