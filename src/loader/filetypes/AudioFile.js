var Class = require('../../utils/Class');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var CONST = require('../../const');
var HTML5AudioFile = require('./HTML5AudioFile');

//  Phaser.Loader.FileTypes.AudioFile

var AudioFile = new Class({

    Extends: File,

    initialize:

    function AudioFile (key, url, path, xhrSettings, audioContext)
    {
        this.context = audioContext;

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

        var _this = this;

        // interesting read https://github.com/WebAudio/web-audio-api/issues/1305
        this.context.decodeAudioData(this.xhrLoader.response,
            function (audioBuffer)
            {
                _this.data = audioBuffer;

                _this.onComplete();

                callback(_this);
            },
            function (e)
            {
                console.error('Error with decoding audio data for \'' + this.key + '\':', e.message);

                _this.state = CONST.FILE_ERRORED;

                callback(_this);
            }
        );
    }

});

AudioFile.create = function (loader, key, urls, config, xhrSettings)
{
    var game = loader.systems.game;
    var audioConfig = game.config.audio;
    var deviceAudio = game.device.Audio;

    if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        console.info('Skipping loading audio \'' + key + '\' since sounds are disabled.');
        return null;
    }

    var url = AudioFile.findAudioURL(game, urls);

    if (!url)
    {
        console.warn('No supported url provided for audio \'' + key + '\'!');
        return null;
    }

    if (deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
    {
        return new AudioFile(key, url, this.path, xhrSettings, game.sound.context);
    }
    else
    {
        return new HTML5AudioFile(key, url, this.path, config);
    }
};

//  When registering a factory function 'this' refers to the Loader context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory

FileTypesManager.register('audio', function (key, urls, config, xhrSettings)
{
    var audioFile = AudioFile.create(this, key, urls, config, xhrSettings);

    if (audioFile)
    {
        this.addFile(audioFile);
    }

    return this;
});

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

AudioFile.findAudioURL = function (game, urls)
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

        if (game.device.Audio[type])
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
