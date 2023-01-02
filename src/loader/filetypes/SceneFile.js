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
 * An external Scene JavaScript File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#sceneFile method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#sceneFile.
 *
 * @class SceneFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.16.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.SceneFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var SceneFile = new Class({

    Extends: File,

    initialize:

    function SceneFile (loader, key, url, xhrSettings)
    {
        var extension = 'js';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        var fileConfig = {
            type: 'text',
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
     * @method Phaser.Loader.FileTypes.SceneFile#onProcess
     * @since 3.16.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onProcessComplete();
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.SceneFile#addToCache
     * @since 3.16.0
     */
    addToCache: function ()
    {
        var code = this.data.concat('(function(){\n' + 'return new ' + this.key + '();\n' + '}).call(this);');

        //  Stops rollup from freaking out during build
        var eval2 = eval;

        this.loader.sceneManager.add(this.key, eval2(code));

        this.complete = true;
    }

});

/**
 * Adds an external Scene file, or array of Scene files, to the current load queue.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.sceneFile('Level1', 'src/Level1.js');
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
 * The key must be a unique String. It is used to add the file to the global Scene Manager upon a successful load.
 *
 * For a Scene File it's vitally important that the key matches the class name in the JavaScript file.
 *
 * For example here is the source file:
 *
 * ```javascript
 * class ExternalScene extends Phaser.Scene {
 *
 *     constructor ()
 *     {
 *         super('myScene');
 *     }
 *
 * }
 * ```
 *
 * Because the class is called `ExternalScene` that is the exact same key you must use when loading it:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.sceneFile('ExternalScene', 'src/yourScene.js');
 * }
 * ```
 *
 * The key that is used within the Scene Manager can either be set to the same, or you can override it in the Scene
 * constructor, as we've done in the example above, where the Scene key was changed to `myScene`.
 *
 * The key should be unique both in terms of files being loaded and Scenes already present in the Scene Manager.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Scene Manager first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.sceneFile({
 *     key: 'Level1',
 *     url: 'src/Level1.js'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.SceneFileConfig` for more details.
 *
 * Once the file has finished loading it will be added to the Scene Manager.
 *
 * ```javascript
 * this.load.sceneFile('Level1', 'src/Level1.js');
 * // and later in your game ...
 * this.scene.start('Level1');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `WORLD1.` and the key was `Story` the final key will be `WORLD1.Story` and
 * this is what you would use to retrieve the text from the Scene Manager.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "story"
 * and no URL is given then the Loader will set the URL to be "story.js". It will always add `.js` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the Scene File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#sceneFile
 * @fires Phaser.Loader.LoaderPlugin#ADD
 * @since 3.16.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.SceneFileConfig|Phaser.Types.Loader.FileTypes.SceneFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.js`, i.e. if `key` was "alien" then the URL will be "alien.js".
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('sceneFile', function (key, url, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new SceneFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new SceneFile(this, key, url, xhrSettings));
    }

    return this;
});

module.exports = SceneFile;
