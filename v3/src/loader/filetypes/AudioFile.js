var Class = require('../../utils/Class');
var File = require('../File');
var Audio = require('../../device/Audio');
var GetFastValue = require('../../utils/object/GetFastValue');

//  Phaser.Loader.FileTypes.AudioFile

var AudioFile = new Class({

    Extends: File,

    initialize:

    function AudioFile (key, url, path, xhrSettings)
    {
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
    }

});

AudioFile.create = function (loader, key, urls, config, xhrSettings)
{
    // TODO handle when sounds are disabled in game config

    var url = AudioFile.findAudioURL(urls);

    if (!url)
    {
        // TODO log no supported types
        return;
    }

    if (Audio.webAudio)
    {
        loader.addFile(new AudioFile(key, url, loader.path, xhrSettings));
    }
    else if (Audio.audioData)
    {
        // TODO handle loading audio tags
    }
    else
    {
        // TODO bail if sounds are disabled and print message
        return;
    }
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
