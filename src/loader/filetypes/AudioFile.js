/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var HTML5AudioFile = require('./HTML5AudioFile');

/**
 * @classdesc
 * [description]
 *
 * @class AudioFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {string} url - [description]
 * @param {string} path - [description]
 * @param {XHRSettingsObject} xhrSettings - [description]
 * @param {AudioContext} audioContext - [description]
 */
var AudioFile = new Class({

    Extends: File,

    initialize:

    function AudioFile (key, url, path, xhrSettings, audioContext)
    {
        /**
         * [description]
         *
         * @property {AudioContext} context
         * @since 3.0.0
         */
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

    /**
     * [description]
     *
     * @method Phaser.Loader.FileTypes.AudioFile#onProcess
     * @since 3.0.0
     *
     * @param {FileProcessCallback} callback - [description]
     */
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
                // eslint-disable-next-line no-console
                console.error('Error with decoding audio data for \'' + this.key + '\':', e.message);

                _this.state = CONST.FILE_ERRORED;

                callback(_this);
            }
        );

        this.context = null;
    }

});

AudioFile.create = function (loader, key, urls, config, xhrSettings)
{
    var game = loader.systems.game;
    var audioConfig = game.config.audio;
    var deviceAudio = game.device.audio;

    if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        // console.info('Skipping loading audio \'' + key + '\' since sounds are disabled.');
        return null;
    }

    var url = AudioFile.findAudioURL(game, urls);

    if (!url)
    {
        // console.warn('No supported url provided for audio \'' + key + '\'!');
        return null;
    }

    if (deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
    {
        return new AudioFile(key, url, loader.path, xhrSettings, game.sound.context);
    }
    else
    {
        return new HTML5AudioFile(key, url, loader.path, config, game.sound.locked);
    }
};

/**
 * Adds an Audio file to the current load queue.
 *
 * Note: This method will only be available if the Audio File type has been built into Phaser.
 *
 * The file is **not** loaded immediately after calling this method.
 * Instead, the file is added to a queue within the Loader, which is processed automatically when the Loader starts.
 *
 * @method Phaser.Loader.LoaderPlugin#audio
 * @since 3.0.0
 *
 * @param {string} key - [description]
 * @param {(string|string[])} urls - [description]
 * @param {object} config - [description]
 * @param {object} xhrSettings - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
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

        var audioType = url.match(/\.([a-zA-Z0-9]+)($|\?)/);

        audioType = GetFastValue(urls[i], 'type', (audioType) ? audioType[1] : '').toLowerCase();

        if (game.device.audio[audioType])
        {
            return {
                uri: url,
                type: audioType
            };
        }
    }

    return null;
};

module.exports = AudioFile;
