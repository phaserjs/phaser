/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var MultiFile = require('../MultiFile');
var ParseXMLBitmapFont = require('../../gameobjects/bitmaptext/ParseXMLBitmapFont');
var XMLFile = require('./XMLFile');

/**
 * @classdesc
 * A single Bitmap Font based File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#bitmapFont method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#bitmapFont.
 *
 * @class BitmapFontFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.BitmapFontFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the font image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [fontDataURL] - The absolute or relative URL to load the font xml data file from. If undefined or `null` it will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the font image file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [fontDataXhrSettings] - An XHR Settings configuration object for the font data xml file. Used in replacement of the Loaders default XHR Settings.
 */
var BitmapFontFile = new Class({

    Extends: MultiFile,

    initialize:

    function BitmapFontFile (loader, key, textureURL, fontDataURL, textureXhrSettings, fontDataXhrSettings)
    {
        var image;
        var data;

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');

            image = new ImageFile(loader, {
                key: key,
                url: GetFastValue(config, 'textureURL'),
                extension: GetFastValue(config, 'textureExtension', 'png'),
                normalMap: GetFastValue(config, 'normalMap'),
                xhrSettings: GetFastValue(config, 'textureXhrSettings')
            });

            data = new XMLFile(loader, {
                key: key,
                url: GetFastValue(config, 'fontDataURL'),
                extension: GetFastValue(config, 'fontDataExtension', 'xml'),
                xhrSettings: GetFastValue(config, 'fontDataXhrSettings')
            });
        }
        else
        {
            image = new ImageFile(loader, key, textureURL, textureXhrSettings);
            data = new XMLFile(loader, key, fontDataURL, fontDataXhrSettings);
        }

        if (image.linkFile)
        {
            //  Image has a normal map
            MultiFile.call(this, loader, 'bitmapfont', key, [ image, data, image.linkFile ]);
        }
        else
        {
            MultiFile.call(this, loader, 'bitmapfont', key, [ image, data ]);
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.BitmapFontFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var image = this.files[0];
            var xml = this.files[1];

            image.addToCache();

            var texture = image.cache.get(image.key);

            var data = ParseXMLBitmapFont(xml.data, image.cache.getFrame(image.key), 0, 0, texture);

            this.loader.cacheManager.bitmapFont.add(image.key, { data: data, texture: image.key, frame: null });

            this.complete = true;
        }
    }

});

/**
 * Adds an XML based Bitmap Font, or array of fonts, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:

 * ```javascript
 * function preload ()
 * {
 *     this.load.bitmapFont('goldenFont', 'images/GoldFont.png', 'images/GoldFont.xml');
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
 * Phaser expects the font data to be provided in an XML file format.
 * These files are created by software such as the [Angelcode Bitmap Font Generator](http://www.angelcode.com/products/bmfont/),
 * [Littera](http://kvazars.com/littera/) or [Glyph Designer](https://71squared.com/glyphdesigner)
 *
 * Phaser can load all common image types: png, jpg, gif and any other format the browser can natively handle.
 *
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.bitmapFont({
 *     key: 'goldenFont',
 *     textureURL: 'images/GoldFont.png',
 *     fontDataURL: 'images/GoldFont.xml'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.BitmapFontFileConfig` for more details.
 *
 * Once the atlas has finished loading you can use key of it when creating a Bitmap Text Game Object:
 *
 * ```javascript
 * this.load.bitmapFont('goldenFont', 'images/GoldFont.png', 'images/GoldFont.xml');
 * // and later in your game ...
 * this.add.bitmapText(x, y, 'goldenFont', 'Hello World');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `MENU.` and the key was `Background` the final key will be `MENU.Background` and
 * this is what you would use when creating a Bitmap Text object.
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
 * this.load.bitmapFont('goldenFont', [ 'images/GoldFont.png', 'images/GoldFont-n.png' ], 'images/GoldFont.xml');
 * ```
 *
 * Or, if you are using a config object use the `normalMap` property:
 *
 * ```javascript
 * this.load.bitmapFont({
 *     key: 'goldenFont',
 *     textureURL: 'images/GoldFont.png',
 *     normalMap: 'images/GoldFont-n.png',
 *     fontDataURL: 'images/GoldFont.xml'
 * });
 * ```
 *
 * The normal map file is subject to the same conditions as the image file with regard to the path, baseURL, CORs and XHR Settings.
 * Normal maps are a WebGL only feature.
 *
 * Note: The ability to load this type of file will only be available if the Bitmap Font File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#bitmapFont
 * @fires Phaser.Loader.Events#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.BitmapFontFileConfig|Phaser.Types.Loader.FileTypes.BitmapFontFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the font image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [fontDataURL] - The absolute or relative URL to load the font xml data file from. If undefined or `null` it will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the font image file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [fontDataXhrSettings] - An XHR Settings configuration object for the font data xml file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('bitmapFont', function (key, textureURL, fontDataURL, textureXhrSettings, fontDataXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new BitmapFontFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new BitmapFontFile(this, key, textureURL, fontDataURL, textureXhrSettings, fontDataXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = BitmapFontFile;
