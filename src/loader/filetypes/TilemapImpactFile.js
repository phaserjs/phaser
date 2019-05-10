/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');
var TILEMAP_FORMATS = require('../../tilemaps/Formats');

/**
 * @classdesc
 * A single Impact.js Tilemap JSON File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#tilemapImpact method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#tilemapImpact.
 *
 * @class TilemapImpactFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.7.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.TilemapImpactFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var TilemapImpactFile = new Class({

    Extends: JSONFile,

    initialize:

    function TilemapImpactFile (loader, key, url, xhrSettings)
    {
        JSONFile.call(this, loader, key, url, xhrSettings);

        this.type = 'tilemapJSON';

        this.cache = loader.cacheManager.tilemap;
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.TilemapImpactFile#addToCache
     * @since 3.7.0
     */
    addToCache: function ()
    {
        var tiledata = { format: TILEMAP_FORMATS.WELTMEISTER, data: this.data };

        this.cache.add(this.key, tiledata);

        this.pendingDestroy(tiledata);
    }

});

/**
 * Adds an Impact.js Tilemap file, or array of map files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.tilemapImpact('level1', 'maps/Level1.json');
 * }
 * ```
 *
 * Impact Tilemap data is created the Impact.js Map Editor called Weltmeister.
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * The key must be a unique String. It is used to add the file to the global Tilemap Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Tilemap Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Text Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.tilemapImpact({
 *     key: 'level1',
 *     url: 'maps/Level1.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.TilemapImpactFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 *
 * ```javascript
 * this.load.tilemapImpact('level1', 'maps/Level1.json');
 * // and later in your game ...
 * var map = this.make.tilemap({ key: 'level1' });
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Story` the final key will be `LEVEL1.Story` and
 * this is what you would use to retrieve the text from the Tilemap Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "level"
 * and no URL is given then the Loader will set the URL to be "level.json". It will always add `.json` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Tilemap Impact File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#tilemapImpact
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.7.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.TilemapImpactFileConfig|Phaser.Types.Loader.FileTypes.TilemapImpactFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('tilemapImpact', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new TilemapImpactFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new TilemapImpactFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = TilemapImpactFile;
