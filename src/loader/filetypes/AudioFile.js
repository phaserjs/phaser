/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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
 * @typedef {object} Phaser.Loader.FileTypes.AudioFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader and Audio Cache.
 * @property {string} [urlConfig] - The absolute or relative URL to load the file from.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @property {AudioContext} [audioContext] - The AudioContext this file will use to process itself.
 */

/**
 * @classdesc
 * A single Audio File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#audio method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#audio.
 *
 * @class AudioFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.AudioFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {any} [urlConfig] - The absolute or relative URL to load this file from in a config object.
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {AudioContext} [audioContext] - The AudioContext this file will use to process itself.
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
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
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
                console.error('Error decoding audio: ' + this.key + ' - ', e ? e.message : null);

                _this.onProcessError();
            }
        );

        this.config.context = null;
    }

});

AudioFile.create = function (loader, key, urls, config, xhrSettings)
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

    var urlConfig = AudioFile.getAudioURL(game, urls);

    if (!urlConfig)
    {
        return null;
    }

    // https://developers.google.com/web/updates/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs
    // var stream = GetFastValue(config, 'stream', false);

    if (deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
    {
        return new AudioFile(loader, key, urlConfig, xhrSettings, game.sound.context);
    }
    else
    {
        return new HTML5AudioFile(loader, key, urlConfig, config);
    }
};

AudioFile.getAudioURL = function (game, urls)
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
};

/**
 * Adds an Audio or HTML5Audio file, or array of audio files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.audio('title', [ 'music/Title.ogg', 'music/Title.mp3', 'music/Title.m4a' ]);
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 * 
 * The key must be a unique String. It is used to add the file to the global Audio Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Audio Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Audio Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.audio({
 *     key: 'title',
 *     url: [ 'music/Title.ogg', 'music/Title.mp3', 'music/Title.m4a' ]
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.AudioFileConfig` for more details.
 *
 * The URLs can be relative or absolute. If the URLs are relative the `Loader.baseURL` and `Loader.path` values will be prepended to them.
 *
 * Due to different browsers supporting different audio file types you should usually provide your audio files in a variety of formats.
 * ogg, mp3 and m4a are the most common. If you provide an array of URLs then the Loader will determine which _one_ file to load based on
 * browser support.
 *
 * If audio has been disabled in your game, either via the game config, or lack of support from the device, then no audio will be loaded.
 *
 * Note: The ability to load this type of file will only be available if the Audio File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#audio
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Loader.FileTypes.AudioFileConfig|Phaser.Loader.FileTypes.AudioFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {(string|string[])} [urls] - The absolute or relative URL to load the audio files from.
 * @param {any} [config] - An object containing an `instances` property for HTML5Audio. Defaults to 1.
 * @param {XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
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

    var audioFile;

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            audioFile = AudioFile.create(this, key[i]);

            if (audioFile)
            {
                this.addFile(audioFile);
            }
        }
    }
    else
    {
        audioFile = AudioFile.create(this, key, urls, config, xhrSettings);

        if (audioFile)
        {
            this.addFile(audioFile);
        }
    }

    return this;
});

module.exports = AudioFile;
