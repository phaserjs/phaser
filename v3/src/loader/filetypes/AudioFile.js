var Class = require('../../utils/Class');
var File = require('../File');
var Audio = require('../../device/Audio');
var GetFastValue = require('../../utils/object/GetFastValue');

//  Phaser.Loader.FileTypes.AudioFile

var AudioFile = new Class({

    Extends: File

});

AudioFile.create = function (loader, key, urls, config, xhrSettings) {

    var url = AudioFile.findAudioURL(urls);

    if (!url)
    {
        // TODO log no supported types
        return;
    }

    if (Audio.webAudio)
    {

    }
    else if (Audio.audioData)
    {

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
        urls = [urls];
    }

    for (var i = 0; i < urls.length; i++)
    {
        var url = GetFastValue(urls[i], 'uri', urls[i]);

        if (url.indexOf('blob:') === 0 || url.indexOf('data:') === 0)
        {
            return url;
        }

        var audioType = url.match(/\.([^\.?]+)($|\?)/);

        audioType = GetFastValue(urls[i], 'type', audioType ? audioType[1] : '').toLowerCase();

        if (Audio[audioType])
        {
            return url;
        }
    }

    return null;
};

module.exports = AudioFile;
