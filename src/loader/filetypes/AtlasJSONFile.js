/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile.js');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile.js');
var MultiFile = require('../MultiFile.js');

/**
 * @classdesc
 * A single JSON based Texture Atlas File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#atlas method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#atlas.
 * 
 * https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?source=photonstorm
 *
 * @class AtlasJSONFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the texture image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [atlasURL] - The absolute or relative URL to load the texture atlas json data file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the atlas image file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas json file. Used in replacement of the Loaders default XHR Settings.
 */
var AtlasJSONFile = new Class({

    Extends: MultiFile,

    initialize:

    function AtlasJSONFile (loader, key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
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

            data = new JSONFile(loader, {
                key: key,
                url: GetFastValue(config, 'atlasURL'),
                extension: GetFastValue(config, 'atlasExtension', 'json'),
                xhrSettings: GetFastValue(config, 'atlasXhrSettings')
            });
        }
        else
        {
            image = new ImageFile(loader, key, textureURL, textureXhrSettings);
            data = new JSONFile(loader, key, atlasURL, atlasXhrSettings);
        }

        if (image.linkFile)
        {
            //  Image has a normal map
            MultiFile.call(this, loader, 'atlasjson', key, [ image, data, image.linkFile ]);
        }
        else
        {
            MultiFile.call(this, loader, 'atlasjson', key, [ image, data ]);
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.AtlasJSONFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var image = this.files[0];
            var json = this.files[1];
            var normalMap = (this.files[2]) ? this.files[2].data : null;

            this.loader.textureManager.addAtlas(image.key, image.data, json.data, normalMap);

            json.addToCache();

            this.complete = true;
        }
    }

});

/**
 * Adds a JSON based Texture Atlas, or array of atlases, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.atlas('mainmenu', 'images/MainMenu.png', 'images/MainMenu.json');
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
 * Phaser expects the atlas data to be provided in a JSON file, using either the JSON Hash or JSON Array format.
 * These files are created by software such as Texture Packer, Shoebox and Adobe Flash / Animate.
 * If you are using Texture Packer and have enabled multi-atlas support, then please use the Phaser Multi Atlas loader
 * instead of this one.
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
 * this.load.atlas({
 *     key: 'mainmenu',
 *     textureURL: 'images/MainMenu.png',
 *     atlasURL: 'images/MainMenu.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig` for more details.
 *
 * Instead of passing a URL for the atlas JSON data you can also pass in a well formed JSON object instead.
 *
 * Once the atlas has finished loading you can use frames from it as textures for a Game Object by referencing its key:
 * 
 * ```javascript
 * this.load.atlas('mainmenu', 'images/MainMenu.png', 'images/MainMenu.json');
 * // and later in your game ...
 * this.add.image(x, y, 'mainmenu', 'background');
 * ```
 *
 * To get a list of all available frames within an atlas please consult your Texture Atlas software.
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
 * this.load.atlas('mainmenu', [ 'images/MainMenu.png', 'images/MainMenu-n.png' ], 'images/MainMenu.json');
 * ```
 *
 * Or, if you are using a config object use the `normalMap` property:
 * 
 * ```javascript
 * this.load.atlas({
 *     key: 'mainmenu',
 *     textureURL: 'images/MainMenu.png',
 *     normalMap: 'images/MainMenu-n.png',
 *     atlasURL: 'images/MainMenu.json'
 * });
 * ```
 *
 * The normal map file is subject to the same conditions as the image file with regard to the path, baseURL, CORs and XHR Settings.
 * Normal maps are a WebGL only feature.
 *
 * Note: The ability to load this type of file will only be available if the Atlas JSON File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#atlas
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig|Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string|string[]} [textureURL] - The absolute or relative URL to load the texture image file from. If undefined or `null` it will be set to `<key>.png`, i.e. if `key` was "alien" then the URL will be "alien.png".
 * @param {string} [atlasURL] - The absolute or relative URL to load the texture atlas json data file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [textureXhrSettings] - An XHR Settings configuration object for the atlas image file. Used in replacement of the Loaders default XHR Settings.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas json file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('atlas', function (key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new AtlasJSONFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new AtlasJSONFile(this, key, textureURL, atlasURL, textureXhrSettings, atlasXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = AtlasJSONFile;
