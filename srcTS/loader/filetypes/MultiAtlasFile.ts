/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var ImageFile = require('./ImageFile.js');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var JSONFile = require('./JSONFile.js');
var MultiFile = require('../MultiFile.js');

/**
 * @typedef {object} Phaser.Loader.FileTypes.MultiAtlasFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @property {string} [atlasURL] - The absolute or relative URL to load the multi atlas json file from. Or, a well formed JSON object.
 * @property {string} [atlasExtension='json'] - The default file extension to use for the atlas json if no url is provided.
 * @property {XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @property {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @property {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @property {XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */

/**
 * @classdesc
 * A single Multi Texture Atlas File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#multiatlas method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#multiatlas.
 *
 * @class MultiAtlasFile
 * @extends Phaser.Loader.MultiFile
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {string} key - The key of the file. Must be unique within both the Loader and the Texture Manager.
 * @param {string} [atlasURL] - The absolute or relative URL to load the multi atlas json file from.
 * @param {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @param {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @param {XHRSettingsObject} [atlasXhrSettings] - Extra XHR Settings specifically for the atlas json file.
 * @param {XHRSettingsObject} [textureXhrSettings] - Extra XHR Settings specifically for the texture files.
 */
var MultiAtlasFile = new Class({

    Extends: MultiFile,

    initialize:

    function MultiAtlasFile (loader, key, atlasURL, path, baseURL, atlasXhrSettings, textureXhrSettings)
    {
        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            atlasURL = GetFastValue(config, 'url');
            atlasXhrSettings = GetFastValue(config, 'xhrSettings');
            path = GetFastValue(config, 'path');
            baseURL = GetFastValue(config, 'baseURL');
            textureXhrSettings = GetFastValue(config, 'textureXhrSettings');
        }

        var data = new JSONFile(loader, key, atlasURL, atlasXhrSettings);

        MultiFile.call(this, loader, 'multiatlas', key, [ data ]);

        this.config.path = path;
        this.config.baseURL = baseURL;
        this.config.textureXhrSettings = textureXhrSettings;
    },

    /**
     * Called by each File when it finishes loading.
     *
     * @method Phaser.Loader.MultiFile#onFileComplete
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

            if (file.type === 'json' && file.data.hasOwnProperty('textures'))
            {
                //  Inspect the data for the files to now load
                var textures = file.data.textures;

                var config = this.config;
                var loader = this.loader;

                var currentBaseURL = loader.baseURL;
                var currentPath = loader.path;
                var currentPrefix = loader.prefix;

                var baseURL = GetFastValue(config, 'baseURL', currentBaseURL);
                var path = GetFastValue(config, 'path', currentPath);
                var prefix = GetFastValue(config, 'prefix', currentPrefix);
                var textureXhrSettings = GetFastValue(config, 'textureXhrSettings');

                loader.setBaseURL(baseURL);
                loader.setPath(path);
                loader.setPrefix(prefix);

                for (var i = 0; i < textures.length; i++)
                {
                    //  "image": "texture-packer-multi-atlas-0.png",
                    var textureURL = textures[i].image;

                    var key = '_MA_' + textureURL;

                    var image = new ImageFile(loader, key, textureURL, textureXhrSettings);

                    this.addToMultiFile(image);

                    loader.addFile(image);

                    //  "normalMap": "texture-packer-multi-atlas-0_n.png",
                    if (textures[i].normalMap)
                    {
                        var normalMap = new ImageFile(loader, key, textures[i].normalMap, textureXhrSettings);

                        normalMap.type = 'normalMap';

                        image.setLink(normalMap);

                        this.addToMultiFile(normalMap);

                        loader.addFile(normalMap);
                    }
                }

                //  Reset the loader settings
                loader.setBaseURL(currentBaseURL);
                loader.setPath(currentPath);
                loader.setPrefix(currentPrefix);
            }
        }
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.MultiFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            var fileJSON = this.files[0];

            fileJSON.addToCache();

            var data = [];
            var images = [];
            var normalMaps = [];

            for (var i = 1; i < this.files.length; i++)
            {
                var file = this.files[i];

                if (file.type === 'normalMap')
                {
                    continue;
                }

                var key = file.key.substr(4);
                var image = file.data;

                //  Now we need to find out which json entry this mapped to
                for (var t = 0; t < fileJSON.data.textures.length; t++)
                {
                    var item = fileJSON.data.textures[t];

                    if (item.image === key)
                    {
                        images.push(image);
                        
                        data.push(item);

                        if (file.linkFile)
                        {
                            normalMaps.push(file.linkFile.data);
                        }

                        break;
                    }
                }
            }

            if (normalMaps.length === 0)
            {
                normalMaps = undefined;
            }

            this.loader.textureManager.addAtlasJSONArray(this.key, images, data, normalMaps);

            this.complete = true;

            for (i = 0; i < this.files.length; i++)
            {
                this.files[i].pendingDestroy();
            }
        }
    }

});

/**
 * Adds a Multi Texture Atlas, or array of multi atlases, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.multiatlas('level1', 'images/Level1.json');
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
 * Phaser expects the atlas data to be provided in a JSON file as exported from the application Texture Packer,
 * version 4.6.3 or above, where you have made sure to use the Phaser 3 Export option.
 *
 * The way it works internally is that you provide a URL to the JSON file. Phaser then loads this JSON, parses it and
 * extracts which texture files it also needs to load to complete the process. If the JSON also defines normal maps,
 * Phaser will load those as well.
 * 
 * The key must be a unique String. It is used to add the file to the global Texture Manager upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Texture Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Texture Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.multiatlas({
 *     key: 'level1',
 *     atlasURL: 'images/Level1.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.MultiAtlasFileConfig` for more details.
 *
 * Instead of passing a URL for the atlas JSON data you can also pass in a well formed JSON object instead.
 *
 * Once the atlas has finished loading you can use frames from it as textures for a Game Object by referencing its key:
 * 
 * ```javascript
 * this.load.multiatlas('level1', 'images/Level1.json');
 * // and later in your game ...
 * this.add.image(x, y, 'level1', 'background');
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
 * Note: The ability to load this type of file will only be available if the Multi Atlas File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#multiatlas
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.7.0
 *
 * @param {(string|Phaser.Loader.FileTypes.MultiAtlasFileConfig|Phaser.Loader.FileTypes.MultiAtlasFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [atlasURL] - The absolute or relative URL to load the texture atlas json data file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {string} [path] - Optional path to use when loading the textures defined in the atlas data.
 * @param {string} [baseURL] - Optional Base URL to use when loading the textures defined in the atlas data.
 * @param {XHRSettingsObject} [atlasXhrSettings] - An XHR Settings configuration object for the atlas json file. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('multiatlas', function (key, atlasURL, path, baseURL, atlasXhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new MultiAtlasFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new MultiAtlasFile(this, key, atlasURL, path, baseURL, atlasXhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = MultiAtlasFile;
