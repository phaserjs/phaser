/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetURL = require('../GetURL');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * A single Video File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#video method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#video.
 *
 * @class VideoFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.20.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.VideoFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {(string|string[]|Phaser.Types.Loader.FileTypes.VideoFileURLConfig|Phaser.Types.Loader.FileTypes.VideoFileURLConfig[])} [urls] - The absolute or relative URL to load the video files from.
 * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
 */
var VideoFile = new Class({

    Extends: File,

    initialize:

    function VideoFile (loader, key, url, noAudio)
    {
        if (noAudio === undefined) { noAudio = false; }

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url', []);
            noAudio = GetFastValue(config, 'noAudio', false);
        }

        var urlConfig = loader.systems.game.device.video.getVideoURL(url);

        if (!urlConfig)
        {
            console.warn('VideoFile: No supported format for ' + key);
        }

        var fileConfig = {
            type: 'video',
            cache: loader.cacheManager.video,
            extension: urlConfig.type,
            key: key,
            url: urlConfig.url,
            config: {
                noAudio: noAudio
            }
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.VideoFile#onProcess
     * @since 3.20.0
    */
    onProcess: function ()
    {
        this.data = {
            url: this.src,
            noAudio: this.config.noAudio,
            crossOrigin: this.crossOrigin
        };

        this.onProcessComplete();
    },

    /**
     * Called by the Loader, starts the actual file downloading.
     * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
     * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
     *
     * @method Phaser.Loader.FileTypes.VideoFile#load
     * @since 3.20.0
     */
    load: function ()
    {
        //  We set these, but we don't actually load anything (the Video Game Object does that)

        this.src = GetURL(this, this.loader.baseURL);

        this.state = CONST.FILE_LOADED;

        this.loader.nextFile(this, true);
    }

});

/**
 * Adds a Video file, or array of video files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.video('intro', [ 'video/level1.mp4', 'video/level1.webm', 'video/level1.mov' ]);
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
 * The key must be a unique String. It is used to add the file to the global Video Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Video Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Video Cache first, before loading a new one.
  *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.video({
 *     key: 'intro',
 *     url: [ 'video/level1.mp4', 'video/level1.webm', 'video/level1.mov' ],
 *     noAudio: true
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.VideoFileConfig` for more details.
 *
 * The URLs can be relative or absolute. If the URLs are relative the `Loader.baseURL` and `Loader.path` values will be prepended to them.
 *
 * Due to different browsers supporting different video file types you should usually provide your video files in a variety of formats.
 * mp4, mov and webm are the most common. If you provide an array of URLs then the Loader will determine which _one_ file to load based on
 * browser support, starting with the first in the array and progressing to the end.
 *
 * Unlike most asset-types, videos do not _need_ to be preloaded. You can create a Video Game Object and then call its `loadURL` method,
 * to load a video at run-time, rather than in advance.
 *
 * Note: The ability to load this type of file will only be available if the Video File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#video
 * @fires Phaser.Loader.Events#ADD
 * @since 3.20.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.VideoFileConfig|Phaser.Types.Loader.FileTypes.VideoFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {(string|string[]|Phaser.Types.Loader.FileTypes.VideoFileURLConfig|Phaser.Types.Loader.FileTypes.VideoFileURLConfig[])} [urls] - The absolute or relative URL to load the video files from.
 * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('video', function (key, urls, noAudio)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            this.addFile(new VideoFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new VideoFile(this, key, urls, noAudio));
    }

    return this;
});

module.exports = VideoFile;
