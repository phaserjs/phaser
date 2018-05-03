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
var IsPlainObject = require('../../utils/object/IsPlainObject');

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
 * @param {XHRSettingsObject} [xhrSettings] - [description]
 * @param {AudioContext} [audioContext] - [description]
 */
var AudioFile = new Class({

    Extends: File,

    initialize:

    //  URL is an object created by AudioFile.findAudioURL
    function AudioFile (loader, key, urlConfig, xhrSettings, audioContext)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            audioContext = GetFastValue(config, 'context', audioContext);
        }

        var fileConfig = {
            type: 'audio',
            cache: loader.cacheManager.audio,
            extension: urlConfig.type,
            responseType: 'arraybuffer',
            key: key,
            url: urlConfig.url,
            xhrSettings: xhrSettings,
            config: { context: audioContext }
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * [description]
     *
     * @method Phaser.Loader.FileTypes.AudioFile#onProcess
     * @since 3.0.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        var _this = this;

        // interesting read https://github.com/WebAudio/web-audio-api/issues/1305
        this.config.context.decodeAudioData(this.xhrLoader.response,
            function (audioBuffer)
            {
                _this.data = audioBuffer;

                _this.onProcessComplete();
            },
            function (e)
            {
                // eslint-disable-next-line no-console
                console.error('Error decoding audio: ' + this.key + ' - ', e.message);

                _this.onProcessError();
            }
        );

        this.config.context = null;
    }

});

function createAudio (loader, key, urls, config, xhrSettings)
{
    var game = loader.systems.game;
    var audioConfig = game.config.audio;
    var deviceAudio = game.device.audio;

    //  url may be inside key, which may be an object
    if (IsPlainObject(key))
    {
        urls = GetFastValue(key, 'url', []);
        config = GetFastValue(key, 'config', {});
    }

    var urlConfig = findAudioURL(game, urls);

    if (!urlConfig)
    {
        return null;
    }

    // https://developers.google.com/web/updates/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs
    var stream = GetFastValue(config, 'stream', false);

    if (deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
    {
        return new AudioFile(loader, key, urlConfig, xhrSettings, game.sound.context);
    }
    else
    {
        return new HTML5AudioFile(loader, key, urlConfig, config);
    }
}

function findAudioURL (game, urls)
{
    if (!Array.isArray(urls))
    {
        urls = [ urls ];
    }

    for (var i = 0; i < urls.length; i++)
    {
        var url = GetFastValue(urls[i], 'url', urls[i]);

        if (url.indexOf('blob:') === 0 || url.indexOf('data:') === 0)
        {
            return url;
        }

        var audioType = url.match(/\.([a-zA-Z0-9]+)($|\?)/);

        audioType = GetFastValue(urls[i], 'type', (audioType) ? audioType[1] : '').toLowerCase();

        if (game.device.audio[audioType])
        {
            return {
                url: url,
                type: audioType
            };
        }
    }

    return null;
}

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
 * @param {object} [xhrSettings] - [description]
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader.
 */
FileTypesManager.register('audio', function (key, urls, config, xhrSettings)
{
    var game = this.systems.game;
    var audioConfig = game.config.audio;
    var deviceAudio = game.device.audio;

    if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        //  Sounds are disabled, so skip loading audio
        return this;
    }

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            var audioFile = createAudio(this, key[i]);

            if (audioFile)
            {
                this.addFile(audioFile);
            }
        }
    }
    else
    {
        var audioFile = createAudio(this, key, urls, config, xhrSettings);

        if (audioFile)
        {
            this.addFile(audioFile);
        }
    }

    return this;
});

module.exports = AudioFile;
