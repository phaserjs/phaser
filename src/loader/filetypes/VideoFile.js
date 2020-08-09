/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 * @param {any} [urlConfig] - The absolute or relative URL to load this file from in a config object.
 * @param {string} [loadEvent] - The load event to listen for when _not_ loading as a blob. Either 'loadeddata', 'canplay' or 'canplaythrough'.
 * @param {boolean} [asBlob] - Load the video as a data blob, or via the Video element?
 * @param {boolean} [noAudio] - Does the video have an audio track? If not you can enable auto-playing on it.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var VideoFile = new Class({

    Extends: File,

    initialize:

    //  URL is an object created by VideoFile.getVideoURL
    function VideoFile (loader, key, urlConfig, loadEvent, asBlob, noAudio, xhrSettings)
    {
        if (loadEvent === undefined) { loadEvent = 'loadeddata'; }
        if (asBlob === undefined) { asBlob = false; }
        if (noAudio === undefined) { noAudio = false; }

        if (loadEvent !== 'loadeddata' && loadEvent !== 'canplay' && loadEvent !== 'canplaythrough')
        {
            loadEvent = 'loadeddata';
        }

        var fileConfig = {
            type: 'video',
            cache: loader.cacheManager.video,
            extension: urlConfig.type,
            responseType: 'blob',
            key: key,
            url: urlConfig.url,
            xhrSettings: xhrSettings,
            config: {
                loadEvent: loadEvent,
                asBlob: asBlob,
                noAudio: noAudio
            }
        };

        this.onLoadCallback = this.onVideoLoadHandler.bind(this);
        this.onErrorCallback = this.onVideoErrorHandler.bind(this);

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
        this.state = CONST.FILE_PROCESSING;

        if (!this.config.asBlob)
        {
            this.onProcessComplete();

            return;
        }

        //  Load Video as blob

        var video = this.createVideoElement();

        this.data = video;

        var _this = this;

        this.data.onloadeddata = function ()
        {
            _this.onProcessComplete();
        };

        this.data.onerror = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessError();
        };

        File.createObjectURL(video, this.xhrLoader.response, '');

        video.load();
    },

    /**
     * Creates a Video Element within the DOM.
     *
     * @method Phaser.Loader.FileTypes.VideoFile#createVideoElement
     * @private
     * @since 3.20.0
     *
     * @return {HTMLVideoElement} The newly created Video element.
     */
    createVideoElement: function ()
    {
        var video = document.createElement('video');

        video.controls = false;
        video.crossOrigin = this.loader.crossOrigin;

        if (this.config.noAudio)
        {
            video.muted = true;
            video.defaultMuted = true;

            video.setAttribute('autoplay', 'autoplay');
        }

        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('preload', 'auto');

        return video;
    },

    /**
     * Internal load event callback.
     *
     * @method Phaser.Loader.FileTypes.VideoFile#onVideoLoadHandler
     * @private
     * @since 3.20.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this load.
     */
    onVideoLoadHandler: function (event)
    {
        var video = event.target;

        video.removeEventListener(this.config.loadEvent, this.onLoadCallback, true);
        video.removeEventListener('error', this.onErrorCallback, true);

        this.data = video;

        this.resetXHR();

        this.loader.nextFile(this, true);
    },

    /**
     * Internal load error event callback.
     *
     * @method Phaser.Loader.FileTypes.VideoFile#onVideoErrorHandler
     * @private
     * @since 3.20.0
     *
     * @param {ProgressEvent} event - The DOM ProgressEvent that resulted from this load.
     */
    onVideoErrorHandler: function (event)
    {
        var video = event.target;

        if (video)
        {
            video.removeEventListener(this.config.loadEvent, this.onLoadCallback, true);
            video.removeEventListener('error', this.onErrorCallback, true);
        }

        this.resetXHR();

        this.loader.nextFile(this, false);
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
        var loadEvent = this.config.loadEvent;

        if (this.config.asBlob)
        {
            File.prototype.load.call(this);
        }
        else
        {
            this.percentComplete = 0;

            var video = this.createVideoElement();

            video.addEventListener(loadEvent, this.onLoadCallback, true);
            video.addEventListener('error', this.onErrorCallback, true);

            video.src = GetURL(this, this.loader.baseURL);

            video.load();
        }
    }

});

VideoFile.create = function (loader, key, urls, loadEvent, asBlob, noAudio, xhrSettings)
{
    var game = loader.systems.game;

    //  url may be inside key, which may be an object
    if (IsPlainObject(key))
    {
        urls = GetFastValue(key, 'url', []);
        loadEvent = GetFastValue(key, 'loadEvent', 'loadeddata');
        asBlob = GetFastValue(key, 'asBlob', false);
        noAudio = GetFastValue(key, 'noAudio', false);
        xhrSettings = GetFastValue(key, 'xhrSettings');
    }

    var urlConfig = VideoFile.getVideoURL(game, urls);

    if (urlConfig)
    {
        return new VideoFile(loader, key, urlConfig, loadEvent, asBlob, noAudio, xhrSettings);
    }
};

VideoFile.getVideoURL = function (game, urls)
{
    if (!Array.isArray(urls))
    {
        urls = [ urls ];
    }

    for (var i = 0; i < urls.length; i++)
    {
        var url = GetFastValue(urls[i], 'url', urls[i]);

        if (url.indexOf('blob:') === 0)
        {
            return {
                url: url,
                type: ''
            };
        }

        var videoType;

        if (url.indexOf('data:') === 0)
        {
            videoType = url.split(',')[0].match(/\/(.*?);/);
        }
        else
        {
            videoType = url.match(/\.([a-zA-Z0-9]+)($|\?)/);
        }

        videoType = GetFastValue(urls[i], 'type', (videoType) ? videoType[1] : '').toLowerCase();

        if (game.device.video[videoType])
        {
            return {
                url: url,
                type: videoType
            };
        }
    }

    return null;
};

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
 *     asBlob: false,
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
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.20.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.VideoFileConfig|Phaser.Types.Loader.FileTypes.VideoFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {(string|string[])} [urls] - The absolute or relative URL to load the video files from.
 * @param {string} [loadEvent='loadeddata'] - The load event to listen for when _not_ loading as a blob. Either `loadeddata`, `canplay` or `canplaythrough`.
 * @param {boolean} [asBlob=false] - Load the video as a data blob, or stream it via the Video element?
 * @param {boolean} [noAudio=false] - Does the video have an audio track? If not you can enable auto-playing on it.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('video', function (key, urls, loadEvent, asBlob, noAudio, xhrSettings)
{
    var videoFile;

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            videoFile = VideoFile.create(this, key[i]);

            if (videoFile)
            {
                this.addFile(videoFile);
            }
        }
    }
    else
    {
        videoFile = VideoFile.create(this, key, urls, loadEvent, asBlob, noAudio, xhrSettings);

        if (videoFile)
        {
            this.addFile(videoFile);
        }
    }

    return this;
});

module.exports = VideoFile;
