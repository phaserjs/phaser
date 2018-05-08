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
 * @typedef {object} Phaser.Loader.FileTypes.GLSLFileConfig
 *
 * @property {string} key - The key of the file. Must be unique within both the Loader and the Text Cache.
 * @property {string} [url] - The absolute or relative URL to load the file from.
 * @property {string} [extension='glsl'] - The default file extension to use if no url is provided.
 * @property {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */

/**
 * @classdesc
 * A single GLSL File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#glsl method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#glsl.
 *
 * @class GLSLFile
 * @extends Phaser.Loader.File
 * @memberOf Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Loader.FileTypes.TextFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var GLSLFile = new Class({

    Extends: File,

    initialize:

    function GLSLFile (loader, key, url, xhrSettings)
    {
        var extension = 'glsl';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'glsl',
            cache: loader.cacheManager.shader,
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
     * @method Phaser.Loader.FileTypes.GLSLFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onProcessComplete();
    }

});

/**
 * Adds a GLSL file, or array of GLSL files, to the current load queue.
 * In Phaser 3 GLSL files are just plain Text files at the current moment in time.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.glsl('plasma', 'shaders/Plasma.glsl');
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
 * The key must be a unique String. It is used to add the file to the global Shader Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Shader Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Shader Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.glsl({
 *     key: 'plasma',
 *     url: 'shaders/Plasma.glsl'
 * });
 * ```
 *
 * See the documentation for `Phaser.Loader.FileTypes.GLSLFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 * 
 * ```javascript
 * this.load.glsl('plasma', 'shaders/Plasma.glsl');
 * // and later in your game ...
 * var data = this.cache.shader.get('plasma');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `FX.` and the key was `Plasma` the final key will be `FX.Plasma` and
 * this is what you would use to retrieve the text from the Shader Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "plasma"
 * and no URL is given then the Loader will set the URL to be "plasma.glsl". It will always add `.glsl` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the GLSL File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#glsl
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Loader.FileTypes.GLSLFileConfig|Phaser.Loader.FileTypes.GLSLFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.glsl`, i.e. if `key` was "alien" then the URL will be "alien.glsl".
 * @param {XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('glsl', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new GLSLFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new GLSLFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = GLSLFile;
