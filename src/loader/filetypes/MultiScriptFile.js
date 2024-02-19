/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var MultiFile = require('../MultiFile.js');
var ScriptFile = require('./ScriptFile.js');

/**
 * @classdesc
 * A Multi Script File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#scripts method and are not typically created directly.
 *
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#scripts.
 *
 * @class MultiScriptFile
 * @extends Phaser.Loader.MultiFile
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.17.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.MultiScriptFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string[]} [url] - An array of absolute or relative URLs to load the script files from. They are processed in the order given in the array.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object for the script files. Used in replacement of the Loaders default XHR Settings.
 */
var MultiScriptFile = new Class({

    Extends: MultiFile,

    initialize:

    function MultiScriptFile (loader, key, url, xhrSettings)
    {
        var extension = 'js';
        var files = [];

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }

        if (!Array.isArray(url))
        {
            url = [ url ];
        }

        for (var i = 0; i < url.length; i++)
        {
            var scriptFile = new ScriptFile(loader, {
                key: key + '_' + i.toString(),
                url: url[i],
                extension: extension,
                xhrSettings: xhrSettings
            });

            //  Override the default onProcess function
            scriptFile.onProcess = function ()
            {
                this.onProcessComplete();
            };

            files.push(scriptFile);
        }

        MultiFile.call(this, loader, 'scripts', key, files);
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.MultiScriptFile#addToCache
     * @since 3.17.0
     */
    addToCache: function ()
    {
        if (this.isReadyToProcess())
        {
            for (var i = 0; i < this.files.length; i++)
            {
                var file = this.files[i];

                file.data = document.createElement('script');
                file.data.language = 'javascript';
                file.data.type = 'text/javascript';
                file.data.defer = false;
                file.data.text = file.xhrLoader.responseText;

                document.head.appendChild(file.data);
            }

            this.complete = true;
        }
    }

});

/**
 * Adds an array of Script files to the current load queue.
 *
 * The difference between this and the `ScriptFile` file type is that you give an array of scripts to this method,
 * and the scripts are then processed _exactly_ in that order. This allows you to load a bunch of scripts that
 * may have dependencies on each other without worrying about the async nature of traditional script loading.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 *
 * ```javascript
 * function preload ()
 * {
 *     this.load.scripts('PostProcess', [
 *         'libs/shaders/CopyShader.js',
 *         'libs/postprocessing/EffectComposer.js',
 *         'libs/postprocessing/RenderPass.js',
 *         'libs/postprocessing/MaskPass.js',
 *         'libs/postprocessing/ShaderPass.js',
 *         'libs/postprocessing/AfterimagePass.js'
 *    ]);
 * }
 * ```
 *
 * In the code above the script files will all be loaded in parallel but only processed (i.e. invoked) in the exact
 * order given in the array.
 *
 * The files are **not** loaded right away. They are added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the files are queued
 * it means you cannot use the files immediately after calling this method, but must wait for the files to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 *
 * The key must be a unique String and not already in-use by another file in the Loader.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 *
 * ```javascript
 * this.load.scripts({
 *     key: 'PostProcess',
 *     url: [
 *         'libs/shaders/CopyShader.js',
 *         'libs/postprocessing/EffectComposer.js',
 *         'libs/postprocessing/RenderPass.js',
 *         'libs/postprocessing/MaskPass.js',
 *         'libs/postprocessing/ShaderPass.js',
 *         'libs/postprocessing/AfterimagePass.js'
 *        ]
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.MultiScriptFileConfig` for more details.
 *
 * Once all the files have finished loading they will automatically be converted into a script element
 * via `document.createElement('script')`. They will have their language set to JavaScript, `defer` set to
 * false and then the resulting element will be appended to `document.head`. Any code then in the
 * script will be executed. This is done in the exact order the files are specified in the url array.
 *
 * The URLs can be relative or absolute. If the URLs are relative the `Loader.baseURL` and `Loader.path` values will be prepended to them.
 *
 * Note: The ability to load this type of file will only be available if the MultiScript File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#scripts
 * @fires Phaser.Loader.Events#ADD
 * @since 3.17.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.MultiScriptFileConfig|Phaser.Types.Loader.FileTypes.MultiScriptFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string[]} [url] - An array of absolute or relative URLs to load the script files from. They are processed in the order given in the array.
 * @param {string} [extension='js'] - The default file extension to use if no url is provided.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for these files.
 *
 * @return {this} The Loader instance.
 */
FileTypesManager.register('scripts', function (key, url, xhrSettings)
{
    var multifile;

    //  Supports an Object file definition in the key argument
    //  Or an array of objects in the key argument
    //  Or a single entry where all arguments have been defined

    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            multifile = new MultiScriptFile(this, key[i]);

            this.addFile(multifile.files);
        }
    }
    else
    {
        multifile = new MultiScriptFile(this, key, url, xhrSettings);

        this.addFile(multifile.files);
    }

    return this;
});

module.exports = MultiScriptFile;
