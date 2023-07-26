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
var ParseXML = require('../../dom/ParseXML');

/**
 * @classdesc
 * A single XML File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#xml method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#xml.
 *
 * @class XMLFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.XMLFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var XMLFile = new Class({

    Extends: File,

    initialize:

    function XMLFile (loader, key, url, xhrSettings)
    {
        var extension = 'xml';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'xml',
            cache: loader.cacheManager.xml,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.XMLFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = ParseXML(this.xhrLoader.responseText);

        if (this.data)
        {
            this.onProcessComplete();
        }
        else
        {
            this.onProcessError();
        }
    }

});

/**
 * Adds an XML file, or array of XML files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.xml('wavedata', 'files/AlienWaveData.xml');
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
 * The key must be a unique String. It is used to add the file to the global XML Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the XML Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the XML Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.xml({
 *     key: 'wavedata',
 *     url: 'files/AlienWaveData.xml'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.XMLFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 * 
 * ```javascript
 * this.load.xml('wavedata', 'files/AlienWaveData.xml');
 * // and later in your game ...
 * var data = this.cache.xml.get('wavedata');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `LEVEL1.` and the key was `Waves` the final key will be `LEVEL1.Waves` and
 * this is what you would use to retrieve the text from the XML Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "data"
 * and no URL is given then the Loader will set the URL to be "data.xml". It will always add `.xml` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the XML File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#xml
 * @fires Phaser.Loader.Events#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.XMLFileConfig|Phaser.Types.Loader.FileTypes.XMLFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.xml`, i.e. if `key` was "alien" then the URL will be "alien.xml".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('xml', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new XMLFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new XMLFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = XMLFile;
