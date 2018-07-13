/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @typedef {object} Phaser.Loader.FileTypes.ScenePluginFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within the Loader.
 * @property {(string|function)} [url] - The absolute or relative URL to load the file from. Or, a Scene Plugin.
 * @property {string} [extension='js'] - The default file extension to use if no url is provided.
 * @property {string} [systemKey] - If this plugin is to be added to Scene.Systems, this is the property key for it.
 * @property {string} [sceneKey] - If this plugin is to be added to the Scene, this is the property key for it.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */

/**
 * @classdesc
 * A single Scene Plugin Script File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#scenePlugin method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#scenePlugin.
 *
 * @class ScenePluginFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.ScenePluginFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
 * @param {string} [systemKey] - If this plugin is to be added to Scene.Systems, this is the property key for it.
 * @param {string} [sceneKey] - If this plugin is to be added to the Scene, this is the property key for it.
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var ScenePluginFile = new Class({

    Extends: File,

    initialize:

    function ScenePluginFile (loader, key, url, systemKey, sceneKey, xhrSettings)
    {
        var extension = 'js';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
            systemKey = GetFastValue(config, 'systemKey');
            sceneKey = GetFastValue(config, 'sceneKey');
        }

        var fileConfig = {
            type: 'scenePlugin',
            cache: false,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            xhrSettings: xhrSettings,
            config: {
                systemKey: systemKey,
                sceneKey: sceneKey
            }
        };

        File.call(this, loader, fileConfig);

        // If the url variable refers to a class, add the plugin directly
        if (typeof url === 'function')
        {
            this.data = url;

            this.state = CONST.FILE_POPULATED;
        }
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.ScenePluginFile#onProcess
     * @since 3.8.0
     */
    onProcess: function ()
    {
        var pluginManager = this.loader.systems.plugins;
        var config = this.config;

        var key = this.key;
        var systemKey = GetFastValue(config, 'systemKey', key);
        var sceneKey = GetFastValue(config, 'sceneKey', key);

        if (this.state === CONST.FILE_POPULATED)
        {
            pluginManager.installScenePlugin(systemKey, this.data, sceneKey, this.loader.scene);
        }
        else
        {
            //  Plugin added via a js file
            this.state = CONST.FILE_PROCESSING;

            this.data = document.createElement('script');
            this.data.language = 'javascript';
            this.data.type = 'text/javascript';
            this.data.defer = false;
            this.data.text = this.xhrLoader.responseText;

            document.head.appendChild(this.data);

            pluginManager.installScenePlugin(systemKey, window[this.key], sceneKey, this.loader.scene);
        }

        this.onProcessComplete();
    }

});

/**
 * Adds a Scene Plugin Script file, or array of plugin files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.scenePlugin('ModPlayer', 'plugins/ModPlayer.js', 'modPlayer', 'mods');
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
 * this.load.scenePlugin({
 *     key: 'modplayer',
 *     url: 'plugins/ModPlayer.js'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.ScenePluginFileConfig` for more details.
 *
 * Once the file has finished loading it will automatically be converted into a script element
 * via `document.createElement('script')`. It will have its language set to JavaScript, `defer` set to
 * false and then the resulting element will be appended to `document.head`. Any code then in the
 * script will be executed. It will then be passed to the Phaser PluginCache.register method.
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
 * @method Phaser.Loader.LoaderPlugin#scenePlugin
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.8.0
 *
 * @param {(string|Phaser.Loader.FileTypes.ScenePluginFileConfig|Phaser.Loader.FileTypes.ScenePluginFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {(string|function)} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js". Or, set to a plugin function.
 * @param {string} [systemKey] - If this plugin is to be added to Scene.Systems, this is the property key for it.
 * @param {string} [sceneKey] - If this plugin is to be added to the Scene, this is the property key for it.
 * @param {XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('scenePlugin', function (key, url, systemKey, sceneKey, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new ScenePluginFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new ScenePluginFile(this, key, url, systemKey, sceneKey, xhrSettings));
    }

    return this;
});

module.exports = ScenePluginFile;
