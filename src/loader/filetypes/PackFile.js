/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile');

/**
 * @classdesc
 * A single JSON Pack File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#pack method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#pack.
 *
 * @class PackFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.PackFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {(string|any)} [url] - The absolute or relative URL to load this file from or a ready formed JSON object. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {string} [dataKey] - When the JSON file loads only this property will be stored in the Cache.
 */
var PackFile = new Class({

    Extends: JSONFile,

    initialize:

    //  url can either be a string, in which case it is treated like a proper url, or an object, in which case it is treated as a ready-made JS Object
    //  dataKey allows you to pluck a specific object out of the JSON and put just that into the cache, rather than the whole thing

    function PackFile (loader, key, url, xhrSettings, dataKey)
    {
        JSONFile.call(this, loader, key, url, xhrSettings, dataKey);

        this.type = 'packfile';
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.PackFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        if (this.state !== CONST.FILE_POPULATED)
        {
            this.state = CONST.FILE_PROCESSING;

            this.data = JSON.parse(this.xhrLoader.responseText);
        }

        if (this.data.hasOwnProperty('files') && this.config)
        {
            var newData = {};

            newData[this.config] = this.data;

            this.data = newData;
        }

        //  Let's pass the pack file data over to the Loader ...
        this.loader.addPack(this.data, this.config);

        this.onProcessComplete();
    }

});

/**
 * Adds a JSON File Pack, or array of packs, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.pack('level1', 'data/Level1Files.json');
 * }
 * ```
 *
 * A File Pack is a JSON file (or object) that contains details about other files that should be added into the Loader.
 * Here is a small example:
 *
 * ```json
 * {
 *    "test1": {
 *        "files": [
 *            {
 *                "type": "image",
 *                "key": "taikodrummaster",
 *                "url": "assets/pics/taikodrummaster.jpg"
 *            },
 *            {
 *                "type": "image",
 *                "key": "sukasuka-chtholly",
 *                "url": "assets/pics/sukasuka-chtholly.png"
 *            }
 *        ]
 *    },
 *    "meta": {
 *        "generated": "1401380327373",
 *        "app": "Phaser 3 Asset Packer",
 *        "url": "https://phaser.io",
 *        "version": "1.0",
 *        "copyright": "Photon Storm Ltd. 2018"
 *    }
 * }
 * ```
 *
 * The pack can be split into sections. In the example above you'll see a section called `test1`. You can tell
 * the `load.pack` method to parse only a particular section of a pack. The pack is stored in the JSON Cache,
 * so you can pass it to the Loader to process additional sections as needed in your game, or you can just load
 * them all at once without specifying anything.
 *
 * The pack file can contain an entry for any type of file that Phaser can load. The object structures exactly
 * match that of the file type configs, and all properties available within the file type configs can be used
 * in the pack file too. An entry's `type` is the name of the Loader method that will load it, e.g., 'image'.
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
 * The key must be a unique String. It is used to add the file to the global JSON Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the JSON Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the JSON Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.pack({
 *     key: 'level1',
 *     url: 'data/Level1Files.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.PackFileConfig` for more details.
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Waves` the final key will be `LEVEL1.Waves` and
 * this is what you would use to retrieve the text from the JSON Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "data"
 * and no URL is given then the Loader will set the URL to be "data.json". It will always add `.json` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * You can also optionally provide a `dataKey` to use. This allows you to extract only a part of the JSON and store it in the Cache,
 * rather than the whole file. For example, if your JSON data had a structure like this:
 *
 * ```json
 * {
 *     "level1": {
 *         "baddies": {
 *             "aliens": {},
 *             "boss": {}
 *         }
 *     },
 *     "level2": {},
 *     "level3": {}
 * }
 * ```
 *
 * And you only wanted to store the `boss` data in the Cache, then you could pass `level1.baddies.boss`as the `dataKey`.
 *
 * Note: The ability to load this type of file will only be available if the Pack File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#pack
 * @fires Phaser.Loader.Events#ADD
 * @since 3.7.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.PackFileConfig|Phaser.Types.Loader.FileTypes.PackFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {string} [dataKey] - When the JSON file loads only this property will be stored in the Cache.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('pack', function (key, url, dataKey, xhrSettings)
{
    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            this.addFile(new PackFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new PackFile(this, key, url, xhrSettings, dataKey));
    }

    return this;
});

module.exports = PackFile;
