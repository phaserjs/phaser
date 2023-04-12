/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var FileTypesManager = require('../FileTypesManager');
var ImageFile = require('./ImageFile.js');

/**
 * @classdesc
 * A single Sprite Sheet Image File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#spritesheet method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#spritesheet.
 *
 * @class SpriteSheetFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var SpriteSheetFile = new Class({

    Extends: ImageFile,

    initialize:

    function SpriteSheetFile (loader, key, url, frameConfig, xhrSettings)
    {
        ImageFile.call(this, loader, key, url, xhrSettings, frameConfig);

        this.type = 'spritesheet';
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.SpriteSheetFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        //  Check if we have a linked normal map
        var linkFile = this.linkFile;

        if (linkFile)
        {
            //  We do, but has it loaded?
            if (linkFile.state >= CONST.FILE_COMPLETE)
            {
                //  Both files have loaded
                if (this.type === 'normalMap')
                {
                    //  linkFile.data = Image
                    //  this.data = Normal Map
                    this.cache.addSpriteSheet(this.key, linkFile.data, this.config, this.data);
                }
                else
                {
                    //  linkFile.data = Normal Map
                    //  this.data = Image
                    this.cache.addSpriteSheet(this.key, this.data, this.config, linkFile.data);
                }
            }

            //  Nothing to do here, we'll use the linkFile `addToCache` call
            //  to process this pair
        }
        else
        {
            this.cache.addSpriteSheet(this.key, this.data, this.config);
        }
    }

});

/**
 * Adds a Sprite Sheet Image, or array of Sprite Sheet Images, to the current load queue.
 *
 * The term 'Sprite Sheet' in Phaser means a fixed-size sheet. Where every frame in the sheet is the exact same size,
 * and you reference those frames using numbers, not frame names. This is not the same thing as a Texture Atlas, where
 * the frames are packed in a way where they take up the least amount of space, and are referenced by their names,
 * not numbers. Some articles and software use the term 'Sprite Sheet' to mean Texture Atlas, so please be aware of
 * what sort of file you're actually trying to load.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.spritesheet('bot', 'images/robot.png', { frameWidth: 32, frameHeight: 38 });
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
 * this.load.spritesheet({
 *     key: 'bot',
 *     url: 'images/robot.png',
 *     frameConfig: {
 *         frameWidth: 32,
 *         frameHeight: 38,
 *         startFrame: 0,
 *         endFrame: 8
 *     }
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig` for more details.
 *
 * Once the file has finished loading you can use it as a texture for a Game Object by referencing its key:
 *
 * ```javascript
 * this.load.spritesheet('bot', 'images/robot.png', { frameWidth: 32, frameHeight: 38 });
 * // and later in your game ...
 * this.add.image(x, y, 'bot', 0);
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `PLAYER.` and the key was `Running` the final key will be `PLAYER.Running` and
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
 * this.load.spritesheet('logo', [ 'images/AtariLogo.png', 'images/AtariLogo-n.png' ], { frameWidth: 256, frameHeight: 80 });
 * ```
 *
 * Or, if you are using a config object use the `normalMap` property:
 *
 * ```javascript
 * this.load.spritesheet({
 *     key: 'logo',
 *     url: 'images/AtariLogo.png',
 *     normalMap: 'images/AtariLogo-n.png',
 *     frameConfig: {
 *         frameWidth: 256,
 *         frameHeight: 80
 *     }
 * });
 * ```
 *
 * The normal map file is subject to the same conditions as the image file with regard to the path, baseURL, CORs and XHR Settings.
 * Normal maps are a WebGL only feature.
 *
 * Note: The ability to load this type of file will only be available if the Sprite Sheet File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#spritesheet
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig|Phaser.Types.Loader.FileTypes.SpriteSheetFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {Phaser.Types.Loader.FileTypes.ImageFrameConfig} [frameConfig] - The frame configuration object. At a minimum it should have a `frameWidth` property.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('spritesheet', function (key, url, frameConfig, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SpriteSheetFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new SpriteSheetFile(this, key, url, frameConfig, xhrSettings));
    }

    return this;
});

module.exports = SpriteSheetFile;
