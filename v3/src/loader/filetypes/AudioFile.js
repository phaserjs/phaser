var Class = require('../../utils/Class');
var File = require('../File');
var GetFastValue = require('../../utils/object/GetFastValue');
var CONST = require('../../const');

//  Phaser.Loader.FileTypes.AudioFile

var AudioFile = new Class({

    Extends: File,

    initialize:

    function AudioFile (key, url, path, xhrSettings, soundManager)
    {

        this.sound = soundManager;

        var fileConfig = {
            type: 'audio',
            extension: GetFastValue(url, 'type', ''),
            responseType: 'arraybuffer',
            key: key,
            url: GetFastValue(url, 'uri', url),
            path: path,
            xhrSettings: xhrSettings
        };

        File.call(this, fileConfig);
    },

    onProcess: function (callback)
    {
        this.state = CONST.FILE_PROCESSING;

        // TODO handle decoding
        this.data = this.xhrLoader.response;

        this.onComplete();

        callback(this);
    }

});

AudioFile.create = function (loader, key, urls, config, xhrSettings)
{
    var game = loader.scene.game;
    var audioConfig = game.config.audio;
    var deviceAudio = game.device.Audio;

    if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        // TODO log not loading audio because sounds are disabled
        return;
    }

    var url = AudioFile.findAudioURL(urls);

    if (!url)
    {
        // TODO log no supported types
        return;
    }

    if(deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
    {
        loader.addFile(new AudioFile(key, url, loader.path, xhrSettings, game.sound));
        return;
    }

    // TODO handle loading audio tags
    loader.addFile(null);

};

// this.load.audio('sound', 'assets/audio/booom.ogg', config, xhrSettings);
//
// this.load.audio('sound',
//     [
//         'assets/audio/booom.ogg',
//         'assets/audio/booom.m4a',
//         'assets/audio/booom.mp3'
//     ],
//     config, xhrSettings);
//
// this.load.audio('sound',
//     {
//         uri: 'assets/audio/boooooom',
//         type: 'ogg'
//     },
//     config, xhrSettings);
//
// this.load.audio('sound',
//     [
//         {
//             uri: 'assets/audio/booooooo',
//             type: 'ogg'
//         },
//         {
//             uri: 'assets/audio/boooooom',
//             type: 'mp3'
//         }
//     ],
//     config, xhrSettings);
//
// this.load.audio('sound',
//     [
//         {
//             uri: 'assets/audio/booooooo',
//             type: 'ogg'
//         },
//         'assets/audio/booom.m4a',
//         {
//             uri: 'assets/audio/boooooom',
//             type: 'mp3'
//         }
//     ],
//     config, xhrSettings);
AudioFile.findAudioURL = function (urls)
{
    if (urls.constructor !== Array)
    {
        urls = [ urls ];
    }

    for (var i = 0; i < urls.length; i++)
    {
        var url = GetFastValue(urls[i], 'uri', urls[i]);

        if (url.indexOf('blob:') === 0 || url.indexOf('data:') === 0)
        {
            return url;
        }

        var type = url.match(/\.([a-zA-Z0-9]+)($|\?)/);
        type = GetFastValue(urls[i], 'type', type ? type[1] : '').toLowerCase();

        if (Audio[type])
        {
            return {
                uri: url,
                type: type
            };
        }
    }

    return null;
};

module.exports = AudioFile;
