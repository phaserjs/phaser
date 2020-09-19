/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * A single Image File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#image method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#image.
 *
 * @class ImageFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.ImageFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. Only provided for, and used by, Sprite Sheets.
 */
var ImageFile = new Class({

    Extends: File,

    initialize:

    function ImageFile (loader, key, url, xhrSettings, frameConfig)
    {
        var extension = 'png';
        var normalMapURL;

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            normalMapURL = GetFastValue(config, 'normalMap');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
            frameConfig = GetFastValue(config, 'frameConfig');
        }

        if (Array.isArray(url))
        {
            normalMapURL = url[1];
            url = url[0];
        }

        var fileConfig = {
            type: 'image',
            cache: loader.textureManager,
            extension: extension,
            responseType: 'blob',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: frameConfig
        };

        File.call(this, loader, fileConfig);

        //  Do we have a normal map to load as well?
        if (normalMapURL)
        {
            var normalMap = new ImageFile(loader, this.key, normalMapURL, xhrSettings, frameConfig);

            normalMap.type = 'normalMap';

            this.setLink(normalMap);

            loader.addFile(normalMap);
        }
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.ImageFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = new Image();

        this.data.crossOrigin = this.crossOrigin;

        var _this = this;

        this.data.onload = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessComplete();
        };

        this.data.onerror = function ()
        {
            File.revokeObjectURL(_this.data);

            _this.onProcessError();
        };

        File.createObjectURL(this.data, this.xhrLoader.response, 'image/png');
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.ImageFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        var texture;
        var linkFile = this.linkFile;

        if (linkFile && linkFile.state === CONST.FILE_COMPLETE)
        {
            if (this.type === 'image')
            {
                texture = this.cache.addImage(this.key, this.data, linkFile.data);
            }
            else
            {
                texture = this.cache.addImage(linkFile.key, linkFile.data, this.data);
            }

            this.pendingDestroy(texture);

            linkFile.pendingDestroy(texture);
        }
        else if (!linkFile)
        {
            texture = this.cache.addImage(this.key, this.data);

            this.pendingDestroy(texture);
        }
    }

});

/**
 * Adds an Image, or array of Images, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.image('logo', 'images/phaserLogo.png');
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
 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
 * If you try to load an animated gif only the first frame will be rendered. Browsers do not natively support playback
 * of animated gifs to Canvas elements.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.image({
 *     key: 'logo',
 *     url: 'images/AtariLogo.png'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.ImageFileConfig` for more details.
 *
 * Once the file has finished loading you can use it as a texture for a Game Object by referencing its key:
 *
 * ```javascript
 * this.load.image('logo', 'images/AtariLogo.png');
 * // and later in your game ...
 * this.add.image(x, y, 'logo');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use to retrieve the image from the Texture Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.png". It will always add `.png` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Phaser also supports the automatic loading of associated normal maps. If you have a normal map to go with this image,
 * then you can specify it by providing an array as the `url` where the second element is the normal map:
 *
 * ```javascript
 * this.load.image('logo', [ 'images/AtariLogo.png', 'images/AtariLogo-n.png' ]);
 * ```
 *
 * Or, if you are using a config object use the `normalMap` property:
 *
 * ```javascript
 * this.load.image({
 *     key: 'logo',
 *     url: 'images/AtariLogo.png',
 *     normalMap: 'images/AtariLogo-n.png'
 * });
 * ```
 *
 * The normal map file is subject to the same conditions as the image file with regard to the path, baseURL, CORs and XHR Settings.
 * Normal maps are a WebGL only feature.
 *
 * Note: The ability to load this type of file will only be available if the Image File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#image
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.ImageFileConfig|Phaser.Types.Loader.FileTypes.ImageFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('image', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new ImageFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new ImageFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = ImageFile;
