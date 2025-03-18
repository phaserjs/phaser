/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
 * A single Script File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#script method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#script.
 *
 * @class ScriptFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.ScriptFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
 * @param {string} [type='script'] - The script type. Should be either 'script' for classic JavaScript, or 'module' if the file contains an exported module.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var ScriptFile = new Class({

    Extends: File,

    initialize:

    function ScriptFile (loader, key, url, type, xhrSettings)
    {
        var extension = 'js';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            type = GetFastValue(config, 'type', 'script');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }
        else if (type === undefined)
        {
            type = 'script';
        }

        var fileConfig = {
            type: type,
            cache: false,
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
     * @method Phaser.Loader.FileTypes.ScriptFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = document.createElement('script');
        this.data.language = 'javascript';
        this.data.type = 'text/javascript';
        this.data.defer = false;
        this.data.text = this.xhrLoader.responseText;

        document.head.appendChild(this.data);

        this.onProcessComplete();
    }

});

/**
 * Adds a Script file, or array of Script files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.script('aliens', 'lib/aliens.js');
 * }
 * ```
 *
 * If the script file contains a module, then you should specify that using the 'type' parameter:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.script('aliens', 'lib/aliens.js', 'module');
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
 * The key must be a unique String and not already in-use by another file in the Loader.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.script({
 *     key: 'aliens',
 *     url: 'lib/aliens.js',
 *     type: 'script' // or 'module'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.ScriptFileConfig` for more details.
 *
 * Once the file has finished loading it will automatically be converted into a script element
 * via `document.createElement('script')`. It will have its language set to JavaScript, `defer` set to
 * false and then the resulting element will be appended to `document.head`. Any code then in the
 * script will be executed.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "alien"
 * and no URL is given then the Loader will set the URL to be "alien.js". It will always add `.js` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Script File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#script
 * @fires Phaser.Loader.Events#ADD
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.ScriptFileConfig|Phaser.Types.Loader.FileTypes.ScriptFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
 * @param {string} [type='script'] - The script type. Should be either 'script' for classic JavaScript, or 'module' if the file contains an exported module.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('script', function (key, url, type, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new ScriptFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new ScriptFile(this, key, url, type, xhrSettings));
    }

    return this;
});

module.exports = ScriptFile;
