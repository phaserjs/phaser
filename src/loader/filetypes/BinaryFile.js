/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
 * A single Binary File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#binary method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#binary.
 *
 * @class BinaryFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.BinaryFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.bin`, i.e. if `key` was "alien" then the URL will be "alien.bin".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 * @param {any} [dataType] - Optional type to cast the binary file to once loaded. For example, `Uint8Array`.
 */
var BinaryFile = new Class({

    Extends: File,

    initialize:

    function BinaryFile (loader, key, url, xhrSettings, dataType)
    {
        var extension = 'bin';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
            dataType = GetFastValue(config, 'dataType', dataType);
        }

        var fileConfig = {
            type: 'binary',
            cache: loader.cacheManager.binary,
            extension: extension,
            responseType: 'arraybuffer',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: { dataType: dataType }
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.BinaryFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        var ctor = this.config.dataType;

        this.data = (ctor) ? new ctor(this.xhrLoader.response) : this.xhrLoader.response;

        this.onProcessComplete();
    }

});

/**
 * Adds a Binary file, or array of Binary files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.binary('doom', 'files/Doom.wad');
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
 * The key must be a unique String. It is used to add the file to the global Binary Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Binary Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Binary Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.binary({
 *     key: 'doom',
 *     url: 'files/Doom.wad',
 *     dataType: Uint8Array
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.BinaryFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 *
 * ```javascript
 * this.load.binary('doom', 'files/Doom.wad');
 * // and later in your game ...
 * var data = this.cache.binary.get('doom');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Data` the final key will be `LEVEL1.Data` and
 * this is what you would use to retrieve the text from the Binary Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "doom"
 * and no URL is given then the Loader will set the URL to be "doom.bin". It will always add `.bin` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Binary File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#binary
 * @fires Phaser.Loader.Events#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.BinaryFileConfig|Phaser.Types.Loader.FileTypes.BinaryFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.bin`, i.e. if `key` was "alien" then the URL will be "alien.bin".
 * @param {any} [dataType] - Optional type to cast the binary file to once loaded. For example, `Uint8Array`.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('binary', function (key, url, dataType, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new BinaryFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new BinaryFile(this, key, url, xhrSettings, dataType));
    }

    return this;
});

module.exports = BinaryFile;
