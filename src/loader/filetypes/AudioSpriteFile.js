/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AudioFile = require('./AudioFile.js');
var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile.js');
var MultiFile = require('../MultiFile.js');

/**
 * @classdesc
 * An Audio Sprite File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#audioSprite method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#audioSprite.
 *
 * @class AudioSpriteFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.AudioSpriteFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} jsonURL - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @param {{(string|string[])}} [audioURL] - The absolute or relative URL to load the audio file from. If empty it will be obtained by parsing the JSON file.
 * @param {any} [audioConfig] - The audio configuration options.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [audioXhrSettings] - An XHR Settings configuration object for the audio file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [jsonXhrSettings] - An XHR Settings configuration object for the json file. Used in replacement of the Loaders default XHR Settings.
 */
var AudioSpriteFile = new Class({

    Extends: MultiFile,

    initialize:

    function AudioSpriteFile (loader, key, jsonURL, audioURL, audioConfig, audioXhrSettings, jsonXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            jsonURL = GetFastValue(config, 'jsonURL');
            audioURL = GetFastValue(config, 'audioURL');
            audioConfig = GetFastValue(config, 'audioConfig');
            audioXhrSettings = GetFastValue(config, 'audioXhrSettings');
            jsonXhrSettings = GetFastValue(config, 'jsonXhrSettings');
        }

        var data;

        //  No url? then we're going to do a json load and parse it from that
        if (!audioURL)
        {
            data = new JSONFile(loader, key, jsonURL, jsonXhrSettings);

            MultiFile.call(this, loader, 'audiosprite', key, [ data ]);

            this.config.resourceLoad = true;
            this.config.audioConfig = audioConfig;
            this.config.audioXhrSettings = audioXhrSettings;
        }
        else
        {
            var audio = AudioFile.create(loader, key, audioURL, audioConfig, audioXhrSettings);

            if (audio)
            {
                data = new JSONFile(loader, key, jsonURL, jsonXhrSettings);

                MultiFile.call(this, loader, 'audiosprite', key, [ audio, data ]);

                this.config.resourceLoad = false;
            }
        }
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.FileTypes.AudioSpriteFile#onFileComplete
     * @since 3.7.0
     *
     * @param {Phaser.Loader.File} file - The File that has completed processing.
     */
    onFileComplete: function (file)
    {
        var index = this.files.indexOf(file);

        if (index !== -1)
        {
            this.pending--;

            if (this.config.resourceLoad && file.type === 'json' && file.data.hasOwnProperty('resources'))
            {
                //  Inspect the data for the files to now load
                var urls = file.data.resources;

                var audioConfig = GetFastValue(this.config, 'audioConfig');
                var audioXhrSettings = GetFastValue(this.config, 'audioXhrSettings');

                var audio = AudioFile.create(this.loader, file.key, urls, audioConfig, audioXhrSettings);

                if (audio)
                {
                    this.addToMultiFile(audio);

                    this.loader.addFile(audio);
                }
            }
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.AudioSpriteFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileA = this.files[0];
            var fileB = this.files[1];

            fileA.addToCache();
            fileB.addToCache();

            this.complete = true;
        }
    }

});

/**
 * Adds a JSON based Audio Sprite, or array of audio sprites, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.audioSprite('kyobi', 'kyobi.json', [
 *         'kyobi.ogg',
 *         'kyobi.mp3',
 *         'kyobi.m4a'
 *     ]);
 * }
 * ```
 *
 * Audio Sprites are a combination of audio files and a JSON configuration.
 * The JSON follows the format of that created by https://github.com/tonistiigi/audiosprite
 *
 * If the JSON file includes a 'resource' object then you can let Phaser parse it and load the audio
 * files automatically based on its content. To do this exclude the audio URLs from the load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.audioSprite('kyobi', 'kyobi.json');
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
 * If you call this from outside of `preload` then you are responsible for starting the Loader afterwards and monitoring
 * its events to know when it's safe to use the asset. Please see the Phaser.Loader.LoaderPlugin class for more details.
 *
 * The key must be a unique String. It is used to add the file to the global Audio Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Audio Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Audio Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.audioSprite({
 *     key: 'kyobi',
 *     jsonURL: 'audio/Kyobi.json',
 *     audioURL: [
 *         'audio/Kyobi.ogg',
 *         'audio/Kyobi.mp3',
 *         'audio/Kyobi.m4a'
 *     ]
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.AudioSpriteFileConfig` for more details.
 *
 * Instead of passing a URL for the audio JSON data you can also pass in a well formed JSON object instead.
 *
 * Once the audio has finished loading you can use it create an Audio Sprite by referencing its key:
 *
 * ```javascript
 * this.load.audioSprite('kyobi', 'kyobi.json');
 * // and later in your game ...
 * var music = this.sound.addAudioSprite('kyobi');
 * music.play('title');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * Due to different browsers supporting different audio file types you should usually provide your audio files in a variety of formats.
 * ogg, mp3 and m4a are the most common. If you provide an array of URLs then the Loader will determine which _one_ file to load based on
 * browser support.
 *
 * If audio has been disabled in your game, either via the game config, or lack of support from the device, then no audio will be loaded.
 *
 * Note: The ability to load this type of file will only be available if the Audio Sprite File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#audioSprite
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.AudioSpriteFileConfig|Phaser.Types.Loader.FileTypes.AudioSpriteFileConfig[])} key - The key to use for this file, or a file configuration object, or an array of objects.
 * @param {string} jsonURL - The absolute or relative URL to load the json file from. Or a well formed JSON object to use instead.
 * @param {(string|string[])} [audioURL] - The absolute or relative URL to load the audio file from. If empty it will be obtained by parsing the JSON file.
 * @param {any} [audioConfig] - The audio configuration options.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [audioXhrSettings] - An XHR Settings configuration object for the audio file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [jsonXhrSettings] - An XHR Settings configuration object for the json file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader.
 */
FileTypesManager.register('audioSprite', function (key, jsonURL, audioURL, audioConfig, audioXhrSettings, jsonXhrSettings)
{
    var game = this.systems.game;
    var gameAudioConfig = game.config.audio;
    var deviceAudio = game.device.audio;

    if ((gameAudioConfig && gameAudioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        //  Sounds are disabled, so skip loading audio
        return this;
    }

    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new AudioSpriteFile(this, key[i]);

            if (multifile.files)
            {
                this.addFile(multifile.files);
            }
        }
    }
    else
    {
        multifile = new AudioSpriteFile(this, key, jsonURL, audioURL, audioConfig, audioXhrSettings, jsonXhrSettings);

        if (multifile.files)
        {
            this.addFile(multifile.files);
        }
    }

    return this;
});
