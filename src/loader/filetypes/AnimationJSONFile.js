/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');
var LoaderEvents = require('../events');

/**
 * @classdesc
 * A single Animation JSON File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#animation method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#animation.
 *
 * @class AnimationJSONFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.JSONFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {string} [dataKey] - When the JSON file loads only this property will be stored in the Cache.
 */
var AnimationJSONFile = new Class({

    Extends: JSONFile,

    initialize:

    //  url can either be a string, in which case it is treated like a proper url, or an object, in which case it is treated as a ready-made JS Object
    //  dataKey allows you to pluck a specific object out of the JSON and put just that into the cache, rather than the whole thing

    function AnimationJSONFile (loader, key, url, xhrSettings, dataKey)
    {
        JSONFile.call(this, loader, key, url, xhrSettings, dataKey);

        this.type = 'animationJSON';
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.AnimationJSONFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        //  We need to hook into this event:
        this.loader.once(LoaderEvents.POST_PROCESS, this.onLoadComplete, this);

        //  But the rest is the same as a normal JSON file
        JSONFile.prototype.onProcess.call(this);
    },

    /**
     * Called at the end of the load process, after the Loader has finished all files in its queue.
     *
     * @method Phaser.Loader.FileTypes.AnimationJSONFile#onLoadComplete
     * @since 3.7.0
     */
    onLoadComplete: function ()
    {
        this.loader.systems.anims.fromJSON(this.data);
    }

});

/**
 * Adds an Animation JSON Data file, or array of Animation JSON files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.animation('baddieAnims', 'files/BaddieAnims.json');
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
 * The key must be a unique String. It is used to add the file to the global JSON Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the JSON Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the JSON Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.animation({
 *     key: 'baddieAnims',
 *     url: 'files/BaddieAnims.json'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.JSONFileConfig` for more details.
 *
 * Once the file has finished loading it will automatically be passed to the global Animation Managers `fromJSON` method.
 * This will parse all of the JSON data and create animation data from it. This process happens at the very end
 * of the Loader, once every other file in the load queue has finished. The reason for this is to allow you to load
 * both animation data and the images it relies upon in the same load call.
 *
 * Once the animation data has been parsed you will be able to play animations using that data.
 * Please see the Animation Manager `fromJSON` method for more details about the format and playback.
 *
 * You can also access the raw animation data from its Cache using its key:
 *
 * ```javascript
 * this.load.animation('baddieAnims', 'files/BaddieAnims.json');
 * // and later in your game ...
 * var data = this.cache.json.get('baddieAnims');
 * ```
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
 * And if you only wanted to create animations from the `boss` data, then you could pass `level1.baddies.boss`as the `dataKey`.
 *
 * Note: The ability to load this type of file will only be available if the JSON File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#animation
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.JSONFileConfig|Phaser.Types.Loader.FileTypes.JSONFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.json`, i.e. if `key` was "alien" then the URL will be "alien.json".
 * @param {string} [dataKey] - When the Animation JSON file loads only this property will be stored in the Cache and used to create animation data.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('animation', function (key, url, dataKey, xhrSettings)
{
    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            this.addFile(new AnimationJSONFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new AnimationJSONFile(this, key, url, xhrSettings, dataKey));
    }

    return this;
});

module.exports = AnimationJSONFile;
